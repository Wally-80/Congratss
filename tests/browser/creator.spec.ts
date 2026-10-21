import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
test("homepage has original responsive artwork, navigation and accessible structure", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Turn any message into something unforgettable.",
  );
  await expect(
    page.getByText("Write anything. Make it beautiful. Share it anywhere."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Create Card", exact: true }).first(),
  ).toHaveAttribute("href", "/create");
  await mkdir("docs/screenshots", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "docs/screenshots/home-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "docs/screenshots/home-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".float-slow")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
});
test("creator preserves author content, interaction and drafts across reloads", async ({
  page,
}) => {
  await page.goto("/create");
  await page
    .getByLabel("Title", { exact: true })
    .fill("A card made just for Sam");
  await page
    .getByLabel("Your message")
    .fill("My own words. Nothing rewritten.");
  await page
    .getByLabel("Expandable details")
    .fill("The quiet details belong here.");
  await page.getByLabel("Checklist").fill("Bring a smile\nBring a friend");
  await page.getByRole("button", { name: "Add button", exact: true }).click();
  await page.getByLabel("Button 1 label").fill("RSVP");
  await page
    .getByLabel("Button 1 destination")
    .fill("https://example.com/rsvp");
  const preview = page.getByRole("article", { name: "Live card preview" });
  await expect(preview.getByRole("heading")).toHaveText(
    "A card made just for Sam",
  );
  await expect(
    preview.getByText("My own words. Nothing rewritten."),
  ).toBeVisible();
  await preview.locator("summary").click();
  await expect(
    preview.getByText("The quiet details belong here."),
  ).toBeVisible();
  await expect(preview.getByRole("link", { name: "RSVP" })).toHaveAttribute(
    "href",
    "https://example.com/rsvp",
  );
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Draft saved on this device",
  );
  await page.reload();
  await page
    .getByRole("button", { name: "A card made just for Sam Open draft" })
    .click();
  await expect(page.getByLabel("Your message")).toHaveValue(
    "My own words. Nothing rewritten.",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "docs/screenshots/creator-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "docs/screenshots/creator-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
});
test("all purposes and explicit templates work without silently changing the message", async ({
  page,
}) => {
  await page.goto("/create");
  await page.getByLabel("Your message").fill("Keep these exact words.");
  for (const name of [
    "Greetings",
    "Invitations",
    "Announcements",
    "Instructions",
    "Reminders",
    "Business",
    "Anything else",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.getByLabel("Your message")).toHaveValue(
      "Keep these exact words.",
    );
  }
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Greetings", exact: true }).click();
  await page.getByRole("button", { name: "A little joy" }).click();
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "A little joy, just for you.",
  );
  await page.getByRole("button", { name: "Add button", exact: true }).click();
  await page.getByLabel("Button 1 destination").fill("javascript:alert(1)");
  await expect(page.getByRole("article").getByRole("link")).toHaveCount(0);
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("HTTPS");
});
test("legacy routes and dedicated dashboard remain reachable", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
  await page.goto("/card?img=%2Fgreeting_cake.png");
  await expect(
    page.getByRole("img", { name: "Shared greeting card" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Shared greeting card" }),
  ).toHaveAttribute("src", "/greeting_cake.png");
  await page.goto("/login");
  await expect(page).toHaveURL(/\/auth/);
});
