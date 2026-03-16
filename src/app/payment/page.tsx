"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db, functions } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { CheckCircle2, Loader2, IndianRupee, Printer } from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        Razorpay: any;
    }
}

function PaymentContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [appointment, setAppointment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [docId, setDocId] = useState("");

    useEffect(() => {
        let unsubscribe: any;

        const fetchAppointment = async () => {
            if (!token) {
                setError("No payment token provided.");
                setIsLoading(false);
                return;
            }

            if (!db) {
                setError("Firebase DB not initialized.");
                setIsLoading(false);
                return;
            }

            try {
                const q = query(collection(db, "appointments"), where("tokenId", "==", token));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("Invalid token or appointment not found.");
                    setIsLoading(false);
                } else {
                    const docSnap = querySnapshot.docs[0];
                    setAppointment(docSnap.data());
                    setDocId(docSnap.id);

                    if (docSnap.data().paymentStatus === "Paid") {
                        setIsSuccess(true);
                        setIsLoading(false);
                    } else {
                        // Real-time listener for payment confirmation (from webhook)
                        unsubscribe = onSnapshot(doc(db, "appointments", docSnap.id), (updatedDoc) => {
                            const data = updatedDoc.data();
                            if (data?.paymentStatus === "Paid") {
                                setIsSuccess(true);
                                setAppointment(data);
                            }
                        });
                        setIsLoading(false);
                    }
                }
            } catch (err) {
                console.error("Error fetching appointment:", err);
                setError("Could not load appointment details.");
                setIsLoading(false);
            }
        };

        fetchAppointment();
        return () => unsubscribe && unsubscribe();
    }, [token]);

    const handlePayment = async () => {
        if (!functions) {
            alert("Firebase Functions not initialized. Check your configuration.");
            return;
        }

        setIsProcessing(true);
        try {
            // 1. Create Order via Cloud Function
            const createOrder = httpsCallable(functions, 'createRazorpayOrder');
            const response: any = await createOrder({
                appointmentId: docId,
                amount: appointment.amount || 1000
            });

            const { id: order_id, amount, currency } = response.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY",
                amount: amount,
                currency: currency,
                name: "Dr Sivaraman Clinic",
                description: "Consultation Fee",
                order_id: order_id,
                prefill: {
                    name: appointment.patientName,
                    email: appointment.patientEmail,
                    contact: appointment.patientMobile,
                },
                theme: {
                    color: "#2563eb",
                },
                handler: function (response: any) {
                    // Payment successful on client side. 
                    // The webhook will handle updating the Firestore.
                    // We just wait for the onSnapshot to trigger isSuccess.
                    setIsProcessing(true); // Keep processing until Firestore updates
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err: any) {
            console.error("Payment initiation failed", err);
            alert("Failed to initiate payment: " + (err.message || "Unknown error"));
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin mb-4" />
                <p className="text-slate-600">Loading payment details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl inline-block max-w-md border border-red-200">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <Link href="/online-appointment" className="inline-block mt-4 underline hover:text-red-800">
                        Return to Booking
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center py-12 animate-in zoom-in duration-500 max-w-2xl mx-auto px-4">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Your appointment has been confirmed. You will receive an SMS and email shortly.
                </p>

                <div className="bg-white rounded-2xl p-6 md:p-8 text-left border border-slate-200 shadow-lg mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-green-100 text-green-800 font-bold rounded-bl-2xl">
                        CONFIRMED
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 border-b pb-4 mb-6">Appointment Receipt</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Patient Name</p>
                            <p className="font-bold text-slate-900">{appointment?.patientName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                            <p className="font-bold text-slate-900">{appointment?.patientMobile}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Date</p>
                            <p className="font-bold text-slate-900">{appointment?.appointmentDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Time</p>
                            <p className="font-bold text-[var(--color-primary)]">{appointment?.appointmentTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Token No.</p>
                            <p className="font-bold text-[var(--color-primary)] bg-blue-50 px-3 py-1 rounded inline-block border border-blue-100">#{appointment?.tokenNumber || "-"}</p>
                            {appointment?.tokenId && <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {appointment.tokenId}</p>}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dashed border-slate-300 flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Amount Paid</span>
                        <span className="font-bold text-xl flex items-center text-slate-900">
                            <IndianRupee className="h-5 w-5 mr-1" /> {appointment?.amount || 1000}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={() => window.print()} className="bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center">
                        <Printer className="mr-2 h-5 w-5" /> Print Receipt
                    </button>
                    <Link href="/" className="bg-[var(--color-primary)] hover:opacity-90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center justify-center">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Complete Payment</h1>
            <p className="text-center text-gray-600 mb-8">Please complete your payment to confirm the appointment.</p>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 mb-8">
                <div className="mb-6 space-y-4">
                    <div className="flex justify-between border-b pb-4">
                        <span className="text-slate-600">Patient</span>
                        <span className="font-semibold text-slate-900">{appointment?.patientName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                        <span className="text-slate-600">Date & Time</span>
                        <span className="font-semibold text-[var(--color-primary)]">
                            {appointment?.appointmentDate} at {appointment?.appointmentTime}
                        </span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span className="text-slate-600 text-lg">Total Amount</span>
                        <span className="font-bold text-xl text-slate-900 flex items-center">
                            <IndianRupee className="h-5 w-5 mr-1" /> {appointment?.amount || 1000}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Processing Mock Payment...</>
                    ) : (
                        "Pay Fast (Mock Test)"
                    )}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">This is a simulated payment gateway for testing purposes.</p>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin mb-4" />
                    <p className="text-slate-600">Loading payment details...</p>
                </div>
            }>
                <PaymentContent />
            </Suspense>
        </div>
    );
}
