"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import ConfirmModal from "./ConfirmModal";

interface DeleteTemplateButtonProps {
    templateId: string;
    templateName: string;
}

export default function DeleteTemplateButton({ templateId, templateName }: DeleteTemplateButtonProps) {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleDelete() {
        const supabase = createClient();
        const { error } = await supabase.from(TABLES.TEMPLATES).delete().eq("id", templateId);

        if (error) {
            alert(error.message);
            return;
        }

        setShowConfirm(false);
        router.refresh();
    }

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                }}
                className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
            >
                Delete
            </button>
            {showConfirm && (
                <ConfirmModal
                    title="Delete Template"
                    message={`Are you sure you want to delete "${templateName}"? This cannot be undone.`}
                    confirmLabel="Delete"
                    destructive
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}
