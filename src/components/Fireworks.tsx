"use client";

import React, { useEffect, useRef } from "react";

export default function Fireworks() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let rockets: Rocket[] = [];

        const colors = [
            "#ff007f", // neon pink
            "#00f2ff", // neon cyan
            "#ffffff", // white
            "#bc13fe", // neon purple
            "#0070f3", // blue
        ];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;
            size: number;
            decay: number;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1; // Slightly slower for better control
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.color = color;
                this.size = Math.random() * 1.2 + 0.6; // Smaller particles
                this.decay = Math.random() * 0.02 + 0.015; // Faster decay
            }

            update() {
                this.vx *= 0.95;
                this.vy *= 0.95;
                this.vy += 0.06; // gravity
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.alpha <= 0) return;

                // HIGH PERFORMANCE DRAW: No save/restore, no shadowBlur
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        class Rocket {
            x: number;
            y: number;
            targetY: number;
            vy: number;
            color: string;
            alive: boolean;

            constructor(width: number, height: number, initialX?: number) {
                this.x = initialX ?? Math.random() * width;
                this.y = height;
                this.targetY = Math.random() * (height * 0.45) + (height * 0.1);
                this.vy = -(Math.random() * 3 + 8);
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alive = true;
            }

            update() {
                this.y += this.vy;
                this.vy *= 0.985;
                if (this.vy > -0.5 || this.y <= this.targetY) {
                    this.alive = false;
                    this.explode();
                }
            }

            explode() {
                // REDUCED PARTICLE COUNT: from 40-70 to 20-35
                const count = 20 + Math.floor(Math.random() * 15);
                for (let i = 0; i < count; i++) {
                    particles.push(new Particle(this.x, this.y, this.color));
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.globalAlpha = 1.0;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const render = () => {
            const hasActivity = rockets.length > 0 || particles.length > 0;

            if (hasActivity) {
                // Stronger clearing to prevent "marks" or ghosting
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = "rgba(0, 0, 0, 0.35)"; // Increased for cleaner fade
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                // Fully reset canvas when nothing is blooming to ensure absolute black
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Launch new rockets
            if (Math.random() < 0.025) {
                rockets.push(new Rocket(canvas.width, canvas.height));
            }

            // Draw Rockets first (source-over for solid look)
            ctx.globalCompositeOperation = 'source-over';
            rockets = rockets.filter(r => r.alive);
            rockets.forEach(r => {
                r.update();
                r.draw(ctx);
            });

            // Draw Particles (lighter for neon glow effect)
            ctx.globalCompositeOperation = 'lighter';
            particles = particles.filter(p => p.alpha > 0.01);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener("resize", resize);
        resize();

        // IMMEDIATE LAUNCH: Start with one rocket right away
        rockets.push(new Rocket(canvas.width, canvas.height, canvas.width / 2));

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                backgroundColor: '#000000',
            }}
        />
    );
}
