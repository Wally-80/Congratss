import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { calculateCountdown, type CelebrationRecurrence } from "@/lib/dateUtils";

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

export type CelebrationReminderTiming =
    | "default"
    | "none"
    | "day_of"
    | "day_before"
    | "week_before"
    | "month_before"
    | "year_before";

export interface Celebration {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    rawDate: string; // Storing the ISO string for editing
    percentage: number;
    type: CelebrationType;
    customTypeLabel?: string;
    recurrence?: CelebrationRecurrence;
    reminderTiming?: CelebrationReminderTiming;
    isPast?: boolean;
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
                const recurrence = (docData.recurrence as CelebrationRecurrence | undefined) ?? "annual";

                // Fallback to .date if .rawDate is missing (for legacy data)
                const { daysLeft, percentage, formattedDate, isPast } = calculateCountdown(docData.rawDate || docData.date, recurrence);

                return {
                    id: doc.id,
                    ...docData,
                    recurrence,
                    daysLeft,
                    percentage,
                    date: formattedDate,
                    isPast,
                };
            }) as Celebration[];

            const sortedData = data.sort((a, b) => {
                if (Boolean(a.isPast) !== Boolean(b.isPast)) {
                    return a.isPast ? 1 : -1;
                }
                return a.daysLeft - b.daysLeft;
            });
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

    const addCelebration = async (data: { title: string, rawDate: string, type: CelebrationType, customTypeLabel?: string, recurrence?: CelebrationRecurrence, reminderTiming?: CelebrationReminderTiming }) => {
        if (!userId) return;
        const recurrence = data.recurrence ?? "annual";
        const { daysLeft, percentage, formattedDate, isPast } = calculateCountdown(data.rawDate, recurrence);
        const payload = {
            title: data.title,
            rawDate: data.rawDate,
            type: data.type,
            ...(typeof data.customTypeLabel === "string" ? { customTypeLabel: data.customTypeLabel } : {}),
            recurrence,
            ...(typeof data.reminderTiming === "string" ? { reminderTiming: data.reminderTiming } : {}),
        };

        try {
            await addDoc(collection(db, "celebrations"), {
                ...payload,
                daysLeft,
                percentage,
                date: formattedDate,
                isPast,
                userId,
                createdAt: serverTimestamp(),
            });
        } catch (err: unknown) {
            console.error("Error adding celebration:", err);
            throw err;
        }
    };

    const updateCelebration = async (id: string, data: { title: string, rawDate: string, type: CelebrationType, customTypeLabel?: string, recurrence?: CelebrationRecurrence, reminderTiming?: CelebrationReminderTiming }) => {
        if (!userId) return;

        const recurrence = data.recurrence ?? "annual";
        const { daysLeft, percentage, formattedDate, isPast } = calculateCountdown(data.rawDate, recurrence);
        const payload = {
            title: data.title,
            rawDate: data.rawDate,
            type: data.type,
            ...(typeof data.customTypeLabel === "string" ? { customTypeLabel: data.customTypeLabel } : {}),
            recurrence,
            ...(typeof data.reminderTiming === "string" ? { reminderTiming: data.reminderTiming } : {}),
        };

        try {
            const ref = doc(db, "celebrations", id);
            await updateDoc(ref, {
                ...payload,
                daysLeft,
                percentage,
                date: formattedDate,
                isPast,
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
