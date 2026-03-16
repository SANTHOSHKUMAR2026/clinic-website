"use client";

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface PhoneLookupFormProps {
    onSearch: (phone: string) => void;
    isLoading: boolean;
}

export function PhoneLookupForm({ onSearch, isLoading }: PhoneLookupFormProps) {
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (phone.length < 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        onSearch(phone);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">+91</span>
                </div>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter registered mobile number"
                    required
                    className="block w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-sm text-lg font-medium"
                />
                <button
                    type="submit"
                    disabled={isLoading || phone.length < 10}
                    className="absolute right-2 top-2 bottom-2 bg-[var(--color-primary)] hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 rounded-xl font-bold transition-colors flex items-center"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 md:mr-2" />}
                    <span className="hidden md:inline">Search</span>
                </button>
            </div>
            <p className="text-center text-sm text-slate-500 mt-3">Find your upcoming and past bookings instantly.</p>
        </form>
    );
}
