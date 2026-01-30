import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { calculateCountdown } from "@/lib/dateUtils";

export interface Celebration {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    rawDate: string; // Storing the ISO string for editing
    percentage: number;
    type: "birthday" | "anniversary";
    userId: string;
}

export const useCelebrations = () => {
    const { user } = useAuth();
    const [celebrations, setCelebrations] = useState<Celebration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setCelebrations([]);
            setLoading(false);
            return;
        }

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

    const addCelebration = async (data: { title: string, rawDate: string, type: string }) => {
        if (!user) return;
        const nowISO = new Date().toISOString();
        const { daysLeft, percentage, formattedDate } = calculateCountdown(data.rawDate, nowISO);

        try {
            await addDoc(collection(db, "celebrations"), {
                ...data,
                daysLeft,
                percentage,
                date: formattedDate,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        } catch (err: any) {
            console.error("Error adding celebration:", err);
            throw err;
        }
    };

    const updateCelebration = async (id: string, data: { title: string, rawDate: string, type: string }) => {
        if (!user) return;

        // When updating, we don't easily have the original createdAt here unless we fetch or it's passed.
        // For simplicity, we'll just recalculate. Recurring events don't use it anyway.
        const { daysLeft, percentage, formattedDate } = calculateCountdown(data.rawDate);

        try {
            const ref = doc(db, "celebrations", id);
            await updateDoc(ref, {
                ...data,
                daysLeft,
                percentage,
                date: formattedDate,
                updatedAt: serverTimestamp(),
            });
        } catch (err: any) {
            console.error("Error updating celebration:", err);
            throw err;
        }
    };

    const deleteCelebration = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "celebrations", id));
        } catch (err: any) {
            console.error("Error deleting celebration:", err);
            throw err;
        }
    };

    return { celebrations, loading, error, addCelebration, updateCelebration, deleteCelebration };
};
