"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

import { Language } from "@/lib/translations";

const ADMIN_EMAILS = ["walterrpom@gmail.com", "walterciitop@gmail.com"];

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    language: Language;
    notificationsEnabled: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
    setLanguage: (lang: Language) => Promise<void>;
    setNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    language: "en",
    notificationsEnabled: false,
    loading: true,
    logout: async () => { },
    updateUserProfile: async () => { },
    setLanguage: async () => { },
    setNotificationsEnabled: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [language, setLanguageState] = useState<Language>(() => {
        const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("app-language") : null;
        if (savedLanguage === "en" || savedLanguage === "es") {
            return savedLanguage;
        }
        return "en";
    });
    const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
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
                        setIsAdmin(
                            userData.role === "admin" ||
                            userData.isAdmin === true ||
                            ADMIN_EMAILS.includes(authUser.email ?? "")
                        );
                        if (userData.language) {
                            setLanguageState(userData.language as Language);
                            localStorage.setItem("app-language", userData.language as Language);
                        }
                        setNotificationsEnabledState(userData.notificationsEnabled === true);
                    } else {
                        // Safe default for new users or missing docs
                        setIsAdmin(ADMIN_EMAILS.includes(authUser.email ?? ""));
                        setNotificationsEnabledState(false);
                    }
                    setLoading(false);
                });
            } else {
                setIsAdmin(false);
                setNotificationsEnabledState(false);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) unsubscribeUserDoc();
        };
    }, []);

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = language;
        }
    }, [language]);

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
        if (typeof window !== "undefined") {
            localStorage.setItem("app-language", lang);
        }
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { language: lang }, { merge: true });
        }
    };

    const setNotificationsEnabled = async (enabled: boolean) => {
        setNotificationsEnabledState(enabled);
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { notificationsEnabled: enabled }, { merge: true });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, language, notificationsEnabled, loading, logout, updateUserProfile, setLanguage, setNotificationsEnabled }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
