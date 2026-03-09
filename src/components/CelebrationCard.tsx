"use client";

import React from "react";
import { Activity, Baby, Gift, GraduationCap, Heart, House, PartyPopper, Pencil, Send, Sparkles, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";
import { type CelebrationReminderTiming, type CelebrationType } from "@/hooks/useCelebrations";
import { type CelebrationRecurrence } from "@/lib/dateUtils";

interface CelebrationCardProps {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    rawDate: string;
    percentage: number;
    type: CelebrationType;
    customTypeLabel?: string;
    recurrence?: CelebrationRecurrence;
    reminderTiming?: CelebrationReminderTiming;
    isPast?: boolean;
    scheduledDeliveryNote?: string;
    onDelete: (id: string) => Promise<void>;
    onEdit: (celebration: { id: string; title: string; rawDate: string; type: CelebrationType; customTypeLabel?: string; recurrence?: CelebrationRecurrence; reminderTiming?: CelebrationReminderTiming }) => void;
    onSendGreeting: (celebration: { id: string; title: string; type: CelebrationType; customTypeLabel?: string }) => void;
}

export default function CelebrationCard({
    id, title, daysLeft, rawDate, type, customTypeLabel, recurrence = "annual", reminderTiming, isPast, scheduledDeliveryNote,
    onDelete, onEdit, onSendGreeting
}: CelebrationCardProps) {
    const { language } = useAuth();
    const t = translations[language];

    const getIcon = () => {
        switch (type) {
            case "birthday": return <Gift className="w-5 h-5" />;
            case "anniversary": return <Heart className="w-5 h-5" />;
            case "retirement": return <PartyPopper className="w-5 h-5" />;
            case "graduation": return <GraduationCap className="w-5 h-5" />;
            case "baby_shower": return <Baby className="w-5 h-5" />;
            case "wedding": return <Heart className="w-5 h-5" />;
            case "get_well_soon": return <Activity className="w-5 h-5" />;
            case "house_warming": return <House className="w-5 h-5" />;
            case "custom": return <Sparkles className="w-5 h-5" />;
            default: return <Gift className="w-5 h-5" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case "birthday": return "from-neon-pink to-purple-500 shadow-neon-pink";
            case "anniversary": return "from-neon-cyan to-blue-500 shadow-neon-cyan";
            case "retirement": return "from-white to-gray-400 shadow-white/20";
            case "graduation": return "from-violet-500 to-indigo-500 shadow-violet-400/50";
            case "baby_shower": return "from-sky-400 to-cyan-400 shadow-sky-300/50";
            case "wedding": return "from-rose-500 to-pink-500 shadow-rose-400/50";
            case "get_well_soon": return "from-emerald-400 to-teal-500 shadow-emerald-300/50";
            case "house_warming": return "from-amber-400 to-orange-500 shadow-amber-300/50";
            case "custom": return "from-indigo-500 to-cyan-500 shadow-indigo-400/50";
            default: return "from-neon-cyan to-blue-500 shadow-neon-cyan";
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case "birthday": return t.birthday;
            case "anniversary": return t.anniversary;
            case "retirement": return t.retirement;
            case "graduation": return t.graduation;
            case "baby_shower": return t.baby_shower;
            case "wedding": return t.wedding;
            case "get_well_soon": return t.get_well_soon;
            case "house_warming": return t.house_warming;
            case "custom": return customTypeLabel || t.custom;
            default: return t.event_type;
        }
    };

    const borderAccentClass = (() => {
        switch (type) {
            case "birthday":
                return "neon-border-pink";
            case "anniversary":
                return "neon-border-cyan";
            case "retirement":
                return "border-slate-300/40 dark:border-slate-400/40 shadow-[0_0_14px_rgba(148,163,184,0.18)]";
            case "graduation":
                return "border-violet-400/45 shadow-[0_0_14px_rgba(167,139,250,0.2)]";
            case "baby_shower":
                return "border-sky-300/50 shadow-[0_0_14px_rgba(125,211,252,0.2)]";
            case "wedding":
                return "border-rose-400/45 shadow-[0_0_14px_rgba(251,113,133,0.2)]";
            case "get_well_soon":
                return "border-emerald-400/45 shadow-[0_0_14px_rgba(52,211,153,0.2)]";
            case "house_warming":
                return "border-amber-400/50 shadow-[0_0_14px_rgba(251,191,36,0.2)]";
            case "custom":
                return "border-fuchsia-500/45 shadow-[0_0_14px_rgba(217,70,239,0.2)]";
            default:
                return "neon-border-pink";
        }
    })();

    const isOneTime = recurrence === "one_time";
    const isToday = daysLeft === 0 && !isPast;
    const dateLabel = new Date(rawDate).toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
        month: "long",
        day: "numeric",
        ...(isOneTime ? { year: "numeric" as const } : {}),
        timeZone: "UTC"
    });
    const countdownValue = isPast ? t.past_badge : isToday ? t.today_badge : daysLeft;
    const countdownLabel = isPast ? t.event_passed : isToday ? t.celebrate_badge : t.days_to_go;

    return (
        <div className={`glass-card mb-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 premium-border ${borderAccentClass}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${getColors()} text-black flex items-center justify-center transform -rotate-12`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight mb-1 text-[var(--app-text)]">{title}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)] mb-1">{getTypeLabel()}</p>
                        <p className="text-xs text-[var(--app-text-dim)] font-medium">
                            {dateLabel}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit({ id, title, rawDate, type, customTypeLabel, recurrence, reminderTiming })}
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
                        {countdownValue}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--app-text-dim)] uppercase tracking-[0.2em] mt-1">
                        {countdownLabel}
                    </span>
                </div>
                <button
                    onClick={() => onSendGreeting({ id, title, type, customTypeLabel })}
                    data-tour="pick-send-button"
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isToday
                        ? "bg-neon-cyan text-black shadow-neon animate-pulse"
                        : "bg-black/5 dark:bg-white/10 text-[var(--app-text)] border border-black/10 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20"}`}
                >
                    <Send className={`w-3.5 h-3.5 ${isToday ? "animate-bounce" : ""}`} />
                    {t.pick_and_send}
                </button>
            </div>
            {scheduledDeliveryNote && (
                <p className="text-xs text-cyan-400">
                    {scheduledDeliveryNote}
                </p>
            )}
        </div>
    );
}
