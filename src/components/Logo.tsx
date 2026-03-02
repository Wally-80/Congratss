"use client";

import React from "react";

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
    const sizeMap = {
        sm: { icon: "h-8 w-8", text: "text-xl" },
        md: { icon: "h-16 w-16", text: "text-4xl" },
        lg: { icon: "h-24 w-24", text: "text-6xl" },
        xl: { icon: "h-32 w-32", text: "text-7xl" },
        "2xl": { icon: "h-48 w-48", text: "text-8xl" },
    };

    const currentSize = sizeMap[size];

    return (
        <div className={`flex flex-col items-center gap-6 ${className}`}>
            <div className={`relative group ${currentSize.icon}`}>
                {/* Subtle Glow */}
                <div className="absolute inset-x-0 -inset-y-4 bg-neon-cyan/20 blur-3xl rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

                <img
                    src="/logo-256.png"
                    alt="Congratss Logo"
                    className="w-full h-full relative z-10 object-contain drop-shadow-[0_0_15px_rgba(0,242,255,0.3)] animate-in fade-in zoom-in duration-1000"
                />
            </div>

            {showText && (
                <h1 className={`${currentSize.text} font-black tracking-tighter italic text-[var(--app-text)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-2 duration-1000`}>
                    Congratss
                </h1>
            )}
        </div>
    );
}
