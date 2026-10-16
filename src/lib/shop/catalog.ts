// Single source of truth for Villages Everything App merch: products, prices and Printful mapping.
// Mirrors the All In On Musk shop. Prices are in cents and the server ONLY trusts prices from this file.
// Printful variant ids come from the public catalog API (GET https://api.printful.com/products/{id}),
// checked 2026-10-16. Re-verify before launch: Printful occasionally retires variants.

export type Variant = {
  sku: string; // our id, sent by the client
  label: string; // e.g. "Sand / M" or "One size"
  color?: string; // matches ColorOption.id
  size?: string;
  printfulVariantId: number;
};

export type ColorOption = { id: string; label: string; hex: string; image: string };
export type PrintFile = { type: string; path: string }; // path under /public

export type ProductType = "tees" | "hats" | "mugs" | "totes" | "golf-towels" | "stickers";

export const PRODUCT_TYPES: { id: ProductType; label: string }[] = [
  { id: "tees", label: "Tees" },
  { id: "hats", label: "Hats" },
  { id: "mugs", label: "Mugs" },
  { id: "totes", label: "Totes" },
  { id: "golf-towels", label: "Golf towels" },
  { id: "stickers", label: "Stickers" },
];

export type Product = {
  slug: string;
  type: ProductType;
  name: string;
  tagline: string;
  description: string;
  priceCents: number;
  image: string; // default mockup
  colors?: ColorOption[];
  printfulProduct: string; // human note
  variants: Variant[];
  files: PrintFile[];
  taxCode: string; // Stripe product tax code
  // Printful item options. Embroidery REQUIRES thread colours.
  // Allowed: #FFFFFF #000000 #96A1A8 #A67843 #FFCC00 #E25C27 #CC3366 #CC3333 #660000 #333366 #005397 #3399FF #6B5294 #01784E #7BA35A
  options?: { id: string; value: string | string[] }[];
};

export const CURRENCY = "usd";
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;

// Gildan 64000 Softstyle tee (Printful catalog product 12) variant ids by colour, in SIZES order.
const TEE_IDS: Record<string, { label: string; hex: string; ids: number[] }> = {
  white: { label: "White", hex: "#f7f7f5", ids: [473, 504, 535, 566, 597, 628] },
  "light-blue": { label: "Light Blue", hex: "#b9d6ec", ids: [494, 525, 556, 587, 618, 649] },
  sand: { label: "Sand", hex: "#dccaa6", ids: [501, 532, 563, 594, 625, 656] },
  natural: { label: "Natural", hex: "#efe6d2", ids: [20415, 20409, 20412, 20406, 20403, 20400] },
};

function tee(slug: string, code: string, colors: string[]): Pick<Product, "colors" | "variants" | "image"> {
  return {
    image: `/shop/mock/${slug}--${colors[0]}.png`,
    colors: colors.map((c) => ({ id: c, label: TEE_IDS[c].label, hex: TEE_IDS[c].hex, image: `/shop/mock/${slug}--${c}.png` })),
    variants: colors.flatMap((c) =>
      SIZES.map((s, i) => ({ sku: `${code}-${c}-${s}`, label: `${TEE_IDS[c].label} / ${s}`, color: c, size: s, printfulVariantId: TEE_IDS[c].ids[i] }))
    ),
  };
}

const TEE_NOTE = "Gildan 64000 Unisex Softstyle T-Shirt (catalog product 12), DTG front";
const CLOTHING = "txcd_30011000";
const GENERAL = "txcd_99999999";

