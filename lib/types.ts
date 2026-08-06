// --- Element-based designer types ---

export type ElementType = "text" | "image" | "shape" | "qrcode" | "save-contact";

export type BoundField =
    | "first_name"
    | "last_name"
    | "academic_prefix"
    | "academic_suffix"
    | "full_name"
    | "full_name_with_titles"
    | "name_with_suffix"
    | "title"
    | "email"
    | "phone"
    | "address"
    | "company"
    | "website"
    | "custom"
    | `custom:${string}`;

export type LinkBoundField = "email" | "phone" | "website";

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
    linkUrl?: string;
    linkBoundField?: LinkBoundField;
    // Icon properties (SVG template stored separately for recoloring)
    iconSvg?: string;
    iconColor?: string;
    // User-defined label for the layers panel
    label?: string;
    // Hide this element when its bound field resolves to an empty string
    hideIfEmpty?: boolean;
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
    pageBackgroundColor?: string;
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
    academic_prefix: string;
    academic_suffix: string;
    full_name: string;
    full_name_with_titles: string;
    name_with_suffix: string;
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
    academic_prefix: "Dr.",
    academic_suffix: "MSc.",
    full_name: "Jane Smith",
    full_name_with_titles: "Dr. Jane Smith, MSc.",
    name_with_suffix: "Jane Smith, MSc.",
    title: "Software Engineer",
    email: "jane@acme.com",
    phone: "+1 555 123 4567",
    address: "123 Main St, San Francisco",
    company: "Acme Inc.",
    website: "https://acme.com",
    logoUrl: null,
    photoUrl: null,
    custom_fields: {},
};

export const BUILT_IN_FIELD_LABELS: Record<string, string> = {
    first_name: "First Name",
    last_name: "Last Name",
    academic_prefix: "Academic Prefix (Dr., Mag., …)",
    academic_suffix: "Academic Suffix (BSc., MSc., …)",
    full_name: "Full Name",
    full_name_with_titles: "Full Name with Titles",
    name_with_suffix: "Name + Suffix (no prefix)",
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
