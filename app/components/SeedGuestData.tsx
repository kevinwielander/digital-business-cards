"use client";

import { useState } from "react";
import { useGuest } from "./GuestProvider";
import { SAMPLE_COMPANIES } from "@/lib/sample-data";
import { SAMPLE_TEMPLATES } from "@/lib/sample-templates";
import { setGuestData, getGuestData } from "@/lib/guest-store";
import type { GuestData, GuestCompany, GuestPerson, GuestTemplate } from "@/lib/guest-store";

export default function SeedGuestData() {
    const { isGuest } = useGuest();
    const [loading, setLoading] = useState(false);

    function handleSeed() {
        setLoading(true);

        const existing = getGuestData();
        const templates: GuestTemplate[] = [...existing.templates];
        const companies: GuestCompany[] = [...existing.companies];
        const people: GuestPerson[] = [...existing.people];

        // Create templates
        const templateIds: string[] = [];
        for (const sample of SAMPLE_TEMPLATES.slice(0, 2)) {
            const id = crypto.randomUUID();
            templates.push({
                id,
                name: sample.name,
                config: sample.config,
                created_at: new Date().toISOString(),
            });
            templateIds.push(id);
        }

        const defaultTemplateId = templateIds[0];

        // Create companies and people
        for (const company of SAMPLE_COMPANIES) {
            const companyId = crypto.randomUUID();
            companies.push({
                id: companyId,
                name: company.name,
                domain: company.domain,
                website: company.website,
                logo_url: null,
                created_at: new Date().toISOString(),
            });

            for (const person of company.people) {
                people.push({
                    id: crypto.randomUUID(),
                    company_id: companyId,
                    template_id: defaultTemplateId,
                    first_name: person.first_name,
                    last_name: person.last_name,
                    title: person.title,
                    email: person.email,
                    phone: person.phone,
                    photo_url: null,
                    created_at: new Date().toISOString(),
                });
            }
        }

        const newData: GuestData = { companies, people, templates };
        setGuestData(newData);

        // Force full reload so everything picks up the new data
        window.location.reload();
    }

    if (!isGuest) return null;

    return (
        <button
            onClick={handleSeed}
            disabled={loading}
            className="rounded-lg border border-sky-200 bg-sky-50 px-5 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100 disabled:opacity-50"
        >
            {loading ? "Creating..." : "Load sample data"}
        </button>
    );
}
