import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { resolveImageUrl } from "@/lib/sample-utils";
import { notFound } from "next/navigation";
import GuestCompanyDetail from "@/app/components/GuestCompanyDetail";
import CompanyDetailContent from "@/app/components/CompanyDetailContent";

export default async function CompanyDetailPage(props: PageProps<"/companies/[id]">) {
    const { id } = await props.params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <GuestCompanyDetail companyId={id} />;

    const { data: company } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("id", id)
        .single();

    if (!company) notFound();

    const logoUrl = await resolveImageUrl(supabase, STORAGE.LOGOS, company.logo_url, company.is_sample);

    const { data: people } = await supabase
        .from(TABLES.PEOPLE)
        .select("*")
        .eq("company_id", id)
        .order("created_at", { ascending: true });

    const { data: templates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("id, name")
        .or(`user_id.eq.${user.id},is_sample.eq.true`);

    const peopleWithPhotos = await Promise.all(
        (people ?? []).map(async (person) => {
            const photoSignedUrl = await resolveImageUrl(supabase, STORAGE.PHOTOS, person.photo_url, person.is_sample);
            return { ...person, photoSignedUrl };
        })
    );

    return (
        <CompanyDetailContent
            company={company}
            logoUrl={logoUrl}
            people={peopleWithPhotos}
            templates={templates ?? []}
        />
    );
}
