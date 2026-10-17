// Printful SYNC variant ids, one per shop SKU (see catalog.ts for every SKU).
//
// How to fill this in once the products exist in Printful:
//   1. In Printful, create a "Manual order platform / API" store and add each product there with the print
//      files from public/shop/print/ (same placement as the mockups).
//   2. GET https://api.printful.com/store/products (with PRINTFUL_API_KEY), then GET /store/products/{id} for
//      each one. Every sync_variant has an "id" (the sync variant id) and the size/color it belongs to.
//   3. Put those ids below, keyed by our SKU. Example: "rnt-white-M": 4821234567,
//
// Until a SKU has an id here (or PRINTFUL_API_KEY is missing), a paid order is NOT sent to Printful. It is
// saved in the order store and the admin gets an email so it can be placed by hand. Nothing crashes.
//
// Tees: <code>-<color>-<size>, code = rnt | dink | hhl | ld | logo, size = S M L XL 2XL 3XL.
// Others: hat-cpo-khaki, hat-cpo-stone, hat-cpo-white, mug-cpn-11, mug-cpn-15, tote-tar-oyster,
//         towel-sftm-16x24, stk-moric-3, stk-moric-4, stk-moric-light-3, stk-moric-light-4.
export const PRINTFUL_SYNC_VARIANT_IDS: Readonly<Record<string, number>> = {
  // "rnt-white-M": 0,
};

export function syncVariantIdFor(sku: string): number | null {
  const id = PRINTFUL_SYNC_VARIANT_IDS[sku];
  return typeof id === "number" && Number.isInteger(id) && id > 0 ? id : null;
}
