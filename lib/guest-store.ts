export interface GuestCompany {
    id: string;
    name: string;
    domain: string;
    website: string;
    logo_url: string | null;
    created_at: string;
}

export interface GuestPerson {
    id: string;
    company_id: string;
    template_id: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone: string;
    photo_url: string | null;
    created_at: string;
}

export interface GuestTemplate {
    id: string;
    name: string;
    config: Record<string, unknown>;
    created_at: string;
}

export interface GuestData {
    companies: GuestCompany[];
    people: GuestPerson[];
    templates: GuestTemplate[];
}

const STORAGE_KEY = "cardgen_guest_data";

export function getGuestData(): GuestData {
    if (typeof window === "undefined") return { companies: [], people: [], templates: [] };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { companies: [], people: [], templates: [] };
    try {
        return JSON.parse(raw);
    } catch {
        return { companies: [], people: [], templates: [] };
    }
}

export function setGuestData(data: GuestData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearGuestData() {
    localStorage.removeItem(STORAGE_KEY);
}

export function hasGuestData(): boolean {
    const data = getGuestData();
    return data.companies.length > 0 || data.templates.length > 0;
}

export function isGuestMode(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("cardgen_guest_mode") === "true";
}

export function setGuestMode(enabled: boolean) {
    if (enabled) {
        localStorage.setItem("cardgen_guest_mode", "true");
    } else {
        localStorage.removeItem("cardgen_guest_mode");
    }
}
