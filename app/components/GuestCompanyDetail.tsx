"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { getSampleAssetUrl } from "@/lib/sample-utils";
import PersonModal from "./PersonModal";
import ConfirmModal from "./ConfirmModal";

interface DbCompany {
    id: string;
    name: string;
    domain: string;
    website: string;
    logo_url: string | null;
    is_sample: boolean;
}

interface DbPerson {
    id: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone: string;
    photo_url: string | null;
    template_id: string | null;
    is_sample: boolean;
}

export default function GuestCompanyDetail({ companyId }: { companyId: string }) {
    const { isGuest, data, deleteCompany } = useGuest();
    const { t } = useTranslation();
    const router = useRouter();
    const [showPersonModal, setShowPersonModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editPerson, setEditPerson] = useState<DbPerson | undefined>(undefined);

    // Check if it's a sample company from DB
    const [sampleCompany, setSampleCompany] = useState<DbCompany | null>(null);
    const [samplePeople, setSamplePeople] = useState<DbPerson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSample() {
            const supabase = createClient();
            const { data: company } = await supabase
                .from(TABLES.COMPANIES)
                .select("*")
                .eq("id", companyId)
                .eq("is_sample", true)
                .single();

            if (company) {
                setSampleCompany(company);
                const { data: people } = await supabase
                    .from(TABLES.PEOPLE)
                    .select("*")
                    .eq("company_id", companyId)
                    .eq("is_sample", true);
                setSamplePeople(people ?? []);
            }
            setLoading(false);
        }
        loadSample();
    }, [companyId]);

    if (!isGuest) return null;
    if (loading) return <div className="p-10 text-center text-zinc-400">Loading...</div>;

    // Sample company from DB
    if (sampleCompany) {
        const logoUrl = sampleCompany.logo_url ? getSampleAssetUrl(sampleCompany.logo_url) : null;
        const peopleWithPhotos = samplePeople.map((p) => ({
            ...p,
            photoSignedUrl: p.photo_url ? getSampleAssetUrl(p.photo_url) : null,
        }));

        return (
            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                    <Link href="/companies" className="hover:text-zinc-800">{t.companies_title}</Link>
                    <span>/</span>
                    <span className="text-zinc-900">{sampleCompany.name}</span>
                    <span className="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">{t.companies_sample}</span>
                </div>

                <div className="mb-8 flex items-center gap-5">
                    {logoUrl ? (
                        <img src={logoUrl} alt={sampleCompany.name} className="h-14 w-14 rounded-xl object-contain" />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-xl font-bold text-zinc-400">
                            {sampleCompany.name[0]}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{sampleCompany.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            {sampleCompany.domain && <span>{sampleCompany.domain}</span>}
                            {sampleCompany.website && (
                                <>
                                    {sampleCompany.domain && <span>·</span>}
                                    <span>{sampleCompany.website.replace(/^https?:\/\//, "")}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-700">
                    This is a sample company with demo data. Sign in to create your own companies.
                </div>

                <h2 className="mb-4 text-lg font-semibold">{t.people_title}</h2>
                <div className="grid gap-3">
                    {peopleWithPhotos.map((person) => (
                        <div
                            key={person.id}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4"
                        >
                            {person.photoSignedUrl ? (
                                <img src={person.photoSignedUrl} alt={`${person.first_name} ${person.last_name}`} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-500">
                                    {person.first_name[0]}{person.last_name[0]}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-zinc-900">{person.first_name} {person.last_name}</p>
                                <p className="text-sm text-zinc-500">{person.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Guest's own company from localStorage
    const company = data.companies.find((c) => c.id === companyId);
    if (!company) return <p className="p-10 text-center text-zinc-500">Company not found</p>;

    const people = data.people
        .filter((p) => p.company_id === companyId)
        .map((p) => ({ ...p, photoSignedUrl: null, is_sample: false }));

    const templates = data.templates.map((t) => ({ id: t.id, name: t.name }));

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                <Link href="/companies" className="hover:text-zinc-800">{t.companies_title}</Link>
                <span>/</span>
                <span className="text-zinc-900">{company.name}</span>
            </div>

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-xl font-bold text-zinc-400">
                        {company.name[0]}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            {company.domain && <span>{company.domain}</span>}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                    {t.companies_delete}
                </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t.people_title}</h2>
                <button
                    onClick={() => { setEditPerson(undefined); setShowPersonModal(true); }}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    {t.people_add}
                </button>
            </div>

            {people.length === 0 ? (
                <p className="text-zinc-500">{t.people_empty}</p>
            ) : (
                <div className="grid gap-3">
                    {people.map((person) => (
                        <button
                            key={person.id}
                            onClick={() => { setEditPerson(person as unknown as DbPerson); setShowPersonModal(true); }}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-500">
                                {person.first_name[0]}{person.last_name[0]}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-zinc-900">{person.first_name} {person.last_name}</p>
                                <p className="text-sm text-zinc-500">{person.title}</p>
                            </div>
                            <span className="text-sm text-zinc-400">{t.people_edit}</span>
                        </button>
                    ))}
                </div>
            )}

            {showPersonModal && (
                <PersonModal
                    onClose={() => { setShowPersonModal(false); setEditPerson(undefined); window.location.reload(); }}
                    companyId={companyId}
                    templates={templates}
                    person={editPerson as any}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    title={t.companies_delete}
                    message={t.companies_delete_confirm.replace("{name}", company.name)}
                    confirmLabel={t.modal_delete}
                    destructive
                    onConfirm={() => { deleteCompany(companyId); router.push("/companies"); }}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
}
