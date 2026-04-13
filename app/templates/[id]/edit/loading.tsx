import { SkeletonLine } from "@/app/components/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <SkeletonLine className="mb-8 h-7 w-44" />

            {/* Top bar */}
            <div className="mb-6 flex items-center gap-4">
                <SkeletonLine className="h-10 w-40 rounded-lg" />
                <SkeletonLine className="h-10 w-36 rounded-lg" />
                <SkeletonLine className="h-10 w-36 rounded-lg" />
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex gap-2">
                <SkeletonLine className="h-10 w-20 rounded-lg" />
                <SkeletonLine className="h-10 w-20 rounded-lg" />
                <SkeletonLine className="h-10 w-20 rounded-lg" />
                <SkeletonLine className="h-10 w-20 rounded-lg" />
            </div>

            {/* Canvas + properties */}
            <div className="flex gap-6">
                <div className="flex-1">
                    <div className="animate-pulse rounded-xl bg-zinc-100 p-8">
                        <div className="h-[260px] w-[450px] rounded-lg bg-zinc-200" />
                    </div>
                </div>
                <div className="w-64 space-y-4">
                    <SkeletonLine className="h-4 w-24" />
                    <SkeletonLine className="h-8 w-full rounded" />
                    <SkeletonLine className="h-8 w-full rounded" />
                    <SkeletonLine className="h-8 w-full rounded" />
                </div>
            </div>
        </div>
    );
}
