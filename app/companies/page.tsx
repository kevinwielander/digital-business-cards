import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { resolveImageUrl } from "@/lib/sample-utils";
import GuestCompaniesPage from "../components/GuestCompaniesPage";
import CompaniesContent from "../components/CompaniesContent";

export default async function CompaniesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return <GuestCompaniesPage />;

    const { data: userCompanies } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const { data: sampleCompanies } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("is_sample", true)
        .order("created_at", { ascending: true });

    const allCompanies = [...(userCompanies ?? []), ...(sampleCompanies ?? [])];

    const companiesWithLogos = await Promise.all(
        allCompanies.map(async (company) => {
            const logoUrl = await resolveImageUrl(supabase, STORAGE.LOGOS, company.logo_url, company.is_sample);
            return { ...company, logoUrl };
        })
    );

    return <CompaniesContent companies={companiesWithLogos} />;
}
