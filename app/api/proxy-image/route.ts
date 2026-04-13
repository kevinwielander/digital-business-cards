import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_HOSTS = ["randomuser.me"];

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

    try {
        const parsed = new URL(url);
        if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
            return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
        }

        const res = await fetch(url);
        const blob = await res.blob();

        return new NextResponse(blob, {
            headers: {
                "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch {
        return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }
}
