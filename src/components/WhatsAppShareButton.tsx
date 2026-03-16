import { MessageCircle } from 'lucide-react';

interface WhatsAppShareButtonProps {
    appointment: {
        patientName: string;
        appointmentDate: string;
        appointmentTime: string;
        tokenNumber?: number;
    };
    clinicName?: string;
    clinicLocation?: string;
}

export function WhatsAppShareButton({ 
    appointment,
    clinicName = "Dr V Sivaraman Skin Clinic",
    clinicLocation = "Pondicherry"
}: WhatsAppShareButtonProps) {

    const handleShare = () => {
        const message = `*Appointment Confirmed* ✅
        
🏥 Clinic: ${clinicName}
🧑‍⚕️ Patient: ${appointment.patientName}
📅 Date: ${appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('en-GB') : "N/A"}
⏰ Time: ${appointment.appointmentTime}
🏷️ Token: ${appointment.tokenNumber || "N/A"}
📍 Location: ${clinicLocation}

Please arrive 10 minutes prior to your time. Help us serve you better!`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/?text=${encodedMessage}`;
        
        window.open(waUrl, '_blank');
    };

    return (
        <button 
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
        >
            <MessageCircle className="w-5 h-5" />
            <span>Share via WhatsApp</span>
        </button>
    );
}
