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
                minHeight: isHorizontal ? 250 : 400,
            }}
        >
            {/* Accent bar */}
            <div
                className={isHorizontal ? "h-2 w-full" : "h-2 w-full"}
                style={{ backgroundColor: config.accentColor }}
            />

            <div
                className={`flex gap-5 p-6 ${isHorizontal ? "flex-row items-center" : "flex-col items-center text-center"}`}
            >
                {/* Logo */}
                {config.showLogo && (
                    <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                        style={{ backgroundColor: config.accentColor }}
                    >
                        {data.logoUrl ? (
                            <img
                                src={data.logoUrl}
                                alt="Logo"
                                className="h-full w-full rounded-full object-contain p-2"
                            />
                        ) : (
                            data.company[0]
                        )}
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

                    <div className="mt-3 flex flex-col gap-1 text-xs opacity-60">
                        {config.showEmail && <p>{data.email}</p>}
                        {config.showPhone && <p>{data.phone}</p>}
                        {config.showAddress && <p>{data.address}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
