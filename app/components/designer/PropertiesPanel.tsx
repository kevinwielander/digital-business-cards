"use client";

import type { CardElement, BoundField, CustomFieldDefinition } from "@/lib/types";
import { BUILT_IN_FIELD_LABELS } from "@/lib/types";
import { DESIGNER_FONTS } from "@/lib/fonts";
import AssetPicker from "./AssetPicker";

interface PropertiesPanelProps {
    element: CardElement;
    cardWidth: number;
    companyId?: string;
    customFieldDefs?: CustomFieldDefinition[];
    cardHeight: number;
    onUpdate: (updates: Partial<CardElement>) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

export default function PropertiesPanel({
    element,
    cardWidth,
    cardHeight,
    companyId,
    customFieldDefs,
    onUpdate,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
}: PropertiesPanelProps) {
    return (
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "70vh" }}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    {element.type}
                </h3>
                <div className="flex gap-2">
                    <button onClick={onDuplicate} className="text-xs text-sky-500 hover:text-sky-700" title="Duplicate">
                        Duplicate
                    </button>
                    <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-700" title="Delete">
                        Delete
                    </button>
                </div>
            </div>

            {/* Lock */}
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={element.locked ?? false}
                    onChange={(e) => onUpdate({ locked: e.target.checked })}
                />
                Lock position
            </label>

            {/* Position & Size */}
            <Section title="Position & Size">
                <div className="grid grid-cols-2 gap-2">
                    <Field label="X" type="number" value={element.x} onChange={(v) => onUpdate({ x: Number(v) })} />
                    <Field label="Y" type="number" value={element.y} onChange={(v) => onUpdate({ y: Number(v) })} />
                    <Field label="W" type="number" value={element.width} onChange={(v) => onUpdate({ width: Number(v) })} />
                    <Field label="H" type="number" value={element.height} onChange={(v) => onUpdate({ height: Number(v) })} />
                </div>
            </Section>

            {/* Alignment buttons */}
            <Section title="Align to Card">
                <div className="grid grid-cols-3 gap-1">
                    <AlignBtn label="Left" onClick={() => onUpdate({ x: 0 })} />
                    <AlignBtn label="Center H" onClick={() => onUpdate({ x: (cardWidth - element.width) / 2 })} />
                    <AlignBtn label="Right" onClick={() => onUpdate({ x: cardWidth - element.width })} />
                    <AlignBtn label="Top" onClick={() => onUpdate({ y: 0 })} />
                    <AlignBtn label="Center V" onClick={() => onUpdate({ y: (cardHeight - element.height) / 2 })} />
                    <AlignBtn label="Bottom" onClick={() => onUpdate({ y: cardHeight - element.height })} />
                </div>
            </Section>

            {/* Layers */}
            <Section title="Layer">
                <div className="flex gap-2">
                    <button onClick={onMoveUp} className="flex-1 rounded bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200">Forward</button>
                    <button onClick={onMoveDown} className="flex-1 rounded bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200">Back</button>
                </div>
            </Section>

            {/* Appearance */}
            <Section title="Appearance">
                <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-500">Opacity</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={element.opacity ?? 1}
                            onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
                            className="flex-1"
                        />
                        <span className="w-10 text-right text-xs text-zinc-500">
                            {Math.round((element.opacity ?? 1) * 100)}%
                        </span>
                    </div>
                </div>

                <Field
                    label="Rotation"
                    type="number"
                    value={element.rotation ?? 0}
                    onChange={(v) => onUpdate({ rotation: Number(v) })}
                />

                <Field
                    label="Box Shadow"
                    value={element.boxShadow ?? ""}
                    onChange={(v) => onUpdate({ boxShadow: v || undefined })}
                    placeholder="e.g. 0 2px 8px rgba(0,0,0,0.15)"
                />
            </Section>

