import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import SeedSampleData from "./components/SeedSampleData";
import TryGuestButton from "./components/TryGuestButton";
import GuestDashboard from "./components/GuestDashboard";
import GuestGate from "./components/GuestGate";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <GuestGate>
            <div className="flex flex-1 flex-col">
                {/* Hero */}
                <div className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24">
                    {/* Background decoration */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-100 opacity-60 blur-3xl" />
                        <div className="absolute -right-20 top-10 h-60 w-60 rounded-full bg-violet-100 opacity-60 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-amber-100 opacity-50 blur-3xl" />
                    </div>

                    <div className="relative text-center">
                        <div className="mb-4 inline-block rounded-full bg-sky-50 px-4 py-1.5 text-xs font-medium text-sky-700">
                            Free to use — no credit card required
                        </div>
                        <h1 className="mx-auto max-w-2xl text-5xl font-extrabold tracking-tight text-zinc-900">
                            Beautiful business cards,{" "}
                            <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">
                                designed in minutes
                            </span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-zinc-500">
                            Create stunning digital business cards for your entire team. Drag-and-drop designer, instant generation, and one-click contact sharing.
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Link
                                href="/login"
                                className="rounded-xl bg-zinc-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-700"
                            >
                                Get Started Free
                            </Link>
                            <TryGuestButton />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="mx-auto w-full max-w-5xl px-6 pb-24">
                    <div className="grid gap-6 sm:grid-cols-3">
                        <FeatureCard
                            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>}
                            title="Drag & Drop Designer"
                            description="Position text, images, shapes, and QR codes freely on a visual canvas with snap-to-grid alignment."
                        />
                        <FeatureCard
                            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                            title="Team Management"
                            description="Add companies and people, upload photos, and generate cards for your entire organization at once."
                        />
                        <FeatureCard
                            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>}
                            title="Instant Export"
                            description="Generate self-contained HTML cards with embedded images, vCard downloads, and QR codes — ready to deploy."
                        />
                    </div>

                    {/* Sample cards preview */}
                    <div className="mt-16 text-center">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Starter Templates Included</h2>
                        <p className="mt-2 text-zinc-500">Choose from professionally designed templates or create your own from scratch.</p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            {[
                                { bg: "#0f172a", accent: "linear-gradient(135deg, #667eea, #764ba2)", label: "Gradient Wave" },
                                { bg: "#0a0a0a", accent: "linear-gradient(90deg, #f093fb, #f5576c)", label: "Neon Dark" },
                                { bg: "#fefce8", accent: "linear-gradient(180deg, #f59e0b, #d97706)", label: "Warm Minimal" },
                                { bg: "#111827", accent: "linear-gradient(135deg, #2563eb, #60a5fa)", label: "Logo Background" },
                            ].map((t) => (
                                <div key={t.label} className="flex flex-col items-center gap-2">
                                    <div
                                        className="h-20 w-36 overflow-hidden rounded-lg shadow-md"
                                        style={{ backgroundColor: t.bg }}
                                    >
                                        <div className="h-2 w-full" style={{ background: t.accent }} />
                                        <div className="flex gap-2 p-2.5">
                                            <div className="h-6 w-6 rounded-full bg-white/20" />
                                            <div className="flex flex-col gap-1">
                                                <div className="h-2 w-14 rounded bg-white/30" />
                                                <div className="h-1.5 w-10 rounded bg-white/15" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-zinc-400">{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </GuestGate>
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

    const companyIds = (companies ?? []).map((c) => c.id);
    let peopleCount = 0;
    if (companyIds.length > 0) {
        const { count } = await supabase
            .from(TABLES.PEOPLE)
            .select("*", { count: "exact", head: true })
            .in("company_id", companyIds);
        peopleCount = count ?? 0;
    }

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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                {icon}
            </div>
            <h3 className="font-semibold text-zinc-900">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">{description}</p>
        </div>
    );
}
