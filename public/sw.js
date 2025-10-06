const CACHE_NAME = "when-where-v1";
const STATIC_CACHE = "when-where-static-v1";
const DYNAMIC_CACHE = "when-where-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/_next/static/css/",
  "/_next/static/js/",
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/firestore\.googleapis\.com/,
  // Firebase Storage removido do cache para evitar requests indesejados
  /^https:\/\/images\.unsplash\.com/,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith("/_next/static/")) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (API_CACHE_PATTERNS.some((pattern) => pattern.test(url.href))) {
    // API calls - network first with cache fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (url.pathname.startsWith("/api/")) {
    // API routes - network only
    event.respondWith(fetch(request));
  } else {
    // HTML pages - network first with cache fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Cache first failed:", error);
    return new Response("Network error", { status: 408 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Network failed, trying cache:", error);

    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for HTML requests
    if (request.headers.get("accept")?.includes("text/html")) {
      const offlinePage = await cache.match("/offline.html");
      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log("Service Worker: Background sync");

  // Here you can implement background sync for offline actions
  // For example, sync trip data when connection is restored

  try {
    // Get pending actions from IndexedDB
    const pendingActions = await getPendingActions();

    for (const action of pendingActions) {
      await syncAction(action);
    }

    console.log("Service Worker: Background sync completed");
  } catch (error) {
    console.error("Service Worker: Background sync failed", error);
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/android-chrome-192x192.png",
      badge: "/favicon-32x32.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || "1",
      },
      actions: [
        {
          action: "explore",
          title: "Ver detalhes",
          icon: "/icon-explore.png",
        },
        {
          action: "close",
          title: "Fechar",
          icon: "/icon-close.png",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Helper functions for IndexedDB (simplified)
async function getPendingActions() {
  // Implementation would depend on your IndexedDB structure
  return [];
}

async function syncAction(action) {
  // Implementation would depend on your sync strategy
  console.log("Syncing action:", action);
}
