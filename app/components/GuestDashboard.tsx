"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { getSampleAssetUrl } from "@/lib/sample-utils";

interface SampleCompany {
    id: string;
    name: string;
    domain: string;
    logo_url: string | null;
}

export default function GuestDashboard() {
    const { isGuest, data } = useGuest();
    const { t } = useTranslation();
    const [sampleCompanies, setSampleCompanies] = useState<SampleCompany[]>([]);
    const [sampleTemplateCount, setSampleTemplateCount] = useState(0);
    const [samplePeopleCount, setSamplePeopleCount] = useState(0);

    useEffect(() => {
        async function loadSamples() {
            const supabase = createClient();
            const { data: companies } = await supabase
                .from(TABLES.COMPANIES)
                .select("*")
                .eq("is_sample", true);
            if (companies) setSampleCompanies(companies);

            const { count: tCount } = await supabase
                .from(TABLES.TEMPLATES)
                .select("*", { count: "exact", head: true })
                .eq("is_sample", true);
            setSampleTemplateCount(tCount ?? 0);

            const { count: pCount } = await supabase
                .from(TABLES.PEOPLE)
                .select("*", { count: "exact", head: true })
                .eq("is_sample", true);
            setSamplePeopleCount(pCount ?? 0);
        }
        loadSamples();
    }, []);

    if (!isGuest) return null;

    const totalCompanies = data.companies.length + sampleCompanies.length;
    const totalTemplates = data.templates.length + sampleTemplateCount;
    const totalPeople = data.people.length + samplePeopleCount;

    const allCompanies = [
        ...data.companies.map((c) => ({ ...c, is_sample: false, logoUrl: c.logo_url })),
        ...sampleCompanies.map((c) => ({
            ...c,
            is_sample: true,
            logoUrl: c.logo_url ? getSampleAssetUrl(c.logo_url) : null,
        })),
    ];

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">{t.dash_title}</h1>
                <p className="mt-1 text-zinc-500">{t.dash_welcome}</p>
            </div>

            <div className="mb-10 grid grid-cols-3 gap-4">
                <Link href="/companies" className="transition hover:shadow-sm">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5">
                        <p className="text-sm text-zinc-500">{t.dash_companies}</p>
                        <p className="mt-1 text-2xl font-bold">{totalCompanies}</p>
                    </div>
                </Link>
                <Link href="/templates" className="transition hover:shadow-sm">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5">
                        <p className="text-sm text-zinc-500">{t.dash_templates}</p>
                        <p className="mt-1 text-2xl font-bold">{totalTemplates}</p>
                    </div>
                </Link>
                <div className="rounded-xl border border-zinc-200 bg-white p-5">
                    <p className="text-sm text-zinc-500">{t.dash_people}</p>
                    <p className="mt-1 text-2xl font-bold">{totalPeople}</p>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">{t.dash_quick_actions}</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <QuickAction href="/companies" title={t.dash_add_company} description={t.dash_add_company_desc} />
                    <QuickAction href="/templates/new" title={t.dash_create_template} description={t.dash_create_template_desc} />
                    <QuickAction href="/templates" title={t.dash_browse_templates} description={t.dash_browse_templates_desc} />
                </div>
            </div>

            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{t.dash_companies}</h2>
                    <Link href="/companies" className="text-sm text-zinc-500 hover:text-zinc-800">{t.dash_view_all}</Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {allCompanies.map((company) => (
                        <Link
                            key={company.id}
                            href={`/companies/${company.id}`}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
                        >
                            {company.logoUrl ? (
                                <img src={company.logoUrl} alt={company.name} className="h-10 w-10 rounded-lg object-contain" />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-500">
                                    {company.name[0]}
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-zinc-900">{company.name}</p>
                                    {company.is_sample && (
                                        <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">{t.companies_sample}</span>
                                    )}
                                </div>
                                {company.domain && <p className="text-sm text-zinc-500">{company.domain}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function QuickAction({ href, title, description }: { href: string; title: string; description: string }) {
    return (
        <Link
            href={href}
            className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
        >
            <p className="font-medium text-zinc-900">{title}</p>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </Link>
    );
}
