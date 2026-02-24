"use client";

import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Gift, Mail, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/translations';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { language } = useAuth();
    const t = translations[language];

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (error) {
            console.error(error);
            alert(t.login_failed);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            console.error(error);
            alert(t.login_failed);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="glass w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-700 bg-black/40 border border-white/10 ring-1 ring-neon-cyan/20 relative pt-20 sm:pt-10">
                {/* Language Switcher */}
                <div className="absolute top-4 sm:top-6 right-6 sm:right-8 flex gap-3 z-50">
                    <button
                        onClick={() => { }} // Integration with useAuth if needed, but LoginPage already has 'language' from context
                        className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 px-2 py-1 ${language === "en" ? "text-neon-cyan shadow-neon-sm" : "text-muted-foreground/50 hover:text-white"}`}
                    >
                        EN
                    </button>
                    <span className="text-white/10 text-[10px] self-center">|</span>
                    <button
                        onClick={() => { }} // Mocked for now since AuthContext provides it
                        className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 px-2 py-1 ${language === "es" ? "text-neon-cyan shadow-neon-sm" : "text-muted-foreground/50 hover:text-white"}`}
                    >
                        ES
                    </button>
                </div>

                <div className="flex flex-col items-center pt-4 sm:pt-0">
                    <div className="flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-[1.5rem] sm:rounded-[2rem] bg-white text-black ring-4 ring-neon-cyan shadow-neon-cyan-sm overflow-hidden mb-8 sm:mb-12">
                        <img src="/logo.png" className="h-full w-full object-cover" alt="Congratss Logo" />
                    </div>

                    <div className="inline-flex items-center px-4 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-[10px] font-bold uppercase tracking-[0.4em] text-neon-cyan mb-6">
                        {t.welcome_back}
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter italic leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Congratss
                    </h1>
                </div>

                <div className="space-y-4 pt-8">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm font-bold transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
                        {t.continue_with_google}
                    </button>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{t.or}</span>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-3">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="email"
                                placeholder={t.email_placeholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 transition-all"
                            />
                        </div>
                        <input
                            type="password"
                            placeholder={t.password_placeholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all"
                        />
                        <button
                            disabled={loading}
                            className="w-full rounded-2xl bg-white py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ACCESS PORTAL"}
                        </button>
                    </form>
                </div>

                <p className="text-[10px] text-muted-foreground/60 leading-relaxed px-4">
                    {t.terms_privacy}
                </p>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-muted-foreground">
                        {language === 'es' ? '¿no tienes cuenta?' : "don't have an account?"} {' '}
                        <button
                            onClick={() => router.push('/auth')}
                            className="text-neon-cyan font-black hover:underline uppercase tracking-widest"
                        >
                            {language === 'es' ? 'REGÍSTRATE' : 'SIGN UP'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
