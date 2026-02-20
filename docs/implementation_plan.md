# Gratzz: Implementation Plan (gratzz.com)

## Goal Description
A beautiful, super-easy tracker for birthdays, anniversaries, and retirement countdowns. Starting as a Web App/PWA with a path to native mobile apps.

## Product Plan (A)
**Product Summary:**  
The Gratzz app is a high-aesthetic, mobile-first utility designed to eliminate "reminder fatigue." Unlike cluttered social calendars, it focuses on the most meaningful life events: the people you care about and the milestones you're working toward (like retirement). It combines a streamlined "Upcoming" dashboard with powerful sharing tools and a built-in greeting generator.

**Target Users:**  
- **Family Organizers:** Keeping track of extended family milestones.  
- **Social Connectors:** People who want to maintain high-quality social relationships via timely greetings.  
- **Goal Achievers:** Professionals focused on retirement or major life transitions.

**Roadmap:**
- **MVP:** Core auth, manual tracking (birthdays/anniversaries/retirement), dashboard view, basic reminders (email/browser), and simple "Send Greeting" via WhatsApp/SMS.
- **V1:** PWA push notifications, CSV/Contact imports, retirement countdown widgets, greeting card generator.
- **V2:** Full Google/iCloud calendar sync, AI-powered greeting suggestions, native iOS/Android apps with lock-screen widgets.

**Pricing Ideas:**
- **Free:** Unlimited birthdays/anniversaries, basic counting, sharing features, and 3 retirement slots.
- **Premium ($2.99/mo or $19.99/yr):** PWA push notifications, advanced reminder schedules, custom "Greeting Card" brand removal, and unlimited cloud sync with data backup.

**Privacy-First Approach:**
- **Encryption:** All user data is isolated via Firestore Rules. Personal notes and gift ideas can be optionally encrypted client-side.
- **Minimal Data:** Only required fields (name, date, type) are stored.
- **Data Sovereignty:** GDPR-compliant export (JSON/CSV) and "Delete My Account" button are standard features.

## UX/UI Plan (B)
![Celebrations Tracker Mockup 1](/Users/walterpomalaza/.gemini/antigravity/brain/5e6b4d8b-abcb-4c0c-bb11-fb684ecd42f4/tracker_dashboard_mockup_1769736638015.png)
![Celebrations Tracker Mockup 2](/Users/walterpomalaza/.gemini/antigravity/brain/771a9681-3a5d-4806-b517-fcf557e6a7ce/uploaded_media_1769742712063.png)

**Sitemap:**
1. **Onboarding:** Splash -> Auth -> "Add your first occasion"
2. **Dashboard (Upcoming):** Chronological list of events in 7/14/30/90 days.
3. **Calendar View:** Visual month-by-month grid.
4. **Occasion Detail:** Countdown, age/milestone, notes, gift ideas, and sharing actions.
5. **Settings:** Profile, notification schedules, timezone, and data export.

**UI Components:**
- **Mode:** Dedicated Dark Mode (Sleek black/slate with accent neon or soft pastels).
- **Cards:** Modern glassmorphism style for event cards.
- **Micro-interactions:** Smooth transitions when adding/deleting events; celebratory animations on the day of an event.
- **Empty States:** "No celebrations soon? Add a friend's birthday to start the countdown!"

## Technical Architecture (C)
**Tech Stack:**
- **Frontend:** Next.js (App Router) for superior SEO, performance, and built-in API routes. TypeScript for type safety.
- **State Management:** React Context + Firestore real-time listeners.
- **Backend:** Firebase Auth & Firestore. Cloud Functions for scheduled notification triggers (cron).
- **Styling:** Vanilla CSS or Tailwind (Clean, responsive design system).

**Data Model (Firestore):**
- **Users (collection):** `{ uid, email, preferences: { timezone, reminderSchedule: [] } }`
- **Occasions (collection):** 
  ```json
  {
    "userId": "uid",
    "name": "Jane Doe",
    "type": "birthday | anniversary | retirement | other",
    "date": "Timestamp (UTC)",
    "isRecurring": true,
    "notes": "Loves gardening",
    "giftIdeas": ["Gloves", "Sun hat"],
    "createdAt": "Timestamp"
  }
  ```

**Notification Flow:**
1. User sets a reminder (e.g., 7 days before).
2. Cloud Function runs every 24h, scanning `Occasions` for upcoming dates matching `reminderSchedule`.
3. Triggers Web Push (via FCM) to the user's registered PWA tokens.

## Execution Plan (D)
**Step-by-Step Build Order:**
- **Week 1:** Setup (Next.js, Firebase, Auth) + Dashboard UI skeleton.
- **Week 2:** Core Tracking (Add/Edit/Delete) + Firestore integration.
- **Week 3:** Notifications (FCM setup, Service Workers, PWA Manifest).
- **Week 4:** Imports/Exports (CSV, Browser Contact API) + Sharing Templates.
- **Week 5:** Refinement (Dark Mode, Animations, Documentation).

## Risks & Constraints (E)
- **Facebook Import:** Facebook no longer allows direct scraping or easy friend birthday exports via API. **Alternative:** Guide users to download leur Facebook data and provide a "Facebook JSON/HTML Import" tool.
- **Lock-screen Widgets:** PWAs cannot native lock-screen widgets on iOS. **Path:** Move to **Capacitor + React Native** to wrap the Next.js app, enabling native widget development for iOS/Android.
- **iOS Push Notifications:** Requires Safari 16.4+ and user to "Add to Home Screen." Clear user guidance (onboarding) is critical.
