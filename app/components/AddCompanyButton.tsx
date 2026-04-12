'use client';

import { useState } from "react";
import { CompanyModal } from "./CompanyModal";

export default function AddCompanyButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                + Add Company
                </button>
            {isOpen &&  <CompanyModal  onClose={() => setIsOpen(false)} name={""} address={""} domain={""} logo={null} />}
        </>
    );
}
