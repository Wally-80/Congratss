"use client";

import React, { useEffect, useState } from "react";

const FIREWORK_COUNT = 5;
const SPARK_COUNT = 24;

export default function Fireworks() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(FIREWORK_COUNT)].map((_, i) => (
                <FireworkInstance key={i} delay={i * 2} left={`${10 + i * 20}%`} />
            ))}
        </div>
    );
}

function FireworkInstance({ delay, left }: { delay: number; left: string }) {
    const [showExplosion, setShowExplosion] = useState(false);

    useEffect(() => {
        const triggerExplosion = () => {
            setShowExplosion(false);
            // Peak is at 6s. Triggering just before the end.
            setTimeout(() => setShowExplosion(true), 5800);
        };

        const timer = setTimeout(() => {
            triggerExplosion();
            const interval = setInterval(triggerExplosion, 6000);
            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className="absolute bottom-0 opacity-0"
            style={{
                left,
                animation: `firework-rise 6s linear infinite ${delay}s`,
                animationFillMode: 'backwards'
            }}
        >
            <div className="relative">
                {/* Intense rising spark */}
                <div className="w-2 h-6 bg-gradient-to-t from-transparent via-white/40 to-white/90 blur-[1px] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]" />

                {/* Shimmering trail */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-48 bg-gradient-to-t from-transparent via-white/5 to-white/30" />

                {/* The Explosion */}
                {showExplosion && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2">
                        {[...Array(SPARK_COUNT)].map((_, j) => {
                            const angle = (j * 360) / SPARK_COUNT;
                            const distance = 80 + Math.random() * 120;
                            const x = Math.cos((angle * Math.PI) / 180) * distance;
                            const y = Math.sin((angle * Math.PI) / 180) * distance;
                            const sparkDelay = Math.random() * 0.2;
                            const color = j % 3 === 0 ? "var(--color-neon-cyan)" : j % 3 === 1 ? "var(--color-neon-pink)" : "#ffffff";

                            return (
                                <div
                                    key={j}
                                    className="absolute w-1.5 h-1.5 rounded-full animate-firework-spark"
                                    style={{
                                        // @ts-ignore
                                        "--x": `${x}px`,
                                        // @ts-ignore
                                        "--y": `${y}px`,
                                        animationDelay: `${sparkDelay}s`,
                                        backgroundColor: color,
                                        boxShadow: `0 0 12px ${color}`
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
