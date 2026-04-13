import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import AddCompanyButton from "../components/AddCompanyButton";
import SeedSampleData from "../components/SeedSampleData";

export default async function CompaniesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: companies } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const companiesWithLogos = await Promise.all(
        (companies ?? []).map(async (company) => {
            let logoUrl: string | null = null;
            if (company.logo_url) {
                const { data } = await supabase.storage
                    .from(STORAGE.LOGOS)
                    .createSignedUrl(company.logo_url, 3600);
                logoUrl = data?.signedUrl ?? null;
            }
            return { ...company, logoUrl };
        })
    );

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
                    <p className="mt-1 text-sm text-zinc-500">Manage your companies and their teams.</p>
                </div>
                <AddCompanyButton />
            </div>

            {companiesWithLogos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                        <span className="text-xl">+</span>
                    </div>
                    <p className="font-medium text-zinc-700">No companies yet</p>
                    <p className="mt-1 text-sm text-zinc-500">Add a company to start creating business cards, or try with sample data.</p>
                    <div className="mt-4">
                        <SeedSampleData />
                    </div>
                </div>
            ) : (
                <div className="grid gap-3">
                    {companiesWithLogos.map((company) => (
                        <Link
                            key={company.id}
                            href={`/companies/${company.id}`}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
                        >
                            {company.logoUrl ? (
                                <img
                                    src={company.logoUrl}
                                    alt={company.name}
                                    className="h-12 w-12 rounded-lg object-contain"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-lg font-semibold text-zinc-500">
                                    {company.name[0]}
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-zinc-900">{company.name}</p>
                                {company.domain && <p className="text-sm text-zinc-500">{company.domain}</p>}
                            </div>
                            <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
