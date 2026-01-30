"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-pane w-full max-w-md p-8 shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-white/90">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-neon-cyan/20 border border-neon-cyan/50 hover:bg-neon-cyan/30 text-neon-cyan font-bold py-4 rounded-2xl shadow-neon transition-all active:scale-[0.98]"
                    >
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <p className="mt-8 text-center text-white/40 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-neon-cyan hover:underline font-medium"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
