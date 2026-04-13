"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
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
import DesignerCanvas from "./designer/DesignerCanvas";
import PropertiesPanel from "./designer/PropertiesPanel";
import ElementsToolbar from "./designer/ElementsToolbar";

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
    const guest = useGuest();
    const [name, setName] = useState(initialName);
    const [config, setConfig] = useState<TemplateConfig>(() => {
        if (initialConfig) return initialConfig;
        return DEFAULT_TEMPLATE_CONFIG;
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showGrid, setShowGrid] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [companies, setCompanies] = useState<(Company & { is_sample?: boolean })[]>([]);
    const [people, setPeople] = useState<{ id: string; first_name: string; last_name: string; title: string; email: string; phone: string; photo_url: string | null; company_id: string; is_sample?: boolean }[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [previewData, setPreviewData] = useState<SampleCardData>(SAMPLE_CARD_DATA);

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            const { data: companiesData } = await supabase
                .from(TABLES.COMPANIES)
                .select("id, name, logo_url, website, is_sample");
            if (companiesData) setCompanies(companiesData);

            const { data: peopleData } = await supabase
                .from(TABLES.PEOPLE)
                .select("id, first_name, last_name, title, email, phone, photo_url, company_id, is_sample");
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
            });
        }
        loadPreview();
    }, [selectedCompanyId, selectedPersonId, companies, people]);

    const selectedElement = config.elements.find((el) => el.id === selectedId) ?? null;

    function addElement(element: CardElement) {
        setConfig((prev) => ({
            ...prev,
            elements: [...prev.elements, element],
        }));
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
            if (e.key === "Delete" || e.key === "Backspace") {
                if (selectedId && document.activeElement === document.body) {
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
            } else {
                guest.addTemplate(name, config);
            }
            router.push("/templates");
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

        router.push("/templates");
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Top bar */}
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Template name"
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium outline-none focus:border-zinc-500"
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
                <div className="flex-1" />
                <button
                    onClick={() => router.back()}
                    className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    {templateId ? "Update" : "Save"}
                </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Card size controls */}
            <div className="flex items-center gap-4">
                <div className="flex gap-1">
                    <button
                        onClick={() => setConfig((prev) => ({ ...prev, width: 450, height: 260 }))}
                        className={`rounded px-3 py-1.5 text-xs font-medium ${config.width > config.height ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                    >
                        Landscape
                    </button>
                    <button
                        onClick={() => setConfig((prev) => ({ ...prev, width: 260, height: 450 }))}
                        className={`rounded px-3 py-1.5 text-xs font-medium ${config.width < config.height ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                    >
                        Portrait
                    </button>
                    <button
                        onClick={() => setConfig((prev) => ({ ...prev, width: 350, height: 350 }))}
                        className={`rounded px-3 py-1.5 text-xs font-medium ${config.width === config.height ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                    >
                        Square
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
            <ElementsToolbar onAddElement={addElement} />

            {/* Main area: canvas + properties */}
            <div className="flex gap-6">
                {/* Canvas */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-500">Background</label>
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
                            Grid
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
                            showGrid={showGrid}
                            onSelect={setSelectedId}
                            onUpdateElement={updateElement}
                        />
                    </div>
                </div>

                {/* Properties panel */}
                <div className="w-64 shrink-0">
                    {selectedElement ? (
                        <PropertiesPanel
                            element={selectedElement}
                            cardWidth={config.width}
                            cardHeight={config.height}
                            onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                            onDelete={() => deleteElement(selectedElement.id)}
                            onDuplicate={() => duplicateElement(selectedElement.id)}
                            onMoveUp={() => moveLayer(selectedElement.id, "up")}
                            onMoveDown={() => moveLayer(selectedElement.id, "down")}
                        />
                    ) : (
                        <p className="text-sm text-zinc-400">
                            Select an element to edit its properties, or add one from the toolbar above.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
