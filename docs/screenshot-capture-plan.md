# Congratss Screenshot Capture Plan

Last updated: 2026-03-06

## Goal

Capture a clean, consistent screenshot set for App Store Connect and Google Play using the real Congratss UI.

## Capture rules

- use a real signed-in test account with polished sample data
- use the same theme across the full set
- avoid placeholder or broken image states
- hide notifications and system clutter
- keep copy consistent across screens
- use the same language per set

## Test account data to prepare before capture

Add at least:

- 2 birthdays
- 1 anniversary
- 1 retirement or graduation
- 1 custom event
- 1 scheduled delivery

Make sure at least one event shows:

- `today`
- `1 day left`
- `7 days left`
- longer countdown values

## English screenshot set

### Shot 1: Home / Countdown

Overlay title:

`Track every countdown day`

Screen state:

- home tab
- multiple upcoming celebrations visible
- at least one clear countdown number visible

### Shot 2: Calendar

Overlay title:

`See your month at a glance`

Screen state:

- calendar tab
- several days highlighted
- selected day shows event details

### Shot 3: Pick & Send

Overlay title:

`Send a card in a few taps`

Screen state:

- greeting card modal open
- card thumbnails visible
- message section visible

### Shot 4: Schedule

Overlay title:

`Plan future deliveries`

Screen state:

- scheduled delivery UI open
- date and time selected
- recipient/channel visible

### Shot 5: Settings

Overlay title:

`Make it yours`

Screen state:

- settings tab
- language, theme, notifications, support, and delete-account actions visible

### Shot 6: Organization

Overlay title:

`Keep celebrations organized`

Screen state:

- home tab or settings panel with a balanced, polished composition

## Spanish screenshot set

- `Cuenta cada dia importante`
- `Tu calendario en un vistazo`
- `Comparte tarjetas rapido`
- `Programa envios futuros`
- `Configura idioma y tema`
- `Organiza cada celebracion`

## Device targets

### Apple

Minimum recommended first pass:

- iPhone 6.9-inch class screenshots
- iPhone 6.5-inch class screenshots

Only capture iPad if you intend to support iPad properly.

### Google Play

Minimum recommended first pass:

- phone screenshots only

Add tablet screenshots only if tablet UX looks deliberate and finished.

## Capture sequence

1. Sign in with the prepared demo account.
2. Verify theme, language, and sample data.
3. Capture all English shots in one run.
4. Switch to Spanish.
5. Capture all Spanish shots in one run.
6. Review for consistency before adding overlays.

## File naming convention

Use:

- `apple-en-01-home-countdown.png`
- `apple-en-02-calendar.png`
- `apple-en-03-pick-send.png`
- `apple-en-04-schedule.png`
- `apple-en-05-settings.png`
- `google-en-06-organized.png`
- `apple-es-01-home-countdown.png`
- `google-es-01-home-countdown.png`

## Final review checklist

- no broken UI states
- no debug text
- no temporary test emails exposed unless intentional
- no claims of native push if not implemented
- countdown values are readable
- support/delete-account entry points are visible where relevant
