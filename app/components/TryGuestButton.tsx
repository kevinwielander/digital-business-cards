"use client";

import { useRouter } from "next/navigation";
import { useGuest } from "./GuestProvider";

export default function TryGuestButton() {
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
            className="rounded-xl border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white hover:shadow-sm"
        >
            Try without account
        </button>
    );
}
