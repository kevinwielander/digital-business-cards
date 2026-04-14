"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";
import type { CardElement, SampleCardData } from "@/lib/types";

const SNAP_THRESHOLD = 5;
const GRID_SIZE = 10;

interface SnapGuide {
    type: "vertical" | "horizontal";
    position: number;
}

interface DesignerCanvasProps {
    width: number;
    height: number;
    backgroundColor: string;
    elements: CardElement[];
    selectedId: string | null;
    sampleData: SampleCardData;
    assetUrls?: Record<string, string>;
    showGrid: boolean;
    onSelect: (id: string | null) => void;
    onUpdateElement: (id: string, updates: Partial<CardElement>) => void;
}

function getDisplayText(element: CardElement, data: SampleCardData): string {
    if (element.type !== "text") return "";
    if (element.boundField === "custom") return element.customText ?? "Custom text";
    if (element.boundField?.startsWith("custom:")) {
        const key = element.boundField.slice(7);
        return data.custom_fields?.[key] ?? key;
    }
    if (element.boundField && element.boundField in data) return (data as unknown as Record<string, string>)[element.boundField] ?? "";
    return "Text";
}

function snapValue(value: number, targets: number[]): { snapped: number; guide: number | null } {
    for (const target of targets) {
        if (Math.abs(value - target) < SNAP_THRESHOLD) {
            return { snapped: target, guide: target };
        }
    }
    // Grid snap
    const gridSnapped = Math.round(value / GRID_SIZE) * GRID_SIZE;
    return { snapped: gridSnapped, guide: null };
}

