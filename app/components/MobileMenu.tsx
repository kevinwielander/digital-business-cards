"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "./I18nProvider";

interface MobileMenuProps {
    isLoggedIn: boolean;
}

export default function MobileMenu({ isLoggedIn }: MobileMenuProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Close on escape
    useEffect(() => {
        if (!open) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open]);

    if (!isLoggedIn) return null;

    return (
        <div className="relative md:hidden" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
                aria-label="Open menu"
            >
                {open ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                        {t.nav_dashboard}
                    </Link>
                    <Link
                        href="/companies"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                        {t.nav_companies}
                    </Link>
                    <Link
                        href="/templates"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                        {t.nav_templates}
                    </Link>
                </div>
            )}
        </div>
    );
}
