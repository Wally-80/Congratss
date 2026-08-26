// Single source of truth for legal/company details shown in the
// Terms of Service, Privacy Policy, and Security pages, and recorded
// on the user document when they accept the legal agreements.

// Registered legal entity that owns and operates the app.
export const LEGAL_ENTITY = "ERD Systems LLC";

// Trade name (DBA) the app operates under.
export const APP_DBA = "Congratss";

// Contact address shown on all legal pages. Point this at a mailbox you
// actually monitor (e.g. a congratss.com alias) before going live.
export const LEGAL_CONTACT_EMAIL = "support@congratss.com";

// U.S. state where ERD Systems LLC is organized (e.g. "New Jersey").
// Leave empty to fall back to generic "state of organization" wording
// in the governing-law clause until you fill it in.
export const GOVERNING_STATE = "";

// Bump this whenever the Terms or Privacy Policy materially change.
// It is stored on users/{uid} as termsVersion at acceptance time, so you
// can tell which version each user agreed to.
export const TERMS_VERSION = "2026-08-25";

export const LEGAL_LAST_UPDATED_EN = "August 25, 2026";
export const LEGAL_LAST_UPDATED_ES = "25 de agosto de 2026";
