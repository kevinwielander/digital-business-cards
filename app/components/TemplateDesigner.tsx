"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { DEFAULT_TEMPLATE_CONFIG, SAMPLE_CARD_DATA } from "@/lib/types";
import type { TemplateConfig, SampleCardData } from "@/lib/types";
import CardPreview from "./CardPreview";

interface Company {
    id: string;
    name: string;
    logo_url: string | null;
}

interface TemplateDesignerProps {
    initialName?: string;
    initialConfig?: TemplateConfig;
    templateId?: string;
}

export default function TemplateDesigner({
    initialName = "",
    initialConfig,
    templateId,
}: TemplateDesignerProps) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [config, setConfig] = useState<TemplateConfig>(
        initialConfig ?? DEFAULT_TEMPLATE_CONFIG
    );
    const [error, setError] = useState<string | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [previewData, setPreviewData] = useState<SampleCardData>(SAMPLE_CARD_DATA);

    useEffect(() => {
        async function loadCompanies() {
            const supabase = createClient();
            const { data } = await supabase
                .from(TABLES.COMPANIES)
                .select("id, name, logo_url");
            if (data) setCompanies(data);
        }
        loadCompanies();
    }, []);

    useEffect(() => {
        async function loadLogo() {
            const company = companies.find((c) => c.id === selectedCompanyId);
            if (!company) {
                setPreviewData(SAMPLE_CARD_DATA);
                return;
            }

            let logoUrl: string | null = null;
            if (company.logo_url) {
                const supabase = createClient();
                const { data } = await supabase.storage
                    .from(STORAGE.LOGOS)
                    .createSignedUrl(company.logo_url, 3600);
                logoUrl = data?.signedUrl ?? null;
            }

            setPreviewData({
                ...SAMPLE_CARD_DATA,
                company: company.name,
                logoUrl,
            });
        }
        loadLogo();
    }, [selectedCompanyId, companies]);

    function updateConfig<K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) {
        setConfig((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSave() {
        if (!name.trim()) {
            setError("Template name is required");
            return;
        }
        setError(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (templateId) {
            const { error } = await supabase
                .from(TABLES.TEMPLATES)
                .update({ name, config })
                .eq("id", templateId);
            if (error) { setError(error.message); return; }
        } else {
            const { error } = await supabase
                .from(TABLES.TEMPLATES)
                .insert({ user_id: user.id, name, config });
            if (error) { setError(error.message); return; }
        }

        router.push("/templates");
    }

    return (
        <div className="flex gap-8">
            {/* Controls */}
            <div className="flex w-80 shrink-0 flex-col gap-5">
                <div>
                    <label className="mb-1 block text-sm font-medium">Template Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Template"
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Preview with Company</label>
                    <select
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    >
                        <option value="">Sample data</option>
                        {companies.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Layout</label>
                    <select
                        value={config.layout}
                        onChange={(e) => updateConfig("layout", e.target.value as "horizontal" | "vertical")}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Font</label>
                    <select
                        value={config.fontFamily}
                        onChange={(e) => updateConfig("fontFamily", e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    >
                        <option value="sans-serif">Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium">Background</label>
                        <input
                            type="color"
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                            className="h-10 w-full cursor-pointer rounded-lg border border-zinc-300"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium">Text</label>
                        <input
                            type="color"
                            value={config.textColor}
                            onChange={(e) => updateConfig("textColor", e.target.value)}
                            className="h-10 w-full cursor-pointer rounded-lg border border-zinc-300"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium">Accent</label>
                        <input
                            type="color"
                            value={config.accentColor}
                            onChange={(e) => updateConfig("accentColor", e.target.value)}
                            className="h-10 w-full cursor-pointer rounded-lg border border-zinc-300"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="mb-1 block text-sm font-medium">Visible Fields</label>
                    {(["showLogo", "showEmail", "showPhone", "showAddress"] as const).map((field) => (
                        <label key={field} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={config[field]}
                                onChange={(e) => updateConfig(field, e.target.checked)}
                                className="rounded border-zinc-300"
                            />
                            {field.replace("show", "")}
                        </label>
                    ))}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                    >
                        {templateId ? "Update" : "Save"} Template
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Live Preview */}
            <div className="flex flex-1 items-start justify-center rounded-xl bg-zinc-100 p-10">
                <CardPreview config={config} data={previewData} />
            </div>
        </div>
    );
}
