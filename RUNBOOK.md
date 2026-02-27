# RUNBOOK

### Option A: Vercel (Automatic)
1. Ensure all changes are committed and pushed to `main`.
2. Vercel will automatically trigger a build and deployment.
3. Verify the deployment status on the Vercel dashboard.

### Option B: Firebase (Manual)
1. Build the project locally: `npm run build`.
2. Ensure you have `firebase-tools` installed: `npm install -g firebase-tools`.
3. Login if necessary: `firebase login`.
4. Deploy to Firebase: `firebase deploy`.
5. Verify the live site at the Hosting URL.

## Rollback
1. Identify the previous stable commit hash.
2. Revert to that commit if necessary or use Vercel's "Promote to Production" feature for an older deployment.

## Common Fixes
### Dependency Issues
Run `npm run clean` (if configured) or delete `node_modules` and `package-lock.json`, then run `npm install`.
