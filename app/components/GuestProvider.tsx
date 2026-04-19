"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { GuestData, GuestCompany, GuestPerson, GuestTemplate } from "@/lib/guest-store";
import { getGuestData, setGuestData, isGuestMode, setGuestMode, clearGuestData } from "@/lib/guest-store";
import type { TemplateConfig } from "@/lib/types";

interface GuestContextValue {
    isGuest: boolean;
    data: GuestData;
    enterGuestMode: () => void;
    exitGuestMode: () => void;
    addCompany: (company: Omit<GuestCompany, "id" | "created_at">) => string;
    updateCompany: (id: string, updates: Partial<GuestCompany>) => void;
    deleteCompany: (id: string) => void;
    addPerson: (person: Omit<GuestPerson, "id" | "created_at">) => string;
    updatePerson: (id: string, updates: Partial<GuestPerson>) => void;
    deletePerson: (id: string) => void;
    addTemplate: (name: string, config: TemplateConfig) => string;
    updateTemplate: (id: string, updates: Partial<GuestTemplate>) => void;
    deleteTemplate: (id: string) => void;
}

const GuestContext = createContext<GuestContextValue | null>(null);

export function useGuest() {
    const ctx = useContext(GuestContext);
    if (!ctx) throw new Error("useGuest must be used within GuestProvider");
    return ctx;
}

export default function GuestProvider({ children }: { children: React.ReactNode }) {
    const [isGuest, setIsGuest] = useState(() => {
        if (typeof window === "undefined") return false;
        return isGuestMode();
    });
    const [data, setData] = useState<GuestData>(() => {
        if (typeof window === "undefined") return { companies: [], people: [], templates: [] };
        return isGuestMode() ? getGuestData() : { companies: [], people: [], templates: [] };
    });

    const persist = useCallback((newData: GuestData) => {
        setData(newData);
        setGuestData(newData);
    }, []);

    function enterGuestMode() {
        setGuestMode(true);
        document.cookie = "cardgen_guest=true;path=/;max-age=31536000";
        setIsGuest(true);
        setData(getGuestData());
    }

    function exitGuestMode() {
        setGuestMode(false);
        document.cookie = "cardgen_guest=;path=/;max-age=0";
        clearGuestData();
        setIsGuest(false);
        setData({ companies: [], people: [], templates: [] });
    }

    function addCompany(company: Omit<GuestCompany, "id" | "created_at">) {
        const id = crypto.randomUUID();
        const newCompany: GuestCompany = { ...company, id, created_at: new Date().toISOString() };
        const newData = { ...data, companies: [...data.companies, newCompany] };
        persist(newData);
        return id;
    }

    function updateCompany(id: string, updates: Partial<GuestCompany>) {
        const newData = {
            ...data,
            companies: data.companies.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        };
        persist(newData);
    }

    function deleteCompany(id: string) {
        const newData = {
            ...data,
            companies: data.companies.filter((c) => c.id !== id),
            people: data.people.filter((p) => p.company_id !== id),
        };
        persist(newData);
    }

    function addPerson(person: Omit<GuestPerson, "id" | "created_at">) {
        const id = crypto.randomUUID();
        const newPerson: GuestPerson = { ...person, id, created_at: new Date().toISOString() };
        const newData = { ...data, people: [...data.people, newPerson] };
        persist(newData);
        return id;
    }

    function updatePerson(id: string, updates: Partial<GuestPerson>) {
        const newData = {
            ...data,
            people: data.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        };
        persist(newData);
    }

    function deletePerson(id: string) {
        const newData = {
            ...data,
            people: data.people.filter((p) => p.id !== id),
        };
        persist(newData);
    }

    function addTemplate(name: string, config: TemplateConfig) {
        const id = crypto.randomUUID();
        const newTemplate: GuestTemplate = { id, name, config, created_at: new Date().toISOString() };
        const newData = { ...data, templates: [...data.templates, newTemplate] };
        persist(newData);
        return id;
    }

    function updateTemplate(id: string, updates: Partial<GuestTemplate>) {
        const newData = {
            ...data,
            templates: data.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        };
        persist(newData);
    }

    function deleteTemplate(id: string) {
        const newData = {
            ...data,
            templates: data.templates.filter((t) => t.id !== id),
        };
        persist(newData);
    }

    return (
        <GuestContext.Provider
            value={{
                isGuest,
                data,
                enterGuestMode,
                exitGuestMode,
                addCompany,
                updateCompany,
                deleteCompany,
                addPerson,
                updatePerson,
                deletePerson,
                addTemplate,
                updateTemplate,
                deleteTemplate,
            }}
        >
            {children}
        </GuestContext.Provider>
    );
}
