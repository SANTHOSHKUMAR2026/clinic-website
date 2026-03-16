"use client";

import { Search, History, UserPlus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export default function AdminPatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                if (!db) {
                    console.warn("Firebase DB not initialized.");
                    return;
                }
                const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                
                // Group by mobile number to get unique patients
                const uniquePatients: any = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (!uniquePatients[data.patientMobile]) {
                        uniquePatients[data.patientMobile] = {
                            name: data.patientName,
                            phone: data.patientMobile,
                            email: data.patientEmail,
                            age: data.patientAge,
                            gender: data.patientGender,
                            lastVisit: data.appointmentDate,
                            totalVisits: 1
                        };
                    } else {
                        uniquePatients[data.patientMobile].totalVisits += 1;
                        // Update last visit if this one is more recent
                        if (new Date(data.appointmentDate) > new Date(uniquePatients[data.patientMobile].lastVisit)) {
                            uniquePatients[data.patientMobile].lastVisit = data.appointmentDate;
                        }
                    }
                });

                setPatients(Object.values(uniquePatients));
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patient Database</h1>
                    <p className="text-slate-500 text-sm mt-1">Management of all registered patients.</p>
                </div>

                <button className="flex items-center space-x-2 bg-[var(--color-primary)] hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Patient Manually</span>
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
                            placeholder="Search by name, phone, or email..."
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
                                    <th className="p-4 whitespace-nowrap">Patient</th>
                                    <th className="p-4 whitespace-nowrap">Contact</th>
                                    <th className="p-4 whitespace-nowrap">Demographics</th>
                                    <th className="p-4 whitespace-nowrap">Last Visit</th>
                                    <th className="p-4 whitespace-nowrap text-center">Total Visits</th>
                                    <th className="p-4 whitespace-nowrap text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredPatients.map((patient, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{patient.name}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-700">{patient.phone}</p>
                                            <p className="text-xs text-slate-500">{patient.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-700">{patient.age} yrs, {patient.gender}</p>
                                        </td>
                                        <td className="p-4 text-slate-700">
                                            {patient.lastVisit}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-bold h-8 w-8 rounded-full text-xs">
                                                {patient.totalVisits}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-slate-500 hover:text-[var(--color-primary)] p-1.5 rounded-lg transition-colors flex items-center justify-end space-x-1 ml-auto">
                                                <History className="h-4 w-4" />
                                                <span className="text-xs font-medium">History</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No patients found.
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
