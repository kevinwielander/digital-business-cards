"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}

interface ToastContextValue {
    toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
    return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: Toast["type"] = "success") => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    function dismiss(id: string) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all animate-in slide-in-from-bottom-2 ${
                            t.type === "success"
                                ? "bg-zinc-900 text-white"
                                : t.type === "error"
                                  ? "bg-red-600 text-white"
                                  : "bg-white text-zinc-900 border border-zinc-200"
                        }`}
                        style={{
                            animation: "toast-in 0.2s ease-out",
                        }}
                    >
                        {t.type === "success" && (
                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {t.type === "error" && (
                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span>{t.message}</span>
                        <button onClick={() => dismiss(t.id)} className="ml-2 opacity-60 hover:opacity-100">
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes toast-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
}
