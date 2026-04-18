"use client";

import { useState, useRef, useEffect } from "react";
import { Reorder } from "framer-motion";
import type { CardElement } from "@/lib/types";
import { BUILT_IN_FIELD_LABELS } from "@/lib/types";

interface LayersPanelProps {
    elements: CardElement[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onReorder: (elements: CardElement[]) => void;
    onUpdate: (id: string, updates: Partial<CardElement>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onAddElement?: (type: string) => void;
}

function getAutoLabel(el: CardElement): string {
    if (el.type === "text") {
        if (el.boundField === "custom") return el.customText?.slice(0, 20) || "Custom Text";
        if (el.boundField?.startsWith("custom:")) return el.boundField.slice(7);
        if (el.boundField) return BUILT_IN_FIELD_LABELS[el.boundField] ?? el.boundField;
        return "Text";
    }
    if (el.type === "image") {
        if (el.iconSvg || el.imageSource?.startsWith("asset:data:")) return "Icon";
        if (el.imageSource === "photo") return "Photo";
        if (el.imageSource?.startsWith("asset:")) {
            const path = el.imageSource.slice(6);
            const filename = path.split("/").pop() ?? "Asset";
            const dashIdx = filename.indexOf("-");
            return dashIdx > 0 && dashIdx < 10 ? filename.slice(dashIdx + 1) : filename;
        }
        return "Image";
    }
    if (el.type === "shape") {
        if (el.shapeRadius && el.shapeRadius > 100) return "Circle";
        if (el.height <= 4) return "Line";
        if (el.shapeRadius && el.shapeRadius > 0) return "Rounded Rect";
        return "Rectangle";
    }
    if (el.type === "qrcode") return "QR Code";
    if (el.type === "save-contact") return el.customText || "Save Contact";
    return el.type;
}

function getTypeTag(el: CardElement): string {
    if (el.type === "text") return "T";
    if (el.type === "image") return "I";
    if (el.type === "shape") return "S";
    if (el.type === "qrcode") return "Q";
    if (el.type === "save-contact") return "↓";
    return "?";
}

function getTagColor(el: CardElement): string {
    if (el.type === "text") return "bg-blue-100 text-blue-600";
    if (el.type === "image") return "bg-purple-100 text-purple-600";
    if (el.type === "shape") return "bg-amber-100 text-amber-600";
    if (el.type === "qrcode") return "bg-green-100 text-green-600";
    if (el.type === "save-contact") return "bg-sky-100 text-sky-600";
    return "bg-zinc-100 text-zinc-600";
}

function EditableLabel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    if (editing) {
        return (
            <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => {
                    setEditing(false);
                    if (draft.trim()) onChange(draft.trim());
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setEditing(false);
                        if (draft.trim()) onChange(draft.trim());
                    }
                    if (e.key === "Escape") {
                        setEditing(false);
                        setDraft(value);
                    }
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full rounded border border-sky-300 bg-white px-1 py-0.5 text-sm outline-none"
            />
        );
    }

    return (
        <span
            className="flex-1 cursor-text truncate"
            onDoubleClick={(e) => {
                e.stopPropagation();
                setDraft(value);
                setEditing(true);
            }}
            title="Double-click to rename"
        >
            {value}
        </span>
    );
}

const ADD_OPTIONS = [
    { type: "text", label: "Text", tag: "T", color: "bg-blue-100 text-blue-600" },
    { type: "photo", label: "Photo", tag: "I", color: "bg-purple-100 text-purple-600" },
    { type: "rectangle", label: "Rectangle", tag: "S", color: "bg-amber-100 text-amber-600" },
    { type: "circle", label: "Circle", tag: "S", color: "bg-amber-100 text-amber-600" },
    { type: "line", label: "Line", tag: "S", color: "bg-amber-100 text-amber-600" },
    { type: "qrcode", label: "QR Code", tag: "Q", color: "bg-green-100 text-green-600" },
    { type: "save-contact", label: "Save Contact", tag: "↓", color: "bg-sky-100 text-sky-600" },
];

export default function LayersPanel({ elements, selectedId, onSelect, onReorder, onUpdate, onDelete, onDuplicate, onAddElement }: LayersPanelProps) {
    const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
    const [showAddMenu, setShowAddMenu] = useState(false);

    const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

    function handleReorder(newOrder: CardElement[]) {
        const updated = newOrder.map((el, i) => ({
            ...el,
            zIndex: newOrder.length - i,
        }));
        onReorder(updated);
    }

    function handleContextMenu(e: React.MouseEvent, id: string) {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ id, x: e.clientX, y: e.clientY });
    }

    return (
        <div className="flex flex-col" onClick={() => contextMenu && setContextMenu(null)}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Layers</h3>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-300">{elements.length} elements</span>
                    {onAddElement && (
                        <div className="relative">
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                                title="Add element"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </button>
                            {showAddMenu && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl">
                                    {ADD_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.type}
                                            onClick={() => {
                                                onAddElement(opt.type);
                                                setShowAddMenu(false);
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-zinc-50"
                                        >
                                            <span className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold ${opt.color}`}>{opt.tag}</span>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {sorted.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-200 py-6 text-center text-sm text-zinc-400">
                    No elements yet
                </div>
            ) : (
                <>
                    <div className="mb-1 text-[10px] font-medium text-zinc-300">FRONT</div>
                    <Reorder.Group
                        axis="y"
                        values={sorted}
                        onReorder={handleReorder}
                        className="space-y-1"
                    >
                        {sorted.map((el) => {
                            const isHidden = (el.opacity ?? 1) === 0;
                            const isLocked = !!el.locked;
                            const isSelected = selectedId === el.id;
                            const displayLabel = el.label || getAutoLabel(el);

                            return (
                                <Reorder.Item
                                    key={el.id}
                                    value={el}
                                    onContextMenu={(e) => handleContextMenu(e, el.id)}
                                    className={`group flex cursor-grab items-center gap-2 rounded-lg px-2 py-2 text-sm active:cursor-grabbing ${
                                        isSelected
                                            ? "bg-sky-50 ring-1 ring-sky-200"
                                            : isHidden
                                              ? "bg-zinc-50 text-zinc-300"
                                              : "hover:bg-zinc-50"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect(el.id);
                                    }}
                                >
                                    {/* Drag handle */}
                                    <svg className="h-4 w-4 shrink-0 text-zinc-300" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                                        <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                                        <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                                    </svg>

                                    {/* Type badge */}
                                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold ${getTagColor(el)}`}>
                                        {getTypeTag(el)}
                                    </span>

                                    {/* Editable label */}
                                    <EditableLabel
                                        value={displayLabel}
                                        onChange={(v) => onUpdate(el.id, { label: v })}
                                    />

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-1">
                                        {/* Visibility */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdate(el.id, { opacity: isHidden ? 1 : 0 }); }}
                                            className={`rounded p-1 ${isHidden ? "text-zinc-300" : "hidden text-zinc-400 group-hover:block"} hover:bg-zinc-100 hover:text-zinc-600`}
                                        >
                                            {isHidden ? (
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                            ) : (
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            )}
                                        </button>

                                        {/* Lock */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdate(el.id, { locked: !isLocked }); }}
                                            className={`rounded p-1 ${isLocked ? "text-amber-500" : "hidden text-zinc-400 group-hover:block"} hover:bg-zinc-100 hover:text-zinc-600`}
                                        >
                                            {isLocked ? (
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                            ) : (
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 019.9-1" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </Reorder.Item>
                            );
                        })}
                    </Reorder.Group>
                    <div className="mt-1 text-[10px] font-medium text-zinc-300">BACK</div>
                </>
            )}

            {/* Context menu */}
            {contextMenu && (() => {
                const el = elements.find((e) => e.id === contextMenu.id);
                if (!el) return null;
                return (
                    <div
                        className="fixed z-[100] w-44 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        onClick={() => setContextMenu(null)}
                    >
                        <ContextBtn onClick={() => onDuplicate(el.id)}>Duplicate</ContextBtn>
                        <ContextBtn onClick={() => onUpdate(el.id, { opacity: (el.opacity ?? 1) === 0 ? 1 : 0 })}>
                            {(el.opacity ?? 1) === 0 ? "Show" : "Hide"}
                        </ContextBtn>
                        <ContextBtn onClick={() => onUpdate(el.id, { locked: !el.locked })}>
                            {el.locked ? "Unlock" : "Lock"}
                        </ContextBtn>
                        <div className="my-1 h-px bg-zinc-100" />
                        <ContextBtn onClick={() => {
                            const maxZ = Math.max(...elements.map((e) => e.zIndex));
                            onUpdate(el.id, { zIndex: maxZ + 1 });
                        }}>Bring to Front</ContextBtn>
                        <ContextBtn onClick={() => onUpdate(el.id, { zIndex: 0 })}>Send to Back</ContextBtn>
                        <div className="my-1 h-px bg-zinc-100" />
                        <ContextBtn onClick={() => onDelete(el.id)} danger>Delete</ContextBtn>
                    </div>
                );
            })()}
        </div>
    );
}

function ContextBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-1.5 text-left text-sm hover:bg-zinc-50 ${danger ? "text-red-500" : "text-zinc-700"}`}
        >
            {children}
        </button>
    );
}
