"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageCloseButton from "@/components/PageCloseButton";

export default function DeleteAccountPage() {
    const { language } = useAuth();
    const isEs = language === "es";

    return (
        <main className="relative min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] px-6 py-8 sm:px-10">
            <PageCloseButton className="fixed top-[max(1rem,env(safe-area-inset-top))] right-6 sm:right-10 z-30" />
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Congratss</p>
                    <h1 className="text-3xl font-bold">{isEs ? "Eliminar Cuenta" : "Delete Account"}</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs ? "Ultima actualizacion: 6 de marzo de 2026" : "Last updated: March 6, 2026"}
                    </p>
                </header>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Como Solicitarlo" : "How to Request Deletion"}</h2>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "Escribe a walterrpom@gmail.com desde el email asociado a tu cuenta." : "Email walterrpom@gmail.com from the email address associated with your account."}</li>
                        <li>{isEs ? "Usa el asunto: Delete Congratss Account." : "Use the subject line: Delete Congratss Account."}</li>
                        <li>{isEs ? "Incluye el email de tu cuenta y confirma que quieres eliminarla por completo." : "Include your account email and confirm that you want the account fully deleted."}</li>
                    </ol>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Que Se Elimina" : "What Gets Deleted"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "Tu cuenta de autenticacion de Congratss." : "Your Congratss authentication account."}</li>
                        <li>{isEs ? "Tus celebraciones y preferencias guardadas." : "Your saved celebrations and preferences."}</li>
                        <li>{isEs ? "Tus mensajes programados guardados." : "Your saved scheduled messages."}</li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Retencion" : "Retention"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Normalmente procesamos solicitudes completas de eliminacion dentro de 30 dias. Si la ley exige conservar datos limitados por mas tiempo, te lo informaremos."
                            : "We normally process complete deletion requests within 30 days. If limited data must be kept longer for legal reasons, we will tell you."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Ayuda" : "Need Help?"}</h2>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <a
                            href="mailto:walterrpom@gmail.com?subject=Delete%20Congratss%20Account"
                            className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 font-semibold text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            walterrpom@gmail.com
                        </a>
                        <Link
                            href="/support"
                            className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            {isEs ? "Soporte" : "Support"}
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
