import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cardSchema,
  initialCard,
  templates,
  fromTemplate,
  shareLinks,
} from "../shared/card.mjs";
test("all seven purpose templates satisfy the versioned schema", () => {
  assert.equal(new Set(templates.map((t) => t.tag)).size, 7);
  for (const t of templates) assert.equal(fromTemplate(t.id).purpose, t.tag);
});
test("rejects executable URLs, credentials, unknown fields and oversized input", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,attack",
    "https://user:password@example.com",
    "http://example.com",
  ])
    assert.equal(
      cardSchema.safeParse({
        ...initialCard,
        actions: [{ label: "Open", url }],
      }).success,
      false,
    );
  assert.equal(
    cardSchema.safeParse({ ...initialCard, role: "admin" }).success,
    false,
  );
  assert.equal(
    cardSchema.safeParse({ ...initialCard, message: "x".repeat(2401) }).success,
    false,
  );
  assert.equal(
    cardSchema.safeParse({ ...initialCard, schemaVersion: 2 }).success,
    false,
  );
});
test("safe buttons, details and checklists preserve author text", () => {
  const content = {
    ...initialCard,
    message: "My own words. No AI rewrite.",
    details: "More information",
    checklist: ["One"],
    actions: [{ label: "Reply", url: "mailto:hello@example.com" }],
  };
  assert.equal(cardSchema.parse(content).message, content.message);
  assert.equal(
    cardSchema.safeParse({ ...content, timezone: "Invalid/Zone" }).success,
    false,
  );
});
test("share payloads encode the canonical personalized URL", () => {
  const links = shareLinks(
    "https://cards.example.com/c/abc",
    "Hello & goodbye",
  );
  assert.ok(
    links.whatsapp.includes(
      encodeURIComponent("https://cards.example.com/c/abc"),
    ),
  );
  assert.ok(links.email.startsWith("mailto:"));
  assert.ok(links.sms.startsWith("sms:"));
});

test("calendar fields reject invalid dates and preserve message whitespace", () => {
  assert.equal(
    cardSchema.safeParse({ ...initialCard, eventDate: "2026-02-30T12:00" })
      .success,
    false,
  );
  assert.equal(
    cardSchema.safeParse({ ...initialCard, eventDate: "2028-02-29T12:00" })
      .success,
    true,
  );
  assert.equal(
    cardSchema.parse({ ...initialCard, message: "  My words.\n\n" }).message,
    "  My words.\n\n",
  );
});
