"use client";

import { useState } from "react";
import type { CustomFieldDefinition } from "@/lib/types";
import PersonModal from "./PersonModal";
import GenerateModal from "./GenerateModal";
import BulkImportModal from "./BulkImportModal";

interface Person {
    id: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone: string;
    photo_url: string | null;
    photoSignedUrl: string | null;
    template_id: string | null;
}

interface Template {
    id: string;
    name: string;
}

interface PeopleListProps {
    people: Person[];
    companyId: string;
    templates: Template[];
    isSample?: boolean;
    companyName?: string;
    companyLogoUrl?: string | null;
    customFieldDefs?: CustomFieldDefinition[];
}

export default function PeopleList({ people, companyId, templates, isSample, companyName, companyLogoUrl, customFieldDefs }: PeopleListProps) {
    const [showPersonModal, setShowPersonModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editPerson, setEditPerson] = useState<Person | undefined>(undefined);

    function handleAdd() {
        setEditPerson(undefined);
        setShowPersonModal(true);
    }

    function handleEdit(person: Person) {
        setEditPerson(person);
        setShowPersonModal(true);
    }

    function handleClosePersonModal() {
        setShowPersonModal(false);
        setEditPerson(undefined);
        window.location.reload();
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">People</h2>
                {!isSample && (
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
                            onClick={() => setShowImportModal(true)}
                            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                            Import CSV
                        </button>
                        <button
                            onClick={handleAdd}
                            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                        >
                            + Add Person
                        </button>
                    </div>
                )}
            </div>

            {people.length === 0 ? (
                <p className="text-zinc-500">No people added yet.</p>
            ) : (
                <div className="grid gap-3">
                    {people.map((person) => (
                        <button
                            key={person.id}
                            onClick={() => handleEdit(person)}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                        >
                            {person.photoSignedUrl ? (
                                <img
                                    src={person.photoSignedUrl}
                                    alt={`${person.first_name} ${person.last_name}`}
                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-500">
                                    {person.first_name[0]}{person.last_name[0]}
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-zinc-900">
                                    {person.first_name} {person.last_name}
                                </p>
                                <p className="text-sm text-zinc-500">{person.title}</p>
                            </div>
                            <span className="text-sm text-zinc-400">Edit</span>
                        </button>
                    ))}
                </div>
            )}

            {showPersonModal && (
                <PersonModal
                    onClose={handleClosePersonModal}
                    companyId={companyId}
                    templates={templates}
                    companyName={companyName}
                    companyLogoUrl={companyLogoUrl}
                    customFieldDefs={customFieldDefs}
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

            {showImportModal && (
                <BulkImportModal
                    onClose={() => setShowImportModal(false)}
                    companyId={companyId}
                    templates={templates}
                    customFieldDefs={customFieldDefs}
                />
            )}
        </div>
    );
}
