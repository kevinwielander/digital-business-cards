import { SkeletonStat, SkeletonCard, SkeletonTemplateCard, SkeletonLine } from "./components/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <div className="mb-10">
                <SkeletonLine className="h-8 w-40" />
                <SkeletonLine className="mt-2 h-4 w-64" />
            </div>

            <div className="mb-10 grid grid-cols-3 gap-4">
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
            </div>

            <div className="mb-10">
                <SkeletonLine className="mb-4 h-3 w-24" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>

            <div>
                <SkeletonLine className="mb-4 h-3 w-32" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
}
