/**
 * Shared Stripe tip handlers for Vite middleware (dev) and optional Node hosts.
 * Env: STRIPE_SECRET_KEY, SITE_URL (optional), VITE_SITE_URL (optional)
 */
import Stripe from "stripe";

export const DONATION_AMOUNTS = new Set([1, 3, 5]);

export function getStripe(secretKey) {
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

export function siteBaseUrl(env, req) {
  const fromEnv =
    env.SITE_URL?.replace(/\/$/, "") ||
    env.VITE_SITE_URL?.replace(/\/$/, "") ||
    env.PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (req?.headers?.host) {
    const proto =
      req.headers["x-forwarded-proto"] ||
      (String(req.headers.host).includes("localhost") ? "http" : "https");
    return `${proto}://${req.headers.host}`;
  }
  return "http://localhost:5173";
}

export function parseAmount(raw) {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!DONATION_AMOUNTS.has(n)) return null;
  return n;
}

export function flagMeta(amountUsd) {
  if (amountUsd === 5) return { color: "Gold", name: "Lanai legend tip" };
  if (amountUsd === 3) return { color: "Blue", name: "Happy-hour tip" };
  return { color: "Red", name: "Cart-path tip" };
}

export async function createCheckoutSession({ stripe, amountUsd, baseUrl }) {
  const cents = Math.round(amountUsd * 100);
  const meta = flagMeta(amountUsd);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "donate",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cents,
          product_data: {
            name: `Golf Cart Hero — ${meta.name} ($${amountUsd})`,
            description: `Tip for The Villages Golf Cart Hero. Unlocks a ${meta.color} supporter flag with the golf-ball mascot on your cart.`,
            images: [`${baseUrl}/assets/mascot-logo.jpg`],
            tax_code: "txcd_10000000",
          },
        },
      },
    ],
    success_url: `${baseUrl}/?donate=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/?donate=canceled`,
    metadata: {
      purpose: "golf-cart-hero-donation",
      amount_usd: String(amountUsd),
      flag_color: meta.color,
    },
  });
  return session;
}

export async function confirmCheckoutSession({ stripe, sessionId }) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.purpose !== "golf-cart-hero-donation") {
    return { error: "Not a Golf Cart Hero donation session", status: 400 };
  }
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { error: "Payment not complete", status: 400 };
  }
  const amountUsd =
    parseAmount(session.metadata?.amount_usd) ??
    (typeof session.amount_total === "number"
      ? parseAmount(session.amount_total / 100)
      : null);
  if (amountUsd == null) {
    return {
      ok: true,
      amountUsd: null,
      message: "Thanks for the tip!",
    };
  }
  const meta = flagMeta(amountUsd);
  return {
    ok: true,
    amountUsd,
    flagColor: meta.color,
    message: `Thanks! Your cart now flies a ${meta.color} supporter flag whenever you race.`,
  };
}

/** Read JSON body from a Node IncomingMessage. */
export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(body);
}
