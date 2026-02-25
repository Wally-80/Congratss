# DECISIONS

## Architecture Decisions

### Framework: Next.js
- **Reason**: Excellent support for React, built-in routing, and easy deployment to Vercel.

### Backend: Firebase
- **Reason**: Real-time database (Firestore), easy authentication, and serverless functions support.

### Styling: Tailwind CSS
- **Reason**: Rapid UI development and consistent design tokens.

### Branding: SVG Logo Component
- **Reason**: Using a custom SVG component (`Logo.tsx`) for consistent, scalable, and upscaled branding across the app, replacing static assets where appropriate.

### Media Management: Firebase Storage
- **Reason**: Integrated Firebase Storage to handle image uploads for both library management (Admin) and custom user greetings, ensuring persistence and scalability.
