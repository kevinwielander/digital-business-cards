"use client";

import Link from "next/link";
import { useTranslation } from "./I18nProvider";

interface Company {
    id: string;
    name: string;
    domain?: string;
    is_sample?: boolean;
    logoUrl?: string | null;
}

interface Template {
    id: string;
    name: string;
    is_sample?: boolean;
    config?: { width?: number; height?: number };
}

interface DashboardContentProps {
    companies: Company[];
    templates: Template[];
    totalPeople: number;
}

export default function DashboardContent({ companies, templates, totalPeople }: DashboardContentProps) {
    const { t } = useTranslation();

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">{t.dash_title}</h1>
                <p className="mt-1 text-zinc-500">{t.dash_welcome}</p>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link href="/companies" className="transition hover:shadow-sm">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5">
                        <p className="text-sm text-zinc-500">{t.dash_companies}</p>
                        <p className="mt-1 text-2xl font-bold">{companies.length}</p>
                    </div>
                </Link>
                <Link href="/templates" className="transition hover:shadow-sm">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5">
                        <p className="text-sm text-zinc-500">{t.dash_templates}</p>
                        <p className="mt-1 text-2xl font-bold">{templates.length}</p>
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
                    <Link href="/companies" className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm">
                        <p className="font-medium text-zinc-900">{t.dash_add_company}</p>
                        <p className="mt-1 text-sm text-zinc-500">{t.dash_add_company_desc}</p>
                    </Link>
                    <Link href="/templates/new" className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm">
                        <p className="font-medium text-zinc-900">{t.dash_create_template}</p>
                        <p className="mt-1 text-sm text-zinc-500">{t.dash_create_template_desc}</p>
                    </Link>
                    <Link href="/templates" className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm">
                        <p className="font-medium text-zinc-900">{t.dash_browse_templates}</p>
                        <p className="mt-1 text-sm text-zinc-500">{t.dash_browse_templates_desc}</p>
                    </Link>
                </div>
            </div>

            <div className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{t.dash_recent_companies}</h2>
                    <Link href="/companies" className="text-sm text-zinc-500 hover:text-zinc-800">{t.dash_view_all}</Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {companies.map((company) => (
                        <Link
                            key={company.id}
                            href={`/companies/${company.id}`}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
                        >
                            {company.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
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

            {templates.length > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{t.dash_templates}</h2>
                        <Link href="/templates" className="text-sm text-zinc-500 hover:text-zinc-800">{t.dash_view_all}</Link>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {templates.map((template) => (
                            <Link
                                key={template.id}
                                href={template.is_sample ? "/templates" : `/templates/${template.id}/edit`}
                                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-zinc-900">{template.name}</p>
                                        {template.is_sample && (
                                            <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">{t.companies_sample}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        {template.config?.width ?? 450}x{template.config?.height ?? 260}
                                    </p>
                                </div>
                                <span className="text-sm text-zinc-400">{template.is_sample ? t.templates_use : t.companies_edit}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
