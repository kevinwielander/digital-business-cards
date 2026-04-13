"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { SAMPLE_COMPANIES } from "@/lib/sample-data";
import { SAMPLE_TEMPLATES } from "@/lib/sample-templates";

async function urlToBlob(url: string): Promise<Blob> {
    const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
    return res.blob();
}

async function svgToPngBlob(svgDataUrl: string, size = 200): Promise<Blob> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, size, size);
            canvas.toBlob((blob) => resolve(blob!), "image/png");
        };
        img.src = svgDataUrl;
    });
}

export default function SeedSampleData() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSeed() {
        setLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Create sample templates
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

        // Create sample companies with logos and people with avatars
        for (const company of SAMPLE_COMPANIES) {
            // Upload company logo
            let logoPath: string | null = null;
            try {
                const logoBlob = await svgToPngBlob(company.logoDataUrl);
                const logoFilePath = `${user.id}/sample-${company.name.toLowerCase().replace(/\s+/g, "-")}.png`;
                await supabase.storage.from(STORAGE.LOGOS).upload(logoFilePath, logoBlob, {
                    contentType: "image/png",
                    upsert: true,
                });
                logoPath = logoFilePath;
            } catch {
                // Continue without logo
            }

            const { data: companyData } = await supabase
                .from(TABLES.COMPANIES)
                .insert({
                    user_id: user.id,
                    name: company.name,
                    domain: company.domain,
                    logo_url: logoPath,
                })
                .select("id")
                .single();

            if (companyData && defaultTemplateId) {
                for (const person of company.people) {
                    // Upload person avatar
                    let photoPath: string | null = null;
                    try {
                        const avatarBlob = await urlToBlob(person.avatarUrl);
                        const photoFilePath = `${user.id}/sample-${person.first_name.toLowerCase()}-${person.last_name.toLowerCase()}.png`;
                        await supabase.storage.from(STORAGE.PHOTOS).upload(photoFilePath, avatarBlob, {
                            contentType: "image/png",
                            upsert: true,
                        });
                        photoPath = photoFilePath;
                    } catch {
                        // Continue without photo
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
        }

        router.refresh();
        setLoading(false);
    }

    return (
        <button
            onClick={handleSeed}
            disabled={loading}
            className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-5 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100 disabled:opacity-50"
        >
            {loading ? "Creating sample data..." : "Load sample data"}
        </button>
    );
}
