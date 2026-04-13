import { SkeletonLine, SkeletonTemplateCard } from "../components/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-4xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <SkeletonLine className="h-7 w-32" />
                    <SkeletonLine className="mt-2 h-4 w-64" />
                </div>
                <SkeletonLine className="h-10 w-36 rounded-lg" />
            </div>

            <SkeletonLine className="mb-4 h-3 w-28" />
            <div className="grid gap-3 sm:grid-cols-2">
                <SkeletonTemplateCard />
                <SkeletonTemplateCard />
                <SkeletonTemplateCard />
                <SkeletonTemplateCard />
            </div>
        </div>
    );
}
