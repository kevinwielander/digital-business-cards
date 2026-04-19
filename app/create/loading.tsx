import { SkeletonLine } from "../components/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <SkeletonLine className="mb-2 h-8 w-52" />
            <SkeletonLine className="mb-8 h-4 w-80" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-[#1A1128]/8 bg-white/80 p-4">
                        <div className="mb-3 h-32 rounded-lg bg-[#C4B5FD]/10" />
                        <div className="h-4 w-24 rounded bg-[#C4B5FD]/20" />
                    </div>
                ))}
            </div>
        </div>
    );
}
