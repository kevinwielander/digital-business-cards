"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/login";
    }

    return (
        <button
            onClick={handleLogout}
            className="rounded-md px-3 py-1.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
            Sign out
        </button>
    );
}
