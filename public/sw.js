const CACHE_NAME = "roa-v1";
const OFFLINE_URL = "/offline";

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/courses",
  "/pricing",
  "/site.webmanifest",
];

// Install event - cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Cache core assets
      await cache.addAll(PRECACHE_ASSETS);
      // Activate immediately
      self.skipWaiting();
    })()
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      // Take control of all pages immediately
      self.clients.claim();
    })()
  );
});

// Fetch event - network-first with cache fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip API requests - always go to network
  if (event.request.url.includes("/api/")) return;

  // Skip Clerk authentication requests
  if (event.request.url.includes("clerk")) return;

  // Skip video requests - too large to cache
  if (
    event.request.url.includes("cloudinary") ||
    event.request.url.includes(".mp4") ||
    event.request.url.includes(".webm")
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network first
        const networkResponse = await fetch(event.request);

        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch {
        // Network failed, try cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // For navigation requests, show offline page
        if (event.request.mode === "navigate") {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // Return a basic offline response
        return new Response("Offline", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});

// Background sync for progress updates
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-progress") {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Get pending progress updates from IndexedDB
  // This would sync lesson progress when back online
  console.log("[SW] Syncing progress...");
}

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data.url;
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
