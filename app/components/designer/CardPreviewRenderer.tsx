import type { TemplateConfig, SampleCardData, CardElement } from "@/lib/types";

interface CardPreviewRendererProps {
    config: TemplateConfig;
    data: SampleCardData;
    assetUrls?: Record<string, string>;
    scale?: number;
}

function getDisplayText(el: CardElement, data: SampleCardData): string {
    if (el.type !== "text" && el.type !== "save-contact") return "";
    if (el.type === "save-contact") return el.customText ?? "Save Contact";
    if (el.boundField === "custom") return el.customText ?? "Custom text";
    if (el.boundField?.startsWith("custom:")) {
        const key = el.boundField.slice(7);
        return data.custom_fields?.[key] ?? key;
    }
    if (el.boundField && el.boundField in data) return (data as unknown as Record<string, string>)[el.boundField] ?? "";
    return "Text";
}

export default function CardPreviewRenderer({ config, data, assetUrls = {}, scale = 1 }: CardPreviewRendererProps) {
    const sorted = [...config.elements].sort((a, b) => a.zIndex - b.zIndex);

    return (
        <div
            style={{
                width: config.width * scale,
                height: config.height * scale,
                position: "relative",
                overflow: "hidden",
                borderRadius: 12 * scale,
                backgroundColor: config.backgroundColor,
                boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            }}
        >
            {sorted.map((el) => {
                const style: React.CSSProperties = {
                    position: "absolute",
                    left: el.x * scale,
                    top: el.y * scale,
                    width: el.width * scale,
                    height: el.height * scale,
                    zIndex: el.zIndex,
                    opacity: el.opacity ?? 1,
                    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                    boxShadow: el.boxShadow ?? undefined,
                };

                if (el.type === "text") {
                    const align = el.textAlign ?? "left";
                    return (
                        <div
                            key={el.id}
                            style={{
                                ...style,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
                                fontSize: (el.fontSize ?? 14) * scale,
                                fontFamily: el.fontFamily ?? "sans-serif",
                                fontWeight: el.fontWeight ?? "normal",
                                color: el.color ?? "#000",
                                letterSpacing: el.letterSpacing ? el.letterSpacing * scale : undefined,
                                lineHeight: el.lineHeight ?? undefined,
                                textTransform: el.textTransform ?? "none",
                                textShadow: el.textShadow ?? undefined,
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {getDisplayText(el, data)}
                        </div>
                    );
                }

                if (el.type === "image") {
                    const src =
                        el.imageSource === "photo" ? data.photoUrl :
                        el.imageSource?.startsWith("asset:") ? assetUrls[el.imageSource.slice(6)] ?? null :
                        data.logoUrl;
                    return (
                        <div
                            key={el.id}
                            style={{
                                ...style,
                                borderRadius: (el.borderRadius ?? 0) * scale,
                                overflow: "hidden",
                                backgroundColor: src ? undefined : "#e4e4e7",
                            }}
                        >
                            {src ? (
                                <img
                                    src={src}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: el.objectFit ?? "contain",
                                        opacity: el.imageOpacity ?? 1,
                                        borderRadius: (el.borderRadius ?? 0) * scale,
                                    }}
                                />
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 10 * scale, color: "#a1a1aa" }}>
                                    {el.imageSource === "logo" ? "Logo" : "Photo"}
                                </div>
                            )}
                        </div>
                    );
                }

                if (el.type === "shape") {
                    return (
                        <div
                            key={el.id}
                            style={{
                                ...style,
                                background: el.gradient || el.backgroundColor || "#3b82f6",
                                borderRadius: (el.shapeRadius ?? 0) * scale,
                                border: el.border ?? "none",
                            }}
                        />
                    );
                }

                if (el.type === "qrcode") {
                    return (
                        <div key={el.id} style={{ ...style, background: "#fff", borderRadius: 4 * scale, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 10 * scale, color: "#a1a1aa" }}>QR</span>
                        </div>
                    );
                }

                if (el.type === "save-contact") {
                    return (
                        <div
                            key={el.id}
                            style={{
                                ...style,
                                display: "flex",
                                alignItems: "center",
                                gap: 3 * scale,
                                fontSize: (el.fontSize ?? 12) * scale,
                                fontFamily: el.fontFamily ?? "sans-serif",
                                fontWeight: el.fontWeight ?? "500",
                                color: el.color ?? "#3b82f6",
                            }}
                        >
                            <svg width={12 * scale} height={12 * scale} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            {el.customText ?? "Save Contact"}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}
