# Congratss Native Asset Replacement Map

Last updated: 2026-03-06

## Goal

Replace Capacitor's default placeholder icons and splash art with final Congratss assets before store submission.

## Current source assets in the repo

- `public/logo.png` -> `1024x905`
- `public/logo-256.png` -> `256x256`
- `public/pwa-512.png` -> `512x512`
- `public/apple-touch-icon.png` -> `180x180`

## Asset gap

You still need a final square master icon for stores and native launch assets.

Recommended deliverables:

- app icon master: `1024x1024` PNG
- Android Play icon: `512x512` PNG
- Android feature graphic: `1024x500` PNG or JPG
- splash master: at least `2732x2732` PNG with safe centered artwork

## Android files to replace

Launcher icons:

- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png`

Adaptive icon layers:

- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`
- `android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png`
- `android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png`
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png`
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png`
- `android/app/src/main/res/values/ic_launcher_background.xml`

Splash images:

- `android/app/src/main/res/drawable/splash.png`
- `android/app/src/main/res/drawable-port-mdpi/splash.png`
- `android/app/src/main/res/drawable-port-hdpi/splash.png`
- `android/app/src/main/res/drawable-port-xhdpi/splash.png`
- `android/app/src/main/res/drawable-port-xxhdpi/splash.png`
- `android/app/src/main/res/drawable-port-xxxhdpi/splash.png`
- `android/app/src/main/res/drawable-land-mdpi/splash.png`
- `android/app/src/main/res/drawable-land-hdpi/splash.png`
- `android/app/src/main/res/drawable-land-xhdpi/splash.png`
- `android/app/src/main/res/drawable-land-xxhdpi/splash.png`
- `android/app/src/main/res/drawable-land-xxxhdpi/splash.png`

## iOS files to replace

App icon catalog:

- `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json`

Splash image catalog:

- `ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732.png`
- `ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-1.png`
- `ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-2.png`
- `ios/App/App/Assets.xcassets/Splash.imageset/Contents.json`

## Recommended visual direction

Icon:

- use the Congratss mark centered on a dark background
- keep the silhouette simple and readable at small sizes
- avoid tiny text or fine detail

Splash:

- dark background matching app tone
- centered Congratss logo
- generous safe margins for all aspect ratios

## Before store submission

- export final icon master
- regenerate native icons/splash assets
- replace the placeholder files above
- test on real Android and iPhone hardware
