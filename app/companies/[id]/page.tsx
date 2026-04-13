import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import { notFound } from "next/navigation";
import PeopleList from "@/app/components/PeopleList";
import DeleteCompanyButton from "@/app/components/DeleteCompanyButton";

export default async function CompanyDetailPage(props: PageProps<"/companies/[id]">) {
    const { id } = await props.params;

    const supabase = await createClient();
    const { data: company } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("id", id)
        .single();

    if (!company) notFound();

    let logoUrl: string | null = null;
    if (company.logo_url) {
        const { data } = await supabase.storage
            .from(STORAGE.LOGOS)
            .createSignedUrl(company.logo_url, 3600);
        logoUrl = data?.signedUrl ?? null;
    }

    const { data: people } = await supabase
        .from(TABLES.PEOPLE)
        .select("*")
        .eq("company_id", id)
        .order("created_at", { ascending: true });

    const { data: templates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("id, name");

    const peopleWithPhotos = await Promise.all(
        (people ?? []).map(async (person) => {
            let photoSignedUrl: string | null = null;
            if (person.photo_url) {
                const { data } = await supabase.storage
                    .from(STORAGE.PHOTOS)
                    .createSignedUrl(person.photo_url, 3600);
                photoSignedUrl = data?.signedUrl ?? null;
            }
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
                <DeleteCompanyButton companyId={id} companyName={company.name} />
            </div>

            <PeopleList
                people={peopleWithPhotos}
                companyId={id}
                templates={templates ?? []}
            />
        </div>
    );
}
