"use client";

import Link from "next/link";
import { useGuest } from "./GuestProvider";
import SeedGuestData from "./SeedGuestData";

export default function GuestDashboard() {
    const { isGuest, data } = useGuest();

    if (!isGuest) return null;

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-zinc-500">Welcome. Here's an overview of your local workspace.</p>
            </div>

            <div className="mb-10 grid grid-cols-3 gap-4">
                <StatCard label="Companies" value={data.companies.length} />
                <StatCard label="Templates" value={data.templates.length} />
                <StatCard label="People" value={data.people.length} />
            </div>

            <div className="mb-10">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <QuickAction href="/companies" title="Add Company" description="Create a new company with details" />
                    <QuickAction href="/templates/new" title="Create Template" description="Design a new business card layout" />
                    <QuickAction href="/templates" title="Browse Templates" description="View starter templates" />
                </div>
            </div>

            {data.companies.length === 0 && (
                <div className="mb-10 rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center">
                    <p className="font-medium text-zinc-700">No data yet</p>
                    <p className="mt-1 text-sm text-zinc-500">Add your own companies or try with sample data.</p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <Link
                            href="/companies"
                            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                        >
                            Add Company
                        </Link>
                        <SeedGuestData />
                    </div>
                </div>
            )}

            {data.companies.length > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Your Companies</h2>
                        <Link href="/companies" className="text-sm text-zinc-500 hover:text-zinc-800">View all</Link>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {data.companies.map((company) => (
                            <Link
                                key={company.id}
                                href={`/companies/${company.id}`}
                                className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-500">
                                    {company.name[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-zinc-900">{company.name}</p>
                                    {company.domain && <p className="text-sm text-zinc-500">{company.domain}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
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
