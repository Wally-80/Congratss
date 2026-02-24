"use client";

import React from "react";
import { Gift, Heart, Trash2, Pencil, Send, PartyPopper } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

interface CelebrationCardProps {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    rawDate: string;
    percentage: number;
    type: "birthday" | "anniversary" | "retirement";
    onDelete: (id: string) => Promise<void>;
    onEdit: (celebration: any) => void;
    onSendGreeting: (celebration: any) => void;
}

export default function CelebrationCard({
    id, title, daysLeft, date, rawDate, percentage, type,
    onDelete, onEdit, onSendGreeting
}: CelebrationCardProps) {
    const { language } = useAuth();
    const t = translations[language];

    const getIcon = () => {
        switch (type) {
            case "birthday": return <Gift className="w-5 h-5" />;
            case "anniversary": return <Heart className="w-5 h-5" />;
            case "retirement": return <PartyPopper className="w-5 h-5" />;
            default: return <Gift className="w-5 h-5" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case "birthday": return "from-neon-pink to-purple-500 shadow-neon-pink";
            case "anniversary": return "from-neon-cyan to-blue-500 shadow-neon-cyan";
            case "retirement": return "from-white to-gray-400 shadow-white/20";
            default: return "from-neon-cyan to-blue-500 shadow-neon-cyan";
        }
    };

    const isToday = daysLeft === 0;

    return (
        <div className={`glass-card mb-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 premium-border ${type === "birthday" ? "neon-border-pink" : type === "anniversary" ? "neon-border-cyan" : ""}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${getColors()} text-black flex items-center justify-center transform -rotate-12`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight mb-1 text-[var(--app-text)]">{title}</h3>
                        <p className="text-xs text-[var(--app-text-dim)] font-medium">
                            {new Date(rawDate).toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: "long", day: "numeric", timeZone: "UTC" })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit({ id, title, rawDate, type })}
                        className="p-2.5 text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="p-2.5 text-[var(--app-text-dim)] hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-end justify-between mb-4">
                <div className="flex flex-col">
                    <span className="text-4xl font-black italic tracking-tighter">
                        {isToday ? "TODAY" : daysLeft}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--app-text-dim)] uppercase tracking-[0.2em] mt-1">
                        {isToday ? (language === "es" ? "¡ES HOY!" : "CELEBRATE!") : t.days_to_go}
                    </span>
                </div>
                <button
                    onClick={() => onSendGreeting({ title, type })}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isToday
                        ? "bg-neon-cyan text-black shadow-neon animate-pulse"
                        : "bg-black/5 dark:bg-white/10 text-[var(--app-text)] border border-black/10 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20"}`}
                >
                    <Send className={`w-3.5 h-3.5 ${isToday ? "animate-bounce" : ""}`} />
                    {t.pick_and_send}
                </button>
            </div>
        </div>
    );
}
