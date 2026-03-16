"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, Users, IndianRupee, Settings, LogOut, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (!auth) {
            console.warn("Firebase Auth is not initialized. Please configure .env.local");
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Handle routing logic based on auth state and current path
    useEffect(() => {
        if (isLoading) return; // Wait until initial auth state is determined

        if (isAuthenticated && isLoginPage) {
            router.replace("/admin/dashboard");
        } else if (!isAuthenticated && !isLoginPage) {
            router.replace("/admin/login");
        }
    }, [isAuthenticated, isLoginPage, isLoading, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin" />
            </div>
        );
    }

    // If it's the login page, just render the children without the dashboard shell
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!isAuthenticated) return null; // Prevents flashing content before redirecting

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Appointments", href: "/admin/appointments", icon: Calendar },
        { name: "Patients", href: "/admin/patients", icon: Users },
        { name: "Payments", href: "/admin/payments", icon: IndianRupee },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800">
                <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900 z-10 w-full shrink-0">
                    <Link href="/" className="text-xl font-bold text-white tracking-tight">
                        Clinic <span className="text-[var(--color-primary)]">Admin</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
                    <Link href="/" className="text-lg font-bold text-slate-900">
                        Clinic Admin
                    </Link>
                    <button className="text-slate-500 hover:text-slate-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 relative">
                    <div className="fixed inset-x-0 top-0 h-40 bg-[var(--color-primary)] -z-10 hidden md:block" style={{ borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem' }}></div>
                    {children}
                </main>
            </div>

        </div>
    );
}
