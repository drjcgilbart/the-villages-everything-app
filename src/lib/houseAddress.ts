import { VILLAGE_AREA_LABELS, VILLAGE_NAMES } from "./villages";

/** Holiday Lights houses stay in The Villages, Florida. City and state are not editable. */

export const VILLAGES_CITY = "The Villages";
export const VILLAGES_STATE = "Florida";
export const BUILTIN_ZIPS = ["32159", "32162", "32163", "34762"] as const;
export const DEFAULT_ZIP = "34762";
export const OTHER_ZIP = "other";
export const OTHER_VILLAGE = "other-village";

const BUILTIN = new Set<string>(BUILTIN_ZIPS);
const VILLAGE_PATTERN = /^[A-Za-z][A-Za-z0-9 .'\u2019-]{1,39}$/;
const UNIT_PART = /^(apt|apartment|unit|suite|ste|lot|bldg|building)\b/i;
const RESERVED_VILLAGES = new Set(["the villages", "florida", "fl"]);

const BUILTIN_VILLAGE_BY_KEY = new Map(VILLAGE_NAMES.map((name) => [foldVillage(name), name]));
const AREA_KEYS = new Set(VILLAGE_AREA_LABELS.map((label) => foldVillage(label)));

export function isFiveDigitZip(value: string): boolean {
  return /^\d{5}$/.test(value);
}

export function isBuiltinZip(value: string): boolean {
  return BUILTIN.has(value);
}

/** Built-in ZIPs first, then approved extras. The current value is kept even before the extra list loads. */
export function zipChoices(extra: readonly string[], current = ""): string[] {
  const out: string[] = [...BUILTIN_ZIPS];
  const seen = new Set<string>(out);
  for (const zip of extra) {
    if (!isFiveDigitZip(zip) || seen.has(zip)) continue;
    seen.add(zip);
    out.push(zip);
  }
  if (isFiveDigitZip(current) && !seen.has(current)) out.push(current);
  return out;
}

function foldVillage(value: string): string {
  return value.trim().replace(/\s+/g, " ").replace(/\u2019/g, "'").toLowerCase();
}

/** Drops a leading "Village of" and extra spaces. Does not invent a name. */
export function cleanVillageName(value: string): string {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^village\s+of\s+/i, "")
    .replace(/[.\s]+$/g, "")
    .trim();
}

function isAreaLabel(value: string): boolean {
  return AREA_KEYS.has(foldVillage(cleanVillageName(value)));
}

/** 2–40 characters. Letters, numbers, spaces, periods, apostrophes, and hyphens. */
export function isVillageName(value: string): boolean {
  const name = cleanVillageName(value);
  if (!VILLAGE_PATTERN.test(name)) return false;
  const key = foldVillage(name);
  if (RESERVED_VILLAGES.has(key) || AREA_KEYS.has(key)) return false;
  return true;
}

export function isBuiltinVillage(value: string): boolean {
  return BUILTIN_VILLAGE_BY_KEY.has(foldVillage(cleanVillageName(value)));
}

/** Official spelling when the name is already on the built-in list. */
export function canonicalVillageName(value: string, extra: readonly string[] = []): string {
  const cleaned = cleanVillageName(value);
  const key = foldVillage(cleaned);
  const builtin = BUILTIN_VILLAGE_BY_KEY.get(key);
  if (builtin) return builtin;
  for (const name of extra) {
    const candidate = cleanVillageName(name);
    if (foldVillage(candidate) === key) return candidate;
  }
  return cleaned;
}

