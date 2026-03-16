"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export function DynamicFee() {
    const [fee, setFee] = useState<number | null>(null);
    useEffect(() => {
        if (!db) return;
        getDoc(doc(db, "settings", "clinic")).then(snap => {
            if (snap.exists()) {
                setFee(snap.data().consultationFee);
            }
        });
    }, []);
    return <span>{fee !== null ? `₹${fee}` : <Loader2 className="h-3 w-3 inline animate-spin" />}</span>;
}

export function DynamicWorkingHours() {
    const [hours, setHours] = useState<any>(null);
    useEffect(() => {
        if (!db) return;
        getDoc(doc(db, "settings", "clinic")).then(snap => {
            if (snap.exists()) {
                setHours(snap.data().workingHours);
            }
        });
    }, []);

    const formatTime = (time24: string) => {
        if (!time24) return "";
        const [hourStr, minStr] = time24.split(":");
        let h = parseInt(hourStr);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${minStr} ${ampm}`;
    };

    if (!hours) return null;

    return (
        <div className="mt-4 text-sm text-slate-700 bg-slate-100 p-3 rounded-lg border border-slate-200">
            <p className="font-bold text-xs text-[var(--color-primary)] uppercase mb-2">Clinic Timings</p>
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-slate-500">Mon, Thu, Sat:</span>
                    <strong className="text-slate-900">{formatTime(hours.monThuSat?.start)} - {formatTime(hours.monThuSat?.end)}</strong>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Tue, Wed, Fri, Sun:</span>
                    <strong className="text-slate-900">{formatTime(hours.others?.start)} - {formatTime(hours.others?.end)}</strong>
                </div>
            </div>
        </div>
    );
}
