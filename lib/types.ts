// --- Element-based designer types ---

export type ElementType = "text" | "image" | "shape" | "qrcode" | "save-contact";

export type BoundField =
    | "first_name"
    | "last_name"
    | "full_name"
    | "title"
    | "email"
    | "phone"
    | "address"
    | "company"
    | "website"
    | "custom"
    | `custom:${string}`;

export interface CardElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    opacity?: number;
    locked?: boolean;
    rotation?: number;
    // Text properties
    boundField?: BoundField;
    customText?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: "left" | "center" | "right";
    letterSpacing?: number;
    lineHeight?: number;
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    // Image properties
    imageSource?: "logo" | "photo" | `asset:${string}`;
    borderRadius?: number;
    objectFit?: "cover" | "contain";
    // Image advanced
    imageOpacity?: number;
    // Shape properties
    backgroundColor?: string;
    gradient?: string;
    border?: string;
    shapeRadius?: number;
    // Shadow
    boxShadow?: string;
    // Text shadow
    textShadow?: string;
}

export interface TemplateConfig {
    width: number;
    height: number;
    backgroundColor: string;
    elements: CardElement[];
}

export const CARD_WIDTH = 450;
export const CARD_HEIGHT = 260;

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#ffffff",
    elements: [],
};

export interface CustomFieldDefinition {
    key: string;
    label: string;
}

export interface SampleCardData {
    first_name: string;
    last_name: string;
    full_name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    website: string;
    logoUrl: string | null;
    photoUrl: string | null;
    custom_fields?: Record<string, string>;
}

export const SAMPLE_CARD_DATA: SampleCardData = {
    first_name: "Jane",
    last_name: "Smith",
    full_name: "Jane Smith",
    title: "Software Engineer",
    email: "jane@acme.com",
    phone: "+1 555 123 4567",
    address: "123 Main St, San Francisco",
    company: "Acme Inc.",
    website: "https://acme.com",
    logoUrl: null,
    photoUrl: null,
};

export const BUILT_IN_FIELD_LABELS: Record<string, string> = {
    first_name: "First Name",
    last_name: "Last Name",
    full_name: "Full Name",
    title: "Job Title",
    email: "Email",
    phone: "Phone",
    address: "Address",
    company: "Company",
    website: "Website",
    custom: "Custom Text",
};

export function getBoundFieldLabel(field: BoundField, customDefs?: CustomFieldDefinition[]): string {
    if (field.startsWith("custom:")) {
        const key = field.slice(7);
        const def = customDefs?.find((d) => d.key === key);
        return def?.label ?? key;
    }
    return BUILT_IN_FIELD_LABELS[field] ?? field;
}
