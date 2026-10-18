// Custom name badges: themes, text rules, materials + prices and the auto-shrink fit. Shared by the product page (client)
// and the checkout + print renderer (server), so the preview and the print file use the same layout numbers.
// Every badge is a Lasercraft Executive 3" x 2" (thelasercraft.co) with a magnetic two-post backing.
// Layout units are print pixels on the 3" x 2" trim at 300 dpi (900 x 600). Print files add a 1/8" bleed.
// Art plates (everything except the buyer's text) live in public/shop/badges/plates-3x2/<theme>.png (976 x 676 with bleed).

export const BADGE_TRIM = { w: 900, h: 600 } as const;
export const BADGE_BLEED = 38; // 1/8 in at 300 dpi (37.5, rounded up)
export const BADGE_PRINT = { w: BADGE_TRIM.w + 2 * BADGE_BLEED, h: BADGE_TRIM.h + 2 * BADGE_BLEED } as const;

/** One size for every badge (custom and ready-made). */
export const BADGE_SIZE = {
  id: "3x2in",
  label: '3" x 2"',
  blank: "Lasercraft Executive 3\" x 2\"",
  long: '3" x 2" magnetic badge',
  backing: "magnetic two-post backing",
} as const;

// ---------- materials and prices: the ONE place badge prices live (server checkout and the page both read this) ----------
export type BadgeMaterialId = "white-acrylic" | "white-aluminum";
export type BadgeMaterial = { id: BadgeMaterialId; label: string; spec: string; tier: "Standard" | "Premium"; priceCents: number };
export const BADGE_MATERIALS: BadgeMaterial[] = [
  { id: "white-acrylic", label: "White Acrylic", spec: '1/8" cast acrylic', tier: "Standard", priceCents: 2000 },
  { id: "white-aluminum", label: "White Aluminum", spec: '.025" gloss white aluminum', tier: "Premium", priceCents: 2500 },
];
export const DEFAULT_BADGE_MATERIAL: BadgeMaterialId = "white-acrylic";
export function getBadgeMaterial(id: unknown): BadgeMaterial | undefined {
  return BADGE_MATERIALS.find((m) => m.id === id);
}
/** Unknown or missing material falls back to the standard one (old carts saved before materials existed). */
export function badgeMaterialOrDefault(id: unknown): BadgeMaterial {
  return getBadgeMaterial(id) ?? getBadgeMaterial(DEFAULT_BADGE_MATERIAL)!;
}
export const BADGE_FROM_CENTS = Math.min(...BADGE_MATERIALS.map((m) => m.priceCents));
export function badgeUnitCents(material: unknown) {
  return badgeMaterialOrDefault(material).priceCents;
}

export const NAME_MAX = 16;
export const VILLAGE_MAX = 26;

export type BadgeFontKey = "fraunces600" | "fraunces700" | "dmsans700" | "lilita" | "pacifico" | "playfairsc" | "greatvibes";

/** Family names are used both by satori (server) and by @font-face in badges.css (browser). */
export const BADGE_FONTS: Record<BadgeFontKey, { family: string; weight: 400 | 600 | 700; file: string }> = {
  fraunces600: { family: "Badge Fraunces", weight: 600, file: "fraunces-600.ttf" },
  fraunces700: { family: "Badge Fraunces", weight: 700, file: "fraunces-700.ttf" },
  dmsans700: { family: "Badge DM Sans", weight: 700, file: "dm-sans-700.ttf" },
  lilita: { family: "Badge Lilita One", weight: 400, file: "lilita-one-400.ttf" },
  pacifico: { family: "Badge Pacifico", weight: 400, file: "pacifico-400.ttf" },
  playfairsc: { family: "Badge Playfair Display SC", weight: 700, file: "playfair-display-sc-700.ttf" },
  greatvibes: { family: "Badge Great Vibes", weight: 400, file: "great-vibes-400.ttf" },
};

