import { CURRENCY, findVariant, type Product, type Variant } from "./catalog";
import {
  BADGE_PAIR_UNIT_CENTS,
  BADGE_SIZES,
  BADGE_UNIT_CENTS,
  themeFromSku,
  validateBadgeText,
  type BadgeFieldErrors,
  type BadgeText,
  type BadgeTheme,
} from "./badges";
import { isProfane, PROFANITY_MESSAGE } from "./badge-profanity";

export type CartLine = { sku: string; qty: number; badge?: { name?: string; village?: string } };
export const MAX_QTY = 10;

export class PricingError extends Error {
  fields?: BadgeFieldErrors;
  constructor(message: string, fields?: BadgeFieldErrors) {
    super(message);
    this.fields = fields;
  }
}

/** Server check for one custom badge: format rules plus the profanity filter. Throws PricingError. */
export function checkCustomBadge(theme: BadgeTheme, input: { name?: unknown; village?: unknown }): BadgeText {
  const { ok, text, errors } = validateBadgeText(theme, input);
  if (!ok) throw new PricingError(errors.name || errors.village || "Please check the badge text.", errors);
  const fields: BadgeFieldErrors = {};
  if (isProfane(text.name)) fields.name = PROFANITY_MESSAGE;
  if (text.village && isProfane(text.village)) fields.village = PROFANITY_MESSAGE.replace("a different name", "a different village");
  if (fields.name || fields.village) throw new PricingError(PROFANITY_MESSAGE, fields);
  return text;
}

type BadgeInfo = { kind: "custom" | "ready"; theme: string; themeLabel: string; name: string; village: string; size: string };

function badgeInfo(product: Product, variant: Variant, text?: BadgeText): BadgeInfo | undefined {
  if (product.badge?.kind === "ready") {
    return { kind: "ready", theme: "edenfield-ready", themeLabel: product.name, name: product.name.split(",")[0], village: "Edenfield", size: BADGE_SIZES.ready.id };
  }
  const theme = themeFromSku(variant.sku);
  if (!theme || !text) return undefined;
  return { kind: "custom", theme: theme.id, themeLabel: theme.label, name: text.name, village: text.village ?? "", size: BADGE_SIZES.custom.id };
}

function badgeDescription(b: BadgeInfo, pair: boolean) {
  const size = b.kind === "ready" ? `${BADGE_SIZES.ready.label} magnetic` : `${BADGE_SIZES.custom.label} magnetic`;
  const text = b.kind === "ready" ? "Ready-made design" : `\u201c${b.name}\u201d${b.village ? ` \u00b7 Village of ${b.village}` : ""}`;
  return `${text} \u00b7 ${size}${pair ? " \u00b7 2 for $28 pair price" : ""}`;
}

/**
 * Turn untrusted client cart lines into Stripe line items using server prices only.
 * Name badges (custom and ready-made together): every pair is $28 and an odd one is $16. Done with line-item
 * pricing: badges in a pair are charged $14 each, the odd one $16, so a split line becomes two Stripe lines.
 */
export function buildLineItems(input: unknown, opts: { taxBehavior?: "exclusive" | "inclusive" } = {}) {
  if (!Array.isArray(input) || input.length === 0) throw new PricingError("Cart is empty");
  if (input.length > 20) throw new PricingError("Too many lines");
  type Merged = { sku: string; qty: number; text?: BadgeText };
  const merged = new Map<string, Merged>();
  for (const raw of input) {
    const r = (raw ?? {}) as { sku?: unknown; qty?: unknown; badge?: { name?: unknown; village?: unknown } };
    const sku = r.sku;
    const qty = Number(r.qty);
    const found = typeof sku === "string" ? findVariant(sku) : undefined;
    if (typeof sku !== "string" || !found) throw new PricingError(`Unknown item: ${String(sku).slice(0, 40)}`);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new PricingError("Invalid quantity");
    let text: BadgeText | undefined;
    if (found.product.badge?.kind === "custom") {
      const theme = themeFromSku(sku);
      if (!theme) throw new PricingError(`Unknown item: ${sku.slice(0, 40)}`);
      text = checkCustomBadge(theme, r.badge ?? {});
    }
    const key = text ? `${sku}|${text.name}|${text.village ?? ""}`.toLowerCase() : sku;
    const prev = merged.get(key);
    merged.set(key, { sku, text, qty: Math.min(MAX_QTY, (prev?.qty ?? 0) + qty) });
  }

  const lines = [...merged.values()];
  const badgeUnits = lines.reduce((n, l) => n + (findVariant(l.sku)!.product.type === "badges" ? l.qty : 0), 0);
  let pairUnitsLeft = Math.floor(badgeUnits / 2) * 2;

  let subtotal = 0;
  const badges: (BadgeInfo & { qty: number })[] = [];
  const lineItems = lines.flatMap(({ sku, qty, text }) => {
    const { product, variant } = findVariant(sku)!;
    const item = (quantity: number, unit: number, description: string, metadata: Record<string, string>) => {
      subtotal += unit * quantity;
      return {
        quantity,
        price_data: {
          currency: CURRENCY,
          unit_amount: unit,
          ...(opts.taxBehavior ? { tax_behavior: opts.taxBehavior } : {}),
          product_data: { name: product.name, description, metadata: { sku, ...metadata }, tax_code: product.taxCode },
        },
      };
    };
    if (product.type !== "badges") return [item(qty, product.priceCents, variant.label, {})];
    const b = badgeInfo(product, variant, text);
    if (!b) throw new PricingError(`Unknown item: ${sku.slice(0, 40)}`);
    badges.push({ ...b, qty });
    const meta = { badge_kind: b.kind, badge_theme: b.theme, badge_name: b.name, badge_village: b.village, badge_size: b.size };
    const name = b.kind === "custom" ? `Custom Name Badge (${b.themeLabel})` : product.name;
    const paired = Math.min(qty, pairUnitsLeft);
    pairUnitsLeft -= paired;
    const out = [];
    const withName = (li: ReturnType<typeof item>) => ({ ...li, price_data: { ...li.price_data, product_data: { ...li.price_data.product_data, name } } });
    if (paired) out.push(withName(item(paired, BADGE_PAIR_UNIT_CENTS, badgeDescription(b, true), { ...meta, badge_price: "pair" })));
    if (qty - paired) out.push(withName(item(qty - paired, BADGE_UNIT_CENTS, badgeDescription(b, false), { ...meta, badge_price: "single" })));
    return out;
  });
  return { lineItems, subtotal, badges, badgeUnits };
}

/** Session-level metadata for badges: one key per badge line (kind|theme|name|village|size|qty), plus a count. */
export function badgeSessionMetadata(badges: (BadgeInfo & { qty: number })[]) {
  const meta: Record<string, string> = {};
  if (!badges.length) return meta;
  meta.badge_count = String(badges.reduce((n, b) => n + b.qty, 0));
  badges.slice(0, 20).forEach((b, i) => {
    meta[`badge_${i + 1}`] = [b.kind, b.theme, b.name, b.village, b.size, `x${b.qty}`].join("|").slice(0, 500);
  });
  return meta;
}
