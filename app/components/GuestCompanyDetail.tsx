"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGuest } from "./GuestProvider";
import PersonModal from "./PersonModal";
import GenerateModal from "./GenerateModal";
import ConfirmModal from "./ConfirmModal";

export default function GuestCompanyDetail({ companyId }: { companyId: string }) {
    const { isGuest, data, deleteCompany } = useGuest();
    const router = useRouter();
    const [showPersonModal, setShowPersonModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editPerson, setEditPerson] = useState<typeof people[0] | undefined>(undefined);

    if (!isGuest) return null;

    const company = data.companies.find((c) => c.id === companyId);
    if (!company) return <p className="p-10 text-center text-zinc-500">Company not found</p>;

    const people = data.people
        .filter((p) => p.company_id === companyId)
        .map((p) => ({ ...p, photoSignedUrl: null, template_id: p.template_id }));

    const templates = data.templates.map((t) => ({ id: t.id, name: t.name }));

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                <Link href="/companies" className="hover:text-zinc-800">Companies</Link>
                <span>/</span>
                <span className="text-zinc-900">{company.name}</span>
            </div>

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-xl font-bold text-zinc-400">
                        {company.name[0]}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            {company.domain && <span>{company.domain}</span>}
                            {company.website && (
                                <>
                                    {company.domain && <span>·</span>}
                                    <span>{company.website.replace(/^https?:\/\//, "")}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                    Delete Company
                </button>
            </div>

            {/* People */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">People</h2>
                <div className="flex items-center gap-3">
                    {people.length > 0 && (
                        <button
                            onClick={() => setShowGenerateModal(true)}
                            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                        >
                            Generate Cards
                        </button>
                    )}
                    <button
                        onClick={() => { setEditPerson(undefined); setShowPersonModal(true); }}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                    >
                        + Add Person
                    </button>
                </div>
            </div>

            {people.length === 0 ? (
                <p className="text-zinc-500">No people added yet.</p>
            ) : (
                <div className="grid gap-3">
                    {people.map((person) => (
                        <button
                            key={person.id}
                            onClick={() => { setEditPerson(person); setShowPersonModal(true); }}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-500">
                                {person.first_name[0]}{person.last_name[0]}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-zinc-900">{person.first_name} {person.last_name}</p>
                                <p className="text-sm text-zinc-500">{person.title}</p>
                            </div>
                            <span className="text-sm text-zinc-400">Edit</span>
                        </button>
                    ))}
                </div>
            )}

            {showPersonModal && (
                <PersonModal
                    onClose={() => { setShowPersonModal(false); setEditPerson(undefined); }}
                    companyId={companyId}
                    templates={templates}
                    person={editPerson}
                />
            )}

            {showGenerateModal && (
                <GenerateModal
                    companyId={companyId}
                    people={people}
                    onClose={() => setShowGenerateModal(false)}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    title="Delete Company"
                    message={`Are you sure you want to delete "${company.name}" and all its people?`}
                    confirmLabel="Delete"
                    destructive
                    onConfirm={() => {
                        deleteCompany(companyId);
                        router.push("/companies");
                    }}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
}
