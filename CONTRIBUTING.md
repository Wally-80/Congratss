# 🤝 CONTRIBUTING GUIDELINES

We strongly believe in an open, structured, and predictable development process. The following protocols apply to all internal contributors and audited external dependencies.

## 1. Local Development Setup
Before committing code, verify your local rig matches project specifics.
- Node.js LTS version 20+.
- Run `npm ci` strictly (avoids breaking `package-lock.json` hashes).
- Never persist unencrypted sensitive API credentials in local files; rely on targeted `.env.local` injection.

## 2. Branching Strategy
We adhere strictly to a heavily modified **Trunk-Based Development** pattern combined with Feature Branching.
- `main` branch is strictly **Production-Ready**. Code here will autonomously deploy.
- Feature branches **must** originate off of `main` using the following nomenclature conventions:
  - `feature/name-of-function`
  - `bugfix/issue-description`
  - `hotfix/critical-prod-patch` (Used only for emergency `main` patches)
  - `chore/upgrade-or-maintenance`

## 3. Pull Request Requirements
- **Descriptive Summaries:** Outline precisely what problem is being solved and why the current architectural approach was taken.
- **Linked Context:** Append GitHub Issue trackers where relevant to PR bodies.
- **Pass Verification:** PRs will automatically be blocked unless locally passing `npm run lint` and `npm run build`. 
- **Approval Check:** Ensure a minimum of 1 primary code-owner approves the review before executing a squash-and-merge.

## 4. Linting and Formatting
- ESLint is configured to execute strictly on `npm run lint`. Do not bypass warnings or rule violations unless explicitly documented via in-line `// eslint-disable-next-line` requiring a strong comment justification.
- Avoid committing heavily commented-out or unused scratch code.

## 5. Security Protocols
- Avoid modifying core Firestore Security Rules (`firestore.rules`) and Storage Rules (`storage.rules`) dynamically. Changes to these pipelines require separated security audits natively.
