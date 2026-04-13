"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TryGuestButton from "../components/TryGuestButton";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

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
            <div className="hidden flex-col justify-between bg-zinc-900 p-12 text-white lg:flex lg:w-1/2">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                            <span className="text-sm font-bold">CG</span>
                        </div>
                        <span className="text-lg font-bold">CardGen</span>
                    </div>
                </div>

                <div>
                    <blockquote className="text-2xl font-semibold leading-relaxed">
                        "Design once, generate for everyone. The fastest way to create professional business cards for your entire team."
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/20" />
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-2xl font-bold">8+</p>
                            <p className="text-sm text-zinc-400">Template designs</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">CSV</p>
                            <p className="text-sm text-zinc-400">Bulk import</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">vCard</p>
                            <p className="text-sm text-zinc-400">Contact sharing</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {["Drag & Drop", "Custom Fields", "QR Codes", "Gradients", "Photo Cropping", "Bulk Import"].map((tag) => (
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
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900">
                            <span className="text-sm font-bold text-white">CG</span>
                        </div>
                        <span className="text-lg font-bold">CardGen</span>
                    </div>

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
                        <p className="mt-2 text-sm text-zinc-500">
                            Start designing professional business cards in minutes.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

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
                            Continue with Google
                        </button>

                        <div className="my-5 flex items-center gap-4">
                            <div className="h-px flex-1 bg-zinc-200" />
                            <span className="text-xs text-zinc-400">or</span>
                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>

                        <TryGuestButton />
                    </div>

                    <p className="mt-6 text-center text-xs text-zinc-400">
                        No account needed to try. Your guest data stays in your browser.
                    </p>
                </div>
            </div>
        </div>
    );
}
