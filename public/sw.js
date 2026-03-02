const CACHE_NAME = "gratzz-v2";
const APP_SHELL = [
    "/",
    "/manifest.json",
    "/pwa-192.png",
    "/pwa-512.png",
    "/favicon.ico",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const cacheKeys = await caches.keys();
            await Promise.all(
                cacheKeys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
            await self.clients.claim();
        })()
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(request);
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                } catch {
                    const cache = await caches.open(CACHE_NAME);
                    return (await cache.match(request)) || (await cache.match("/")) || new Response("Offline", { status: 503 });
                }
            })()
        );
        return;
    }

    if (
        request.destination === "script" ||
        request.destination === "style" ||
        request.destination === "image" ||
        url.pathname.startsWith("/_next/")
    ) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(request);

                const networkResponsePromise = fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => undefined);

                if (cachedResponse) return cachedResponse;
                return (await networkResponsePromise) || new Response("Offline", { status: 503 });
            })()
        );
    }
});
