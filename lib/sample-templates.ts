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
    // --- PORTRAIT TEMPLATES (mobile-first, show first) ---
    {
        name: "Modern Portrait",
        config: {
            width: 320,
            height: 520,
            backgroundColor: "#ffffff",
            pageBackgroundColor: "#f0f0f0",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 320, height: 180, gradient: "linear-gradient(135deg, #667eea, #764ba2)", zIndex: 1 }),
                el({ id: "p1", type: "image", x: 110, y: 120, width: 100, height: 100, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", border: "4px solid #ffffff" }),
                el({ id: "t1", type: "text", x: 20, y: 240, width: 280, height: 30, boundField: "full_name", fontSize: 22, fontWeight: "bold", color: "#1a1a1a", textAlign: "center", zIndex: 2 }),
                el({ id: "t2", type: "text", x: 20, y: 272, width: 280, height: 22, boundField: "title", fontSize: 13, color: "#64748b", textAlign: "center", zIndex: 2 }),
                el({ id: "t3", type: "text", x: 20, y: 296, width: 280, height: 22, boundField: "company", fontSize: 13, fontWeight: "600", color: "#667eea", textAlign: "center", zIndex: 2 }),
                el({ id: "s2", type: "shape", x: 120, y: 328, width: 80, height: 2, gradient: "linear-gradient(90deg, #667eea, #764ba2)", shapeRadius: 1, zIndex: 2 }),
                el({ id: "t4", type: "text", x: 20, y: 345, width: 280, height: 18, boundField: "email", fontSize: 11, color: "#94a3b8", textAlign: "center", zIndex: 2 }),
                el({ id: "t5", type: "text", x: 20, y: 365, width: 280, height: 18, boundField: "phone", fontSize: 11, color: "#94a3b8", textAlign: "center", zIndex: 2 }),
                el({ id: "t6", type: "text", x: 20, y: 385, width: 280, height: 18, boundField: "website", fontSize: 11, color: "#94a3b8", textAlign: "center", zIndex: 2 }),
                el({ id: "sc", type: "save-contact", x: 100, y: 420, width: 120, height: 22, fontSize: 11, color: "#667eea", fontWeight: "500", customText: "Save Contact", zIndex: 2 }),
                el({ id: "q1", type: "qrcode", x: 120, y: 450, width: 80, height: 80, zIndex: 2, opacity: 0 }),
            ],
        },
    },
    {
        name: "Dark Portrait",
        config: {
            width: 320,
            height: 520,
            backgroundColor: "#0f172a",
            pageBackgroundColor: "#020617",
            elements: [
                el({ id: "p1", type: "image", x: 0, y: 0, width: 320, height: 200, imageSource: "photo", objectFit: "cover", zIndex: 1 }),
                el({ id: "s1", type: "shape", x: 0, y: 150, width: 320, height: 80, gradient: "linear-gradient(180deg, transparent, #0f172a)", zIndex: 2 }),
                el({ id: "t1", type: "text", x: 24, y: 220, width: 272, height: 28, boundField: "full_name", fontSize: 22, fontWeight: "bold", color: "#ffffff", zIndex: 3 }),
                el({ id: "t2", type: "text", x: 24, y: 250, width: 272, height: 20, boundField: "title", fontSize: 12, color: "#94a3b8", zIndex: 3 }),
                el({ id: "t3", type: "text", x: 24, y: 272, width: 272, height: 20, boundField: "company", fontSize: 12, fontWeight: "600", color: "#38bdf8", zIndex: 3 }),
                el({ id: "s2", type: "shape", x: 24, y: 304, width: 60, height: 2, backgroundColor: "#38bdf8", shapeRadius: 1, zIndex: 3 }),
                el({ id: "t4", type: "text", x: 24, y: 320, width: 272, height: 18, boundField: "email", fontSize: 11, color: "#64748b", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 24, y: 340, width: 272, height: 18, boundField: "phone", fontSize: 11, color: "#64748b", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 24, y: 360, width: 272, height: 18, boundField: "website", fontSize: 11, color: "#64748b", zIndex: 3 }),
                el({ id: "sc", type: "save-contact", x: 24, y: 400, width: 120, height: 22, fontSize: 11, color: "#38bdf8", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
                el({ id: "i1", type: "image", x: 220, y: 440, width: 76, height: 40, imageSource: "logo", objectFit: "contain", imageOpacity: 0.4, zIndex: 3 }),
            ],
        },
    },
    {
        name: "Clean Portrait",
        config: {
            width: 320,
            height: 520,
            backgroundColor: "#fafafa",
            pageBackgroundColor: "#e5e5e5",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 6, height: 520, gradient: "linear-gradient(180deg, #16a34a, #15803d)", zIndex: 1 }),
                el({ id: "p1", type: "image", x: 30, y: 40, width: 90, height: 90, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 2 }),
                el({ id: "i1", type: "image", x: 220, y: 40, width: 76, height: 36, imageSource: "logo", objectFit: "contain", zIndex: 2 }),
                el({ id: "t1", type: "text", x: 30, y: 150, width: 260, height: 28, boundField: "full_name", fontSize: 24, fontWeight: "bold", color: "#0f172a", fontFamily: "Georgia, serif", zIndex: 2 }),
                el({ id: "t2", type: "text", x: 30, y: 182, width: 260, height: 20, boundField: "title", fontSize: 12, color: "#16a34a", textTransform: "uppercase", letterSpacing: 2, zIndex: 2 }),
                el({ id: "t3", type: "text", x: 30, y: 206, width: 260, height: 20, boundField: "company", fontSize: 13, color: "#64748b", zIndex: 2 }),
                el({ id: "s2", type: "shape", x: 30, y: 240, width: 260, height: 1, backgroundColor: "#e2e8f0", zIndex: 1 }),
                el({ id: "t4", type: "text", x: 30, y: 260, width: 260, height: 18, boundField: "email", fontSize: 12, color: "#64748b", zIndex: 2 }),
                el({ id: "t5", type: "text", x: 30, y: 282, width: 260, height: 18, boundField: "phone", fontSize: 12, color: "#64748b", zIndex: 2 }),
                el({ id: "t6", type: "text", x: 30, y: 304, width: 260, height: 18, boundField: "website", fontSize: 12, color: "#64748b", zIndex: 2 }),
                el({ id: "s3", type: "shape", x: 30, y: 340, width: 260, height: 1, backgroundColor: "#e2e8f0", zIndex: 1 }),
                el({ id: "sc", type: "save-contact", x: 30, y: 360, width: 120, height: 22, fontSize: 11, color: "#16a34a", fontWeight: "500", customText: "Save Contact", zIndex: 2 }),
            ],
        },
    },
    // --- LANDSCAPE TEMPLATES ---
    {
        name: "Gradient Wave",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#0f172a",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 450, height: 100, gradient: "linear-gradient(135deg, #667eea, #764ba2)", zIndex: 1 }),
                el({ id: "s2", type: "shape", x: -20, y: 70, width: 490, height: 60, backgroundColor: "#0f172a", shapeRadius: 999, zIndex: 2 }),
                el({ id: "i1", type: "image", x: 24, y: 18, width: 60, height: 36, imageSource: "logo", objectFit: "contain", zIndex: 3 }),
                el({ id: "p1", type: "image", x: 340, y: 30, width: 84, height: 84, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }),
                el({ id: "t1", type: "text", x: 24, y: 105, width: 300, height: 30, boundField: "full_name", fontSize: 22, fontWeight: "bold", color: "#ffffff", textShadow: "0 1px 2px rgba(0,0,0,0.2)", zIndex: 3 }),
                el({ id: "t2", type: "text", x: 24, y: 135, width: 300, height: 22, boundField: "title", fontSize: 13, color: "#94a3b8", zIndex: 3 }),
                el({ id: "t3", type: "text", x: 24, y: 157, width: 300, height: 22, boundField: "company", fontSize: 13, fontWeight: "500", color: "#a78bfa", zIndex: 3 }),
                el({ id: "s3", type: "shape", x: 24, y: 188, width: 50, height: 2, gradient: "linear-gradient(90deg, #667eea, #764ba2)", shapeRadius: 2, zIndex: 3 }),
                el({ id: "t4", type: "text", x: 24, y: 200, width: 200, height: 18, boundField: "email", fontSize: 11, color: "#64748b", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 24, y: 218, width: 200, height: 18, boundField: "phone", fontSize: 11, color: "#64748b", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 24, y: 236, width: 200, height: 18, boundField: "website", fontSize: 11, color: "#64748b", zIndex: 3 }),
                el({ id: "sc", type: "save-contact", x: 330, y: 236, width: 110, height: 20, fontSize: 10, color: "#a78bfa", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
            ],
        },
    },
    {
        name: "Photo Splash",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#ffffff",
            elements: [
                el({ id: "p1", type: "image", x: 0, y: 0, width: 180, height: 260, imageSource: "photo", objectFit: "cover", zIndex: 1 }),
                el({ id: "s1", type: "shape", x: 140, y: 0, width: 80, height: 260, gradient: "linear-gradient(90deg, transparent, #ffffff)", zIndex: 2 }),
                el({ id: "i1", type: "image", x: 340, y: 20, width: 90, height: 36, imageSource: "logo", objectFit: "contain", zIndex: 3 }),
                el({ id: "t1", type: "text", x: 200, y: 70, width: 230, height: 30, boundField: "full_name", fontSize: 20, fontWeight: "bold", color: "#0f172a", zIndex: 3 }),
                el({ id: "t2", type: "text", x: 200, y: 100, width: 230, height: 22, boundField: "title", fontSize: 12, color: "#64748b", zIndex: 3 }),
                el({ id: "t3", type: "text", x: 200, y: 122, width: 230, height: 22, boundField: "company", fontSize: 12, fontWeight: "600", color: "#3b82f6", zIndex: 3 }),
                el({ id: "s2", type: "shape", x: 200, y: 152, width: 40, height: 3, backgroundColor: "#3b82f6", shapeRadius: 2, zIndex: 3 }),
                el({ id: "t4", type: "text", x: 200, y: 168, width: 200, height: 16, boundField: "email", fontSize: 11, color: "#94a3b8", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 200, y: 186, width: 200, height: 16, boundField: "phone", fontSize: 11, color: "#94a3b8", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 200, y: 204, width: 200, height: 16, boundField: "website", fontSize: 11, color: "#94a3b8", zIndex: 3 }),
                el({ id: "sc", type: "save-contact", x: 200, y: 234, width: 110, height: 20, fontSize: 10, color: "#3b82f6", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
            ],
        },
    },
    {
        name: "Neon Dark",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#0a0a0a",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 450, height: 4, gradient: "linear-gradient(90deg, #f093fb, #f5576c, #ffd200)", zIndex: 1 }),
                el({ id: "i2", type: "image", x: 260, y: 40, width: 180, height: 180, imageSource: "logo", objectFit: "contain", imageOpacity: 0.06, zIndex: 1 }),
                el({ id: "p1", type: "image", x: 24, y: 30, width: 70, height: 70, imageSource: "photo", objectFit: "cover", borderRadius: 12, zIndex: 3, boxShadow: "0 0 20px rgba(240,147,251,0.3)" }),
                el({ id: "t1", type: "text", x: 110, y: 30, width: 280, height: 30, boundField: "full_name", fontSize: 22, fontWeight: "bold", color: "#ffffff", zIndex: 3 }),
                el({ id: "t2", type: "text", x: 110, y: 60, width: 280, height: 22, boundField: "title", fontSize: 12, color: "#a1a1aa", zIndex: 3 }),
                el({ id: "t3", type: "text", x: 110, y: 80, width: 280, height: 22, boundField: "company", fontSize: 12, fontWeight: "600", color: "#f093fb", zIndex: 3 }),
                el({ id: "s2", type: "shape", x: 24, y: 120, width: 400, height: 1, gradient: "linear-gradient(90deg, #f093fb 0%, #f5576c 50%, transparent 100%)", zIndex: 2 }),
                el({ id: "t4", type: "text", x: 24, y: 138, width: 180, height: 18, boundField: "email", fontSize: 11, color: "#71717a", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 24, y: 158, width: 180, height: 18, boundField: "phone", fontSize: 11, color: "#71717a", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 24, y: 178, width: 180, height: 18, boundField: "website", fontSize: 11, color: "#71717a", zIndex: 3 }),
                el({ id: "sc", type: "save-contact", x: 24, y: 230, width: 110, height: 20, fontSize: 10, color: "#f093fb", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
                el({ id: "s3", type: "shape", x: 0, y: 256, width: 450, height: 4, gradient: "linear-gradient(90deg, #f093fb, #f5576c, #ffd200)", zIndex: 1 }),
            ],
        },
    },
    {
        name: "Elegant Vertical",
        config: {
            width: 280,
            height: 480,
            backgroundColor: "#faf9f6",
            elements: [
                el({ id: "p1", type: "image", x: 0, y: 0, width: 280, height: 200, imageSource: "photo", objectFit: "cover", zIndex: 1 }),
                el({ id: "s1", type: "shape", x: 0, y: 150, width: 280, height: 80, gradient: "linear-gradient(180deg, transparent, #faf9f6)", zIndex: 2 }),
                el({ id: "s2", type: "shape", x: 90, y: 215, width: 100, height: 2, backgroundColor: "#c9a96e", zIndex: 3 }),
                el({ id: "t1", type: "text", x: 20, y: 230, width: 240, height: 30, boundField: "full_name", fontSize: 20, fontWeight: "600", color: "#1a1a1a", textAlign: "center", fontFamily: "Georgia, serif", zIndex: 3 }),
                el({ id: "t2", type: "text", x: 20, y: 262, width: 240, height: 20, boundField: "title", fontSize: 11, color: "#c9a96e", textAlign: "center", textTransform: "uppercase", letterSpacing: 2, zIndex: 3 }),
                el({ id: "t3", type: "text", x: 20, y: 286, width: 240, height: 20, boundField: "company", fontSize: 12, color: "#555", textAlign: "center", zIndex: 3 }),
                el({ id: "s3", type: "shape", x: 120, y: 316, width: 40, height: 1, backgroundColor: "#ddd", zIndex: 2 }),
                el({ id: "t4", type: "text", x: 20, y: 330, width: 240, height: 16, boundField: "email", fontSize: 10, color: "#999", textAlign: "center", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 20, y: 348, width: 240, height: 16, boundField: "phone", fontSize: 10, color: "#999", textAlign: "center", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 20, y: 366, width: 240, height: 16, boundField: "website", fontSize: 10, color: "#999", textAlign: "center", zIndex: 3 }),
                el({ id: "i1", type: "image", x: 100, y: 395, width: 80, height: 35, imageSource: "logo", objectFit: "contain", imageOpacity: 0.5, zIndex: 3 }),
                el({ id: "sc", type: "save-contact", x: 80, y: 440, width: 120, height: 20, fontSize: 10, color: "#c9a96e", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
            ],
        },
    },
    {
        name: "Bold Split",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#ffffff",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 160, height: 260, gradient: "linear-gradient(180deg, #4facfe, #00f2fe)", zIndex: 1 }),
                el({ id: "p1", type: "image", x: 30, y: 40, width: 100, height: 100, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }),
                el({ id: "i2", type: "image", x: 30, y: 165, width: 100, height: 40, imageSource: "logo", objectFit: "contain", imageOpacity: 0.3, zIndex: 2 }),
                el({ id: "t1", type: "text", x: 185, y: 28, width: 245, height: 32, boundField: "full_name", fontSize: 24, fontWeight: "bold", color: "#0f172a", zIndex: 3 }),
                el({ id: "t2", type: "text", x: 185, y: 62, width: 245, height: 22, boundField: "title", fontSize: 13, color: "#64748b", zIndex: 3 }),
                el({ id: "t3", type: "text", x: 185, y: 84, width: 245, height: 22, boundField: "company", fontSize: 13, fontWeight: "600", color: "#4facfe", zIndex: 3 }),
                el({ id: "s2", type: "shape", x: 185, y: 116, width: 245, height: 1, backgroundColor: "#e5e7eb", zIndex: 2 }),
                el({ id: "t4", type: "text", x: 185, y: 130, width: 245, height: 18, boundField: "email", fontSize: 11, color: "#6b7280", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 185, y: 150, width: 245, height: 18, boundField: "phone", fontSize: 11, color: "#6b7280", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 185, y: 170, width: 245, height: 18, boundField: "website", fontSize: 11, color: "#6b7280", zIndex: 3 }),
                el({ id: "sc", type: "save-contact", x: 185, y: 232, width: 110, height: 20, fontSize: 10, color: "#4facfe", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
            ],
        },
    },
    {
        name: "Warm Minimal",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#fefce8",
            elements: [
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 8, height: 260, gradient: "linear-gradient(180deg, #f59e0b, #d97706)", zIndex: 1 }),
                el({ id: "i1", type: "image", x: 340, y: 24, width: 86, height: 36, imageSource: "logo", objectFit: "contain", zIndex: 3 }),
                el({ id: "t1", type: "text", x: 32, y: 32, width: 290, height: 34, boundField: "full_name", fontSize: 26, fontWeight: "bold", color: "#451a03", fontFamily: "Georgia, serif", zIndex: 3 }),
                el({ id: "t2", type: "text", x: 32, y: 68, width: 290, height: 22, boundField: "title", fontSize: 12, color: "#92400e", textTransform: "uppercase", letterSpacing: 2, zIndex: 3 }),
                el({ id: "t3", type: "text", x: 32, y: 92, width: 290, height: 22, boundField: "company", fontSize: 13, color: "#b45309", zIndex: 3 }),
                el({ id: "p1", type: "image", x: 345, y: 85, width: 80, height: 80, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 3 }),
                el({ id: "s2", type: "shape", x: 32, y: 130, width: 300, height: 1, backgroundColor: "#fde68a", zIndex: 2 }),
                el({ id: "t4", type: "text", x: 32, y: 148, width: 250, height: 18, boundField: "email", fontSize: 12, color: "#78716c", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 32, y: 168, width: 250, height: 18, boundField: "phone", fontSize: 12, color: "#78716c", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 32, y: 188, width: 250, height: 18, boundField: "website", fontSize: 12, color: "#78716c", zIndex: 3 }),
                el({ id: "sc", type: "save-contact", x: 32, y: 232, width: 110, height: 20, fontSize: 10, color: "#d97706", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
            ],
        },
    },
    {
        name: "Logo Background",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#111827",
            elements: [
                // Full-bleed logo as background watermark
                el({ id: "i1", type: "image", x: 0, y: 0, width: 450, height: 260, imageSource: "logo", objectFit: "cover", imageOpacity: 0.08, zIndex: 1 }),
                // Dark overlay for readability
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 450, height: 260, gradient: "linear-gradient(135deg, rgba(17,24,39,0.95), rgba(17,24,39,0.7))", zIndex: 2 }),
                // Small logo — top left, crisp
                el({ id: "i2", type: "image", x: 24, y: 20, width: 80, height: 36, imageSource: "logo", objectFit: "contain", zIndex: 4 }),
                // Photo — right side
                el({ id: "p1", type: "image", x: 340, y: 20, width: 90, height: 90, imageSource: "photo", objectFit: "cover", borderRadius: 16, zIndex: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }),
                // Name
                el({ id: "t1", type: "text", x: 24, y: 80, width: 300, height: 34, boundField: "full_name", fontSize: 26, fontWeight: "bold", color: "#ffffff", textShadow: "0 2px 4px rgba(0,0,0,0.3)", zIndex: 4 }),
                // Title
                el({ id: "t2", type: "text", x: 24, y: 114, width: 300, height: 22, boundField: "title", fontSize: 13, color: "#9ca3af", zIndex: 4 }),
                // Company
                el({ id: "t3", type: "text", x: 24, y: 136, width: 300, height: 22, boundField: "company", fontSize: 13, fontWeight: "600", color: "#60a5fa", zIndex: 4 }),
                // Divider
                el({ id: "s2", type: "shape", x: 24, y: 170, width: 400, height: 1, backgroundColor: "#374151", zIndex: 3 }),
                // Contact
                el({ id: "t4", type: "text", x: 24, y: 185, width: 180, height: 18, boundField: "email", fontSize: 11, color: "#6b7280", zIndex: 4 }),
                el({ id: "t5", type: "text", x: 24, y: 205, width: 180, height: 18, boundField: "phone", fontSize: 11, color: "#6b7280", zIndex: 4 }),
                el({ id: "t6", type: "text", x: 24, y: 225, width: 180, height: 18, boundField: "website", fontSize: 11, color: "#6b7280", zIndex: 4 }),
                // Save contact
                el({ id: "sc", type: "save-contact", x: 330, y: 235, width: 110, height: 20, fontSize: 10, color: "#60a5fa", fontWeight: "500", customText: "Save Contact", zIndex: 4 }),
            ],
        },
    },
    {
        name: "Brand Immersion",
        config: {
            width: 450,
            height: 260,
            backgroundColor: "#ffffff",
            elements: [
                // Logo fills entire right half as a bold brand statement
                el({ id: "i1", type: "image", x: 220, y: 0, width: 230, height: 260, imageSource: "logo", objectFit: "contain", imageOpacity: 0.12, zIndex: 1 }),
                // Accent stripe left edge
                el({ id: "s1", type: "shape", x: 0, y: 0, width: 6, height: 260, gradient: "linear-gradient(180deg, #2563eb, #7c3aed)", zIndex: 2 }),
                // Photo
                el({ id: "p1", type: "image", x: 24, y: 24, width: 64, height: 64, imageSource: "photo", objectFit: "cover", borderRadius: 999, zIndex: 3 }),
                // Name
                el({ id: "t1", type: "text", x: 100, y: 24, width: 200, height: 28, boundField: "full_name", fontSize: 20, fontWeight: "bold", color: "#0f172a", zIndex: 3 }),
                // Title
                el({ id: "t2", type: "text", x: 100, y: 52, width: 200, height: 20, boundField: "title", fontSize: 12, color: "#64748b", zIndex: 3 }),
                // Company — prominent
                el({ id: "t3", type: "text", x: 100, y: 72, width: 200, height: 20, boundField: "company", fontSize: 12, fontWeight: "700", color: "#2563eb", zIndex: 3 }),
                // Divider
                el({ id: "s2", type: "shape", x: 24, y: 110, width: 200, height: 1, backgroundColor: "#e2e8f0", zIndex: 2 }),
                // Contact details
                el({ id: "t4", type: "text", x: 24, y: 125, width: 200, height: 18, boundField: "email", fontSize: 11, color: "#6b7280", zIndex: 3 }),
                el({ id: "t5", type: "text", x: 24, y: 145, width: 200, height: 18, boundField: "phone", fontSize: 11, color: "#6b7280", zIndex: 3 }),
                el({ id: "t6", type: "text", x: 24, y: 165, width: 200, height: 18, boundField: "website", fontSize: 11, color: "#6b7280", zIndex: 3 }),
                // Website prominent at bottom
                el({ id: "t7", type: "text", x: 24, y: 222, width: 400, height: 22, boundField: "website", fontSize: 14, fontWeight: "600", color: "#2563eb", zIndex: 3 }),
                // Save contact
                el({ id: "sc", type: "save-contact", x: 24, y: 195, width: 110, height: 20, fontSize: 10, color: "#7c3aed", fontWeight: "500", customText: "Save Contact", zIndex: 3 }),
            ],
        },
    },
];
