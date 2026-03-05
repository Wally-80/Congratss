"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

import { Language } from "@/lib/translations";

const ADMIN_EMAILS = ["walterrpom@gmail.com", "walterciitop@gmail.com"];

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    language: Language;
    notificationsEnabled: boolean;
    onboardingCompleted: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
    setLanguage: (lang: Language) => Promise<void>;
    setNotificationsEnabled: (enabled: boolean) => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    language: "en",
    notificationsEnabled: false,
    onboardingCompleted: true,
    loading: true,
    logout: async () => { },
    updateUserProfile: async () => { },
    setLanguage: async () => { },
    setNotificationsEnabled: async () => { },
    completeOnboarding: async () => { },
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
    const [onboardingCompleted, setOnboardingCompletedState] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeUserDoc: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            const isPasswordProviderUser = Boolean(
                authUser?.providerData?.some((provider) => provider.providerId === "password")
            );

            if (authUser && isPasswordProviderUser && !authUser.emailVerified) {
                void signOut(auth).catch((error) => {
                    console.error("Failed to sign out unverified user:", error);
                });
                setUser(null);
                setIsAdmin(false);
                setNotificationsEnabledState(false);
                setOnboardingCompletedState(true);
                setLoading(false);
                return;
            }

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
                        setOnboardingCompletedState(userData.onboardingCompleted === true);
                    } else {
                        // Safe default for new users or missing docs
                        setIsAdmin(ADMIN_EMAILS.includes(authUser.email ?? ""));
                        setNotificationsEnabledState(false);
                        setOnboardingCompletedState(false);
                        const fallbackLanguage: Language =
                            typeof window !== "undefined" && localStorage.getItem("app-language") === "es"
                                ? "es"
                                : "en";
                        void setDoc(userRef, {
                            language: fallbackLanguage,
                            notificationsEnabled: false,
                            onboardingCompleted: false,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        }, { merge: true }).catch((error) => {
                            console.error("Failed to initialize user profile:", error);
                        });
                    }
                    setLoading(false);
                });
            } else {
                setIsAdmin(false);
                setNotificationsEnabledState(false);
                setOnboardingCompletedState(true);
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
        auth.languageCode = language;
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
            // Keep the Firebase User instance intact to avoid losing required fields like uid.
            setUser(auth.currentUser);
        }
    };

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        auth.languageCode = lang;
        if (typeof window !== "undefined") {
            localStorage.setItem("app-language", lang);
        }
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { language: lang, updatedAt: serverTimestamp() }, { merge: true });
        }
    };

    const setNotificationsEnabled = async (enabled: boolean) => {
        setNotificationsEnabledState(enabled);
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { notificationsEnabled: enabled, updatedAt: serverTimestamp() }, { merge: true });
        }
    };

    const completeOnboarding = async () => {
        setOnboardingCompletedState(true);
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                onboardingCompleted: true,
                onboardingCompletedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }, { merge: true });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, language, notificationsEnabled, onboardingCompleted, loading, logout, updateUserProfile, setLanguage, setNotificationsEnabled, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
