"use client";

import { CheckCircle2, XCircle, Search, Filter, Loader2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, doc, updateDoc } from "firebase/firestore";

export default function AdminAppointmentsPage() {
    const [filter, setFilter] = useState("All");
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAppointments = async () => {
        try {
            if (!db) {
                console.warn("Firebase DB not initialized.");
                setAppointments([]);
                return;
            }
            const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            if (!db) return;
            const docRef = doc(db, "appointments", id);
            await updateDoc(docRef, { status: newStatus });
            // Refresh local state without refetching from DB entirely
            setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update appointment status.");
        }
    };

    const normalizeStatus = (dbStatus: string) => {
        if (dbStatus === "Pending Payment") return "Upcoming";
        return dbStatus;
    };

    const filteredAppointments = appointments.filter(app => {
        const matchesFilter = filter === "All" || normalizeStatus(app.status) === filter;
        const searchTarget = `${app.patientName} ${app.patientMobile} ${app.tokenId || ''} ${app.tokenNumber || ''}`.toLowerCase();
        const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments Management</h1>
                    <p className="text-slate-500 text-sm mt-1">View and manage all clinic appointments.</p>
                </div>

                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                    {["All", "Upcoming", "Confirmed", "Cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === tab
                                ? "bg-slate-100 text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by patient name or phone..."
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-80 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                                    <th className="p-4 whitespace-nowrap">Token No.</th>
                                    <th className="p-4 whitespace-nowrap">Patient Details</th>
                                    <th className="p-4 whitespace-nowrap">Date & Time</th>
                                    <th className="p-4 whitespace-nowrap">Reason</th>
                                    <th className="p-4 whitespace-nowrap">Payment</th>
                                    <th className="p-4 whitespace-nowrap">Status</th>
                                    <th className="p-4 whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredAppointments.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">

                                        <td className="p-4">
                                            <span className="inline-flex items-center justify-center bg-blue-50 text-[var(--color-primary)] font-bold h-8 w-8 rounded-full border border-blue-200">
                                                {app.tokenNumber || "-"}
                                            </span>
                                            {app.tokenId && <p className="text-[10px] text-slate-400 mt-1 font-mono">{app.tokenId}</p>}
                                        </td>

                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{app.patientName}</p>
                                            <p className="text-slate-500">{app.patientMobile}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-slate-900">{app.appointmentDate}</p>
                                            <p className="text-slate-500">{app.appointmentTime}</p>
                                        </td>
                                        <td className="p-4 text-slate-700">{app.reasonForVisit}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${app.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                                app.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {app.paymentStatus || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${app.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                app.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                {app.status !== 'Confirmed' && app.status !== 'Cancelled' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(app.id, "Confirmed")} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Approve/Mark Completed">
                                                            <CheckCircle2 className="h-5 w-5" />
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(app.id, "Cancelled")} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Reject/Cancel">
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {app.imageUrl && (
                                                    <a href={app.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="View Uploaded Image">
                                                        <Eye className="h-5 w-5" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAppointments.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500">
                                            No appointments found matching this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
                    <span>Showing {filteredAppointments.length} results</span>
                </div>

            </div>
        </div>
    );
}
