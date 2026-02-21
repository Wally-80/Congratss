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
    const [explosionKey, setExplosionKey] = useState(0);

    useEffect(() => {
        // The rise animation is 6s. Peak is around 5.4s (90%).
        // We want to trigger the explosion at 5.4s.
        // The explosion needs 1.5s to finish.
        // So we'll run a 7.5s cycle (6s rise + 1.5s fade/wait).
        
        const cycleTime = 7500; 
        const explosionTriggerTime = 5400;

        const runCycle = () => {
            setShowExplosion(false);
            
            // Trigger explosion at the peak
            const explodeTimer = setTimeout(() => {
                setShowExplosion(true);
                setExplosionKey(prev => prev + 1);
            }, explosionTriggerTime);

            return () => clearTimeout(explodeTimer);
        };

        // Initial delay
        const initialTimer = setTimeout(() => {
            runCycle();
            const interval = setInterval(runCycle, cycleTime);
            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(initialTimer);
    }, [delay]);

    return (
        <div
            className="absolute bottom-0 opacity-0"
            style={{
                left,
                animation: `firework-rise 7.5s linear infinite ${delay}s`,
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
                    <div key={explosionKey} className="absolute top-0 left-1/2 -translate-x-1/2">
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
