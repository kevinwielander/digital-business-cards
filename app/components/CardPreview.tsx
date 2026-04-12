import type { TemplateConfig, SampleCardData } from "@/lib/types";

interface CardPreviewProps {
    config: TemplateConfig;
    data: SampleCardData;
}

export default function CardPreview({ config, data }: CardPreviewProps) {
    const isHorizontal = config.layout === "horizontal";

    return (
        <div
            className="overflow-hidden rounded-xl shadow-lg"
            style={{
                backgroundColor: config.backgroundColor,
                color: config.textColor,
                fontFamily: config.fontFamily,
                width: isHorizontal ? 450 : 280,
            }}
        >
            {/* Company logo header */}
            {config.showLogo && (
                <div
                    className="flex items-center justify-center p-4"
                    style={{ backgroundColor: config.accentColor }}
                >
                    {data.logoUrl ? (
                        <img
                            src={data.logoUrl}
                            alt={data.company}
                            className="h-10 object-contain"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                    ) : (
                        <span className="text-lg font-bold text-white">{data.company}</span>
                    )}
                </div>
            )}

            {/* Accent divider */}
            {!config.showLogo && (
                <div className="h-2 w-full" style={{ backgroundColor: config.accentColor }} />
            )}

            {/* Content */}
            <div className={`flex gap-4 p-6 ${isHorizontal ? "flex-row items-center" : "flex-col items-center text-center"}`}>
                {/* Person photo */}
                {data.photoUrl ? (
                    <img
                        src={data.photoUrl}
                        alt={data.name}
                        className="h-16 w-16 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                        style={{ backgroundColor: config.accentColor, opacity: 0.8 }}
                    >
                        {data.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                )}

                {/* Info */}
                <div className={`flex flex-col gap-1 ${isHorizontal ? "" : "items-center"}`}>
                    <p className="text-lg font-semibold">{data.name}</p>
                    <p className="text-sm opacity-70">{data.title}</p>
                    <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: config.accentColor }}
                    >
                        {data.company}
                    </p>
                </div>
            </div>

            {/* Contact details */}
            <div className={`flex flex-col gap-1 px-6 pb-5 text-xs opacity-60 ${isHorizontal ? "" : "items-center text-center"}`}>
                {config.showEmail && data.email && <p>{data.email}</p>}
                {config.showPhone && data.phone && <p>{data.phone}</p>}
                {config.showAddress && data.address && <p>{data.address}</p>}
            </div>
        </div>
    );
}
