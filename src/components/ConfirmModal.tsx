"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
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
    const [isConfirming, setIsConfirming] = React.useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (isConfirming) return;
        setIsConfirming(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Confirm action failed:", error);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className={`glass-pane w-full max-w-sm p-8 relative animate-in fade-in zoom-in duration-300 shadow-2xl premium-border ${isDangerous ? "neon-border-red" : "neon-border-cyan"} pt-[max(2rem,env(safe-area-inset-top))] sm:pt-8`}>
                <button
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 grid place-items-center text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-opacity touch-manipulation cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full mb-6 ${isDangerous ? "bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-cyan-400/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"}`}>
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-slate-950 dark:text-white">
                        {title || t.are_you_sure}
                    </h3>

                    <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed mb-8">
                        {message || t.permanent_action}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isConfirming}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${isDangerous
                                ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:brightness-110"
                                : "bg-cyan-400 text-black shadow-neon hover:brightness-110"
                                } ${isConfirming ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isConfirming ? t.processing : (confirmText || t.yes_delete)}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black/100 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                        >
                            {cancelText || t.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
