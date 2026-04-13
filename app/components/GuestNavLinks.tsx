"use client";

import Link from "next/link";
import { useGuest } from "./GuestProvider";

export default function GuestNavLinks() {
    const { isGuest } = useGuest();

    if (!isGuest) return null;

    return (
        <div className="flex items-center gap-1">
            <Link href="/" className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900">
                Dashboard
            </Link>
            <Link href="/companies" className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900">
                Companies
            </Link>
            <Link href="/templates" className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900">
                Templates
            </Link>
        </div>
    );
}
