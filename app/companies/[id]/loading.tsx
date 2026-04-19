import { SkeletonLine, SkeletonPersonRow } from "../../components/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            {/* Breadcrumb */}
            <div className="mb-6">
                <SkeletonLine className="h-4 w-40" />
            </div>

            {/* Company header */}
            <div className="mb-8 flex items-center gap-5">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-[#C4B5FD]/20" />
                <div className="space-y-2">
                    <SkeletonLine className="h-7 w-44" />
                    <SkeletonLine className="h-4 w-28" />
                </div>
            </div>

            {/* People header */}
            <div className="mb-4 flex items-center justify-between">
                <SkeletonLine className="h-5 w-16" />
                <div className="flex gap-3">
                    <SkeletonLine className="h-10 w-28 rounded-lg" />
                    <SkeletonLine className="h-10 w-28 rounded-lg" />
                </div>
            </div>

            {/* People list */}
            <div className="grid gap-3">
                <SkeletonPersonRow />
                <SkeletonPersonRow />
                <SkeletonPersonRow />
                <SkeletonPersonRow />
            </div>
        </div>
    );
}
