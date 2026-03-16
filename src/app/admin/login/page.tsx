"use client";

import { useState, useEffect, Suspense } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Loader2, UserPlus } from "lucide-react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const showInit = searchParams.get("init") === "true";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!auth) {
                throw new Error("Firebase Auth is not initialized. Please configure .env.local");
            }
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin/dashboard");
        } catch (err: any) {
            console.error("Login Error:", err);
            setError("Invalid admin credentials or Firebase is not configured.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInitializeAdmin = async () => {
        setIsLoading(true);
        setError("");
        setSuccess("");
        try {
            if (!auth) throw new Error("Firebase Auth not initialized");
            // The specified credentials from the prompt
            const adminEmail = "doctorlydigitalmedia@gmail.com";
            const adminPass = "Srikandan@2026";
            
            await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
            setSuccess("Admin user created successfully! You can now log in.");
            setEmail(adminEmail);
            setPassword(adminPass);
        } catch (err: any) {
            console.error("Init Error:", err);
            if (err.code === "auth/email-already-in-use") {
                setError("Admin user already exists. Please log in.");
            } else {
                setError("Failed to initialize admin: " + err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Clinic <span className="text-[var(--color-primary)]">Admin</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Sign in to access the dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-6 border border-green-200">
                        {success}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                placeholder="doctorlydigitalmedia@gmail.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[var(--color-primary)] hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...</>
                        ) : (
                            "Log In"
                        )}
                    </button>

                    {showInit && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleInitializeAdmin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>Initialize Admin Account</span>
                            </button>
                            <p className="text-[10px] text-center text-slate-400 mt-2">
                                Only use this for the first-time setup.
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default function AdminLogin() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
