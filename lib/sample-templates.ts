import type { TemplateConfig, CardElement } from "./types";

function el(overrides: Partial<CardElement> & { id: string; type: CardElement["type"] }): CardElement {
    return {
        x: 0,
        y: 0,
        width: 100,
        height: 30,
        zIndex: 1,
        ...overrides,
    };
}

export const SAMPLE_TEMPLATES: { name: string; config: TemplateConfig }[] = [
    {
        name: "Classic Horizontal",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#ffffff",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 450, height: 6, backgroundColor: "#1e3a5f", zIndex: 1 }),
                el({ id: "i1", type: "image", x: 24, y: 28, width: 64, height: 64, imageSource: "logo", objectFit: "contain", zIndex: 2 }),
                el({ id: "p1", type: "image", x: 24, y: 110, width: 60, height: 60, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 2 }),
                el({ id: "t1", type: "text", x: 100, y: 110, width: 200, height: 28, boundField: "full_name", fontSize: 18, fontWeight: "600", color: "#1a1a1a", zIndex: 2 }),
                el({ id: "t2", type: "text", x: 100, y: 138, width: 200, height: 22, boundField: "title", fontSize: 13, color: "#6b7280", zIndex: 2 }),
                el({ id: "t3", type: "text", x: 100, y: 160, width: 200, height: 22, boundField: "company", fontSize: 13, fontWeight: "500", color: "#1e3a5f", zIndex: 2 }),
                el({ id: "t4", type: "text", x: 24, y: 200, width: 200, height: 18, boundField: "email", fontSize: 11, color: "#9ca3af", zIndex: 2 }),
                el({ id: "t5", type: "text", x: 24, y: 220, width: 200, height: 18, boundField: "phone", fontSize: 11, color: "#9ca3af", zIndex: 2 }),
                el({ id: "q1", type: "qrcode", x: 350, y: 160, width: 76, height: 76, zIndex: 2 }),
            ],
        },
    },
    {
        name: "Modern Dark",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#18181b",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 160, height: 260, backgroundColor: "#3b82f6", zIndex: 1 }),
                el({ id: "p1", type: "image", x: 30, y: 50, width: 100, height: 100, imageSource: "photo", objectFit: "cover", borderRadius: 12, zIndex: 2 }),
                el({ id: "i1", type: "image", x: 45, y: 170, width: 70, height: 40, imageSource: "logo", objectFit: "contain", zIndex: 2 }),
                el({ id: "t1", type: "text", x: 185, y: 40, width: 240, height: 30, boundField: "full_name", fontSize: 20, fontWeight: "bold", color: "#ffffff", zIndex: 2 }),
                el({ id: "t2", type: "text", x: 185, y: 72, width: 240, height: 22, boundField: "title", fontSize: 13, color: "#a1a1aa", zIndex: 2 }),
                el({ id: "s2", type: "shape", x: 185, y: 100, width: 40, height: 3, backgroundColor: "#3b82f6", shapeRadius: 2, zIndex: 2 }),
                el({ id: "t3", type: "text", x: 185, y: 118, width: 240, height: 20, boundField: "company", fontSize: 12, fontWeight: "500", color: "#3b82f6", zIndex: 2 }),
                el({ id: "t4", type: "text", x: 185, y: 160, width: 240, height: 18, boundField: "email", fontSize: 11, color: "#71717a", zIndex: 2 }),
                el({ id: "t5", type: "text", x: 185, y: 180, width: 240, height: 18, boundField: "phone", fontSize: 11, color: "#71717a", zIndex: 2 }),
                el({ id: "q1", type: "qrcode", x: 355, y: 170, width: 70, height: 70, zIndex: 2 }),
            ],
        },
    },
    {
        name: "Minimal Portrait",
        config: {
            width: 280,
            height: 450,
            backgroundColor: "#fafafa",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 280, height: 140, backgroundColor: "#0f172a", zIndex: 1 }),
                el({ id: "i1", type: "image", x: 20, y: 20, width: 80, height: 40, imageSource: "logo", objectFit: "contain", zIndex: 2 }),
                el({ id: "p1", type: "image", x: 100, y: 100, width: 80, height: 80, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 3, border: "3px solid #fafafa" }),
                el({ id: "t1", type: "text", x: 20, y: 200, width: 240, height: 28, boundField: "full_name", fontSize: 18, fontWeight: "600", color: "#0f172a", textAlign: "center", zIndex: 2 }),
                el({ id: "t2", type: "text", x: 20, y: 228, width: 240, height: 22, boundField: "title", fontSize: 12, color: "#64748b", textAlign: "center", zIndex: 2 }),
                el({ id: "t3", type: "text", x: 20, y: 252, width: 240, height: 22, boundField: "company", fontSize: 12, fontWeight: "500", color: "#0f172a", textAlign: "center", zIndex: 2 }),
                el({ id: "s2", type: "shape", x: 110, y: 284, width: 60, height: 2, backgroundColor: "#e2e8f0", zIndex: 2 }),
                el({ id: "t4", type: "text", x: 20, y: 300, width: 240, height: 18, boundField: "email", fontSize: 11, color: "#94a3b8", textAlign: "center", zIndex: 2 }),
                el({ id: "t5", type: "text", x: 20, y: 320, width: 240, height: 18, boundField: "phone", fontSize: 11, color: "#94a3b8", textAlign: "center", zIndex: 2 }),
                el({ id: "q1", type: "qrcode", x: 100, y: 355, width: 80, height: 80, zIndex: 2 }),
            ],
        },
    },
    {
        name: "Bold Accent",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#ffffff",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 450, height: 260, backgroundColor: "#f0fdf4", zIndex: 0 }),
                el({ id: "s2", type: "shape", x: 0, y: 0, width: 10, height: 260, backgroundColor: "#16a34a", zIndex: 1 }),
                el({ id: "t1", type: "text", x: 30, y: 30, width: 280, height: 32, boundField: "full_name", fontSize: 22, fontWeight: "bold", color: "#14532d", textTransform: "uppercase", letterSpacing: 1, zIndex: 2 }),
                el({ id: "t2", type: "text", x: 30, y: 65, width: 280, height: 22, boundField: "title", fontSize: 13, color: "#4ade80", fontWeight: "500", zIndex: 2 }),
                el({ id: "t3", type: "text", x: 30, y: 90, width: 280, height: 22, boundField: "company", fontSize: 13, color: "#166534", zIndex: 2 }),
                el({ id: "i1", type: "image", x: 350, y: 20, width: 76, height: 40, imageSource: "logo", objectFit: "contain", zIndex: 2 }),
                el({ id: "s3", type: "shape", x: 30, y: 130, width: 390, height: 1, backgroundColor: "#bbf7d0", zIndex: 1 }),
                el({ id: "t4", type: "text", x: 30, y: 150, width: 200, height: 18, boundField: "email", fontSize: 12, color: "#6b7280", zIndex: 2 }),
                el({ id: "t5", type: "text", x: 30, y: 172, width: 200, height: 18, boundField: "phone", fontSize: 12, color: "#6b7280", zIndex: 2 }),
                el({ id: "t6", type: "text", x: 30, y: 194, width: 200, height: 18, boundField: "address", fontSize: 12, color: "#6b7280", zIndex: 2 }),
                el({ id: "sc", type: "save-contact", x: 30, y: 224, width: 120, height: 22, fontSize: 11, color: "#16a34a", fontWeight: "500", customText: "Save Contact", zIndex: 2 }),
                el({ id: "q1", type: "qrcode", x: 350, y: 150, width: 76, height: 76, zIndex: 2 }),
            ],
        },
    },
];
