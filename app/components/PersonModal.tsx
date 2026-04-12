"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import ImageUpload from "./ImageUpload";

interface Template {
    id: string;
    name: string;
}

interface PersonModalProps {
    onClose: () => void;
    companyId: string;
    templates: Template[];
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

export default function PersonModal({ onClose, companyId, templates, person }: PersonModalProps) {
    const [firstName, setFirstName] = useState(person?.first_name ?? "");
    const [lastName, setLastName] = useState(person?.last_name ?? "");
    const [title, setTitle] = useState(person?.title ?? "");
    const [email, setEmail] = useState(person?.email ?? "");
    const [phone, setPhone] = useState(person?.phone ?? "");
    const [templateId, setTemplateId] = useState(person?.template_id ?? templates[0]?.id ?? "");
    const [photo, setPhoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!templateId) {
            setError("Please select a template");
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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
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
                        aspectRatio={1}
                        shape="round"
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
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
                </form>
            </div>
        </div>
    );
}
