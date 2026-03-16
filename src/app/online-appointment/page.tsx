"use client";

import Link from "next/link";
//import { query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, User, FileText, Upload, Info, IndianRupee, Loader2 } from "lucide-react";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
declare global {
    interface Window {
        Razorpay: any;
    }
} //THIS IS THE GLOBAL WINDOW OBJECT- NEW ADDED

export default function OnlineAppointmentPage() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        mobile: "",
        email: "",
        address: "",
        reason: "",
        otherReason: "",
        previousVisit: "No"
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [isProcessingBooking, setIsProcessingBooking] = useState(false);
    const router = useRouter();

    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!db) return;
            const docRef = doc(db, "settings", "clinic");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []); // Load Razorpay script once on client-side - NEW ADDED

    // Dummy dates
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!selectedDate) {
                setBookedSlots([]);
                setTimeSlots([]);
                return;
            }

            // --- Generate Time Slots Based on Working Hours ---
            const dateObj = new Date(selectedDate);
            const dayOfWeek = dateObj.getDay(); // 0 is Sun, 1 is Mon...

            let startStr = "16:00";
            let endStr = "20:00";

            if (settings?.workingHours) {
                if ([1, 4, 6].includes(dayOfWeek)) {
                    startStr = settings.workingHours.monThuSat.start;
                    endStr = settings.workingHours.monThuSat.end;
                } else {
                    startStr = settings.workingHours.others.start;
                    endStr = settings.workingHours.others.end;
                }
            } else {
                // Mon(1), Thu(4), Sat(6) => 2:00 PM to 8:00 PM
                if ([1, 4, 6].includes(dayOfWeek)) {
                    startStr = "14:00";
                }
            }

            const startHour = parseInt(startStr.split(':')[0]);
            const endHour = parseInt(endStr.split(':')[0]);

            const generatedSlots: string[] = [];
            for (let hour = startHour; hour < endHour; hour++) {
                for (let min = 0; min < 60; min += 10) {
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                    const displayMin = min === 0 ? '00' : (min < 10 ? `0${min}` : min);
                    generatedSlots.push(`${displayHour}:${displayMin} ${ampm}`);
                }
            }
            setTimeSlots(generatedSlots);
            // --------------------------------------------------

            if (!db) {
                console.warn("Firebase DB not initialized.");
                return;
            }

            try {
                const q = query(
                    collection(db, "appointments"),
                    where("appointmentDate", "==", selectedDate)
                );
                const querySnapshot = await getDocs(q);
                const slots: string[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.status !== "Cancelled") {
                        slots.push(data.appointmentTime);
                    }
                });
                setBookedSlots(slots);
            } catch (error) {
                console.error("Error fetching slots:", error);
            }
        };
        fetchBookedSlots();
        setSelectedTime(null); // Reset time when date changes
    }, [selectedDate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!selectedDate || !selectedTime)) {
            alert("Please select a date and time to continue.");
            return;
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    /*   ////OLD FUNCTION SUBMIT I REPLACED THIS WITH NEW   
       const handleSubmit = async () => {
           if (!formData.name || !formData.age || !formData.gender || !formData.mobile || !formData.email || !formData.reason) {
               alert("Please fill in all required fields.");
               return;
           }
   
           setIsLoading(true);
           try {
               let imageUrl = "";
               if (imageFile) {
                   const fileRef = ref(storage, `appointments/${Date.now()}_${imageFile.name}`);
                   await uploadBytes(fileRef, imageFile);
                   imageUrl = await getDownloadURL(fileRef);
               }
   
               const tokenId = `APT-${Date.now().toString().slice(-6)}`;
   
               if (!db) {
                   alert("Firebase DB not initialized. Cannot book at this time.");
                   setIsLoading(false);
                   return;
               }
   
               const appointmentData = {
                   tokenId,
                   patientName: formData.name,
                   patientAge: Number(formData.age),
                   patientGender: formData.gender,
                   patientMobile: formData.mobile,
                   patientEmail: formData.email,
                   patientAddress: formData.address,
                   appointmentDate: selectedDate,
                   appointmentTime: selectedTime,
                   reasonForVisit: formData.reason,
                   isPreviousPatient: formData.previousVisit === "Yes",
                   imageUrl,
                   amount: settings?.consultationFee || 1000,
                   status: "Pending Payment",
                   paymentStatus: "Pending",
                   createdAt: Timestamp.now()
               };
   
               await addDoc(collection(db, "appointments"), appointmentData);
   
               // Redirect to payment page
               router.push(`/payment?token=${tokenId}`);
           } catch (error) {
               console.error("Error booking appointment:", error);
               alert("There was an error booking your appointment. Please try again.");
               setIsLoading(false);
           }
       };
   */
    // New function to handle payment and booking
    const handleSubmit = async () => {

        if (!formData.name || !formData.age || !formData.gender || !formData.mobile || !formData.email || !formData.reason || !formData.address) {
            alert("Please fill in all required fields.");
            return;
        }

        if (formData.reason === "OTHER" && !formData.otherReason) {
            alert("Please specify your reason for visit.");
            return;
        }

        setIsLoading(true);

        try {

            const amountInPaise = (settings?.consultationFee || 1000) * 100;

            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountInPaise })
            });

            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "Dr V Sivaraman Skin Clinic",
                description: "Consultation Fee",
                order_id: order.id,

                // Add payment methods upi - new added
                method: {
                    upi: true,
                    card: true,
                    netbanking: true
                },

                handler: async function () {
                    setIsProcessingBooking(true);

                    let imageUrl = "";

                    if (imageFile) {
                        try {
                            const fileRef = ref(storage, `appointments/${Date.now()}_${imageFile.name}`);
                            await uploadBytes(fileRef, imageFile);
                            imageUrl = await getDownloadURL(fileRef);
                        } catch (uploadError) {
                            console.error("Image upload failed, proceeding with booking anyway:", uploadError);
                            imageUrl = "Upload Failed";
                        }
                    }

                    //const tokenId = `APT-${Date.now().toString().slice(-6)}`; // this is removed 
                    //  ADD TOKEN LOGIC HERE
                    const q = query(
                        collection(db, "appointments"),
                        where("appointmentDate", "==", selectedDate)
                    );

                    const snapshot = await getDocs(q);
                    const tokenNumber = snapshot.size + 1;
                    const tokenId = `APT-${Date.now().toString().slice(-6)}`;

                    const appointmentData = {
                        tokenNumber,
                        tokenId,
                        patientName: formData.name,
                        patientAge: Number(formData.age),
                        patientGender: formData.gender,
                        patientMobile: formData.mobile,
                        patientEmail: formData.email,
                        patientAddress: formData.address,
                        appointmentDate: selectedDate,
                        appointmentTime: selectedTime,
                        reasonForVisit: formData.reason === 'OTHER' ? formData.otherReason : formData.reason,
                        isPreviousPatient: formData.previousVisit === "Yes",
                        imageUrl,
                        amount: settings?.consultationFee || 1000,
                        status: "Confirmed",
                        paymentStatus: "Paid",
                        createdAt: Timestamp.now()
                    };

                    /*Auto Slot Locking is a very important hospital-grade feature. It prevents two patients from booking the same time slot simultaneously.
                    Example problem without locking:
                    Patient A selects 4:20 PM
                    Patient B selects 4:20 PM at same time
                    Both click PAY
                    Both appointments get booked */



                    const slotQuery = query(
                        collection(db, "appointments"),
                        where("appointmentDate", "==", selectedDate),
                        where("appointmentTime", "==", selectedTime)
                    );

                    const slotSnapshot = await getDocs(slotQuery);

                    if (!slotSnapshot.empty) {
                        alert("This time slot is already booked. Please choose another time.");
                        return;
                    }


                    await addDoc(collection(db, "appointments"), appointmentData);
                    //new line added for msg91
                    if (settings?.notifications?.smsEnabled !== false) {
                        await fetch("/api/send-sms", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name: formData.name,
                                mobile: formData.mobile,
                                date: selectedDate,
                                time: selectedTime,
                                token: tokenNumber
                            })
                        });
                    }

                    //new line added for Google Sheet logging - auto whatsapp message
                    if (settings?.notifications?.whatsappEnabled !== false) {
                        await fetch("/api/log-appointment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name: formData.name,
                                mobile: formData.mobile,
                                date: selectedDate,
                                time: selectedTime,
                                token: tokenNumber
                            })
                        });
                    }

                    router.push(`/confirmation?token=${tokenId}`);
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            //options.handler();  // Call the handler function to open the payment modal -temp enable //now reversed

        } catch (error) {

            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");

        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative">
            {isProcessingBooking && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="h-16 w-16 text-[var(--color-primary)] animate-spin mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Your Booking</h2>
                    <p className="text-slate-600 font-medium text-center max-w-md px-4">
                        Payment received successfully! We are confirming your appointment. Please do not close or refresh this window...
                    </p>
                </div>
            )}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Book Consultation</h1>
                    <p className="text-gray-600">Schedule your visit with Dr V Sivaraman MD Skin & VD Specialist at your convenience.</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] transition-all duration-300 -z-10" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-4 ${step >= 1 ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                        1
                    </div>
                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-4 ${step >= 2 ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                        2
                    </div>
                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-4 ${step >= 3 ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10 mb-8">

                    {/* STEP 1: TIME SLOT */}
                    {step === 1 && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Select Date & Time</h2>

                            <div className="mb-8">
                                <h3 className="font-semibold text-slate-700 mb-4">Select Date (Next 7 Days)</h3>
                                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {dates.map((date, idx) => {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const dateStr = `${year}-${month}-${day}`;
                                        const isSelected = selectedDate === dateStr;
                                        const isLeaveDate = settings?.leaveDates?.includes(dateStr);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => !isLeaveDate && setSelectedDate(dateStr)}
                                                disabled={isLeaveDate}
                                                className={`flex flex-col items-center justify-center min-w-[80px] p-4 rounded-xl border-2 transition-all ${isLeaveDate
                                                    ? 'border-red-100 bg-red-50 text-red-300 cursor-not-allowed opacity-50'
                                                    : isSelected
                                                        ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className="text-xs font-bold uppercase mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                <span className="text-2xl font-bold">{date.getDate()}</span>
                                                <span className="text-xs uppercase mt-1">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {selectedDate && (
                                <div className="mb-8 animate-in slide-in-from-bottom-4 duration-300">
                                    <h3 className="font-semibold text-slate-700 mb-4">Select Time Slot</h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {timeSlots.map((time, idx) => {
                                            const isBooked = bookedSlots.includes(time);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => !isBooked && setSelectedTime(time)}
                                                    disabled={isBooked}
                                                    className={`py-2 px-1 text-sm rounded-lg font-medium transition-all ${selectedTime === time
                                                        ? 'bg-[var(--color-btn)] text-white shadow-md'
                                                        : isBooked ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end mt-10">
                                <button
                                    onClick={nextStep}
                                    disabled={!selectedDate || !selectedTime}
                                    className="bg-[var(--color-btn)] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold flex items-center transition-colors"
                                >
                                    Continue <ChevronRight className="ml-2 h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PATIENT INFO */}
                    {step === 2 && (
                        <div className="animate-in fade-in duration-500">
                            <div className="bg-blue-50 p-4 rounded-lg mb-8 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900 border-b border-blue-200 pb-1 mb-1">Appointment Selected</p>
                                    <p className="text-blue-900 font-medium">{selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime}</p>
                                </div>
                                <button onClick={prevStep} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">Change</button>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Patient Information</h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="Enter patient name" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
                                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="Years" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" required>
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="10-digit number" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="your@email.com" required />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="Full residential address" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Visit *</label>
                                        <select name="reason" value={formData.reason} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" required>
                                            <option value="">Select Reason</option>
                                            <option value="SKIN">Skin Concern</option>
                                            <option value="HAIR">Hair / Scalp Concern</option>
                                            <option value="NAIL">Nail Concern</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    {formData.reason === 'OTHER' && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Please specify reason *</label>
                                            <input type="text" name="otherReason" value={formData.otherReason} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="Enter custom reason" required />
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Previous Visit to Dr. Sivaraman? *</label>
                                        <div className="flex space-x-6 mt-3">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="previousVisit" value="Yes" checked={formData.previousVisit === "Yes"} onChange={handleInputChange} className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                                <span className="text-slate-700">Yes</span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="previousVisit" value="No" checked={formData.previousVisit === "No"} onChange={handleInputChange} className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                                <span className="text-slate-700">No</span>
                                            </label>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-10 bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-lg text-slate-900 border-b pb-3 mb-4">Payment Summary</h3>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-slate-700">Consultation Fee</span>
                                        <span className="font-bold text-slate-900 flex items-center">
                                            <IndianRupee className="h-5 w-5 mr-1" /> {settings?.consultationFee || 1000}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">* Required to confirm booking. Cancellation allowed up to 2 hours before.</p>
                                </div>

                                <div className="flex justify-between items-center mt-8 gap-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={isLoading}
                                        className="px-6 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center disabled:opacity-50"
                                    >
                                        <ChevronLeft className="mr-2 h-5 w-5" /> Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white px-8 py-3 rounded-lg font-bold flex items-center transition-all shadow-md flex-1 md:flex-none justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                                        ) : (
                                            <>Pay & Confirm <ChevronRight className="ml-2 h-5 w-5" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
