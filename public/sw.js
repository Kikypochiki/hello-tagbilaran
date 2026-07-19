/*
 * Retirement worker for the removed offline prototype.
 * Existing registrations update to this script, purge their old caches, and
 * unregister. The current application does not register a service worker.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.registration.unregister();

      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      await Promise.all(windows.map((client) => client.navigate(client.url)));
    })(),
  );
});
