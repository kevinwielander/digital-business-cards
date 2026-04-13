"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import ConfirmModal from "./ConfirmModal";

interface DeleteCompanyButtonProps {
    companyId: string;
    companyName: string;
}

export default function DeleteCompanyButton({ companyId, companyName }: DeleteCompanyButtonProps) {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleDelete() {
        const supabase = createClient();
        await supabase.from(TABLES.PEOPLE).delete().eq("company_id", companyId);
        const { error } = await supabase.from(TABLES.COMPANIES).delete().eq("id", companyId);

        if (error) {
            alert(error.message);
            return;
        }

        router.push("/companies");
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
                Delete Company
            </button>
            {showConfirm && (
                <ConfirmModal
                    title="Delete Company"
                    message={`Are you sure you want to delete "${companyName}" and all its people? This cannot be undone.`}
                    confirmLabel="Delete"
                    destructive
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}
