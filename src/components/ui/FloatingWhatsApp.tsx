"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingWhatsApp() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after slight delay for better UX
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <a
            href="https://wa.me/919500492692"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={32} />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-right-2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-l-white">
                Chat with us
            </span>
        </a>
    );
}
