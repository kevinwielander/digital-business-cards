"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuest } from "./GuestProvider";
import { CompanyModal } from "./CompanyModal";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { getSampleAssetUrl } from "@/lib/sample-utils";

interface SampleCompany {
    id: string;
    name: string;
    domain: string;
    logo_url: string | null;
    is_sample: boolean;
}

export default function GuestCompaniesPage() {
    const { isGuest, data } = useGuest();
    const [showModal, setShowModal] = useState(false);
    const [sampleCompanies, setSampleCompanies] = useState<SampleCompany[]>([]);

    useEffect(() => {
        async function loadSamples() {
            const supabase = createClient();
            const { data } = await supabase
                .from(TABLES.COMPANIES)
                .select("*")
                .eq("is_sample", true);
            if (data) setSampleCompanies(data);
        }
        loadSamples();
    }, []);

    if (!isGuest) return null;

    const allCompanies = [
        ...data.companies.map((c) => ({ ...c, is_sample: false, logoUrl: c.logo_url })),
        ...sampleCompanies.map((c) => ({
            ...c,
            logoUrl: c.logo_url ? getSampleAssetUrl(c.logo_url) : null,
        })),
    ];

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
                    <p className="mt-1 text-sm text-zinc-500">Manage your companies and their teams.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    + Add Company
                </button>
            </div>

            {allCompanies.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                        <span className="text-xl">+</span>
                    </div>
                    <p className="font-medium text-zinc-700">No companies yet</p>
                    <p className="mt-1 text-sm text-zinc-500">Add a company to start creating business cards.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {allCompanies.map((company) => (
                        <Link
                            key={company.id}
                            href={`/companies/${company.id}`}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
                        >
                            {company.logoUrl ? (
                                <img src={company.logoUrl} alt={company.name} className="h-12 w-12 rounded-lg object-contain" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-lg font-semibold text-zinc-500">
                                    {company.name[0]}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-zinc-900">{company.name}</p>
                                    {company.is_sample && (
                                        <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">
                                            Sample
                                        </span>
                                    )}
                                </div>
                                {company.domain && <p className="text-sm text-zinc-500">{company.domain}</p>}
                            </div>
                            <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            )}

            {showModal && (
                <CompanyModal
                    onClose={() => setShowModal(false)}
                    name=""
                    domain=""
                    website=""
                    logo={null}
                />
            )}
        </div>
    );
}
