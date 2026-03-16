"use client";

import { useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { PhoneLookupForm } from "@/components/PhoneLookupForm";
import { AppointmentCard } from "@/components/AppointmentCard";
import { DownloadImageButton } from "@/components/DownloadImageButton";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import { CalendarSearch } from "lucide-react";

// Sub-component to manage its own ref for the image downloader
function AppointmentResultRow({ appt }: { appt: any }) {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left side: The Card itself */}
            <div className="flex justify-center w-full">
                <AppointmentCard 
                    appointment={appt} 
                    ref={cardRef} 
                />
            </div>

            {/* Right side: Actions */}
            <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full flex flex-col justify-center space-y-4">
                    <h4 className="font-bold text-slate-800 text-center mb-2">Card Actions</h4>
                    
                    <DownloadImageButton 
                        targetRef={cardRef} 
                        filename={`Pass-${appt.tokenId}.png`} 
                    />
                    
                    <AddToCalendarButton appointment={appt} />
                    
                    <WhatsAppShareButton appointment={appt} />
                </div>
            </div>
        </div>
    );
}

export default function CheckAppointmentPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (phone: string) => {
        setIsLoading(true);
        setHasSearched(true);
        setAppointments([]);
        
        try {
            if (!db) return;
            // Note: In Firestore, queries with orderBy and inequality/where usually require a composite index,
            // but for a simple equality + orderBy on different fields, it might require one.
            // If it fails with a "requires index" error in console, we'll fetch and sort client side.
            const q = query(
                collection(db, "appointments"),
                where("patientMobile", "==", phone)
            );
            const querySnapshot = await getDocs(q);
            
            const results: any[] = [];
            querySnapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });

            // Fallback client-side sort if it wasn't constrained by index
            results.sort((a, b) => {
                if (a.appointmentDate === b.appointmentDate) {
                    return b.appointmentTime.localeCompare(a.appointmentTime);
                }
                return b.appointmentDate.localeCompare(a.appointmentDate);
            });

            setAppointments(results);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            alert("An error occurred while fetching your appointments.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="bg-blue-100 text-[var(--color-primary)] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CalendarSearch className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Retrieve Appointment</h1>
                    <p className="text-slate-600 max-w-lg mx-auto">Enter your registered mobile number below to access your upcoming and past consultation passes.</p>
                </div>

                {/* Search Form */}
                <PhoneLookupForm onSearch={handleSearch} isLoading={isLoading} />

                {/* Results Section */}
                {hasSearched && !isLoading && (
                    <div className="pt-8 border-t border-slate-200">
                        {appointments.length === 0 ? (
                            <div className="text-center bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Appointments Found</h3>
                                <p className="text-slate-500">We couldn't find any bookings linked to this mobile number.</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <h2 className="text-2xl font-bold text-slate-900 text-center">Your Bookings</h2>
                                
                                <div className="space-y-16">
                                    {appointments.map((appt) => (
                                        <AppointmentResultRow key={appt.id} appt={appt} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
