/** Holiday Lights houses stay in The Villages, Florida. City and state are not editable. */

export const VILLAGES_CITY = "The Villages";
export const VILLAGES_STATE = "Florida";
export const BUILTIN_ZIPS = ["32159", "32162", "32163", "34762"] as const;
export const DEFAULT_ZIP = "34762";
export const OTHER_ZIP = "other";

const BUILTIN = new Set<string>(BUILTIN_ZIPS);

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

export function splitHouseAddress(raw: string): { street: string; zip: string } {
  let text = String(raw || "");
  const found = text.match(/\b\d{5}(?=-\d{4}\b|\b)/g);
  const zip = found?.length ? found[found.length - 1] : "";
  text = text.replace(/\b\d{5}(?:-\d{4})?\b/g, " ");
  text = text.replace(/\b(united states of america|united states|u\.s\.a\.|usa)\b/gi, " ");
  text = text.replace(/\b(sumter|marion|lake)\s+county\b/gi, " ");
  text = text.replace(/\bthe\s+villages\b/gi, " ");
  text = text.replace(/\bflorida\b/gi, " ");
  text = text.replace(/\bfl\b/gi, " ");
  const street = text
    .split(",")
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(", ")
    .replace(/^[,.\s]+|[,.\s]+$/g, "");
  return { street: street.slice(0, 140), zip };
}

export function zipFromAddress(address: string): string {
  return splitHouseAddress(address).zip;
}

export function composeHouseAddress(street: string, zip: string): string {
  const line = street.trim().replace(/\s+/g, " ");
  if (!line) return "";
  if (!isFiveDigitZip(zip)) return line.slice(0, 180);
  return `${line}, ${VILLAGES_CITY}, ${VILLAGES_STATE} ${zip}`.slice(0, 180);
}

export type ParsedHouseAddress = {
  address: string;
  /** Set only when the form sent a ZIP, or the typed line already had one. */
  zip: string;
  explicitZip: boolean;
};

/**
 * City and state are forced. A form ZIP must be 5 digits.
 * An older one-line address with no ZIP is kept so a map-filled line still saves.
 */
export function houseAddressFromInput(input: {
  street?: unknown;
  zip?: unknown;
  address?: unknown;
}): ParsedHouseAddress {
  const street = String(input.street || "").trim();
  const zipField = String(input.zip || "").trim();
  if (street || zipField) {
    if (!isFiveDigitZip(zipField)) throw new Error("Use a 5-digit ZIP code.");
    if (!street) throw new Error("Type the street address.");
    return {
      address: composeHouseAddress(street, zipField),
      zip: zipField,
      explicitZip: true,
    };
  }
  const address = String(input.address || "").trim();
  if (!address) return { address: "", zip: "", explicitZip: false };
  const parts = splitHouseAddress(address);
  if (!parts.zip) return { address: address.slice(0, 180), zip: "", explicitZip: false };
  if (!parts.street) throw new Error("Type the street address.");
  return {
    address: composeHouseAddress(parts.street, parts.zip),
    zip: parts.zip,
    explicitZip: false,
  };
}
