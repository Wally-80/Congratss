"use client";

import React, { useState, useEffect } from "react";
import { X, User, Image as ImageIcon, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";
import { DEFAULT_AVATARS, getAvatarUrl } from "@/lib/avatars";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (displayName: string, photoURL: string) => Promise<void>;
    currentData: {
        displayName: string;
        photoURL: string;
    };
}

export default function EditProfileModal({ isOpen, onClose, onUpdate, currentData }: EditProfileModalProps) {
    const { language } = useAuth();
    const t = translations[language];

    const [displayName, setDisplayName] = useState(currentData.displayName);
    const [photoURL, setPhotoURL] = useState(currentData.photoURL);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setDisplayName(currentData.displayName);
            setPhotoURL(currentData.photoURL);
            setError("");
        }
    }, [isOpen, currentData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            await onUpdate(displayName, photoURL);
            onClose();
        } catch (err: any) {
            setError(err.message || (language === "es" ? "Error al actualizar el perfil" : "Failed to update profile"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="glass-pane w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide premium-border neon-border-cyan pt-[max(2rem,env(safe-area-inset-top))] sm:pt-8">
                <button
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 grid place-items-center text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors touch-manipulation cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-8 text-[var(--app-text)]">{t.edit_profile}</h2>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-[2rem] border-4 border-black/10 dark:border-white/10 overflow-hidden mb-4 shadow-2xl relative group bg-black/5 dark:bg-white/5 flex items-center justify-center">
                            <img
                                src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "U")}&background=random&color=fff&size=256`}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-widest ml-1">
                            {t.choose_avatar}
                        </label>
                        <div className="grid grid-cols-6 gap-2 p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl">
                            {DEFAULT_AVATARS.slice(0, 18).map((emoji) => {
                                const url = getAvatarUrl(emoji);
                                const isSelected = photoURL === url;
                                return (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setPhotoURL(url)}
                                        className={`text-2xl p-2 rounded-xl transition-all hover:bg-black/10 dark:hover:bg-white/10 ${isSelected ? "bg-cyan-400/20 border-2 border-cyan-400 scale-110" : "border-2 border-transparent"}`}
                                    >
                                        {emoji}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-widest ml-1">
                            {t.display_name}
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-[var(--app-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:border-cyan-400/50 transition-colors"
                                placeholder={t.your_name}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-widest ml-1">
                            {t.photo_url_label}
                        </label>
                        <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                            <input
                                type="url"
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                className="w-full bg-[var(--app-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:border-cyan-400/50 transition-colors text-xs"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 bg-cyan-400 text-black font-bold py-4 rounded-2xl shadow-neon transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t.saving}
                            </>
                        ) : t.save_changes}
                    </button>
                </form>
            </div>
        </div>
    );
}
