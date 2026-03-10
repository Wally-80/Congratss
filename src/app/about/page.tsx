"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageCloseButton from "@/components/PageCloseButton";

export default function AboutPage() {
    const { language } = useAuth();
    const isEs = language === "es";

    return (
        <main className="relative min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] px-6 pt-20 sm:pt-8 pb-8 sm:px-10">
            <PageCloseButton className="fixed top-[max(1rem,env(safe-area-inset-top))] right-6 sm:right-10 z-30" />
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Congratss</p>
                    <h1 className="text-3xl font-bold">{isEs ? "Sobre Esta App" : "About This App"}</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Congratss te ayuda a recordar fechas importantes, ver dias restantes y enviar felicitaciones rapidamente desde un solo lugar."
                            : "Congratss helps people remember important dates, see countdown days, and send greetings quickly from one place."}
                    </p>
                </header>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Que Puedes Hacer" : "What You Can Do"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "Crear y administrar celebraciones en un solo panel." : "Create and manage celebrations in one dashboard."}</li>
                        <li>{isEs ? "Ver cuantos dias faltan para cada celebracion." : "See how many countdown days are left before each celebration."}</li>
                        <li>{isEs ? "Usar vista de calendario mensual para planificar eventos." : "Use month calendar view to plan upcoming events."}</li>
                        <li>{isEs ? "Enviar tarjetas y mensajes rapidos en pocos toques." : "Send greeting cards and quick messages in a few taps."}</li>
                        <li>{isEs ? "Programar envios automaticos por WhatsApp, Email o SMS para fecha y hora futura." : "Schedule automatic sends via WhatsApp, Email, or SMS for a future date and time."}</li>
                        <li>{isEs ? "Elegir modo claro/oscuro y preferencias de idioma." : "Choose light or dark mode and language preferences."}</li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Direccion del Producto" : "Product Direction"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Esta app web se esta preparando para futura distribucion en App Store y Play Store, manteniendo un flujo rapido y limpio."
                            : "This web app is being prepared for future App Store and Play Store distribution with the same clean, fast celebration workflow."}
                    </p>
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
