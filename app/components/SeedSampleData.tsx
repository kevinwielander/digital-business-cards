"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { SAMPLE_COMPANIES } from "@/lib/sample-data";
import { SAMPLE_TEMPLATES } from "@/lib/sample-templates";

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

        // Create sample companies with people
        for (const company of SAMPLE_COMPANIES) {
            const { data: companyData } = await supabase
                .from(TABLES.COMPANIES)
                .insert({
                    user_id: user.id,
                    name: company.name,
                    domain: company.domain,
                    logo_url: null,
                })
                .select("id")
                .single();

            if (companyData && defaultTemplateId) {
                const people = company.people.map((person) => ({
                    company_id: companyData.id,
                    template_id: defaultTemplateId,
                    first_name: person.first_name,
                    last_name: person.last_name,
                    title: person.title,
                    email: person.email,
                    phone: person.phone,
                    photo_url: null,
                }));

                await supabase.from(TABLES.PEOPLE).insert(people);
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
