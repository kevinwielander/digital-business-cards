"use client";

import { useRouter } from "next/navigation";
import { useGuest } from "./GuestProvider";
import { useTranslation } from "./I18nProvider";

export default function TryGuestButton({ className }: { className?: string }) {
    const { enterGuestMode } = useGuest();
    const { t } = useTranslation();
    const router = useRouter();

    function handleClick() {
        enterGuestMode();
        router.push("/");
        router.refresh();
    }

    return (
        <button
            onClick={handleClick}
            className={className ?? "rounded-xl border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white hover:shadow-sm"}
        >
            {t.landing_try_guest}
        </button>
    );
}
