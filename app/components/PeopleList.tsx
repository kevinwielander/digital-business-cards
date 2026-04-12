"use client";

import { useState } from "react";
import PersonModal from "./PersonModal";

interface Person {
    id: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone: string;
    photo_url: string | null;
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
}

export default function PeopleList({ people, companyId, templates }: PeopleListProps) {
    const [showModal, setShowModal] = useState(false);
    const [editPerson, setEditPerson] = useState<Person | undefined>(undefined);

    function handleAdd() {
        setEditPerson(undefined);
        setShowModal(true);
    }

    function handleEdit(person: Person) {
        setEditPerson(person);
        setShowModal(true);
    }

    function handleClose() {
        setShowModal(false);
        setEditPerson(undefined);
        window.location.reload();
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">People</h2>
                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    + Add Person
                </button>
            </div>

            {people.length === 0 ? (
                <p className="text-zinc-500">No people added yet.</p>
            ) : (
                <div className="grid gap-3">
                    {people.map((person) => (
                        <button
                            key={person.id}
                            onClick={() => handleEdit(person)}
                            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                        >
                            <div>
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

            {showModal && (
                <PersonModal
                    onClose={handleClose}
                    companyId={companyId}
                    templates={templates}
                    person={editPerson}
                />
            )}
        </div>
    );
}
