export const DESIGNER_FONTS = [
    { value: "Inter, sans-serif", label: "Inter", google: "Inter" },
    { value: "Roboto, sans-serif", label: "Roboto", google: "Roboto" },
    { value: "Open Sans, sans-serif", label: "Open Sans", google: "Open+Sans" },
    { value: "Lato, sans-serif", label: "Lato", google: "Lato" },
    { value: "Montserrat, sans-serif", label: "Montserrat", google: "Montserrat" },
    { value: "Poppins, sans-serif", label: "Poppins", google: "Poppins" },
    { value: "Raleway, sans-serif", label: "Raleway", google: "Raleway" },
    { value: "Nunito, sans-serif", label: "Nunito", google: "Nunito" },
    { value: "Playfair Display, serif", label: "Playfair Display", google: "Playfair+Display" },
    { value: "Merriweather, serif", label: "Merriweather", google: "Merriweather" },
    { value: "Lora, serif", label: "Lora", google: "Lora" },
    { value: "PT Serif, serif", label: "PT Serif", google: "PT+Serif" },
    { value: "Source Code Pro, monospace", label: "Source Code Pro", google: "Source+Code+Pro" },
    { value: "JetBrains Mono, monospace", label: "JetBrains Mono", google: "JetBrains+Mono" },
    { value: "DM Sans, sans-serif", label: "DM Sans", google: "DM+Sans" },
    { value: "Space Grotesk, sans-serif", label: "Space Grotesk", google: "Space+Grotesk" },
    { value: "Outfit, sans-serif", label: "Outfit", google: "Outfit" },
    { value: "Sora, sans-serif", label: "Sora", google: "Sora" },
] as const;

export function getGoogleFontsUrl(fonts: string[]): string {
    const unique = [...new Set(fonts)];
    const families = unique
        .map((f) => DESIGNER_FONTS.find((df) => df.value === f))
        .filter(Boolean)
        .map((f) => `family=${f!.google}:wght@300;400;500;600;700;800`);

    if (families.length === 0) return "";
    return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export function getUsedFonts(elements: { fontFamily?: string }[]): string[] {
    return [...new Set(elements.map((el) => el.fontFamily).filter(Boolean) as string[])];
}
