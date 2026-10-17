import type Stripe from "stripe";
import { adminNotifyEmail, sendOutboundEmail } from "@/lib/adminNotify";
import { getDedupeStore, type DedupeStore } from "./idempotency";
import { buildPrintfulOrder, createPrintfulOrder, missingSyncVariants, sessionDetails } from "./printful";
import { saveShopOrder, type ShopOrderRecord } from "./orders";
import { autoConfirm, printfulApiKey, SHOP_SESSION_SOURCE } from "./config";
import { getShopStripe } from "./stripe";
import { logError, logInfo } from "./log";

export type FulfillStatus = "ignored" | "not-shop" | "unpaid" | "duplicate" | ShopOrderRecord["status"];

type Deps = {
  store?: DedupeStore;
  retrieveSession?: (id: string) => Promise<Stripe.Checkout.Session>;
  createOrder?: typeof createPrintfulOrder;
  notify?: (record: ShopOrderRecord) => Promise<void>;
};

function money(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Email the site admin about a shop order. Never throws. */
export async function notifyAdminOfShopOrder(record: ShopOrderRecord) {
  const headline =
    record.status === "sent-to-printful"
      ? `Sent to Printful${record.printfulOrderId ? ` (order ${record.printfulOrderId}, ${record.printfulStatus ?? "draft"})` : ""}.`
      : `ACTION NEEDED: place this order by hand. ${record.reason ?? ""}`.trim();
  const r = record.recipient;
  const lines = record.lines.map((l) => `${l.quantity} x ${l.name} (${l.label}) [${l.sku}] @ ${money(l.unitCents)}`);
  const address = [r.name, r.address1, r.address2, `${r.city}, ${r.state_code ?? ""} ${r.zip}`, r.country_code].filter(Boolean);
  const text = [
    `New merch order${record.livemode ? "" : " (Stripe TEST mode)"}`,
    headline,
    "",
    "Items:",
    ...lines,
    "",
    `Total charged: ${money(record.amountTotalCents)} (shipping ${money(record.shippingCents)})`,
    "",
    "Ship to:",
    ...address,
    r.email ? `Email: ${r.email}` : "",
    r.phone ? `Phone: ${r.phone}` : "",
    "",
    `Stripe Checkout session: ${record.sessionId}`,
  ].join("\n");
  const subject = `${record.status === "sent-to-printful" ? "" : "[Action needed] "}Merch order ${money(record.amountTotalCents)}${record.livemode ? "" : " (test)"}`;
  try {
    const res = await sendOutboundEmail({
      to: adminNotifyEmail(),
      subject,
      text,
      html: `<pre style="font:14px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    });
    if (!res.ok) logError("shop-fulfill", "admin email not sent", { session: record.sessionId });
  } catch (err) {
    logError("shop-fulfill", err, { session: record.sessionId, op: "notify" });
  }
}

/**
 * Turn a paid shop Checkout Session into a fulfilled order. Idempotent by session id, so the webhook and the
 * success page can both call it. The session is always re-fetched from Stripe; nothing posted by a client is trusted.
 *
 * - PRINTFUL_API_KEY and every SKU's sync variant id present: create the Printful order (draft unless
 *   PRINTFUL_AUTO_CONFIRM=true), record it, and email the admin.
 * - Otherwise: record the order as needs-manual-fulfillment and email the admin. No crash.
 */
export async function fulfillShopSession(sessionId: string, deps: Deps = {}): Promise<{ status: FulfillStatus; session?: Stripe.Checkout.Session }> {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return { status: "ignored" };
  const retrieve =
    deps.retrieveSession ??
    ((id: string) => getShopStripe().checkout.sessions.retrieve(id, { expand: ["line_items.data.price.product"] }));
  const session = await retrieve(sessionId);
  if (session.metadata?.source !== SHOP_SESSION_SOURCE) return { status: "not-shop", session };
  if (session.payment_status !== "paid") return { status: "unpaid", session };

  const store = deps.store ?? getDedupeStore();
  const claimed = store.claim ? await store.claim(session.id) : !(await store.has(session.id));
  if (!claimed) return { status: "duplicate", session };
  if (!store.claim) await store.add(session.id);

  const notify = deps.notify ?? notifyAdminOfShopOrder;
  let record: ShopOrderRecord;
  try {
    const { lines, recipient } = sessionDetails(session);
    const shippingCents = session.shipping_cost?.amount_total ?? session.total_details?.amount_shipping ?? 0;
    record = {
      sessionId: session.id,
      createdAt: new Date().toISOString(),
      status: "needs-manual-fulfillment",
      amountTotalCents: session.amount_total ?? null,
      shippingCents,
      livemode: session.livemode,
      lines,
      recipient,
    };
    const missing = missingSyncVariants(lines);
    if (!printfulApiKey()) {
      record.reason = "PRINTFUL_API_KEY is not set.";
    } else if (missing.length) {
      record.reason = `No Printful sync variant id configured for: ${missing.join(", ")}.`;
    } else {
      try {
        const order = buildPrintfulOrder(session.id, lines, recipient, shippingCents);
        const result = await (deps.createOrder ?? createPrintfulOrder)(order, autoConfirm());
        record.status = "sent-to-printful";
        record.printfulOrderId = result?.id;
        record.printfulStatus = result?.status;
      } catch (err) {
        record.status = "printful-failed";
        record.reason = err instanceof Error ? err.message.slice(0, 300) : "Printful order failed";
      }
    }
  } catch (err) {
    // Unexpected shape (no address, unknown SKU). Release the claim so a retry can try again, and tell the admin.
    await store.remove(session.id).catch(() => undefined);
    logError("shop-fulfill", err, { session: session.id });
    throw err;
  }

  const where = await saveShopOrder(record);
  logInfo("shop-fulfill", "order recorded", { session: session.id, status: record.status, store: where, printfulId: record.printfulOrderId });
  await notify(record);
  return { status: record.status, session };
}
