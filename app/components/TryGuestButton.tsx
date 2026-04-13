"use client";

import { useRouter } from "next/navigation";
import { useGuest } from "./GuestProvider";

export default function TryGuestButton({ className, hideIcon }: { className?: string; hideIcon?: boolean }) {
    const { enterGuestMode } = useGuest();
    const router = useRouter();

    function handleClick() {
        enterGuestMode();
        router.push("/");
        router.refresh();
    }

    return (
        <button
            onClick={handleClick}
            className={className ?? "flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"}
        >
            {!hideIcon && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}
            Try without account
        </button>
    );
}
