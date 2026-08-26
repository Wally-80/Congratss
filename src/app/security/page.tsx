"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageCloseButton from "@/components/PageCloseButton";
import {
    APP_DBA,
    LEGAL_CONTACT_EMAIL,
    LEGAL_ENTITY,
    LEGAL_LAST_UPDATED_EN,
    LEGAL_LAST_UPDATED_ES,
} from "@/lib/legal";

export default function SecurityPage() {
    const { language } = useAuth();
    const isEs = language === "es";

    return (
        <main className="relative min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] px-6 pt-20 sm:pt-8 pb-8 sm:px-10">
            <PageCloseButton className="fixed top-[max(1rem,env(safe-area-inset-top))] right-6 sm:right-10 z-30" />
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">{APP_DBA}</p>
                    <h1 className="text-3xl font-bold">{isEs ? "Seguridad" : "Security"}</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs ? `Actualizado: ${LEGAL_LAST_UPDATED_ES}` : `Last updated: ${LEGAL_LAST_UPDATED_EN}`}
                    </p>
                </header>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Como Protegemos tus Datos" : "How We Protect Your Data"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>
                            {isEs
                                ? "Todo el trafico entre tu dispositivo y el Servicio viaja cifrado por HTTPS/TLS."
                                : "All traffic between your device and the Service is encrypted in transit over HTTPS/TLS."}
                        </li>
                        <li>
                            {isEs
                                ? "Los datos se almacenan en Google Firebase (Firestore y Cloud Storage), que cifra los datos en reposo en la infraestructura de Google Cloud."
                                : "Data is stored in Google Firebase (Firestore and Cloud Storage), which encrypts data at rest on Google Cloud infrastructure."}
                        </li>
                        <li>
                            {isEs
                                ? "Las cuentas usan Firebase Authentication con verificacion de correo obligatoria antes del primer inicio de sesion."
                                : "Accounts use Firebase Authentication with mandatory email verification before first sign-in."}
                        </li>
                        <li>
                            {isEs
                                ? "Reglas de seguridad de Firestore y Storage limitan el acceso: cada usuario solo puede leer y escribir sus propios datos."
                                : "Firestore and Storage security rules enforce access control: each user can only read and write their own data."}
                        </li>
                        <li>
                            {isEs
                                ? "No almacenamos contrasenas directamente; la gestion de credenciales la realiza Firebase Authentication."
                                : "We never store passwords directly; credential handling is performed by Firebase Authentication."}
                        </li>
                        <li>
                            {isEs
                                ? "No procesamos ni almacenamos datos de pago."
                                : "We do not process or store any payment data."}
                        </li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Tu Parte" : "Your Part"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>
                            {isEs
                                ? "Usa una contrasena unica y fuerte para tu cuenta y no la compartas."
                                : "Use a strong, unique password for your account and do not share it."}
                        </li>
                        <li>
                            {isEs
                                ? "Manten tu dispositivo y navegador actualizados."
                                : "Keep your device and browser up to date."}
                        </li>
                        <li>
                            {isEs
                                ? "Si sospechas acceso no autorizado a tu cuenta, restablece tu contrasena de inmediato y avisanos."
                                : "If you suspect unauthorized access to your account, reset your password immediately and let us know."}
                        </li>
                    </ul>
                </section>

                <section className="glass-card premium-border p-6 space-y-3 border border-amber-400/40 bg-amber-500/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                        {isEs ? "Aviso de Beta" : "Beta Notice"}
                    </p>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `${APP_DBA} esta en fase beta. Aunque aplicamos las practicas descritas arriba, el software en beta puede contener defectos. Evita guardar en el Servicio informacion sensible que no estarias dispuesto a perder o exponer, y manten copias propias de fechas y mensajes importantes.`
                            : `${APP_DBA} is in beta. While we apply the practices described above, beta software can contain defects. Avoid storing sensitive information in the Service that you could not afford to lose or expose, and keep your own copies of important dates and messages.`}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Reporte Responsable de Vulnerabilidades" : "Responsible Disclosure"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `Si crees haber encontrado una vulnerabilidad de seguridad en ${APP_DBA}, reportala de forma privada a ${LEGAL_CONTACT_EMAIL} con los pasos para reproducirla. Te pedimos no acceder a datos de otros usuarios, no degradar el Servicio y darnos un tiempo razonable para corregir el problema antes de divulgarlo. Agradecemos los reportes de buena fe.`
                            : `If you believe you have found a security vulnerability in ${APP_DBA}, please report it privately to ${LEGAL_CONTACT_EMAIL} with steps to reproduce. We ask that you do not access other users' data, do not degrade the Service, and give us a reasonable time to fix the issue before any disclosure. Good-faith reports are appreciated.`}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Contacto" : "Contact"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `Preguntas de seguridad: ${LEGAL_ENTITY} (DBA ${APP_DBA}), ${LEGAL_CONTACT_EMAIL}.`
                            : `Security questions: ${LEGAL_ENTITY} (DBA ${APP_DBA}), ${LEGAL_CONTACT_EMAIL}.`}
                    </p>
                </section>

                <div className="pt-2 flex flex-wrap gap-3">
                    <Link
                        href="/terms"
                        className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {isEs ? "Terminos de Servicio" : "Terms of Service"}
                    </Link>
                    <Link
                        href="/privacy"
                        className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {isEs ? "Politica de Privacidad" : "Privacy Policy"}
                    </Link>
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
