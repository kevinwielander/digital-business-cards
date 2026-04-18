"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { getGoogleFontsUrl, getUsedFonts } from "@/lib/fonts";
import {
    DEFAULT_TEMPLATE_CONFIG,
    SAMPLE_CARD_DATA,
    CARD_WIDTH,
    CARD_HEIGHT,
} from "@/lib/types";
import type { TemplateConfig, CardElement, SampleCardData } from "@/lib/types";
import { isGuestMode } from "@/lib/guest-store";
import { getSampleAssetUrl } from "@/lib/sample-utils";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "./ToastProvider";
import LayersPanel from "./designer/LayersPanel";
import DesignerCanvas from "./designer/DesignerCanvas";
import PropertiesPanel from "./designer/PropertiesPanel";
import ElementsToolbar from "./designer/ElementsToolbar";

interface Company {
    id: string;
    name: string;
    logo_url: string | null;
    custom_field_definitions?: { key: string; label: string }[];
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
    const guest = useGuest();
    const { t } = useTranslation();
    const draftKey = `cardgen_draft_${templateId ?? "new"}`;
    const [name, setName] = useState(initialName);
    const [config, setConfigInternal] = useState<TemplateConfig>(initialConfig ?? DEFAULT_TEMPLATE_CONFIG);
    const [draftRestored, setDraftRestored] = useState(false);
    const [ready, setReady] = useState(false);
    const skipAutoSave = useRef(false);

    // Undo/redo history
    const undoStack = useRef<TemplateConfig[]>([]);
    const redoStack = useRef<TemplateConfig[]>([]);

    function setConfig(newConfig: TemplateConfig | ((prev: TemplateConfig) => TemplateConfig)) {
        setConfigInternal((prev) => {
            const resolved = typeof newConfig === "function" ? newConfig(prev) : newConfig;
            undoStack.current.push(prev);
            if (undoStack.current.length > 50) undoStack.current.shift();
            redoStack.current = [];
            return resolved;
        });
    }

    function undo() {
        if (undoStack.current.length === 0) return;
        const prev = undoStack.current.pop()!;
        setConfigInternal((current) => {
            redoStack.current.push(current);
            return prev;
        });
    }

    function redo() {
        if (redoStack.current.length === 0) return;
        const next = redoStack.current.pop()!;
        setConfigInternal((current) => {
            undoStack.current.push(current);
            return next;
        });
    }

