# Implementation plan

1. Add demo-project emulator tests; fix privilege-field diffs, require verified email admins, constrain owner writes and private storage. Preserve legacy fields and public library paths. Fix lint with reusable image handling.
2. Retain static Next/Capacitor export. Move dashboard without altering collection identities. Introduce marketing components and original SVG artwork.
3. Share a versioned Zod schema between creator and publisher. Local drafts plus authenticated Firestore drafts. Separate presentational preview and sharing logic.
4. Add an independent Express publishing service using Firebase Admin and application-default credentials in deployment. Require verified Firebase ID tokens, bound origins, body limits, immutable publish IDs and per-owner transaction quotas. Fail closed without configuration. No credential files committed.
5. Use a Firebase demo project only for integration tests. API service renders public HTML and PNG with escaped text and allowlisted actions. Explicit hosting deployment instructions are documentation, not automatic rewrites or deployment.
6. Validate rules, API, schema, browser flows, accessibility basics, lint and static build. Capture desktop/mobile screenshots. Create review PR with no merge/deploy.

## Security decisions

Existing role documents remain supported but client privilege mutations are forbidden. Verified legacy email administrators retain access; trusted custom claims are preferred. Existing public user_uploads reads remain for compatibility; unknown storage paths become private. Publishing requires an explicitly configured public HTTPS origin and allowed client origins in production. Public snapshots are bearer-link public, immutable, with owner revocation. No private draft is served publicly. Initial quotas use Firestore transactions rather than process-local counters. Interactive buttons are external links, call/email or calendar links; no arbitrary executable content. RSVP persistence is outside these phases.
