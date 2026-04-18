import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import GuestNavLinks from "./GuestNavLinks";
import NavLinks from "./NavLinks";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

export async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-4 sm:gap-8">
                    <MobileMenu isLoggedIn={!!user} />
                    <Link href="/" className="text-base font-bold tracking-tight text-zinc-900">
                        OwnCardly
                    </Link>
                    <div className="hidden md:flex">
                        {user ? (
                            <NavLinks />
                        ) : (
                            <GuestNavLinks />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
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
