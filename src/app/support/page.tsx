"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageCloseButton from "@/components/PageCloseButton";

export default function SupportPage() {
    const { language } = useAuth();
    const isEs = language === "es";

    return (
        <main className="relative min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] px-6 py-8 sm:px-10">
            <PageCloseButton className="fixed top-[max(1rem,env(safe-area-inset-top))] right-6 sm:right-10 z-30" />
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Congratss</p>
                    <h1 className="text-3xl font-bold">{isEs ? "Soporte" : "Support"}</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs ? "Ultima actualizacion: 6 de marzo de 2026" : "Last updated: March 6, 2026"}
                    </p>
                </header>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Contacto" : "Contact"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Para ayuda con tu cuenta, errores, comentarios o solicitudes de eliminacion, escribenos a:"
                            : "For help with your account, bugs, feedback, or deletion requests, contact us at:"}
                    </p>
                    <a
                        href="mailto:walterrpom@gmail.com?subject=Congratss%20Support"
                        className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        walterrpom@gmail.com
                    </a>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Que Incluir" : "What to Include"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "El email de tu cuenta de Congratss." : "The email address used for your Congratss account."}</li>
                        <li>{isEs ? "Tu dispositivo y navegador o plataforma." : "Your device and browser or platform."}</li>
                        <li>{isEs ? "Pasos para reproducir el problema." : "Steps to reproduce the issue."}</li>
                        <li>{isEs ? "Capturas de pantalla si ayudan a explicar el problema." : "Screenshots if they help explain the problem."}</li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Enlaces Legales" : "Legal Links"}</h2>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <Link
                            href="/privacy"
                            className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            {isEs ? "Privacidad" : "Privacy Policy"}
                        </Link>
                        <Link
                            href="/delete-account"
                            className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            {isEs ? "Eliminar Cuenta" : "Delete Account"}
                        </Link>
                    </div>
                </section>

                <div className="pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {isEs ? "Volver a la App" : "Back to App"}
                    </Link>
                </div>
            </div>
        </main>
    );
}
