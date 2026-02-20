import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface Celebration {
    id?: string;
    userId: string;
    name: string;
    type: 'birthday' | 'anniversary' | 'retirement' | 'other';
    date: Date;
    isRecurring: boolean;
    notes?: string;
    giftIdeas?: string[];
    createdAt: Date;
}

const COLLECTION_NAME = "occasions";

export const celebrationService = {
    // Add a new celebration
    async addCelebration(data: Omit<Celebration, 'id' | 'createdAt'>) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...data,
                date: Timestamp.fromDate(data.date),
                createdAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding celebration: ", error);
            throw error;
        }
    },

    // Listen to celebrations for a specific user in real-time
    subscribeToCelebrations(userId: string, callback: (celebrations: Celebration[]) => void) {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("userId", "==", userId),
            orderBy("date", "asc")
        );

        return onSnapshot(q, (snapshot) => {
            const celebrations = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: (data.date as Timestamp).toDate(),
                    createdAt: (data.createdAt as Timestamp).toDate()
                } as Celebration;
            });
            callback(celebrations);
        }, (error) => {
            console.error("Error subscribing to celebrations: ", error);
        });
    },

    // Update an existing celebration
    async updateCelebration(id: string, data: Partial<Omit<Celebration, 'id' | 'userId' | 'createdAt'>>) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const updateData = { ...data };
            if (data.date) {
                updateData.date = Timestamp.fromDate(data.date) as any;
            }
            await updateDoc(docRef, updateData as any);
        } catch (error) {
            console.error("Error updating celebration: ", error);
            throw error;
        }
    },

    // Delete a celebration
    async deleteCelebration(id: string) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting celebration: ", error);
            throw error;
        }
    }
};
