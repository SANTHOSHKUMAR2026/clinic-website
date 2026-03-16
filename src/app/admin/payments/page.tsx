"use client";

import { Search, DownloadCloud, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                if (!db) {
                    console.warn("Firebase DB not initialized.");
                    return;
                }
                const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                
                // Extract paid appointments as payments
                const paidAppointments = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter((app: any) => app.paymentStatus === "Paid");

                setPayments(paidAppointments);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(p => 
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tokenId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportCSV = () => {
        if (filteredPayments.length === 0) {
            alert("No payments to export.");
            return;
        }

        const headers = ["Token No", "Payment ID", "Appointment ID", "Patient Name", "Amount (Rs)", "Date", "Time", "Status"];
        
        const rows = filteredPayments.map(p => [
            p.tokenNumber || "N/A",
            p.paymentId || "N/A",
            p.tokenId || "N/A",
            `"${p.patientName}"`,
            p.amount || 1000,
            p.appointmentDate,
            p.appointmentTime,
            p.paymentStatus
        ]);

        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payment Tracking</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor all Razorpay transactions online.</p>
                </div>

                <button 
                    onClick={handleExportCSV}
                    className="flex items-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                    <DownloadCloud className="h-4 w-4" />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Token ID or Name..."
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
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
                                    <th className="p-4 whitespace-nowrap">Transaction / Token No.</th>
                                    <th className="p-4 whitespace-nowrap">Patient</th>
                                    <th className="p-4 whitespace-nowrap">Amount</th>
                                    <th className="p-4 whitespace-nowrap">Date & Time</th>
                                    <th className="p-4 whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredPayments.map((payment, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="inline-flex items-center justify-center bg-blue-50 text-[var(--color-primary)] font-bold h-7 w-7 rounded-full text-[10px] border border-blue-100">
                                                    {payment.tokenNumber || "-"}
                                                </span>
                                                <span className="font-mono text-xs font-bold text-slate-600">{payment.paymentId || "N/A"}</span>
                                            </div>
                                            {payment.tokenId && <p className="text-[10px] text-slate-400 mt-1 font-mono ml-9">{payment.tokenId}</p>}
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">{payment.patientName}</td>
                                        <td className="p-4 font-semibold text-[var(--color-primary)]">₹{payment.amount || 1000}</td>
                                        <td className="p-4 text-slate-500">
                                            {payment.appointmentDate}
                                            <p className="text-xs">{payment.appointmentTime}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${payment.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                                    payment.paymentStatus === 'Refunded' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
}
