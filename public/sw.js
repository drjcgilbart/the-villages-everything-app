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

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const stop = event.action === "stop";
  event.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const client = list.find((item) => item.visibilityState === "visible") || list[0];
      if (!client) return;
      await client.focus();
      if (stop) client.postMessage({ type: "tvea-alarm-stop" });
    })()
  );
});
