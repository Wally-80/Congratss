"use client";

import React, { useEffect, useRef } from "react";

type FireworksMode = "elegant" | "celebration";
type BurstType = "peony" | "ring" | "chrysanthemum" | "willow";

type FireworksProps = {
    mode?: FireworksMode;
    className?: string;
    disableOnMobile?: boolean;
    maxRuntimeMs?: number;
};

type ModeConfig = {
    hueBands: number[];
    launchMsDesktop: [number, number];
    launchMsMobile: [number, number];
    doubleLaunchChanceDesktop: number;
    initialLaunches: number;
    burstScale: number;
    sparkTrailChance: number;
    baseAlpha: number;
};

type Rocket = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetY: number;
    hue: number;
    alive: boolean;
    burstType: BurstType;
};

type Spark = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
    saturation: number;
    lightness: number;
    gravity: number;
    drag: number;
    twinkle: number;
};

type Trail = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
    lightness: number;
};

const MODE: Record<FireworksMode, ModeConfig> = {
    elegant: {
        hueBands: [34, 48, 190, 208],
        launchMsDesktop: [520, 900],
        launchMsMobile: [720, 1200],
        doubleLaunchChanceDesktop: 0.08,
        initialLaunches: 1,
        burstScale: 0.78,
        sparkTrailChance: 0.035,
        baseAlpha: 0.65,
    },
    celebration: {
        hueBands: [12, 32, 52, 190, 210, 260, 320],
        launchMsDesktop: [260, 420],
        launchMsMobile: [380, 620],
        doubleLaunchChanceDesktop: 0.24,
        initialLaunches: 2,
        burstScale: 1,
        sparkTrailChance: 0.06,
        baseAlpha: 0.9,
    },
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export default function Fireworks({ mode = "celebration", className = "", disableOnMobile = false, maxRuntimeMs }: FireworksProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (disableOnMobile && window.innerWidth < 768) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const config = MODE[mode];
        let animationFrameId = 0;
        const startedAt = performance.now();
        let width = window.innerWidth;
        let height = window.innerHeight;
        let lastLaunch = 0;
        let sparks: Spark[] = [];
        let trails: Trail[] = [];
        let rockets: Rocket[] = [];
        let isVisible = document.visibilityState === "visible";

        const pickHue = () => {
            const band = config.hueBands[Math.floor(Math.random() * config.hueBands.length)];
            return band + randomBetween(-9, 9);
        };

        const pickBurstType = (): BurstType => {
            const roll = Math.random();
            if (roll < 0.36) return "peony";
            if (roll < 0.62) return "chrysanthemum";
            if (roll < 0.82) return "ring";
            return "willow";
        };

        const createRocket = (forcedX?: number): Rocket => ({
            x: forcedX ?? randomBetween(width * 0.1, width * 0.9),
            y: height + randomBetween(2, 16),
            vx: randomBetween(-0.32, 0.32),
            vy: -randomBetween(7.8, 10.3),
            targetY: randomBetween(height * 0.14, height * 0.54),
            hue: pickHue(),
            alive: true,
            burstType: pickBurstType(),
        });

        const pushSpark = (x: number, y: number, vx: number, vy: number, hue: number, lifeScale = 1) => {
            const life = randomBetween(42, 86) * lifeScale * (0.92 + config.burstScale * 0.08);
            sparks.push({
                x,
                y,
                vx,
                vy,
                life,
                maxLife: life,
                size: randomBetween(1.05, 2.65) * (0.82 + config.burstScale * 0.18),
                hue: hue + randomBetween(-10, 10),
                saturation: randomBetween(80, 100),
                lightness: randomBetween(56, 72),
                gravity: randomBetween(0.05, 0.095),
                drag: randomBetween(0.963, 0.985),
                twinkle: Math.random(),
            });
        };

        const explodeRocket = (rocket: Rocket) => {
            const hue = rocket.hue;
            if (rocket.burstType === "ring") {
                const count = Math.floor(randomBetween(34, 52) * config.burstScale);
                const baseSpeed = randomBetween(2.2, 4.1);
                const angleOffset = randomBetween(0, Math.PI * 2);
                for (let i = 0; i < count; i++) {
                    const angle = angleOffset + (i / count) * Math.PI * 2 + randomBetween(-0.04, 0.04);
                    const speed = baseSpeed + randomBetween(-0.35, 0.35);
                    pushSpark(rocket.x, rocket.y, Math.cos(angle) * speed, Math.sin(angle) * speed, hue);
                }
                return;
            }

            if (rocket.burstType === "willow") {
                const count = Math.floor(randomBetween(56, 78) * config.burstScale);
                for (let i = 0; i < count; i++) {
                    const angle = randomBetween(0, Math.PI * 2);
                    const speed = randomBetween(1.1, 3.2);
                    pushSpark(
                        rocket.x,
                        rocket.y,
                        Math.cos(angle) * speed * 0.75,
                        Math.sin(angle) * speed * 0.65,
                        hue + randomBetween(-18, 18),
                        1.35
                    );
                }
                return;
            }

            const count = rocket.burstType === "chrysanthemum"
                ? Math.floor(randomBetween(50, 72) * config.burstScale)
                : Math.floor(randomBetween(40, 58) * config.burstScale);
            for (let i = 0; i < count; i++) {
                const angle = randomBetween(0, Math.PI * 2);
                const speed = rocket.burstType === "chrysanthemum" ? randomBetween(1.5, 5.0) : randomBetween(1.8, 4.3);
                pushSpark(rocket.x, rocket.y, Math.cos(angle) * speed, Math.sin(angle) * speed, hue);
            }
        };

        const pushTrail = (rocket: Rocket) => {
            trails.push({
                x: rocket.x + randomBetween(-0.8, 0.8),
                y: rocket.y + randomBetween(-0.6, 0.6),
                vx: -rocket.vx * 0.15 + randomBetween(-0.1, 0.1),
                vy: randomBetween(0.12, 0.55),
                life: randomBetween(12, 28),
                maxLife: randomBetween(12, 28),
                size: randomBetween(0.9, 1.8),
                hue: rocket.hue + randomBetween(-12, 12),
                lightness: randomBetween(72, 88),
            });
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const updateRockets = () => {
            for (const rocket of rockets) {
                rocket.vx *= 0.995;
                rocket.vy += 0.045;
                rocket.x += rocket.vx;
                rocket.y += rocket.vy;
                pushTrail(rocket);

                if (rocket.y <= rocket.targetY || rocket.vy >= -0.45) {
                    rocket.alive = false;
                    explodeRocket(rocket);
                }
            }
            rockets = rockets.filter((rocket) => rocket.alive);
            if (rockets.length > 20) rockets = rockets.slice(-20);
        };

        const updateTrails = () => {
            for (const trail of trails) {
                trail.x += trail.vx;
                trail.y += trail.vy;
                trail.vy += 0.02;
                trail.life -= 1;
            }
            trails = trails.filter((trail) => trail.life > 0);
            if (trails.length > 900) trails = trails.slice(-900);
        };

        const updateSparks = () => {
            for (const spark of sparks) {
                spark.vx *= spark.drag;
                spark.vy = spark.vy * spark.drag + spark.gravity;
                spark.x += spark.vx;
                spark.y += spark.vy;
                spark.life -= 1;

                if (spark.life > 0 && Math.random() < config.sparkTrailChance) {
                    trails.push({
                        x: spark.x,
                        y: spark.y,
                        vx: randomBetween(-0.08, 0.08),
                        vy: randomBetween(0.02, 0.14),
                        life: randomBetween(6, 16),
                        maxLife: randomBetween(6, 16),
                        size: randomBetween(0.6, 1.2),
                        hue: spark.hue,
                        lightness: randomBetween(65, 85),
                    });
                }
            }
            sparks = sparks.filter((spark) => spark.life > 0);
            if (sparks.length > 1200) sparks = sparks.slice(-1200);
        };

        const drawTrails = () => {
            ctx.globalCompositeOperation = "source-over";
            for (const trail of trails) {
                const lifeRatio = trail.life / trail.maxLife;
                ctx.globalAlpha = Math.max(0, lifeRatio * 0.58 * config.baseAlpha);
                ctx.beginPath();
                ctx.arc(trail.x, trail.y, trail.size * lifeRatio, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${trail.hue.toFixed(1)} 90% ${trail.lightness.toFixed(1)}%)`;
                ctx.fill();
            }
        };

        const drawRockets = () => {
            ctx.globalCompositeOperation = "lighter";
            for (const rocket of rockets) {
                ctx.globalAlpha = 0.85 * config.baseAlpha;
                ctx.beginPath();
                ctx.arc(rocket.x, rocket.y, 2.3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${rocket.hue.toFixed(1)} 100% 78%)`;
                ctx.fill();
            }
        };

        const drawSparks = () => {
            ctx.globalCompositeOperation = "lighter";
            for (const spark of sparks) {
                const lifeRatio = spark.life / spark.maxLife;
                const flicker = spark.twinkle > 0.72 ? randomBetween(0.86, 1.1) : 1;
                ctx.globalAlpha = Math.max(0, Math.pow(lifeRatio, 1.14) * config.baseAlpha * flicker);
                ctx.beginPath();
                ctx.arc(spark.x, spark.y, spark.size * (0.5 + lifeRatio), 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${spark.hue.toFixed(1)} ${spark.saturation.toFixed(1)}% ${spark.lightness.toFixed(1)}%)`;
                ctx.fill();
            }
        };

        const render = (timestamp: number) => {
            if (typeof maxRuntimeMs === "number" && timestamp - startedAt > maxRuntimeMs) {
                ctx.clearRect(0, 0, width, height);
                return;
            }
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            const [minDelay, maxDelay] = width >= 1024 ? config.launchMsDesktop : config.launchMsMobile;
            if (timestamp - lastLaunch > randomBetween(minDelay, maxDelay) && Math.random() < 0.9) {
                rockets.push(createRocket());
                if (width >= 1024 && Math.random() < config.doubleLaunchChanceDesktop) {
                    rockets.push(createRocket());
                }
                lastLaunch = timestamp;
            }

            updateRockets();
            updateTrails();
            updateSparks();
            drawTrails();
            drawRockets();
            drawSparks();

            animationFrameId = requestAnimationFrame(render);
        };

        const handleVisibilityChange = () => {
            isVisible = document.visibilityState === "visible";
        };

        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        resize();

        for (let i = 0; i < config.initialLaunches; i++) {
            rockets.push(createRocket(width * (0.3 + i * 0.4)));
        }
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            cancelAnimationFrame(animationFrameId);
        };
    }, [disableOnMobile, maxRuntimeMs, mode]);

    return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none ${className}`.trim()} />;
}
