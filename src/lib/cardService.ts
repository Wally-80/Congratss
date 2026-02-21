import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface GreetingCard {
    id: string;
    url: string;
    label: string;
    category: string;
    createdAt?: Date;
}

const COLLECTION_NAME = "greeting_cards";

export const cardService = {
    // Add a new greeting card
    async addCard(data: Omit<GreetingCard, 'id' | 'createdAt'>) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...data,
                createdAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding card: ", error);
            throw error;
        }
    },

    // Listen to all cards in real-time
    subscribeToCards(callback: (cards: GreetingCard[]) => void) {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy("category", "asc"),
            orderBy("label", "asc")
        );

        return onSnapshot(q, (snapshot) => {
            const cards = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: (data.createdAt as Timestamp)?.toDate()
                } as GreetingCard;
            });
            callback(cards);
        }, (error) => {
            console.error("Error subscribing to cards: ", error);
        });
    },

    // Update an existing card
    async updateCard(id: string, data: Partial<Omit<GreetingCard, 'id' | 'createdAt'>>) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data as any);
        } catch (error) {
            console.error("Error updating card: ", error);
            throw error;
        }
    },

    // Delete a card
    async deleteCard(id: string) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting card: ", error);
            throw error;
        }
    }
};
