import { test, expect } from "@playwright/test";
import { initializeApp, deleteApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { randomUUID } from "node:crypto";
let admin: App;
let email: string;
const password = "Emulator-only-123!";
test.skip(
  !process.env.FIREBASE_AUTH_EMULATOR_HOST,
  "Run with test:e2e:emulators to exercise genuine authenticated flows.",
);
test.beforeAll(async () => {
  if (
    process.env.FIREBASE_AUTH_EMULATOR_HOST !== "127.0.0.1:9099" ||
    process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080"
  )
    throw Error("Loopback demo emulators required");
  admin = initializeApp({ projectId: "demo-congratss" }, "browser-tests");
  email = `review-${randomUUID()}@example.test`;
  const user = await getAuth(admin).createUser({
    email,
    password,
    emailVerified: true,
    displayName: "Emulator Reviewer",
  });
  await getFirestore(admin).collection("users").doc(user.uid).set({
    language: "en",
    notificationsEnabled: false,
    onboardingCompleted: true,
  });
  await getFirestore(admin).collection("celebrations").add({
    userId: user.uid,
    title: "Legacy celebration",
    rawDate: "2000-12-25",
    type: "birthday",
    recurrence: "annual",
    date: "Dec 25",
  });
});
test.afterAll(async () => {
  if (admin) await deleteApp(admin);
});
async function signIn(page: import("@playwright/test").Page, next = "/create") {
  await page.goto(`/auth?next=${next}`);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(`http://127.0.0.1:3001${next}`);
}
test("account drafts, genuine publishing, OG preview, sharing, download and revocation", async ({
  page,
}) => {
  await signIn(page);
  await page
    .getByLabel("Title", { exact: true })
    .fill("Personalized for our emulator review");
  await page
    .getByLabel("Your message")
    .fill("Only demo data. My exact personal message.");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Draft saved to your account",
  );
  await page.bringToFront();
  await page.reload();
  await page
    .getByRole("button", {
      name: "Personalized for our emulator review Open draft",
    })
    .click();
  await expect(page.getByLabel("Your message")).toHaveValue(
    "Only demo data. My exact personal message.",
  );
  await page.getByLabel("I’m ready to make this card public.").check();
  await page.getByRole("button", { name: "Publish card", exact: true }).click();
  const urlField = page.getByLabel("Public card URL");
  await expect(urlField).toBeVisible();
  const url = await urlField.inputValue();
  await expect(page.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
    "href",
    /wa.me/,
  );
  const popup = await page.context().newPage();
  await popup.goto(url);
  await expect(popup.getByRole("heading", { level: 1 })).toHaveText(
    "Personalized for our emulator review",
  );
  await expect(popup.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Personalized for our emulator review",
  );
  await popup.setViewportSize({ width: 390, height: 844 });
  await popup.screenshot({
    path: "docs/screenshots/published-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  const download = popup.waitForEvent("download");
  await popup.getByRole("link", { name: "Download card image" }).click();
  const downloaded = await download;
  await downloaded.saveAs("docs/screenshots/published-download.png");
  expect(downloaded.suggestedFilename()).toMatch(/congratss-.*\.png/);
  await page.bringToFront();
  await page.reload();
  await expect(page.getByLabel("Title", { exact: true })).toBeVisible();
  await page
    .getByRole("button", {
      name: "Personalized for our emulator review Share or revoke",
    })
    .click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Revoke this public link" }).click();
  await expect(page.getByRole("status")).toContainText("Public link revoked");
  expect((await popup.request.get(url)).status()).toBe(404);
});
test("existing authenticated dashboard celebration and calendar remain usable", async ({
  page,
}) => {
  await signIn(page, "/dashboard");
  await expect(
    page.getByText("Legacy celebration", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Calendar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Calendar", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await expect(
    page.getByText("Legacy celebration", { exact: true }).first(),
  ).toBeVisible();
});

test("legacy celebration creation and editing preserve date fields", async ({
  page,
}) => {
  await signIn(page, "/dashboard");
  await page
    .getByRole("button", { name: "Add Celebration", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Title", { exact: true })
    .fill("Created in emulator only");
  await dialog.getByLabel("Date", { exact: true }).fill("2030-05-12");
  await dialog.locator('button[type="submit"]').click();
  await expect(
    page.getByText("Created in emulator only", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Created in emulator only", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByLabel("Date", { exact: true }),
  ).toHaveValue("2030-05-12");
  await page
    .getByRole("dialog")
    .getByLabel("Title", { exact: true })
    .fill("Updated in emulator only");
  await page.getByRole("dialog").locator('button[type="submit"]').click();
  await expect(
    page.getByText("Updated in emulator only", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Delete Updated in emulator only",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "YES, DELETE", exact: true }).click();
  await expect(
    page.getByText("Updated in emulator only", { exact: true }),
  ).toHaveCount(0);
});
