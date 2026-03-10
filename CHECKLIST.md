# CHECKLIST

## Current validation status

- [x] Production build passes with `npm run build`
- [x] Type check passes with `npx tsc --noEmit`
- [x] Key public routes build successfully: `/`, `/about`, `/auth`, `/card`, `/privacy`
- [x] Exported route artifacts exist in `out/` for `/privacy` and `/auth`
- [x] PWA metadata is present: `manifest.json`, Apple web app metadata, service worker registration
- [x] Countdown-days messaging is included in launch-facing descriptions
- [x] Auth page includes `About` and `Privacy` links
- [x] Main settings surface does not include `Support` and `Delete Account`
- [x] In-app account deletion flow exists for password-based accounts
- [x] Capacitor is configured with Android and iOS project folders
- [x] Android Studio is installed on this Windows machine
- [ ] Manual browser smoke test on desktop
- [ ] Manual browser smoke test on mobile
- [ ] Real-device PWA install test on iPhone
- [ ] Real-device PWA install test on Android

## Smoke test checklist

- [ ] Open `/` and verify app loads without console/runtime errors
- [ ] Sign up with a test account
- [ ] Sign in with an existing test account
- [ ] Add a celebration and confirm countdown days display correctly
- [ ] Edit a celebration
- [ ] Delete a celebration
- [ ] Open calendar view and verify event rendering
- [ ] Open Pick & Send and verify card loading
- [ ] Test link copy/share flow
- [ ] Test scheduled delivery creation
- [ ] Open `About` and `Privacy`
- [ ] Trigger in-app `Delete Account` with a throwaway password account
- [ ] Test notification permission toggle
- [ ] Confirm service worker install/update behavior in production

## Store-readiness blockers

- [x] Add in-app `Delete Account` entry point from settings/profile
- [x] Implement full account deletion flow for Auth + Firestore user data + celebrations + scheduled messages
- [x] Build native wrapper with Capacitor for iOS and Android
- [ ] Replace browser-only reminder behavior with native notification strategy for store builds
- [ ] Create final app icons, screenshots, and feature graphic
- [ ] Prepare App Store privacy answers and Google Play Data safety form
- [ ] Create review/demo account for Apple and Google review teams
- [ ] Test native builds on real iPhone and Android devices

## Notes from latest validation

- [x] No TypeScript errors found
- [x] No build errors found
- [x] Android and iOS Capacitor shells were generated and synced successfully
- [ ] Android SDK components are still not installed/configured
- [ ] Xcode testing requires a separate Mac environment
- [ ] Manual auth/data flows still require a live browser session with Firebase
- [ ] Native builds cannot be compiled on this machine yet because Android SDK / Xcode are not installed
- [ ] Non-blocking lint warnings remain for `<img>` usage in `src/components/Logo.tsx` and `src/app/page.tsx`
