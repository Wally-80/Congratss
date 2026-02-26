"use client";

import React, { useState } from "react";
import { X, Activity, Baby, Gift, GraduationCap, Heart, House, PartyPopper, Sparkles } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { translations } from "@/lib/translations";
import { type CelebrationType } from "@/hooks/useCelebrations";

type AddCelebrationData = {
    id?: string;
    title: string;
    rawDate: string;
    type: CelebrationType;
    customTypeLabel?: string;
};

type InitialCelebrationData = {
    id: string;
    title: string;
    rawDate: string;
    type: CelebrationType;
    customTypeLabel?: string;
};

interface AddCelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: AddCelebrationData) => Promise<void>;
    initialData?: InitialCelebrationData | null;
    defaultDate?: string;
}

export default function AddCelebrationModal({ isOpen, onClose, onAdd, initialData, defaultDate = "" }: AddCelebrationModalProps) {
    const { language } = useAuth();
    const { theme } = useTheme();
    const t = translations[language];
    const isDarkMode = theme === "dark";

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<CelebrationType>("birthday");
    const [customTypeLabel, setCustomTypeLabel] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const baseFieldClass = isDarkMode
        ? "bg-white/10 border-white/20 text-white placeholder:text-white/55"
        : "bg-white border-black/10 text-slate-950 placeholder:text-slate-500";
    const baseOptionClass = isDarkMode
        ? "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
        : "bg-black/5 border-black/10 text-black/40 hover:bg-black/10";
    const textMutedClass = "text-[var(--app-text-dim)]";

    const typeOptions: { value: CelebrationType; label: string; icon: React.ReactNode; activeClass: string }[] = [
        { value: "birthday", label: t.birthday, icon: <Gift className="w-6 h-6" />, activeClass: "bg-neon-pink/20 border-neon-pink text-neon-pink" },
        { value: "anniversary", label: t.anniversary, icon: <Heart className="w-6 h-6" />, activeClass: "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" },
        {
            value: "retirement",
            label: t.retirement,
            icon: <PartyPopper className="w-6 h-6" />,
            activeClass: isDarkMode
                ? "bg-white/15 border-white/50 text-white"
                : "bg-black/10 border-black/40 text-slate-900"
        },
        { value: "graduation", label: t.graduation, icon: <GraduationCap className="w-6 h-6" />, activeClass: "bg-violet-500/20 border-violet-400 text-violet-300" },
        { value: "baby_shower", label: t.baby_shower, icon: <Baby className="w-6 h-6" />, activeClass: "bg-sky-400/20 border-sky-300 text-sky-300" },
        { value: "wedding", label: t.wedding, icon: <Heart className="w-6 h-6" />, activeClass: "bg-rose-500/20 border-rose-400 text-rose-300" },
        { value: "get_well_soon", label: t.get_well_soon, icon: <Activity className="w-6 h-6" />, activeClass: "bg-emerald-500/20 border-emerald-400 text-emerald-300" },
        { value: "house_warming", label: t.house_warming, icon: <House className="w-6 h-6" />, activeClass: "bg-amber-500/20 border-amber-400 text-amber-300" },
        { value: "custom", label: t.custom, icon: <Sparkles className="w-6 h-6" />, activeClass: "bg-indigo-500/20 border-indigo-400 text-indigo-300" },
    ];

    // Populate fields when editing
    React.useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDate(initialData.rawDate);
            setType(initialData.type);
            setCustomTypeLabel(initialData.customTypeLabel || "");
        } else {
            setTitle("");
            setDate(defaultDate);
            setType("birthday");
            setCustomTypeLabel("");
        }
    }, [initialData, isOpen, defaultDate]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedTitle = title.trim();
        if (!normalizedTitle || !date) return;

        const normalizedCustomTypeLabel = type === "custom" ? customTypeLabel.trim() : "";
        if (type === "custom" && !normalizedCustomTypeLabel) return;

        setIsSubmitting(true);

        await onAdd({
            id: initialData?.id, // Pass ID back if updating
            title: normalizedTitle,
            rawDate: date,
            type: type,
            customTypeLabel: normalizedCustomTypeLabel,
        });

        setIsSubmitting(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/55 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`glass-pane w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-md relative animate-in fade-in zoom-in duration-300 premium-border ${type === "birthday" ? "neon-border-pink" : type === "anniversary" ? "neon-border-cyan" : ""} ${isDarkMode ? "bg-[#151820] sm:bg-[var(--pane-bg)]" : "bg-[var(--pane-bg)]"} pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] px-4 sm:px-8 sm:py-8 flex flex-col overflow-hidden`}
            >
                {isDarkMode && (
                    <>
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,_#2a3b55_0%,_#1a2230_50%,_#131a25_100%)]" />
                        <div className="absolute inset-0 pointer-events-none opacity-45 bg-[radial-gradient(circle_at_85%_10%,_#385c83_0%,_transparent_42%)]" />
                    </>
                )}
                <button
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 sm:top-6 sm:right-6 z-30 w-11 h-11 grid place-items-center text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-white/10 rounded-full transition-colors touch-manipulation cursor-pointer"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative z-10 flex-1 min-h-0 flex flex-col">
                    <h2 className="text-2xl font-bold mb-5 sm:mb-8 text-[var(--app-text)]">
                        {initialData ? t.edit_celebration : t.add_celebration}
                    </h2>

                    <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
                        <div className="space-y-6 flex-1 min-h-0 overflow-y-auto pr-1 pb-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 uppercase tracking-widest ${textMutedClass}`}>
                                    {t.title}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t.title_placeholder}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full h-12 border rounded-2xl px-5 text-sm focus:outline-none focus:border-neon-cyan transition-colors shadow-sm ${baseFieldClass}`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 uppercase tracking-widest ${textMutedClass}`}>
                                    {t.date}
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={`w-full h-12 appearance-none border rounded-2xl px-5 text-sm focus:outline-none focus:border-neon-cyan transition-colors shadow-sm ${baseFieldClass}`}
                                    style={{ colorScheme: document.documentElement.classList.contains('light-mode') ? 'light' : 'dark' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-4 uppercase tracking-widest ${textMutedClass}`}>
                                    {t.event_type}
                                </label>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {typeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setType(option.value)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${type === option.value
                                                ? option.activeClass
                                                : baseOptionClass}`}
                                        >
                                            {option.icon}
                                            <span className="text-[10px] font-bold uppercase tracking-tighter text-center leading-tight">
                                                {option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {type === "custom" && (
                                <div>
                                    <label className={`block text-sm font-medium mb-2 uppercase tracking-widest ${textMutedClass}`}>
                                        {t.custom_event_label}
                                    </label>
                                    <input
                                        type="text"
                                        value={customTypeLabel}
                                        onChange={(e) => setCustomTypeLabel(e.target.value)}
                                        placeholder={t.custom_event_placeholder}
                                        className={`w-full h-12 border rounded-2xl px-5 text-sm focus:outline-none focus:border-neon-cyan transition-colors shadow-sm ${baseFieldClass}`}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 mt-2 border-t border-black/10 dark:border-white/10 bg-gradient-to-t from-[var(--pane-bg)] to-transparent">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100 ${isDarkMode
                                    ? "bg-cyan-400 text-black shadow-neon-sm"
                                    : "bg-slate-900 text-white shadow-neon-sm"}`}
                            >
                                {isSubmitting ? t.processing : (initialData ? t.update : t.save)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
