"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Send, MessageCircle, Mail, Phone, Check, RefreshCw, Upload, Loader2, CalendarClock } from "lucide-react";
import { cardService, GreetingCard } from "@/lib/cardService";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { translations } from "@/lib/translations";
import { type CelebrationType } from "@/hooks/useCelebrations";
import { type ScheduledChannel, useScheduledMessages } from "@/hooks/useScheduledMessages";

interface SendGreetingModalProps {

    isOpen: boolean;
    onClose: () => void;
    celebration: {
        title: string;
        type: CelebrationType;
        customTypeLabel?: string;
    } | null;
}


const MESSAGE_TEMPLATES = {
    en: [
        "Happy Birthday! Hope you have a fantastic day! 🎂",
        "Happy Anniversary! Wishing you many more years of happiness! ❤️",
        "Congratulations on your retirement! Enjoy your new freedom! 🥂",
        "Thinking of you on this special day! Best wishes! ✨",
        "Huge congrats to you! Well deserved! 🎉",
        "I love you so much! ❤️",
        "Have a wonderful day, my love! ✨",
        "Good morning! Hope your day is as amazing as you are. ☀️",
        "Just wanted to say I'm thinking of you. Miss you! 💖",
        "So proud of you and everything you do! 🌟",
        "You're the best! Thanks for being you. 🙌",
        "Sending you extra hugs today! 🤗",
        "Can't wait to see you later! 🏠",
    ],
    es: [
        "¡Feliz Cumpleaños! ¡Espero que tengas un día fantástico! 🎂",
        "¡Feliz Aniversario! ¡Te deseo muchos años más de felicidad! ❤️",
        "¡Felicidades por tu jubilación! ¡Disfruta de tu nueva libertad! 🥂",
        "¡Pensando en ti en este día tan especial! ¡Mis mejores deseos! ✨",
        "¡Muchas felicidades! ¡Muy merecido! 🎉",
        "¡Te quiero mucho! ❤️",
        "¡Que tengas un día maravilloso, mi amor! ✨",
        "¡Buenos días! Espero que tu día sea tan increíble como tú. ☀️",
        "Sólo quería decir que estoy pensando en ti. ¡Te extraño! 💖",
        "¡Estoy muy orgulloso/a de ti y de todo lo que haces! 🌟",
        "¡Eres el mejor! Gracias por ser como eres. 🙌",
        "¡Te envío muchos abrazos hoy! 🤗",
        "¡No puedo esperar a verte más tarde! 🏠",
    ]
};

const ALL_CATEGORY_KEY = "__all__";
const APP_CARD_VIEWER_PATH = "/card";
const CARD_FETCH_TIMEOUT_MS = 10000;
const LOCAL_UPLOAD_ID_PREFIX = "local_upload_";

type SharePlatform = "whatsapp" | "email" | "sms";
type LocalUploadEntry = { file: File; previewUrl: string };

const FALLBACK_CARDS: GreetingCard[] = [
    { id: "custom_fallback_gratzz", url: "/greeting_gratzz.png", label: "Congratss", category: "Classic", locale: "both" },
    { id: "custom_fallback_flowers", url: "/greeting_flowers.png", label: "Flowers", category: "Classic", locale: "both" },
    { id: "custom_fallback_balloons", url: "/greeting_balloons.png", label: "Balloons", category: "Classic", locale: "both" },
    { id: "custom_fallback_cake", url: "/greeting_cake.png", label: "Birthday Cake", category: "Special", locale: "both" },
    { id: "custom_fallback_party", url: "/greeting_party.png", label: "Party Time", category: "Special", locale: "both" },
    { id: "custom_fallback_retirement", url: "/greeting_retirement.png", label: "Retirement", category: "Special", locale: "both" },
];

const CATEGORY_ALIASES: Record<string, string> = {
    All: ALL_CATEGORY_KEY,
    Todos: ALL_CATEGORY_KEY,
    Classic: "Classic",
    Clasicas: "Classic",
    Special: "Special",
    Especiales: "Special",
    Funny: "Funny",
    Divertidas: "Funny",
    New: "New",
    Nuevas: "New",
    Custom: "Custom",
    Personalizadas: "Custom"
};

