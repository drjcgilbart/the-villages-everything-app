/* Minimal worker so Chrome/Edge treat the site as installable.
   Network-only: do not cache pages (Studio / admin / member data must stay live). */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass through — present so Chrome/Edge consider the site installable.
  event.respondWith(fetch(event.request));
});
