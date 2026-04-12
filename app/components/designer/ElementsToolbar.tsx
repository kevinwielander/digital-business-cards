"use client";

import type { CardElement } from "@/lib/types";

interface ElementsToolbarProps {
    onAddElement: (element: CardElement) => void;
}

function createId() {
    return crypto.randomUUID();
}

export default function ElementsToolbar({ onAddElement }: ElementsToolbarProps) {
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
            imageSource: "logo",
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

    const buttons = [
        { label: "Text", onClick: addText, icon: "T" },
        { label: "Image", onClick: addImage, icon: "🖼" },
        { label: "Photo", onClick: addPhotoCircle, icon: "👤" },
        { label: "Shape", onClick: addShape, icon: "■" },
        { label: "QR Code", onClick: addQrCode, icon: "⊞" },
        { label: "Save Contact", onClick: addSaveContact, icon: "↓" },
    ];

    return (
        <div className="flex gap-2">
            {buttons.map((btn) => (
                <button
                    key={btn.label}
                    onClick={btn.onClick}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50 hover:shadow-md"
                >
                    <span className="text-base">{btn.icon}</span>
                    {btn.label}
                </button>
            ))}
        </div>
    );
}