const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
    [ALL_CATEGORY_KEY]: { en: "All", es: "Todos" },
    Classic: { en: "Classic", es: "Clasicas" },
    Special: { en: "Special", es: "Especiales" },
    Funny: { en: "Funny", es: "Divertidas" },
    New: { en: "New", es: "Nuevas" },
    Custom: { en: "Custom", es: "Personalizadas" }
};

const CARD_LABEL_ALIASES: Record<string, string> = {
    Congratss: "Congratss",
    Flowers: "Flowers",
    Flores: "Flowers",
    Balloons: "Balloons",
    Globos: "Balloons",
    "Birthday Cake": "Birthday Cake",
    "Pastel de Cumpleanos": "Birthday Cake",
    "Party Time": "Party Time",
    "Hora de Fiesta": "Party Time",
    Retirement: "Retirement",
    Jubilacion: "Retirement",
    Anniversary: "Anniversary",
    Aniversario: "Anniversary",
    Congrats: "Congrats",
    Felicidades: "Congrats",
    "Cool Grandpa": "Cool Grandpa",
    "Abuelo Genial": "Cool Grandpa",
    "Party Puppy": "Party Puppy",
    "Perrito de Fiesta": "Party Puppy",
    "Gamer Cat": "Gamer Cat",
    "Gato Gamer": "Gamer Cat",
    "Beer Signal": "Beer Signal",
    "Senal de Cerveza": "Beer Signal",
    "Upload Your Own": "Upload Your Own",
    "Sube la Tuya": "Upload Your Own"
};

const CARD_LABELS: Record<string, { en: string; es: string }> = {
    Congratss: { en: "Congratss", es: "Congratss" },
    Flowers: { en: "Flowers", es: "Flores" },
    Balloons: { en: "Balloons", es: "Globos" },
    "Birthday Cake": { en: "Birthday Cake", es: "Pastel de Cumpleanos" },
    "Party Time": { en: "Party Time", es: "Hora de Fiesta" },
    Retirement: { en: "Retirement", es: "Jubilacion" },
    Anniversary: { en: "Anniversary", es: "Aniversario" },
    Congrats: { en: "Congrats", es: "Felicidades" },
    "Cool Grandpa": { en: "Cool Grandpa", es: "Abuelo Genial" },
    "Party Puppy": { en: "Party Puppy", es: "Perrito de Fiesta" },
    "Gamer Cat": { en: "Gamer Cat", es: "Gato Gamer" },
    "Beer Signal": { en: "Beer Signal", es: "Senal de Cerveza" },
    "Upload Your Own": { en: "Upload Your Own", es: "Sube la Tuya" }
};

const normalizeCategory = (category: string) => CATEGORY_ALIASES[category] ?? category;

const localizeCategory = (category: string, language: "en" | "es") => {
    const canonical = normalizeCategory(category);
    return CATEGORY_LABELS[canonical]?.[language] ?? category;
};

const localizeCardLabel = (label: string, language: "en" | "es") => {
    const canonical = CARD_LABEL_ALIASES[label] ?? label;
    return CARD_LABELS[canonical]?.[language] ?? label;
};

const isCardVisibleForLanguage = (card: GreetingCard, language: "en" | "es") => {
    const locale = card.locale ?? "both";
    return locale === "both" || locale === language;
};

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

const getAppShareBaseUrl = () => {
    const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (configured) {
        return configured.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
        return window.location.origin.replace(/\/+$/, "");
    }
    return "https://congratss.com";
};

