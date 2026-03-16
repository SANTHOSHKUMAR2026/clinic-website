import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

const Razorpay = require("razorpay");

admin.initializeApp();
const db = admin.firestore();

// 1. Razorpay Integration (Create Order)
export const createRazorpayOrder = functions.region("asia-south1").https.onCall(async (data: any, context: any) => {
    // Ensure user is authenticated (if required) or skip for public booking

    const { appointmentId, amount } = data; // Amount in INR

    if (!appointmentId || !amount) {
        throw new functions.https.HttpsError("invalid-argument", "Missing appointmentId or amount");
    }

    // Initialize Razorpay
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || functions.config().razorpay.key_id,
        key_secret: process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay.key_secret,
    });

    try {
        const options = {
            amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 1000 * 100
            currency: "INR",
            receipt: `receipt_${appointmentId}`,
        };

        const order = await instance.orders.create(options);

        // Save order details to Firestore
        await db.collection("payments").doc(order.id).set({
            appointmentId,
            amount,
            status: "Created",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        };
    } catch (error: any) {
        console.error("Razorpay Error:", error);
        throw new functions.https.HttpsError("internal", "Unable to create Razorpay order");
    }
});

// 2. Razorpay Webhook (Verify Signature & Update DB)
export const verifyRazorpayPayment = functions.region("asia-south1").https.onRequest(async (req: any, res: any) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || functions.config().razorpay?.webhook_secret;

    const signature = req.headers["x-razorpay-signature"] as string;
    const body = req.rawBody;

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === signature) {
        // Payment verified
        const payload = req.body;

        if (payload.event === "payment.captured") {
            const paymentData = payload.payload.payment.entity;
            const orderId = paymentData.order_id;

            // Update Firestore Payment Record
            await db.collection("payments").doc(orderId).update({
                status: "Success",
                transactionId: paymentData.id,
                method: paymentData.method,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Fetch the payment doc to get Appointment ID
            const paymentDoc = await db.collection("payments").doc(orderId).get();
            const appointmentId = paymentDoc.data()?.appointmentId;

            if (appointmentId) {
                // Mark appointment as Confirmed to trigger onAppointmentStatusChange cloud function
                await db.collection("appointments").doc(appointmentId).update({
                    paymentStatus: "Paid",
                    status: "Confirmed"
                });
            }
        }

        res.status(200).send("OK");
    } else {
        res.status(400).send("Invalid Signature");
    }
});

// Export all notification functions
export * from "./notifications";