    // Restore draft from localStorage on mount (client-only)
    useEffect(() => {
        const raw = localStorage.getItem(draftKey);
        if (raw) {
            try {
                const draft = JSON.parse(raw);
                if (draft.name) setName(draft.name);
                if (draft.config) setConfig(draft.config);
                setDraftRestored(true);
            } catch { /* ignore */ }
        }

        // Load preview data from /create flow
        const createPreview = localStorage.getItem("cardgen_create_preview");
        if (createPreview) {
            try {
                const p = JSON.parse(createPreview);
                setPreviewData({
                    ...SAMPLE_CARD_DATA,
                    first_name: p.firstName || SAMPLE_CARD_DATA.first_name,
                    last_name: p.lastName || SAMPLE_CARD_DATA.last_name,
                    full_name: `${p.firstName || "Jane"} ${p.lastName || "Smith"}`,
                    title: p.title || SAMPLE_CARD_DATA.title,
                    email: p.email || SAMPLE_CARD_DATA.email,
                    phone: p.phone || SAMPLE_CARD_DATA.phone,
                    website: p.website || SAMPLE_CARD_DATA.website,
                    company: p.company || SAMPLE_CARD_DATA.company,
                    logoUrl: p.logoPreview || null,
                    photoUrl: p.photoPreview || null,
                });
                // Clean up so it doesn't persist across sessions
                localStorage.removeItem("cardgen_create_preview");
            } catch { /* ignore */ }
        }

        setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showGrid, setShowGrid] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
    const [companies, setCompanies] = useState<(Company & { is_sample?: boolean })[]>([]);
    const [people, setPeople] = useState<{ id: string; first_name: string; last_name: string; title: string; email: string; phone: string; photo_url: string | null; company_id: string; is_sample?: boolean; custom_fields?: Record<string, string> }[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [previewData, setPreviewData] = useState<SampleCardData>(SAMPLE_CARD_DATA);

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            const { data: companiesData } = await supabase
                .from(TABLES.COMPANIES)
                .select("id, name, logo_url, website, is_sample, custom_field_definitions");
            if (companiesData) setCompanies(companiesData);

            const { data: peopleData } = await supabase
                .from(TABLES.PEOPLE)
                .select("id, first_name, last_name, title, email, phone, photo_url, company_id, is_sample, custom_fields");
            if (peopleData) setPeople(peopleData);
        }
        loadData();
    }, []);

    const filteredPeople = selectedCompanyId
        ? people.filter((p) => p.company_id === selectedCompanyId)
        : people;

    useEffect(() => {
        async function loadPreview() {
            const supabase = createClient();
            const company = companies.find((c) => c.id === selectedCompanyId);
            const person = people.find((p) => p.id === selectedPersonId);

            let logoUrl: string | null = null;
            if (company?.logo_url) {
                if (company.is_sample) {
                    logoUrl = getSampleAssetUrl(company.logo_url);
                } else {
                    const { data } = await supabase.storage
                        .from(STORAGE.LOGOS)
                        .createSignedUrl(company.logo_url, 3600);
                    logoUrl = data?.signedUrl ?? null;
                }
            }

            let photoUrl: string | null = null;
            if (person?.photo_url) {
                if (person.is_sample) {
                    photoUrl = getSampleAssetUrl(person.photo_url);
                } else {
                    const { data } = await supabase.storage
                        .from(STORAGE.PHOTOS)
                        .createSignedUrl(person.photo_url, 3600);
                    photoUrl = data?.signedUrl ?? null;
                }
            }

            setPreviewData({
                ...SAMPLE_CARD_DATA,
                ...(company ? { company: company.name, website: (company as { website?: string }).website ?? "" } : {}),
                ...(person ? {
                    first_name: person.first_name,
                    last_name: person.last_name,
                    full_name: `${person.first_name} ${person.last_name}`,
                    title: person.title ?? "",
                    email: person.email ?? "",
                    phone: person.phone ?? "",
                } : {}),
                logoUrl,
                photoUrl,
                custom_fields: person?.custom_fields ?? {},
            });
        }
        loadPreview();
    }, [selectedCompanyId, selectedPersonId, companies, people]);

    const selectedElement = config.elements.find((el) => el.id === selectedId) ?? null;

    // Auto-save draft to localStorage
    useEffect(() => {
        if (skipAutoSave.current) {
            skipAutoSave.current = false;
            return;
        }
        localStorage.setItem(draftKey, JSON.stringify({ name, config }));
    }, [name, config, draftKey]);

    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    function clearDraft() {
        localStorage.removeItem(draftKey);
        setDraftRestored(false);
    }

    function discardDraft() {
        skipAutoSave.current = true;
        clearDraft();
        setName(initialName);
        setConfig(initialConfig ?? DEFAULT_TEMPLATE_CONFIG);
    }

    // Load signed URLs for asset images used in the template
    useEffect(() => {
        async function loadAssetUrls() {
            const assetPaths = config.elements
                .filter((el) => el.imageSource?.startsWith("asset:") && !el.imageSource?.startsWith("asset:data:"))
                .map((el) => el.imageSource!.slice(6));

            if (assetPaths.length === 0) { setAssetUrls({}); return; }

            const supabase = createClient();
            const urls: Record<string, string> = {};
            for (const path of assetPaths) {
                if (!assetUrls[path]) {
                    const { data } = await supabase.storage.from(STORAGE.ASSETS).createSignedUrl(path, 3600);
                    if (data?.signedUrl) urls[path] = data.signedUrl;
                } else {
                    urls[path] = assetUrls[path];
                }
            }
            setAssetUrls(urls);
        }
        loadAssetUrls();
    }, [config.elements]);

    function addElement(element: CardElement) {
        setConfig((prev) => {
            // New elements get the highest z-index
            const maxZ = prev.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
            return {
                ...prev,
                elements: [...prev.elements, { ...element, zIndex: maxZ + 1 }],
            };
        });
        setSelectedId(element.id);
    }

    function updateElement(id: string, updates: Partial<CardElement>) {
        setConfig((prev) => ({
            ...prev,
            elements: prev.elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
            ),
        }));
    }

    function deleteElement(id: string) {
        setConfig((prev) => ({
            ...prev,
            elements: prev.elements.filter((el) => el.id !== id),
        }));
        setSelectedId(null);
    }

    function moveLayer(id: string, direction: "up" | "down") {
        setConfig((prev) => ({
            ...prev,
            elements: prev.elements.map((el) => {
                if (el.id !== id) return el;
                return { ...el, zIndex: el.zIndex + (direction === "up" ? 1 : -1) };
            }),
        }));
    }

    function duplicateElement(id: string) {
        const el = config.elements.find((e) => e.id === id);
        if (!el) return;
        const newEl = { ...el, id: crypto.randomUUID(), x: el.x + 10, y: el.y + 10 };
        setConfig((prev) => ({ ...prev, elements: [...prev.elements, newEl] }));
        setSelectedId(newEl.id);
    }

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

            // Undo/redo always works (even when typing — Ctrl+Z is standard in inputs too, but we override for the designer)
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                if (!isTyping) {
                    e.preventDefault();
                    undo();
                }
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                if (!isTyping) {
                    e.preventDefault();
                    redo();
                }
            }

            // Delete/Backspace only when not typing in an input
            if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
                if (selectedId) {
                    e.preventDefault();
                    deleteElement(selectedId);
                }
            }

            if (e.key === "Escape") {
                setSelectedId(null);
            }
        },
        [selectedId]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    async function handleSave() {
        if (!name.trim()) {
            setError("Template name is required");
            return;
        }
        setError(null);

        if (isGuestMode()) {
            if (templateId) {
                guest.updateTemplate(templateId, { name, config });
                clearDraft();
                toast("Template saved successfully");
            } else {
                guest.addTemplate(name, config);
                clearDraft();
                router.push("/templates");
            }
            return;
        }

        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        if (templateId) {
            const { error } = await supabase
                .from(TABLES.TEMPLATES)
                .update({ name, config })
                .eq("id", templateId);
            if (error) {
                setError(error.message);
                return;
            }
        } else {
            const { error } = await supabase
                .from(TABLES.TEMPLATES)
                .insert({ user_id: user.id, name, config });
            if (error) {
                setError(error.message);
                return;
            }
        }

        clearDraft();
        if (templateId) {
            toast("Template saved successfully");
        } else {
            router.push("/templates");
        }
    }

    if (!ready) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="h-10 w-40 animate-pulse rounded-lg bg-zinc-200" />
                    <div className="h-10 w-36 animate-pulse rounded-lg bg-zinc-200" />
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 w-20 animate-pulse rounded-lg bg-zinc-200" />)}
                </div>
                <div className="animate-pulse rounded-xl bg-zinc-100 p-8">
                    <div className="h-[260px] w-[450px] rounded-lg bg-zinc-200" />
                </div>
            </div>
        );
    }

    const fontsUrl = getGoogleFontsUrl(getUsedFonts(config.elements));

    return (
        <div className="flex flex-col gap-6">
            {/* Load Google Fonts used in the template */}
            {fontsUrl && (
                // eslint-disable-next-line @next/next/no-css-tags
                <link rel="stylesheet" href={fontsUrl} />
            )}

            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.designer_name}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium outline-none focus:border-zinc-500 sm:w-auto"
                />
                <select
                    value={selectedCompanyId}
                    onChange={(e) => {
                        setSelectedCompanyId(e.target.value);
                        setSelectedPersonId("");
                    }}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                >
                    <option value="">Company: Sample</option>
                    {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                >
                    <option value="">Person: Sample</option>
                    {filteredPeople.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.first_name} {p.last_name}
                        </option>
                    ))}
                </select>
                <div className="hidden flex-1 sm:block" />
                <div className="flex w-full gap-2 sm:w-auto">
                    <button
                        onClick={() => {
                            if (draftRestored) {
                                setShowLeaveConfirm(true);
                            } else {
                                router.back();
                            }
                        }}
                        className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800"
                    >
                        {t.designer_cancel}
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                    >
                        {templateId ? t.designer_update : t.designer_save}
                    </button>
                </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {draftRestored && (
                <div className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
                    <span>Unsaved draft restored.</span>
                    <button onClick={discardDraft} className="font-medium underline hover:no-underline">
                        Discard draft
                    </button>
                </div>
            )}

            {/* Card size controls */}
            <div className="flex items-center gap-4">
                <div className="flex gap-1">
                    <button
                        onClick={() => setConfig((prev) => ({ ...prev, width: 450, height: 260 }))}
                        className={`rounded px-3 py-1.5 text-xs font-medium ${config.width > config.height ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                    >
                        {t.designer_landscape}
                    </button>
                    <button
                        onClick={() => setConfig((prev) => ({ ...prev, width: 260, height: 450 }))}
                        className={`rounded px-3 py-1.5 text-xs font-medium ${config.width < config.height ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                    >
                        {t.designer_portrait}
                    </button>
                    <button
                        onClick={() => setConfig((prev) => ({ ...prev, width: 350, height: 350 }))}
                        className={`rounded px-3 py-1.5 text-xs font-medium ${config.width === config.height ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                    >
                        {t.designer_square}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-zinc-500">W</label>
                    <input
                        type="number"
                        value={config.width}
                        onChange={(e) => setConfig((prev) => ({ ...prev, width: Number(e.target.value) }))}
                        className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm"
                    />
                    <label className="text-xs text-zinc-500">H</label>
                    <input
                        type="number"
                        value={config.height}
                        onChange={(e) => setConfig((prev) => ({ ...prev, height: Number(e.target.value) }))}
                        className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm"
                    />
                    <span className="text-xs text-zinc-400">px</span>
                </div>
            </div>

            {/* Elements toolbar */}
            <ElementsToolbar onAddElement={addElement} companyId={selectedCompanyId || undefined} />

            {/* Main area: canvas + properties */}
            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Canvas */}
                <div className="flex min-w-0 flex-col gap-3 overflow-x-auto">
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-500">{t.designer_background}</label>
                            <input
                                type="color"
                                value={config.backgroundColor}
                                onChange={(e) => setConfig((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                                className="h-8 w-20 cursor-pointer rounded border border-zinc-300"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                            />
                            {t.designer_grid}
                        </label>
                    </div>
                    <div className="rounded-xl bg-zinc-100 p-8">
                        <DesignerCanvas
                            width={config.width ?? CARD_WIDTH}
                            height={config.height ?? CARD_HEIGHT}
                            backgroundColor={config.backgroundColor}
                            elements={config.elements}
                            selectedId={selectedId}
                            sampleData={previewData}
                            assetUrls={assetUrls}
                            showGrid={showGrid}
                            onSelect={setSelectedId}
                            onUpdateElement={updateElement}
                        />
                    </div>
                </div>

                {/* Right sidebar: Layers + Properties split */}
                <div className="flex w-full shrink-0 flex-col lg:w-72" style={{ height: "80vh" }}>
                    {/* Layers — top half */}
                    <div className="flex-1 overflow-y-auto border-b border-zinc-200 pb-2">
                        <LayersPanel
                            elements={config.elements}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onReorder={(reordered) => setConfig((prev) => ({ ...prev, elements: reordered }))}
                            onUpdate={updateElement}
                            onDelete={deleteElement}
                            onDuplicate={duplicateElement}
                            onAddElement={() => addElement({
                                id: crypto.randomUUID(), type: "text", x: 20, y: 20, width: 160, height: 30, zIndex: 1,
                                boundField: "custom", customText: "New text", fontSize: 14, fontFamily: "Inter, sans-serif", color: "#000", textAlign: "left",
                            })}
                        />
                    </div>

                    {/* Properties — bottom half */}
                    <div className="flex-1 overflow-y-auto pt-3">
                        {selectedElement ? (
                            <PropertiesPanel
                                element={selectedElement}
                                cardWidth={config.width}
                                cardHeight={config.height}
                                companyId={selectedCompanyId || undefined}
                                customFieldDefs={companies.find((c) => c.id === selectedCompanyId)?.custom_field_definitions}
                                onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                                onDelete={() => deleteElement(selectedElement.id)}
                                onDuplicate={() => duplicateElement(selectedElement.id)}
                                onMoveUp={() => moveLayer(selectedElement.id, "up")}
                                onMoveDown={() => moveLayer(selectedElement.id, "down")}
                            />
                        ) : (
                            <p className="text-sm text-zinc-400">
                                Select an element to edit its properties.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {showLeaveConfirm && (
                <ConfirmModal
                    title="Unsaved changes"
                    message="You have unsaved changes. Do you want to discard them?"
                    confirmLabel="Discard & leave"
                    destructive
                    onConfirm={() => {
                        clearDraft();
                        router.back();
                    }}
                    onCancel={() => setShowLeaveConfirm(false)}
                />
            )}
        </div>
    );
}
