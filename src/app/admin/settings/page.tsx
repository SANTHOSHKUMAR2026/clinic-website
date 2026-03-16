"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, Loader2, Clock, IndianRupee, Link as LinkIcon, MessageSquare, CalendarOff, Trash2 } from "lucide-react";

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        consultationFee: 1000,
        googleReviewLink: "",
        workingHours: {
            monThuSat: { start: "14:00", end: "20:00" },
            others: { start: "16:00", end: "20:00" }
        },
        notifications: {
            smsEnabled: true,
            whatsappEnabled: true
        },
        leaveDates: [] as string[]
    });

    const [newLeaveDate, setNewLeaveDate] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                if (!db) return;
                const docRef = doc(db, "settings", "clinic");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!db) return;
            await setDoc(doc(db, "settings", "clinic"), settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin" />
            </div>
        );
    }

    const addLeaveDate = () => {
        if (!newLeaveDate) return;
        if (settings.leaveDates?.includes(newLeaveDate)) {
            alert("This date is already marked as a leave day.");
            return;
        }
        setSettings({
            ...settings,
            leaveDates: [...(settings.leaveDates || []), newLeaveDate]
        });
        setNewLeaveDate("");
    };

    const removeLeaveDate = (dateToRemove: string) => {
        setSettings({
            ...settings,
            leaveDates: (settings.leaveDates || []).filter(date => date !== dateToRemove)
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clinic Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure your clinic's basic information and preferences.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[var(--color-primary)] hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-70"
                >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* General Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <IndianRupee className="h-5 w-5 mr-2 text-green-600" />
                        Pricing & Links
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Fee (₹)</label>
                        <input 
                            type="number" 
                            value={settings.consultationFee}
                            onChange={(e) => setSettings({...settings, consultationFee: Number(e.target.value)})}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Google Review Link</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                type="url" 
                                value={settings.googleReviewLink}
                                onChange={(e) => setSettings({...settings, googleReviewLink: e.target.value})}
                                placeholder="https://g.page/r/..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Working Hours
                    </h3>
                    
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mon, Thu, Sat</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Start Time</label>
                                <input 
                                    type="time" 
                                    value={settings.workingHours.monThuSat.start}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        workingHours: {
                                            ...settings.workingHours,
                                            monThuSat: { ...settings.workingHours.monThuSat, start: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">End Time</label>
                                <input 
                                    type="time" 
                                    value={settings.workingHours.monThuSat.end}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        workingHours: {
                                            ...settings.workingHours,
                                            monThuSat: { ...settings.workingHours.monThuSat, end: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>

                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6">Tue, Wed, Fri, Sun</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Start Time</label>
                                <input 
                                    type="time" 
                                    value={settings.workingHours.others.start}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        workingHours: {
                                            ...settings.workingHours,
                                            others: { ...settings.workingHours.others, start: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">End Time</label>
                                <input 
                                    type="time" 
                                    value={settings.workingHours.others.end}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        workingHours: {
                                            ...settings.workingHours,
                                            others: { ...settings.workingHours.others, end: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 md:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                        Automation Preferences
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                        <label className="flex items-center space-x-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                            <input 
                                type="checkbox" 
                                checked={settings.notifications.smsEnabled}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, smsEnabled: e.target.checked }
                                })}
                                className="w-5 h-5 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
                            />
                            <div>
                                <p className="font-bold text-slate-900">SMS Notifications</p>
                                <p className="text-xs text-slate-500">Send confirmation & reminders via MSG91</p>
                            </div>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                            <input 
                                type="checkbox" 
                                checked={settings.notifications.whatsappEnabled}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, whatsappEnabled: e.target.checked }
                                })}
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                            />
                            <div>
                                <p className="font-bold text-slate-900">WhatsApp Messages</p>
                                <p className="text-xs text-slate-500">Send rich templates via WhatsApp API</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Leave Days Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 md:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <CalendarOff className="h-5 w-5 mr-2 text-red-600" />
                        Doctor Leave Days
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Select dates when the clinic is closed so patients cannot book appointments online.</p>
                    
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 max-w-sm">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Add Leave Date</label>
                            <input 
                                type="date" 
                                value={newLeaveDate}
                                onChange={(e) => setNewLeaveDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <button 
                            onClick={addLeaveDate}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold px-6 py-2 rounded-lg border border-red-200 transition-colors h-[42px]"
                        >
                            Add Leave
                        </button>
                    </div>

                    {settings.leaveDates && settings.leaveDates.length > 0 && (
                        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-slate-600">Leave Date</th>
                                        <th className="p-3 text-sm font-semibold text-slate-600 w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {settings.leaveDates.sort().map((date, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="p-3 font-medium text-slate-900">
                                                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </td>
                                            <td className="p-3">
                                                <button 
                                                    onClick={() => removeLeaveDate(date)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}