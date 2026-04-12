export interface TemplateConfig {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    layout: "horizontal" | "vertical";
    showLogo: boolean;
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
    backgroundColor: "#ffffff",
    textColor: "#1a1a1a",
    accentColor: "#3b82f6",
    fontFamily: "sans-serif",
    layout: "horizontal",
    showLogo: true,
    showPhone: true,
    showEmail: true,
    showAddress: true,
};

export interface SampleCardData {
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    logoUrl: string | null;
    photoUrl: string | null;
}

export const SAMPLE_CARD_DATA: SampleCardData = {
    name: "Jane Smith",
    title: "Software Engineer",
    email: "jane@acme.com",
    phone: "+1 555 123 4567",
    address: "123 Main St, San Francisco",
    company: "Acme Inc.",
    logoUrl: null,
    photoUrl: null,
};
