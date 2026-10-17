import type Stripe from "stripe";
import { createHash } from "crypto";
import { findVariant } from "./catalog";
import { printfulApiKey } from "./config";
import { syncVariantIdFor } from "./printful-variants";

/** Printful external_id is length-limited; derive a stable short id from the Stripe session id. */
export function externalIdFor(sessionId: string) {
  return "tvea_" + createHash("sha256").update(sessionId).digest("hex").slice(0, 27);
}

export type ShopOrderLine = { sku: string; name: string; label: string; quantity: number; unitCents: number };
export type ShopRecipient = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
  email?: string;
  phone?: string;
};

export type PrintfulOrder = {
  external_id: string;
  shipping: string;
  recipient: ShopRecipient;
  items: { sync_variant_id: number; quantity: number; external_id: string; name: string; retail_price: string }[];
  retail_costs?: { currency: string; shipping: string };
};

/** Pull our SKUs, quantities, and the shipping address out of a completed Session (line_items.data.price.product expanded). */
export function sessionDetails(session: Stripe.Checkout.Session): { lines: ShopOrderLine[]; recipient: ShopRecipient } {
  type Ship = { name?: string | null; address?: Stripe.Address | null } | null | undefined;
  const loose = session as unknown as { collected_information?: { shipping_details?: Ship }; shipping_details?: Ship };
  const details = loose.collected_information?.shipping_details ?? loose.shipping_details;
  const addr = details?.address;
  if (!addr?.line1 || !addr?.country) throw new Error("Session has no shipping address");
  const raw = session.line_items?.data ?? [];
  if (!raw.length) throw new Error("Session has no line items");
  const lines = raw.map((li) => {
    const product = li.price?.product as Stripe.Product | string | undefined;
    const sku = typeof product === "object" ? product?.metadata?.sku : undefined;
    const found = sku ? findVariant(sku) : undefined;
    if (!found) throw new Error(`Unmapped line item sku=${sku ?? "none"}`);
    return {
      sku: found.variant.sku,
      name: found.product.name,
      label: found.variant.label,
      quantity: li.quantity ?? 1,
      unitCents: found.product.priceCents,
    };
  });
  return {
    lines,
    recipient: {
      name: details?.name || session.customer_details?.name || "Customer",
      address1: addr.line1,
      address2: addr.line2 || undefined,
      city: addr.city || "",
      state_code: addr.state || undefined,
      country_code: addr.country,
      zip: addr.postal_code || "",
      email: session.customer_details?.email || undefined,
      phone: session.customer_details?.phone || undefined,
    },
  };
}

/** SKUs in this order that have no Printful sync variant id in printful-variants.ts. */
export function missingSyncVariants(lines: ShopOrderLine[]) {
  return lines.filter((l) => syncVariantIdFor(l.sku) === null).map((l) => l.sku);
}

/** Build the Printful order body. Call only after missingSyncVariants() returned an empty list. */
export function buildPrintfulOrder(sessionId: string, lines: ShopOrderLine[], recipient: ShopRecipient, shippingCents: number): PrintfulOrder {
  return {
    external_id: externalIdFor(sessionId),
    shipping: "STANDARD",
    recipient,
    items: lines.map((l) => {
      const id = syncVariantIdFor(l.sku);
      if (id === null) throw new Error(`No Printful sync variant id for ${l.sku}`);
      return {
        sync_variant_id: id,
        quantity: l.quantity,
        external_id: l.sku,
        name: `${l.name} (${l.label})`,
        retail_price: (l.unitCents / 100).toFixed(2),
      };
    }),
    retail_costs: { currency: "USD", shipping: (shippingCents / 100).toFixed(2) },
  };
}

export async function createPrintfulOrder(order: PrintfulOrder, confirm: boolean, fetchImpl: typeof fetch = fetch) {
  const token = printfulApiKey();
  if (!token) throw new Error("PRINTFUL_API_KEY is not configured");
  const headers: Record<string, string> = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  const res = await fetchImpl(`https://api.printful.com/orders?confirm=${confirm ? "true" : "false"}`, {
    method: "POST",
    headers,
    body: JSON.stringify(order),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { error?: { message?: string }; result?: unknown };
  if (!res.ok) throw new Error(`Printful ${res.status}: ${body?.error?.message ?? String(body?.result ?? "unknown")}`);
  return body.result as { id: number; status: string };
}
