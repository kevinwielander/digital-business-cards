"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { isGuestMode } from "@/lib/guest-store";
import { getSampleAssetUrl } from "@/lib/sample-utils";
import { useGuest } from "./GuestProvider";
import ImageUpload from "./ImageUpload";
import ConfirmModal from "./ConfirmModal";
import CardPreviewRenderer from "./designer/CardPreviewRenderer";
import type { TemplateConfig, SampleCardData } from "@/lib/types";
import { SAMPLE_CARD_DATA } from "@/lib/types";

interface Template {
    id: string;
    name: string;
}

interface PersonModalProps {
    onClose: () => void;
    companyId: string;
    templates: Template[];
    companyName?: string;
    companyLogoUrl?: string | null;
    person?: {
        id: string;
        first_name: string;
        last_name: string;
        title: string;
        email: string;
        phone: string;
        photo_url: string | null;
        photoSignedUrl: string | null;
        template_id: string | null;
    };
}

export default function PersonModal({ onClose, companyId, templates, companyName, companyLogoUrl, person }: PersonModalProps) {
    const guest = useGuest();
    const [firstName, setFirstName] = useState(person?.first_name ?? "");
    const [lastName, setLastName] = useState(person?.last_name ?? "");
    const [title, setTitle] = useState(person?.title ?? "");
    const [email, setEmail] = useState(person?.email ?? "");
    const [phone, setPhone] = useState(person?.phone ?? "");
    const [templateId, setTemplateId] = useState(person?.template_id ?? templates[0]?.id ?? "");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(person?.photoSignedUrl ?? null);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null);

    // Load template config when templateId changes
    useEffect(() => {
        async function loadTemplate() {
            if (!templateId) { setTemplateConfig(null); return; }

            // Check guest templates first
            if (isGuestMode()) {
                const guestTemplate = guest.data.templates.find((t) => t.id === templateId);
                if (guestTemplate) {
                    setTemplateConfig(guestTemplate.config as TemplateConfig);
                    return;
                }
            }

            const supabase = createClient();
            const { data } = await supabase
                .from(TABLES.TEMPLATES)
                .select("config")
                .eq("id", templateId)
                .single();
            if (data) setTemplateConfig(data.config);
        }
        loadTemplate();
    }, [templateId]);

    // Update photo preview when a new file is selected
    useEffect(() => {
        if (photo) {
            const url = URL.createObjectURL(photo);
            setPhotoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [photo]);

    const previewData: SampleCardData = {
        first_name: firstName || "First",
        last_name: lastName || "Last",
        full_name: `${firstName || "First"} ${lastName || "Last"}`,
        title: title || "Job Title",
        email: email || "email@company.com",
        phone: phone || "+1 555 000 0000",
        address: "",
        company: companyName || "Company",
        website: "",
        logoUrl: companyLogoUrl ?? null,
        photoUrl: photoPreview,
    };

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!templateId) {
            setError("Please select a template");
            return;
        }

        if (isGuestMode()) {
            const row = {
                company_id: companyId,
                template_id: templateId,
                first_name: firstName,
                last_name: lastName,
                title,
                email,
                phone,
                photo_url: null as string | null,
            };
            if (person) {
                guest.updatePerson(person.id, row);
            } else {
                guest.addPerson(row);
            }
            onClose();
            return;
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let photoPath = person?.photo_url ?? null;

        if (photo) {
            const fileExt = photo.name.split(".").pop();
            const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE.PHOTOS)
                .upload(filePath, photo);

            if (uploadError) {
                setError(uploadError.message);
                return;
            }
            photoPath = filePath;
        }

        const row = {
            company_id: companyId,
            template_id: templateId,
            first_name: firstName,
            last_name: lastName,
            title,
            email,
            phone,
            photo_url: photoPath,
        };

        if (person) {
            const { error } = await supabase
                .from(TABLES.PEOPLE)
                .update(row)
                .eq("id", person.id);
            if (error) { setError(error.message); return; }
        } else {
            const { error } = await supabase
                .from(TABLES.PEOPLE)
                .insert(row);
            if (error) { setError(error.message); return; }
        }

        onClose();
    }

    async function handleDelete() {
        if (!person) return;

        if (isGuestMode()) {
            guest.deletePerson(person.id);
            onClose();
            return;
        }

        const supabase = createClient();
        const { error } = await supabase
            .from(TABLES.PEOPLE)
            .delete()
            .eq("id", person.id);

        if (error) {
            setError(error.message);
            setShowDeleteConfirm(false);
            return;
        }

        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="flex w-full max-w-4xl gap-6 rounded-xl bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Form */}
                <div className="w-1/2">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {person ? "Edit Person" : "Add Person"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                        >
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Job Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Template</label>
                            {templates.length === 0 ? (
                                <p className="text-sm text-red-500">No templates available. Create one first.</p>
                            ) : (
                                <select
                                    value={templateId}
                                    onChange={(e) => setTemplateId(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                                >
                                    {templates.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <ImageUpload
                            label="Photo"
                            onImageReady={(file) => setPhoto(file)}
                            currentImageUrl={person?.photoSignedUrl}
                            aspectRatio={1}
                            shape="round"
                        />

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="flex items-center justify-between pt-2">
                            {person ? (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            ) : <div />}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={templates.length === 0}
                                    className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
                                >
                                    {person ? "Update" : "Add"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="flex w-1/2 flex-col">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Live Preview</h3>
                    <div className="flex flex-1 items-center justify-center rounded-xl bg-zinc-50 p-6">
                        {templateConfig ? (
                            <CardPreviewRenderer
                                config={templateConfig}
                                data={previewData}
                                scale={0.8}
                            />
                        ) : (
                            <p className="text-sm text-zinc-400">Select a template to see a preview</p>
                        )}
                    </div>
                </div>
            </div>
            {showDeleteConfirm && person && (
                <ConfirmModal
                    title="Delete Person"
                    message={`Are you sure you want to delete ${person.first_name} ${person.last_name}? This cannot be undone.`}
                    confirmLabel="Delete"
                    destructive
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
}
