"use client";

import { useState } from "react";

interface GenerateButtonProps {
    companyId: string;
}

export default function GenerateButton({ companyId }: GenerateButtonProps) {
    const [generating, setGenerating] = useState(false);

    async function handleGenerate() {
        setGenerating(true);

        const res = await fetch(`/api/generate/${companyId}`);
        if (!res.ok) {
            alert("Failed to generate cards");
            setGenerating(false);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "business-cards.zip";
        a.click();
        URL.revokeObjectURL(url);
        setGenerating(false);
    }

    return (
        <button
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
            {generating ? "Generating..." : "Generate Cards"}
        </button>
    );
}
