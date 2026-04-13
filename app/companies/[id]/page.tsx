import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { resolveImageUrl } from "@/lib/sample-utils";
import { notFound } from "next/navigation";
import PeopleList from "@/app/components/PeopleList";
import DeleteCompanyButton from "@/app/components/DeleteCompanyButton";
import GuestCompanyDetail from "@/app/components/GuestCompanyDetail";

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
            const photoSignedUrl = await resolveImageUrl(
                supabase,
                STORAGE.PHOTOS,
                person.photo_url,
                person.is_sample
            );
            return { ...person, photoSignedUrl };
        })
    );

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                <Link href="/companies" className="hover:text-zinc-800">Companies</Link>
                <span>/</span>
                <span className="text-zinc-900">{company.name}</span>
                {company.is_sample && (
                    <span className="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">
                        Sample
                    </span>
                )}
            </div>

            {/* Company header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    {logoUrl ? (
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
                    <DeleteCompanyButton companyId={id} companyName={company.name} />
                )}
            </div>

            {company.is_sample && (
                <div className="mb-6 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-700">
                    This is a sample company with demo data. You can browse it to see how things work.
                </div>
            )}

            <PeopleList
                people={peopleWithPhotos}
                companyId={id}
                templates={templates ?? []}
                isSample={company.is_sample}
            />
        </div>
    );
}
