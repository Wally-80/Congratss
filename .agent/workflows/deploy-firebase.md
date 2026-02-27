---
description: how to deploy the application to Firebase Hosting
---

1.  **Build the Project**
    Run the build script to generate the static files:
    ```bash
    npm run build
    ```
    This will create an `out/` directory (as configured in `next.config.ts`).

2.  **Install Firebase Tools (if not present)**
    ```bash
    npm install -g firebase-tools
    ```

3.  **Authenticate (if first time)**
    ```bash
    firebase login
    ```

4.  **Confirm Project**
    Ensure `.firebaserc` is pointing to the correct project:
    ```bash
    firebase use gratzz
    ```

5.  **Deploy**
    ```bash
    firebase deploy
    ```

6.  **Verify**
    Visit the Hosting URL provided in the terminal output.
