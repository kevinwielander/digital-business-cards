import type { createClient } from "@/lib/supabase/server";

const SAMPLE_BUCKET = "sample-assets";

export function getSampleAssetUrl(path: string): string {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${SAMPLE_BUCKET}/${path}`;
}

export async function resolveImageUrl(
    supabase: Awaited<ReturnType<typeof createClient>>,
    bucket: string,
    path: string | null,
    isSample: boolean
): Promise<string | null> {
    if (!path) return null;

    if (isSample) {
        return getSampleAssetUrl(path);
    }

    const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
}
