import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* Clinic Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Dr V Sivaraman MD Skin & VD Specialist</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                            Providing comprehensive diagnosis and treatment for skin, hair, and nail conditions. Your trusted skin specialist in Pondicherry with 30+ years of experience.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social links placeholder */}
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2 inline-block">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Clinic</Link></li>
                            <li><Link href="/doctor" className="hover:text-white transition-colors">Dr. V. Sivaraman</Link></li>
                            <li><Link href="/treatments" className="hover:text-white transition-colors">Treatments</Link></li>
                            <li><Link href="/gallery" className="hover:text-white transition-colors">Before & After</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/admin" className="hover:text-white transition-colors mt-2 block w-max px-2 py-0.5 rounded border border-slate-700 text-xs text-slate-500">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2 inline-block">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-[var(--color-primary)]" />
                                <span>134, Savarirayalu Street, opposite Pothys, MG Road Area, Puducherry, 605001</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-[var(--color-primary)]" />
                                <a href="tel:9488857759" className="hover:text-white transition-colors">9488857759</a>
                                <span className="mx-2">|</span>
                                <a href="tel:9500492692" className="hover:text-white transition-colors">9500492692</a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-[var(--color-primary)]" />
                                <a href="mailto:skinsiva@gmail.com" className="hover:text-white transition-colors">skinsiva@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Timings */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2 inline-block">Working Hours</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex justify-between">
                                <span>Mon, Thu, Sat</span>
                                <span className="font-semibold text-white">2:00 PM - 8:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Tue, Wed, Fri, Sun</span>
                                <span className="font-semibold text-white">4:00 PM - 8:00 PM</span>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <Link href="/online-appointment" className="inline-block bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white px-6 py-2 rounded font-bold text-sm transition-colors text-center w-full">
                                Book Consultation
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 mt-4 md:flex md:items-center md:justify-between text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Dr V Sivaraman MD Skin & VD Specialist. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 space-x-4">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
