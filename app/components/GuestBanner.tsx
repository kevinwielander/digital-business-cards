"use client";

import Link from "next/link";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";

export default function GuestBanner() {
    const { isGuest } = useGuest();
    const { t } = useTranslation();

    if (!isGuest) return null;

    return (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-800">
            {t.guest_banner}{" "}
            <Link href="/login" className="font-semibold text-amber-900 underline hover:no-underline">
                {t.guest_banner_link}
            </Link>
        </div>
    );
}
