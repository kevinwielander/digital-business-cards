import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const code = searchParams.get("code");

    const supabase = await createClient();

    // PKCE flow (default with @supabase/ssr) — magic link redirects with ?code=
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(new URL("/auth/migrate", origin));
        }
    }

    // Legacy flow — token_hash + type params
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as "email" | "magiclink",
        });

        if (!error) {
            return NextResponse.redirect(new URL("/auth/migrate", origin));
        }
    }

    return NextResponse.redirect(new URL("/login", request.url));
}
