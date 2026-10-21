import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stagingConfig, stagingEnvironment, stagingHostingConfig } from "../scripts/staging-config.mjs";
const sample = JSON.parse(readFileSync(new URL("../config/staging.example.json", import.meta.url)));

test("staging rejects production, unrelated buckets and mismatched Firebase apps", () => {
  assert.throws(() => stagingConfig({ ...sample, projectId: "gratzz" }), /production/);
  assert.throws(() => stagingConfig({ ...sample, storageBucket: "gratzz.firebasestorage.app" }), /staging project/);
  assert.throws(() => stagingConfig({ ...sample, authDomain: "gratzz.firebaseapp.com" }), /staging project/);
  assert.throws(() => stagingConfig({ ...sample, appId: "1:999:web:wrong" }), /sender ID/);
  assert.throws(() => stagingConfig({ ...sample, publisherOrigin: "http://example.com" }), /HTTPS/);
  assert.throws(() => stagingConfig({ ...sample, publisherOrigin: "https://example.com/path" }), /HTTPS/);
});
test("staging explicitly overrides production client environment and disables push/emulators", () => {
  const env = stagingEnvironment(stagingConfig(sample), {
    PATH: "/bin", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "gratzz", NEXT_PUBLIC_PUBLISHER_URL: "https://live.example.com",
    NEXT_PUBLIC_USE_EMULATORS: "true", FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080", GOOGLE_APPLICATION_CREDENTIALS: "/private/key.json",
  });
  assert.equal(env.PATH, "/bin");
  assert.equal(env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, sample.projectId);
  assert.equal(env.NEXT_PUBLIC_PUBLISHER_URL, "");
  assert.equal(env.NEXT_PUBLIC_USE_EMULATORS, "false");
  assert.equal(env.NEXT_PUBLIC_DISABLE_PUSH, "true");
  assert.equal(env.FIRESTORE_EMULATOR_HOST, undefined);
  assert.equal(env.GOOGLE_APPLICATION_CREDENTIALS, undefined);
});
test("staging hosting targets only the staged artifact, with no publisher rewrite or deployment hook", () => {
  const config = stagingHostingConfig();
  assert.equal(config.hosting.public, "out");
  assert.equal(config.firestore.rules, "../firestore.rules");
  assert.equal(config.storage.rules, "../storage.rules");
  assert.equal(config.hosting.site, undefined);
  assert.equal(config.hosting.target, undefined);
  assert.equal(config.hosting.predeploy, undefined);
  assert.equal(config.hosting.rewrites, undefined);
  assert.ok(config.hosting.headers.some((h) => h.headers.some((v) => v.key === "X-Robots-Tag")));
});
