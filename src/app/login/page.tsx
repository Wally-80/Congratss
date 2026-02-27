"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Mail, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/translations';
import Logo from '@/components/Logo';
import PageCloseButton from '@/components/PageCloseButton';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { language, setLanguage } = useAuth();
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
        <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-background pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="glass w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-700 bg-black/40 border border-white/10 ring-1 ring-neon-cyan/20 relative">
                <PageCloseButton className="absolute top-4 right-4 z-20" />


                <Logo size="xl" className="mb-4" />

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

                <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest">
                    <Link href="/about" className="text-muted-foreground/60 hover:text-white transition-colors">
                        {t.about_app}
                    </Link>
                    <span className="text-white/10">|</span>
                    <Link href="/privacy" className="text-muted-foreground/60 hover:text-white transition-colors">
                        {t.privacy_policy}
                    </Link>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        {language === 'es' ? '¿no tienes cuenta?' : "don't have an account?"} {' '}
                        <button
                            onClick={() => router.push('/auth')}
                            className="text-neon-cyan font-black hover:underline uppercase tracking-widest"
                        >
                            {language === 'es' ? 'REGÍSTRATE' : 'SIGN UP'}
                        </button>
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "en" ? "text-neon-cyan shadow-neon-sm" : "text-muted-foreground/40 hover:text-white"}`}
                        >
                            English
                        </button>
                        <span className="text-white/10 text-[10px]">|</span>
                        <button
                            onClick={() => setLanguage("es")}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${language === "es" ? "text-neon-cyan shadow-neon-sm" : "text-muted-foreground/40 hover:text-white"}`}
                        >
                            Español
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
