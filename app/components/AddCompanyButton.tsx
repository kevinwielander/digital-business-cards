"use client";

import { useState } from "react";
import { useTranslation } from "./I18nProvider";
import { CompanyModal } from "./CompanyModal";

export default function AddCompanyButton() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
                {t.companies_add}
            </button>
            {isOpen && (
                <CompanyModal
                    onClose={() => {
                        setIsOpen(false);
                        window.location.reload();
                    }}
                    name=""
                    domain=""
                    website=""
                    logo={null}
                />
            )}
        </>
    );
}
