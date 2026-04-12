// --- Element-based designer types ---

export type ElementType = "text" | "image" | "shape";

export type BoundField =
    | "first_name"
    | "last_name"
    | "full_name"
    | "title"
    | "email"
    | "phone"
    | "address"
    | "company"
    | "custom";

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
    imageSource?: "logo" | "photo";
    borderRadius?: number;
    objectFit?: "cover" | "contain";
    // Shape properties
    backgroundColor?: string;
    border?: string;
    shapeRadius?: number;
    // Shadow
    boxShadow?: string;
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

export interface SampleCardData {
    first_name: string;
    last_name: string;
    full_name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    logoUrl: string | null;
    photoUrl: string | null;
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
    logoUrl: null,
    photoUrl: null,
};

export const BOUND_FIELD_LABELS: Record<BoundField, string> = {
    first_name: "First Name",
    last_name: "Last Name",
    full_name: "Full Name",
    title: "Job Title",
    email: "Email",
    phone: "Phone",
    address: "Address",
    company: "Company",
    custom: "Custom Text",
};
