import { Calendar } from 'lucide-react';
import { saveAs } from 'file-saver';
import { format, addMinutes, parse } from 'date-fns';

interface AddToCalendarButtonProps {
    appointment: {
        patientName: string;
        appointmentDate: string; // YYYY-MM-DD
        appointmentTime: string; // e.g., "04:20 PM"
    };
    clinicName?: string;
    clinicAddress?: string;
    doctorName?: string;
}

export function AddToCalendarButton({ 
    appointment,
    clinicName = "Dr V Sivaraman Skin Clinic",
    clinicAddress = "Puducherry, India",
    doctorName = "Dr V Sivaraman"
}: AddToCalendarButtonProps) {

    const handleGenerateICS = () => {
        try {
            // Parse custom time format "04:20 PM" to actual Date object 
            // combined with the appointmentDate
            const dateStr = `${appointment.appointmentDate} ${appointment.appointmentTime}`;
            const startDateTime = parse(dateStr, 'yyyy-MM-dd hh:mm a', new Date());
            
            // Assume 15 minute appointment duration
            const endDateTime = addMinutes(startDateTime, 15);

            // ICS Date Format: YYYYMMDDTHHMMSSZ
            // We'll format to local time representation in ICS, which is YYYYMMDDTHHMMSS without 'Z'
            const formatIcsDate = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");

            const startIcs = formatIcsDate(startDateTime);
            const endIcs = formatIcsDate(endDateTime);
            const timestamp = formatIcsDate(new Date());

            const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTAMP:${timestamp}
DTSTART:${startIcs}
DTEND:${endIcs}
SUMMARY:Dermatology Appointment with ${doctorName}
LOCATION:${clinicAddress}
DESCRIPTION:Appointment for ${appointment.patientName} at ${clinicName}.
END:VEVENT
END:VCALENDAR`;

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            saveAs(blob, `appointment-${appointment.appointmentDate}.ics`);
            
        } catch (error) {
            console.error("Error generating calendar file:", error);
            alert("Could not generate calendar invite.");
        }
    };

    return (
        <button 
            onClick={handleGenerateICS}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
        >
            <Calendar className="w-5 h-5" />
            <span>Add to Calendar</span>
        </button>
    );
}
