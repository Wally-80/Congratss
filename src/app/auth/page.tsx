"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

export default function AuthPage() {
    const { language, setLanguage } = useAuth();
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
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-pane w-full max-w-md p-10 shadow-2xl flex flex-col items-center relative overflow-hidden premium-border">
                {/* Visual Background Accents */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/5 blur-[80px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-pink/5 blur-[80px] rounded-full" />

                {/* Language Switcher */}
                <div className="absolute top-6 right-8 flex gap-3">
                    <button
                        onClick={() => setLanguage("en")}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "en" ? "text-neon-cyan shadow-neon-sm" : "text-white/20 hover:text-white/40"}`}
                    >
                        EN
                    </button>
                    <span className="text-white/10 text-[10px]">|</span>
                    <button
                        onClick={() => setLanguage("es")}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "es" ? "text-neon-cyan shadow-neon-sm" : "text-white/20 hover:text-white/40"}`}
                    >
                        ES
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 mb-10 z-10">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-black shadow-2xl overflow-hidden relative z-10 border-2 border-white/20 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                            <img src="/logo.png" className="h-full w-full object-cover" alt="Congratss Logo" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-5xl font-black tracking-tighter italic text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Congratss</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                            {isLogin ? t.welcome_back : t.create_account}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-xs text-center animate-in fade-in zoom-in duration-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5 z-10">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">{t.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/[0.05] transition-all duration-300"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/[0.05] transition-all duration-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full relative group"
                    >
                        <div className="absolute inset-0 bg-neon-cyan blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl" />
                        <div className="relative bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-neon-cyan transition-all duration-300 active:scale-[0.98]">
                            <span className="uppercase tracking-widest text-xs">{isLogin ? t.sign_in : t.sign_up}</span>
                        </div>
                    </button>
                </form>

                <p className="mt-10 text-center text-white/40 text-xs font-medium z-10">
                    {isLogin ? t.dont_have_account : t.already_have_account}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-neon-cyan hover:text-white transition-colors duration-300 font-black uppercase tracking-widest text-[10px] ml-1"
                    >
                        {isLogin ? t.sign_up : t.sign_in}
                    </button>
                </p>
            </div>
        </div>
    );
}
