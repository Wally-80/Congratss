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
            <div className="glass w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white text-black neon-glow-purple overflow-hidden mb-12">
                        <img src="/logo.png" className="h-full w-full object-cover" alt="Congratss Logo" />
                    </div>

                    <h1 className="text-5xl font-black tracking-tighter italic leading-tight mb-8">Congratss</h1>

                    <p className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground leading-none">{t.welcome_back}</p>
                </div>

                <div className="space-y-4 pt-4">
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
                                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            />
                        </div>
                        <input
                            type="password"
                            placeholder={t.password_placeholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        />
                        <button
                            disabled={loading}
                            className="w-full rounded-2xl bg-white py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.sign_in}
                        </button>
                    </form>
                </div>

                <p className="text-[10px] text-muted-foreground/60 leading-relaxed px-4">
                    {t.terms_privacy}
                </p>
            </div>
        </div>
    );
}
