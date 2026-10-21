import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { createPublisher } from "./app.mjs";
const projectId = process.env.PUBLISHER_PROJECT_ID;
const emulator = Boolean(
  process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST,
);
if (!projectId)
  throw Error(
    "Set PUBLISHER_PROJECT_ID explicitly. No default production project is selected.",
  );
if (
  emulator &&
  (!projectId.startsWith("demo-") ||
    !process.env.FIRESTORE_EMULATOR_HOST ||
    !process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    !/^127\.0\.0\.1:\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST) ||
    !/^127\.0\.0\.1:\d+$/.test(process.env.FIREBASE_AUTH_EMULATOR_HOST))
)
  throw Error("Local integration requires both emulators and a demo- project.");
function origin(value, name) {
  if (!value) throw Error(`Set ${name}.`);
  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.origin !== value ||
    url.username ||
    url.password ||
    (!emulator && url.protocol !== "https:")
  )
    throw Error(
      `${name} must be a bare HTTPS origin (loopback HTTP is allowed with demo emulators).`,
    );
  if (emulator && !["localhost", "127.0.0.1"].includes(url.hostname))
    throw Error("Demo emulator origins must be loopback.");
  return url.origin;
}
const publicOrigin = origin(
  process.env.PUBLISHER_PUBLIC_ORIGIN,
  "PUBLISHER_PUBLIC_ORIGIN",
);
const appOrigin = origin(
  process.env.PUBLISHER_APP_ORIGIN,
  "PUBLISHER_APP_ORIGIN",
);
const allowedOrigins = (process.env.PUBLISHER_ALLOWED_ORIGINS || appOrigin)
  .split(",")
  .map((v) =>
    v.trim() === "capacitor://localhost"
      ? v.trim()
      : origin(v.trim(), "PUBLISHER_ALLOWED_ORIGINS"),
  );
const firebase = initializeApp(
  emulator ? { projectId } : { projectId, credential: applicationDefault() },
);
const db = getFirestore(firebase);
const fault = (status, message) =>
  Object.assign(new Error(message), { status });
const store = {
  async publish(id, snapshot) {
    const ref = db.collection("published_cards").doc(id);
    const quota = db
      .collection("publishing_quotas")
      .doc(
        `${snapshot.userId}_${new Date(snapshot.createdAt).toISOString().slice(0, 10)}`,
      );
    await db.runTransaction(async (tx) => {
      const [existing, limit] = await Promise.all([tx.get(ref), tx.get(quota)]);
      if (existing.exists) {
        if (
          existing.data().digest !== snapshot.digest ||
          existing.data().revoked
        )
          throw fault(
            409,
            "This request was already used. Start a new publication.",
          );
        return;
      }
      if ((limit.data()?.count ?? 0) >= 20)
        throw fault(
          429,
          "Daily publishing limit reached. Please try tomorrow.",
        );
      tx.create(ref, snapshot);
      tx.set(quota, { count: (limit.data()?.count ?? 0) + 1 });
    });
  },
  async eraseOwner(uid) {
    while (true) {
      const items = await db
        .collection("published_cards")
        .where("userId", "==", uid)
        .limit(400)
        .get();
      if (items.empty) return;
      const batch = db.batch();
      for (const item of items.docs) batch.delete(item.ref);
      await batch.commit();
    }
  },
  async get(id) {
    const item = await db.collection("published_cards").doc(id).get();
    return item.exists ? item.data() : null;
  },
  async list(uid) {
    const items = await db
      .collection("published_cards")
      .where("userId", "==", uid)
      .where("revoked", "==", false)
      .limit(50)
      .get();
    return items.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  async revoke(id, uid) {
    await db.runTransaction(async (tx) => {
      const ref = db.collection("published_cards").doc(id);
      const item = await tx.get(ref);
      if (!item.exists) throw fault(404, "Card unavailable.");
      if (item.data().userId !== uid)
        throw fault(403, "You do not own this card.");
      tx.update(ref, { revoked: true });
    });
  },
};
const port = Number(process.env.PORT || 8787);
const server = createPublisher({
  auth: getAuth(firebase),
  store,
  publicOrigin,
  appOrigin,
  allowedOrigins,
}).listen(port, "0.0.0.0", () =>
  console.log(
    `Publishing service listening on port ${port}; ${emulator ? "demo emulators" : "configured project"}.`,
  ),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
