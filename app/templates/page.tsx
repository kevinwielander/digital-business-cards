import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TABLES } from "@/lib/supabase/constants";

export default async function TemplatesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: templates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Templates</h1>
                <Link
                    href="/templates/new"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    + New Template
                </Link>
            </div>

            {!templates || templates.length === 0 ? (
                <p className="text-center text-zinc-500">No templates yet. Create your first one.</p>
            ) : (
                <div className="grid gap-4">
                    {templates.map((template) => (
                        <Link
                            key={template.id}
                            href={`/templates/${template.id}/edit`}
                            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div>
                                <h3 className="font-semibold text-zinc-900">{template.name}</h3>
                                <p className="text-sm text-zinc-500">
                                    {template.config?.layout ?? "horizontal"} layout
                                </p>
                            </div>
                            <span className="text-sm text-zinc-400">Edit</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
