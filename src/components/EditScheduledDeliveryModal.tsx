"use client";

import React from "react";
import { CalendarClock, Mail, MessageCircle, Phone, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { type ScheduledChannel, type ScheduledMessage } from "@/hooks/useScheduledMessages";

interface EditScheduledDeliveryModalProps {
    isOpen: boolean;
    scheduledMessage: ScheduledMessage | null;
    onClose: () => void;
    onSave: (input: {
        id: string;
        channel: ScheduledChannel;
        recipient: string;
        scheduledAt: Date;
        shareUrl: string;
    }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const toTimeInputValue = (date: Date) => {
    const hour = `${date.getHours()}`.padStart(2, "0");
    const minute = `${date.getMinutes()}`.padStart(2, "0");
    return `${hour}:${minute}`;
};

const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");

const buildShareUrl = (channel: ScheduledChannel, message: string, recipient: string) => {
    const encodedMessage = encodeURIComponent(message);
    const target = recipient.trim();
    if (channel === "whatsapp") {
        const cleanPhone = normalizePhone(target).replace(/^\+/, "");
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }
    if (channel === "email") {
        return `mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent("Congratss Greeting")}&body=${encodedMessage}`;
    }
    return `sms:${encodeURIComponent(normalizePhone(target))}?&body=${encodedMessage}`;
};

export default function EditScheduledDeliveryModal({
    isOpen,
    scheduledMessage,
    onClose,
    onSave,
    onDelete,
}: EditScheduledDeliveryModalProps) {
    const { language } = useAuth();
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const copy = language === "es"
        ? {
            title: "Editar envio programado",
            date: "Fecha",
            time: "Hora",
            destination: "Destino",
            channel: "Canal",
            helper: "Actualiza el horario o el destino de este envio.",
            save: "Guardar cambios",
            saving: "Guardando...",
            delete: "Eliminar envio",
            deleting: "Eliminando...",
            cancel: "Cancelar",
            error_past: "El horario debe ser en el futuro.",
            error_destination: "Completa un destino valido para ese canal.",
        }
        : {
            title: "Edit scheduled delivery",
            date: "Date",
            time: "Time",
            destination: "Destination",
            channel: "Channel",
            helper: "Update the time or destination for this scheduled delivery.",
            save: "Save changes",
            saving: "Saving...",
            delete: "Delete delivery",
            deleting: "Deleting...",
            cancel: "Cancel",
            error_past: "Schedule time must be in the future.",
            error_destination: "Please enter a valid destination for that channel.",
        };

    const [scheduleDate, setScheduleDate] = React.useState("");
    const [scheduleTime, setScheduleTime] = React.useState("");
    const [channel, setChannel] = React.useState<ScheduledChannel>("whatsapp");
    const [recipient, setRecipient] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        if (!scheduledMessage) return;
        setScheduleDate(toDateInputValue(scheduledMessage.scheduledAt));
        setScheduleTime(toTimeInputValue(scheduledMessage.scheduledAt));
        setChannel(scheduledMessage.channel);
        setRecipient(scheduledMessage.recipient);
        setError(null);
    }, [scheduledMessage]);

    if (!isOpen || !scheduledMessage) return null;

    const validateRecipient = () => {
        if (channel === "email" && !recipient.includes("@")) return false;
        if ((channel === "sms" || channel === "whatsapp") && normalizePhone(recipient).replace(/^\+/, "").length < 7) return false;
        return true;
    };

    const handleSave = async () => {
        const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
        if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
            setError(copy.error_past);
            return;
        }
        if (!validateRecipient()) {
            setError(copy.error_destination);
            return;
        }

        setError(null);
        setIsSaving(true);
        try {
            await onSave({
                id: scheduledMessage.id,
                channel,
                recipient: recipient.trim(),
                scheduledAt,
                shareUrl: buildShareUrl(channel, scheduledMessage.message, recipient.trim()),
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(scheduledMessage.id);
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 w-full max-w-md rounded-[2rem] border p-6 shadow-2xl ${isDarkMode ? "bg-[#151820] border-white/10" : "bg-white border-slate-200"}`}>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-[var(--app-text-dim)] hover:bg-black/5 dark:hover:bg-white/10"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-5">
                    <div className="mb-3 flex items-center gap-2 text-cyan-400">
                        <CalendarClock className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{copy.title}</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--app-text)]">{scheduledMessage.celebrationTitle}</p>
                    <p className="mt-1 text-xs text-[var(--app-text-dim)]">{copy.helper}</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-xs text-red-300">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{copy.date}</label>
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDarkMode ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-950"}`}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{copy.time}</label>
                            <input
                                type="time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDarkMode ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-950"}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{copy.channel}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["whatsapp", "email", "sms"] as ScheduledChannel[]).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setChannel(option)}
                                    className={`rounded-2xl border py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${channel === option
                                        ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                                        : isDarkMode
                                            ? "border-white/10 bg-white/5 text-white/70"
                                            : "border-slate-200 bg-slate-50 text-slate-600"}`}
                                >
                                    <span className="inline-flex items-center gap-1">
                                        {option === "whatsapp" ? <MessageCircle className="h-3.5 w-3.5" /> : option === "email" ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                                        {option}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{copy.destination}</label>
                        <input
                            type={channel === "email" ? "email" : "tel"}
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDarkMode ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-950"}`}
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || isDeleting}
                        className="w-full rounded-2xl bg-cyan-400 py-4 text-sm font-bold text-black transition-all hover:brightness-110 disabled:opacity-60"
                    >
                        {isSaving ? copy.saving : copy.save}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSaving || isDeleting}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 py-4 text-sm font-bold text-red-400 transition-all hover:bg-red-500/15 disabled:opacity-60"
                    >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? copy.deleting : copy.delete}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-2xl py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]"
                    >
                        {copy.cancel}
                    </button>
                </div>
            </div>
        </div>
    );
}
