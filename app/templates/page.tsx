import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TABLES } from "@/lib/supabase/constants";
import { SAMPLE_TEMPLATES } from "@/lib/sample-templates";
import UseTemplateButton from "@/app/components/UseTemplateButton";
import DeleteTemplateButton from "@/app/components/DeleteTemplateButton";

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
        <div className="mx-auto w-full max-w-4xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
                    <p className="mt-1 text-sm text-zinc-500">Design and manage your business card templates.</p>
                </div>
                <Link
                    href="/templates/new"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    + New Template
                </Link>
            </div>

            {/* User templates */}
            {templates && templates.length > 0 && (
                <div className="mb-12">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Your Templates</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                <Link href={`/templates/${template.id}/edit`} className="flex-1">
                                    <p className="font-semibold text-zinc-900">{template.name}</p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        {template.config?.width ?? 450} x {template.config?.height ?? 260}
                                        {template.config?.elements && ` · ${template.config.elements.length} elements`}
                                    </p>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <DeleteTemplateButton templateId={template.id} templateName={template.name} />
                                    <Link href={`/templates/${template.id}/edit`}>
                                        <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Starter templates */}
            <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Starter Templates</h2>
                <p className="mb-4 text-sm text-zinc-500">Use these as a starting point — they'll be copied to your templates so you can customize them.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    {SAMPLE_TEMPLATES.map((sample, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-zinc-200 bg-white p-5"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-zinc-900">{sample.name}</p>
                                    <p className="text-sm text-zinc-500">
                                        {sample.config.width} x {sample.config.height} · {sample.config.elements.length} elements
                                    </p>
                                </div>
                            </div>
                            {/* Mini preview */}
                            <div className="mb-4 flex justify-center rounded-lg bg-zinc-50 p-4">
                                <div
                                    className="relative overflow-hidden rounded shadow-sm"
                                    style={{
                                        width: sample.config.width * 0.4,
                                        height: sample.config.height * 0.4,
                                        backgroundColor: sample.config.backgroundColor,
                                    }}
                                >
                                    {sample.config.elements
                                        .filter((el) => el.type === "shape")
                                        .map((el) => (
                                            <div
                                                key={el.id}
                                                style={{
                                                    position: "absolute",
                                                    left: el.x * 0.4,
                                                    top: el.y * 0.4,
                                                    width: el.width * 0.4,
                                                    height: el.height * 0.4,
                                                    backgroundColor: el.backgroundColor,
                                                    borderRadius: el.shapeRadius ? el.shapeRadius * 0.4 : 0,
                                                }}
                                            />
                                        ))}
                                    {sample.config.elements
                                        .filter((el) => el.type === "text")
                                        .map((el) => (
                                            <div
                                                key={el.id}
                                                style={{
                                                    position: "absolute",
                                                    left: el.x * 0.4,
                                                    top: el.y * 0.4,
                                                    width: el.width * 0.4,
                                                    height: el.height * 0.4,
                                                    backgroundColor: el.color ?? "#ccc",
                                                    borderRadius: 1,
                                                    opacity: 0.2,
                                                }}
                                            />
                                        ))}
                                </div>
                            </div>
                            <UseTemplateButton name={sample.name} config={sample.config} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
