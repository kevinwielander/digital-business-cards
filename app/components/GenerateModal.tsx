"use client";

import { useState } from "react";
import { useTranslation } from "./I18nProvider";

interface Person {
    id: string;
    first_name: string;
    last_name: string;
    title: string;
    photoSignedUrl: string | null;
}

interface GenerateModalProps {
    companyId: string;
    people: Person[];
    onClose: () => void;
}

export default function GenerateModal({ companyId, people, onClose }: GenerateModalProps) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<Set<string>>(
        new Set(people.map((p) => p.id))
    );
    const [generating, setGenerating] = useState(false);

    function toggle(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleAll() {
        if (selected.size === people.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(people.map((p) => p.id)));
        }
    }

    async function handleGenerate() {
        if (selected.size === 0) return;
        setGenerating(true);

        const ids = Array.from(selected).join(",");
        const res = await fetch(`/api/generate/${companyId}?people=${ids}`);
        if (!res.ok) {
            alert("Failed to generate cards");
            setGenerating(false);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "business-cards.zip";
        a.click();
        URL.revokeObjectURL(url);
        setGenerating(false);
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-4 shadow-2xl sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{t.generate_title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                    >
                        &times;
                    </button>
                </div>

                <p className="mb-4 text-sm text-zinc-500">
                    {t.generate_subtitle}
                </p>

                <div className="mb-3 flex items-center gap-2 border-b border-zinc-100 pb-3">
                    <input
                        type="checkbox"
                        checked={selected.size === people.length}
                        onChange={toggleAll}
                        className="rounded border-zinc-300"
                    />
                    <span className="text-sm font-medium text-zinc-700">
                        {t.generate_select_all} ({people.length})
                    </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                    {people.map((person) => (
                        <label
                            key={person.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-zinc-50"
                        >
                            <input
                                type="checkbox"
                                checked={selected.has(person.id)}
                                onChange={() => toggle(person.id)}
                                className="rounded border-zinc-300"
                            />
                            {person.photoSignedUrl ? (
                                <img
                                    src={person.photoSignedUrl}
                                    alt={`${person.first_name} ${person.last_name}`}
                                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-500">
                                    {person.first_name[0]}{person.last_name[0]}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-zinc-900">
                                    {person.first_name} {person.last_name}
                                </p>
                                {person.title && (
                                    <p className="text-xs text-zinc-500">{person.title}</p>
                                )}
                            </div>
                        </label>
                    ))}
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-zinc-100 pt-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800"
                    >
                        {t.modal_cancel}
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={selected.size === 0 || generating}
                        className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                    >
                        {generating
                            ? t.generate_generating
                            : `${t.generate_button} (${selected.size})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
