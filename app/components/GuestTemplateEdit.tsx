"use client";

import { useGuest } from "./GuestProvider";
import TemplateDesigner from "./TemplateDesigner";
import type { TemplateConfig } from "@/lib/types";

export default function GuestTemplateEdit({ templateId }: { templateId: string }) {
    const { isGuest, data } = useGuest();

    if (!isGuest) return null;

    const template = data.templates.find((t) => t.id === templateId);

    if (!template) return <p className="p-10 text-center text-zinc-500">Template not found</p>;

    return (
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <h1 className="mb-8 text-2xl font-semibold">Edit Template</h1>
            <TemplateDesigner
                templateId={template.id}
                initialName={template.name}
                initialConfig={template.config as TemplateConfig}
            />
        </div>
    );
}
