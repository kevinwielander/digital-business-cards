"use client";

import { useGuest } from "./GuestProvider";
import GuestDashboard from "./GuestDashboard";

export default function GuestGate({ children }: { children: React.ReactNode }) {
    const { isGuest } = useGuest();

    if (isGuest) return <GuestDashboard />;

    return <>{children}</>;
}
