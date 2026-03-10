# Congratss Native Packaging and QA

Last updated: 2026-03-06

## Current repo setup

The repo is now configured for Capacitor with:

- app name: `Congratss`
- app ID: `com.congratss.app`
- web bundle directory: `out`
- config file: `capacitor.config.ts`
- generated Android project: `android/`
- generated iOS project: `ios/`

## Commands

- `npm run build`
- `npm run cap:doctor`
- `npm run cap:copy`
- `npm run cap:sync`
- `npm run cap:open:android`
- `npm run cap:open:ios`

## First native bootstrap

1. Run `npm run cap:sync`
2. Run `npm run cap:open:android`
3. Run `npm run cap:open:ios`

## Manual QA checklist

### Browser/PWA

- sign up with a throwaway account
- sign in
- add a celebration
- confirm countdown days update correctly
- edit and delete a celebration
- open Pick & Send
- create a scheduled delivery
- open About, Privacy, Support, and Delete Account
- test in-app Delete Account

### Android native shell

- cold launch
- resume from background
- auth flow works
- celebration CRUD works
- share flow opens correctly
- support and delete-account pages open
- theme switching works
- no obvious safe-area or keyboard overlap issues

### iOS native shell

- cold launch
- resume from background
- auth flow works
- celebration CRUD works
- share flow opens correctly
- support and delete-account pages open
- theme switching works
- no obvious safe-area or keyboard overlap issues

## Known limits before store submission

- Android Studio is installed on this Windows machine, but Android SDK components are not yet provisioned
- Xcode/iOS testing still requires a Mac
- native notification implementation still pending
- app icons/splash assets still need final production exports
- current highest-resolution logo source in the repo is `public/logo.png` at `1024x905`, which is not yet a final square app-icon master
