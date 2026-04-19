export function SkeletonLine({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded bg-[#C4B5FD]/20 ${className ?? "h-4 w-full"}`} />;
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-xl border border-[#1A1128]/8 bg-white/80 p-5 ${className ?? ""}`}>
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-[#C4B5FD]/20" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-[#C4B5FD]/20" />
                    <div className="h-3 w-1/4 rounded bg-[#C4B5FD]/15" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonStat() {
    return (
        <div className="animate-pulse rounded-xl border border-[#1A1128]/8 bg-white/80 p-5">
            <div className="h-3 w-16 rounded bg-[#C4B5FD]/20" />
            <div className="mt-2 h-7 w-10 rounded bg-[#C4B5FD]/25" />
        </div>
    );
}

export function SkeletonPersonRow() {
    return (
        <div className="animate-pulse rounded-xl border border-[#1A1128]/8 bg-white/80 p-4">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#C4B5FD]/20" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-[#C4B5FD]/20" />
                    <div className="h-3 w-1/5 rounded bg-[#C4B5FD]/15" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonTemplateCard() {
    return (
        <div className="animate-pulse rounded-xl border border-[#1A1128]/8 bg-white/80 p-5">
            <div className="space-y-2">
                <div className="h-4 w-2/5 rounded bg-[#C4B5FD]/20" />
                <div className="h-3 w-1/4 rounded bg-[#C4B5FD]/15" />
            </div>
        </div>
    );
}
