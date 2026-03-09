"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { auth } from "@/lib/firebase";
import { Language, translations } from "@/lib/translations";
import { getAvatarUrl, getRandomAvatar } from "@/lib/avatars";
import Logo from "@/components/Logo";
import PageCloseButton from "@/components/PageCloseButton";
import Fireworks from "@/components/Fireworks";

type LoadingMode = null | "sign-in" | "sign-up" | "password-reset";
type ErrorContext = "sign-in" | "sign-up" | "password-reset";

const formatAuthError = (error: unknown, language: Language, context: ErrorContext) => {
    const fallbackMessage = language === "es"
        ? "No se pudo completar la autenticacion."
        : "Could not complete authentication.";

    if (!(error instanceof FirebaseError)) {
        return fallbackMessage;
    }

    switch (error.code) {
        case "auth/invalid-email":
            return language === "es" ? "Correo invalido." : "Invalid email address.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return language === "es" ? "Credenciales invalidas." : "Invalid credentials.";
        case "auth/email-already-in-use":
            return language === "es"
                ? "Ese correo ya esta registrado. Inicia sesion en su lugar."
                : "That email is already registered. Please sign in instead.";
        case "auth/weak-password":
            return language === "es"
                ? "La contrasena es muy debil. Usa al menos 6 caracteres."
                : "Password is too weak. Use at least 6 characters.";
        case "auth/operation-not-allowed":
            if (context === "password-reset") {
                return language === "es"
                    ? "Reset de contrasena no esta habilitado. Activa Email/Password en Firebase Auth."
                    : "Password reset is not enabled. Enable Email/Password in Firebase Auth.";
            }
            return language === "es"
                ? "Email/Password no esta habilitado. Activalo en Firebase Auth."
                : "Email/Password auth is not enabled. Enable it in Firebase Auth.";
        case "auth/too-many-requests":
            return language === "es"
                ? "Demasiados intentos. Espera un momento e intenta de nuevo."
                : "Too many attempts. Please wait and try again.";
        default:
            return error.message || fallbackMessage;
    }
};

