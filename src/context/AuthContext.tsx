"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            // Simple email-based admin check for now
            // Can be expanded to Firestore check later
            setIsAdmin(user?.email === "walterrpom@gmail.com");
            setLoading(false);
        });

        return () => unsubscribe();
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
