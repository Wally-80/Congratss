"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageCloseButton from "@/components/PageCloseButton";

export default function PrivacyPage() {
    const { language } = useAuth();
    const isEs = language === "es";

    return (
        <main className="relative min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] px-6 py-8 sm:px-10">
            <PageCloseButton className="fixed top-[max(1rem,env(safe-area-inset-top))] right-6 sm:right-10 z-30" />
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Congratss</p>
                    <h1 className="text-3xl font-bold">{isEs ? "Politica de Privacidad" : "Privacy Policy"}</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs ? "Actualizado: 26 de febrero de 2026" : "Last updated: February 26, 2026"}
                    </p>
                </header>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Datos que Guardamos" : "Data We Store"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "Datos de cuenta de Firebase Auth (email, ID de usuario, proveedor)." : "Account data from Firebase Auth (email, user ID, provider)."}</li>
                        <li>{isEs ? "Tus celebraciones (titulo, fecha, tipo y etiqueta personalizada opcional)." : "Your celebration records (title, date, type, and optional custom label)."}</li>
                        <li>{isEs ? "Preferencias de la app (idioma y notificaciones)." : "Your app preferences (language, notifications setting)."}</li>
                        <li>{isEs ? "Imagenes opcionales que subes para enviar tarjetas." : "Optional images you upload for greeting cards."}</li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Datos que No Recolectamos" : "Data We Do Not Collect"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "No recolectamos datos de tarjeta o banca." : "No payment card or banking information."}</li>
                        <li>{isEs ? "No recolectamos ubicacion GPS precisa." : "No precise GPS location data."}</li>
                        <li>{isEs ? "No recolectamos datos de salud, ID de gobierno o biometria." : "No health, government ID, or biometric data."}</li>
                        <li>{isEs ? "No usamos SDKs de analitica de terceros en esta app." : "No third-party analytics SDKs in this app."}</li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Seguridad" : "Security"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "La app usa hosting HTTPS, Firebase Authentication y reglas de acceso en Firestore y Storage para limitar quien puede leer o escribir datos."
                            : "The app uses HTTPS hosting, Firebase Authentication, and access rules for Firestore and Storage to limit who can read or write data."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Tu Control" : "Your Control"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Puedes editar o eliminar tus celebraciones dentro de la app en cualquier momento."
                            : "You can edit or delete your celebrations inside the app at any time."}
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
