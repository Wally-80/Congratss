import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    getDocs,
    query,
    Timestamp,
    writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

export type CardLocale = "en" | "es" | "both";

export interface GreetingCard {
    id: string;
    url: string;
    label: string;
    category: string;
    locale?: CardLocale;
    createdAt?: Date;
}

const COLLECTION_NAME = "greeting_cards";

// EXACT ORIGINAL CARDS FROM PREVIOUS VERSION
const DEFAULT_CARDS: Array<Omit<GreetingCard, "id" | "createdAt">> = [
    { label: "Congratss", url: "/greeting_gratzz.png", category: "Classic", locale: "both" },
    { label: "Flowers", url: "/greeting_flowers.png", category: "Classic", locale: "both" },
    { label: "Balloons", url: "/greeting_balloons.png", category: "Classic", locale: "both" },
    { label: "Birthday Cake", url: "/greeting_cake.png", category: "Special", locale: "both" },
    { label: "Party Time", url: "/greeting_party.png", category: "Special", locale: "both" },
    { label: "Retirement", url: "/greeting_retirement.png", category: "Special", locale: "both" },
    { label: "Anniversary", url: "/greeting_anniversary_gold.png", category: "Special", locale: "both" },
    { label: "Congrats", url: "/greeting_congrats_modern.png", category: "Special", locale: "both" },
    { label: "Cool Grandpa", url: "/greeting_funny_grandpa.png", category: "Funny", locale: "both" },
    { label: "Party Puppy", url: "/greeting_funny_dog.png", category: "Funny", locale: "both" },
    { label: "Gamer Cat", url: "/greeting_funny_cat_pizza.png", category: "Funny", locale: "both" },
    { label: "Beer Signal", url: "/greeting_funny_beer_signal.png", category: "Funny", locale: "both" }
];

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
    subscribeToCards(callback: (cards: GreetingCard[]) => void, onError?: (error: unknown) => void) {
        const q = query(collection(db, COLLECTION_NAME));

        return onSnapshot(q, (snapshot) => {
            const cards = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    locale: (data.locale as CardLocale | undefined) ?? "both",
                    createdAt: data.createdAt && typeof data.createdAt.toDate === 'function'
                        ? data.createdAt.toDate()
                        : undefined
                } as GreetingCard;
            });
            callback(cards);
        }, (error) => {
            console.error("Error subscribing to cards: ", error);
            if (onError) onError(error);
        });
    },

    async getCards() {
        const q = query(collection(db, COLLECTION_NAME));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                locale: (data.locale as CardLocale | undefined) ?? "both",
                createdAt: data.createdAt && typeof data.createdAt.toDate === 'function'
                    ? data.createdAt.toDate()
                    : undefined
            } as GreetingCard;
        });
    },

    // Update an existing card
    async updateCard(id: string, data: Partial<Omit<GreetingCard, 'id' | 'createdAt'>>) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data as Record<string, unknown>);
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
    },

    // Seed the database with default cards
    async seedDefaults() {
        try {
            const batch = writeBatch(db);

            // First, delete existing if any? The user said "recover", so let's just add them.
            // If they want to start fresh, they can clear manually.

            DEFAULT_CARDS.forEach(card => {
                const newDocRef = doc(collection(db, COLLECTION_NAME));
                batch.set(newDocRef, {
                    ...card,
                    createdAt: Timestamp.now()
                });
            });

            await batch.commit();
            console.log("Successfully seeded default cards.");
        } catch (error) {
            console.error("Error seeding cards: ", error);
            throw error;
        }
    }
};
