import { after, before, test } from "node:test";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  Timestamp,
  deleteField,
} from "firebase/firestore";
import { ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";
let env;
const projectId = "demo-congratss";
before(async () => {
  if (
    !process.env.FIRESTORE_EMULATOR_HOST ||
    !process.env.FIREBASE_STORAGE_EMULATOR_HOST
  )
    throw Error("Emulators required");
  env = await initializeTestEnvironment({
    projectId,
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
    storage: { rules: readFileSync("storage.rules", "utf8") },
  });
  await env.withSecurityRulesDisabled(async (c) => {
    for (const [id, data] of Object.entries({
      alice: { language: "en" },
      bob: { language: "es" },
      admin: { role: "admin", isAdmin: true },
    }))
      await setDoc(doc(c.firestore(), "users", id), data);
    await setDoc(doc(c.firestore(), "celebrations", "legacy"), {
      userId: "alice",
      title: "Birthday",
      rawDate: "2000-01-01",
      type: "birthday",
      date: "Jan 1",
    });
    for (const path of [
      "greeting_cards/public.png",
      "user_uploads/legacy.png",
      "private/secret.png",
    ])
      await uploadBytes(ref(c.storage(), path), new Uint8Array([1, 2]), {
        contentType: "image/png",
      });
  });
});
after(async () => {
  await env?.cleanup();
});
const ctx = (id, claims = {}) => env.authenticatedContext(id, claims);
test("owners retain preferences; others cannot read/write them", async () => {
  await assertSucceeds(
    updateDoc(doc(ctx("alice").firestore(), "users", "alice"), {
      language: "es",
      notificationsEnabled: true,
    }),
  );
  await assertFails(getDoc(doc(ctx("bob").firestore(), "users", "alice")));
  await assertFails(
    setDoc(doc(ctx("bob").firestore(), "users", "alice"), { language: "en" }),
  );
});
test("privilege additions, changes and removals are denied to owners", async () => {
  const user = doc(ctx("alice").firestore(), "users", "alice");
  await assertFails(updateDoc(user, { role: "admin", isAdmin: true }));
  await assertFails(
    setDoc(doc(ctx("mallory").firestore(), "users", "mallory"), {
      role: "admin",
    }),
  );
  await env.withSecurityRulesDisabled((c) =>
    setDoc(doc(c.firestore(), "users", "protected"), {
      role: "user",
      isAdmin: false,
    }),
  );
  await assertFails(
    updateDoc(doc(ctx("protected").firestore(), "users", "protected"), {
      role: "admin",
    }),
  );
  await assertFails(
    updateDoc(doc(ctx("protected").firestore(), "users", "protected"), {
      role: deleteField(),
    }),
  );
});
test("verified legacy email and trusted role admins retain library access", async () => {
  const card = {
    url: "/greeting_cake.png",
    label: "Cake",
    category: "Classic",
    locale: "both",
  };
  await assertSucceeds(
    setDoc(
      doc(
        ctx("verified", {
          email: "walterrpom@gmail.com",
          email_verified: true,
        }).firestore(),
        "greeting_cards",
        "verified",
      ),
      card,
    ),
  );
  await assertSucceeds(
    setDoc(doc(ctx("admin").firestore(), "greeting_cards", "role"), card),
  );
  await assertSucceeds(
    setDoc(
      doc(ctx("claim", { admin: true }).firestore(), "greeting_cards", "claim"),
      card,
    ),
  );
  await assertFails(
    setDoc(
      doc(
        ctx("unverified", {
          email: "walterrpom@gmail.com",
          email_verified: false,
        }).firestore(),
        "greeting_cards",
        "attack",
      ),
      card,
    ),
  );
  await assertFails(
    setDoc(doc(ctx("alice").firestore(), "greeting_cards", "attack"), card),
  );
});
test("celebrations preserve legacy access and reject cross-user access", async () => {
  await assertSucceeds(
    getDoc(doc(ctx("alice").firestore(), "celebrations", "legacy")),
  );
  await assertSucceeds(
    updateDoc(doc(ctx("alice").firestore(), "celebrations", "legacy"), {
      reminderTiming: "day_before",
    }),
  );
  await assertFails(
    getDoc(doc(ctx("bob").firestore(), "celebrations", "legacy")),
  );
  await assertFails(
    updateDoc(doc(ctx("alice").firestore(), "celebrations", "legacy"), {
      userId: "bob",
    }),
  );
  await assertFails(
    setDoc(doc(ctx("alice").firestore(), "celebrations", "bad"), {
      userId: "alice",
      title: "",
      rawDate: "bad",
      type: "birthday",
    }),
  );
});
test("scheduled edits preserve owner and immutable content but allow destination changes", async () => {
  const data = {
    userId: "alice",
    celebrationTitle: "Birthday",
    channel: "sms",
    recipient: "+15555555555",
    message: "Hi",
    shareUrl: "sms:+15555555555?body=Hi",
    cardLabel: "Cake",
    cardUrl: "/greeting_cake.png",
    scheduledAt: Timestamp.now(),
    status: "scheduled",
  };
  const item = doc(ctx("alice").firestore(), "scheduled_messages", "message");
  await assertSucceeds(setDoc(item, data));
  await assertSucceeds(
    updateDoc(item, {
      channel: "email",
      recipient: "test@example.com",
      shareUrl: "mailto:test@example.com?body=Hi",
    }),
  );
  await assertFails(updateDoc(item, { userId: "bob" }));
  await assertFails(updateDoc(item, { status: "delivered" }));
  await assertFails(updateDoc(item, { message: "Replacement" }));
  await assertFails(
    deleteDoc(doc(ctx("bob").firestore(), "scheduled_messages", "message")),
  );
});
test("drafts are private and clients cannot write published snapshots", async () => {
  const data = {
    schemaVersion: 1,
    userId: "alice",
    content: { schemaVersion: 1 },
    updatedAt: Timestamp.now(),
  };
  await assertSucceeds(
    setDoc(doc(ctx("alice").firestore(), "card_drafts", "mine"), data),
  );
  await assertFails(getDoc(doc(ctx("bob").firestore(), "card_drafts", "mine")));
  await assertFails(
    getDoc(
      doc(env.unauthenticatedContext().firestore(), "card_drafts", "mine"),
    ),
  );
  await assertFails(
    setDoc(doc(ctx("alice").firestore(), "card_drafts", "other"), {
      ...data,
      userId: "bob",
    }),
  );
  await assertFails(
    setDoc(doc(ctx("alice").firestore(), "published_cards", "attack"), data),
  );
});
test("public legacy assets stay readable; private paths and non-admin uploads are denied", async () => {
  const guest = env.unauthenticatedContext().storage();
  await assertSucceeds(getBytes(ref(guest, "greeting_cards/public.png")));
  await assertSucceeds(getBytes(ref(guest, "user_uploads/legacy.png")));
  await assertFails(getBytes(ref(guest, "private/secret.png")));
  await assertFails(
    uploadBytes(
      ref(ctx("alice").storage(), "greeting_cards/attack.png"),
      new Uint8Array([1]),
      { contentType: "image/png" },
    ),
  );
  await assertFails(
    uploadBytes(
      ref(ctx("alice").storage(), "user_uploads/attack.png"),
      new Uint8Array([1]),
      { contentType: "image/png" },
    ),
  );
});
test("admin assets enforce types and size and support deletion", async () => {
  const storage = ctx("admin").storage();
  await assertSucceeds(
    uploadBytes(ref(storage, "greeting_cards/admin.png"), new Uint8Array([1]), {
      contentType: "image/png",
    }),
  );
  await assertFails(
    uploadBytes(ref(storage, "greeting_cards/code.html"), new Uint8Array([1]), {
      contentType: "text/html",
    }),
  );
  await assertFails(
    uploadBytes(
      ref(storage, "greeting_cards/large.png"),
      new Uint8Array(15 * 1024 * 1024),
      { contentType: "image/png" },
    ),
  );
  await assertSucceeds(deleteObject(ref(storage, "greeting_cards/admin.png")));
});

test("Storage recognizes verified email and claim admins but rejects unverified emails", async () => {
  const bytes = new Uint8Array([1]);
  const metadata = { contentType: "image/png" };
  await assertSucceeds(
    uploadBytes(
      ref(
        ctx("email-storage", {
          email: "walterrpom@gmail.com",
          email_verified: true,
        }).storage(),
        "greeting_cards/email.png",
      ),
      bytes,
      metadata,
    ),
  );
  await assertSucceeds(
    uploadBytes(
      ref(
        ctx("claim-storage", { admin: true }).storage(),
        "greeting_cards/claim.png",
      ),
      bytes,
      metadata,
    ),
  );
  await assertFails(
    uploadBytes(
      ref(
        ctx("unverified-storage", {
          email: "walterrpom@gmail.com",
          email_verified: false,
        }).storage(),
        "greeting_cards/unverified.png",
      ),
      bytes,
      metadata,
    ),
  );
});
