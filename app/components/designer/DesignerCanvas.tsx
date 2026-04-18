"use client";

import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import type { CardElement, SampleCardData } from "@/lib/types";

const SNAP_THRESHOLD = 8;
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

function findClosestSnap(value: number, targets: number[]): { distance: number; target: number } | null {
    let best: { distance: number; target: number } | null = null;
    for (const target of targets) {
        const d = Math.abs(value - target);
        if (d < SNAP_THRESHOLD && (!best || d < best.distance)) {
            best = { distance: d, target };
        }
    }
    return best;
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
    const [ctrlHeld, setCtrlHeld] = useState(false);
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    // Track Ctrl/Cmd key for disabling snap
    useEffect(() => {
        function down(e: KeyboardEvent) { if (e.ctrlKey || e.metaKey) setCtrlHeld(true); }
        function up(e: KeyboardEvent) { if (!e.ctrlKey && !e.metaKey) setCtrlHeld(false); }
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
    }, []);

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

        // Check all three edge points for X: left, center, right
        // Priority: center > left > right (center alignment is most useful)
        const centerXSnap = findClosestSnap(x + elWidth / 2, vTargets);
        const leftSnap = findClosestSnap(x, vTargets);
        const rightSnap = findClosestSnap(x + elWidth, vTargets);

        let finalX = Math.round(x / GRID_SIZE) * GRID_SIZE; // grid fallback
        if (centerXSnap) {
            finalX = centerXSnap.target - elWidth / 2;
            newGuides.push({ type: "vertical", position: centerXSnap.target });
        } else if (leftSnap) {
            finalX = leftSnap.target;
            newGuides.push({ type: "vertical", position: leftSnap.target });
        } else if (rightSnap) {
            finalX = rightSnap.target - elWidth;
            newGuides.push({ type: "vertical", position: rightSnap.target });
        }

        // Check all three edge points for Y: center, top, bottom
        const centerYSnap = findClosestSnap(y + elHeight / 2, hTargets);
        const topSnap = findClosestSnap(y, hTargets);
        const bottomSnap = findClosestSnap(y + elHeight, hTargets);

        let finalY = Math.round(y / GRID_SIZE) * GRID_SIZE; // grid fallback
        if (centerYSnap) {
            finalY = centerYSnap.target - elHeight / 2;
            newGuides.push({ type: "horizontal", position: centerYSnap.target });
        } else if (topSnap) {
            finalY = topSnap.target;
            newGuides.push({ type: "horizontal", position: topSnap.target });
        } else if (bottomSnap) {
            finalY = bottomSnap.target - elHeight;
            newGuides.push({ type: "horizontal", position: bottomSnap.target });
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
                            ? { left: guide.position - 0.5, top: 0, width: 1, height, backgroundColor: "#f43f5e", zIndex: 9999, boxShadow: "0 0 3px rgba(244,63,94,0.5)" }
                            : { left: 0, top: guide.position - 0.5, width, height: 1, backgroundColor: "#f43f5e", zIndex: 9999, boxShadow: "0 0 3px rgba(244,63,94,0.5)" }
                    }
                />
            ))}

            {sorted.map((el) => (
                <Rnd
                    key={`${el.id}-${el.x}-${el.y}-${el.width}-${el.height}`}
                    default={{ x: el.x, y: el.y, width: el.width, height: el.height }}
                    bounds="parent"
                    disableDragging={el.locked}
                    enableResizing={el.locked ? false : (el.width <= 30 || el.height <= 10) ? {
                        bottomRight: true,
                        top: false, right: el.height <= 10, bottom: el.width <= 30, left: false,
                        topRight: false, bottomLeft: false, topLeft: false,
                    } : true}
                    minWidth={8}
                    minHeight={2}
                    resizeHandleStyles={{
                        bottom: { height: Math.max(10, 20 - el.height), bottom: -Math.max(5, 10 - el.height / 2) },
                        right: { width: Math.max(10, 20 - el.width), right: -Math.max(5, 10 - el.width / 2) },
                    }}
                    onDrag={(_e, d) => {
                        if (ctrlHeld) {
                            setGuides([]);
                            return;
                        }
                        const snapped = handleDrag(el.id, d.x, d.y, el.width, el.height);
                        // Apply magnetic snap by overriding position
                        d.x = snapped.x;
                        d.y = snapped.y;
                    }}
                    onDragStop={(_e, d) => {
                        const snapped = ctrlHeld
                            ? { x: Math.round(d.x), y: Math.round(d.y) }
                            : handleDrag(el.id, d.x, d.y, el.width, el.height);
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
                                        backgroundColor: imgSrc ? "transparent" : "#e4e4e7",
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
