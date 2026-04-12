"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE, TABLES } from "@/lib/supabase/constants";
import ImageUpload from "./ImageUpload";

interface CompanyProps {
    onClose: () => void;
    name: string;
    domain: string;
    logo: File | null;
}

export function CompanyModal(props: CompanyProps) {
    const [name, setName] = useState(props.name);
    const [domain, setDomain] = useState(props.domain);
    const [logo, setLogo] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let logoPath: string | null = null;

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

        const { error: insertError } = await supabase
            .from(TABLES.COMPANIES)
            .insert({
                user_id: user.id,
                name,
                domain,
                logo_url: logoPath,
            });

        if (insertError) {
            setError(insertError.message);
            return;
        }

        props.onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onClick={props.onClose}
        >
            <div
                className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {props.name ? "Edit Company" : "Add Company"}
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
                            Company Name
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
                            Domain
                        </label>
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="acme.com"
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                        />
                    </div>

                    <ImageUpload
                        label="Logo"
                        onImageReady={(file) => setLogo(file)}
                        aspectRatio={16 / 9}
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={props.onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
