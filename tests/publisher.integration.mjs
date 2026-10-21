import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { initialCard } from "../shared/card.mjs";
let child, admin, token, otherToken;
const base = "http://127.0.0.1:8790";
async function identity(email) {
  const user = await getAuth(admin).createUser({
    email,
    password: "Emulator-only-123!",
    emailVerified: true,
  });
  const res = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: "Emulator-only-123!",
        returnSecureToken: true,
      }),
    },
  );
  const data = await res.json();
  assert.ok(data.idToken);
  return { uid: user.uid, token: data.idToken };
}
before(async () => {
  for (const key of ["FIRESTORE_EMULATOR_HOST", "FIREBASE_AUTH_EMULATOR_HOST"])
    assert.match(
      process.env[key] ?? "",
      /^127\.0\.0\.1:\d+$/,
      "Loopback emulators required",
    );
  admin = initializeApp(
    { projectId: "demo-congratss" },
    "publisher-integration",
  );
  token = (await identity("publisher@example.test")).token;
  otherToken = (await identity("other@example.test")).token;
  child = spawn(process.execPath, ["services/publisher/server.mjs"], {
    env: {
      ...process.env,
      PUBLISHER_PROJECT_ID: "demo-congratss",
      PUBLISHER_PUBLIC_ORIGIN: base,
      PUBLISHER_APP_ORIGIN: "http://127.0.0.1:3001",
      PORT: "8790",
    },
    stdio: "ignore",
  });
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base + "/health")).ok) return;
    } catch {}
    await delay(100);
  }
  throw Error("Publisher did not become ready");
});
after(async () => {
  if (child && !child.killed) {
    child.kill("SIGTERM");
    await new Promise((resolve) => child.once("exit", resolve));
  }
  if (admin) await deleteApp(admin);
});
const publish = (body, key = crypto.randomUUID(), auth = token) =>
  fetch(base + "/api/cards", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify(body),
  });
test("real emulator tokens publish immutable snapshots and enforce ownership on revocation", async () => {
  assert.equal(
    (await publish(initialCard, crypto.randomUUID(), "not-a-token")).status,
    401,
  );
  const key = crypto.randomUUID();
  const response = await publish(initialCard, key);
  assert.equal(response.status, 201);
  const result = await response.json();
  assert.equal((await (await publish(initialCard, key)).json()).id, result.id);
  assert.equal(
    (await publish({ ...initialCard, title: "Replacement" }, key)).status,
    409,
  );
  const html = await (await fetch(result.url)).text();
  assert.ok(html.includes(initialCard.title));
  assert.ok(html.includes('property="og:image"'));
  assert.equal(
    (
      await fetch(base + `/api/cards/${result.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${otherToken}` },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await fetch(base + `/api/cards/${result.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
    ).status,
    204,
  );
  assert.equal((await fetch(result.url)).status, 404);
});
test("transaction quota limits simultaneous publications per owner", async () => {
  const limited = (await identity("quota@example.test")).token;
  const responses = await Promise.all(
    Array.from({ length: 24 }, () =>
      publish(initialCard, crypto.randomUUID(), limited),
    ),
  );
  assert.equal(responses.filter((r) => r.status === 201).length, 20);
  assert.equal(responses.filter((r) => r.status === 429).length, 4);
  const list = await fetch(base + "/api/cards", {
    headers: { Authorization: `Bearer ${limited}` },
  });
  assert.equal((await list.json()).length, 20);
});
