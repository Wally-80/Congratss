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
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                {/* SVG Gift Box Recreated */}
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full relative z-10 drop-shadow-2xl"
                >
                    {/* Main Box Body */}
                    <path
                        d="M20 45C20 42.2386 22.2386 40 25 40H75C77.7614 40 80 42.2386 80 45V75C80 80.5228 75.5228 85 70 85H30C24.4772 85 20 80.5228 20 75V45Z"
                        className="fill-white dark:fill-white/90"
                    />

                    {/* Ribbon Vertical */}
                    <rect x="46" y="40" width="8" height="45" className="fill-neon-cyan" />

                    {/* Lid */}
                    <path
                        d="M15 35C15 32.2386 17.2386 30 20 30H80C82.7614 30 85 32.2386 85 35V42H15V35Z"
                        className="fill-[var(--app-text)] opacity-90"
                    />

                    {/* Bow Right */}
                    <path
                        d="M50 30C50 30 55 15 70 15C85 15 85 30 70 30L50 30Z"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="text-neon-cyan"
                    />

                    {/* Bow Left */}
                    <path
                        d="M50 30C50 30 45 15 30 15C15 15 15 30 30 30L50 30Z"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="text-neon-cyan"
                    />
                </svg>
            </div>

            {showText && (
                <h1 className={`${currentSize.text} font-black tracking-tighter italic text-[var(--app-text)] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
                    Congratss
                </h1>
            )}
        </div>
    );
}
