#!/usr/bin/env node
// List the Printful store's sync products/variants and map them to our shop SKUs.
//
//   $env:PRINTFUL_API_KEY = "<private token>"            # never commit or paste it
//   $env:PRINTFUL_STORE_ID = "<store id>"                # only needed for an account-level token
//   node scripts/printful-sync-map.mjs                   # dry run: prints the mapping, writes scripts/printful-sync-map.json
//   node scripts/printful-sync-map.mjs --write           # also rewrites PRINTFUL_SYNC_VARIANT_IDS in src/lib/shop/printful-variants.ts
//
// Matching, per sync variant: 1) its external_id equals our SKU (products made by printful-create-products.mjs do this);
// 2) otherwise the sync product name/external_id matches one of our products and the catalog variant_id matches a SKU's
//    printfulVariantId. Anything that does not match is listed so it can be fixed by hand.
// Needs Node 22.6+ (this PC has Node 24) because it imports the TypeScript catalog directly.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS } from "../src/lib/shop/catalog.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VARIANTS_FILE = path.join(ROOT, "src", "lib", "shop", "printful-variants.ts");
const OUT_JSON = path.join(ROOT, "scripts", "printful-sync-map.json");
const write = process.argv.includes("--write");

const token = (process.env.PRINTFUL_API_KEY || process.env.PRINTFUL_API_TOKEN || "").trim();
if (!token) {
  console.error("PRINTFUL_API_KEY is not set in this shell. Set it first (do not commit it).");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${token}` };
if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

async function pf(pathname) {
  const res = await fetch(`https://api.printful.com${pathname}`, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Printful ${res.status} on ${pathname}: ${body?.error?.message ?? body?.result ?? "error"}`);
  return body;
}

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const skuSet = new Map(PRODUCTS.flatMap((p) => p.variants.map((v) => [v.sku, { p, v }])));
function productFor(syncProduct) {
  const ext = String(syncProduct.external_id || "");
  return (
    PRODUCTS.find((p) => p.slug === ext) ||
    PRODUCTS.find((p) => norm(syncProduct.name).includes(norm(p.name))) ||
    null
  );
}

const list = [];
for (let offset = 0; ; offset += 100) {
  const page = await pf(`/store/products?limit=100&offset=${offset}`);
  list.push(...(page.result || []));
  if (!page.paging || offset + 100 >= page.paging.total) break;
}
console.log(`Store has ${list.length} sync product(s).`);

const mapping = {};
const unmatched = [];
for (const sp of list) {
  const detail = (await pf(`/store/products/${sp.id}`)).result;
  const product = productFor(detail.sync_product);
  for (const sv of detail.sync_variants || []) {
    let sku = skuSet.has(sv.external_id) ? sv.external_id : null;
    if (!sku && product) sku = product.variants.find((v) => v.printfulVariantId === sv.variant_id)?.sku ?? null;
    if (sku) {
      if (mapping[sku] && mapping[sku] !== sv.id) unmatched.push(`${sku}: duplicate (sync variants ${mapping[sku]} and ${sv.id})`);
      mapping[sku] = sv.id;
    } else {
      unmatched.push(`${detail.sync_product.name} / ${sv.name} (sync ${sv.id}, catalog ${sv.variant_id}, external_id ${sv.external_id || "-"})`);
    }
  }
}

const allSkus = [...skuSet.keys()];
const missing = allSkus.filter((s) => !mapping[s]);
fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedAt: new Date().toISOString(), mapping, missing, unmatched }, null, 2) + "\n");
console.log(`Mapped ${Object.keys(mapping).length} of ${allSkus.length} SKUs. Wrote ${path.relative(ROOT, OUT_JSON)}.`);
if (missing.length) console.log(`Missing (${missing.length}): ${missing.join(", ")}`);
if (unmatched.length) console.log(`Not matched to a SKU:\n  ${unmatched.join("\n  ")}`);

if (write) {
  const src = fs.readFileSync(VARIANTS_FILE, "utf8");
  const body = allSkus.filter((s) => mapping[s]).map((s) => `  "${s}": ${mapping[s]},`).join("\n");
  const re = /export const PRINTFUL_SYNC_VARIANT_IDS: Readonly<Record<string, number>> = \{[\s\S]*?\n\};/;
  if (!re.test(src)) throw new Error("Could not find PRINTFUL_SYNC_VARIANT_IDS in printful-variants.ts");
  const next = src.replace(re, `export const PRINTFUL_SYNC_VARIANT_IDS: Readonly<Record<string, number>> = {\n${body}\n};`);
  fs.writeFileSync(VARIANTS_FILE, next);
  console.log(`Updated ${path.relative(ROOT, VARIANTS_FILE)}. Review the diff, then build and commit.`);
}
