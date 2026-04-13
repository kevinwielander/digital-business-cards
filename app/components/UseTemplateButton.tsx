"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { isGuestMode } from "@/lib/guest-store";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";
import type { TemplateConfig } from "@/lib/types";

interface UseTemplateButtonProps {
    name: string;
    config: TemplateConfig;
}

export default function UseTemplateButton({ name, config }: UseTemplateButtonProps) {
    const router = useRouter();
    const guest = useGuest();
    const { t } = useTranslation();

    async function handleUse() {
        if (isGuestMode()) {
            const id = guest.addTemplate(name, config);
            router.push(`/templates/${id}/edit`);
            return;
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from(TABLES.TEMPLATES)
            .insert({ user_id: user.id, name, config })
            .select("id")
            .single();

        if (error) {
            alert(error.message);
            return;
        }

        router.push(`/templates/${data.id}/edit`);
    }

    return (
        <button
            onClick={handleUse}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
            {t.templates_use}
        </button>
    );
}
