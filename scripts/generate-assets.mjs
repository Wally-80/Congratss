/**
 * generate-assets.mjs
 * Generates all Android and iOS icon + splash assets from public/logo.png
 * Usage: node scripts/generate-assets.mjs
 */

import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const LOGO_SRC = resolve(ROOT, "public/logo.png");
const BG_COLOR = { r: 3, g: 3, b: 8, alpha: 1 }; // #030308
const BG_HEX = "#030308";

// ─── Android icon sizes ───────────────────────────────────────────────
const ANDROID_RES = resolve(ROOT, "android/app/src/main/res");

const MIPMAP_SIZES = [
    { density: "mdpi", size: 48 },
    { density: "hdpi", size: 72 },
    { density: "xhdpi", size: 96 },
    { density: "xxhdpi", size: 144 },
    { density: "xxxhdpi", size: 192 },
];

// Foreground icons need extra padding (icon is drawn in the inner 66% of the canvas)
const FOREGROUND_SIZES = [
    { density: "mdpi", size: 108 },
    { density: "hdpi", size: 162 },
    { density: "xhdpi", size: 216 },
    { density: "xxhdpi", size: 324 },
    { density: "xxxhdpi", size: 432 },
];

// Android splash sizes
const SPLASH_PORTRAIT = [
    { density: "port-mdpi", w: 320, h: 480 },
    { density: "port-hdpi", w: 480, h: 800 },
    { density: "port-xhdpi", w: 720, h: 1280 },
    { density: "port-xxhdpi", w: 960, h: 1600 },
    { density: "port-xxxhdpi", w: 1280, h: 1920 },
];

const SPLASH_LANDSCAPE = [
    { density: "land-mdpi", w: 480, h: 320 },
    { density: "land-hdpi", w: 800, h: 480 },
    { density: "land-xhdpi", w: 1280, h: 720 },
    { density: "land-xxhdpi", w: 1600, h: 960 },
    { density: "land-xxxhdpi", w: 1920, h: 1280 },
];

// ─── iOS sizes ────────────────────────────────────────────────────────
const IOS_ASSETS = resolve(ROOT, "ios/App/App/Assets.xcassets");

function ensureDir(filepath) {
    const dir = dirname(filepath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function generateIcon(outputPath, size) {
    ensureDir(outputPath);

    // Read the logo, resize with padding, then composite on dark background
    const logo = await sharp(LOGO_SRC)
        .resize(Math.round(size * 0.72), Math.round(size * 0.72), { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    await sharp({
        create: { width: size, height: size, channels: 4, background: BG_COLOR },
    })
        .composite([{ input: logo, gravity: "center" }])
        .png()
        .toFile(outputPath);

    console.log(`  ✓ ${outputPath} (${size}x${size})`);
}

async function generateForeground(outputPath, size) {
    ensureDir(outputPath);

    // Foreground needs the logo in the inner 66% area with transparent bg
    const innerSize = Math.round(size * 0.55);
    const logo = await sharp(LOGO_SRC)
        .resize(innerSize, innerSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    await sharp({
        create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
        .composite([{ input: logo, gravity: "center" }])
        .png()
        .toFile(outputPath);

    console.log(`  ✓ ${outputPath} (${size}x${size} foreground)`);
}

async function generateRoundIcon(outputPath, size) {
    ensureDir(outputPath);

    // Create circular mask
    const circle = Buffer.from(
        `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
    );

    // Generate the square icon first
    const logo = await sharp(LOGO_SRC)
        .resize(Math.round(size * 0.62), Math.round(size * 0.62), { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    const squareIcon = await sharp({
        create: { width: size, height: size, channels: 4, background: BG_COLOR },
    })
        .composite([{ input: logo, gravity: "center" }])
        .png()
        .toBuffer();

    // Apply circular mask
    await sharp(squareIcon)
        .composite([{ input: circle, blend: "dest-in" }])
        .png()
        .toFile(outputPath);

    console.log(`  ✓ ${outputPath} (${size}x${size} round)`);
}

async function generateSplash(outputPath, w, h) {
    ensureDir(outputPath);

    const logoSize = Math.round(Math.min(w, h) * 0.25);
    const logo = await sharp(LOGO_SRC)
        .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    await sharp({
        create: { width: w, height: h, channels: 4, background: BG_COLOR },
    })
        .composite([{ input: logo, gravity: "center" }])
        .png()
        .toFile(outputPath);

    console.log(`  ✓ ${outputPath} (${w}x${h})`);
}

async function main() {
    console.log("\n🎁 Generating Congratss native assets from logo.png\n");

    // ── Android Launcher Icons ──
    console.log("📱 Android launcher icons:");
    for (const { density, size } of MIPMAP_SIZES) {
        await generateIcon(resolve(ANDROID_RES, `mipmap-${density}/ic_launcher.png`), size);
    }

    // ── Android Foreground Icons ──
    console.log("\n📱 Android adaptive foreground icons:");
    for (const { density, size } of FOREGROUND_SIZES) {
        await generateForeground(resolve(ANDROID_RES, `mipmap-${density}/ic_launcher_foreground.png`), size);
    }

    // ── Android Round Icons ──
    console.log("\n📱 Android round icons:");
    for (const { density, size } of MIPMAP_SIZES) {
        await generateRoundIcon(resolve(ANDROID_RES, `mipmap-${density}/ic_launcher_round.png`), size);
    }

    // ── Android Splash Screens ──
    console.log("\n📱 Android splash screens (portrait):");
    // Default splash in drawable/
    await generateSplash(resolve(ANDROID_RES, "drawable/splash.png"), 480, 800);

    for (const { density, w, h } of SPLASH_PORTRAIT) {
        await generateSplash(resolve(ANDROID_RES, `drawable-${density}/splash.png`), w, h);
    }

    console.log("\n📱 Android splash screens (landscape):");
    for (const { density, w, h } of SPLASH_LANDSCAPE) {
        await generateSplash(resolve(ANDROID_RES, `drawable-${density}/splash.png`), w, h);
    }

    // ── iOS AppIcon ──
    console.log("\n🍎 iOS AppIcon (1024x1024):");
    await generateIcon(resolve(IOS_ASSETS, "AppIcon.appiconset/AppIcon-512@2x.png"), 1024);

    // ── iOS Splash ──
    console.log("\n🍎 iOS splash screens (2732x2732):");
    const iosSplashDir = resolve(IOS_ASSETS, "Splash.imageset");
    await generateSplash(resolve(iosSplashDir, "splash-2732x2732.png"), 2732, 2732);
    await generateSplash(resolve(iosSplashDir, "splash-2732x2732-1.png"), 2732, 2732);
    await generateSplash(resolve(iosSplashDir, "splash-2732x2732-2.png"), 2732, 2732);

    console.log("\n✅ All assets generated! Run 'npx cap sync' to copy them into native projects.\n");
}

main().catch((err) => {
    console.error("❌ Error generating assets:", err);
    process.exit(1);
});
