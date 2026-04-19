"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TryGuestButton from "../components/TryGuestButton";
import { useTranslation } from "../components/I18nProvider";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [sending, setSending] = useState(false);
    const { t } = useTranslation();

    async function handleMagicLink(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;
        setSending(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/confirm`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setMagicLinkSent(true);
        }
        setSending(false);
    }

    async function handleGoogleLogin() {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        }
    }

    return (
        <div className="flex flex-1">
            {/* Left — branding panel */}
            <div className="hidden flex-col justify-between bg-[#1A1128] p-12 text-white lg:flex lg:w-1/2">
                <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icon.svg" alt="OwnCardly" className="h-9 w-9" />
                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 20 }}>
                        <span className="italic text-[#FF6B35]">Own</span>
                        <span className="text-white">Cardly</span>
                    </span>
                </div>

                <div>
                    <blockquote className="text-2xl font-semibold leading-relaxed">
                        &ldquo;{t.login_quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 h-px bg-white/20" />
                    <div className="mt-6 grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-2xl font-bold">8+</p>
                            <p className="text-sm text-zinc-400">{t.templates_starter}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">CSV</p>
                            <p className="text-sm text-zinc-400">{t.feature_import_title}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">vCard</p>
                            <p className="text-sm text-zinc-400">{t.feature_export_title}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {[t.feature_designer_title, t.feature_fields_title, "QR Codes", t.feature_import_title, t.feature_export_title].map((tag) => (
                        <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Right — sign in */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icon.svg" alt="OwnCardly" className="h-9 w-9" />
                        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 20 }}>
                            <span className="italic text-[#FF6B35]">Own</span>
                            <span className="text-[#1A1128]">Cardly</span>
                        </span>
                    </div>

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">{t.login_title}</h1>
                        <p className="mt-2 text-sm text-zinc-500">{t.login_subtitle}</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {magicLinkSent ? (
                            <div className="py-4 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#86EFAC]/30">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1128]">Check your email</h3>
                                <p className="mt-1 text-sm text-[#4A3B5C]">
                                    We sent a magic link to <span className="font-medium">{email}</span>
                                </p>
                                <button
                                    onClick={() => { setMagicLinkSent(false); setEmail(""); }}
                                    className="mt-4 text-sm text-[#FF6B35] hover:underline"
                                >
                                    Use a different email
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Google */}
                                <button
                                    onClick={handleGoogleLogin}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-zinc-50 hover:shadow-md"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    {t.login_google}
                                </button>

                                <div className="my-5 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-zinc-200" />
                                    <span className="text-xs text-zinc-400">{t.login_or}</span>
                                    <div className="h-px flex-1 bg-zinc-200" />
                                </div>

                                {/* Magic Link */}
                                <form onSubmit={handleMagicLink} className="mb-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="mb-3 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e55a2a] disabled:opacity-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {sending ? "Sending..." : "Send magic link"}
                                    </button>
                                </form>

                                <div className="my-5 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-zinc-200" />
                                    <span className="text-xs text-zinc-400">{t.login_or}</span>
                                    <div className="h-px flex-1 bg-zinc-200" />
                                </div>

                                {/* Guest */}
                                <TryGuestButton className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-[#4A3B5C] transition hover:bg-zinc-50" />
                            </>
                        )}
                    </div>

                    <p className="mt-6 text-center text-xs text-[#4A3B5C]/60">
                        {t.login_guest_note}
                    </p>
                </div>
            </div>
        </div>
    );
}
