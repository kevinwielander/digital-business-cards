import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { resolveImageUrl } from "@/lib/sample-utils";
import GuestGate from "./components/GuestGate";
import DashboardContent from "./components/DashboardContent";
import LandingContent from "./components/LandingContent";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <GuestGate>
                <LandingContent />
            </GuestGate>
        );
    }

    // User's own data
    const { data: userCompanies } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    const { data: userTemplates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    // Sample data
    const { data: sampleCompanies } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("is_sample", true)
        .limit(5);

    const { data: sampleTemplates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("is_sample", true)
        .limit(5);

    const companies = [...(userCompanies ?? []), ...(sampleCompanies ?? [])];
    const templates = [...(userTemplates ?? []), ...(sampleTemplates ?? [])];

    const userCompanyIds = (userCompanies ?? []).map((c) => c.id);
    let peopleCount = 0;
    if (userCompanyIds.length > 0) {
        const { count } = await supabase
            .from(TABLES.PEOPLE)
            .select("*", { count: "exact", head: true })
            .in("company_id", userCompanyIds);
        peopleCount = count ?? 0;
    }

    const { count: samplePeopleCount } = await supabase
        .from(TABLES.PEOPLE)
        .select("*", { count: "exact", head: true })
        .eq("is_sample", true);

    const totalPeople = peopleCount + (samplePeopleCount ?? 0);

    const companiesWithLogos = await Promise.all(
        companies.map(async (company) => {
            const logoUrl = await resolveImageUrl(supabase, STORAGE.LOGOS, company.logo_url, company.is_sample);
            return { ...company, logoUrl };
        })
    );

    return (
        <DashboardContent
            companies={companiesWithLogos}
            templates={templates}
            totalPeople={totalPeople}
        />
    );
}
