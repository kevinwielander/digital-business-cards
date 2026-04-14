"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { isGuestMode } from "@/lib/guest-store";
import { useGuest } from "./GuestProvider";
import { useToast } from "./ToastProvider";
import type { TemplateConfig } from "@/lib/types";

interface DuplicateTemplateButtonProps {
    templateName: string;
    config: TemplateConfig;
}

export default function DuplicateTemplateButton({ templateName, config }: DuplicateTemplateButtonProps) {
    const router = useRouter();
    const guest = useGuest();
    const { toast } = useToast();

    async function handleDuplicate(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const newName = `${templateName} (Copy)`;

        if (isGuestMode()) {
            guest.addTemplate(newName, config);
            toast("Template duplicated");
            router.refresh();
            return;
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from(TABLES.TEMPLATES)
            .insert({ user_id: user.id, name: newName, config });

        if (error) {
            toast(error.message, "error");
            return;
        }

        toast("Template duplicated");
        router.refresh();
    }

    return (
        <button
            onClick={handleDuplicate}
            className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            title="Duplicate"
        >
            Duplicate
        </button>
    );
}
