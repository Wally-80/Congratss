# Expansion: Greeting Cards & Sharing Options Plan

Enhance the "Send Greeting" feature with more visual variety and better sharing capabilities.

## Proposed Changes

### [Assets] New Greeting Cards
- Generate high-quality images for:
  - **Retirement**: Festive, relaxing, or "new chapter" themed.
  - **Birthday Cake**: Close-up of a premium, modern cake.
  - **Birthday Party**: High-energy, colorful party atmosphere.
  - **Gold Anniversary**: Elegant, sophisticated, metallic gold theme.
  - **Big Congratulations**: Bold, modern typography with a premium feel.

### [Component] [SendGreetingModal](file:///Users/walterpomalaza/Gratzz/src/components/SendGreetingModal.tsx) [MODIFY]
- **Image List**: Expand the `GREETING_IMAGES` array with the new assets.
- **Improved Sharing**: 
  - Implementation of `navigator.share()` API (where supported) to share the actual image file or a link.
  - Fallback sharing links will now include a more descriptive text mentioning the card chosen.
  - Add a "System Share" button that uses the native mobile share sheet for best experience.

## Verification Plan

### Manual Verification
- Verify all 8+ cards are selectable in the modal.
- Test "Native Share" on a mobile-simulated browser or actual device (if possible) to see if image sharing works.
- Verify fallback links (WhatsApp, Email) still work and include updated messaging.
