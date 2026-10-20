import type Stripe from "stripe";
import { adminNotifyEmail, sendOutboundEmail } from "@/lib/adminNotify";
import { getDedupeStore, type DedupeStore } from "./idempotency";
import { buildPrintfulOrder, createPrintfulOrder, isManualLine, missingSyncVariants, sessionDetails } from "./printful";
import { badgeAttachments, badgeEmailLines, badgeJobs, storeBadgeFiles } from "./badge-files";
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

/** Build the admin order email (subject, text, html, attachments). Exported so it can be checked without sending. */
export async function buildShopOrderEmail(record: ShopOrderRecord, opts: { storeFiles?: boolean } = {}) {
  const hasBadges = record.lines.some((l) => l.badge);
  const printfulPart = record.lines.some((l) => !isManualLine(l));
  const headline =
    record.status === "sent-to-printful"
      ? `Sent to Printful${record.printfulOrderId ? ` (order ${record.printfulOrderId}, ${record.printfulStatus ?? "draft"})` : ""}.${hasBadges ? " ACTION NEEDED for the name badges below: make them by hand." : ""}`
      : printfulPart
        ? `ACTION NEEDED: place this order by hand. ${record.reason ?? ""}`.trim()
        : hasBadges
          ? "ACTION NEEDED: make these name badges by hand. The print files are attached."
          : "ACTION NEEDED: mail these pre-order items by hand (enamel pins).";
  let jobs: Awaited<ReturnType<typeof badgeJobs>> = [];
  if (hasBadges) {
    try {
      jobs = await badgeJobs(record.lines);
      if (opts.storeFiles !== false) await storeBadgeFiles(record.sessionId, jobs);
    } catch (err) {
      logError("shop-fulfill", err, { session: record.sessionId, op: "badge-files" });
    }
  }
  const r = record.recipient;
  const lines = record.lines.map((l) => `${l.quantity} x ${l.name} (${l.label}) [${l.sku}] @ ${money(l.unitCents)}`);
  const address = [r.name, r.address1, r.address2, `${r.city}, ${r.state_code ?? ""} ${r.zip}`, r.country_code].filter(Boolean);
  const text = [
    `New merch order${record.livemode ? "" : " (Stripe TEST mode)"}`,
    headline,
    "",
    "Items:",
    ...lines,
    ...badgeEmailLines(jobs),
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
  const subject = `${record.status === "sent-to-printful" && !hasBadges ? "" : "[Action needed] "}${hasBadges ? "Name badge" : "Merch"} order ${money(record.amountTotalCents)}${record.livemode ? "" : " (test)"}`;
  const html = `<pre style="font:14px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`;
  return { to: adminNotifyEmail(), subject, text, html, attachments: badgeAttachments(jobs), jobs };
}

/** Email the site admin about a shop order (with name badge print files attached). Never throws. */
export async function notifyAdminOfShopOrder(record: ShopOrderRecord) {
  try {
    const { to, subject, text, html, attachments } = await buildShopOrderEmail(record);
    const res = await sendOutboundEmail({ to, subject, text, html, attachments: attachments.length ? attachments : undefined });
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
    (async (id: string) => {
      const stripe = getShopStripe();
      const s = await stripe.checkout.sessions.retrieve(id, { expand: ["line_items.data.price.product"] });
      // Expanded line_items is one page; badge orders can have more lines, so fetch them all when needed.
      if (s.line_items?.has_more) {
        const all = await stripe.checkout.sessions.listLineItems(id, { limit: 100, expand: ["data.price.product"] });
        s.line_items = all;
      }
      return s;
    });
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
    const printLines = lines.filter((l) => !isManualLine(l));
    const missing = missingSyncVariants(printLines);
    if (!printLines.length) {
      record.reason = lines.some((l) => l.badge)
        ? "Name badges only: made by hand from the attached print files."
        : "Hand-fulfilled items only (enamel pins): mail them by hand.";
    } else if (!printfulApiKey()) {
      record.reason = "PRINTFUL_API_KEY is not set.";
    } else if (missing.length) {
      record.reason = `No Printful sync variant id configured for: ${missing.join(", ")}.`;
    } else {
      try {
        const order = buildPrintfulOrder(session.id, printLines, recipient, shippingCents);
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
