import { CURRENCY, findVariant, type Product, type Variant } from "./catalog";
import {
  BADGE_SIZE,
  badgeMaterialOrDefault,
  getBadgeMaterial,
  themeFromSku,
  validateBadgeText,
  type BadgeFieldErrors,
  type BadgeMaterial,
  type BadgeText,
  type BadgeTheme,
} from "./badges";
import { isProfane, PROFANITY_MESSAGE } from "./badge-profanity";

export type CartLine = { sku: string; qty: number; badge?: { name?: string; village?: string }; material?: string };
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

export type BadgeInfo = {
  kind: "custom" | "ready";
  theme: string;
  themeLabel: string;
  name: string;
  village: string;
  size: string;
  material: BadgeMaterial["id"];
  materialLabel: string;
};

function badgeInfo(product: Product, variant: Variant, material: BadgeMaterial, text?: BadgeText): BadgeInfo | undefined {
  const m = { size: BADGE_SIZE.id, material: material.id, materialLabel: material.label };
  if (product.badge?.kind === "ready") {
    return { kind: "ready", theme: "edenfield-ready", themeLabel: product.name, name: product.name.split(",")[0], village: "Edenfield", ...m };
  }
  const theme = themeFromSku(variant.sku);
  if (!theme || !text) return undefined;
  return { kind: "custom", theme: theme.id, themeLabel: theme.label, name: text.name, village: text.village ?? "", ...m };
}

/** e.g. "Linda" · Village of Fenney · White Aluminum (.025" gloss white aluminum) · 3" x 2" magnetic */
export function badgeDescription(b: Pick<BadgeInfo, "kind" | "name" | "village">, material: BadgeMaterial) {
  const text = b.kind === "ready" ? "Ready-made design" : `\u201c${b.name}\u201d${b.village ? ` \u00b7 Village of ${b.village}` : ""}`;
  return `${text} \u00b7 ${material.label} (${material.spec}) \u00b7 ${BADGE_SIZE.label} magnetic`;
}

/**
 * Turn untrusted client cart lines into Stripe line items using server prices only.
 * Name badges: one flat price per badge by material (BADGE_MATERIALS in badges.ts). The client's material is only an id;
 * an unknown id is rejected, a missing one means the standard material.
 */
export function buildLineItems(input: unknown, opts: { taxBehavior?: "exclusive" | "inclusive" } = {}) {
  if (!Array.isArray(input) || input.length === 0) throw new PricingError("Cart is empty");
  if (input.length > 20) throw new PricingError("Too many lines");
  type Merged = { sku: string; qty: number; text?: BadgeText; material?: BadgeMaterial };
  const merged = new Map<string, Merged>();
  for (const raw of input) {
    const r = (raw ?? {}) as { sku?: unknown; qty?: unknown; badge?: { name?: unknown; village?: unknown }; material?: unknown };
    const sku = r.sku;
    const qty = Number(r.qty);
    const found = typeof sku === "string" ? findVariant(sku) : undefined;
    if (typeof sku !== "string" || !found) throw new PricingError(`Unknown item: ${String(sku).slice(0, 40)}`);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new PricingError("Invalid quantity");
    let text: BadgeText | undefined;
    let material: BadgeMaterial | undefined;
    if (found.product.type === "badges") {
      if (r.material !== undefined && r.material !== null && r.material !== "" && !getBadgeMaterial(r.material)) throw new PricingError("Please pick a badge material.");
      material = badgeMaterialOrDefault(r.material);
    }
    if (found.product.badge?.kind === "custom") {
      const theme = themeFromSku(sku);
      if (!theme) throw new PricingError(`Unknown item: ${sku.slice(0, 40)}`);
      text = checkCustomBadge(theme, r.badge ?? {});
    }
    const key = material ? `${sku}|${text?.name ?? ""}|${text?.village ?? ""}|${material.id}`.toLowerCase() : sku;
    const prev = merged.get(key);
    merged.set(key, { sku, text, material, qty: Math.min(MAX_QTY, (prev?.qty ?? 0) + qty) });
  }

  const lines = [...merged.values()];
  const badgeUnits = lines.reduce((n, l) => n + (l.material ? l.qty : 0), 0);
  let subtotal = 0;
  const badges: (BadgeInfo & { qty: number })[] = [];
  const lineItems = lines.map(({ sku, qty, text, material }) => {
    const { product, variant } = findVariant(sku)!;
    const item = (unit: number, name: string, description: string, metadata: Record<string, string>) => {
      subtotal += unit * qty;
      return {
        quantity: qty,
        price_data: {
          currency: CURRENCY,
          unit_amount: unit,
          ...(opts.taxBehavior ? { tax_behavior: opts.taxBehavior } : {}),
          product_data: { name, description, metadata: { sku, ...metadata }, tax_code: product.taxCode },
        },
      };
    };
    if (!material) return item(product.priceCents, product.name, variant.label, {});
    const b = badgeInfo(product, variant, material, text);
    if (!b) throw new PricingError(`Unknown item: ${sku.slice(0, 40)}`);
    badges.push({ ...b, qty });
    const meta = {
      badge_kind: b.kind,
      badge_theme: b.theme,
      badge_name: b.name,
      badge_village: b.village,
      badge_size: b.size,
      badge_material: b.material,
      badge_material_label: `${material.label} (${material.spec})`,
    };
    const name = b.kind === "custom" ? `Custom Name Badge (${b.themeLabel})` : product.name;
    return item(material.priceCents, name, badgeDescription(b, material), meta);
  });
  return { lineItems, subtotal, badges, badgeUnits };
}

/** Session-level metadata for badges: one key per badge line (kind|theme|name|village|size|material|qty), plus a count. */
export function badgeSessionMetadata(badges: (BadgeInfo & { qty: number })[]) {
  const meta: Record<string, string> = {};
  if (!badges.length) return meta;
  meta.badge_count = String(badges.reduce((n, b) => n + b.qty, 0));
  badges.slice(0, 20).forEach((b, i) => {
    meta[`badge_${i + 1}`] = [b.kind, b.theme, b.name, b.village, b.size, b.material, `x${b.qty}`].join("|").slice(0, 500);
  });
  return meta;
}
