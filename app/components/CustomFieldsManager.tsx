"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { useTranslation } from "./I18nProvider";
import type { CustomFieldDefinition } from "@/lib/types";

interface CustomFieldsManagerProps {
    companyId: string;
    initialDefs: CustomFieldDefinition[];
}

export default function CustomFieldsManager({ companyId, initialDefs }: CustomFieldsManagerProps) {
    const { t } = useTranslation();
    const [defs, setDefs] = useState<CustomFieldDefinition[]>(initialDefs);
    const [newLabel, setNewLabel] = useState("");
    const [saving, setSaving] = useState(false);

    async function addField() {
        if (!newLabel.trim()) return;

        const key = newLabel.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        if (defs.some((d) => d.key === key)) return;

        const updated = [...defs, { key, label: newLabel.trim() }];
        setDefs(updated);
        setNewLabel("");
        await saveDefs(updated);
    }

    async function removeField(key: string) {
        const updated = defs.filter((d) => d.key !== key);
        setDefs(updated);
        await saveDefs(updated);
    }

    async function saveDefs(updated: CustomFieldDefinition[]) {
        setSaving(true);
        const supabase = createClient();
        await supabase
            .from(TABLES.COMPANIES)
            .update({ custom_field_definitions: updated })
            .eq("id", companyId);
        setSaving(false);
    }

    return (
        <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{t.custom_fields_title}</h2>
                {saving && <span className="text-xs text-zinc-400">Saving...</span>}
            </div>
            <p className="mb-3 text-sm text-zinc-500">
                {t.custom_fields_desc}
            </p>

            {defs.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {defs.map((def) => (
                        <span
                            key={def.key}
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm"
                        >
                            {def.label}
                            <button
                                onClick={() => removeField(def.key)}
                                className="text-zinc-400 hover:text-red-500"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addField())}
                    placeholder={t.custom_fields_placeholder}
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
                <button
                    onClick={addField}
                    disabled={!newLabel.trim()}
                    className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-50"
                >
                    {t.custom_fields_add}
                </button>
            </div>
        </div>
    );
}
