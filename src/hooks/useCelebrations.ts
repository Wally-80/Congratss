"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export interface Celebration {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    percentage: number;
    type: "birthday" | "anniversary";
    userId: string;
}

export const useCelebrations = () => {
    const { user } = useAuth();
    const [celebrations, setCelebrations] = useState<Celebration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setCelebrations([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "celebrations"),
            where("userId", "==", user.uid),
            orderBy("daysLeft", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Celebration[];
            setCelebrations(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addCelebration = async (data: Omit<Celebration, "id" | "userId">) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "celebrations"), {
                ...data,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error adding celebration:", err);
            throw err;
        }
    };

    return { celebrations, loading, addCelebration };
};
