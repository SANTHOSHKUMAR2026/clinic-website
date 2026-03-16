import { forwardRef } from "react";
import { User, Calendar, Clock, MapPin, CheckCircle2, IndianRupee, Tag } from "lucide-react";

interface AppointmentCardProps {
    appointment: {
        patientName: string;
        appointmentDate: string;
        appointmentTime: string;
        tokenNumber?: number;
        tokenId?: string;
        amount?: number;
        paymentId?: string;
    };
    doctorName?: string;
    clinicName?: string;
    clinicAddress?: string;
}

export const AppointmentCard = forwardRef<HTMLDivElement, AppointmentCardProps>(({ 
    appointment, 
    doctorName = "Dr V Sivaraman MD", 
    clinicName = "Skin & VD Specialist Clinic",
    clinicAddress = "Puducherry, India"
}, ref) => {
    return (
        <div ref={ref} className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-md w-full mx-auto font-sans relative">
            
            {/* Header / Brand */}
            <div className="bg-[var(--color-primary)] text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 opacity-20 rounded-full -ml-8 -mb-8 blur-xl"></div>
                
                <div className="relative z-10">
                    <h2 className="text-xl font-bold tracking-tight">{clinicName}</h2>
                    <p className="text-blue-100 text-sm font-medium opacity-90">{doctorName}</p>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
                
                {/* Status Badge & Token */}
                <div className="flex justify-between items-start">
                    <div className="inline-flex items-center space-x-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmed</span>
                    </div>
                    
                    {appointment.tokenNumber && (
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Token No.</p>
                            <div className="bg-blue-50 text-[var(--color-primary)] font-black text-2xl h-12 w-12 rounded-xl flex items-center justify-center border-2 border-blue-100 shadow-inner">
                                {appointment.tokenNumber}
                            </div>
                        </div>
                    )}
                </div>

                {/* Patient Info */}
                <div className="pt-2 border-t border-dashed border-slate-200">
                    <div className="flex items-center space-x-3 text-slate-700">
                        <User className="h-5 w-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Patient Details</p>
                            <p className="font-bold text-lg text-slate-900">{appointment.patientName}</p>
                        </div>
                    </div>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-start space-x-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Date</p>
                            <p className="font-semibold text-slate-900 text-sm">
                                {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('en-GB') : "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Time</p>
                            <p className="font-semibold text-slate-900 text-sm">{appointment.appointmentTime}</p>
                        </div>
                    </div>
                </div>

                {/* Payment & Ref Info */}
                <div className="space-y-3 pt-4 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2 text-slate-600">
                            <IndianRupee className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">Fee Paid</span>
                        </div>
                        <span className="font-bold text-slate-900">₹{appointment.amount || 1000}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2 text-slate-600">
                            <Tag className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">Appt ID</span>
                        </div>
                        <span className="font-mono text-xs text-slate-500 font-semibold">{appointment.tokenId || "N/A"}</span>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold text-center border border-red-100">
                    Please arrive 10 minutes prior to your time. Help us serve you better!
                </div>

            </div>

            {/* Footer / Location */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    <span className="font-bold text-slate-800 block mb-0.5">Location</span>
                    {clinicAddress}
                </p>
            </div>
            
        </div>
    );
});

AppointmentCard.displayName = "AppointmentCard";