export const PRODUCTS: Product[] = [
  {
    slug: "tee-retired-not-tired",
    type: "tees",
    name: "Retired, Not Tired",
    tagline: "(nap scheduled for 2:00)",
    description:
      "Sunshine, palm trees and a golf cart with somewhere to be. For the neighbor who pickleballs at 8, lunches at noon and protects the 2:00 nap like a tee time.",
    priceCents: 2800,
    ...tee("tee-retired-not-tired", "rnt", ["white", "light-blue", "sand"]),
    printfulProduct: TEE_NOTE,
    files: [{ type: "default", path: "/shop/print/tee-retired-not-tired.png" }],
    taxCode: CLOTHING,
  },
  {
    slug: "tee-dink-responsibly",
    type: "tees",
    name: "Dink Responsibly",
    tagline: "Kitchen rules apply",
    description:
      "Crossed paddles and a fresh pickleball. Stay out of the kitchen, hydrate, and high-five the other side even when they lob you.",
    priceCents: 2800,
    ...tee("tee-dink-responsibly", "dink", ["white", "light-blue"]),
    printfulProduct: TEE_NOTE,
    files: [{ type: "default", path: "/shop/print/tee-dink-responsibly.png" }],
    taxCode: CLOTHING,
  },
  {
    slug: "tee-happy-hour-lifestyle",
    type: "tees",
    name: "Happy Hour Is a Lifestyle",
    tagline: "Meet me on the square",
    description:
      "A cocktail umbrella, a setting sun and a little music in the air. Band at 4, dancing till 7, home before the streetlights get any ideas.",
    priceCents: 2800,
    ...tee("tee-happy-hour-lifestyle", "hhl", ["sand", "white"]),
    printfulProduct: TEE_NOTE,
    files: [{ type: "default", path: "/shop/print/tee-happy-hour-lifestyle.png" }],
    taxCode: CLOTHING,
  },
  {
    slug: "tee-line-dance-snacks",
    type: "tees",
    name: "Will Line Dance for Snacks",
    tagline: "Grapevine left, buffet right",
    description:
      "Boots on, stars out. For the line-dance regular who knows every step and exactly where the snack table is.",
    priceCents: 2800,
    ...tee("tee-line-dance-snacks", "ld", ["light-blue", "white"]),
    printfulProduct: TEE_NOTE,
    files: [{ type: "default", path: "/shop/print/tee-line-dance-snacks.png" }],
    taxCode: CLOTHING,
  },
  {
    slug: "tee-everything-app-logo",
    type: "tees",
    name: "Everything App Logo Tee",
    tagline: "Golf carts & everything",
    description:
      "The app's sunset golf-cart badge, flamingo and all, on a soft tee. Neighbor-built, sunshine included.",
    priceCents: 3000,
    ...tee("tee-everything-app-logo", "logo", ["white", "natural"]),
    printfulProduct: TEE_NOTE,
    files: [{ type: "default", path: "/shop/print/tee-everything-app-logo.png" }],
    taxCode: CLOTHING,
  },
  {
    slug: "hat-cart-path-only",
    type: "hats",
    name: "Cart Path Only",
    tagline: "Embroidered dad hat",
    description:
      "The one rule everybody knows, stitched on a relaxed cotton dad hat with a tiny golf ball, plus a small Everything App mark on the side. Shade for your eyes, a reminder for your cart.",
    priceCents: 3000,
    image: "/shop/mock/hat-cart-path-only--khaki.png",
    colors: [
      { id: "khaki", label: "Khaki", hex: "#c8b07e", image: "/shop/mock/hat-cart-path-only--khaki.png" },
      { id: "stone", label: "Stone", hex: "#d9d2c2", image: "/shop/mock/hat-cart-path-only--stone.png" },
      { id: "white", label: "White", hex: "#f6f6f4", image: "/shop/mock/hat-cart-path-only--white.png" },
    ],
    printfulProduct: "Yupoong 6245CM Classic Dad Hat (catalog product 206), embroidery front",
    variants: [
      { sku: "hat-cpo-khaki", label: "Khaki / One size", color: "khaki", size: "One size", printfulVariantId: 7855 },
      { sku: "hat-cpo-stone", label: "Stone / One size", color: "stone", size: "One size", printfulVariantId: 7859 },
      { sku: "hat-cpo-white", label: "White / One size", color: "white", size: "One size", printfulVariantId: 7853 },
    ],
    files: [
      { type: "embroidery_front", path: "/shop/print/hat-cart-path-only.png" },
      // Small "Everything App" brand mark on the left side panel, one thread.
      { type: "embroidery_left", path: "/shop/print/hat-cart-path-only-left.png" },
    ],
    options: [
      { id: "thread_colors", value: ["#01784E", "#E25C27", "#FFFFFF"] },
      { id: "thread_colors_left", value: ["#01784E"] },
    ],
    taxCode: CLOTHING,
  },
  {
    slug: "mug-coffee-pickleball-nap",
    type: "mugs",
    name: "Coffee. Pickleball. Nap. Repeat.",
    tagline: "The whole schedule",
    description:
      "A glossy white ceramic mug printed on both sides with the daily plan. Dishwasher and microwave safe, which is more than we can say for the 7 a.m. game.",
    priceCents: 1800,
    image: "/shop/mock/mug-coffee-pickleball-nap--white.png",
    printfulProduct: "White Glossy Mug (catalog product 19)",
    variants: [
      { sku: "mug-cpn-11", label: "11 oz", size: "11 oz", printfulVariantId: 1320 },
      { sku: "mug-cpn-15", label: "15 oz", size: "15 oz", printfulVariantId: 4830 },
    ],
    // Art is laid out for the 11 oz wrap (2700x1050). TODO: check placement for 15 oz in Printful's mockup generator.
    files: [{ type: "default", path: "/shop/print/mug-coffee-pickleball-nap.png" }],
    taxCode: GENERAL,
  },
  {
    slug: "tote-tote-ally-retired",
    type: "totes",
    name: "Tote-ally Retired",
    tagline: "Farmers market ready",
    description:
      "A sturdy cotton tote for the market haul, the library run and the snacks you swear are for the grandkids. Golf cart and palms included.",
    priceCents: 2400,
    image: "/shop/mock/tote-tote-ally-retired--oyster.png",
    printfulProduct: "Eco Tote Bag, Econscious EC8000, Oyster (catalog product 367)",
    variants: [{ sku: "tote-tar-oyster", label: "Oyster / One size", size: "One size", printfulVariantId: 10458 }],
    files: [{ type: "default", path: "/shop/print/tote-tote-ally-retired.png" }],
    taxCode: GENERAL,
  },
  {
    slug: "towel-shanks-for-the-memories",
    type: "golf-towels",
    name: "Shanks for the Memories",
    tagline: "Fore! (sorry)",
    description:
      "A 16 x 24 in golf towel starring the app's golf-ball mascot. Wipe the club, wipe the brow, and wave apologetically to the next fairway.",
    priceCents: 2600,
    image: "/shop/mock/towel-shanks-for-the-memories--white.png",
    printfulProduct: "Golf Towel 16x24 in, sublimation (catalog product 1423)",
    variants: [{ sku: "towel-sftm-16x24", label: "16 x 24 in", size: "16 x 24 in", printfulVariantId: 44137 }],
    files: [{ type: "default", path: "/shop/print/towel-shanks-for-the-memories.png" }],
    taxCode: GENERAL,
  },
  {
    slug: "sticker-my-other-ride",
    type: "stickers",
    name: "My Other Ride Is a Golf Cart",
    tagline: "Kiss-cut sticker",
    description:
      "The app's sunset golf-cart badge ringed with the truth. For the cooler, the water bottle, or the back of the actual golf cart.",
    priceCents: 500,
    image: "/shop/mock/sticker-my-other-ride--white.png",
    printfulProduct: "Kiss-Cut Stickers (catalog product 358)",
    variants: [
      { sku: "stk-moric-3", label: "3 x 3 in", size: "3 x 3 in", printfulVariantId: 10163 },
      { sku: "stk-moric-4", label: "4 x 4 in", size: "4 x 4 in", printfulVariantId: 10164 },
    ],
    files: [{ type: "default", path: "/shop/print/sticker-my-other-ride.png" }],
    taxCode: GENERAL,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function findVariant(sku: string): { product: Product; variant: Variant } | undefined {
  for (const product of PRODUCTS) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return undefined;
}

/** Mockup for a cart line: the colour-specific image when there is one. */
export function variantImage(product: Product, variant: Variant) {
  return product.colors?.find((c) => c.id === variant.color)?.image ?? product.image;
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
