# 🎯 QUALITY ASSURANCE CHECKLIST

This document strictly tracks critical validation steps and release blockers before platform deployment. 

## 🟢 Pre-Launch Validation

### Application Integrity
- [x] Production build passes seamlessly via `npm run build`
- [x] Type check throws zero errors `npx tsc --noEmit`
- [x] Critical API and public-facing routes render flawlessly 
- [x] Form submission testing successfully interfaces with Firestore

### Progressive Web App (PWA) Standards
- [x] Service worker registration succeeds in client-side runtime
- [x] Web Manifest (`manifest.json`) accurately reflects core brand assets
- [x] "Add to Home Screen" prompt tested on modern mobile browsers
- [x] Offline asset caching operational via service worker

### Mobile Native Wrappers (Capacitor)
- [x] Android Studio environment verified (Local Environment)
- [x] Capacitor configuration mapped strictly to output bundles
- [ ] iOS compilation passes via remote MacOS environment proxy (Pending execution)
- [ ] iOS App Store asset provisioning finalized
- [ ] Android Play Store Keystore configurations generated

## 🧪 E2E Smoke Tests User Journeys

### User Management
- [ ] Sign-up / Login flows evaluate properly via Firebase Auth
- [ ] Password reset token triggers and directs standard email payloads
- [ ] Account Deletion permanently sanitizes nested Firestore dependencies

### Core Modules
- [ ] Event scheduling accepts future timestamps
- [ ] Custom celebration greeting generation persists media in Storage
- [ ] Admin Module access strictly blocked to non-authorized uid's
- [ ] Cross-sharing deep links direct straight to active cards safely

## 🔴 Release Blockers

- **[PRIORITY - HIGH]** Establish automated UI test coverage (Cypress / Playwright) core functionality paths.
- **[PRIORITY - HIGH]** Replace localized browser-timezone specific reminders with dynamic cloud-function-triggered Push Notifications.
- **[PRIORITY - MED]** Procure standard "Demo User" account strictly for iOS / Play Store manual QA reviews.
