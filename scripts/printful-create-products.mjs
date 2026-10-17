#!/usr/bin/env node
// OPTIONAL: create the 10 shop products as sync products in a Printful "Manual order platform / API" store,
// using the catalog variant ids and the print files in public/shop/print (downloaded by Printful from the live site).
// Each sync product gets external_id = product slug and each sync variant external_id = our SKU, so
// printful-sync-map.mjs can map them exactly afterwards.
//
//   $env:PRINTFUL_API_KEY = "<private token>"     # never commit or paste it
//   $env:PRINTFUL_STORE_ID = "<store id>"         # only for an account-level token
//   node scripts/printful-create-products.mjs                 # DRY RUN: prints what would be created
//   node scripts/printful-create-products.mjs --yes           # creates them (skips slugs that already exist)
//   node scripts/printful-create-products.mjs --yes --only=hat-cart-path-only
// Options: --base=https://www.thevillageseverythingapp.com (where Printful downloads /shop/print/*.png from)
// Afterwards: check every product's placement in Printful's editor (especially the hat embroidery, mug wrap and towel),
// then run printful-sync-map.mjs --write.
import { PRODUCTS } from "../src/lib/shop/catalog.ts";

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const yes = args.yes === true;
const base = String(args.base || "https://www.thevillageseverythingapp.com").replace(/\/$/, "");
const only = args.only ? String(args.only).split(",") : null;

const token = (process.env.PRINTFUL_API_KEY || process.env.PRINTFUL_API_TOKEN || "").trim();
if (yes && !token) {
  console.error("PRINTFUL_API_KEY is not set in this shell. Set it first (do not commit it).");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

async function pf(method, pathname, body) {
  const res = await fetch(`https://api.printful.com${pathname}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Printful ${res.status} on ${method} ${pathname}: ${json?.error?.message ?? json?.result ?? "error"}`);
  return json.result;
}

let existing = new Set();
if (yes) {
  const list = await pf("GET", "/store/products?limit=100");
  existing = new Set(list.map((p) => String(p.external_id || "")));
}

for (const p of PRODUCTS) {
  if (only && !only.includes(p.slug)) continue;
  const payload = {
    sync_product: { name: p.name, external_id: p.slug, thumbnail: `${base}${p.image}` },
    sync_variants: p.variants.map((v) => ({
      external_id: v.sku,
      variant_id: v.printfulVariantId,
      retail_price: (p.priceCents / 100).toFixed(2),
      files: p.files.map((f) => ({ type: f.type, url: `${base}${f.path}` })),
      ...(p.options ? { options: p.options } : {}),
    })),
  };
  if (!yes) {
    console.log(`[dry run] ${p.slug}: ${payload.sync_variants.length} variant(s), files ${p.files.map((f) => f.type).join("+")}`);
    continue;
  }
  if (existing.has(p.slug)) {
    console.log(`skip ${p.slug} (already in the store)`);
    continue;
  }
  const created = await pf("POST", "/store/products", payload);
  console.log(`created ${p.slug}: sync product ${created?.id}`);
}
if (!yes) console.log("Dry run only. Add --yes to create the products.");
