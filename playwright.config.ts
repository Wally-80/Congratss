import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3001",
    browserName: "chromium",
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH ||
        (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
      args: ["--no-sandbox"],
    },
    screenshot: "only-on-failure",
  },
  webServer: [
    ...(process.env.FIREBASE_AUTH_EMULATOR_HOST
      ? [
          {
            command: "npm run publisher",
            url: "http://127.0.0.1:8787/health",
            reuseExistingServer: false,
            env: {
              PUBLISHER_PROJECT_ID: "demo-congratss",
              PUBLISHER_PUBLIC_ORIGIN: "http://127.0.0.1:8787",
              PUBLISHER_APP_ORIGIN: "http://127.0.0.1:3001",
              PORT: "8787",
            },
          },
        ]
      : []),
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3001",
      url: "http://127.0.0.1:3001",
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        NEXT_PUBLIC_PUBLISHER_URL: "http://127.0.0.1:8787",
        NEXT_PUBLIC_USE_EMULATORS: process.env.FIREBASE_AUTH_EMULATOR_HOST
          ? "true"
          : "false",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-congratss",
        NEXT_PUBLIC_FIREBASE_API_KEY: "demo-public-key",
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-congratss.firebaseapp.com",
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "demo-congratss.appspot.com",
        NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:demo",
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456789",
      },
    },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
});
