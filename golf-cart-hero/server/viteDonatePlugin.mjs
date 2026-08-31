/**
 * Vite plugin: /api/donate/* for local Stripe Checkout.
 */
import { loadEnv } from "vite";
import {
  confirmCheckoutSession,
  createCheckoutSession,
  getStripe,
  parseAmount,
  readJsonBody,
  sendJson,
  siteBaseUrl,
} from "./donateApi.mjs";

export function viteDonatePlugin() {
  return {
    name: "vgch-donate-api",
    configureServer(server) {
      const env = {
        ...process.env,
        ...loadEnv(server.config.mode, server.config.envDir || process.cwd(), ""),
      };

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] || "";
        if (!url.startsWith("/api/donate/")) return next();

        const stripe = getStripe(env.STRIPE_SECRET_KEY);

        try {
          if (url === "/api/donate/status" && req.method === "GET") {
            return sendJson(res, 200, { ready: Boolean(stripe) });
          }

          if (url === "/api/donate/checkout" && req.method === "POST") {
            if (!stripe) {
              return sendJson(res, 503, {
                error:
                  "Donations aren’t wired up yet. Add STRIPE_SECRET_KEY to .env.local (see README).",
              });
            }
            const body = await readJsonBody(req);
            const amountUsd = parseAmount(body.amountUsd);
            if (amountUsd == null) {
              return sendJson(res, 400, {
                error: "Pick $1, $3, or $5.",
              });
            }
            const base = siteBaseUrl(env, req);
            const session = await createCheckoutSession({
              stripe,
              amountUsd,
              baseUrl: base,
            });
            if (!session.url) {
              return sendJson(res, 500, {
                error: "Could not start checkout. Try again.",
              });
            }
            return sendJson(res, 200, { url: session.url, amountUsd });
          }

          if (url === "/api/donate/confirm" && req.method === "POST") {
            if (!stripe) {
              return sendJson(res, 503, { error: "Stripe not configured" });
            }
            const body = await readJsonBody(req);
            const sessionId = String(body.sessionId || "").trim();
            if (!sessionId) {
              return sendJson(res, 400, { error: "sessionId required" });
            }
            const result = await confirmCheckoutSession({ stripe, sessionId });
            if (result.error) {
              return sendJson(res, result.status || 400, {
                error: result.error,
              });
            }
            return sendJson(res, 200, result);
          }

          return sendJson(res, 404, { error: "Not found" });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Donation API error";
          console.error("[donate]", message);
          return sendJson(res, 500, { error: message });
        }
      });
    },
  };
}
