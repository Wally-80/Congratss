"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

import { Language } from "@/lib/translations";

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    language: Language;
    loading: boolean;
    logout: () => Promise<void>;
    updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
    setLanguage: (lang: Language) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    language: "en",
    loading: true,
    logout: async () => { },
    updateUserProfile: async () => { },
    setLanguage: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [language, setLanguageState] = useState<Language>("en");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeUserDoc: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);

            if (authUser) {
                // Listen to user document in Firestore for role and language updates
                const userRef = doc(db, "users", authUser.uid);
                unsubscribeUserDoc = onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.data();
                        // Support both 'role: admin' and 'isAdmin: true' formats
                        setIsAdmin(userData.role === "admin" || userData.isAdmin === true);
                        if (userData.language) {
                            setLanguageState(userData.language as Language);
                        }
                    } else {
                        // Safe default for new users or missing docs
                        setIsAdmin(authUser.email === "walterrpom@gmail.com" || authUser.email === "walterrpom@gmail.com");
                    }
                    setLoading(false);
                });
            } else {
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) unsubscribeUserDoc();
        };
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    const updateUserProfile = async (displayName: string, photoURL: string) => {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName,
                photoURL
            });
            // Force context to recognize the change by cloning the user object
            setUser({ ...auth.currentUser });
        }
    };

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { language: lang }, { merge: true });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, language, loading, logout, updateUserProfile, setLanguage }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
