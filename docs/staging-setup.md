# Congratss isolated staging

Status: configuration/build preparation only. No staging or production deployment has been performed. Existing production defaults in `.firebaserc` and `firebase.json` are unchanged. Do not run a bare `firebase deploy` from this checkout.

## 1. Create the separate project (project owner)

1. Open https://console.firebase.google.com/ and choose **Create a project** / **Add project**.
2. Name it **Congratss Staging**. Select an available project ID containing `staging`, for example `congratss-staging-2026`. The build helper intentionally requires this naming convention. Never select `gratzz`.
3. Google Analytics is optional; leave it off for this review environment.
4. Create the project. Record its project ID under **Project settings → General**.
5. Under **Your apps**, choose the web `</>` icon, register **Congratss Staging Web**, and copy its Firebase web configuration. Do not select Hosting setup in this wizard. These are public client settings; never share a service-account JSON/private key, password or login token in chat.

Project creation/web registration do not require enabling paid publisher hosting. Do not copy production users, data, buckets, Firebase keys or service accounts into staging.

## 2. Prepare test services (staging project only)

After checking the staging project ID in the Console header:

- Authentication: get started and enable Email/Password. Create only test identities. Add the eventual preview hostname to Authentication's authorized domains. Google sign-in can be enabled separately if needed.
- Firestore: create a database in **production/locked mode**, selecting an appropriate region. Do not use open test-mode rules. Reviewed repository rules can be applied to staging during the separately authorized rollout.
- Storage: optional for the initial homepage/creator preview. Firebase may require Blaze billing to provision/use Storage; stop at a billing prompt until costs are approved. New publisher cards use Firestore and render images on demand, without Storage. Legacy image upload validation requires a staging bucket later.
- Never assign a real production user's UID/admin record to a test account. Test admin permissions using a separate controlled test identity.

## 3. Build the isolated frontend (engineer)

Copy `config/staging.example.json` to ignored `config/staging.local.json`. Replace all Firebase settings together with the exact web configuration from the new project. `apiKey` and `appId` cannot be proven to belong to a project by offline string checks; verify their Console source. The helper validates domain, bucket and project naming, and sender/app ID consistency.

Leave `publisherOrigin` empty initially. Publishing remains disabled while homepage, local drafts and previews can be reviewed. Cloud drafts/auth require the configured staging services and reviewed staging rules.

```sh
npm run staging:prepare -- config/staging.local.json --check
npm run staging:prepare -- config/staging.local.json --build
```

The second command runs Next's static build with explicit staging public environment variables, overriding production `.env.local` settings. It generates ignored `.staging/out`, `.staging/firebase.json`, and `.staging/project.json`. It performs no network calls to Firebase and no deployment. It uses the usual `.next` and `out` build directories; do not run concurrently with the dev server/build. Only `.staging/out` is a staging hosting artifact: the ordinary `out` still includes the legacy worker copied by Next.

Push initialization/registration is disabled in the staging build, and the exported legacy production-configured messaging worker is replaced with a no-op. Robots/noindex headers discourage indexing; they are not access controls. Use synthetic content only. No Google credentials are embedded. There is no automatic deployment workflow.

## 4. Connect account and review the rollout

The current cloud environment has no signed-in Firebase account. An engineer needs an approved identity with access **only to staging**. Prefer CI workload identity for future automation; do not commit keys or paste login tokens in chat. Interactive login is `firebase login --no-localhost` on a trusted terminal. Never use `--debug` in shared cloud logs.

Before an actual preview rollout, review the generated project manifest/config and confirm the staging project ID again. Commands must specify BOTH `--project STAGING_PROJECT_ID` and `--config .staging/firebase.json`; the production default must never be used. Rules and hosting should be separate commands with explicit `--only` targets. Do not run either as part of this preparation task.

Suggested first rollout is a short-lived Firebase Hosting preview channel in the separate project, with an explicit expiry. Rules for new draft storage still need their own staging rollout first. A Hosting preview channel by itself does **not** isolate Firebase data; this separate-project build is essential.

## 5. Publisher and complete sharing preview

Recommend a separate Cloud Run publisher in the staging project, a dedicated staging runtime identity, and an HTTPS service origin. This is a proposed deployment target, not a provisioned service. Region, billing, IAM, resource/concurrency limits and service visibility need review before provisioning. The existing publisher requires ADC and explicit `PUBLISHER_PROJECT_ID`, `PUBLISHER_PUBLIC_ORIGIN` and `PUBLISHER_APP_ORIGIN`. Use the exact stable app origin for CORS, not a wildcard. See [publisher operations](../services/publisher/README.md).

The runtime needs Firestore publication/query/transaction access and Firebase Auth user lookup for revocation checks. Configure least privilege in staging, and verify actual denied/allowed calls before any future production plan. No production service account should be reused. Native Sharp and Unicode fonts need validation in the chosen image/runtime. No container/runtime has been built or deployed by this preparation.

Published card HTML/images must be accessible to unauthenticated messaging crawlers; authenticated write APIs still require verified Firebase ID tokens. A provider login wall over the entire publisher prevents Open Graph previews. Test content is public to anyone with its link. Review costs/abuse limits before exposing the service. Set the verified staging publisher origin in the local config, then rebuild the frontend.

## 6. Staging acceptance

- Confirm requests/auth tokens target the staging project; no production Firebase requests or push registration.
- Test new-account sign-in, account/device drafts, reload, sign-out/account switching, celebrations/countdowns/calendar and legacy card routes with synthetic fixtures.
- Exercise rules as guest, owner, another user, and controlled admin; prove cross-owner access fails.
- Once publisher is available: publish, inspect crawler-visible metadata and PNG, revoke, verify owner isolation/quota behavior.
- Check homepage/creator on actual iOS/Android devices, then WhatsApp/iMessage/SMS/email handoffs and preview caches.
- Keep production unchanged and PR unmerged. Preview completion is not approval to deploy production.

When preview review ends, expire the Hosting channel, remove staging test identities/content and disable the staging publisher according to the approved retention plan. Do not touch production resources.
