# ⚙️ OPERATIONAL RUNBOOK

This document maps out deployment execution flows, environment handling, and emergency operational protocols to ensure safe high-availability for Gratzz instances.

---

## 🚀 Production Deployment Protocols

### Main Automatic Pipeline (Vercel)
Our primary deployment orchestration utilizes automated GitHub > Vercel polling.
1. Code pushed directly to `main` instantly triggers a new Vercel worker.
2. Vercel executes standard `npm run build` verification steps against the node cluster.
3. Upon artifact success, Vercel initiates an immutable edge-node deployment overriding previous aliases.
4. **Action**: Monitor the target domain post-build to ensure initial SSR fetches do not bounce.

### Fallback/Secondary Hosting Pipeline (Firebase Hosting)
In scenarios requiring manual CLI deployments directly relying on Google Cloud Infrastructure:
1. Validate environment parity: `npm install -g firebase-tools`
2. Authenticate system: `firebase login`
3. Execute standard application build: `npm run build`
4. Deploy the configured `out` artifacts to edge: `firebase deploy --only hosting`

## 🔄 Emergency Rollback Procedures
Failure states strictly follow "Fail Forward Fast" or "Revert Immutably" rules:

1. **Platform Application Faults**:
   - Navigate to Vercel production dashboard instance.
   - Access "Deployments" hierarchy matrix.
   - Identify the previous secure successful `main` build artifact.
   - Execute "Promote to Production" forcing the edge router to point at the older safe instance immediately.
   - Open standard GitHub issue investigating the specific bad PR.

2. **Data-Layer / Security Faults (Firebase)**:
   - Modifications directly affecting `firestore.rules` or `storage.rules` can be safely rolled back within the Firebase Console "Rules" history tab natively. 

## 🛠️ Common Triage Workflows

### Corrupt Dependencies / Type Mismatches
Execute the following commands natively in the terminal if encountering severe internal module errors.
```bash
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install
npm run dev
```

### Next.js Internal Cache Failures
On instances where data seems drastically stale compared to the raw Firestore backend:
- Consider investigating server-side components executing `export const revalidate = false` schemas.
- Locally, safely scrub the generated build cache: `rm -rf .next`
