"use client";

import React, { useState, useEffect } from "react";
import { X, Send, MessageCircle, Mail, Phone, Check, RefreshCw, Upload, Loader2 } from "lucide-react";
import { cardService, GreetingCard } from "@/lib/cardService";

import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";
import { uploadFile } from "@/lib/storageService";

interface SendGreetingModalProps {

    isOpen: boolean;
    onClose: () => void;
    celebration: {
        title: string;
        type: string;
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

export default function SendGreetingModal({ isOpen, onClose, celebration }: SendGreetingModalProps) {
    const { language } = useAuth();
    const t = translations[language];
    const templates = MESSAGE_TEMPLATES[language];

    const [greetingCards, setGreetingCards] = useState<GreetingCard[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [message, setMessage] = useState("");
    const [sharing, setSharing] = useState(false);
    const [loadingCards, setLoadingCards] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUserUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);
        try {
            const url = await uploadFile(file, "user_uploads", (progress) => {
                setUploadProgress(progress);
            });

            const customCard: GreetingCard = {
                id: `custom_${Date.now()}`,
                url,
                label: t.upload_your_own,
                category: "Custom"
            };

            setGreetingCards(prev => [customCard, ...prev]);
            setSelectedImageId(customCard.id);
            setActiveCategory("All");
        } catch (error) {
            console.error("Upload error:", error);
            alert(t.upload_failed);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };


    useEffect(() => {
        // Subscribe to cards on mount to ensure data is ready early
        const unsubscribe = cardService.subscribeToCards((cards) => {
            setGreetingCards(cards);
            if (cards.length > 0 && !selectedImageId) {
                setSelectedImageId(cards[0].id);
            }
            setLoadingCards(false);
            setError(null);
        }, (err) => {
            console.error("Modal cards error:", err);
            setError(err.message || t.connection_error);
            setLoadingCards(false);
        });

        return () => unsubscribe();
    }, []);

    if (!isOpen) return null;

    const categories = ["All", ...Array.from(new Set(greetingCards.map(img => img.category)))].sort();

    const selectedImage = greetingCards.find(img => img.id === selectedImageId) || greetingCards[0];

    const filteredImages = activeCategory === "All"
        ? greetingCards
        : greetingCards.filter(img => img.category === activeCategory);

    const handleTemplateSelect = (template: string) => {
        setMessage(template);
    };

    const getShareUrl = (platform: "whatsapp" | "email" | "sms") => {
        if (!selectedImage) return "";
        const encodedMessage = encodeURIComponent(message);
        const cardUrl = selectedImage.url.startsWith('http')
            ? selectedImage.url
            : `${window.location.origin}${selectedImage.url}`;

        switch (platform) {
            case "whatsapp":
                return `https://api.whatsapp.com/send?text=${encodedMessage}${encodeURIComponent("\n\n" + cardUrl)}`;
            case "email":
                return `mailto:?body=${encodedMessage}${encodeURIComponent("\n\n" + cardUrl)}`;
            case "sms":
                return `sms:?&body=${encodedMessage}${encodeURIComponent("\n\n" + cardUrl)}`;
            default:
                return "";
        }
    };

    const handleShare = (platform: "whatsapp" | "email" | "sms") => {
        const url = getShareUrl(platform);
        if (platform === "whatsapp") {
            window.open(url, "_blank");
        } else {
            window.location.href = url;
        }
    };

    const handleCopyLink = () => {
        if (!selectedImage) return;
        const cardUrl = selectedImage.url.startsWith('http')
            ? selectedImage.url
            : `${window.location.origin}${selectedImage.url}`;
        const fullText = `${message}\n\n${cardUrl}`;
        navigator.clipboard.writeText(fullText).then(() => {
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
            const shareData: ShareData = {
                text: message,
            };

            try {
                const response = await fetch(selectedImage.url);
                const blob = await response.blob();
                const file = new File([blob], `${selectedImageId}.png`, { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    shareData.files = [file];
                }
            } catch (e) {
                console.log("Could not attach file, sharing as link instead");
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className={`glass-pane w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in duration-300 premium-border ${celebration?.type === "birthday" ? "neon-border-pink" : celebration?.type === "anniversary" ? "neon-border-cyan" : "neon-border-cyan"}`}>
                {/* Header */}
                <div className="p-6 border-b border-black/5 dark:border-white/10 flex justify-between items-center sticky top-0 bg-[var(--pane-bg)] backdrop-blur-md z-10 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-6">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--app-text)] uppercase tracking-tight">{t.pick_and_send}</h2>
                        <p className="text-xs text-[var(--app-text-dim)]">
                            {celebration ? `${t.greeting_for} ${celebration.title}` : t.share_with_anyone}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors mt-[max(0rem,calc(env(safe-area-inset-top)-1rem))] sm:mt-0">
                        <X className="w-5 h-5 text-[var(--app-text-dim)]" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
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
                                        disabled={uploading}
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
                                        {cat === "All" ? (language === "es" ? "Todos" : "All") : cat}
                                    </button>
                                ))}
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
                                <div className="text-[8px] opacity-20 mt-2">Cards found: {greetingCards.length}</div>
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {filteredImages.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageId(img.id)}
                                        className={`relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border-2 transition-all ${selectedImageId === img.id ? "border-cyan-400 scale-105 shadow-neon-sm" : "border-black/10 dark:border-white/20 opacity-70 grayscale-[0.2]"
                                            }`}
                                    >
                                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1.5 px-2">
                                            <p className="text-[9px] font-bold text-white/90 uppercase text-center truncate">{img.label}</p>
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

                    <h2 className="text-2xl font-black text-[var(--app-text)] uppercase tracking-tighter italic">
                        {t.pick_and_send}
                    </h2>
                    <p className="text-[var(--app-text-muted)] text-center italic text-[9px]">
                        {t.share_tip}
                    </p>
                </div>
            </div>
        </div>
    );
}
