"use client";

import Link from "next/link";
import { useTranslation } from "./I18nProvider";

export default function LandingContent() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 flex-col">
            {/* Hero */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#C4B5FD] opacity-30 blur-3xl" />
                    <div className="absolute -right-20 top-10 h-60 w-60 rounded-full bg-[#FF6B35] opacity-20 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#86EFAC] opacity-30 blur-3xl" />
                </div>

                <div className="relative text-center">
                    <div className="mb-4 inline-block rounded-full bg-[#FF6B35]/10 px-4 py-1.5 text-xs font-medium text-[#FF6B35]">
                        {t.landing_free_badge}
                    </div>
                    <h1 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-[#1A1128] sm:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        {t.landing_headline_1}{" "}
                        <span className="text-[#FF6B35]">
                            {t.landing_headline_2}
                        </span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-[#4A3B5C]">
                        {t.landing_subtitle}
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/create"
                            className="rounded-xl bg-[#FF6B35] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6B35]/20 transition hover:bg-[#e55a2a]"
                        >
                            Create Your Card
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-xl border border-[#1A1128]/20 px-7 py-3 text-sm font-semibold text-[#1A1128] transition hover:bg-white hover:shadow-sm"
                        >
                            Manage Team Cards
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="mx-auto w-full max-w-5xl px-6 pb-24">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>}
                        title={t.feature_designer_title}
                        description={t.feature_designer_desc}
                    />
                    <FeatureCard
                        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                        title={t.feature_import_title}
                        description={t.feature_import_desc}
                    />
                    <FeatureCard
                        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>}
                        title={t.feature_fields_title}
                        description={t.feature_fields_desc}
                    />
                    <FeatureCard
                        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>}
                        title={t.feature_export_title}
                        description={t.feature_export_desc}
                    />
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{t.landing_templates_title}</h2>
                    <p className="mt-2 text-zinc-500">{t.landing_templates_subtitle}</p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        {[
                            { bg: "#0f172a", accent: "linear-gradient(135deg, #667eea, #764ba2)", label: "Gradient Wave" },
                            { bg: "#0a0a0a", accent: "linear-gradient(90deg, #f093fb, #f5576c)", label: "Neon Dark" },
                            { bg: "#fefce8", accent: "linear-gradient(180deg, #f59e0b, #d97706)", label: "Warm Minimal" },
                            { bg: "#111827", accent: "linear-gradient(135deg, #2563eb, #60a5fa)", label: "Logo Background" },
                        ].map((tmpl) => (
                            <div key={tmpl.label} className="flex flex-col items-center gap-2">
                                <div className="h-20 w-36 overflow-hidden rounded-lg shadow-md" style={{ backgroundColor: tmpl.bg }}>
                                    <div className="h-2 w-full" style={{ background: tmpl.accent }} />
                                    <div className="flex gap-2 p-2.5">
                                        <div className="h-6 w-6 rounded-full bg-white/20" />
                                        <div className="flex flex-col gap-1">
                                            <div className="h-2 w-14 rounded bg-white/30" />
                                            <div className="h-1.5 w-10 rounded bg-white/15" />
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-400">{tmpl.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Open Source Banner */}
                <div className="mt-20 rounded-2xl border border-[#C4B5FD]/30 bg-[#1A1128] p-10 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        100% Open Source
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
                        OwnCardly is MIT licensed. Self-host it, modify it, make it yours. No vendor lock-in, no hidden fees, no data collection.
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href="https://github.com/kevinwielander/digital-business-cards"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#1A1128] transition hover:bg-white/90"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                            Star on GitHub
                        </a>
                        <a
                            href="https://github.com/kevinwielander/digital-business-cards#quick-start"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Self-host guide
                        </a>
                    </div>
                </div>
            </div>
        </div>
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