export type TextSlot = {
  left: number;
  top: number;
  width: number;
  height: number;
  font: BadgeFontKey;
  size: number; // starting font size (px at 300 dpi)
  min: number; // never shrink below this
  lineHeight: number; // unitless
  color: string;
  align: "left" | "center";
  letterSpacing?: number; // em
  upper?: boolean;
  shadow?: string;
  prefix?: string; // printed before the buyer's text, e.g. "Village of "
};

export type BadgeThemeId = "brand" | "golf" | "pickle" | "sunset" | "coastal" | "navy" | "edenfield";

export type BadgeTheme = {
  id: BadgeThemeId;
  label: string;
  blurb: string;
  usesVillage: boolean;
  sample: { name: string; village?: string };
  name: TextSlot;
  village?: TextSlot;
};

// Positions follow the approved concepts (src/badges.js + badges-v2.js), re-laid out for the 3:2 face. Themes 2-6 take a
// name only, so their name sits centred in the space the concept gave to name + village line. Edenfield matches the
// ready-made 3x2 Edenfield badges (same canvas and type sizes).
export const BADGE_THEMES: BadgeTheme[] = [
  {
    id: "brand",
    label: "Villages Everything",
    blurb: "Our wordmark and golf-ball mascot, with your name and village.",
    usesVillage: true,
    sample: { name: "Linda", village: "Fenney" },
    name: { left: 262, top: 166, width: 604, height: 150, font: "fraunces700", size: 140, min: 30, lineHeight: 1, color: "#1c2430", align: "left", letterSpacing: -0.03 },
    village: { left: 262, top: 340, width: 604, height: 66, font: "dmsans700", size: 46, min: 18, lineHeight: 1.3, color: "#1f6b4a", align: "left", prefix: "Village of " },
  },
  {
    id: "golf",
    label: "Fairway",
    blurb: "Mowed-stripe green with a flag on the green.",
    usesVillage: false,
    sample: { name: "Linda" },
    name: { left: 54, top: 210, width: 640, height: 170, font: "fraunces700", size: 150, min: 30, lineHeight: 1, color: "#ffffff", align: "left", shadow: "0 3px 0 rgba(0,0,0,0.18)" },
  },
  {
    id: "pickle",
    label: "Pickleball",
    blurb: "Court blue, paddle and an optic-yellow ball.",
    usesVillage: false,
    sample: { name: "Barb" },
    name: { left: 54, top: 206, width: 490, height: 160, font: "lilita", size: 138, min: 30, lineHeight: 1, color: "#ffffff", align: "left", letterSpacing: 0.01 },
  },
  {
    id: "sunset",
    label: "Sunset Palm",
    blurb: "Gold-to-plum sunset with palm silhouettes.",
    usesVillage: false,
    sample: { name: "Carol" },
    name: { left: 54, top: 186, width: 546, height: 200, font: "pacifico", size: 128, min: 30, lineHeight: 1.25, color: "#ffffff", align: "left", shadow: "0 4px 0 rgba(90,43,85,0.35)" },
  },
  {
    id: "coastal",
    label: "Coastal",
    blurb: "Sea-glass, waves, a shell and two gulls.",
    usesVillage: false,
    sample: { name: "Ron" },
    name: { left: 54, top: 180, width: 616, height: 160, font: "fraunces600", size: 146, min: 30, lineHeight: 1, color: "#1f4e66", align: "left", letterSpacing: -0.02 },
  },
  {
    id: "navy",
    label: "Classic Navy",
    blurb: "Navy with a double gold frame. The formal one.",
    usesVillage: false,
    sample: { name: "Robert" },
    name: { left: 60, top: 210, width: 780, height: 150, font: "fraunces600", size: 136, min: 30, lineHeight: 1, color: "#f0cf7a", align: "center", letterSpacing: 0.02 },
  },
  {
    id: "edenfield",
    label: "Edenfield Garden",
    blurb: "Garden hills and a golf cart. Prints \u201cThe Village of\u201d for you.",
    usesVillage: true,
    sample: { name: "Mary", village: "Fenney" },
    village: { left: 130, top: 102, width: 640, height: 100, font: "greatvibes", size: 86, min: 30, lineHeight: 100 / 86, color: "#1c3826", align: "center" },
    name: { left: 103, top: 211, width: 694, height: 160, font: "playfairsc", size: 154, min: 30, lineHeight: 160 / 154, color: "#1c3826", align: "center", upper: true },
  },
];

