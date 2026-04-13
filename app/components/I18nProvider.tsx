"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, LANGUAGES } from "@/lib/i18n/translations";
import type { LangCode } from "@/lib/i18n/translations";

type TranslationStrings = typeof translations["en"];

interface I18nContextValue {
    lang: LangCode;
    t: TranslationStrings;
    setLang: (lang: LangCode) => void;
}

const I18nContext = createContext<I18nContextValue>({
    lang: "en",
    t: translations.en,
    setLang: () => {},
});

export function useTranslation() {
    return useContext(I18nContext);
}

function detectLang(): LangCode {
    if (typeof window === "undefined") return "en";

    // Check saved preference
    const saved = localStorage.getItem("cardgen_lang") as LangCode | null;
    if (saved && translations[saved]) return saved;

    // Check browser language
    const browserLang = navigator.language.split("-")[0] as LangCode;
    if (translations[browserLang]) return browserLang;

    return "en";
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<LangCode>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setLangState(detectLang());
        setMounted(true);
    }, []);

    function setLang(newLang: LangCode) {
        setLangState(newLang);
        localStorage.setItem("cardgen_lang", newLang);
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return <I18nContext.Provider value={{ lang: "en", t: translations.en, setLang }}>{children}</I18nContext.Provider>;
    }

    return (
        <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>
            {children}
        </I18nContext.Provider>
    );
}
