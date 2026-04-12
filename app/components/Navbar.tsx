import Link from "next/link";
import AddCompanyButton from "./AddCompanyButton";

export function Navbar() {
    return (
        <nav className="w-full h-16 bg-zinc-800 text-white flex items-center justify-between px-6 border-b border-zinc-700">
            <Link href="/" className="text-lg font-bold">
                Business Card Generator
            </Link>
            <div className="flex items-center gap-6">
                <Link href="/" className="hover:text-zinc-400">Home</Link>
                <Link href="/companies" className="hover:text-zinc-400">Companies</Link>
            </div>
        </nav>
    );
}
