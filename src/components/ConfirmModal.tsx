"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    isDangerous = true
}: ConfirmModalProps) {
    const { language } = useAuth();
    const t = translations[language];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="glass-pane w-full max-w-sm p-8 relative animate-in fade-in zoom-in duration-300 shadow-2xl premium-border">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-[var(--app-text)] opacity-40 hover:opacity-100 transition-opacity"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full mb-6 ${isDangerous ? "bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-cyan-400/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"}`}>
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">
                        {title || (language === "es" ? "¿Estás seguro?" : "Are you sure?")}
                    </h3>

                    <p className="text-sm opacity-50 leading-relaxed mb-8">
                        {message || (language === "es" ? "Esta acción es permanente y no se puede deshacer." : "This action is permanent and cannot be undone.")}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${isDangerous
                                ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:brightness-110"
                                : "bg-cyan-400 text-black shadow-neon hover:brightness-110"
                                }`}
                        >
                            {confirmText || (language === "es" ? "SÍ, ELIMINAR" : "YES, DELETE")}
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-white/5 dark:hover:bg-white/5 transition-all"
                        >
                            {cancelText || (language === "es" ? "CANCELAR" : "CANCEL")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
