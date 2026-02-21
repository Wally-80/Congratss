"use client";

import React, { useState, useEffect } from "react";
import { X, User, Image, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

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
            setError(err.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="glass-pane w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-8 text-white/90">{t.edit_profile}</h2>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 overflow-hidden mb-4 shadow-2xl relative group">
                            <img
                                src={photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">
                            {language === "es" ? "Nombre a mostrar" : "Display Name"}
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
                                placeholder={language === "es" ? "Tu Nombre" : "Your Name"}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">
                            {language === "es" ? "URL de Foto de Perfil" : "Profile Photo URL"}
                        </label>
                        <div className="relative">
                            <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="url"
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
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
                                {language === "es" ? "Guardando..." : "Saving..."}
                            </>
                        ) : (language === "es" ? "Guardar Cambios" : "Save Changes")}
                    </button>
                </form>
            </div>
        </div>
    );
}
