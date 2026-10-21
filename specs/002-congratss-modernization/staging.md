# Isolated staging preparation

Prepare a reviewable staging build without deploying or accessing production.

- Explicit non-production Firebase project and matching web configuration are mandatory.
- Keep `.firebaserc` and `firebase.json` unchanged; generate a separate hosting/rules configuration.
- Disable push registration and replace the exported production-configured messaging worker.
- Validate staging inputs before building, including inherited environment isolation.
- Package the publisher separately with Unicode fonts; deployment/IAM remain blocked until a staging project and authenticated cloud access are available.
- Test invalid/production configurations, generated hosting targets and build environment isolation. Verify a sample staging export locally.
- No project creation, rules rollout, hosting deployment, live data changes or production merge in this preparation task.
