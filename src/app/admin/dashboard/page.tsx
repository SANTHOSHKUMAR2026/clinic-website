"use client";

import Link from "next/link";
import { Users, CalendarCheck, CalendarX, IndianRupee, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDashboardMetrics } from "@/lib/adminData";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AdminDashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMetrics = async () => {
            const data = await fetchDashboardMetrics();
            setMetrics(data);
            setIsLoading(false);
        };
        loadMetrics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin" />
            </div>
        );
    }

    const stats = [
        { name: "Today's Appointments", value: metrics?.todaysPatients || 0, icon: CalendarCheck, color: "bg-blue-500" },
        { name: "Today's Revenue", value: `₹${metrics?.todaysRevenue || 0}`, icon: IndianRupee, color: "bg-green-500" },
        { name: "Pending", value: metrics?.pendingAppointments || 0, icon: CalendarCheck, color: "bg-amber-500" },
        { name: "Cancelled", value: metrics?.cancelledAppointments || 0, icon: CalendarX, color: "bg-red-500" },
    ];

    const revenueData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                fill: true,
                label: 'Weekly Revenue (₹)',
                data: [12000, 15000, 10000, 18000, 14000, 22000, metrics?.todaysRevenue || 9000],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center rounded-2xl bg-white p-6 shadow-sm border border-slate-200 mt-4 md:mt-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
                        <div className={`p-4 rounded-xl text-white ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
                        <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <Line options={options} data={revenueData} />
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
                        <Link href="/admin/appointments" className="text-sm text-[var(--color-primary)] font-medium hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {metrics?.recentAppointments?.length > 0 ? metrics.recentAppointments.map((apt: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm">
                                        {apt.patientName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{apt.patientName}</p>
                                        <p className="text-xs text-slate-500">{apt.appointmentDate}, {apt.appointmentTime}</p>
                                    </div>
                                </div>
                                <div className={`text-xs font-semibold px-2 py-1 rounded ${apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                                        apt.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                            "bg-amber-100 text-amber-700"
                                    }`}>
                                    {apt.status}
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 text-center py-4">No recent bookings found.</p>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
