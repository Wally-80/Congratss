# Congratss Legal and Store Compliance Matrix

Last updated: 2026-03-06

## Purpose

This file maps the current codebase to the disclosures likely needed for Apple App Privacy and Google Play Data safety.

This is an engineering-prep document, not legal advice.

## Current data map from the repo

### Account data

Source:

- Firebase Auth in `src/lib/firebase.ts`
- auth state and profile handling in `src/context/AuthContext.tsx`

Current data used:

- email address
- Firebase user ID
- auth provider
- optional display name
- optional profile photo URL
- email verification state

### User settings and profile data

Source:

- Firestore `users/{userId}` in `src/context/AuthContext.tsx`

Current data used:

- language
- notifications enabled flag
- onboarding completed flag
- timestamps
- optional admin flags for internal management

### Celebration data

Source:

- Firestore rules in `firestore.rules`
- celebration hooks and components in `src/hooks/useCelebrations.ts`

Current data used:

- title
- raw date
- type
- optional custom type label
- user ID

### Scheduled delivery data

Source:

- `firestore.rules`
- `src/hooks/useScheduledMessages.ts`

Current data used:

- celebration title
- channel (`whatsapp`, `email`, `sms`)
- recipient
- message
- share URL
- card label
- card URL
- scheduled time
- status
- user ID

### Greeting card library data

Source:

- `src/lib/cardService.ts`
- `storage.rules`

Current data used:

- public card image/video URL
- label
- category
- locale

Notes:

- admin uploads to the public greeting card library are stored in Firebase Storage
- this is not the same as normal user message attachments

### Device-local data

Source:

- `localStorage` use in `src/context/AuthContext.tsx`
- browser notification dedupe in `src/app/page.tsx`

Current device-local storage:

- language preference
- onboarding flags
- notification dedupe keys
- service worker cache

### Local-only user media

Source:

- `src/components/SendGreetingModal.tsx`

Current behavior:

- local uploads used in the greeting flow stay on the device
- they are shared as files through device/browser share features
- they are not uploaded to your backend in the normal user flow

## What the app does not appear to collect

- payment card data
- precise location
- health data
- government ID data
- advertising identifiers
- third-party analytics SDK data

## Store disclosure starting point

### Apple App Privacy draft

Likely collected:

- Contact Info: email address
- User Content: celebration titles, optional custom labels, scheduled messages, recipient entries
- Identifiers: user ID
- Usage-adjacent app data: settings/preferences stored with the user profile

Likely not used for:

- third-party advertising
- cross-app tracking
- data broker sharing

Needs manual confirmation before filing:

- whether optional profile photo URL should be declared as user content or contact/profile data
- whether scheduled recipient fields should be disclosed as contact info

### Google Play Data safety draft

Likely declare collected:

- Personal info: email address, optional name/profile data
- App activity / user content: celebrations, messages, scheduled delivery content
- App info and performance: only if later SDKs are added, currently none obvious

Likely declare security practices:

- data encrypted in transit
- account creation supported
- users can request deletion

Needs manual confirmation before filing:

- whether any diagnostic logging SDKs exist outside the repo
- whether production hosting adds analytics beyond app code

## Required public URLs

These URLs should exist and remain stable:

- `https://congratss.com/privacy`
- `https://congratss.com/support`
- `https://congratss.com/delete-account`

## Current compliance gaps

### Gap 1: In-app account deletion

Current state:

- public deletion URL can exist
- in-app deletion entry point still needs implementation

Why it matters:

- Apple requires account deletion initiation in-app
- Google requires deletion initiation both in-app and outside the app when accounts can be created in-app

### Gap 2: Privacy policy retention/deletion detail

Current state:

- the old privacy page did not fully explain retention and deletion

Action:

- keep retention, support, and deletion sections current

### Gap 3: Marketing claims vs real behavior

Current state:

- scheduled sends depend on the app being active
- reminders are browser-based today

Action:

- avoid promising always-on background behavior until native support exists

## Operational policy to adopt before launch

- process account deletion requests within a defined SLA
- keep an internal deletion checklist for Auth, Firestore, and any future native analytics tools
- keep privacy policy versioned with update dates
- review store disclosures every release that adds SDKs, permissions, or background processing

## Source links

- Apple app privacy help: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
- Apple account deletion guidance: https://developer.apple.com/support/offering-account-deletion-in-your-app/
- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data safety help: https://support.google.com/googleplay/android-developer/answer/10787469
