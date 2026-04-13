"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "./I18nProvider";
import { LANGUAGES } from "@/lib/i18n/translations";
import type { LangCode } from "@/lib/i18n/translations";

export default function LanguageSwitcher() {
    const { lang, setLang } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find((l) => l.code === lang);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                title="Language"
            >
                <span>{current?.flag}</span>
                <span className="hidden sm:inline">{current?.code.toUpperCase()}</span>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => {
                                setLang(l.code as LangCode);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-zinc-50 ${
                                lang === l.code ? "bg-zinc-50 font-medium text-zinc-900" : "text-zinc-600"
                            }`}
                        >
                            <span className="text-base">{l.flag}</span>
                            <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
