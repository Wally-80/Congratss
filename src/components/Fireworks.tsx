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
        ];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;
            decay: number;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.color = color;
                this.decay = Math.random() * 0.015 + 0.015;
            }

            update() {
                this.vx *= 0.95;
                this.vy *= 0.95;
                this.vy += 0.05; // gravity
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
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
                this.targetY = Math.random() * (height * 0.5);
                this.vy = -(Math.random() * 3 + 4);
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alive = true;
            }

            update() {
                this.y += this.vy;
                if (this.y <= this.targetY) {
                    this.alive = false;
                    this.explode();
                }
            }

            explode() {
                for (let i = 0; i < 40; i++) {
                    particles.push(new Particle(this.x, this.y, this.color));
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#fff";
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const render = () => {
            // Pure black trail for better contrast on OLED/Dark backgrounds
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.025) {
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
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
