# Congratss Native App Readiness Guide

Last updated: 2026-03-06

## Goal

Keep `congratss.com` working as the live PWA while preparing the Congratss mobile app for Google Play and the Apple App Store.

## Current repo state

Congratss already has a strong web baseline:

- Next.js app with Firebase Auth, Firestore, and Storage
- PWA manifest at `public/manifest.json`
- service worker at `public/sw.js`
- installable web metadata in `src/app/layout.tsx`
- public privacy page at `/privacy`

## What the app does today

Based on the current codebase, the app already supports:

- account sign-in with Firebase Auth
- celebration tracking
- calendar browsing
- greeting card sharing
- scheduled deliveries saved in Firestore
- browser notifications
- theme and language preferences

Current constraints that matter for store review:

- reminder notifications are browser notifications, not native push notifications
- "automatic" scheduled sends are only processed while the app is open
- there is no native shell yet
- there is no in-app account deletion entry point yet

## Recommended architecture

Use one shared web codebase plus a native shell:

1. Keep the current Next.js app as the single source of truth.
2. Continue shipping the website and PWA at `https://congratss.com`.
3. Add Capacitor for iOS and Android so the same app can be packaged as store binaries.
4. Add only the native plugins that are actually needed.

Why this is the best fit:

- Apple rejects thin website wrappers under App Store Review Guideline 4.2.
- Capacitor gives you a real iOS and Android project, better control over native UX, and room for native-only features later.
- It keeps product and engineering overhead much lower than maintaining separate native apps.

## Why not ship the PWA alone to stores

Android:

- A Trusted Web Activity or Bubblewrap wrapper can work for Play Store distribution.
- That is a valid Android fast path, but it does not solve iOS.

iOS:

- Apple requires the app experience to go beyond a repackaged website.
- If the iOS binary feels like a web clip inside a shell, review risk is high.

## Suggested delivery plan

### Phase 1: Store readiness

- keep the PWA live
- add support and account deletion URLs
- tighten privacy policy and data disclosures
- define app metadata, screenshots, icon, and review notes
- decide developer account ownership and package IDs

### Phase 2: Native shell

- install Capacitor
- add `ios` and `android` projects
- point the shell at the built web app
- configure app icon, splash, deep links, and associated domains
- verify auth, storage, sharing, and routing inside native containers

### Phase 3: Native-only work needed for approval quality

- add in-app account deletion
- replace browser-only reminder logic with a native notification strategy
- improve offline and loading states for native launch
- add app review demo credentials and review notes
- test on real iPhone and Android devices

## App-specific blockers to fix before submission

### Blocker 1: In-app account deletion

Both Apple and Google require a discoverable account deletion flow when account creation exists.

For Congratss this means:

- add a "Delete account" action inside settings/profile
- delete Auth account
- delete Firestore user document
- delete user celebrations
- delete scheduled messages
- explain any retention exceptions

### Blocker 2: Apple minimum functionality risk

The current product is useful, but the iOS binary needs to feel more native than "website in a shell."

Recommended native additions before iOS submission:

- native splash and launch polish
- native share sheet polish
- native haptics for actions like save/share/delete
- native local notifications
- native settings entry for account deletion/support

### Blocker 3: Notification claims

Do not market reminders as reliable background notifications until the native app actually supports them. Right now the web app only triggers reminders while the app is active and browser permission is granted.

### Blocker 4: Review/demo setup

The app requires login, so store review will need:

- a working demo account
- review notes explaining test steps
- live backend during review

## Android strategy note

If you want the fastest Android-only release while iOS work continues, you can ship Android first with either:

- Capacitor Android
- Bubblewrap / Trusted Web Activity

Recommended choice for this repo: Capacitor on both platforms for consistency.

## Native backlog after first submission

- native push notifications
- deep links into shared cards
- app badges
- contact import flow if you later add recipient helpers
- app analytics only if you explicitly choose and disclose them

## Source links

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple account deletion guidance: https://developer.apple.com/support/offering-account-deletion-in-your-app/
- Capacitor docs: https://capacitorjs.com/docs/
- Trusted Web Activity overview: https://developer.chrome.com/docs/android/trusted-web-activity/overview/
