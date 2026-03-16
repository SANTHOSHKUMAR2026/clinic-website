//"use client";
'use client'; //newly added to fix git error
export const dynamic = "force-dynamic"; //newly added to fix git error

import { Suspense } from "react"; //newly added to fix git error

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AppointmentCard } from "@/components/AppointmentCard";
import { DownloadImageButton } from "@/components/DownloadImageButton";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";

/* other imports */

function ConfirmationContent() {
    const params = useSearchParams();
    const token = params.get("token"); // This is now the tokenId (e.g. APT-123456)
    const cardRef = useRef<HTMLDivElement>(null);

    const [appointment, setAppointment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!token || !db) {
                setIsLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, "appointments"),
                    where("tokenId", "==", token)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setAppointment(querySnapshot.docs[0].data());
                }
            } catch (error) {
                console.error("Error fetching appointment:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointment();
    }, [token]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Fetching appointment details...</p>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Appointment Not Found</h1>
                    <p className="text-slate-500 mb-6">We couldn't locate an appointment with this token. Please check your token ID or contact the clinic.</p>
                    <Link href="/online-appointment" className="inline-flex items-center text-[var(--color-primary)] font-bold hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Booking
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Booking Successful!</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">Your appointment has been confirmed. You can download your pass, save it to your calendar, or share it on WhatsApp.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                    {/* The Card View */}
                    <div className="flex justify-center w-full">
                        <AppointmentCard appointment={appointment} ref={cardRef} />
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Available Actions</h3>

                        <div className="flex flex-col space-y-4">
                            <DownloadImageButton targetRef={cardRef} filename={`Pass-${appointment.tokenId}.png`} />

                            <AddToCalendarButton appointment={appointment} />

                            <WhatsAppShareButton appointment={appointment} />
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-sm text-slate-500 mb-4">Need to review your booking later?</p>
                            <Link
                                href="/check-appointment"
                                className="text-[var(--color-primary)] font-bold hover:underline"
                            >
                                Check your appointment status here
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}



export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Loading...</p>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}