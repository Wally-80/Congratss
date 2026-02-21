"use client";

import React, { useState } from "react";
import { X, Send, MessageCircle, Mail, Phone, Check } from "lucide-react";

interface SendGreetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    celebration: {
        title: string;
        type: string;
    } | null;
}

const GREETING_IMAGES = [
    { id: "flowers", url: "/greeting_flowers.png", label: "Flowers" },
    { id: "balloons", url: "/greeting_balloons.png", label: "Balloons" },
    { id: "gratzz", url: "/greeting_gratzz.png", label: "Gratzz" },
    { id: "cake", url: "/greeting_cake.png", label: "Birthday Cake" },
    { id: "party", url: "/greeting_party.png", label: "Party Time" },
    { id: "retirement", url: "/greeting_retirement.png", label: "Retirement" },
    { id: "anniversary", url: "/greeting_anniversary_gold.png", label: "Anniversary" },
    { id: "congrats", url: "/greeting_congrats_modern.png", label: "Congrats" },
];

const MESSAGE_TEMPLATES = [
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
];

export default function SendGreetingModal({ isOpen, onClose, celebration }: SendGreetingModalProps) {
    const [selectedImageId, setSelectedImageId] = useState(GREETING_IMAGES[0].id);
    const [message, setMessage] = useState("");
    const [sharing, setSharing] = useState(false);

    if (!isOpen) return null;

    const selectedImage = GREETING_IMAGES.find(img => img.id === selectedImageId) || GREETING_IMAGES[0];

    const handleTemplateSelect = (template: string) => {
        setMessage(template);
    };

    const getShareUrl = (platform: "whatsapp" | "email" | "sms") => {
        const encodedMessage = encodeURIComponent(message);

        switch (platform) {
            case "whatsapp":
                return `https://wa.me/?text=${encodedMessage}`;
            case "email":
                return `mailto:?body=${encodedMessage}`;
            case "sms":
                return `sms:?&body=${encodedMessage}`;
            default:
                return "";
        }
    };

    const handleShare = (platform: "whatsapp" | "email" | "sms") => {
        window.open(getShareUrl(platform), "_blank");
    };

    const handleNativeShare = async () => {
        if (typeof navigator === 'undefined' || !navigator.share) {
            alert("Sharing not supported on this browser. Use the platform icons below!");
            return;
        }

        setSharing(true);
        try {
            const shareData: ShareData = {
                text: message,
            };

            // Attempt to fetch the image to share as a file (supported on most modern mobile)
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-pane w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a1a]/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Pick & Send</h2>
                        <p className="text-xs text-white/40">
                            {celebration ? `Greeting for ${celebration.title}` : "Share with anyone"}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Image Selection */}
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">1. Select your card</label>
                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                            {GREETING_IMAGES.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImageId(img.id)}
                                    className={`relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border-2 transition-all ${selectedImageId === img.id ? "border-cyan-400 scale-105 shadow-neon" : "border-white/10 opacity-60 grayscale-[0.3]"
                                        }`}
                                >
                                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1.5 px-2">
                                        <p className="text-[9px] font-bold text-white/90 uppercase text-center">{img.label}</p>
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
                    </div>

                    {/* Pre-designed Messages */}
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">2. Quick messages</label>
                        <div className="flex flex-wrap gap-2">
                            {MESSAGE_TEMPLATES.map((tmp, idx) => (
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
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">3. Personalize</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add your own special words here..."
                            className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-all resize-none shadow-inner"
                        />
                    </div>

                    {/* Native Share / Primary Action */}
                    <div className="pt-2">
                        <button
                            onClick={handleNativeShare}
                            disabled={sharing}
                            className="w-full py-4 rounded-2xl bg-cyan-400 text-black font-bold text-sm flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-50"
                        >
                            <Send className="w-5 h-5 flex-shrink-0" />
                            {sharing ? "Sharing..." : "Share with Device"}
                        </button>
                    </div>

                    {/* Secondary Share Icons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleShare("whatsapp")}
                            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-[10px] font-bold">WhatsApp</span>
                        </button>
                        <button
                            onClick={() => handleShare("email")}
                            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            <span className="text-[10px] font-bold">Email</span>
                        </button>
                        <button
                            onClick={() => handleShare("sms")}
                            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="text-[10px] font-bold">SMS</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