export function getBadgeTheme(id: string): BadgeTheme | undefined {
  return BADGE_THEMES.find((t) => t.id === id);
}

export const badgePlate = (id: BadgeThemeId) => `/shop/badges/plates-3x2/${id}.png`;

// SKUs. Custom: badge-custom-<theme>. Ready-made fixed designs: badge-ready-<first name>.
export const customBadgeSku = (id: BadgeThemeId) => `badge-custom-${id}`;
export function themeFromSku(sku: string): BadgeTheme | undefined {
  const m = /^badge-custom-([a-z]+)$/.exec(sku);
  return m ? getBadgeTheme(m[1]) : undefined;
}
export const isBadgeSku = (sku: string) => sku.startsWith("badge-");

// ---------- text rules (client + server; the server adds the profanity check) ----------

export type BadgeText = { name: string; village?: string };
export type BadgeFieldErrors = { name?: string; village?: string };

/** Unicode-normalise, straighten quotes/dashes, trim and collapse spaces. */
export function cleanBadgeText(raw: unknown): string {
  return String(raw ?? "")
    .normalize("NFC")
    .replace(/[\u2018\u2019\u02BC\u0060\u00B4]/g, "'")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/** Buyers sometimes type "Village of Fenney"; the badge already prints that part. */
export function cleanVillage(raw: unknown): string {
  return cleanBadgeText(raw).replace(/^(the\s+)?village\s+of\s+/i, "").trim();
}

// Letters (Latin incl. accents such as José, Zoë, Renée), spaces, hyphen, apostrophe, period. No digits, emoji or HTML.
const ALLOWED = /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF .'-]+$/;
const LETTER = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/;

function checkField(value: string, label: string, max: number): string | undefined {
  if (!value) return `Please type your ${label.toLowerCase()}.`;
  if (value.length > max) return `${label} can be up to ${max} characters.`;
  if (!ALLOWED.test(value)) return `${label} can use letters, spaces, hyphens (-), apostrophes (') and periods only.`;
  if (!LETTER.test(value)) return `${label} needs at least one letter.`;
  if (/[.'-]{3,}/.test(value)) return `${label} has too much punctuation in a row.`;
  return undefined;
}

/** Format checks only. Returns cleaned text plus any field errors. */
export function validateBadgeText(theme: BadgeTheme, input: { name?: unknown; village?: unknown }) {
  const name = cleanBadgeText(input.name);
  const village = theme.usesVillage ? cleanVillage(input.village) : "";
  const errors: BadgeFieldErrors = {};
  const n = checkField(name, "Name", NAME_MAX);
  if (n) errors.name = n;
  if (theme.usesVillage) {
    const v = checkField(village, "Village", VILLAGE_MAX);
    if (v) errors.village = v === "Please type your village." ? "This theme prints your village. Please type it (for example Fenney)." : v;
  }
  const text: BadgeText = theme.usesVillage ? { name, village } : { name };
  return { ok: !errors.name && !errors.village, text, errors };
}

/** Exactly what gets printed in each slot. */
export function slotText(slot: TextSlot, value: string) {
  const s = (slot.prefix ?? "") + value;
  return slot.upper ? s.toUpperCase() : s;
}

/**
 * Auto-shrink: start at the theme size and step down 2px until the line fits its box (same loop as the concepts).
 * `measure` returns the advance width in px of `text` at `size` (no letter-spacing); canvas in the browser,
 * opentype.js on the server, both reading the same font files.
 */
export function fitSize(slot: TextSlot, text: string, measure: (text: string, size: number) => number) {
  if (!text) return slot.size;
  const ls = (slot.letterSpacing ?? 0) * text.length;
  let s = slot.size;
  while (s > slot.min && measure(text, s) + ls * s > slot.width) s -= 2;
  return Math.max(slot.min, s);
}
