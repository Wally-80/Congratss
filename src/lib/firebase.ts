import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "true";
if (useEmulators && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.startsWith("demo-")) {
    throw new Error("Browser emulator mode requires a demo- project.");
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase for SSR
const isNewApp = getApps().length === 0;
const app = isNewApp ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = isNewApp ? initializeFirestore(app, {
    localCache: typeof window !== "undefined"
        ? persistentLocalCache({ tabManager: persistentMultipleTabManager() })
        : memoryLocalCache(),
}) : getFirestore(app);
const storage = getStorage(app);
if (useEmulators && isNewApp) {
    // Guarded demo mode: keep the emulator UI banner out of application landmarks.
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
}

let messaging: Messaging | null = null;
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_DISABLE_PUSH !== "true") {
    isSupported().then((supported) => {
        if (supported) {
            messaging = getMessaging(app);
        }
    }).catch(console.error);
}

export { app, auth, db, storage, messaging };

