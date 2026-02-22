"use client";

import React, { useState, useEffect } from "react";
import { X, Send, MessageCircle, Mail, Phone, Check, RefreshCw } from "lucide-react";
import { cardService, GreetingCard } from "@/lib/cardService";

import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

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

    useEffect(() => {
        if (!isOpen) return;

        const unsubscribe = cardService.subscribeToCards((cards) => {
            console.log("Modal received cards:", cards.length);
            setGreetingCards(cards);
            if (cards.length > 0 && !selectedImageId) {
                setSelectedImageId(cards[0].id);
            }
            setLoadingCards(false);
        }, (err) => {
            console.error("Modal fetch error:", err);
            setLoadingCards(false);
        });

        return () => unsubscribe();
    }, [isOpen]);

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
            <div className="glass-pane w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a1a]/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">{t.pick_and_send}</h2>
                        <p className="text-xs text-white/40">
                            {celebration ? (language === "es" ? `Felicitación para ${celebration.title}` : `Greeting for ${celebration.title}`) : (language === "es" ? "Comparte con cualquiera" : "Share with anyone")}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Image Selection with Category Tabs */}
                    <div>
                        <div className="flex flex-col gap-3 mb-3">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">{t.select_card}</label>
                            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all whitespace-nowrap border ${activeCategory === cat
                                            ? "bg-cyan-400 text-black border-cyan-400 shadow-neon"
                                            : "text-white/40 border-white/5 hover:text-white/70 bg-white/5"
                                            }`}
                                    >
                                        {cat === "All" && language === "es" ? "Todos" : cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loadingCards ? (
                            <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                                <p className="text-[10px] uppercase font-bold tracking-widest">{language === "es" ? "Obteniendo Galería..." : "Fetching Library..."}</p>
                            </div>
                        ) : filteredImages.length === 0 ? (
                            <div className="py-20 text-center opacity-30">
                                <p className="text-xs uppercase font-bold tracking-widest">{language === "es" ? "No hay tarjetas" : "No cards in this category"}</p>
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {filteredImages.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageId(img.id)}
                                        className={`relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border-2 transition-all ${selectedImageId === img.id ? "border-cyan-400 scale-105 shadow-neon-sm" : "border-white/10 opacity-60 grayscale-[0.3]"
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
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">{t.quick_messages}</label>
                        <div className="flex flex-wrap gap-2">
                            {templates.map((tmp, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTemplateSelect(tmp)}
                                    className="text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/70 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                                >
                                    {tmp.split('!')[0]}!
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Message */}
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">{t.personalize}</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={language === "es" ? "Añade tus propias palabras..." : "Add your own special words here..."}
                            className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-all resize-none shadow-inner"
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
                            {sharing ? (language === "es" ? "Compartiendo..." : "Sharing...") : t.share_with_device}
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
                            className="flex-1 min-w-[100px] flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all disabled:opacity-30"
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

                    <p className="text-[9px] text-white/20 text-center italic">
                        {language === "es"
                            ? "Tip: En móvil, 'Compartir' envía la imagen. En PC, usa 'Guardar' para adjuntarla."
                            : "Tip: On mobile, 'Share with Device' sends the image. On desktop, use 'Save Card' to attach it."}
                    </p>
                </div>
            </div>
        </div>
    );
}
