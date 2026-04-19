import Link from "next/link";
import Image from "next/image";
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
        <nav className="sticky top-0 z-40 w-full border-b border-[#1A1128]/10 bg-[#FFF4E6]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-4 sm:gap-8">
                    <MobileMenu isLoggedIn={!!user} />
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/icon.svg" alt="OwnCardly" width={28} height={28} />
                        <span className="hidden sm:inline" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 18 }}>
                            <span className="italic text-[#FF6B35]">Own</span>
                            <span className="text-[#1A1128]">Cardly</span>
                        </span>
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
                            <span className="hidden text-sm text-[#4A3B5C] sm:inline">{user.email}</span>
                            <LogoutButton />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-[#FF6B35] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#e55a2a]"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
