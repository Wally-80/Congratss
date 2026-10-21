# Personalized publishing service

This service is deliberately separate from the static Next.js / Capacitor export. It serves personalized HTML with Open Graph metadata before JavaScript runs. Nothing in this branch deploys the service or rules.

## Contract

- `POST /api/cards`: verified Firebase bearer ID token, schema v1 JSON, optional UUID `Idempotency-Key`. Produces an immutable snapshot and canonical URL. Reusing a key with different content returns 409. Limit: 20 new publications per owner per UTC day, enforced transactionally.
- `GET /api/cards`: authenticated owner's first 50 active snapshots for sharing/revocation. Full pagination is an outstanding enhancement.
- `DELETE /api/cards/:id`: authenticated owner revocation. Public requests return 404 afterward. External cached previews/downloads cannot be recalled.
- `DELETE /api/cards`: remove this owner's published snapshots during account deletion. Existing account deletion also removes `card_drafts` and local account draft copies.
- `GET /c/:id`: public HTML, metadata, expandable details, device-local checklist, validated HTTPS/email/phone links. No arbitrary scripts/HTML, recipient tracking, or persisted RSVP responses.
- `GET /c/:id/og.png`: 1200×630 social preview with abbreviated content.
- `GET /c/:id/image.png?download=1`: full personalized PNG including message/details/checklist. Links remain interactive only on the HTML page.
- `GET /health`: process readiness, not a database health guarantee.

`card_drafts` are private owner documents. `published_cards` and `publishing_quotas` deny all client SDK access. The Admin service writes them after verifying the ID token including revocation and verified-email status. Public HTML never returns owner IDs, draft IDs, tokens, or quota records. It uses no external asset fetching, preventing image-rendering SSRF. Titles and messages are escaped in HTML and SVG. Public responses use no-store; recipient pages discourage indexing. A link remains public to anyone who knows it.

## Local development (demo emulators only)

Use Node 24, Java 21, and `npm ci`. Firebase's emulator JARs download from `storage.googleapis.com` with the CLI's normal checksum validation.

Terminal 1, from the repository root:

```sh
npx firebase emulators:start --project demo-congratss --config firebase.emulators.json --only auth,firestore,storage
```

Terminal 2:

```sh
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
PUBLISHER_PROJECT_ID=demo-congratss \
PUBLISHER_PUBLIC_ORIGIN=http://127.0.0.1:8787 \
PUBLISHER_APP_ORIGIN=http://127.0.0.1:3001 \
PORT=8787 npm run publisher
```

Terminal 3, set these non-secret **demo** client values in the shell, overriding any local Firebase configuration:

```sh
NEXT_PUBLIC_USE_EMULATORS=true \
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-congratss \
NEXT_PUBLIC_FIREBASE_API_KEY=demo-public-key \
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-congratss.firebaseapp.com \
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-congratss.appspot.com \
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:demo \
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 \
NEXT_PUBLIC_PUBLISHER_URL=http://127.0.0.1:8787 \
npm run dev -- --hostname 127.0.0.1 --port 3001
```

The browser's emulator mode refuses real project IDs. The service refuses mixed emulator/real-project configuration. Tests use demo identities only; never submit real credentials. The integration test creates verified test users through the Auth emulator, then exercises genuine emulator ID tokens, Firestore transactions, quotas and ownership.

## Cloud proxy note

Firebase CLI 15.34 routes its internal Storage-to-Firestore REST calls through `HTTPS_PROXY` even when `NO_PROXY` includes loopback. In a proxy-managed development machine, first download the two emulators through the configured proxy (`npx firebase setup:emulators:firestore` and `npx firebase setup:emulators:storage`). Then run the local-only tests with those four proxy variables cleared:

```sh
HTTPS_PROXY= HTTP_PROXY= https_proxy= http_proxy= npm run test:security
HTTPS_PROXY= HTTP_PROXY= https_proxy= http_proxy= npm run test:e2e:emulators
```

Set `FIREBASE_EMULATORS_PATH` and `XDG_CONFIG_HOME` to writable locations if the home directory is read-only. Do not use Firebase CLI `--debug` in shared logs because it dumps environment values. TLS/checksum verification remains enabled for downloads. This workaround is only for loopback emulator traffic, not live Firebase operations.

## Future deployment requirements — review only

No hosting target, service account, production project, or domain is selected by this implementation. A reviewer must approve those before a separate deployment task.

Set `PUBLISHER_PROJECT_ID`, `PUBLISHER_PUBLIC_ORIGIN` (HTTPS), `PUBLISHER_APP_ORIGIN` (HTTPS), optional comma-separated `PUBLISHER_ALLOWED_ORIGINS`, and `PORT`. Use workload identity/application-default credentials with scoped IAM; never browser credentials or committed private key files. Explicitly grant the runtime the Firestore and Firebase Auth permissions required to verify revocation and manage publications. Use an isolated staging project first.

Set `NEXT_PUBLIC_PUBLISHER_URL` before building the web/native app. Without it publishing stays disabled; creation, preview and device drafts work. Account draft saving needs the reviewed rules to be deployed separately, so existing production rules will reject new collection writes until that approved rollout.

Either host a dedicated card origin, or route `/api/cards/**` and `/c/**` to this service before static hosting. The service accepts exact origins, not wildcard CORS. For a future native rollout explicitly add its configured origin (for example `capacitor://localhost` for iOS or `https://localhost` for Android) to `PUBLISHER_ALLOWED_ORIGINS`; this does not grant authentication. Configure request/body/concurrency limits and abuse monitoring at the hosting boundary, plus a data-retention policy for daily quota records. Install DejaVu Sans and appropriate Unicode fallback fonts in the service runtime for Pango text rendering. Container image/native Sharp compatibility and service IAM need staging validation. No provider keys, send permissions, payment services or production migrations are required for this implementation.

Messaging is a user-confirmed handoff. iMessage uses the device share sheet/SMS handler; WhatsApp, SMS and email prefill content. Platform previews and attachment handling vary. We never report delivery confirmation. AI is not connected and never rewrites a message.

## Rollback / compatibility

Keep the prior app build and rule release available. Do not rename old collections or delete legacy data. `/card?id=...` and `/card?img=...` continue to work; the old card library is not migrated. `/dashboard` retains the prior application and auth flows; installed apps retain dashboard startup. New data uses version 1 and can remain untouched during a UI rollback. Revoked publications return 404, but externally cached previews may remain.
