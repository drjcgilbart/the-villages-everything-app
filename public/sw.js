/* Minimal worker so Chrome/Edge treat the site as installable.
   Network-only: do not cache pages (Studio / admin / member data must stay live). */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(
        list.map(async (client) => {
          try {
            const url = new URL(client.url);
            if (url.hostname !== "thevillageseverythingapp.com" || !("navigate" in client)) return;
            url.hostname = "www.thevillageseverythingapp.com";
            await client.navigate(url.href);
          } catch {
            /* leave the tab where it is */
          }
        })
      );
    })()
  );
});

self.addEventListener("fetch", () => {
  // The listener is what makes the site installable. Do not answer the
  // request here. The apex host redirects to www, and answering it kept
  // the address bar on the apex host, so the member cookie never arrived
  // with the Holiday Lights and email-confirmation checks.
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
