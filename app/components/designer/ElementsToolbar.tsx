"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE } from "@/lib/supabase/constants";
import type { CardElement } from "@/lib/types";

interface ElementsToolbarProps {
    onAddElement: (element: CardElement) => void;
    companyId?: string;
}

function createId() {
    return crypto.randomUUID();
}

export default function ElementsToolbar({ onAddElement, companyId }: ElementsToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    function addText() {
        onAddElement({
            id: createId(),
            type: "text",
            x: 20,
            y: 20,
            width: 160,
            height: 30,
            zIndex: 10,
            boundField: "full_name",
            fontSize: 16,
            fontFamily: "sans-serif",
            fontWeight: "600",
            color: "#1a1a1a",
            textAlign: "left",
        });
    }

    function addImage() {
        onAddElement({
            id: createId(),
            type: "image",
            x: 20,
            y: 20,
            width: 80,
            height: 80,
            zIndex: 10,
            imageSource: "photo",
            objectFit: "contain",
            borderRadius: 0,
        });
    }

    function addShape() {
        onAddElement({
            id: createId(),
            type: "shape",
            x: 0,
            y: 0,
            width: 450,
            height: 8,
            zIndex: 1,
            backgroundColor: "#3b82f6",
            shapeRadius: 0,
        });
    }

    function addPhotoCircle() {
        onAddElement({
            id: createId(),
            type: "image",
            x: 20,
            y: 60,
            width: 80,
            height: 80,
            zIndex: 10,
            imageSource: "photo",
            objectFit: "cover",
            borderRadius: 999,
        });
    }

    function addQrCode() {
        onAddElement({
            id: createId(),
            type: "qrcode",
            x: 350,
            y: 170,
            width: 80,
            height: 80,
            zIndex: 10,
        });
    }

    function addSaveContact() {
        onAddElement({
            id: createId(),
            type: "save-contact",
            x: 20,
            y: 220,
            width: 120,
            height: 28,
            zIndex: 10,
            fontSize: 12,
            color: "#3b82f6",
            fontFamily: "sans-serif",
            fontWeight: "500",
            customText: "Save Contact",
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

        if (error) {
            alert(error.message);
            setUploading(false);
            return;
        }

        // Create an image element with the uploaded asset
        onAddElement({
            id: createId(),
            type: "image",
            x: 20,
            y: 20,
            width: 150,
            height: 100,
            zIndex: 10,
            imageSource: `asset:${storagePath}`,
            objectFit: "contain",
            borderRadius: 0,
        });

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <div className="flex flex-wrap gap-2">
            <button onClick={addText} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50 hover:shadow-md">
                <span className="text-base">T</span> Text
            </button>
            <button onClick={addImage} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50 hover:shadow-md">
                <span className="text-base">👤</span> Photo
            </button>
            <button onClick={addShape} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50 hover:shadow-md">
                <span className="text-base">■</span> Shape
            </button>
            <button onClick={addQrCode} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50 hover:shadow-md">
                <span className="text-base">⊞</span> QR Code
            </button>
            <button onClick={addSaveContact} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50 hover:shadow-md">
                <span className="text-base">↓</span> Save Contact
            </button>

            {/* Upload image — adds to company assets + creates element */}
            {companyId ? (
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 shadow-sm transition hover:bg-sky-100 hover:shadow-md">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            ) : (
                <span className="flex items-center px-3 py-2 text-xs text-zinc-400">
                    Select a company to upload images
                </span>
            )}
        </div>
    );
}
