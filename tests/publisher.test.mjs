import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { createPublisher } from "../services/publisher/app.mjs";
import { initialCard } from "../shared/card.mjs";
const records = new Map();
let server, base;
const fault = (status, message) => Object.assign(Error(message), { status });
const store = {
  async publish(id, value) {
    const old = records.get(id);
    if (old && old.digest !== value.digest)
      throw fault(409, "Conflicting publish");
    records.set(id, old ?? value);
  },
  async eraseOwner(uid) {
    for (const [id, value] of records)
      if (value.userId === uid) records.delete(id);
  },
  async get(id) {
    return records.get(id);
  },
  async list(uid) {
    return [...records]
      .filter(([, v]) => v.userId === uid && !v.revoked)
      .map(([id, v]) => ({ id, ...v }));
  },
  async revoke(id, uid) {
    const v = records.get(id);
    if (!v) throw fault(404, "Missing");
    if (v.userId !== uid) throw fault(403, "Not owner");
    v.revoked = true;
  },
};
before(async () => {
  const auth = {
    async verifyIdToken(token, checkRevoked) {
      assert.equal(checkRevoked, true);
      if (token === "bad") throw Error("invalid");
      return { uid: token, email_verified: token !== "unverified" };
    },
  };
  server = createPublisher({
    auth,
    store,
    publicOrigin: "https://cards.example.com",
    appOrigin: "https://app.example.com",
    allowedOrigins: ["https://app.example.com"],
  }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
});
const request = (path, method = "GET", body, token) =>
  fetch(base + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
test("publishing rejects missing, invalid and unverified identities", async () => {
  for (const [token, status] of [
    [undefined, 401],
    ["bad", 401],
    ["unverified", 403],
  ])
    assert.equal(
      (await request("/api/cards", "POST", initialCard, token)).status,
      status,
    );
});
test("origin and input validation fail closed", async () => {
  assert.equal(
    (
      await fetch(base + "/api/cards", {
        method: "OPTIONS",
        headers: { Origin: "https://evil.example" },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        "/api/cards",
        "POST",
        { ...initialCard, schemaVersion: 2 },
        "alice",
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        "/api/cards",
        "POST",
        {
          ...initialCard,
          actions: [{ label: "Bad", url: "javascript:alert(1)" }],
        },
        "alice",
      )
    ).status,
    400,
  );
  assert.equal((await request("/c/not-an-id")).status, 404);
});
test("published HTML has escaped personalized crawler metadata and real interactive content", async () => {
  const card = {
    ...initialCard,
    title: 'A <special> "hello"',
    message: "Personal words <script>alert(1)</script>",
    details: "Extra details",
    checklist: ["Remember this"],
    actions: [{ label: "RSVP", url: "https://example.com/rsvp" }],
  };
  const published = await request("/api/cards", "POST", card, "alice");
  assert.equal(published.status, 201);
  const link = await published.json();
  const path = new URL(link.url).pathname;
  const page = await request(path);
  const html = await page.text();
  assert.equal(page.status, 200);
  assert.ok(
    html.includes(
      'property="og:title" content="A &lt;special&gt; &quot;hello&quot;"',
    ),
  );
  assert.ok(html.includes(`property="og:image" content="${link.url}/og.png"`));
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("<details>"));
  assert.ok(html.includes('type="checkbox"'));
  assert.ok(html.includes("https://example.com/rsvp"));
  const png = await request(`${path}/image.png?download=1`);
  assert.equal(png.status, 200);
  assert.ok(png.headers.get("content-disposition").includes("attachment"));
  const meta = await sharp(Buffer.from(await png.arrayBuffer())).metadata();
  assert.equal(meta.width, 1080);
  assert.ok(meta.height >= 1000);
  const og = await request(`${path}/og.png`);
  const preview = await sharp(Buffer.from(await og.arrayBuffer())).metadata();
  assert.equal(preview.width, 1200);
  assert.equal(preview.height, 630);
  assert.equal(
    (await request(`/api/cards/${link.id}`, "DELETE", undefined, "bob")).status,
    403,
  );
  assert.equal(
    (await request(`/api/cards/${link.id}`, "DELETE", undefined, "alice"))
      .status,
    204,
  );
  assert.equal((await request(path)).status, 404);
  assert.equal((await request(`${path}/image.png`)).status, 404);
});
test("retries with the same request key preserve one immutable publication", async () => {
  const key = "12345678-1234-1234-1234-123456789012";
  const publish = (card) =>
    fetch(base + "/api/cards", {
      method: "POST",
      headers: {
        Authorization: "Bearer alice",
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      body: JSON.stringify(card),
    });
  const a = await (await publish(initialCard)).json();
  const b = await (await publish(initialCard)).json();
  assert.equal(a.id, b.id);
  assert.equal(
    (await publish({ ...initialCard, title: "Different" })).status,
    409,
  );
  const list = await (
    await request("/api/cards", "GET", undefined, "bob")
  ).json();
  assert.deepEqual(list, []);
});
test("long personalized image output grows instead of truncating message content", async () => {
  const record = await (
    await request(
      "/api/cards",
      "POST",
      {
        ...initialCard,
        title: "A".repeat(120),
        message: "Long message ".repeat(170),
        details: "Details ".repeat(450),
      },
      "alice",
    )
  ).json();
  const image = await request(new URL(record.imageUrl).pathname);
  const meta = await sharp(Buffer.from(await image.arrayBuffer())).metadata();
  assert.ok(meta.height > 3000);
});

test("account cleanup removes only the authenticated owner publications", async () => {
  const alice = await (
    await request("/api/cards", "POST", initialCard, "cleanup-alice")
  ).json();
  const bob = await (
    await request("/api/cards", "POST", initialCard, "cleanup-bob")
  ).json();
  assert.equal(
    (await request("/api/cards", "DELETE", undefined, "cleanup-alice")).status,
    204,
  );
  assert.equal((await request(new URL(alice.url).pathname)).status, 404);
  assert.equal((await request(new URL(bob.url).pathname)).status, 200);
});

test("wide Unicode and unbroken words render without fixed-column clipping", async () => {
  const record = await (
    await request(
      "/api/cards",
      "POST",
      { ...initialCard, message: "W".repeat(1200) + "世界".repeat(500) },
      "alice",
    )
  ).json();
  const response = await request(new URL(record.imageUrl).pathname);
  assert.equal(response.status, 200);
  const meta = await sharp(
    Buffer.from(await response.arrayBuffer()),
  ).metadata();
  assert.ok(meta.height > 2000);
});
