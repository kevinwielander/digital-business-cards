"use client";

import Link from "next/link";
import { useTranslation } from "./I18nProvider";

export default function NavLinks() {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-1">
            <Link href="/" className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900">
                {t.nav_dashboard}
            </Link>
            <Link href="/companies" className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900">
                {t.nav_companies}
            </Link>
            <Link href="/templates" className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900">
                {t.nav_templates}
            </Link>
        </div>
    );
}
