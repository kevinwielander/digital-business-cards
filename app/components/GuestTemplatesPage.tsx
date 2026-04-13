"use client";

import Link from "next/link";
import { useGuest } from "./GuestProvider";
import DeleteTemplateButton from "./DeleteTemplateButton";

export default function GuestTemplatesPage() {
    const { isGuest, data } = useGuest();

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

            {data.templates.length === 0 && (
                <p className="mb-8 text-center text-zinc-500">No templates yet. Create one or use a starter template below.</p>
            )}
        </div>
    );
}
