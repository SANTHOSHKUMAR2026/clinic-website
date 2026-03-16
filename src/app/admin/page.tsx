"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/dashboard");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-10 w-10 text-[var(--color-primary)] animate-spin" />
        </div>
    );
}