            {/* Text properties */}
            {element.type === "text" && (
                <Section title="Text">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Bound Field</label>
                        <select
                            value={element.boundField ?? "custom"}
                            onChange={(e) => onUpdate({ boundField: e.target.value as BoundField })}
                            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                        >
                            {Object.entries(BUILT_IN_FIELD_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                            {customFieldDefs && customFieldDefs.length > 0 && (
                                <optgroup label="Custom Fields">
                                    {customFieldDefs.map((def) => (
                                        <option key={def.key} value={`custom:${def.key}`}>{def.label}</option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>

                    {element.boundField === "custom" && (
                        <Field label="Text" value={element.customText ?? ""} onChange={(v) => onUpdate({ customText: v })} />
                    )}

                    <Field label="Font Size" type="number" value={element.fontSize ?? 14} onChange={(v) => onUpdate({ fontSize: Number(v) })} />

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Font</label>
                        <select
                            value={element.fontFamily ?? "Inter, sans-serif"}
                            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                        >
                            {DESIGNER_FONTS.map((f) => (
                                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Weight</label>
                        <select
                            value={element.fontWeight ?? "normal"}
                            onChange={(e) => onUpdate({ fontWeight: e.target.value })}
                            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                        >
                            <option value="300">Light</option>
                            <option value="normal">Normal</option>
                            <option value="500">Medium</option>
                            <option value="600">Semi Bold</option>
                            <option value="bold">Bold</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Align</label>
                        <div className="flex gap-1">
                            {(["left", "center", "right"] as const).map((align) => (
                                <button
                                    key={align}
                                    onClick={() => onUpdate({ textAlign: align })}
                                    className={`flex-1 rounded px-2 py-1 text-xs ${(element.textAlign ?? "left") === align ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                                >
                                    {align[0].toUpperCase() + align.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Transform</label>
                        <select
                            value={element.textTransform ?? "none"}
                            onChange={(e) => onUpdate({ textTransform: e.target.value as CardElement["textTransform"] })}
                            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                        >
                            <option value="none">None</option>
                            <option value="uppercase">UPPERCASE</option>
                            <option value="lowercase">lowercase</option>
                            <option value="capitalize">Capitalize</option>
                        </select>
                    </div>

                    <Field label="Letter Spacing" type="number" value={element.letterSpacing ?? 0} onChange={(v) => onUpdate({ letterSpacing: Number(v) })} />

                    <Field label="Line Height" type="number" value={element.lineHeight ?? 1.4} onChange={(v) => onUpdate({ lineHeight: Number(v) })} />

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Color</label>
                        <input
                            type="color"
                            value={element.color ?? "#000000"}
                            onChange={(e) => onUpdate({ color: e.target.value })}
                            className="h-8 w-full cursor-pointer rounded border border-zinc-300"
                        />
                    </div>
                    <Field
                        label="Text Shadow"
                        value={element.textShadow ?? ""}
                        onChange={(v) => onUpdate({ textShadow: v || undefined })}
                        placeholder="e.g. 0 1px 3px rgba(0,0,0,0.3)"
                    />
                </Section>
            )}

            {/* Image properties */}
            {element.type === "image" && (
                <Section title="Image">
                    {companyId ? (
                        <AssetPicker
                            companyId={companyId}
                            currentSource={element.imageSource}
                            onSelect={(source) => onUpdate({ imageSource: source as CardElement["imageSource"] })}
                        />
                    ) : (
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-500">Source</label>
                            <p className="text-xs text-zinc-400">Select a company to manage assets</p>
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Fit</label>
                        <select
                            value={element.objectFit ?? "contain"}
                            onChange={(e) => onUpdate({ objectFit: e.target.value as "cover" | "contain" })}
                            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                        >
                            <option value="contain">Contain</option>
                            <option value="cover">Cover</option>
                        </select>
                    </div>

                    <Field label="Border Radius" type="number" value={element.borderRadius ?? 0} onChange={(v) => onUpdate({ borderRadius: Number(v) })} />

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Image Opacity</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={element.imageOpacity ?? 1}
                                onChange={(e) => onUpdate({ imageOpacity: Number(e.target.value) })}
                                className="flex-1"
                            />
                            <span className="w-10 text-right text-xs text-zinc-500">
                                {Math.round((element.imageOpacity ?? 1) * 100)}%
                            </span>
                        </div>
                    </div>

                    <Field
                        label="Link URL"
                        value={element.linkUrl ?? ""}
                        onChange={(v) => onUpdate({ linkUrl: v || undefined })}
                        placeholder="e.g. https://linkedin.com/in/..."
                    />

                    {/* Icon color — only for icons with stored SVG */}
                    {element.iconSvg && (
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-500">Icon Color</label>
                            <input
                                type="color"
                                value={element.iconColor ?? "#000000"}
                                onChange={(e) => {
                                    const newColor = e.target.value;
                                    const svg = element.iconSvg!;
                                    const colored = svg.replace(/currentColor/g, newColor);
                                    const dataUrl = `data:image/svg+xml;base64,${btoa(colored)}`;
                                    onUpdate({
                                        iconColor: newColor,
                                        imageSource: `asset:${dataUrl}` as CardElement["imageSource"],
                                    });
                                }}
                                className="h-8 w-full cursor-pointer rounded border border-zinc-300"
                            />
                        </div>
                    )}
                </Section>
            )}

            {/* Shape properties */}
            {element.type === "shape" && (
                <Section title="Shape">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Color</label>
                        <input
                            type="color"
                            value={element.backgroundColor ?? "#3b82f6"}
                            onChange={(e) => onUpdate({ backgroundColor: e.target.value, gradient: undefined })}
                            className="h-8 w-full cursor-pointer rounded border border-zinc-300"
                        />
                    </div>

                    <Field
                        label="Gradient"
                        value={element.gradient ?? ""}
                        onChange={(v) => onUpdate({ gradient: v || undefined })}
                        placeholder="e.g. linear-gradient(135deg, #667eea, #764ba2)"
                    />

                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Presets</label>
                        <div className="grid grid-cols-4 gap-1">
                            {[
                                "linear-gradient(135deg, #667eea, #764ba2)",
                                "linear-gradient(135deg, #f093fb, #f5576c)",
                                "linear-gradient(135deg, #4facfe, #00f2fe)",
                                "linear-gradient(135deg, #43e97b, #38f9d7)",
                                "linear-gradient(135deg, #fa709a, #fee140)",
                                "linear-gradient(135deg, #a18cd1, #fbc2eb)",
                                "linear-gradient(135deg, #fccb90, #d57eeb)",
                                "linear-gradient(135deg, #0c3483, #a2b6df)",
                            ].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => onUpdate({ gradient: g })}
                                    className="h-6 rounded border border-zinc-200"
                                    style={{ background: g }}
                                />
                            ))}
                        </div>
                    </div>

                    <Field label="Border Radius" type="number" value={element.shapeRadius ?? 0} onChange={(v) => onUpdate({ shapeRadius: Number(v) })} />
                    <Field label="Border" value={element.border ?? ""} onChange={(v) => onUpdate({ border: v || undefined })} placeholder="e.g. 1px solid #ccc" />
                </Section>
            )}

            {/* QR Code — no extra props, it auto-generates from contact data */}
            {element.type === "qrcode" && (
                <Section title="QR Code">
                    <p className="text-xs text-zinc-500">
                        Generates a QR code containing the person&apos;s vCard data. Recipients can scan to save the contact.
                    </p>
                </Section>
            )}

            {/* Save Contact button */}
            {element.type === "save-contact" && (
                <Section title="Save Contact Button">
                    <Field label="Button Text" value={element.customText ?? "Save Contact"} onChange={(v) => onUpdate({ customText: v })} />
                    <Field label="Font Size" type="number" value={element.fontSize ?? 12} onChange={(v) => onUpdate({ fontSize: Number(v) })} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Color</label>
                        <input
                            type="color"
                            value={element.color ?? "#3b82f6"}
                            onChange={(e) => onUpdate({ color: e.target.value })}
                            className="h-8 w-full cursor-pointer rounded border border-zinc-300"
                        />
                    </div>
                </Section>
            )}
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h4>
            {children}
        </div>
    );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm" />
        </div>
    );
}

function AlignBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className="rounded bg-zinc-100 px-1 py-1 text-xs hover:bg-zinc-200">
            {label}
        </button>
    );
}
