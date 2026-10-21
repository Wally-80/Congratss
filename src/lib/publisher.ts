/** A bearer token may only go to the explicitly configured HTTPS publisher.
 * Loopback HTTP is reserved for local development with demo emulators. */
export function publisherOrigin(value: string | undefined): string {
  if (!value) return "";
  try {
    const normalized = value.replace(/\/$/, "");
    const url = new URL(normalized);
    const local =
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_USE_EMULATORS === "true" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname);
    return url.origin === normalized &&
      !url.username &&
      !url.password &&
      (url.protocol === "https:" || local)
      ? url.origin
      : "";
  } catch {
    return "";
  }
}
