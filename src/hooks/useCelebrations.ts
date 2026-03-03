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
    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return;

        // Diagnostic: Removed orderBy to bypass index requirement
        // We will sort manually in the hook for now
        const q = query(
            collection(db, "celebrations"),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const docData = doc.data();

                // Fallback to .date if .rawDate is missing (for legacy data)
                const { daysLeft, percentage, formattedDate } = calculateCountdown(docData.rawDate || docData.date);

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
    }, [userId]);

    const addCelebration = async (data: { title: string, rawDate: string, type: CelebrationType, customTypeLabel?: string }) => {
        if (!userId) return;
        const { daysLeft, percentage, formattedDate } = calculateCountdown(data.rawDate);
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
                userId,
                createdAt: serverTimestamp(),
            });
        } catch (err: unknown) {
            console.error("Error adding celebration:", err);
            throw err;
        }
    };

    const updateCelebration = async (id: string, data: { title: string, rawDate: string, type: CelebrationType, customTypeLabel?: string }) => {
        if (!userId) return;

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
        if (!userId) return;
        try {
            await deleteDoc(doc(db, "celebrations", id));
        } catch (err: unknown) {
            console.error("Error deleting celebration:", err);
            throw err;
        }
    };

    return {
        celebrations: userId ? celebrations : [],
        loading: userId ? loading : false,
        error: userId ? error : null,
        addCelebration,
        updateCelebration,
        deleteCelebration
    };
};
