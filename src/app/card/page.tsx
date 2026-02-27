"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const APP_HOME_URL = "https://congratss.com";

const isSafeImageSource = (value: string) => {
    if (!value) return false;
    if (value.startsWith("/")) return true;
    if (value.startsWith("https://")) return true;
    if (value.startsWith("http://")) return true;
    return false;
};

export default function SharedCardPage() {
    const searchParams = useSearchParams();
    const cardId = searchParams.get("id") ?? "";
    const rawImage = searchParams.get("img") ?? "";

    const [resolvedImage, setResolvedImage] = useState("");
    const [loading, setLoading] = useState(true);

    const fallbackImage = useMemo(() => {
        if (!rawImage) return "";
        return isSafeImageSource(rawImage) ? rawImage : "";
    }, [rawImage]);

    useEffect(() => {
        let alive = true;

        const resolveCard = async () => {
            setLoading(true);

            if (cardId) {
                try {
                    const snap = await getDoc(doc(db, "greeting_cards", cardId));
                    const cardUrl = snap.exists() ? (snap.data().url as string | undefined) : "";
                    if (alive && cardUrl && isSafeImageSource(cardUrl)) {
                        setResolvedImage(cardUrl);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error("Shared card lookup failed:", error);
                }
            }

            if (alive) {
                setResolvedImage(fallbackImage);
                setLoading(false);
            }
        };

        resolveCard();

        return () => {
            alive = false;
        };
    }, [cardId, fallbackImage]);

    return (
        <main className="min-h-[100dvh] bg-[var(--app-bg)] text-[var(--app-text)] px-4 py-8 sm:px-8">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
                <header className="text-center space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Congratss</p>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">A card was shared with you</h1>
                    <p className="text-sm text-[var(--app-text-dim)]">Celebrate more moments at Congratss.</p>
                </header>

                <div className="w-full rounded-3xl border border-[var(--glass-border)] bg-[var(--card-bg)] p-3 sm:p-5 shadow-2xl">
                    {loading ? (
                        <div className="h-72 grid place-items-center rounded-2xl border border-dashed border-[var(--glass-border)] text-[var(--app-text-muted)] text-sm text-center px-6">
                            Loading shared card...
                        </div>
                    ) : resolvedImage ? (
                        <img
                            src={resolvedImage}
                            alt="Shared greeting card"
                            className="w-full h-auto max-h-[72vh] object-contain rounded-2xl"
                        />
                    ) : (
                        <div className="h-72 grid place-items-center rounded-2xl border border-dashed border-[var(--glass-border)] text-[var(--app-text-muted)] text-sm text-center px-6">
                            This shared card link is invalid or expired.
                        </div>
                    )}
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-cyan-400 text-black px-5 py-3 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                >
                    Open Congratss
                </Link>

                <p className="text-[11px] text-[var(--app-text-muted)] text-center">
                    {APP_HOME_URL}
                </p>
            </div>
        </main>
    );
}
