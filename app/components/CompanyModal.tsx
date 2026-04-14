"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE, TABLES } from "@/lib/supabase/constants";
import { isGuestMode } from "@/lib/guest-store";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";
import ImageUpload from "./ImageUpload";

interface CompanyProps {
    onClose: () => void;
    id?: string;
    name: string;
    domain: string;
    website: string;
    logo: File | null;
    currentLogoUrl?: string | null;
}

export function CompanyModal(props: CompanyProps) {
    const guest = useGuest();
    const { t } = useTranslation();
    const [name, setName] = useState(props.name);
    const [domain, setDomain] = useState(props.domain);
    const [website, setWebsite] = useState(props.website);
    const [logo, setLogo] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isEdit = !!props.id;

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError(null);

        if (isGuestMode()) {
            let logoUrl: string | null = null;
            if (logo) {
                logoUrl = URL.createObjectURL(logo);
            }
            if (isEdit && props.id) {
                guest.updateCompany(props.id, { name, domain, website, logo_url: logoUrl ?? undefined });
            } else {
                guest.addCompany({ name, domain, website, logo_url: logoUrl });
            }
            props.onClose();
            return;
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let logoPath: string | null | undefined = undefined;

        if (logo) {
            const fileExt = logo.name.split(".").pop();
            const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE.LOGOS)
                .upload(filePath, logo);

            if (uploadError) {
                setError(uploadError.message);
                return;
            }

            logoPath = filePath;
        }

        if (isEdit && props.id) {
            const updates: Record<string, unknown> = { name, domain, website };
            if (logoPath !== undefined) updates.logo_url = logoPath;

            const { error: updateError } = await supabase
                .from(TABLES.COMPANIES)
                .update(updates)
                .eq("id", props.id);

            if (updateError) {
                setError(updateError.message);
                return;
            }
        } else {
            const { error: insertError } = await supabase
                .from(TABLES.COMPANIES)
                .insert({
                    user_id: user.id,
                    name,
                    domain,
                    website,
                    logo_url: logoPath ?? null,
                });

            if (insertError) {
                setError(insertError.message);
                return;
            }
        }

        props.onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onClick={props.onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 shadow-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {isEdit ? t.companies_edit : t.companies_add}
                    </h2>
                    <button
                        onClick={props.onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            {t.form_company_name}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Acme Inc."
                            required
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            {t.form_domain}
                        </label>
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="acme.com"
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            {t.form_website}
                        </label>
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://acme.com"
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                        />
                    </div>

                    <ImageUpload
                        label={t.form_logo}
                        onImageReady={(file) => setLogo(file)}
                        currentImageUrl={props.currentLogoUrl}
                        allowSkipCrop
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={props.onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                        >
                            {t.modal_cancel}
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                        >
                            {isEdit ? t.modal_save : t.companies_add}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
