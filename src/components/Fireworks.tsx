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

        // Gender-neutral Gold & Champagne Palette
        const colors = [
            "#D4AF37", // Gold
            "#F7E7CE", // Champagne
            "#FFFFFF", // White
            "#C5A028", // Dark Gold
            "#E5E7EB", // Platinum
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
                const speed = Math.random() * 5 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.color = color;
                this.size = Math.random() * 1.5 + 0.5; // Slightly smaller to be sharper
                this.decay = Math.random() * 0.015 + 0.01;
            }

            update() {
                this.vx *= 0.96;
                this.vy *= 0.96;
                this.vy += 0.06; // gravity
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.alpha <= 0) return;

                // PERFORMANCE OPTIMIZATION: Remove shadowBlur. 
                // Instead, use globalAlpha and slightly larger arc if we want a soft feel.
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

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = height;
                this.targetY = Math.random() * (height * 0.6);
                this.vy = -(Math.random() * 4 + 7);
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alive = true;
            }

            update() {
                this.y += this.vy;
                this.vy *= 0.99;
                if (this.vy > -0.5 || this.y <= this.targetY) {
                    this.alive = false;
                    this.explode();
                }
            }

            explode() {
                // Reduced particle count for performance on mobile
                const count = 30 + Math.floor(Math.random() * 20);
                for (let i = 0; i < count; i++) {
                    particles.push(new Particle(this.x, this.y, this.color));
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.globalAlpha = 1;
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
            // Aggressive black clear for better performance and contrast
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Shimmering effect using 'lighter' but avoiding heavy glows
            ctx.globalCompositeOperation = 'lighter';

            if (Math.random() < 0.02) { // Slightly lower frequency for stability
                rockets.push(new Rocket(canvas.width, canvas.height));
            }

            rockets = rockets.filter(r => r.alive);
            rockets.forEach(r => {
                r.update();
                r.draw(ctx);
            });

            particles = particles.filter(p => p.alpha > 0);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener("resize", resize);
        resize();
        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-2]" // Deepest layer
            style={{
                backgroundColor: '#000000',
            }}
        />
    );
}
