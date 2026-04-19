"use client";

import Link from "next/link";
import { useTranslation } from "./I18nProvider";
import PeopleList from "./PeopleList";
import DeleteCompanyButton from "./DeleteCompanyButton";
import EditCompanyButton from "./EditCompanyButton";
import CustomFieldsManager from "./CustomFieldsManager";
import CompanyAssets from "./CompanyAssets";
import type { CustomFieldDefinition } from "@/lib/types";

interface Person {
    id: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone: string;
    photo_url: string | null;
    photoSignedUrl: string | null;
    template_id: string | null;
    custom_fields?: Record<string, string>;
}

interface Template {
    id: string;
    name: string;
}

interface CompanyDetailContentProps {
    company: {
        id: string;
        name: string;
        domain?: string;
        website?: string;
        is_sample?: boolean;
        custom_field_definitions?: CustomFieldDefinition[];
    };
    logoUrl: string | null;
    people: Person[];
    templates: Template[];
}

export default function CompanyDetailContent({ company, logoUrl, people, templates }: CompanyDetailContentProps) {
    const { t } = useTranslation();

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                <Link href="/companies" className="hover:text-zinc-800">{t.companies_title}</Link>
                <span>/</span>
                <span className="text-zinc-900">{company.name}</span>
                {company.is_sample && (
                    <span className="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">{t.companies_sample}</span>
                )}
            </div>

            {/* Company header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                    {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt={company.name} className="h-14 w-14 rounded-xl object-contain" />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-xl font-bold text-zinc-400">
                            {company.name[0]}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            {company.domain && <span>{company.domain}</span>}
                            {company.website && (
                                <>
                                    {company.domain && <span>·</span>}
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                                        {company.website.replace(/^https?:\/\//, "")}
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {!company.is_sample && (
                    <div className="flex items-center gap-2">
                        <EditCompanyButton
                            id={company.id}
                            name={company.name}
                            domain={company.domain ?? ""}
                            website={company.website ?? ""}
                            logoUrl={logoUrl}
                        />
                        <DeleteCompanyButton companyId={company.id} companyName={company.name} />
                    </div>
                )}
            </div>

            {company.is_sample && (
                <div className="mb-6 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-700">
                    This is a sample company with demo data. You can browse it to see how things work.
                </div>
            )}

            {!company.is_sample && (
                <>
                    <CompanyAssets companyId={company.id} />
                    <CustomFieldsManager
                        companyId={company.id}
                        initialDefs={company.custom_field_definitions ?? []}
                    />
                </>
            )}

            <PeopleList
                people={people}
                companyId={company.id}
                templates={templates}
                isSample={company.is_sample}
                companyName={company.name}
                companyLogoUrl={logoUrl}
                customFieldDefs={company.custom_field_definitions ?? []}
            />
        </div>
    );
}
