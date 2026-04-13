"use client";

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    destructive?: boolean;
}

export default function ConfirmModal({
    title,
    message,
    confirmLabel = "Confirm",
    onConfirm,
    onCancel,
    destructive = false,
}: ConfirmModalProps) {
    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
                <p className="mt-2 text-sm text-zinc-500">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                            destructive
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-zinc-900 hover:bg-zinc-700"
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
