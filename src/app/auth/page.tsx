"use client";

import React, { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";
import { useTheme } from "@/context/ThemeContext";

import { getRandomAvatar, getAvatarUrl } from "@/lib/avatars";
import Logo from "@/components/Logo";
import PageCloseButton from "@/components/PageCloseButton";
import Fireworks from "@/components/Fireworks";

export default function AuthPage() {
    const { language, setLanguage, updateUserProfile } = useAuth();
    const { theme } = useTheme();
    const t = translations[language];
    const isDarkMode = theme === "dark";

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const panelToneClass = isDarkMode
        ? "sm:bg-black/45 sm:border-white/10"
        : "sm:bg-white/95 sm:border-slate-200 sm:shadow-[0_25px_65px_-35px_rgba(15,23,42,0.55)]";

    const inputToneClass = isDarkMode
        ? "bg-[var(--app-bg)] border-[var(--glass-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:bg-white/10"
        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (userCredential.user) {
                    const avatar = getRandomAvatar();
                    await updateUserProfile("Congratss User", getAvatarUrl(avatar));
                }
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Authentication error");
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center p-0 sm:p-4 pt-[max(0rem,env(safe-area-inset-top))] pb-[max(0rem,env(safe-area-inset-bottom))] relative">
            <Fireworks mode="elegant" className="z-0 opacity-65" disableOnMobile={true} maxRuntimeMs={6000} />
            <div className={`glass-pane z-10 w-full max-w-md p-10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden premium-border h-[100dvh] sm:h-auto pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:py-10 ${panelToneClass}`}>
                <PageCloseButton className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20" />
                {/* Visual Background Accents */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/5 blur-[80px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-pink/5 blur-[80px] rounded-full" />



                <div className="z-10 mb-8">
                    <Logo size="lg" className="mb-4" />
                </div>

                {error && (
                    <div className={`mb-6 w-full p-4 border rounded-2xl text-xs text-center animate-in fade-in zoom-in duration-300 ${isDarkMode ? "bg-red-500/10 border-red-500/20 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5 z-10">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--app-text-dim)] ml-2">{t.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full border rounded-2xl py-4 px-5 text-sm focus:outline-none focus:border-neon-cyan/50 transition-all duration-300 shadow-inner ${inputToneClass}`}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--app-text-dim)] ml-2">{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border rounded-2xl py-4 px-5 text-sm focus:outline-none focus:border-neon-cyan/50 transition-all duration-300 shadow-inner ${inputToneClass}`}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full relative group"
                    >
                        <div className={`absolute inset-0 bg-neon-cyan blur-md transition-opacity duration-300 rounded-2xl ${isDarkMode ? "opacity-20 group-hover:opacity-40" : "opacity-15 group-hover:opacity-30"}`} />
                        <div className="relative bg-[var(--app-text)] text-[var(--app-bg)] font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-neon-cyan transition-all duration-300 active:scale-[0.98]">
                            <span className="uppercase tracking-widest text-xs">{isLogin ? t.sign_in : t.sign_up}</span>
                        </div>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4 w-full z-10">
                    <p className={`text-center text-xs font-medium ${isDarkMode ? "text-[var(--app-text-dim)]/60" : "text-slate-600"}`}>
                        {isLogin ? t.dont_have_account : t.already_have_account}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className={`transition-colors duration-300 font-black uppercase tracking-widest text-[10px] ml-1 ${isDarkMode ? "text-neon-cyan hover:text-[var(--app-text)]" : "text-cyan-600 hover:text-slate-900"}`}
                        >
                            {isLogin ? t.sign_up : t.sign_in}
                        </button>
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "en" ? "text-neon-cyan shadow-neon-sm" : isDarkMode ? "text-[var(--app-text-dim)]/40 hover:text-[var(--app-text)]" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            English
                        </button>
                        <span className="text-[var(--app-text-dim)]/10 text-[10px]">|</span>
                        <button
                            onClick={() => setLanguage("es")}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "es" ? "text-neon-cyan shadow-neon-sm" : isDarkMode ? "text-[var(--app-text-dim)]/40 hover:text-[var(--app-text)]" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            Español
                        </button>
                    </div>

                    <div className="flex gap-4 text-[10px] uppercase tracking-widest">
                        <Link href="/about" className="text-[var(--app-text-dim)]/60 hover:text-[var(--app-text)] transition-colors">
                            {t.about_app}
                        </Link>
                        <span className="text-[var(--app-text-dim)]/20">|</span>
                        <Link href="/privacy" className="text-[var(--app-text-dim)]/60 hover:text-[var(--app-text)] transition-colors">
                            {t.privacy_policy}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