/** Built-in villages first, then approved extras. The current value is kept before that list loads. */
export function villageChoices(extra: readonly string[], current = ""): string[] {
  const out: string[] = [...VILLAGE_NAMES];
  const seen = new Set(out.map((name) => foldVillage(name)));
  const extras = [...extra].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  for (const name of extras) {
    const cleaned = canonicalVillageName(name);
    if (!isVillageName(cleaned)) continue;
    const key = foldVillage(cleaned);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  if (current && isVillageName(current)) {
    const cleaned = canonicalVillageName(current, extra);
    const key = foldVillage(cleaned);
    if (!seen.has(key)) out.push(cleaned);
  }
  return out;
}

function villageLookup(extra: readonly string[]): Map<string, string> {
  const map = new Map(BUILTIN_VILLAGE_BY_KEY);
  for (const name of extra) {
    const cleaned = canonicalVillageName(name);
    if (!isVillageName(cleaned)) continue;
    const key = foldVillage(cleaned);
    if (!map.has(key)) map.set(key, cleaned);
  }
  return map;
}

function villageInPart(part: string, known: Map<string, string>): string {
  const stripped = part.replace(/^village\s+of\s+/i, "").trim();
  if (!stripped || isAreaLabel(stripped)) return "";
  const hit = known.get(foldVillage(stripped));
  if (hit) return hit;
  if (/^village\s+of\s+/i.test(part) && isVillageName(stripped)) return canonicalVillageName(stripped);
  return "";
}

function isPeelableVillage(part: string): boolean {
  if (!isVillageName(part) || /^\d/.test(part) || UNIT_PART.test(part)) return false;
  return true;
}

export type SplitHouseAddress = { street: string; zip: string; village: string };

/**
 * Pulls a known village, or "Village of …", out of a one-line address.
 * Region labels such as Eastport stay out of the street and out of the village list.
 * A house number in its own comma piece is joined to the street name.
 */
export function splitHouseAddress(raw: string, extraVillages: readonly string[] = []): SplitHouseAddress {
  const original = String(raw || "");
  const hadVillagesCity = /\bthe\s+villages\b/i.test(original);
  const found = original.match(/\b\d{5}(?=-\d{4}\b|\b)/g);
  const zip = found?.length ? found[found.length - 1] : "";
  let text = original;
  text = text.replace(/\b\d{5}(?:-\d{4})?\b/g, " ");
  text = text.replace(/\b(united states of america|united states|u\.s\.a\.|usa)\b/gi, " ");
  text = text.replace(/\b(sumter|marion|lake)\s+county\b/gi, " ");
  text = text.replace(/\bthe\s+villages\b/gi, " ");
  text = text.replace(/\bflorida\b/gi, " ");
  text = text.replace(/\bfl\b/gi, " ");
  const known = villageLookup(extraVillages);
  const parts = text
    .split(",")
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((part) => !isAreaLabel(part));

  let village = "";
  const streetParts: string[] = [];
  for (const part of parts) {
    const named = villageInPart(part, known);
    if (named && !village) {
      village = named;
      continue;
    }
    if (isAreaLabel(part.replace(/^village\s+of\s+/i, ""))) continue;
    streetParts.push(part);
  }
  if (streetParts.length >= 2 && /^\d+[A-Za-z]?$/.test(streetParts[0])) {
    streetParts.splice(0, 2, `${streetParts[0]} ${streetParts[1]}`);
  }
  if (!village && hadVillagesCity && streetParts.length >= 2) {
    const last = streetParts[streetParts.length - 1];
    if (isPeelableVillage(last)) {
      village = canonicalVillageName(last, extraVillages);
      streetParts.pop();
    }
  }
  const street = streetParts.join(", ").replace(/^[,.\s]+|[,.\s]+$/g, "");
  return { street: street.slice(0, 140), zip, village };
}

export function zipFromAddress(address: string): string {
  return splitHouseAddress(address).zip;
}

export function villageFromAddress(address: string): string {
  return splitHouseAddress(address).village;
}

/** Street room shrinks so the ZIP is not clipped off the 180-character address. */
export function composeHouseAddress(street: string, zip: string, village = ""): string {
  const line = street.trim().replace(/\s+/g, " ");
  if (!line) return "";
  const place = isVillageName(village) ? canonicalVillageName(village) : "";
  if (!isFiveDigitZip(zip)) return line.slice(0, 180);
  const tail = place
    ? `, ${place}, ${VILLAGES_CITY}, ${VILLAGES_STATE} ${zip}`
    : `, ${VILLAGES_CITY}, ${VILLAGES_STATE} ${zip}`;
  const room = Math.max(0, 180 - tail.length);
  return `${line.slice(0, room).replace(/[,\s]+$/g, "")}${tail}`;
}

export type ParsedHouseAddress = {
  address: string;
  /** Set only when the form sent a ZIP, or the typed line already had one. */
  zip: string;
  explicitZip: boolean;
  /** Set when a village was chosen, or an older line already named one. */
  village: string;
  /** True only when the form sent the village. A map drag must not approve one. */
  explicitVillage: boolean;
};

/**
 * City and state are forced. A street needs a 5-digit ZIP and a village name.
 * An older one-line address with no ZIP is kept so a map-filled line still saves.
 */
export function houseAddressFromInput(input: {
  street?: unknown;
  zip?: unknown;
  village?: unknown;
  address?: unknown;
}): ParsedHouseAddress {
  const street = String(input.street || "").trim();
  const zipField = String(input.zip || "").trim();
  const villageField = String(input.village || "").trim();
  if (street || zipField || villageField) {
    if (!street) throw new Error("Type the street address.");
    if (!isFiveDigitZip(zipField)) throw new Error("Use a 5-digit ZIP code.");
    if (!villageField) throw new Error("Choose a village, or add one.");
    if (!isVillageName(villageField)) throw new Error("Type the village name.");
    const village = canonicalVillageName(villageField);
    return {
      address: composeHouseAddress(street, zipField, village),
      zip: zipField,
      explicitZip: true,
      village,
      explicitVillage: true,
    };
  }
  const address = String(input.address || "").trim();
  if (!address) return { address: "", zip: "", explicitZip: false, village: "", explicitVillage: false };
  const parts = splitHouseAddress(address);
  if (!parts.zip) {
    return { address: address.slice(0, 180), zip: "", explicitZip: false, village: parts.village, explicitVillage: false };
  }
  if (!parts.street) throw new Error("Type the street address.");
  return {
    address: composeHouseAddress(parts.street, parts.zip, parts.village),
    zip: parts.zip,
    explicitZip: false,
    village: parts.village,
    explicitVillage: false,
  };
}
