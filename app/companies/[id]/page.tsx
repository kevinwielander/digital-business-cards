import { createClient } from "@/lib/supabase/server";
import { TABLES } from "@/lib/supabase/constants";
import { notFound } from "next/navigation";
import PeopleList from "@/app/components/PeopleList";
import GenerateButton from "@/app/components/GenerateButton";

export default async function CompanyDetailPage(props: PageProps<"/companies/[id]">) {
    const { id } = await props.params;

    const supabase = await createClient();
    const { data: company } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("id", id)
        .single();

    if (!company) notFound();

    const { data: people } = await supabase
        .from(TABLES.PEOPLE)
        .select("*")
        .eq("company_id", id)
        .order("created_at", { ascending: true });

    const { data: templates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("id, name");

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{company.name}</h1>
                    {company.domain && (
                        <p className="text-sm text-zinc-500">{company.domain}</p>
                    )}
                </div>
                <GenerateButton companyId={id} />
            </div>

            <PeopleList
                people={people ?? []}
                companyId={id}
                templates={templates ?? []}
            />
        </div>
    );
}
