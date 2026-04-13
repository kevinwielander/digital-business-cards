"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGuest } from "./GuestProvider";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import UseTemplateButton from "./UseTemplateButton";
import type { TemplateConfig } from "@/lib/types";

interface SampleTemplate {
    id: string;
    name: string;
    config: TemplateConfig;
    is_sample: boolean;
}

export default function GuestTemplatesPage() {
    const { isGuest, data } = useGuest();
    const [sampleTemplates, setSampleTemplates] = useState<SampleTemplate[]>([]);

    useEffect(() => {
        async function loadSamples() {
            const supabase = createClient();
            const { data } = await supabase
                .from(TABLES.TEMPLATES)
                .select("*")
                .eq("is_sample", true)
                .order("created_at", { ascending: true });
            if (data) setSampleTemplates(data);
        }
        loadSamples();
    }, []);

    if (!isGuest) return null;

    return (
        <div className="mx-auto w-full max-w-4xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
                    <p className="mt-1 text-sm text-zinc-500">Design and manage your business card templates.</p>
                </div>
                <Link
                    href="/templates/new"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    + New Template
                </Link>
            </div>

            {/* Guest's own templates from localStorage */}
            {data.templates.length > 0 && (
                <div className="mb-12">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Your Templates</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {data.templates.map((template) => (
                            <div
                                key={template.id}
                                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                <Link href={`/templates/${template.id}/edit`} className="flex-1">
                                    <p className="font-semibold text-zinc-900">{template.name}</p>
                                </Link>
                                <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sample templates from DB */}
            {sampleTemplates.length > 0 && (
                <div>
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Starter Templates</h2>
                    <p className="mb-4 text-sm text-zinc-500">Use these as a starting point — they'll be copied so you can customize them.</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {sampleTemplates.map((template) => (
                            <div key={template.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                                <div className="mb-3">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-zinc-900">{template.name}</p>
                                        <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">Sample</span>
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        {template.config?.width ?? 450} x {template.config?.height ?? 260}
                                        {template.config?.elements && ` · ${template.config.elements.length} elements`}
                                    </p>
                                </div>
                                {/* Mini preview */}
                                <div className="mb-4 flex justify-center rounded-lg bg-zinc-50 p-4">
                                    <div
                                        className="relative overflow-hidden rounded shadow-sm"
                                        style={{
                                            width: (template.config?.width ?? 450) * 0.4,
                                            height: (template.config?.height ?? 260) * 0.4,
                                            backgroundColor: template.config?.backgroundColor ?? "#fff",
                                        }}
                                    >
                                        {(template.config?.elements ?? [])
                                            .filter((el: { type: string }) => el.type === "shape")
                                            .map((el: { id: string; x: number; y: number; width: number; height: number; backgroundColor?: string; gradient?: string; shapeRadius?: number }) => (
                                                <div
                                                    key={el.id}
                                                    style={{
                                                        position: "absolute",
                                                        left: el.x * 0.4,
                                                        top: el.y * 0.4,
                                                        width: el.width * 0.4,
                                                        height: el.height * 0.4,
                                                        background: el.gradient || el.backgroundColor,
                                                        borderRadius: el.shapeRadius ? el.shapeRadius * 0.4 : 0,
                                                    }}
                                                />
                                            ))}
                                    </div>
                                </div>
                                <UseTemplateButton name={template.name} config={template.config} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.templates.length === 0 && sampleTemplates.length === 0 && (
                <p className="text-center text-zinc-500">No templates yet. Create one to get started.</p>
            )}
        </div>
    );
}
