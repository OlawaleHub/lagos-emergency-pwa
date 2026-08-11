// public/sw.js
// Offline-first service worker for HelpmeNG.
// Strategy:
//   - Precache the app shell on install so the app boots with zero network.
//   - Cache-first for static assets (icons), network-first for pages, stale-while-revalidate for the Next build.
//   - Intercept Background Sync: replay queued POSTs to /api/emergency when connectivity returns.

const VERSION = "v1.0.0";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const BG_SYNC_TAG = "emergency-sync";

// App shell — minimal set that must load offline.
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/offline",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never intercept non-GET and never intercept the sync endpoint itself
  // (the Background Sync 'fetch' event is what we use to replay).
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Don't cache API requests — they need to reach the network when online.
  if (url.pathname.startsWith("/api/")) return;

  // Network-first for navigation/page loads so updates are seen when online,
  // with offline fallback to the cached shell.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/offline"))
        )
    );
    return;
  }

  // Stale-while-revalidate for build assets (_next/static).
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((res) => {
              cache.put(request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Cache-first for everything else (icons, manifest).
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => cached))
  );
});

// Background Sync: replay queued alerts when the browser decides a connection exists.
self.addEventListener("sync", (event) => {
  if (event.tag === BG_SYNC_TAG) {
    event.waitUntil(replayQueuedAlerts());
  }
});

// Periodic / on-demand sync fallback (when supported).
self.addEventListener("periodicsync", (event) => {
  if (event.tag === BG_SYNC_TAG) {
    event.waitUntil(replayQueuedAlerts());
  }
});

async function replayQueuedAlerts() {
  // The app stores queued alerts in IndexedDB under the "alerts" store.
  const db = await openDB();
  const tx = db.transaction("alerts", "readwrite");
  const store = tx.objectStore("alerts");
  const all = await store.getAll();

  for (const alert of all) {
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      });
      if (res.ok) {
        await store.delete(alert.id);
      }
    } catch (err) {
      // Still offline — leave in queue for the next sync.
    }
  }
  await tx.done;

  // Notify any open tabs so the UI can update status badges.
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach((c) => c.postMessage({ type: "sync-complete" }));
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("lagos-emergency-db", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("alerts")) {
        db.createObjectStore("alerts", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
