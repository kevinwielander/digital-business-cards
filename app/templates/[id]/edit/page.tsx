import { createClient } from "@/lib/supabase/server";
import { TABLES } from "@/lib/supabase/constants";
import TemplateDesigner from "@/app/components/TemplateDesigner";
import { notFound } from "next/navigation";

export default async function EditTemplatePage(props: PageProps<"/templates/[id]/edit">) {
    const { id } = await props.params;

    const supabase = await createClient();
    const { data: template } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("id", id)
        .single();

    if (!template) notFound();

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <h1 className="mb-8 text-2xl font-semibold">Edit Template</h1>
            <TemplateDesigner
                templateId={template.id}
                initialName={template.name}
                initialConfig={template.config}
            />
        </div>
    );
}
