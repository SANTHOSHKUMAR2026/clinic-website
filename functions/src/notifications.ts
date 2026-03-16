import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

const db = admin.firestore();

// ---------------------------------------------------------------------------
// Configuration & Secrets Setup
// ---------------------------------------------------------------------------
// To set these up in Firebase Functions, run:
// firebase functions:config:set msg91.authkey="YOUR_KEY" msg91.sender_id="SENDER_ID" msg91.whatsapp_number="YOUR_NUMBER"
// ...and so on for the template IDs.
const getMsg91Config = () => {
    return {
        authKey: process.env.MSG91_AUTH_KEY || functions.config().msg91?.authkey || "PLACEHOLDER_AUTH_KEY",
        senderId: process.env.MSG91_SENDER_ID || functions.config().msg91?.sender_id || "CLINIC",
        whatsappNumber: process.env.MSG91_WHATSAPP_NUMBER || functions.config().msg91?.whatsapp_number || "919500492692",
        // Template IDs (Replace with your actual MSG91 Template IDs)
        templates: {
            smsConfirmation: process.env.MSG91_TPL_SMS_CONFIRM || functions.config().msg91?.tpl_sms_confirm || "TPL_SMS_CONFIRM",
            smsReminder: process.env.MSG91_TPL_SMS_REMIN || functions.config().msg91?.tpl_sms_remin || "TPL_SMS_REMIN",
            smsPayment: process.env.MSG91_TPL_SMS_PAYMENT || functions.config().msg91?.tpl_sms_payment || "TPL_SMS_PAYMENT",
            smsDoctor: process.env.MSG91_TPL_SMS_DOCTOR || functions.config().msg91?.tpl_sms_doctor || "TPL_SMS_DOCTOR",
            smsReview: process.env.MSG91_TPL_SMS_REVIEW || functions.config().msg91?.tpl_sms_review || "TPL_SMS_REVIEW",
            waConfirmation: process.env.MSG91_TPL_WA_CONFIRM || functions.config().msg91?.tpl_wa_confirm || "appointment_confirmed",
            // ... add more as needed
        }
    };
};

// ---------------------------------------------------------------------------
// Helper: Send MSG91 SMS
// ---------------------------------------------------------------------------
async function sendSMS(mobile: string, templateId: string, variables: any) {
    const config = getMsg91Config();
    try {
        const response = await axios.post('https://control.msg91.com/api/v5/flow/', {
            template_id: templateId,
            sender: config.senderId,
            mobiles: `91${mobile.replace(/\D/g, '').slice(-10)}`,
            ...variables
        }, {
            headers: {
                "authkey": config.authKey,
                "content-type": "application/json"
            }
        });
        console.log(`SMS Sent to ${mobile}:`, response.data);
        return true;
    } catch (error: any) {
        console.error(`SMS Error for ${mobile}:`, error.response?.data || error.message);
        return false;
    }
}

// ---------------------------------------------------------------------------
// Helper: Send MSG91 WhatsApp
// ---------------------------------------------------------------------------
async function sendWhatsApp(mobile: string, templateName: string, parameters: any[]) {
    const config = getMsg91Config();
    try {
        const response = await axios.post('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', {
            "integrated-number": config.whatsappNumber,
            "content_type": "template",
            "payload": {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": `91${mobile.replace(/\D/g, '').slice(-10)}`,
                "type": "template",
                "template": {
                    "name": templateName,
                    "language": { "code": "en" },
                    "components": [
                        {
                            "type": "body",
                            "parameters": parameters
                        }
                    ]
                }
            }
        }, {
            headers: {
                "authkey": config.authKey,
                "content-type": "application/json"
            }
        });
        console.log(`WhatsApp Sent to ${mobile}:`, response.data);
        return true;
    } catch (error: any) {
        console.error(`WhatsApp Error for ${mobile}:`, error.response?.data || error.message);
        return false;
    }
}

