"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageCloseButton from "@/components/PageCloseButton";
import {
    APP_DBA,
    GOVERNING_STATE,
    LEGAL_CONTACT_EMAIL,
    LEGAL_ENTITY,
    LEGAL_LAST_UPDATED_EN,
    LEGAL_LAST_UPDATED_ES,
} from "@/lib/legal";

export default function TermsPage() {
    const { language } = useAuth();
    const isEs = language === "es";

    const governingLawEn = GOVERNING_STATE
        ? `These Terms are governed by the laws of the State of ${GOVERNING_STATE}, United States, without regard to its conflict-of-law principles. Any dispute arising from these Terms or the Service will be resolved in the state or federal courts located in ${GOVERNING_STATE}, and you consent to their jurisdiction.`
        : `These Terms are governed by the laws of the U.S. state in which ${LEGAL_ENTITY} is organized, and applicable United States federal law, without regard to conflict-of-law principles. Any dispute arising from these Terms or the Service will be resolved in the state or federal courts of that state, and you consent to their jurisdiction.`;

    const governingLawEs = GOVERNING_STATE
        ? `Estos Terminos se rigen por las leyes del Estado de ${GOVERNING_STATE}, Estados Unidos, sin considerar sus principios de conflicto de leyes. Cualquier disputa derivada de estos Terminos o del Servicio se resolvera en los tribunales estatales o federales ubicados en ${GOVERNING_STATE}, y aceptas su jurisdiccion.`
        : `Estos Terminos se rigen por las leyes del estado de EE. UU. en el que ${LEGAL_ENTITY} esta organizada, y la ley federal aplicable de los Estados Unidos, sin considerar principios de conflicto de leyes. Cualquier disputa derivada de estos Terminos o del Servicio se resolvera en los tribunales estatales o federales de ese estado, y aceptas su jurisdiccion.`;

    return (
        <main className="relative min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] px-6 pt-20 sm:pt-8 pb-8 sm:px-10">
            <PageCloseButton className="fixed top-[max(1rem,env(safe-area-inset-top))] right-6 sm:right-10 z-30" />
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">{APP_DBA}</p>
                    <h1 className="text-3xl font-bold">{isEs ? "Terminos de Servicio" : "Terms of Service"}</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs ? `Actualizado: ${LEGAL_LAST_UPDATED_ES}` : `Last updated: ${LEGAL_LAST_UPDATED_EN}`}
                    </p>
                </header>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "1. Quienes Somos" : "1. Who We Are"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `${APP_DBA} (el "Servicio") es operado por ${LEGAL_ENTITY}, una compania de responsabilidad limitada de los Estados Unidos, haciendo negocios como (DBA) "${APP_DBA}". En estos Terminos, "nosotros", "nos" y "nuestro" se refieren a ${LEGAL_ENTITY}.`
                            : `${APP_DBA} (the "Service") is operated by ${LEGAL_ENTITY}, a United States limited liability company, doing business as (DBA) "${APP_DBA}". In these Terms, "we", "us", and "our" refer to ${LEGAL_ENTITY}.`}
                    </p>
                </section>

                <section className="glass-card premium-border p-6 space-y-3 border border-amber-400/40 bg-amber-500/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                        {isEs ? "Aviso Importante de Beta" : "Important Beta Notice"}
                    </p>
                    <h2 className="text-lg font-semibold">{isEs ? "2. Version Beta / Pre-Lanzamiento" : "2. Beta / Pre-Release Software"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>
                            {isEs
                                ? `El Servicio se ofrece actualmente como una version BETA con fines de prueba y evaluacion. No es un producto terminado.`
                                : `The Service is currently offered as a BETA release for testing and evaluation purposes. It is not a finished product.`}
                        </li>
                        <li>
                            {isEs
                                ? "El Servicio puede contener errores, comportarse de forma inesperada, dejar de estar disponible sin previo aviso o cambiar sustancialmente entre versiones."
                                : "The Service may contain bugs, behave unexpectedly, become unavailable without notice, or change substantially between releases."}
                        </li>
                        <li>
                            {isEs
                                ? "Los datos guardados durante la beta (celebraciones, mensajes programados, preferencias) pueden retrasarse, entregarse incorrectamente, restablecerse o perderse. No dependas del Servicio como tu unico recordatorio o registro de fechas o mensajes importantes."
                                : "Data saved during the beta (celebrations, scheduled messages, preferences) may be delayed, mis-delivered, reset, or lost. Do not rely on the Service as your only reminder or record of important dates or messages."}
                        </li>
                        <li>
                            {isEs
                                ? "Podemos suspender, limitar o finalizar el programa beta, o cualquier cuenta beta, en cualquier momento y a nuestra sola discrecion."
                                : "We may suspend, limit, or end the beta program, or any beta account, at any time in our sole discretion."}
                        </li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "3. Aceptacion de los Terminos" : "3. Acceptance of These Terms"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Al marcar la casilla de aceptacion, crear una cuenta, iniciar sesion o usar el Servicio, confirmas que has leido, entendido y aceptado estos Terminos y nuestra Politica de Privacidad. Si no estas de acuerdo, no uses el Servicio. Debes tener al menos 13 anos para usar el Servicio, o la edad minima mayor que exija la ley de tu jurisdiccion (por ejemplo, 16 anos en algunos paises del Espacio Economico Europeo). El Servicio no esta dirigido a menores de 13 anos."
                            : "By checking the acceptance box, creating an account, signing in, or using the Service, you confirm that you have read, understood, and agree to these Terms and our Privacy Policy. If you do not agree, do not use the Service. You must be at least 13 years old to use the Service, or any higher minimum age required by the law of your jurisdiction (for example, 16 in some European Economic Area countries). The Service is not directed to children under 13."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "4. Tu Cuenta" : "4. Your Account"}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>
                            {isEs
                                ? "Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad que ocurra bajo tu cuenta."
                                : "You are responsible for keeping your credentials confidential and for all activity that occurs under your account."}
                        </li>
                        <li>
                            {isEs
                                ? "Debes proporcionar informacion veraz y mantenerla actualizada."
                                : "You must provide accurate information and keep it up to date."}
                        </li>
                        <li>
                            {isEs
                                ? "Puedes eliminar tu cuenta en cualquier momento desde la app."
                                : "You may delete your account at any time from within the app."}
                        </li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "5. Uso Aceptable" : "5. Acceptable Use"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs ? "Aceptas no usar el Servicio para:" : "You agree not to use the Service to:"}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--app-text-dim)]">
                        <li>
                            {isEs
                                ? "Enviar spam, mensajes no solicitados, acoso o contenido ilegal, difamatorio o abusivo a cualquier persona."
                                : "Send spam, unsolicited messages, harassment, or unlawful, defamatory, or abusive content to anyone."}
                        </li>
                        <li>
                            {isEs
                                ? "Suplantar a otra persona o entidad, o recopilar datos de otros usuarios."
                                : "Impersonate any person or entity, or harvest data about other users."}
                        </li>
                        <li>
                            {isEs
                                ? "Intentar interrumpir, sobrecargar, aplicar ingenieria inversa o acceder sin autorizacion al Servicio o a su infraestructura."
                                : "Attempt to disrupt, overload, reverse engineer, or gain unauthorized access to the Service or its infrastructure."}
                        </li>
                        <li>
                            {isEs
                                ? "Violar cualquier ley o los derechos de terceros."
                                : "Violate any law or the rights of any third party."}
                        </li>
                    </ul>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "6. Tu Contenido" : "6. Your Content"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Conservas la propiedad del contenido que creas en el Servicio (celebraciones, mensajes, tarjetas). Nos otorgas una licencia limitada, no exclusiva y mundial para almacenar, procesar y transmitir ese contenido unicamente con el fin de operar y mejorar el Servicio. Eres el unico responsable del contenido que envias y de contar con el derecho de enviarlo a sus destinatarios."
                            : "You retain ownership of the content you create in the Service (celebrations, messages, cards). You grant us a limited, non-exclusive, worldwide license to store, process, and transmit that content solely to operate and improve the Service. You are solely responsible for the content you send and for having the right to send it to its recipients."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "7. Servicios de Terceros" : "7. Third-Party Services"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "El Servicio se apoya en proveedores de terceros, incluidos Google Firebase (autenticacion, base de datos, almacenamiento, hosting y notificaciones). El uso de esos servicios esta sujeto ademas a los terminos y politicas de sus proveedores. No somos responsables de interrupciones o fallas causadas por servicios de terceros."
                            : "The Service relies on third-party providers, including Google Firebase (authentication, database, storage, hosting, and notifications). Your use of those services is additionally subject to their providers' terms and policies. We are not responsible for outages or failures caused by third-party services."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "8. Sin Garantias" : "8. Disclaimer of Warranties"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)] uppercase">
                        {isEs
                            ? `El servicio se proporciona "tal cual" y "segun disponibilidad", sin garantias de ningun tipo, expresas o implicitas, incluidas, entre otras, garantias de comerciabilidad, idoneidad para un proposito particular, no infraccion, disponibilidad, exactitud o que el servicio estara libre de errores o interrupciones. Esto aplica con especial enfasis mientras el servicio este en beta.`
                            : `The service is provided "as is" and "as available", without warranties of any kind, express or implied, including without limitation warranties of merchantability, fitness for a particular purpose, non-infringement, availability, accuracy, or that the service will be error-free or uninterrupted. This applies with particular force while the service is in beta.`}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "9. Limitacion de Responsabilidad" : "9. Limitation of Liability"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `En la maxima medida permitida por la ley, ${LEGAL_ENTITY}, sus miembros, gerentes, empleados y agentes no seran responsables de danos indirectos, incidentales, especiales, consecuentes, ejemplares o punitivos, ni de perdida de datos, perdida de beneficios, perdida de buena voluntad, mensajes no entregados o entregados con retraso, o recordatorios omitidos, que surjan de tu uso o imposibilidad de uso del Servicio. En cualquier caso, nuestra responsabilidad total agregada por cualquier reclamo relacionado con el Servicio no excedera el monto que nos hayas pagado por el Servicio en los 12 meses anteriores al reclamo o, si no has pagado nada, cien dolares estadounidenses (USD $100). Algunas jurisdicciones no permiten ciertas limitaciones, por lo que algunas de estas limitaciones podrian no aplicarse a ti.`
                            : `To the maximum extent permitted by law, ${LEGAL_ENTITY}, its members, managers, employees, and agents will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost data, lost profits, loss of goodwill, undelivered or delayed messages, or missed reminders, arising out of your use of or inability to use the Service. In no event will our total aggregate liability for any claims relating to the Service exceed the amount you paid us for the Service in the 12 months before the claim or, if you have paid nothing, one hundred U.S. dollars (USD $100). Some jurisdictions do not allow certain limitations, so some of these limitations may not apply to you.`}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "10. Indemnizacion" : "10. Indemnification"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `Aceptas indemnizar y mantener indemne a ${LEGAL_ENTITY} y a sus miembros, gerentes, empleados y agentes frente a cualquier reclamo, dano, perdida o gasto (incluidos honorarios razonables de abogados) que surja de tu contenido, tu uso del Servicio o tu incumplimiento de estos Terminos o de la ley.`
                            : `You agree to indemnify and hold harmless ${LEGAL_ENTITY} and its members, managers, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising out of your content, your use of the Service, or your violation of these Terms or the law.`}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "11. Terminacion" : "11. Termination"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Podemos suspender o cancelar tu acceso al Servicio en cualquier momento, con o sin causa, especialmente durante el periodo beta. Tras la terminacion, las secciones que por su naturaleza deban subsistir (incluidas las secciones 8, 9 y 10) seguiran vigentes."
                            : "We may suspend or terminate your access to the Service at any time, with or without cause, especially during the beta period. Upon termination, sections that by their nature should survive (including Sections 8, 9, and 10) will continue to apply."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "12. Cambios a estos Terminos" : "12. Changes to These Terms"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? "Podemos actualizar estos Terminos de vez en cuando, en particular a medida que el Servicio evolucione mas alla de la beta. Publicaremos la version actualizada en esta pagina con una nueva fecha de actualizacion y, si el cambio es sustancial, haremos un esfuerzo razonable por avisarte dentro de la app. El uso continuado del Servicio despues de un cambio constituye tu aceptacion de los Terminos actualizados."
                            : "We may update these Terms from time to time, particularly as the Service evolves beyond beta. We will post the updated version on this page with a new 'Last updated' date and, for material changes, make reasonable efforts to notify you in the app. Continued use of the Service after a change constitutes acceptance of the updated Terms."}
                    </p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "13. Ley Aplicable" : "13. Governing Law"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">{isEs ? governingLawEs : governingLawEn}</p>
                </section>

                <section className="glass-card premium-border neon-border-cyan p-6 space-y-3">
                    <h2 className="text-lg font-semibold">{isEs ? "14. Contacto" : "14. Contact"}</h2>
                    <p className="text-sm text-[var(--app-text-dim)]">
                        {isEs
                            ? `Preguntas sobre estos Terminos: ${LEGAL_ENTITY} (DBA ${APP_DBA}), ${LEGAL_CONTACT_EMAIL}.`
                            : `Questions about these Terms: ${LEGAL_ENTITY} (DBA ${APP_DBA}), ${LEGAL_CONTACT_EMAIL}.`}
                    </p>
                </section>

                <div className="pt-2 flex flex-wrap gap-3">
                    <Link
                        href="/privacy"
                        className="inline-flex items-center rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {isEs ? "Politica de Privacidad" : "Privacy Policy"}
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
