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
            <div className="glass-pane w-full max-w-md p-10 shadow-2xl flex flex-col items-center relative overflow-hidden">
                {/* Language Switcher */}
                <div className="absolute top-4 right-6 flex gap-2">
                    <button
                        onClick={() => setLanguage("en")}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${language === "en" ? "text-gold-primary" : "text-white/20 hover:text-white/40"}`}
                    >
                        EN
                    </button>
                    <span className="text-white/10 text-[10px]">|</span>
                    <button
                        onClick={() => setLanguage("es")}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${language === "es" ? "text-gold-primary" : "text-white/20 hover:text-white/40"}`}
                    >
                        ES
                    </button>
                </div>

                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white text-black shadow-[0_0_30px_rgba(212,175,55,0.2)] overflow-hidden">
                        <img src="/logo.png" className="h-full w-full object-cover" alt="Congratss Logo" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic text-gold-primary text-center">Congratss</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                        {isLogin ? t.welcome_back : t.create_account}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">{t.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-gold-primary transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-gold-primary transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gold-primary/10 border border-gold-primary/30 hover:bg-gold-primary/20 text-gold-primary font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all active:scale-[0.98]"
                    >
                        {isLogin ? t.sign_in : t.sign_up}
                    </button>
                </form>

                <p className="mt-8 text-center text-white/40 text-sm">
                    {isLogin ? t.dont_have_account : t.already_have_account}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gold-primary hover:underline font-medium"
                    >
                        {isLogin ? t.sign_up : t.sign_in}
                    </button>
                </p>
            </div>
        </div>
    );
}
