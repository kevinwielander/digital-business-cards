"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { isGuestMode } from "@/lib/guest-store";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";
import type { CustomFieldDefinition } from "@/lib/types";

const KNOWN_FIELDS = ["first_name", "last_name", "title", "email", "phone"] as const;
type KnownField = typeof KNOWN_FIELDS[number];

const FIELD_LABELS: Record<KnownField, string> = {
    first_name: "First Name",
    last_name: "Last Name",
    title: "Job Title",
    email: "Email",
    phone: "Phone",
};

// Common header aliases
const HEADER_ALIASES: Record<string, KnownField> = {
    "first name": "first_name",
    "first_name": "first_name",
    "firstname": "first_name",
    "given name": "first_name",
    "vorname": "first_name",
    "last name": "last_name",
    "last_name": "last_name",
    "lastname": "last_name",
    "surname": "last_name",
    "family name": "last_name",
    "nachname": "last_name",
    "job title": "title",
    "title": "title",
    "position": "title",
    "role": "title",
    "titel": "title",
    "email": "email",
    "e-mail": "email",
    "email address": "email",
    "phone": "phone",
    "phone number": "phone",
    "telephone": "phone",
    "tel": "phone",
    "telefon": "phone",
    "mobile": "phone",
};

function autoMapColumn(header: string): KnownField | "skip" {
    const normalized = header.toLowerCase().trim();
    return HEADER_ALIASES[normalized] ?? "skip";
}

interface Template {
    id: string;
    name: string;
}

interface BulkImportModalProps {
    onClose: () => void;
    companyId: string;
    templates: Template[];
    customFieldDefs?: CustomFieldDefinition[];
}

interface ParsedRow {
    [key: string]: string;
}

