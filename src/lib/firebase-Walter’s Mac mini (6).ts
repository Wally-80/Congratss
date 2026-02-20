import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD0jMhBM07_EYroLR2pJmv59hR207gbrqo",
    authDomain: "gratzz.firebaseapp.com",
    projectId: "gratzz",
    storageBucket: "gratzz.firebasestorage.app",
    messagingSenderId: "1051507062109",
    appId: "1:1051507062109:web:758638b4b4a86c392764b4",
    measurementId: "G-4ZFTS8H70F"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
