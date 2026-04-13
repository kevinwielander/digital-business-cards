"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { useTranslation } from "./I18nProvider";
import ConfirmModal from "./ConfirmModal";

interface DeleteCompanyButtonProps {
    companyId: string;
    companyName: string;
}

export default function DeleteCompanyButton({ companyId, companyName }: DeleteCompanyButtonProps) {
    const router = useRouter();
    const { t } = useTranslation();
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
                {t.companies_delete}
            </button>
            {showConfirm && (
                <ConfirmModal
                    title={t.companies_delete}
                    message={t.companies_delete_confirm.replace("{name}", companyName)}
                    confirmLabel={t.modal_delete}
                    destructive
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}
