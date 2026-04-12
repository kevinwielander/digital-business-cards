import Image from "next/image";

interface CompanyCardProps {
    name: string;
    domain: string;
    logoUrl: string | null;
}

export default function CompanyCard({ name, domain, logoUrl }: CompanyCardProps) {
    return (
        console.log("Rendering CompanyCard with:", { name, domain, logoUrl }),
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            {logoUrl ? (
                <Image
                    src={logoUrl}
                    alt={`${name} logo`}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-lg object-contain"
                    unoptimized
                />
            ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-lg font-semibold text-zinc-500">
                    {name[0]}
                </div>
            )}
            <div>
                <h3 className="font-semibold text-zinc-900">{name}</h3>
                {domain && (
                    <p className="text-sm text-zinc-500">{domain}</p>
                )}
            </div>
        </div>
    );
}