export default function DesignerCanvas({
    width,
    height,
    backgroundColor,
    elements,
    selectedId,
    sampleData,
    assetUrls = {},
    showGrid,
    onSelect,
    onUpdateElement,
}: DesignerCanvasProps) {
    const [guides, setGuides] = useState<SnapGuide[]>([]);
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    function getSnapTargets(dragId: string) {
        const others = elements.filter((el) => el.id !== dragId);
        const vTargets: number[] = [0, width / 2, width];
        const hTargets: number[] = [0, height / 2, height];

        for (const el of others) {
            vTargets.push(el.x, el.x + el.width / 2, el.x + el.width);
            hTargets.push(el.y, el.y + el.height / 2, el.y + el.height);
        }
        return { vTargets, hTargets };
    }

    function handleDrag(id: string, x: number, y: number, elWidth: number, elHeight: number) {
        const { vTargets, hTargets } = getSnapTargets(id);
        const newGuides: SnapGuide[] = [];

        // Snap left, center, right edges
        const leftSnap = snapValue(x, vTargets);
        const centerXSnap = snapValue(x + elWidth / 2, vTargets);
        const rightSnap = snapValue(x + elWidth, vTargets);

        let finalX = x;
        if (leftSnap.guide !== null) {
            finalX = leftSnap.snapped;
            newGuides.push({ type: "vertical", position: leftSnap.guide });
        } else if (centerXSnap.guide !== null) {
            finalX = centerXSnap.snapped - elWidth / 2;
            newGuides.push({ type: "vertical", position: centerXSnap.guide });
        } else if (rightSnap.guide !== null) {
            finalX = rightSnap.snapped - elWidth;
            newGuides.push({ type: "vertical", position: rightSnap.guide });
        } else {
            finalX = leftSnap.snapped;
        }

        // Snap top, middle, bottom edges
        const topSnap = snapValue(y, hTargets);
        const centerYSnap = snapValue(y + elHeight / 2, hTargets);
        const bottomSnap = snapValue(y + elHeight, hTargets);

        let finalY = y;
        if (topSnap.guide !== null) {
            finalY = topSnap.snapped;
            newGuides.push({ type: "horizontal", position: topSnap.guide });
        } else if (centerYSnap.guide !== null) {
            finalY = centerYSnap.snapped - elHeight / 2;
            newGuides.push({ type: "horizontal", position: centerYSnap.guide });
        } else if (bottomSnap.guide !== null) {
            finalY = bottomSnap.snapped - elHeight;
            newGuides.push({ type: "horizontal", position: bottomSnap.guide });
        } else {
            finalY = topSnap.snapped;
        }

        setGuides(newGuides);
        return { x: finalX, y: finalY };
    }

    return (
        <div
            className="relative overflow-hidden rounded-lg shadow-xl"
            style={{ width, height, backgroundColor }}
            onClick={() => onSelect(null)}
        >
            {/* Grid overlay */}
            {showGrid && (
                <svg className="pointer-events-none absolute inset-0" width={width} height={height}>
                    {Array.from({ length: Math.floor(width / GRID_SIZE) }, (_, i) => (
                        <line
                            key={`v${i}`}
                            x1={(i + 1) * GRID_SIZE}
                            y1={0}
                            x2={(i + 1) * GRID_SIZE}
                            y2={height}
                            stroke="#e4e4e7"
                            strokeWidth={0.5}
                        />
                    ))}
                    {Array.from({ length: Math.floor(height / GRID_SIZE) }, (_, i) => (
                        <line
                            key={`h${i}`}
                            x1={0}
                            y1={(i + 1) * GRID_SIZE}
                            x2={width}
                            y2={(i + 1) * GRID_SIZE}
                            stroke="#e4e4e7"
                            strokeWidth={0.5}
                        />
                    ))}
                    {/* Center lines */}
                    <line x1={width / 2} y1={0} x2={width / 2} y2={height} stroke="#d4d4d8" strokeWidth={1} strokeDasharray="4 4" />
                    <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#d4d4d8" strokeWidth={1} strokeDasharray="4 4" />
                </svg>
            )}

            {/* Snap guides */}
            {guides.map((guide, i) => (
                <div
                    key={i}
                    className="pointer-events-none absolute"
                    style={
                        guide.type === "vertical"
                            ? { left: guide.position, top: 0, width: 1, height, backgroundColor: "#ef4444", zIndex: 9999 }
                            : { left: 0, top: guide.position, width, height: 1, backgroundColor: "#ef4444", zIndex: 9999 }
                    }
                />
            ))}

            {sorted.map((el) => (
                <Rnd
                    key={el.id}
                    size={{ width: el.width, height: el.height }}
                    position={{ x: el.x, y: el.y }}
                    bounds="parent"
                    disableDragging={el.locked}
                    enableResizing={!el.locked}
                    onDrag={(_e, d) => {
                        const snapped = handleDrag(el.id, d.x, d.y, el.width, el.height);
                        d.x = snapped.x;
                        d.y = snapped.y;
                    }}
                    onDragStop={(_e, d) => {
                        const snapped = handleDrag(el.id, d.x, d.y, el.width, el.height);
                        onUpdateElement(el.id, { x: snapped.x, y: snapped.y });
                        setGuides([]);
                    }}
                    onResizeStop={(_e, _dir, ref, _delta, position) => {
                        onUpdateElement(el.id, {
                            width: parseInt(ref.style.width),
                            height: parseInt(ref.style.height),
                            x: position.x,
                            y: position.y,
                        });
                        setGuides([]);
                    }}
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onSelect(el.id);
                    }}
                    style={{ zIndex: el.zIndex }}
                    className={`${selectedId === el.id ? "ring-2 ring-sky-500" : ""} ${el.locked ? "opacity-90" : ""}`}
                >
                    <div
                        className="h-full w-full"
                        style={{
                            cursor: el.locked ? "default" : "move",
                            opacity: el.opacity ?? 1,
                            transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(el.id);
                        }}
                    >
                        {el.type === "text" && (
                            <div
                                className="flex h-full w-full items-center overflow-hidden"
                                style={{
                                    fontSize: el.fontSize ?? 14,
                                    fontFamily: el.fontFamily ?? "sans-serif",
                                    fontWeight: el.fontWeight ?? "normal",
                                    color: el.color ?? "#000",
                                    textAlign: el.textAlign ?? "left",
                                    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                                    lineHeight: el.lineHeight ?? undefined,
                                    textTransform: el.textTransform ?? "none",
                                    textShadow: el.textShadow ?? undefined,
                                    justifyContent:
                                        el.textAlign === "center"
                                            ? "center"
                                            : el.textAlign === "right"
                                              ? "flex-end"
                                              : "flex-start",
                                    boxShadow: el.boxShadow ?? undefined,
                                }}
                            >
                                {getDisplayText(el, sampleData)}
                            </div>
                        )}

                        {el.type === "image" && (() => {
                            const isDataUri = el.imageSource?.startsWith("asset:data:");
                            const assetUrl = isDataUri
                                ? el.imageSource!.slice(6)
                                : el.imageSource?.startsWith("asset:") ? assetUrls[el.imageSource.slice(6)] : null;
                            const imgSrc =
                                el.imageSource === "photo" ? sampleData.photoUrl :
                                el.imageSource?.startsWith("asset:") ? assetUrl :
                                sampleData.logoUrl;
                            const imgLabel =
                                el.imageSource === "photo" ? "Photo" :
                                el.imageSource?.startsWith("asset:") ? "Asset" :
                                "Image";
                            return (
                                <div
                                    className="flex h-full w-full items-center justify-center overflow-hidden"
                                    style={{
                                        borderRadius: el.borderRadius ?? 0,
                                        backgroundImage: imgSrc
                                            ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                                            : undefined,
                                        backgroundSize: imgSrc ? "8px 8px" : undefined,
                                        backgroundPosition: imgSrc ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined,
                                        backgroundColor: imgSrc ? "#e8e8e8" : "#e4e4e7",
                                        boxShadow: el.boxShadow ?? undefined,
                                    }}
                                >
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={imgLabel} className="h-full w-full" style={{ objectFit: el.objectFit ?? "contain", borderRadius: el.borderRadius ?? 0, opacity: el.imageOpacity ?? 1 }} />
                                    ) : (
                                        <span className="text-xs text-zinc-400">{imgLabel}</span>
                                    )}
                                </div>
                            );
                        })()}

                        {el.type === "shape" && (
                            <div
                                className="h-full w-full"
                                style={{
                                    background: el.gradient || el.backgroundColor || "#3b82f6",
                                    borderRadius: el.shapeRadius ?? 0,
                                    border: el.border ?? "none",
                                    boxShadow: el.boxShadow ?? undefined,
                                }}
                            />
                        )}

                        {el.type === "qrcode" && (
                            <div className="flex h-full w-full items-center justify-center rounded bg-white p-1">
                                <svg viewBox="0 0 100 100" className="h-full w-full">
                                    {/* Placeholder QR pattern */}
                                    <rect width="100" height="100" fill="white" />
                                    <rect x="5" y="5" width="25" height="25" fill="black" />
                                    <rect x="70" y="5" width="25" height="25" fill="black" />
                                    <rect x="5" y="70" width="25" height="25" fill="black" />
                                    <rect x="10" y="10" width="15" height="15" fill="white" />
                                    <rect x="75" y="10" width="15" height="15" fill="white" />
                                    <rect x="10" y="75" width="15" height="15" fill="white" />
                                    <rect x="13" y="13" width="9" height="9" fill="black" />
                                    <rect x="78" y="13" width="9" height="9" fill="black" />
                                    <rect x="13" y="78" width="9" height="9" fill="black" />
                                    <rect x="35" y="35" width="30" height="30" rx="2" fill="black" opacity="0.2" />
                                    <text x="50" y="53" textAnchor="middle" fontSize="8" fill="black" opacity="0.5">QR</text>
                                </svg>
                            </div>
                        )}

                        {el.type === "save-contact" && (
                            <div
                                className="flex h-full w-full cursor-pointer items-center gap-1 overflow-hidden"
                                style={{
                                    fontSize: el.fontSize ?? 12,
                                    fontFamily: el.fontFamily ?? "sans-serif",
                                    fontWeight: el.fontWeight ?? "500",
                                    color: el.color ?? "#3b82f6",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                {el.customText ?? "Save Contact"}
                            </div>
                        )}
                    </div>
                </Rnd>
            ))}
        </div>
    );
}
