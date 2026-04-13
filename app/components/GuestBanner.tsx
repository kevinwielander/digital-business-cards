"use client";

import Link from "next/link";
import { useGuest } from "./GuestProvider";

export default function GuestBanner() {
    const { isGuest } = useGuest();

    if (!isGuest) return null;

    return (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-800">
            You're using CardGen as a guest.{" "}
            <span className="font-medium">Your data is stored locally and will be lost if you clear your browser data.</span>{" "}
            <Link href="/login" className="font-semibold text-amber-900 underline hover:no-underline">
                Sign in to save permanently
            </Link>
        </div>
    );
}
