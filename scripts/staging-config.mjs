import { readFileSync } from "node:fs";

export function stagingConfig(input) {
  const required = ["projectId", "apiKey", "authDomain", "storageBucket", "messagingSenderId", "appId"];
  for (const key of required) {
    if (typeof input[key] !== "string" || !input[key].trim() || input[key] !== input[key].trim()) {
      throw Error(`Staging configuration requires ${key}.`);
    }
  }
  const id = input.projectId;
  // Require an unmistakable staging name as well as explicitly rejecting production.
  if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(id) || !id.includes("staging") || id === "gratzz") {
    throw Error("Use a separate Firebase project ID containing staging; production is forbidden.");
  }
  if (input.authDomain !== `${id}.firebaseapp.com` ||
      ![`${id}.firebasestorage.app`, `${id}.appspot.com`].includes(input.storageBucket)) {
    throw Error("Auth domain and Storage bucket must belong to the staging project.");
  }
  if (!/^\d+$/.test(input.messagingSenderId) || !input.appId.startsWith(`1:${input.messagingSenderId}:web:`)) {
    throw Error("The staging web app ID must match its messaging sender ID.");
  }
  const publisher = input.publisherOrigin || "";
  if (publisher) {
    const url = new URL(publisher);
    if (url.protocol !== "https:" || url.origin !== publisher || url.username || url.password) {
      throw Error("The staging publisher must be a bare HTTPS origin.");
    }
  }
  return { ...Object.fromEntries(required.map((key) => [key, input[key]])), publisherOrigin: publisher };
}

export function stagingEnvironment(config, inherited = process.env) {
  // Explicit values also override any production .env.local read by Next.js.
  const env = Object.fromEntries(Object.entries(inherited).filter(([key]) =>
    !/^(NEXT_PUBLIC_|FIREBASE_|FIRESTORE_|PUBLISHER_|GOOGLE_APPLICATION_CREDENTIALS$)/.test(key)));
  return {
    ...env,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: config.projectId,
    NEXT_PUBLIC_FIREBASE_API_KEY: config.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: config.authDomain,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: config.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: config.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: config.appId,
    NEXT_PUBLIC_PUBLISHER_URL: config.publisherOrigin,
    NEXT_PUBLIC_USE_EMULATORS: "false",
    NEXT_PUBLIC_DISABLE_PUSH: "true",
  };
}

export function stagingHostingConfig() {
  const base = JSON.parse(readFileSync(new URL("../firebase.json", import.meta.url), "utf8"));
  return {
    hosting: {
      ...base.hosting,
      public: "out",
      headers: [...base.hosting.headers, {
        source: "**",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      }],
    },
    firestore: { rules: "../firestore.rules" },
    storage: { rules: "../storage.rules" },
  };
}
