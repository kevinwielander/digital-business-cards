"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE } from "@/lib/supabase/constants";
import type { CardElement } from "@/lib/types";
import IconPicker from "./IconPicker";

interface ElementsToolbarProps {
    onAddElement: (element: CardElement) => void;
    companyId?: string;
}

function createId() {
    return crypto.randomUUID();
}

const BTN = "flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium shadow-sm transition hover:bg-zinc-50 hover:shadow-md";

export default function ElementsToolbar({ onAddElement, companyId }: ElementsToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [showShapes, setShowShapes] = useState(false);

    function addText() {
        onAddElement({
            id: createId(), type: "text", x: 20, y: 20, width: 160, height: 30, zIndex: 10,
            boundField: "full_name", fontSize: 16, fontFamily: "Inter, sans-serif", fontWeight: "600", color: "#1a1a1a", textAlign: "left",
        });
    }

    function addPhoto() {
        onAddElement({
            id: createId(), type: "image", x: 20, y: 60, width: 80, height: 80, zIndex: 10,
            imageSource: "photo", objectFit: "cover", borderRadius: 999,
        });
    }

    function addRect() {
        onAddElement({
            id: createId(), type: "shape", x: 0, y: 0, width: 450, height: 8, zIndex: 1,
            backgroundColor: "#3b82f6", shapeRadius: 0,
        });
        setShowShapes(false);
    }

    function addRoundedRect() {
        onAddElement({
            id: createId(), type: "shape", x: 20, y: 20, width: 120, height: 80, zIndex: 1,
            backgroundColor: "#3b82f6", shapeRadius: 12,
        });
        setShowShapes(false);
    }

    function addCircle() {
        onAddElement({
            id: createId(), type: "shape", x: 20, y: 20, width: 80, height: 80, zIndex: 1,
            backgroundColor: "#3b82f6", shapeRadius: 999,
        });
        setShowShapes(false);
    }

    function addLine() {
        onAddElement({
            id: createId(), type: "shape", x: 20, y: 130, width: 200, height: 2, zIndex: 1,
            backgroundColor: "#d4d4d8", shapeRadius: 1,
        });
        setShowShapes(false);
    }

    function addQrCode() {
        onAddElement({
            id: createId(), type: "qrcode", x: 350, y: 170, width: 80, height: 80, zIndex: 10,
        });
    }

    function addSaveContact() {
        onAddElement({
            id: createId(), type: "save-contact", x: 20, y: 220, width: 120, height: 28, zIndex: 10,
            fontSize: 12, color: "#3b82f6", fontFamily: "Inter, sans-serif", fontWeight: "500", customText: "Save Contact",
        });
    }

    async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !companyId) return;

        setUploading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setUploading(false); return; }

        const prefix = crypto.randomUUID().slice(0, 8);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `${user.id}/${companyId}/${prefix}-${safeName}`;

        const { error } = await supabase.storage
            .from(STORAGE.ASSETS)
            .upload(storagePath, file, { contentType: file.type });

        if (error) { alert(error.message); setUploading(false); return; }

        onAddElement({
            id: createId(), type: "image", x: 20, y: 20, width: 150, height: 100, zIndex: 10,
            imageSource: `asset:${storagePath}`, objectFit: "contain", borderRadius: 0,
        });

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {/* Text */}
            <button onClick={addText} className={BTN}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                Text
            </button>

            {/* Photo */}
            <button onClick={addPhoto} className={BTN}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Photo
            </button>

            {/* Shapes dropdown */}
            <div className="relative">
                <button onClick={() => setShowShapes(!showShapes)} className={BTN}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                    Shapes
                    <svg className="h-3 w-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {showShapes && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                        <button onClick={addRect} className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-zinc-50">
                            <svg className="h-4 w-6" viewBox="0 0 24 16"><rect width="24" height="16" fill="#a1a1aa" /></svg>
                            Rectangle
                        </button>
                        <button onClick={addRoundedRect} className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-zinc-50">
                            <svg className="h-4 w-6" viewBox="0 0 24 16"><rect width="24" height="16" rx="4" fill="#a1a1aa" /></svg>
                            Rounded
                        </button>
                        <button onClick={addCircle} className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-zinc-50">
                            <svg className="h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#a1a1aa" /></svg>
                            Circle
                        </button>
                        <button onClick={addLine} className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-zinc-50">
                            <svg className="h-4 w-6" viewBox="0 0 24 4"><rect width="24" height="2" y="1" fill="#a1a1aa" rx="1" /></svg>
                            Line / Divider
                        </button>
                    </div>
                )}
            </div>

            {/* QR Code */}
            <button onClick={addQrCode} className={BTN}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="8" height="8" rx="1" /><rect x="14" y="2" width="8" height="8" rx="1" /><rect x="2" y="14" width="8" height="8" rx="1" /><rect x="14" y="14" width="4" height="4" /><line x1="22" y1="14" x2="22" y2="22" /><line x1="14" y1="22" x2="22" y2="22" />
                </svg>
                QR
            </button>

            {/* Save Contact */}
            <button onClick={addSaveContact} className={BTN}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Save Contact
            </button>

            {/* Icons */}
            <IconPicker onAddIcon={onAddElement} />

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-zinc-200" />

            {/* Upload image */}
            {companyId ? (
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 shadow-sm transition hover:bg-sky-100 hover:shadow-md">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {uploading ? "Uploading..." : "Upload"}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadImage} className="hidden" disabled={uploading} />
                </label>
            ) : (
                <span className="text-xs text-zinc-400">Select a company to upload</span>
            )}
        </div>
    );
}
