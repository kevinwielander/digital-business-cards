"use client";

import CardPreviewRenderer from "./designer/CardPreviewRenderer";
import type { TemplateConfig, SampleCardData } from "@/lib/types";
import { SAMPLE_CARD_DATA } from "@/lib/types";

interface TemplateCardProps {
    name: string;
    config: TemplateConfig;
    previewData?: SampleCardData;
    badge?: string;
    onClick?: () => void;
    action?: React.ReactNode;
}

export default function TemplateCard({ name, config, previewData, badge, onClick, action }: TemplateCardProps) {
    const isPortrait = config.height > config.width;
    const scale = isPortrait ? 0.35 : 0.5;

    const content = (
        <div className={`rounded-xl border border-zinc-200 bg-white p-4 transition ${onClick ? "cursor-pointer hover:border-zinc-400 hover:shadow-md" : ""}`}>
            <div className="mb-3 flex justify-center rounded-lg bg-zinc-50 p-4">
                <CardPreviewRenderer
                    config={config}
                    data={previewData ?? SAMPLE_CARD_DATA}
                    scale={scale}
                />
            </div>
            <div className="flex items-center gap-2">
                <p className="font-semibold text-zinc-900">{name}</p>
                {badge && (
                    <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">{badge}</span>
                )}
            </div>
            <p className="text-sm text-zinc-500">
                {config.width} x {config.height}
                {isPortrait ? " · Portrait" : " · Landscape"}
                {config.elements && ` · ${config.elements.length} elements`}
            </p>
            {action && <div className="mt-3">{action}</div>}
        </div>
    );

    if (onClick) {
        return <button onClick={onClick} className="text-left w-full">{content}</button>;
    }

    return content;
}
