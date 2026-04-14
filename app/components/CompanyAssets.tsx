"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE } from "@/lib/supabase/constants";
import { useTranslation } from "./I18nProvider";
import ConfirmModal from "./ConfirmModal";
import DropZone from "./DropZone";

interface Asset {
    name: string;
    displayName: string;
    storagePath: string;
    signedUrl: string;
}

function parseDisplayName(filename: string): string {
    const dashIndex = filename.indexOf("-");
    if (dashIndex > 0 && dashIndex < 10) {
        return filename.slice(dashIndex + 1);
    }
    return filename;
}

interface CompanyAssetsProps {
    companyId: string;
}

export default function CompanyAssets({ companyId }: CompanyAssetsProps) {
    const { t } = useTranslation();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null);

    async function loadAssets() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const folder = `${user.id}/${companyId}`;
        const { data: files } = await supabase.storage
            .from(STORAGE.ASSETS)
            .list(folder, { sortBy: { column: "created_at", order: "desc" } });

        if (files) {
            const list: Asset[] = [];
            for (const file of files) {
                if (file.name === ".emptyFolderPlaceholder") continue;
                const storagePath = `${folder}/${file.name}`;
                const { data } = await supabase.storage
                    .from(STORAGE.ASSETS)
                    .createSignedUrl(storagePath, 3600);
                if (data?.signedUrl) {
                    list.push({
                        name: file.name,
                        displayName: parseDisplayName(file.name),
                        storagePath,
                        signedUrl: data.signedUrl,
                    });
                }
            }
            setAssets(list);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadAssets();
    }, [companyId]);

    async function handleUpload(files: File[]) {
        setUploading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setUploading(false); return; }

        for (const file of files) {
            const prefix = crypto.randomUUID().slice(0, 8);
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const storagePath = `${user.id}/${companyId}/${prefix}-${safeName}`;

            await supabase.storage
                .from(STORAGE.ASSETS)
                .upload(storagePath, file, { contentType: file.type });
        }

        await loadAssets();
        setUploading(false);
    }

    async function handleDelete() {
        if (!deleteAsset) return;
        const supabase = createClient();
        await supabase.storage.from(STORAGE.ASSETS).remove([deleteAsset.storagePath]);
        setDeleteAsset(null);
        await loadAssets();
    }

    return (
        <div className="mb-8">
            <div className="mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Assets</h2>
                <p className="mt-1 text-sm text-zinc-500">
                    Images you can use in your business card templates (logos, backgrounds, icons).
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 animate-pulse rounded-lg bg-zinc-200" />
                    ))}
                </div>
            ) : (
                <>
                    {assets.length > 0 && (
                        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {assets.map((asset) => (
                                <div
                                    key={asset.storagePath}
                                    className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white"
                                >
                                    <div className="flex h-24 items-center justify-center bg-zinc-50 p-2">
                                        <img
                                            src={asset.signedUrl}
                                            alt={asset.displayName}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between px-2 py-1.5">
                                        <span className="truncate text-xs text-zinc-600">{asset.displayName}</span>
                                        <button
                                            onClick={() => setDeleteAsset(asset)}
                                            className="hidden shrink-0 text-xs text-zinc-400 hover:text-red-500 group-hover:block"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <DropZone
                        onFiles={handleUpload}
                        multiple
                        disabled={uploading}
                    >
                        <div className="flex flex-col items-center gap-2 py-4">
                            <svg className="h-8 w-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-zinc-500">
                                {uploading ? "Uploading..." : "Drag & drop images here, or click to browse"}
                            </p>
                        </div>
                    </DropZone>
                </>
            )}

            {deleteAsset && (
                <ConfirmModal
                    title={t.modal_delete}
                    message={`Delete "${deleteAsset.displayName}"? Templates using this image will show a placeholder instead.`}
                    confirmLabel={t.modal_delete}
                    destructive
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteAsset(null)}
                />
            )}
        </div>
    );
}
