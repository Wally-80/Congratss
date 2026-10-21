# Congratss 2.0

Approved scope: phases 0–3 on feature/congratss-2-modernization, based on gratzz-zero. No production deployment, rule publication, or live data changes.

## Acceptance

- Existing celebrations, authentication, countdowns, calendar, library links and account preferences remain usable at /dashboard.
- Verified administrators retain catalog access; ordinary users cannot grant privileges. Owner isolation and legacy payload compatibility are emulator-tested.
- Public homepage uses original glossy vector characters, responsive midnight styling, keyboard access and reduced motion.
- /create supports seven purposes, templates, exact user-authored content, live preview, expandable details, checklist and validated buttons. Local drafts work without login; account drafts are owner-only.
- Publishing is an explicit public action. A versioned immutable snapshot is published by an authenticated API, never by direct public Firestore writes. Public HTML includes crawler-readable OG metadata; PNG export reflects personal content. Legacy /card links remain supported.
- Sharing hands off to platforms and makes no delivery guarantees. AI is optional and unavailable until a secure provider integration is configured; no automatic rewriting.

## Non-goals

Billing, autonomous delivery, production migration, deployment, production rule changes and live Firebase data inspection.
