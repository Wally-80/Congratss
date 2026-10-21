import express from "express";
import { createHash, randomUUID } from "node:crypto";
import { cardSchema } from "../../shared/card.mjs";
import { renderHtml, renderPng, characterSvg } from "./render.mjs";
const idPattern = /^[a-f0-9-]{36}$/;
export function createPublisher({
  auth,
  store,
  publicOrigin,
  appOrigin,
  allowedOrigins,
}) {
  const app = express();
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY",
      "Cache-Control": "no-store",
      "Content-Security-Policy":
        "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    });
    const origin = req.get("Origin");
    if (origin && !allowedOrigins.includes(origin))
      return res.status(403).json({ error: "Origin not allowed." });
    if (origin) {
      res.set("Access-Control-Allow-Origin", origin);
      res.vary("Origin");
    }
    res.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, Idempotency-Key",
    );
    res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
  app.use(express.json({ limit: "32kb", strict: true }));
  async function authenticated(req, res, next) {
    const match = /^Bearer (\S+)$/.exec(req.get("Authorization") ?? "");
    if (!match) return res.status(401).json({ error: "Sign in to publish." });
    try {
      const identity = await auth.verifyIdToken(match[1], true);
      if (identity.email_verified !== true)
        return res
          .status(403)
          .json({ error: "Verify your email before publishing." });
      req.identity = identity;
      next();
    } catch {
      res.status(401).json({ error: "Your session expired. Sign in again." });
    }
  }
  const result = (id) => ({
    id,
    url: `${publicOrigin}/c/${id}`,
    imageUrl: `${publicOrigin}/c/${id}/image.png`,
  });
  app.get("/health", (_req, res) => res.json({ ok: true, schemaVersion: 1 }));
  app.post("/api/cards", authenticated, async (req, res, next) => {
    const parsed = cardSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: parsed.error.issues[0].message });
    const key = req.get("Idempotency-Key") || randomUUID();
    if (!idPattern.test(key))
      return res.status(400).json({ error: "Invalid publish request ID." });
    const digest = createHash("sha256")
      .update(JSON.stringify(parsed.data))
      .digest("hex");
    const id = createHash("sha256")
      .update(`${req.identity.uid}:${key}`)
      .digest("hex")
      .slice(0, 32)
      .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
    try {
      await store.publish(id, {
        schemaVersion: 1,
        userId: req.identity.uid,
        content: parsed.data,
        digest,
        revoked: false,
        createdAt: Date.now(),
      });
      res.status(201).json(result(id));
    } catch (e) {
      next(e);
    }
  });
  app.get("/api/cards", authenticated, async (req, res, next) => {
    try {
      res.json(
        (await store.list(req.identity.uid)).map((item) => ({
          ...result(item.id),
          title: item.content.title,
        })),
      );
    } catch (e) {
      next(e);
    }
  });
  app.delete("/api/cards", authenticated, async (req, res, next) => {
    try {
      await store.eraseOwner(req.identity.uid);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
  app.delete("/api/cards/:id", authenticated, async (req, res, next) => {
    if (!idPattern.test(req.params.id)) return res.sendStatus(404);
    try {
      await store.revoke(req.params.id, req.identity.uid);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
  app.get(
    ["/c/:id", "/c/:id/image.png", "/c/:id/og.png", "/c/:id/character.svg"],
    async (req, res, next) => {
      if (!idPattern.test(req.params.id))
        return res.status(404).send("Card unavailable.");
      try {
        const snapshot = await store.get(req.params.id);
        if (!snapshot || snapshot.revoked)
          return res.status(404).send("Card unavailable.");
        const card = cardSchema.parse(snapshot.content);
        const url = `${publicOrigin}/c/${req.params.id}`;
        if (req.path.endsWith("/character.svg"))
          return res.type("svg").send(characterSvg());
        if (req.path.endsWith(".png")) {
          const preview = req.path.endsWith("/og.png");
          if (req.query.download === "1")
            res.attachment(`congratss-${req.params.id}.png`);
          return res.type("png").send(await renderPng(card, preview));
        }
        res
          .type("html")
          .send(renderHtml(card, url, `${url}/og.png`, appOrigin));
      } catch (e) {
        next(e);
      }
    },
  );
  app.use((error, _req, res, _next) => {
    void _next;
    if (error.status && [400, 403, 404, 409, 413, 429].includes(error.status))
      return res.status(error.status).json({ error: error.message });
    // Never return provider errors, tokens or database details to recipients.
    res
      .status(503)
      .json({
        error: "Card service temporarily unavailable. Please try again.",
      });
  });
  return app;
}
