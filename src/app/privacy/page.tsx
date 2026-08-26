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

export default function PrivacyPage() {
    const { language } = useAuth();
    const isEs = language === "es";

    return (
        <main className="relative min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] px-6 pt-20 sm:pt-8 pb-8 sm:px-10">
            <PageCloseButton className="fixed top-[max(1rem,env(safe-area-inset-top))] right-6 sm:right-10 z-30" />
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">{APP_DBA}</p>
                    <h1 className="text-3xl font-bold">{isEs ? "Politica de Privacidad" : "Privacy Policy"}</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs ? `Actualizado: ${LEGAL_LAST_UPDATED_ES}` : `Last updated: ${LEGAL_LAST_UPDATED_EN}`}
                    </p>
                </header>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Quienes Somos" : "Who We Are"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `${APP_DBA} es operado por ${LEGAL_ENTITY}, haciendo negocios como (DBA) "${APP_DBA}". ${LEGAL_ENTITY} es el responsable de los datos personales descritos en esta politica. Puedes contactarnos en ${LEGAL_CONTACT_EMAIL}.`
                            : `${APP_DBA} is operated by ${LEGAL_ENTITY}, doing business as (DBA) "${APP_DBA}". ${LEGAL_ENTITY} is the controller of the personal data described in this policy. You can reach us at ${LEGAL_CONTACT_EMAIL}.`}
                    </p>
                </section>

                <section className="glass-card premium-border p-6 space-y-3 border border-amber-400/40 bg-amber-500/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                        {isEs ? "Aviso de Beta" : "Beta Notice"}
                    </p>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `${APP_DBA} se encuentra actualmente en fase beta de prueba. Los datos guardados durante la beta pueden restablecerse o eliminarse a medida que el producto evoluciona. Consulta los Terminos de Servicio para mas detalles.`
                            : `${APP_DBA} is currently in beta testing. Data saved during the beta may be reset or deleted as the product evolves. See the Terms of Service for details.`}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Datos que Guardamos" : "Data We Store"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "Datos de cuenta de Firebase Auth (email, ID de usuario, proveedor)." : "Account data from Firebase Auth (email, user ID, provider)."}</li>
                        <li>{isEs ? "Tus celebraciones (titulo, fecha, tipo y etiqueta personalizada opcional)." : "Your celebration records (title, date, type, and optional custom label)."}</li>
                        <li>{isEs ? "Tus preferencias de la app y perfil (idioma, recordatorios, onboarding y datos de perfil opcionales)." : "Your app preferences and profile data (language, reminders, onboarding state, and optional profile data)."}</li>
                        <li>{isEs ? "Tus envios programados (canal, destinatario, mensaje, tarjeta, enlace y hora programada)." : "Your scheduled deliveries (channel, recipient, message, card, link, and scheduled time)."}</li>
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
                    <h2 className="text-lg font-semibold">{isEs ? "Datos que Se Quedan en Tu Dispositivo" : "Data That Stays on Your Device"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>{isEs ? "Las imagenes locales que eliges para compartir en la app permanecen en tu dispositivo a menos que tu mismo las compartas." : "Local images you choose in the share flow stay on your device unless you explicitly share them."}</li>
                        <li>{isEs ? "El navegador puede guardar idioma, estado de onboarding, cache del service worker y claves locales para evitar recordatorios duplicados." : "Your browser may store language, onboarding state, service worker cache, and local keys used to avoid duplicate reminders."}</li>
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
                    <h2 className="text-lg font-semibold">{isEs ? "Retencion y Eliminacion" : "Retention and Deletion"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Puedes editar o eliminar tus celebraciones dentro de la app en cualquier momento. Si solicitas eliminacion de cuenta, eliminamos la cuenta y los datos asociados que no estemos obligados legalmente a conservar."
                            : "You can edit or delete your celebrations inside the app at any time. If you request account deletion, we delete the account and associated data that we are not legally required to retain."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Proveedores de Terceros" : "Third-Party Processors"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Usamos Google Firebase (Authentication, Firestore, Cloud Storage, Hosting y Cloud Messaging) para operar el Servicio. Firebase procesa datos en nuestro nombre conforme a las politicas de privacidad y seguridad de Google. No vendemos tus datos personales ni los compartimos con terceros para publicidad."
                            : "We use Google Firebase (Authentication, Firestore, Cloud Storage, Hosting, and Cloud Messaging) to operate the Service. Firebase processes data on our behalf under Google's privacy and security policies. We do not sell your personal data or share it with third parties for advertising."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Menores de Edad" : "Children's Privacy"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "El Servicio no esta dirigido a menores de 13 anos y no recolectamos conscientemente datos de ellos. Si crees que un menor nos proporciono datos personales, contactanos y los eliminaremos."
                            : "The Service is not directed to children under 13, and we do not knowingly collect data from them. If you believe a child has provided us personal data, contact us and we will delete it."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "Cambios y Contacto" : "Changes and Contact"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `Podemos actualizar esta politica a medida que el Servicio evolucione; publicaremos la version vigente en esta pagina con su fecha de actualizacion. Preguntas o solicitudes de privacidad (acceso, correccion o eliminacion de datos): ${LEGAL_ENTITY} (DBA ${APP_DBA}), ${LEGAL_CONTACT_EMAIL}.`
                            : `We may update this policy as the Service evolves; the current version will always be posted on this page with its 'Last updated' date. Privacy questions or requests (data access, correction, or deletion): ${LEGAL_ENTITY} (DBA ${APP_DBA}), ${LEGAL_CONTACT_EMAIL}.`}
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
                        href="/security"
                        className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {isEs ? "Seguridad" : "Security"}
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
