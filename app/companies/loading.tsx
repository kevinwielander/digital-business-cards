import { SkeletonCard, SkeletonLine } from "../components/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <SkeletonLine className="h-7 w-36" />
                    <SkeletonLine className="mt-2 h-4 w-56" />
                </div>
                <SkeletonLine className="h-10 w-32 rounded-lg" />
            </div>

            <div className="grid gap-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}
