"use client";

import { useState } from "react";
import { useTranslation } from "./I18nProvider";
import { CompanyModal } from "./CompanyModal";

interface EditCompanyButtonProps {
    id: string;
    name: string;
    domain: string;
    website: string;
    logoUrl: string | null;
}

export default function EditCompanyButton({ id, name, domain, website, logoUrl }: EditCompanyButtonProps) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
                {t.companies_edit}
            </button>
            {showModal && (
                <CompanyModal
                    onClose={() => {
                        setShowModal(false);
                        window.location.reload();
                    }}
                    id={id}
                    name={name}
                    domain={domain}
                    website={website}
                    logo={null}
                    currentLogoUrl={logoUrl}
                />
            )}
        </>
    );
}
