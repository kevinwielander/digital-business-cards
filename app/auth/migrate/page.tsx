"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasGuestData } from "@/lib/guest-store";
import { migrateGuestData } from "@/lib/migrate-guest-data";

export default function MigratePage() {
    const router = useRouter();
    const [status, setStatus] = useState("Checking for guest data...");

    useEffect(() => {
        async function migrate() {
            if (!hasGuestData()) {
                router.replace("/");
                return;
            }

            setStatus("Migrating your data...");
            const count = await migrateGuestData();
            setStatus(`Migrated ${count} items. Redirecting...`);

            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        }
        migrate();
    }, [router]);

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
                <p className="text-sm text-zinc-500">{status}</p>
            </div>
        </div>
    );
}