// ---------------------------------------------------------------------------
// 1. Appointment Confirmation & Doctor Notification (Triggered on Create/Update)
// ---------------------------------------------------------------------------
export const onAppointmentStatusChange = functions.region("asia-south1").firestore
    .document("appointments/{appointmentId}")
    .onWrite(async (change: any, context: any) => {
        const after = change.after.data();
        const before = change.before.data();

        if (!after) return null; // Document deleted

        const isNewAndConfirmed = !before && after.status === "Confirmed";
        const isStatusChangedToConfirmed = before && before.status !== "Confirmed" && after.status === "Confirmed";

        if (isNewAndConfirmed || isStatusChangedToConfirmed) {
            const config = getMsg91Config();

            // Fetch notification preferences from settings
            const settingsDoc = await db.collection("settings").doc("clinic").get();
            const settings = settingsDoc.data();
            const smsEnabled = settings?.notifications?.smsEnabled !== false;
            const whatsappEnabled = settings?.notifications?.whatsappEnabled !== false;

            // Patient Notification
            console.log(`Processing confirmation for: ${after.patientName}`);

            // SMS
            if (smsEnabled) {
                await sendSMS(after.patientMobile, config.templates.smsConfirmation, {
                    var1: after.patientName,
                    var2: after.appointmentDate,
                    var3: after.appointmentTime
                });
            }

            // WhatsApp
            if (whatsappEnabled) {
                await sendWhatsApp(after.patientMobile, config.templates.waConfirmation, [
                    { "type": "text", "text": after.patientName },
                    { "type": "text", "text": after.appointmentDate },
                    { "type": "text", "text": after.appointmentTime }
                ]);
            }

            // Doctor Notification
            const DOCTOR_MOBILE = "9488857759"; // From your footer
            if (smsEnabled) {
                await sendSMS(DOCTOR_MOBILE, config.templates.smsDoctor, {
                    var1: "Dr. Sivaraman",
                    var2: after.patientName,
                    var3: after.appointmentTime,
                    var4: after.reasonForVisit
                });
            }
        }
        return null;
    });

// ---------------------------------------------------------------------------
// 2. Appointment Reminder (Scheduled Cron Job - Runs daily at 6 PM IST)
// ---------------------------------------------------------------------------
// Schedule format: 6 PM IST = 12:30 PM UTC
export const sendAppointmentReminders = functions.region("asia-south1").pubsub
    .schedule("30 12 * * *")
    .timeZone("Asia/Kolkata")
    .onRun(async (context: any) => {
        const config = getMsg91Config();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];

        console.log(`Running reminders for appointments on: ${dateString}`);

        const settingsDoc = await db.collection("settings").doc("clinic").get();
        const settings = settingsDoc.data();
        if (settings?.notifications?.smsEnabled === false) {
            console.log("Reminders disabled in settings.");
            return null;
        }

        const snapshot = await db.collection("appointments")
            .where("appointmentDate", "==", dateString)
            .where("status", "==", "Confirmed")
            .get();

        if (snapshot.empty) {
            console.log("No appointments found for tomorrow.");
            return null;
        }

        const promises: Promise<any>[] = [];

        snapshot.forEach((doc: any) => {
            const app = doc.data();
            console.log(`Scheduling reminder for: ${app.patientName}`);

            // Queue SMS
            promises.push(sendSMS(app.patientMobile, config.templates.smsReminder, {
                var1: app.patientName,
                var2: app.appointmentTime
            }));
        });

        await Promise.all(promises);
        console.log(`Sent ${snapshot.size} reminders.`);
        return null;
    });

// ---------------------------------------------------------------------------
// 3. Google Review Request (Scheduled Cron Job - Runs daily at 8 PM IST)
// ---------------------------------------------------------------------------
export const sendReviewRequests = functions.region("asia-south1").pubsub
    .schedule("30 14 * * *")
    .timeZone("Asia/Kolkata")
    .onRun(async (context: any) => {
        const config = getMsg91Config();
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];

        const settingsDoc = await db.collection("settings").doc("clinic").get();
        const settings = settingsDoc.data();
        const reviewLink = settings?.googleReviewLink || "https://g.page/r/your-google-review-link";

        if (settings?.notifications?.smsEnabled === false) {
            console.log("Review requests disabled in settings.");
            return null;
        }

        // Send review request for today's completed appointments
        const snapshot = await db.collection("appointments")
            .where("appointmentDate", "==", dateString)
            .where("status", "==", "Confirmed") 
            .get();

        if (snapshot.empty) return null;

        const promises: Promise<any>[] = [];

        snapshot.forEach((doc: any) => {
            const app = doc.data();
            promises.push(sendSMS(app.patientMobile, config.templates.smsReview, {
                var1: app.patientName,
                var2: reviewLink
            }));
        });

        await Promise.all(promises);
        return null;
    });
