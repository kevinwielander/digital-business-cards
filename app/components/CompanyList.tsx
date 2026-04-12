import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STORAGE, TABLES } from "@/lib/supabase/constants";
import CompanyCard from "./CompanyCard";

export async function CompanyList(){
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user)
    if (!user) return null;
    const companies = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("user_id", user?.id);

    console.log(companies)
    if (!user) return;
    const companiesWithLogos = await Promise.all(
        (companies.data ?? []).map(async (company) => {
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
        <div className="mt-8 w-full">
            {companiesWithLogos.length === 0 ? (
                <p className="text-center text-zinc-500">No companies added yet.</p>
            ) : (
                <div className="grid gap-4">
                    {companiesWithLogos.map((company) => (
                        <Link key={company.id} href={`/companies/${company.id}`}>
                            <CompanyCard
                                name={company.name}
                                domain={company.domain}
                                logoUrl={company.logoUrl}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}