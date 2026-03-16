"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const handleLinkClick = (href: string) => {
        setIsOpen(false);
        if (pathname === href) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Doctor", href: "/doctor" },
        { name: "Treatments", href: "/treatments" },
        { name: "Gallery", href: "/gallery" },
        { name: "Reviews", href: "/reviews" },
        { name: "Admin", href: "/admin" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24 gap-4">
                    <div className="flex-shrink-0 flex items-center min-w-0 lg:ml-6 xl:ml-10">
                        <Link href="/" onClick={() => handleLinkClick("/")} className="flex items-center">
                            <img
                                src="/doctor-sivaraman.png"
                                alt="Dr V Sivaraman Logo"
                                className="h-16 w-16 rounded-full object-cover border-2 border-[var(--color-primary)] shadow-sm"
                            />
                            <div className="ml-3 hidden md:flex flex-col justify-center truncate">
                                <span className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                                    Dr V Sivaraman MD
                                </span>
                                <span className="text-sm lg:text-base font-semibold text-slate-600 mt-1 truncate">
                                    Skin & VD Specialist
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
                        <div className="flex space-x-4 xl:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => handleLinkClick(link.href)}
                                    className={`py-2 text-[15px] xl:text-[17px] font-semibold tracking-wide transition-colors relative group whitespace-nowrap ${pathname === link.href
                                        ? "text-[var(--color-primary)]"
                                        : "text-slate-600 hover:text-[var(--color-primary)]"
                                        }`}
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/check-appointment"
                                className="text-slate-600 hover:text-[var(--color-primary)] font-semibold text-[13px] xl:text-[14px] transition-colors whitespace-nowrap"
                            >
                                Check Appointment
                            </Link>
                            <Link
                                href="/online-appointment"
                                className="bg-[var(--color-primary)] hover:bg-blue-800 text-white px-5 xl:px-6 py-2 xl:py-2.5 rounded-lg font-bold text-[13px] xl:text-[14px] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg border-t">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                    ? "text-[var(--color-primary)] bg-blue-50"
                                    : "text-gray-800 hover:text-[var(--color-primary)] hover:bg-slate-50"
                                    }`}
                                onClick={() => handleLinkClick(link.href)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/online-appointment"
                            className="w-full text-center mt-4 block bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white px-5 py-3 rounded-md font-bold text-base shadow-sm"
                            onClick={() => setIsOpen(false)}
                        >
                            Book Appointment
                        </Link>
                        <Link
                            href="/check-appointment"
                            className="w-full text-center mt-2 block bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-md font-bold text-base shadow-sm"
                            onClick={() => setIsOpen(false)}
                        >
                            Check Appointment
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
