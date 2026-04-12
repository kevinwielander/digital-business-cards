import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="w-full h-16 bg-zinc-800 text-white flex items-center justify-between px-6 border-b border-zinc-700">
      <Link href="/" className="text-lg font-bold">
        Business Card Generator
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link href="/" className="text-sm hover:text-zinc-400">Home</Link>
            <Link href="/companies" className="text-sm hover:text-zinc-400">Companies</Link>
            <span className="text-sm text-zinc-400">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className="text-sm hover:text-zinc-400">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