export default function SendGreetingModal({ isOpen, onClose, celebration }: SendGreetingModalProps) {
    const { language } = useAuth();
    const { theme } = useTheme();
    const { createScheduledMessage } = useScheduledMessages();
    const t = translations[language];
    const templates = MESSAGE_TEMPLATES[language];
    const isDarkMode = theme === "dark";

    const [greetingCards, setGreetingCards] = useState<GreetingCard[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_KEY);
    const [message, setMessage] = useState("");
    const [sharing, setSharing] = useState(false);
    const [isScheduleMode, setIsScheduleMode] = useState(false);
    const [scheduleChannel, setScheduleChannel] = useState<ScheduledChannel>("whatsapp");
    const [scheduleRecipient, setScheduleRecipient] = useState("");
    const [scheduleDate, setScheduleDate] = useState(() => toDateInputValue(new Date(Date.now() + 60 * 60 * 1000)));
    const [scheduleTime, setScheduleTime] = useState(() => toTimeInputValue(new Date(Date.now() + 60 * 60 * 1000)));
    const [scheduleSaving, setScheduleSaving] = useState(false);
    const [loadingCards, setLoadingCards] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [localUploads, setLocalUploads] = useState<Record<string, LocalUploadEntry>>({});
    const localUploadsRef = useRef<Record<string, LocalUploadEntry>>({});
    const wasOpenRef = useRef(false);
    const scheduleCopy = language === "es"
        ? {
            sendNow: "Enviar ahora",
            schedule: "Programar",
            schedule_title: "Envio automatico",
            schedule_date: "Fecha",
            schedule_time: "Hora",
            schedule_channel: "Canal",
            schedule_recipient: "Destino",
            schedule_destination_placeholder_email: "correo@ejemplo.com",
            schedule_destination_placeholder_phone: "+1 555 123 4567",
            schedule_save: "Programar envio",
            schedule_saving: "Programando...",
            schedule_success: "Envio programado correctamente.",
            schedule_error_past: "El horario debe ser en el futuro.",
            schedule_error_destination: "Completa un destino valido para ese canal.",
            schedule_helper: "Los envios automaticos se ejecutan cuando la app este activa en tu dispositivo.",
        }
        : {
            sendNow: "Send now",
            schedule: "Schedule",
            schedule_title: "Auto delivery",
            schedule_date: "Date",
            schedule_time: "Time",
            schedule_channel: "Channel",
            schedule_recipient: "Destination",
            schedule_destination_placeholder_email: "name@example.com",
            schedule_destination_placeholder_phone: "+1 555 123 4567",
            schedule_save: "Schedule delivery",
            schedule_saving: "Scheduling...",
            schedule_success: "Delivery scheduled successfully.",
            schedule_error_past: "Schedule time must be in the future.",
            schedule_error_destination: "Please enter a valid destination for that channel.",
            schedule_helper: "Automatic sends run while the app is active on your device.",
        };
    const previewCopy = language === "es"
        ? {
            card_preview: "Vista previa de tarjeta",
            inside_preview: "Vista previa del mensaje",
            no_card_selected: "No hay tarjeta seleccionada todavia.",
            no_message_yet: "Tu mensaje aparecera aqui cuando elijas una plantilla o escribas uno personalizado.",
        }
        : {
            card_preview: "Card preview",
            inside_preview: "Inside message preview",
            no_card_selected: "No card selected yet.",
            no_message_yet: "Your message will appear here once you pick a template or type your own.",
        };
    const modalAccentClass = celebration?.type === "birthday"
        ? "neon-border-pink"
        : celebration?.type === "anniversary"
            ? "neon-border-cyan"
            : celebration?.type === "wedding"
                ? "border-rose-400/40"
                : "neon-border-cyan";
    const desktopBackdropClass = isDarkMode
        ? "sm:bg-black/60"
        : "sm:bg-slate-900/20";
    const desktopPanelClass = isDarkMode
        ? "sm:bg-black/45 sm:border-white/10"
        : "sm:bg-white/95 sm:border-slate-200 sm:shadow-[0_25px_65px_-35px_rgba(15,23,42,0.55)]";

    const handleUserUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setInfo(t.local_upload_privacy_notice);
        try {
            const id = `${LOCAL_UPLOAD_ID_PREFIX}${Date.now()}`;
            const previewUrl = URL.createObjectURL(file);
            const customCard: GreetingCard = {
                id,
                url: previewUrl,
                label: t.upload_your_own,
                category: "Custom",
                locale: "both"
            };

            setLocalUploads((previous) => ({
                ...previous,
                [id]: { file, previewUrl }
            }));
            setGreetingCards((previous) => [customCard, ...previous]);
            setSelectedImageId(id);
            setActiveCategory(ALL_CATEGORY_KEY);
        } catch (uploadError) {
            console.error("Local upload error:", uploadError);
            alert(t.upload_failed);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    useEffect(() => {
        localUploadsRef.current = localUploads;
    }, [localUploads]);

    useEffect(() => {
        return () => {
            Object.values(localUploadsRef.current).forEach((entry) => {
                URL.revokeObjectURL(entry.previewUrl);
            });
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            wasOpenRef.current = true;
            return;
        }
        if (!wasOpenRef.current) return;
        wasOpenRef.current = false;

        setGreetingCards((previous) => previous.filter((card) => !card.id.startsWith(LOCAL_UPLOAD_ID_PREFIX)));
        setLocalUploads((previous) => {
            Object.values(previous).forEach((entry) => {
                URL.revokeObjectURL(entry.previewUrl);
            });
            return {};
        });
    }, [isOpen]);


    useEffect(() => {
        if (!isOpen) return;

        let alive = true;
        setLoadingCards(true);
        setError(null);

        const loadCards = async () => {
            try {
                const cards = await Promise.race([
                    cardService.getCards(),
                    new Promise<GreetingCard[]>((_, reject) => {
                        window.setTimeout(() => reject(new Error("Card library fetch timeout")), CARD_FETCH_TIMEOUT_MS);
                    })
                ]);
                if (!alive) return;
                setGreetingCards(cards);
                setSelectedImageId((previous) => {
                    if (previous && cards.some((card) => card.id === previous)) return previous;
                    return cards[0]?.id ?? null;
                });
                setLoadingCards(false);
            } catch (err) {
                if (!alive) return;
                console.error("Modal cards error:", err);
                setGreetingCards(FALLBACK_CARDS);
                setSelectedImageId((previous) => {
                    if (previous && FALLBACK_CARDS.some((card) => card.id === previous)) return previous;
                    return FALLBACK_CARDS[0]?.id ?? null;
                });
                setError(null);
                setInfo(language === "es"
                    ? "Mostrando tarjetas base mientras se restablece la conexion."
                    : "Showing base cards while connection recovers.");
                setLoadingCards(false);
            }
        };

        loadCards();
        return () => {
            alive = false;
        };
    }, [isOpen, language]);

    useEffect(() => {
        if (!isOpen) return;
        const nextHour = new Date(Date.now() + 60 * 60 * 1000);
        setScheduleDate(toDateInputValue(nextHour));
        setScheduleTime(toTimeInputValue(nextHour));
        setScheduleRecipient("");
        setScheduleChannel("whatsapp");
        setIsScheduleMode(false);
        setInfo(null);
    }, [isOpen]);

    const localeFilteredCards = useMemo(
        () => greetingCards.filter((card) => isCardVisibleForLanguage(card, language)),
        [greetingCards, language]
    );
    const availableCategoryKeys = useMemo(
        () => Array.from(new Set(localeFilteredCards.map((img) => normalizeCategory(img.category)))),
        [localeFilteredCards]
    );

    useEffect(() => {
        if (localeFilteredCards.length === 0) {
            setSelectedImageId(null);
            return;
        }

        if (!selectedImageId || !localeFilteredCards.some((card) => card.id === selectedImageId)) {
            setSelectedImageId(localeFilteredCards[0].id);
        }
    }, [localeFilteredCards, selectedImageId]);

    useEffect(() => {
        if (activeCategory === ALL_CATEGORY_KEY) return;
        if (!availableCategoryKeys.includes(activeCategory)) {
            setActiveCategory(ALL_CATEGORY_KEY);
        }
    }, [activeCategory, availableCategoryKeys]);

    if (!isOpen) return null;

    const categories = [
        ALL_CATEGORY_KEY,
        ...availableCategoryKeys
    ].sort((a, b) => a.localeCompare(b));

    const selectedImage = localeFilteredCards.find(img => img.id === selectedImageId) || localeFilteredCards[0];
    const selectedLocalUpload = selectedImage ? localUploads[selectedImage.id] : undefined;
    const isLocalUploadSelected = Boolean(selectedLocalUpload);
    const selectedCardLabel = selectedImage ? localizeCardLabel(selectedImage.label, language) : previewCopy.no_card_selected;
    const messagePreview = message.trim() || previewCopy.no_message_yet;

    const filteredImages = activeCategory === ALL_CATEGORY_KEY
        ? localeFilteredCards
        : localeFilteredCards.filter(img => normalizeCategory(img.category) === activeCategory);

    const handleTemplateSelect = (template: string) => {
        setMessage(template);
    };

    const getCardViewerLink = () => {
        const appShareUrl = getAppShareBaseUrl();
        if (!selectedImage) return appShareUrl;
        if (selectedImage.id.startsWith(LOCAL_UPLOAD_ID_PREFIX)) return "";
        if (selectedImage.id.startsWith("custom_")) {
            return `${appShareUrl}${APP_CARD_VIEWER_PATH}?img=${encodeURIComponent(selectedImage.url)}`;
        }
        return `${appShareUrl}${APP_CARD_VIEWER_PATH}?id=${encodeURIComponent(selectedImage.id)}`;
    };

    const getShareText = () => {
        const baseMessage = message.trim();
        const viewerLink = getCardViewerLink();
        if (!viewerLink) return baseMessage;
        const cta = language === "es" ? "Mira tu tarjeta aqui" : "View your card here";
        if (!baseMessage) return `${cta}: ${viewerLink}`;
        return `${baseMessage}\n\n${cta}: ${viewerLink}`;
    };

    const getShareUrl = (platform: SharePlatform, recipient?: string) => {
        if (!selectedImage) return "";
        const encodedMessage = encodeURIComponent(getShareText());
        const target = (recipient ?? "").trim();

        switch (platform) {
            case "whatsapp":
                if (target) {
                    const cleanPhone = normalizePhone(target).replace(/^\+/, "");
                    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
                }
                return `https://api.whatsapp.com/send?text=${encodedMessage}`;
            case "email":
                return `mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent("Congratss Greeting")}&body=${encodedMessage}`;
            case "sms":
                return `sms:${encodeURIComponent(normalizePhone(target))}?&body=${encodedMessage}`;
            default:
                return "";
        }
    };

    const handleShare = async (platform: SharePlatform) => {
        if (isLocalUploadSelected) {
            setInfo(t.local_upload_share_hint);
            await handleNativeShare();
            return;
        }
        const url = getShareUrl(platform);
        if (platform === "whatsapp") {
            window.open(url, "_blank");
        } else {
            window.location.href = url;
        }
    };

    const handleScheduleDelivery = async () => {
        if (!selectedImage) return;
        if (isLocalUploadSelected) {
            setError(t.local_upload_schedule_disabled);
            return;
        }
        setError(null);

        const targetDate = new Date(`${scheduleDate}T${scheduleTime}`);
        if (Number.isNaN(targetDate.getTime()) || targetDate.getTime() <= Date.now()) {
            setError(scheduleCopy.schedule_error_past);
            return;
        }

        const recipient = scheduleRecipient.trim();
        if (scheduleChannel === "email" && !recipient.includes("@")) {
            setError(scheduleCopy.schedule_error_destination);
            return;
        }
        if ((scheduleChannel === "sms" || scheduleChannel === "whatsapp") && normalizePhone(recipient).replace(/^\+/, "").length < 7) {
            setError(scheduleCopy.schedule_error_destination);
            return;
        }

        setScheduleSaving(true);
        try {
            await createScheduledMessage({
                celebrationTitle: celebration?.title ?? (language === "es" ? "Celebracion" : "Celebration"),
                channel: scheduleChannel,
                recipient,
                message: getShareText(),
                shareUrl: getShareUrl(scheduleChannel, recipient),
                cardLabel: localizeCardLabel(selectedImage.label, language),
                cardUrl: selectedImage.url,
                scheduledAt: targetDate,
            });
            setInfo(scheduleCopy.schedule_success);
            setError(null);
            setIsScheduleMode(false);
            setScheduleRecipient("");
        } catch (scheduleError) {
            console.error("Schedule creation error:", scheduleError);
            setError(scheduleError instanceof Error ? scheduleError.message : translations[language].connection_error);
        } finally {
            setScheduleSaving(false);
        }
    };

    const handleCopyLink = () => {
        if (!selectedImage) return;
        if (isLocalUploadSelected) {
            setInfo(t.local_upload_link_unavailable);
            return;
        }
        const shareText = getShareText();
        navigator.clipboard.writeText(shareText).then(() => {
            alert(language === "es" ? "¡Mensaje y enlace copiados!" : "Message and card link copied to clipboard!");
        });
    };

    const handleDownload = () => {
        if (!selectedImage) return;
        const link = document.createElement("a");
        link.href = selectedImage.url;
        link.download = `${selectedImageId}_greeting.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNativeShare = async () => {
        if (!selectedImage) return;
        if (typeof navigator === 'undefined' || !navigator.share) {
            alert(language === "es" ? "Compartir no disponible en este navegador." : "Sharing not supported on this browser.");
            return;
        }

        setSharing(true);
        try {
            const shareData: ShareData = {};

            if (selectedLocalUpload) {
                if (navigator.canShare && navigator.canShare({ files: [selectedLocalUpload.file] })) {
                    shareData.files = [selectedLocalUpload.file];
                } else {
                    setInfo(t.local_upload_share_hint);
                    return;
                }
            } else {
                shareData.text = getShareText();
                const viewerLink = getCardViewerLink();
                if (viewerLink) {
                    shareData.url = viewerLink;
                }

                try {
                    const response = await fetch(selectedImage.url);
                    const blob = await response.blob();
                    const file = new File([blob], `${selectedImageId}.png`, { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        shareData.files = [file];
                    }
                } catch {
                    console.log("Could not attach file, sharing as link instead");
                }
            }

            await navigator.share(shareData);
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        } finally {
            setSharing(false);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm ${desktopBackdropClass}`}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`glass-pane w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300 premium-border ${modalAccentClass} ${desktopPanelClass}`}
            >
                {isDarkMode && (
                    <>
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,_#23324a_0%,_#151820_45%,_#111622_100%)]" />
                        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_85%_10%,_#2b4a6a_0%,_transparent_40%)]" />
                    </>
                )}
                {/* Header */}
                <div className="p-6 border-b border-black/5 dark:border-white/10 flex justify-between items-center shrink-0 bg-[var(--pane-bg)] backdrop-blur-md z-10 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-6">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--app-text)] uppercase tracking-tight">{t.pick_and_send}</h2>
                        <p className="text-xs text-[var(--app-text-dim)]">
                            {celebration ? `${t.greeting_for} ${celebration.title}` : t.share_with_anyone}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close modal"
                        onClick={onClose}
                        className="z-20 w-10 h-10 grid place-items-center hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors touch-manipulation cursor-pointer"
                    >
                        <X className="w-5 h-5 text-[var(--app-text-dim)]" />
                    </button>
                </div>

                <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--pane-bg)]">
                    {info && (
                        <div className={`rounded-2xl border p-3 text-xs ${isDarkMode ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                            {info}
                        </div>
                    )}
                    <div className={`grid grid-cols-2 rounded-2xl border p-1 ${isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-100"}`}>
                        <button
                            type="button"
                            onClick={() => setIsScheduleMode(false)}
                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${(!isScheduleMode || isLocalUploadSelected) ? "bg-cyan-400 text-black shadow-neon-sm" : "text-[var(--app-text-dim)]"}`}
                        >
                            {scheduleCopy.sendNow}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsScheduleMode(true)}
                            disabled={isLocalUploadSelected}
                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${(isScheduleMode && !isLocalUploadSelected) ? "bg-cyan-400 text-black shadow-neon-sm" : "text-[var(--app-text-dim)]"} disabled:opacity-40`}
                        >
                            {scheduleCopy.schedule}
                        </button>
                    </div>
                    {isLocalUploadSelected && (
                        <p className="text-[10px] text-[var(--app-text-muted)]">
                            {t.local_upload_privacy_notice}
                        </p>
                    )}

                    {/* Image Selection with Category Tabs */}
                    <div>
                        <div className="flex flex-col gap-3 mb-3">
                            <label className="text-[10px] font-bold text-[var(--app-text-dim)] uppercase tracking-widest block">{t.select_card}</label>
                            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                                <label className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all bg-black/5 dark:bg-white/5 border border-dashed border-cyan-400/50 text-cyan-400 cursor-pointer hover:bg-cyan-400/10 whitespace-nowrap">
                                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                    {uploading ? t.uploading : t.upload_your_own}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleUserUpload}
                                        disabled={uploading || loadingCards}
                                    />
                                </label>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all whitespace-nowrap border ${activeCategory === cat
                                            ? "bg-cyan-400 text-black border-cyan-400 shadow-neon"
                                            : "text-[var(--app-text-dim)] border-[var(--glass-border)] hover:text-[var(--app-text)] bg-black/5 dark:bg-white/5"
                                            }`}
                                    >
                                        {localizeCategory(cat, language)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`mb-4 rounded-2xl border p-3 space-y-3 ${isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--app-text-dim)]">{previewCopy.card_preview}</p>
                            </div>
                            {selectedImage ? (
                                <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/15 bg-black/5 dark:bg-black/30">
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedCardLabel}
                                        className="w-full h-44 sm:h-52 object-contain bg-black/10"
                                    />
                                </div>
                            ) : (
                                <div className="h-36 grid place-items-center rounded-xl border border-dashed border-[var(--glass-border)] text-xs text-[var(--app-text-muted)]">
                                    {previewCopy.no_card_selected}
                                </div>
                            )}
                            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--app-text)]">{selectedCardLabel}</p>
                            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30 p-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--app-text-dim)] mb-2">{previewCopy.inside_preview}</p>
                                <p className="text-xs leading-relaxed text-[var(--app-text)] whitespace-pre-wrap break-words">{messagePreview}</p>
                            </div>
                        </div>

                        {loadingCards ? (
                            <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                                <p className="text-[10px] uppercase font-bold tracking-widest">{t.fetching_library}</p>
                            </div>
                        ) : error ? (
                            <div className="py-10 text-center text-red-400">
                                <p className="text-xs font-bold mb-2 uppercase tracking-widest">{t.connection_error}</p>
                                <button onClick={() => window.location.reload()} className="text-[10px] uppercase underline opacity-60">{language === "es" ? "Reintentar" : "Retry"}</button>
                            </div>
                        ) : filteredImages.length === 0 ? (
                            <div className="py-20 text-center opacity-30 flex flex-col items-center gap-3">
                                <p className="text-xs uppercase font-bold tracking-widest">
                                    {t.no_cards_available}
                                </p>
                                <p className="text-[9px] max-w-[200px] leading-relaxed">
                                    {t.check_connection_admin}
                                </p>
                                <button onClick={() => window.location.reload()} className="px-4 py-2 border border-white/10 rounded-lg text-[9px] uppercase font-bold hover:bg-white/5">
                                    {language === "es" ? "Forzar Actualización" : "Force Refresh"}
                                </button>
                                <div className="text-[8px] opacity-20 mt-2">{language === "es" ? "Tarjetas encontradas" : "Cards found"}: {localeFilteredCards.length}</div>
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-x-visible sm:overflow-y-auto sm:max-h-80 sm:pr-1">
                                {filteredImages.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageId(img.id)}
                                        className={`relative flex-shrink-0 w-32 h-32 sm:w-full sm:h-28 rounded-xl overflow-hidden border-2 transition-all ${selectedImageId === img.id ? "border-cyan-400 scale-105 shadow-neon-sm" : "border-black/10 dark:border-white/20 opacity-70 grayscale-[0.2]"
                                            }`}
                                    >
                                        <img src={img.url} alt={localizeCardLabel(img.label, language)} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1.5 px-2">
                                            <p className="text-[9px] font-bold text-white/90 uppercase text-center truncate">{localizeCardLabel(img.label, language)}</p>
                                        </div>
                                        {selectedImageId === img.id && (
                                            <div className="absolute top-2 right-2">
                                                <div className="p-1 bg-cyan-400 rounded-full shadow-neon">
                                                    <Check className="w-3 h-3 text-black font-bold" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pre-designed Messages */}
                    <div>
                        <label className="text-[10px] font-bold text-[var(--app-text-dim)] uppercase tracking-widest mb-3 block">{t.quick_messages}</label>
                        <div className="flex flex-wrap gap-2">
                            {templates.map((tmp, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTemplateSelect(tmp)}
                                    className="text-left px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[11px] text-[var(--app-text-dim)] hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all active:scale-95"
                                >
                                    {tmp.split('!')[0]}!
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Message */}
                    <div>
                        <label className="text-[10px] font-bold text-[var(--app-text-dim)] uppercase tracking-widest mb-3 block">{t.personalize}</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={language === "es" ? "Añade tus propias palabras..." : "Add your own special words here..."}
                            className="w-full h-28 bg-[var(--app-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm text-[var(--app-text)] focus:outline-none focus:border-cyan-400/50 transition-all resize-none shadow-inner"
                        />
                    </div>

                    {isScheduleMode && !isLocalUploadSelected ? (
                        <div className="space-y-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                            <div className="flex items-center gap-2 text-cyan-400">
                                <CalendarClock className="w-4 h-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{scheduleCopy.schedule_title}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{scheduleCopy.schedule_date}</label>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--app-bg)] px-3 py-2 text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{scheduleCopy.schedule_time}</label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--app-bg)] px-3 py-2 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{scheduleCopy.schedule_channel}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["whatsapp", "email", "sms"] as SharePlatform[]).map((channel) => (
                                        <button
                                            key={channel}
                                            type="button"
                                            onClick={() => setScheduleChannel(channel)}
                                            className={`rounded-xl border py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${scheduleChannel === channel ? "border-cyan-400 bg-cyan-400/20 text-cyan-300" : "border-[var(--glass-border)] text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                                        >
                                            {channel}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--app-text-dim)]">{scheduleCopy.schedule_recipient}</label>
                                <input
                                    type={scheduleChannel === "email" ? "email" : "tel"}
                                    value={scheduleRecipient}
                                    onChange={(e) => setScheduleRecipient(e.target.value)}
                                    placeholder={scheduleChannel === "email" ? scheduleCopy.schedule_destination_placeholder_email : scheduleCopy.schedule_destination_placeholder_phone}
                                    className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--app-bg)] px-3 py-2 text-xs"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleScheduleDelivery}
                                disabled={scheduleSaving || !selectedImage}
                                className="w-full rounded-xl bg-cyan-400 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:brightness-110 disabled:opacity-50"
                            >
                                {scheduleSaving ? scheduleCopy.schedule_saving : scheduleCopy.schedule_save}
                            </button>
                            <p className="text-[10px] text-[var(--app-text-muted)]">{scheduleCopy.schedule_helper}</p>
                        </div>
                    ) : (
                        <>
                            {/* Native Share / Primary Action */}
                            <div className="pt-2">
                                <button
                                    onClick={handleNativeShare}
                                    disabled={sharing || !selectedImage}
                                    className="w-full py-4 rounded-2xl bg-cyan-400 text-black font-bold text-sm flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5 flex-shrink-0" />
                                    {sharing ? t.sharing : t.share_with_device}
                                </button>
                            </div>

                            {/* Secondary Share Icons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleShare("whatsapp")}
                                    disabled={!selectedImage}
                                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-30"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-bold">WhatsApp</span>
                                </button>
                                <button
                                    onClick={() => handleShare("email")}
                                    disabled={!selectedImage}
                                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all disabled:opacity-30"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span className="text-[10px] font-bold">Email</span>
                                </button>
                                <button
                                    onClick={() => handleShare("sms")}
                                    disabled={!selectedImage}
                                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/20 transition-all disabled:opacity-30"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span className="text-[10px] font-bold">SMS</span>
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    disabled={!selectedImage}
                                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--app-text-dim)] hover:bg-black/10 dark:hover:bg-white/10 transition-all disabled:opacity-30"
                                >
                                    <Check className="w-4 h-4" />
                                    <span className="text-[10px] font-bold">{t.copy_link}</span>
                                </button>
                                <button
                                    onClick={handleDownload}
                                    disabled={!selectedImage}
                                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-400/5 border border-cyan-400/10 text-cyan-400/80 hover:bg-cyan-400/10 transition-all disabled:opacity-30"
                                >
                                    <Send className="w-4 h-4 rotate-90" />
                                    <span className="text-[10px] font-bold">{t.save_card}</span>
                                </button>
                            </div>
                        </>
                    )}

                    <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-[var(--pane-bg)]/95 backdrop-blur-md border-t border-black/5 dark:border-white/10">
                        <h2 className="text-2xl font-black text-[var(--app-text)] uppercase tracking-tighter italic">
                            {t.pick_and_send}
                        </h2>
                        <p className="text-[var(--app-text-muted)] text-center italic text-[9px]">
                            {t.share_tip}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

