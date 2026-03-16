import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Dr V Sivaraman MD Skin & VD Specialist | Pondicherry",
    description: "Get in touch with Dr V Sivaraman MD Skin & VD Specialist in Pondicherry. Find our location, timings, and contact details.",
};

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white py-16 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contact Us</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We're here to help you. Reach out to schedule an appointment or ask any questions about our dermatological services.
                    </p>
                </div>
            </div>

            <section className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Details */}
                        <div className="space-y-10">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4">Clinic Information</h2>

                                <ul className="space-y-8">
                                    <li className="flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-xl mr-5">
                                            <MapPin className="h-6 w-6 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">Location</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                134, Savarirayalu Street, <br />
                                                opposite Pothys, MG Road Area, <br />
                                                Puducherry, 605001.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-xl mr-5">
                                            <Phone className="h-6 w-6 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">Phone & WhatsApp</h3>
                                            <p className="text-gray-600 space-y-1 flex flex-col">
                                                <a href="tel:9488857759" className="hover:text-[var(--color-primary)] font-medium">9488857759</a>
                                                <a href="https://wa.me/919500492692" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 font-medium">
                                                    9500492692 (WhatsApp)
                                                </a>
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-xl mr-5">
                                            <Mail className="h-6 w-6 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">Email</h3>
                                            <p className="text-gray-600">
                                                <a href="mailto:skinsiva@gmail.com" className="hover:text-[var(--color-primary)]">skinsiva@gmail.com</a>
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-xl mr-5">
                                            <Clock className="h-6 w-6 text-[var(--color-primary)]" />
                                        </div>
                                        <div className="w-full">
                                            <h3 className="font-bold text-slate-900 text-lg mb-3">Working Hours</h3>
                                            <div className="space-y-2 text-gray-600 w-full max-w-sm">
                                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                                    <span>Mon, Thu, Sat</span>
                                                    <span className="font-semibold text-slate-800">2:00 PM - 8:00 PM</span>
                                                </div>
                                                <div className="flex justify-between pb-2">
                                                    <span>Tue, Wed, Fri, Sun</span>
                                                    <span className="font-semibold text-slate-800">4:00 PM - 8:00 PM</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Google Map */}
                        <div className="h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15615.158373307525!2d79.81516898715822!3d11.93239550000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a536181e0e89af7%3A0x5f57fb9b3920ac7!2sDr%20V%20Sivaraman%20MD%20Skin%20%26%20VD%20Specialist!5e0!3m2!1sen!2sin!4v1709458299104!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Clinic Map Location"
                            ></iframe>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
