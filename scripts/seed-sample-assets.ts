import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET = "sample-assets";

// Logo SVG generators
function wordmarkSvg(text: string, color: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
        <rect width="320" height="80" rx="8" fill="${color}"/>
        <text x="160" y="50" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="32" font-weight="800" fill="#fff" letter-spacing="2">${text}</text>
    </svg>`;
}

function iconWordSvg(name: string, color: string): string {
    const initial = name[0];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="70" viewBox="0 0 300 70">
        <rect x="0" y="5" width="60" height="60" rx="14" fill="${color}"/>
        <text x="30" y="45" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="30" font-weight="800" fill="#fff">${initial}</text>
        <text x="80" y="47" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="700" fill="${color}">${name}</text>
    </svg>`;
}

function stackedSvg(name: string, color: string): string {
    const initial = name[0];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="60" r="40" fill="${color}"/>
        <text x="80" y="72" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="32" font-weight="800" fill="#fff">${initial}</text>
        <text x="80" y="130" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="700" fill="${color}">${name}</text>
    </svg>`;
}

async function uploadSvgAsPng(filename: string, svgContent: string) {
    // Upload SVG directly - browsers render it fine
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, blob, { contentType: "image/svg+xml", upsert: true });

    if (error) console.error(`Failed to upload ${filename}:`, error.message);
    else console.log(`Uploaded ${filename}`);
}

async function uploadPhoto(filename: string, url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`Failed to fetch ${url}: ${res.status}`);
        return;
    }
    const blob = await res.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, buffer, { contentType: "image/jpeg", upsert: true });

    if (error) console.error(`Failed to upload ${filename}:`, error.message);
    else console.log(`Uploaded ${filename}`);
}

async function main() {
    console.log("Uploading sample logos...");

    await uploadSvgAsPng("acme-logo.png", wordmarkSvg("ACME", "#1e3a5f"));
    await uploadSvgAsPng("nova-logo.png", iconWordSvg("Nova Digital", "#7c3aed"));
    await uploadSvgAsPng("greenleaf-logo.png", stackedSvg("Greenleaf", "#16a34a"));

    console.log("\nUploading sample photos...");

    const photos: [string, string][] = [
        ["sarah-chen.jpg", "https://randomuser.me/api/portraits/women/44.jpg"],
        ["marcus-rivera.jpg", "https://randomuser.me/api/portraits/men/32.jpg"],
        ["emily-watson.jpg", "https://randomuser.me/api/portraits/women/68.jpg"],
        ["lisa-andersen.jpg", "https://randomuser.me/api/portraits/women/17.jpg"],
        ["tom-bauer.jpg", "https://randomuser.me/api/portraits/men/46.jpg"],
        ["alex-morgan.jpg", "https://randomuser.me/api/portraits/men/22.jpg"],
        ["priya-sharma.jpg", "https://randomuser.me/api/portraits/women/90.jpg"],
    ];

    for (const [filename, url] of photos) {
        await uploadPhoto(filename, url);
    }

    // Update the logo_url and photo_url in the DB to use public URLs
    const { data: { publicUrl: baseUrl } } = supabase.storage.from(BUCKET).getPublicUrl("");

    console.log(`\nPublic base URL: ${baseUrl}`);
    console.log("\nDone! Sample assets uploaded.");
}

main().catch(console.error);
