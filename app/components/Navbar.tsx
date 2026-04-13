import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import GuestNavLinks from "./GuestNavLinks";

export async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-base font-bold tracking-tight text-zinc-900">
                        CardGen
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-1">
                            <NavLink href="/">Dashboard</NavLink>
                            <NavLink href="/companies">Companies</NavLink>
                            <NavLink href="/templates">Templates</NavLink>
                        </div>
                    ) : (
                        <GuestNavLinks />
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="hidden text-sm text-zinc-500 sm:inline">{user.email}</span>
                            <LogoutButton />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
            {children}
        </Link>
    );
}
