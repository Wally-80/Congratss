"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
    EmailAuthProvider,
    deleteUser,
    onAuthStateChanged,
    reauthenticateWithCredential,
    signOut,
    updateProfile,
    User
} from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch
} from "firebase/firestore";
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
    deleteAccount: (password?: string) => Promise<void>;
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
    deleteAccount: async () => { },
});

const clearLocalAppState = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("app-language");
    localStorage.removeItem("gratzz_force_onboarding_once");
};

const formatDeleteAccountError = (error: unknown, language: Language) => {
    const fallback = language === "es"
        ? "No se pudo eliminar la cuenta. Intenta de nuevo."
        : "Could not delete the account. Please try again.";

    if (!(error instanceof FirebaseError)) {
        return error instanceof Error ? error.message : fallback;
    }

    switch (error.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return language === "es"
                ? "La contrasena no es correcta."
                : "The password is not correct.";
        case "auth/requires-recent-login":
            return language === "es"
                ? "Por seguridad, vuelve a iniciar sesion e intenta eliminar la cuenta otra vez."
                : "For security, sign in again and then try deleting the account again.";
        default:
            return error.message || fallback;
    }
};

const deleteDocsForUser = async (collectionName: string, userId: string) => {
    const snapshot = await getDocs(query(collection(db, collectionName), where("userId", "==", userId)));
    if (snapshot.empty) return;

    let batch = writeBatch(db);
    let count = 0;

    for (const item of snapshot.docs) {
        batch.delete(item.ref);
        count += 1;

        if (count === 400) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
        }
    }

    if (count > 0) {
        await batch.commit();
    }
};

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

    const deleteAccount = async (password?: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error(language === "es" ? "No hay una sesion activa." : "No active session.");
        }

        const hasPasswordProvider = currentUser.providerData.some((provider) => provider.providerId === "password");
        if (hasPasswordProvider) {
            if (!currentUser.email) {
                throw new Error(language === "es" ? "Falta el email de la cuenta." : "Missing account email.");
            }
            if (!password) {
                throw new Error(language === "es" ? "Debes confirmar tu contrasena." : "You must confirm your password.");
            }

            try {
                const credential = EmailAuthProvider.credential(currentUser.email, password);
                await reauthenticateWithCredential(currentUser, credential);
            } catch (error) {
                throw new Error(formatDeleteAccountError(error, language));
            }
        }

        try {
            await deleteDocsForUser("celebrations", currentUser.uid);
            await deleteDocsForUser("scheduled_messages", currentUser.uid);
            await deleteDoc(doc(db, "users", currentUser.uid));
            await deleteUser(currentUser);
            clearLocalAppState();
            setUser(null);
            setIsAdmin(false);
            setNotificationsEnabledState(false);
            setOnboardingCompletedState(true);
        } catch (error) {
            throw new Error(formatDeleteAccountError(error, language));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, language, notificationsEnabled, onboardingCompleted, loading, logout, updateUserProfile, setLanguage, setNotificationsEnabled, completeOnboarding, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
