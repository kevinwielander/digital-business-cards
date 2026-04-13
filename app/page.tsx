import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import SeedSampleData from "./components/SeedSampleData";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Business Card Generator</h1>
                    <p className="mt-3 max-w-md text-lg text-zinc-500">
                        Design, manage, and generate professional business cards for your team.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    Get Started
                </Link>
            </div>
        );
    }

    const { data: companies } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    const { data: templates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    const { count: peopleCount } = await supabase
        .from(TABLES.PEOPLE)
        .select("*", { count: "exact", head: true })
        .in("company_id", (companies ?? []).map((c) => c.id));

    const companiesWithLogos = await Promise.all(
        (companies ?? []).map(async (company) => {
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

    const hasData = (companies?.length ?? 0) > 0;

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-zinc-500">Welcome back. Here's an overview of your workspace.</p>
            </div>

            {/* Stats */}
            {hasData && (
                <div className="mb-10 grid grid-cols-3 gap-4">
                    <StatCard label="Companies" value={companies?.length ?? 0} href="/companies" />
                    <StatCard label="Templates" value={templates?.length ?? 0} href="/templates" />
                    <StatCard label="People" value={peopleCount ?? 0} />
                </div>
            )}

            {/* Quick actions */}
            <div className="mb-10">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <QuickAction href="/companies" title="Add Company" description="Create a new company with logo and details" />
                    <QuickAction href="/templates/new" title="Create Template" description="Design a new business card layout" />
                    <QuickAction href="/templates" title="Browse Templates" description="View and edit your saved templates" />
                </div>
            </div>

            {/* Recent companies */}
            <div className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Recent Companies</h2>
                    <Link href="/companies" className="text-sm text-zinc-500 hover:text-zinc-800">View all</Link>
                </div>
                {!hasData ? (
                    <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center">
                        <p className="font-medium text-zinc-700">No companies yet</p>
                        <p className="mt-1 text-sm text-zinc-500">Add your own or try with sample data.</p>
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <Link
                                href="/companies"
                                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                            >
                                Add Company
                            </Link>
                            <SeedSampleData />
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {companiesWithLogos.map((company) => (
                            <Link
                                key={company.id}
                                href={`/companies/${company.id}`}
                                className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                {company.logoUrl ? (
                                    <img src={company.logoUrl} alt={company.name} className="h-10 w-10 rounded-lg object-contain" />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-500">
                                        {company.name[0]}
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-zinc-900">{company.name}</p>
                                    {company.domain && <p className="text-sm text-zinc-500">{company.domain}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent templates */}
            {(templates?.length ?? 0) > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Recent Templates</h2>
                        <Link href="/templates" className="text-sm text-zinc-500 hover:text-zinc-800">View all</Link>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {templates!.map((template) => (
                            <Link
                                key={template.id}
                                href={`/templates/${template.id}/edit`}
                                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                <div>
                                    <p className="font-medium text-zinc-900">{template.name}</p>
                                    <p className="text-sm text-zinc-500">
                                        {template.config?.width ?? 450}x{template.config?.height ?? 260}
                                    </p>
                                </div>
                                <span className="text-sm text-zinc-400">Edit</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
    const content = (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
    if (href) return <Link href={href} className="transition hover:shadow-sm">{content}</Link>;
    return content;
}

function QuickAction({ href, title, description }: { href: string; title: string; description: string }) {
    return (
        <Link
            href={href}
            className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
        >
            <p className="font-medium text-zinc-900">{title}</p>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </Link>
    );
}
