"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE } from "@/lib/supabase/constants";

interface AssetInfo {
    name: string;
    displayName: string;
    storagePath: string;
    signedUrl?: string;
}

interface AssetPickerProps {
    companyId: string;
    currentSource?: string;
    onSelect: (source: string) => void;
}

function parseDisplayName(filename: string): string {
    // Strip UUID prefix: "a1b2c3-original-name.png" -> "original-name.png"
    const dashIndex = filename.indexOf("-");
    if (dashIndex > 0 && dashIndex < 10) {
        return filename.slice(dashIndex + 1);
    }
    return filename;
}

export default function AssetPicker({ companyId, currentSource, onSelect }: AssetPickerProps) {
    const [assets, setAssets] = useState<AssetInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadAssetsRef = useRef<(() => Promise<void>) | undefined>(undefined);

    useEffect(() => {
        loadAssetsRef.current = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const folder = `${user.id}/${companyId}`;
            const { data: files } = await supabase.storage
                .from(STORAGE.ASSETS)
                .list(folder, { sortBy: { column: "created_at", order: "desc" } });

            if (files) {
                const assetList: AssetInfo[] = [];
                for (const file of files) {
                    if (file.name === ".emptyFolderPlaceholder") continue;
                    const storagePath = `${folder}/${file.name}`;
                    const { data } = await supabase.storage
                        .from(STORAGE.ASSETS)
                        .createSignedUrl(storagePath, 3600);
                    assetList.push({
                        name: file.name,
                        displayName: parseDisplayName(file.name),
                        storagePath,
                        signedUrl: data?.signedUrl ?? undefined,
                    });
                }
                setAssets(assetList);
            }
            setLoading(false);
        };
    }, [companyId]);

    useEffect(() => {
        if (!companyId) return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (cancelled) return;
            if (!user) { setLoading(false); return; }

            const folder = `${user.id}/${companyId}`;
            const { data: files } = await supabase.storage
                .from(STORAGE.ASSETS)
                .list(folder, { sortBy: { column: "created_at", order: "desc" } });

            if (cancelled) return;
            if (files) {
                const assetList: AssetInfo[] = [];
                for (const file of files) {
                    if (file.name === ".emptyFolderPlaceholder") continue;
                    const storagePath = `${folder}/${file.name}`;
                    const { data } = await supabase.storage
                        .from(STORAGE.ASSETS)
                        .createSignedUrl(storagePath, 3600);
                    assetList.push({
                        name: file.name,
                        displayName: parseDisplayName(file.name),
                        storagePath,
                        signedUrl: data?.signedUrl ?? undefined,
                    });
                }
                if (!cancelled) setAssets(assetList);
            }
            if (!cancelled) setLoading(false);
        }
        load();
        return () => { cancelled = true; };
    }, [companyId]);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setUploading(false); return; }

        const prefix = crypto.randomUUID().slice(0, 8);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `${user.id}/${companyId}/${prefix}-${safeName}`;

        const { error } = await supabase.storage
            .from(STORAGE.ASSETS)
            .upload(storagePath, file, { contentType: file.type });

        if (error) {
            alert(error.message);
            setUploading(false);
            return;
        }

        await loadAssetsRef.current?.();
        onSelect(`asset:${storagePath}`);
        setUploading(false);

        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleDelete(asset: AssetInfo) {
        const supabase = createClient();
        await supabase.storage.from(STORAGE.ASSETS).remove([asset.storagePath]);
        await loadAssetsRef.current?.();
        if (currentSource === `asset:${asset.storagePath}`) {
            onSelect("logo");
        }
    }


    return (
        <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-zinc-500">Source</label>

            {/* Built-in sources */}
            <div className="flex gap-1">
                <button
                    type="button"
                    onClick={() => onSelect("photo")}
                    className={`flex-1 rounded px-2 py-1 text-xs ${currentSource === "photo" ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
                >
                    Person Photo
                </button>
            </div>

            {/* Asset list */}
            {loading ? (
                <p className="text-xs text-zinc-400">Loading assets...</p>
            ) : assets.length > 0 ? (
                <div className="max-h-36 space-y-1 overflow-y-auto">
                    {assets.map((asset) => (
                        <div
                            key={asset.storagePath}
                            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs ${
                                currentSource === `asset:${asset.storagePath}`
                                    ? "border-sky-400 bg-sky-50"
                                    : "border-zinc-200 hover:bg-zinc-50"
                            }`}
                        >
                            {asset.signedUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={asset.signedUrl} alt="" className="h-6 w-6 rounded object-contain" />
                            )}
                            <button
                                type="button"
                                onClick={() => onSelect(`asset:${asset.storagePath}`)}
                                className="flex-1 truncate text-left"
                            >
                                {asset.displayName}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(asset)}
                                className="text-zinc-400 hover:text-red-500"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-zinc-400">No assets uploaded yet</p>
            )}

            {/* Upload */}
            <label className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-500 transition hover:border-zinc-400 hover:bg-zinc-50">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {uploading ? "Uploading..." : "Upload image"}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                />
            </label>
        </div>
    );
}