export default function AuthPage() {
    const { user, loading, language, setLanguage, updateUserProfile } = useAuth();
    const { theme } = useTheme();
    const t = translations[language];
    const isDarkMode = theme === "dark";
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loadingMode, setLoadingMode] = useState<LoadingMode>(null);

    const copy = language === "es"
        ? {
            signInButton: "Entrar",
            signUpButton: "Crear cuenta",
            signingIn: "Entrando...",
            signingUp: "Creando cuenta...",
            sendingReset: "Enviando reset...",
            verifyPopup: "Cuenta creada. Revisa tu correo y confirma el magic link para activar tu cuenta.",
            verifyBeforeLogin: "Tu correo no esta verificado. Te enviamos un magic link para confirmarlo.",
            resetPassword: "Reset password",
            resetPasswordSent: "Se envio un email para resetear tu contrasena.",
        }
        : {
            signInButton: "Sign in",
            signUpButton: "Create account",
            signingIn: "Signing in...",
            signingUp: "Creating account...",
            sendingReset: "Sending reset...",
            verifyPopup: "Account created. Check your email and confirm the magic link to activate your account.",
            verifyBeforeLogin: "Your email is not verified. We sent a magic link to confirm it.",
            resetPassword: "Reset password",
            resetPasswordSent: "Password reset email sent.",
        };

    const actionCodeUrl = useMemo(() => {
        const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
        const baseUrl = configuredUrl && configuredUrl.length > 0
            ? configuredUrl
            : (typeof window !== "undefined" ? window.location.origin : "");
        const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
        return `${normalizedBaseUrl}/auth`;
    }, []);

    useEffect(() => {
        if (loading) return;
        if (user && user.emailVerified) {
            router.replace("/");
        }
    }, [loading, router, user]);

    const panelToneClass = isDarkMode
        ? "sm:bg-black/45 sm:border-white/10"
        : "sm:bg-white/95 sm:border-slate-200 sm:shadow-[0_25px_65px_-35px_rgba(15,23,42,0.55)]";

    const inputToneClass = isDarkMode
        ? "bg-[var(--app-bg)] border-[var(--glass-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:bg-white/10"
        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setInfo("");
        setLoadingMode(isLogin ? "sign-in" : "sign-up");

        try {
            auth.languageCode = language;
            if (isLogin) {
                const credential = await signInWithEmailAndPassword(auth, email, password);
                if (!credential.user.emailVerified) {
                    await sendEmailVerification(credential.user, { url: actionCodeUrl });
                    await signOut(auth);
                    setError(copy.verifyBeforeLogin);
                    return;
                }
                router.replace("/");
                return;
            }

            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const avatar = getRandomAvatar();
            await updateUserProfile("Congratss User", getAvatarUrl(avatar));
            await sendEmailVerification(credential.user, { url: actionCodeUrl });
            await signOut(auth);
            if (typeof window !== "undefined") {
                localStorage.setItem("gratzz_force_onboarding_once", "1");
                window.alert(copy.verifyPopup);
            }
            setInfo(copy.verifyPopup);
            setIsLogin(true);
            setPassword("");
        } catch (authError) {
            setError(formatAuthError(authError, language, isLogin ? "sign-in" : "sign-up"));
        } finally {
            setLoadingMode(null);
        }
    };

    const handleResetPassword = async () => {
        setError("");
        setInfo("");
        setLoadingMode("password-reset");

        try {
            auth.languageCode = language;
            let targetEmail = email.trim();
            if (!targetEmail && typeof window !== "undefined") {
                targetEmail = (window.prompt("Enter your email:") || "").trim();
            }
            if (!targetEmail) {
                setError(formatAuthError(new FirebaseError("auth/invalid-email", "Invalid email"), language, "password-reset"));
                return;
            }

            await sendPasswordResetEmail(auth, targetEmail, { url: actionCodeUrl });
            setInfo(copy.resetPasswordSent);
        } catch (authError) {
            setError(formatAuthError(authError, language, "password-reset"));
        } finally {
            setLoadingMode(null);
        }
    };

    const isBusy = loadingMode !== null;
    const submitLabel = loadingMode === "sign-in"
        ? copy.signingIn
        : loadingMode === "sign-up"
            ? copy.signingUp
            : loadingMode === "password-reset"
                ? copy.sendingReset
                : isLogin
                    ? copy.signInButton
                    : copy.signUpButton;

    return (
        <div className="min-h-[100dvh] flex items-center justify-center p-0 sm:p-4 pt-[max(0rem,env(safe-area-inset-top))] pb-[max(0rem,env(safe-area-inset-bottom))] relative">
            <Fireworks mode="elegant" className="z-0 opacity-65" disableOnMobile={true} maxRuntimeMs={6000} />
            <div className={`glass-pane z-10 w-full max-w-md p-10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden premium-border h-[100dvh] sm:h-auto pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:py-10 ${panelToneClass}`}>
                <PageCloseButton className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20" />
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

                {info && (
                    <div className={`mb-6 w-full p-4 border rounded-2xl text-xs text-center animate-in fade-in zoom-in duration-300 ${isDarkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                        {info}
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
                            disabled={isBusy}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--app-text-dim)] ml-2">{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border rounded-2xl py-4 px-5 text-sm focus:outline-none focus:border-neon-cyan/50 transition-all duration-300 shadow-inner ${inputToneClass}`}
                            placeholder="********"
                            required
                            disabled={isBusy}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isBusy}
                        className="w-full relative group disabled:cursor-not-allowed"
                    >
                        <div className={`absolute inset-0 bg-neon-cyan blur-md transition-opacity duration-300 rounded-2xl ${isDarkMode ? "opacity-20 group-hover:opacity-40" : "opacity-15 group-hover:opacity-30"}`} />
                        <div className="relative bg-[var(--app-text)] text-[var(--app-bg)] font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-neon-cyan transition-all duration-300 active:scale-[0.98] disabled:opacity-60">
                            <span className="uppercase tracking-widest text-xs">{submitLabel}</span>
                        </div>
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={isBusy}
                    className={`mt-4 text-[10px] uppercase tracking-widest font-black transition-colors ${isDarkMode ? "text-[var(--app-text-dim)]/70 hover:text-neon-cyan" : "text-slate-500 hover:text-cyan-600"} disabled:opacity-50`}
                >
                    {copy.resetPassword}
                </button>

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
                            Espanol
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
                        <span className="text-[var(--app-text-dim)]/20">|</span>
                        <Link href="/support" className="text-[var(--app-text-dim)]/60 hover:text-[var(--app-text)] transition-colors">
                            {t.support}
                        </Link>
                        <span className="text-[var(--app-text-dim)]/20">|</span>
                        <Link href="/delete-account" className="text-[var(--app-text-dim)]/60 hover:text-[var(--app-text)] transition-colors">
                            {t.delete_account}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
