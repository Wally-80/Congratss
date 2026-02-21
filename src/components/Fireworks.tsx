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
            "#7c3aed", // violet
            "#0070f3", // blue
            "#ffd700", // gold
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
                const speed = Math.random() * 6 + 1; // Faster particles
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.color = color;
                this.size = Math.random() * 2 + 1;
                this.decay = Math.random() * 0.01 + 0.01;
            }

            update() {
                this.vx *= 0.96;
                this.vy *= 0.96;
                this.vy += 0.08; // gravity
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.alpha <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                // Use bloom only for some particles to keep it sharp
                if (Math.random() > 0.5) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = this.color;
                }
                ctx.fill();
                ctx.restore();
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
                this.vy = -(Math.random() * 4 + 7); // Faster rockets
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alive = true;
            }

            update() {
                this.y += this.vy;
                this.vy *= 0.99; // slight air resistance
                if (this.vy > -0.5 || this.y <= this.targetY) {
                    this.alive = false;
                    this.explode();
                }
            }

            explode() {
                const count = 50 + Math.floor(Math.random() * 50);
                for (let i = 0; i < count; i++) {
                    particles.push(new Particle(this.x, this.y, this.color));
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.shadowBlur = 20;
                ctx.shadowColor = "#fff";
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const render = () => {
            // Aggressively clear to pure black to avoid grey buildup
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Light rockets/particles should use 'screen' or 'lighter' for that firework glow
            ctx.globalCompositeOperation = 'lighter';

            if (Math.random() < 0.03) {
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
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                backgroundColor: '#000000', // Solid black base
            }}
        />
    );
}
