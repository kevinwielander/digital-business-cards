"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { SAMPLE_COMPANIES } from "@/lib/sample-data";
import { SAMPLE_TEMPLATES } from "@/lib/sample-templates";

async function fetchImageBlob(url: string): Promise<Blob | null> {
    try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) return null;
        return res.blob();
    } catch {
        return null;
    }
}

async function svgToPngBlob(svgDataUrl: string): Promise<Blob | null> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => resolve(blob), "image/png");
        };
        img.onerror = () => resolve(null);
        img.src = svgDataUrl;
    });
}

export default function SeedSampleData() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    async function handleSeed() {
        setLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Create sample templates
        setStatus("Creating templates...");
        const templateIds: string[] = [];
        for (const sample of SAMPLE_TEMPLATES.slice(0, 2)) {
            const { data } = await supabase
                .from(TABLES.TEMPLATES)
                .insert({ user_id: user.id, name: sample.name, config: sample.config })
                .select("id")
                .single();
            if (data) templateIds.push(data.id);
        }

        const defaultTemplateId = templateIds[0] ?? null;
        if (!defaultTemplateId) {
            setStatus("Failed to create templates");
            setLoading(false);
            return;
        }

        // Create sample companies
        for (const company of SAMPLE_COMPANIES) {
            setStatus(`Creating ${company.name}...`);

            // Upload company logo
            let logoPath: string | null = null;
            const logoBlob = await svgToPngBlob(company.logoDataUrl);
            if (logoBlob) {
                const logoFilePath = `${user.id}/sample-${company.name.toLowerCase().replace(/\s+/g, "-")}.png`;
                const { error } = await supabase.storage.from(STORAGE.LOGOS).upload(logoFilePath, logoBlob, {
                    contentType: "image/png",
                    upsert: true,
                });
                if (!error) logoPath = logoFilePath;
            }

            const { data: companyData, error: companyError } = await supabase
                .from(TABLES.COMPANIES)
                .insert({
                    user_id: user.id,
                    name: company.name,
                    domain: company.domain,
                    website: company.website,
                    logo_url: logoPath,
                })
                .select("id")
                .single();

            if (companyError) {
                console.error("Company insert error:", companyError);
                setStatus(`Failed: ${companyError.message}`);
                continue;
            }
            if (!companyData) continue;

            // Create people
            for (const person of company.people) {
                setStatus(`Adding ${person.first_name} ${person.last_name}...`);

                let photoPath: string | null = null;
                const avatarBlob = await fetchImageBlob(person.avatarUrl);
                if (avatarBlob) {
                    const photoFilePath = `${user.id}/sample-${person.first_name.toLowerCase()}-${person.last_name.toLowerCase()}.png`;
                    const { error } = await supabase.storage.from(STORAGE.PHOTOS).upload(photoFilePath, avatarBlob, {
                        contentType: "image/jpeg",
                        upsert: true,
                    });
                    if (!error) photoPath = photoFilePath;
                }

                await supabase.from(TABLES.PEOPLE).insert({
                    company_id: companyData.id,
                    template_id: defaultTemplateId,
                    first_name: person.first_name,
                    last_name: person.last_name,
                    title: person.title,
                    email: person.email,
                    phone: person.phone,
                    photo_url: photoPath,
                });
            }
        }

        setStatus("");
        setLoading(false);
        router.refresh();
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={handleSeed}
                disabled={loading}
                className="rounded-lg border border-sky-200 bg-sky-50 px-5 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100 disabled:opacity-50"
            >
                {loading ? "Creating..." : "Load sample data"}
            </button>
            {status && <p className="text-xs text-zinc-400">{status}</p>}
        </div>
    );
}
