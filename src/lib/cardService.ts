import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
    getDocs,
    writeBatch
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

const DEFAULT_CARDS = [
    { label: "Birthday Cake", url: "/greeting_cake.png", category: "Classic" },
    { label: "Party Time", url: "/greeting_party.png", category: "Classic" },
    { label: "Beautiful Flowers", url: "/greeting_flowers.png", category: "Flowers" },
    { label: "Festive Balloons", url: "/greeting_balloons.png", category: "Balloons" },
    { label: "Modern Congrats", url: "/greeting_congrats_modern.png", category: "Modern" },
    { label: "Golden Anniversary", url: "/greeting_anniversary_gold.png", category: "Classic" },
    { label: "Happy Retirement", url: "/greeting_retirement.png", category: "Classic" },
    { label: "Congratss Classic", url: "/greeting_gratzz.png", category: "Congratss" },
    { label: "Funny Dog", url: "/greeting_funny_dog.png", category: "Funny" },
    { label: "Pizza Cat", url: "/greeting_funny_party_cat_pizza.png", category: "Funny" },
    { label: "Cool Grandpa", url: "/greeting_funny_grandpa.png", category: "Funny" },
    { label: "Beer Signal", url: "/greeting_funny_beer_signal.png", category: "Funny" }
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
    subscribeToCards(callback: (cards: GreetingCard[]) => void, onError?: (error: any) => void) {
        // We use query() even without orderBy to keep it standard
        const q = query(collection(db, COLLECTION_NAME));

        return onSnapshot(q, (snapshot) => {
            const cards = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
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
    },

    // Seed the database with default cards
    async seedDefaults() {
        try {
            const snapshot = await getDocs(collection(db, COLLECTION_NAME));
            if (snapshot.size > 0) {
                // If cards exist, don't auto-seed to avoid duplicates
                console.log("Collection already contains data.");
            }

            const batch = writeBatch(db);
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
