"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

import { getRandomAvatar, getAvatarUrl } from "@/lib/avatars";
import Logo from "@/components/Logo";

export default function AuthPage() {
    const { language, setLanguage, updateUserProfile } = useAuth();
    const t = translations[language];

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center p-0 sm:p-4">
            <div className="glass-pane w-full max-w-md p-10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden premium-border h-[100dvh] sm:h-auto pwa-header-spacer pwa-nav-spacer">
                {/* Visual Background Accents */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/5 blur-[80px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-pink/5 blur-[80px] rounded-full" />



                <div className="z-10 mb-8">
                    <Logo size="lg" className="mb-4" />
                </div>

                {error && (
                    <div className="mb-6 w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-xs text-center animate-in fade-in zoom-in duration-300">
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
                            className="w-full bg-[var(--app-bg)] border border-[var(--glass-border)] rounded-2xl py-4 px-5 text-sm text-[var(--app-text)] focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 dark:focus:bg-white/[0.05] transition-all duration-300 shadow-inner"
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
                            className="w-full bg-[var(--app-bg)] border border-[var(--glass-border)] rounded-2xl py-4 px-5 text-sm text-[var(--app-text)] focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 dark:focus:bg-white/[0.05] transition-all duration-300 shadow-inner"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full relative group"
                    >
                        <div className="absolute inset-0 bg-neon-cyan blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl" />
                        <div className="relative bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-neon-cyan transition-all duration-300 active:scale-[0.98]">
                            <span className="uppercase tracking-widest text-xs">{isLogin ? t.sign_in : t.sign_up}</span>
                        </div>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4 w-full z-10">
                    <p className="text-center text-[var(--app-text-dim)]/60 text-xs font-medium">
                        {isLogin ? t.dont_have_account : t.already_have_account}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-cyan-600 dark:text-neon-cyan hover:text-[var(--app-text)] transition-colors duration-300 font-black uppercase tracking-widest text-[10px] ml-1"
                        >
                            {isLogin ? t.sign_up : t.sign_in}
                        </button>
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "en" ? "text-neon-cyan shadow-neon-sm" : "text-[var(--app-text-dim)]/40 hover:text-[var(--app-text)]"}`}
                        >
                            English
                        </button>
                        <span className="text-[var(--app-text-dim)]/10 text-[10px]">|</span>
                        <button
                            onClick={() => setLanguage("es")}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "es" ? "text-neon-cyan shadow-neon-sm" : "text-[var(--app-text-dim)]/40 hover:text-[var(--app-text)]"}`}
                        >
                            Español
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
