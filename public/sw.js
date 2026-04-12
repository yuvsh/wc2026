/// <reference lib="webworker" />
// @ts-check

// IMPORTANT: Bump CACHE_VERSION on every deploy that changes /icons/, /offline,
// or other non-hash-named static assets. /_next/static/ files are self-versioning
// via content hashes and do not require a version bump.
const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";

// Pre-cache the offline fallback page on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  );
});

// Remove stale caches from previous versions on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from our own origin
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Never cache API routes — they carry user-specific auth-gated data
  if (url.pathname.startsWith("/api/")) return;

  // Never cache Supabase edge function calls
  if (url.pathname.startsWith("/functions/")) return;

  // Navigation requests: network first, fall back to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches
          .match(OFFLINE_URL)
          .then((cached) => cached ?? Response.error())
      )
    );
    return;
  }

  // Next.js static chunks and icons: cache first, update in background
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    request.destination === "font" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response.ok) {
            caches
              .open(STATIC_CACHE)
              .then((cache) => cache.put(request, response.clone()));
          }
          return response;
        });
        return cached ?? networkFetch;
      })
    );
    return;
  }

  // Everything else: network with runtime cache as fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches
            .open(RUNTIME_CACHE)
            .then((cache) => cache.put(request, response.clone()));
        }
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached ?? Response.error())
      )
  );
});
