import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { calculateCountdown } from "@/lib/dateUtils";

export type CelebrationType =
    | "birthday"
    | "anniversary"
    | "retirement"
    | "graduation"
    | "baby_shower"
    | "wedding"
    | "get_well_soon"
    | "house_warming"
    | "custom";

export interface Celebration {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    rawDate: string; // Storing the ISO string for editing
    percentage: number;
    type: CelebrationType;
    customTypeLabel?: string;
    userId: string;
}

export const useCelebrations = () => {
    const { user } = useAuth();
    const [celebrations, setCelebrations] = useState<Celebration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        // Diagnostic: Removed orderBy to bypass index requirement
        // We will sort manually in the hook for now
        const q = query(
            collection(db, "celebrations"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const docData = doc.data();

                // Convert Firestore Timestamp to ISO string if it exists
                const createdAtISO = docData.createdAt?.toDate?.()?.toISOString() ||
                    (docData.createdAt instanceof Date ? docData.createdAt.toISOString() : undefined);

                // Fallback to .date if .rawDate is missing (for legacy data)
                const { daysLeft, percentage, formattedDate } = calculateCountdown(
                    docData.rawDate || docData.date,
                    createdAtISO
                );

                return {
                    id: doc.id,
                    ...docData,
                    daysLeft,
                    percentage,
                    date: formattedDate
                };
            }) as Celebration[];

            const sortedData = data.sort((a, b) => a.daysLeft - b.daysLeft);
            setCelebrations(sortedData);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Firestore onSnapshot error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addCelebration = async (data: { title: string, rawDate: string, type: CelebrationType, customTypeLabel?: string }) => {
        if (!user) return;
        const nowISO = new Date().toISOString();
        const { daysLeft, percentage, formattedDate } = calculateCountdown(data.rawDate, nowISO);
        const payload = {
            title: data.title,
            rawDate: data.rawDate,
            type: data.type,
            ...(typeof data.customTypeLabel === "string" ? { customTypeLabel: data.customTypeLabel } : {}),
        };

        try {
            await addDoc(collection(db, "celebrations"), {
                ...payload,
                daysLeft,
                percentage,
                date: formattedDate,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        } catch (err: unknown) {
            console.error("Error adding celebration:", err);
            throw err;
        }
    };

    const updateCelebration = async (id: string, data: { title: string, rawDate: string, type: CelebrationType, customTypeLabel?: string }) => {
        if (!user) return;

        // When updating, we don't easily have the original createdAt here unless we fetch or it's passed.
        // For simplicity, we'll just recalculate. Recurring events don't use it anyway.
        const { daysLeft, percentage, formattedDate } = calculateCountdown(data.rawDate);
        const payload = {
            title: data.title,
            rawDate: data.rawDate,
            type: data.type,
            ...(typeof data.customTypeLabel === "string" ? { customTypeLabel: data.customTypeLabel } : {}),
        };

        try {
            const ref = doc(db, "celebrations", id);
            await updateDoc(ref, {
                ...payload,
                daysLeft,
                percentage,
                date: formattedDate,
                updatedAt: serverTimestamp(),
            });
        } catch (err: unknown) {
            console.error("Error updating celebration:", err);
            throw err;
        }
    };

    const deleteCelebration = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "celebrations", id));
        } catch (err: unknown) {
            console.error("Error deleting celebration:", err);
            throw err;
        }
    };

    return {
        celebrations: user ? celebrations : [],
        loading: user ? loading : false,
        error: user ? error : null,
        addCelebration,
        updateCelebration,
        deleteCelebration
    };
};