export default function BulkImportModal({ onClose, companyId, templates, customFieldDefs }: BulkImportModalProps) {
    const guest = useGuest();
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<"upload" | "map" | "preview" | "done">("upload");
    const [rawHeaders, setRawHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<ParsedRow[]>([]);
    const [columnMap, setColumnMap] = useState<Record<string, KnownField | "skip" | `custom:${string}`>>({});
    const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
    const [importing, setImporting] = useState(false);
    const [importedCount, setImportedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse<ParsedRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data.length === 0) {
                    setError("CSV file is empty");
                    return;
                }
                const headers = results.meta.fields ?? [];
                setRawHeaders(headers);
                setRows(results.data);

                // Auto-map columns
                const map: Record<string, KnownField | "skip"> = {};
                for (const h of headers) {
                    map[h] = autoMapColumn(h);
                }
                setColumnMap(map);
                setStep("map");
                setError(null);
            },
            error: (err) => {
                setError(`Failed to parse CSV: ${err.message}`);
            },
        });
    }

    function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
        const text = e.clipboardData.getData("text");
        if (!text.trim()) return;

        Papa.parse<ParsedRow>(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data.length === 0) {
                    setError("No data found in pasted content");
                    return;
                }
                const headers = results.meta.fields ?? [];
                setRawHeaders(headers);
                setRows(results.data);

                const map: Record<string, KnownField | "skip"> = {};
                for (const h of headers) {
                    map[h] = autoMapColumn(h);
                }
                setColumnMap(map);
                setStep("map");
                setError(null);
            },
        });
    }

    interface MappedRow {
        first_name: string;
        last_name: string;
        title: string;
        email: string;
        phone: string;
        custom_fields: Record<string, string>;
    }

    function getMappedRows(): MappedRow[] {
        return rows.map((row) => {
            const mapped: Record<string, string> = {
                first_name: "",
                last_name: "",
                title: "",
                email: "",
                phone: "",
            };
            const customFields: Record<string, string> = {};

            for (const [csvCol, field] of Object.entries(columnMap)) {
                if (field === "skip") continue;
                if (field.startsWith("custom:")) {
                    const key = field.slice(7);
                    customFields[key] = row[csvCol] ?? "";
                } else {
                    mapped[field] = row[csvCol] ?? "";
                }
            }
            return { ...mapped, custom_fields: customFields } as MappedRow;
        }).filter((r) => r.first_name || r.last_name);
    }

    async function handleImport() {
        setImporting(true);
        setError(null);

        const mapped = getMappedRows();
        if (mapped.length === 0) {
            setError("No valid rows to import");
            setImporting(false);
            return;
        }

        if (isGuestMode()) {
            for (const row of mapped) {
                guest.addPerson({
                    company_id: companyId,
                    template_id: templateId,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    title: row.title,
                    email: row.email,
                    phone: row.phone,
                    photo_url: null,
                });
            }
            setImportedCount(mapped.length);
            setStep("done");
            setImporting(false);
            return;
        }

        const supabase = createClient();
        const people = mapped.map((row) => ({
            company_id: companyId,
            template_id: templateId,
            first_name: row.first_name,
            last_name: row.last_name,
            title: row.title,
            email: row.email,
            phone: row.phone,
            photo_url: null,
            custom_fields: row.custom_fields,
        }));

        const { error: insertError } = await supabase.from(TABLES.PEOPLE).insert(people);
        if (insertError) {
            setError(insertError.message);
            setImporting(false);
            return;
        }

        setImportedCount(mapped.length);
        setStep("done");
        setImporting(false);
    }

    const mappedRows = step === "preview" ? getMappedRows() : [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t.import_title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                    >
                        &times;
                    </button>
                </div>

                {/* Step 1: Upload */}
                {step === "upload" && (
                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">{t.import_upload}</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.tsv,.txt"
                                onChange={handleFileUpload}
                                className="w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-zinc-200" />
                            <span className="text-sm text-zinc-400">or</span>
                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">{t.import_paste}</label>
                            <textarea
                                onPaste={handlePaste}
                                placeholder={t.import_paste_placeholder}
                                rows={5}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                            />
                        </div>

                        <div className="rounded-lg bg-zinc-50 p-4">
                            <p className="text-sm font-medium text-zinc-700">{t.import_format}</p>
                            <p className="mt-1 text-xs text-zinc-500">CSV with headers: {t.form_first_name}, {t.form_last_name}, {t.form_job_title}, {t.form_email}, {t.form_phone}</p>
                            <a
                                href="/sample-import.csv"
                                download
                                className="mt-2 inline-block text-xs font-medium text-sky-600 hover:underline"
                            >
                                {t.import_sample}
                            </a>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                )}

                {/* Step 2: Map columns */}
                {step === "map" && (
                    <div className="space-y-6">
                        <p className="text-sm text-zinc-500">
                            Found <span className="font-medium text-zinc-900">{rows.length} rows</span> with{" "}
                            <span className="font-medium text-zinc-900">{rawHeaders.length} columns</span>.
                            Map each CSV column to a field:
                        </p>

                        <div className="space-y-3">
                            {rawHeaders.map((header) => (
                                <div key={header} className="flex items-center gap-4">
                                    <span className="w-40 truncate text-sm font-medium text-zinc-700">{header}</span>
                                    <svg className="h-4 w-4 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <select
                                        value={columnMap[header]}
                                        onChange={(e) => setColumnMap({ ...columnMap, [header]: e.target.value as KnownField | "skip" | `custom:${string}` })}
                                        className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none ${
                                            columnMap[header] === "skip" ? "border-zinc-200 text-zinc-400" : "border-zinc-300 text-zinc-900"
                                        }`}
                                    >
                                        <option value="skip">{t.import_skip}</option>
                                        {KNOWN_FIELDS.map((f) => (
                                            <option key={f} value={f}>{FIELD_LABELS[f]}</option>
                                        ))}
                                        {customFieldDefs && customFieldDefs.length > 0 && (
                                            <optgroup label="Custom Fields">
                                                {customFieldDefs.map((def) => (
                                                    <option key={def.key} value={`custom:${def.key}`}>{def.label}</option>
                                                ))}
                                            </optgroup>
                                        )}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Template for imported people</label>
                            <select
                                value={templateId}
                                onChange={(e) => setTemplateId(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                            >
                                {templates.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setStep("upload")} className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800">
                                Back
                            </button>
                            <button
                                onClick={() => setStep("preview")}
                                disabled={!Object.values(columnMap).some((v) => v !== "skip")}
                                className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
                            >
                                Preview
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Preview */}
                {step === "preview" && (
                    <div className="space-y-6">
                        <p className="text-sm text-zinc-500">
                            Ready to import <span className="font-medium text-zinc-900">{mappedRows.length} people</span>.
                            Review the data below:
                        </p>

                        <div className="max-h-72 overflow-auto rounded-lg border border-zinc-200">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-zinc-50 text-xs uppercase text-zinc-500">
                                    <tr>
                                        <th className="px-3 py-2">First Name</th>
                                        <th className="px-3 py-2">Last Name</th>
                                        <th className="px-3 py-2">Title</th>
                                        <th className="px-3 py-2">Email</th>
                                        <th className="px-3 py-2">Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mappedRows.map((row, i) => (
                                        <tr key={i} className="border-t border-zinc-100">
                                            <td className="px-3 py-2">{row.first_name}</td>
                                            <td className="px-3 py-2">{row.last_name}</td>
                                            <td className="px-3 py-2 text-zinc-500">{row.title}</td>
                                            <td className="px-3 py-2 text-zinc-500">{row.email}</td>
                                            <td className="px-3 py-2 text-zinc-500">{row.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setStep("map")} className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800">
                                Back
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={importing || mappedRows.length === 0}
                                className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
                            >
                                {importing ? "Importing..." : `Import ${mappedRows.length} People`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Done */}
                {step === "done" && (
                    <div className="space-y-6 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-zinc-900">Import Complete</p>
                            <p className="mt-1 text-sm text-zinc-500">
                                Successfully imported {importedCount} {importedCount === 1 ? "person" : "people"}.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                onClose();
                                window.location.reload();
                            }}
                            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
