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
                <div className="absolute inset-0 bg-neon-cyan/10 blur-2xl rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full relative z-10"
                >
                    {/* The Bow */}
                    <path
                        d="M50 35C40 35 30 25 30 15C30 5 45 5 50 20C55 5 70 5 70 15C70 25 60 35 50 35Z"
                        className="stroke-[#2D3E50] dark:stroke-neon-cyan"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />

                    {/* Gift Box Lid */}
                    <path
                        d="M20 35C20 32.2386 22.2386 30 25 30H75C77.7614 30 80 32.2386 80 35V45H20V35Z"
                        className="fill-[#2D3E50] dark:fill-white/90"
                    />

                    {/* Gift Box Body */}
                    <path
                        d="M25 45H75V75C75 80.5228 70.5228 85 65 85H35C29.4772 85 25 80.5228 25 75V45Z"
                        className="fill-white dark:fill-transparent stroke-[#2D3E50] dark:stroke-white/20"
                        strokeWidth="5"
                    />

                    {/* The "C" Ribbon */}
                    <path
                        d="M45 45V65C45 70 50 75 60 75C70 75 75 70 75 65M45 45L75 45"
                        className="stroke-neon-cyan"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M60 75C75 75 80 65 85 55"
                        className="stroke-neon-cyan"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {showText && (
                <h1 className={`${currentSize.text} font-black tracking-tighter italic text-[#2D3E50] dark:text-white drop-shadow-[0_0_10px_rgba(0,242,255,0.2)]`}>
                    Congratss
                </h1>
            )}
        </div>
    );
}
