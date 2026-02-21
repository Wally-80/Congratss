"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    loading: true,
    logout: async () => { },
    updateUserProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeUserDoc: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);

            if (authUser) {
                // Listen to user document in Firestore for role updates
                const userRef = doc(db, "users", authUser.uid);
                unsubscribeUserDoc = onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.data();
                        // Support both 'role: admin' and 'isAdmin: true' formats
                        setIsAdmin(userData.role === "admin" || userData.isAdmin === true);
                    } else {
                        // Safe default: Check for specific admin email if no doc exists yet
                        setIsAdmin(authUser.email === "walterpomalaza@gmail.com" || authUser.email === "walterrpom@gmail.com");
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

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
