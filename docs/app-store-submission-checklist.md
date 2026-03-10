# Congratss App Store Submission Checklist

Last updated: 2026-03-06

## Immediate status

The PWA is active and can stay active.

The app is not yet ready for store submission because these items are still open:

- no native iOS/Android wrapper project in the repo
- no in-app account deletion flow
- no final store screenshots, icon set, and feature graphics pack
- no review/demo account documented
- no app binary has been tested through TestFlight or Play internal testing yet

## 1. Business and account setup

### Apple

- enroll in Apple Developer Program
- decide whether the app is submitted under an individual or organization account
- create app record in App Store Connect
- reserve bundle ID, for example `com.gratzz.app`

### Google

- create or verify Google Play developer account
- choose personal or organization account correctly
- create app record in Play Console
- enable Play App Signing
- reserve package name, for example `com.gratzz.app`

## 2. Product and technical preparation

- keep `congratss.com` deployed and stable
- add Capacitor with `ios` and `android` targets
- confirm auth works inside native shell
- confirm sharing flows work inside native shell
- confirm deep links for shared cards work
- confirm privacy/support/delete-account URLs are public
- add production app icons and launch assets
- test on real iPhone and Android hardware

## 3. Compliance work

- final privacy policy
- final support page
- final account deletion web page
- in-app account deletion entry point
- App Store privacy answers
- Google Play Data safety form
- content rating questionnaires
- export compliance answers in App Store Connect

## 4. Store asset pack

- app icon
- screenshots
- optional preview video
- Google Play feature graphic
- short and full store descriptions
- Apple subtitle, promotional text, keywords
- support URL
- privacy policy URL
- marketing URL
- review notes

## 5. Apple submission process

### Build and metadata

1. Create the iOS app record in App Store Connect.
2. Add the bundle ID, app name, subtitle, category, age rating, support URL, marketing URL, and privacy policy URL.
3. Upload the iOS build from Xcode or CI.
4. Attach the build to the app version.
5. Upload screenshots and optional app previews.
6. Complete App Privacy answers.
7. Add App Review Information, including demo credentials and any special steps.

### Review and release

1. Click `Add for Review`.
2. Click `Submit for Review`.
3. Respond quickly to reviewer messages.
4. After approval, choose manual release, automatic release, or scheduled release.

### Apple-specific review risks for Congratss

- thin web wrapper risk under guideline 4.2
- missing in-app account deletion
- inaccurate metadata if screenshots promise background reminders that are not implemented natively
- delayed review if demo credentials are missing

## 6. Google Play submission process

### Setup

1. Create the app in Play Console.
2. Fill in app details, contact email, website, and privacy policy.
3. Upload Android App Bundle (`.aab`).
4. Complete App content declarations.
5. Complete Data safety.
6. Complete content rating questionnaire.
7. Upload store listing assets.

### Testing and release

1. Start with Internal testing.
2. Move to Closed testing.
3. If the developer account is a new personal account, satisfy the required closed test threshold before production access.
4. Promote the tested build to Production.
5. Monitor policy warnings and pre-launch report output.

### Google-specific review risks for Congratss

- missing in-app and web account deletion
- privacy policy not matching actual app behavior
- Data safety form under-declaring account, contact, or user-generated data
- screenshots or copy overstating automation

## 7. What to upload to each store

### Apple

- iOS build
- app icon in Xcode asset catalog
- iPhone screenshots
- iPad screenshots if the app runs on iPad
- subtitle
- promotional text
- description
- keywords
- support URL
- marketing URL
- privacy policy URL
- app privacy answers
- review notes and demo login

### Google

- Android App Bundle
- 512x512 Play icon
- 1024x500 feature graphic
- phone screenshots
- tablet screenshots if targeting large screens
- app name
- short description
- full description
- support email
- support website
- privacy policy URL
- Data safety form
- account deletion URL

## 8. Review notes template

Use this in both stores after native packaging exists:

```text
Congratss is a celebration reminder and greeting-sharing app.

Reviewer test account:
Email: [demo email]
Password: [demo password]

Primary flows to test:
1. Sign in
2. Add a celebration
3. Open the greeting share flow
4. Schedule a delivery
5. Open Settings / Privacy / Support / Delete Account

Important notes:
- Shared card links open the web card viewer.
- Reminder behavior depends on notification permission.
- Do not evaluate background reminder claims unless native notification support is present in this build.
```

## 9. Final go/no-go gate

Do not submit until all of these are true:

- native iOS and Android builds exist
- in-app account deletion exists
- store copy matches real behavior
- screenshots are final and localized
- privacy policy is complete and public
- support page is public
- delete-account page is public
- review credentials are documented
- app is tested on real devices

## Source links

- Apple submit flow: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app
- Apple review overview: https://developer.apple.com/distribute/app-review/
- Google app setup: https://support.google.com/googleplay/android-developer/answer/9859152
- Google testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Google preview assets: https://support.google.com/googleplay/android-developer/answer/9866151
- Google Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
