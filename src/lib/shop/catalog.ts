// Single source of truth for Villages Everything App merch: products, prices and Printful mapping.
// Mirrors the All In On Musk shop. Prices are in cents and the server ONLY trusts prices from this file.
// Printful variant ids come from the public catalog API (GET https://api.printful.com/products/{id}),
// checked 2026-10-16. Re-verify before launch: Printful occasionally retires variants.

import { BADGE_FROM_CENTS, BADGE_SIZE, BADGE_THEMES, customBadgeSku } from "./badges";

export type Variant = {
  sku: string; // our id, sent by the client
  label: string; // e.g. "Sand / M" or "One size"
  color?: string; // matches ColorOption.id
  size?: string;
  printfulVariantId: number;
};

export type ColorOption = { id: string; label: string; hex: string; image: string; backImage?: string };
export type PrintFile = { type: string; path: string }; // path under /public

export type ProductType = "tees" | "hats" | "mugs" | "totes" | "golf-towels" | "stickers" | "pins" | "badges";

export const PRODUCT_TYPES: { id: ProductType; label: string }[] = [
  { id: "tees", label: "Tees" },
  { id: "hats", label: "Hats" },
  { id: "mugs", label: "Mugs" },
  { id: "totes", label: "Totes" },
  { id: "golf-towels", label: "Golf towels" },
  { id: "stickers", label: "Stickers" },
  { id: "pins", label: "Pins" },
  { id: "badges", label: "Name badges" },
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
  /** "manual": made by hand from our own print file (name badges), never sent to Printful. Default printful. */
  fulfillment?: "printful" | "manual";
  /** Shown on the card and product page, e.g. "Pre-order: ships in about 3 weeks". */
  preorder?: string;
  /** false: orderable, but not shown in the /shop grid (ready-made badges live on the badge page). */
  listed?: boolean;
  /** true: unlisted everywhere and not orderable (checkout rejects it, carts drop it). Art, print files and config stay. */
  hidden?: boolean;
  /** Name badges: custom (buyer's text) or a fixed ready-made design with its own print file. */
  /** file: the 3" x 2" trim art (shown on the page); bleedFile: the same art with 1/8" bleed (976 x 676) for the printer. */
  badge?: { kind: "custom" } | { kind: "ready"; size: "3x2in"; file: string; bleedFile: string; alt: string };
  /** Price text for cards/pages when it is not just priceCents (name badges: price depends on the material). */
  priceNote?: string;
};

export const CURRENCY = "usd";

// Enamel pins: made in bulk, mailed by hand. $12 each, pre-order (confirmed 2026-10-20).
export const PIN_PRICE_CENTS = 1200;
export const PIN_PREORDER = "Pre-order: ships in about 3 weeks";

/** Ready-made name badges (Jonathan / Lucy, Edenfield). false: hidden from every page and rejected at checkout.
 *  Set back to true to bring the #ready-made section on /shop/custom-name-badge back; nothing else needs changing. */
export const READY_MADE_ENABLED = false;
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;

// Gildan 64000 Softstyle tee (Printful catalog product 12) variant ids by colour, in SIZES order.
const TEE_IDS: Record<string, { label: string; hex: string; ids: number[] }> = {
  white: { label: "White", hex: "#f7f7f5", ids: [473, 504, 535, 566, 597, 628] },
  "light-blue": { label: "Light Blue", hex: "#b9d6ec", ids: [494, 525, 556, 587, 618, 649] },
  sand: { label: "Sand", hex: "#dccaa6", ids: [501, 532, 563, 594, 625, 656] },
  natural: { label: "Natural", hex: "#efe6d2", ids: [20415, 20409, 20412, 20406, 20403, 20400] },
};

// art = mockup file prefix; defaults to the slug (a redrawn design gets a new file name, the old files stay).
function tee(slug: string, code: string, colors: string[], art = slug): Pick<Product, "colors" | "variants" | "image"> {
  return {
    image: `/shop/mock/${art}--${colors[0]}.png`,
    colors: colors.map((c) => ({ id: c, label: TEE_IDS[c].label, hex: TEE_IDS[c].hex, image: `/shop/mock/${art}--${c}.png` })),
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
    ...tee("tee-retired-not-tired", "rnt", ["white", "light-blue", "sand"], "tee-retired-not-tired-v3"),
    printfulProduct: TEE_NOTE,
    // v3 (2026-10-17): sun made smaller and lower so it no longer touches "RETIRED".
    files: [{ type: "default", path: "/shop/print/tee-retired-not-tired-v3.png" }],
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
    ...tee("tee-happy-hour-lifestyle", "hhl", ["sand", "white"], "tee-happy-hour-lifestyle-v3"),
    printfulProduct: TEE_NOTE,
    // v3 (2026-10-17): sun + cocktail smaller, text lines spaced so nothing overlaps.
    files: [{ type: "default", path: "/shop/print/tee-happy-hour-lifestyle-v3.png" }],
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
    ...tee("tee-everything-app-logo", "logo", ["white", "natural"], "tee-everything-app-logo-v2"),
    printfulProduct: TEE_NOTE,
    // v2 (2026-10-20): thin coral ring (#f66d54) around the logo circle.
    files: [{ type: "default", path: "/shop/print/tee-everything-app-logo-v2.png" }],
    taxCode: CLOTHING,
  },
  {
    slug: "hat-cart-path-only",
    type: "hats",
    name: "Cart Path Only",
    tagline: "Embroidered dad hat",
    description:
      "The one rule everybody knows, stitched on a relaxed cotton dad hat next to our golf-ball mascot badge, plus The Villages Everything App wordmark on the back above the strap. Shade for your eyes, a reminder for your cart.",
    priceCents: 3000,
    image: "/shop/mock/hat-cart-path-only--khaki.png",
    colors: [
      { id: "khaki", label: "Khaki", hex: "#c8b07e", image: "/shop/mock/hat-cart-path-only--khaki.png", backImage: "/shop/mock/hat-cart-path-only-back--khaki.png" },
      { id: "stone", label: "Stone", hex: "#d9d2c2", image: "/shop/mock/hat-cart-path-only--stone.png", backImage: "/shop/mock/hat-cart-path-only-back--stone.png" },
      { id: "white", label: "White", hex: "#f6f6f4", image: "/shop/mock/hat-cart-path-only--white.png", backImage: "/shop/mock/hat-cart-path-only-back--white.png" },
    ],
    printfulProduct: "Yupoong 6245CM Classic Dad Hat (catalog product 206), embroidery front",
    variants: [
      { sku: "hat-cpo-khaki", label: "Khaki / One size", color: "khaki", size: "One size", printfulVariantId: 7855 },
      { sku: "hat-cpo-stone", label: "Stone / One size", color: "stone", size: "One size", printfulVariantId: 7859 },
      { sku: "hat-cpo-white", label: "White / One size", color: "white", size: "One size", printfulVariantId: 7853 },
    ],
    files: [
      { type: "embroidery_front", path: "/shop/print/hat-cart-path-only.png" },
      // Back, above the strap: homepage wordmark only, centered (Fraunces 700; "everything" italic). Front carries the mascot badge.
      { type: "embroidery_back", path: "/shop/print/hat-cart-path-only-back.png" },
    ],
    options: [
      { id: "thread_colors", value: ["#01784E", "#E25C27", "#FFFFFF", "#7BA35A", "#FFCC00", "#000000"] },
      { id: "thread_colors_back", value: ["#000000", "#E25C27"] },
    ],
    taxCode: CLOTHING,
  },
  {
    slug: "hat-pickleball-is-my-cardio",
    type: "hats",
    name: "Pickleball Is My Cardio",
    tagline: "Embroidered dad hat",
    description:
      "The only workout plan that comes with a dink shot, stitched on a relaxed cotton dad hat with a little paddle and ball, plus a small The Villages Everything App mark on the back above the strap.",
    priceCents: 3000,
    image: "/shop/mock/hat-pickleball-is-my-cardio--khaki.png",
    colors: [
      { id: "khaki", label: "Khaki", hex: "#c8b07e", image: "/shop/mock/hat-pickleball-is-my-cardio--khaki.png", backImage: "/shop/mock/hat-pickleball-is-my-cardio-back--khaki.png" },
      { id: "stone", label: "Stone", hex: "#d9d2c2", image: "/shop/mock/hat-pickleball-is-my-cardio--stone.png", backImage: "/shop/mock/hat-pickleball-is-my-cardio-back--stone.png" },
      { id: "white", label: "White", hex: "#f6f6f4", image: "/shop/mock/hat-pickleball-is-my-cardio--white.png", backImage: "/shop/mock/hat-pickleball-is-my-cardio-back--white.png" },
    ],
    printfulProduct: "Yupoong 6245CM Classic Dad Hat (catalog product 206), embroidery front",
    variants: [
      { sku: "hat-pimc-khaki", label: "Khaki / One size", color: "khaki", size: "One size", printfulVariantId: 7855 },
      { sku: "hat-pimc-stone", label: "Stone / One size", color: "stone", size: "One size", printfulVariantId: 7859 },
      { sku: "hat-pimc-white", label: "White / One size", color: "white", size: "One size", printfulVariantId: 7853 },
    ],
    files: [
      { type: "embroidery_front", path: "/shop/print/hat-pickleball-is-my-cardio.png" },
      { type: "embroidery_back", path: "/shop/print/hat-pickleball-is-my-cardio-back.png" },
    ],
    options: [
      { id: "thread_colors", value: ["#01784E", "#E25C27", "#FFFFFF"] },
      { id: "thread_colors_back", value: ["#01784E"] },
    ],
    taxCode: CLOTHING,
  },
  {
    slug: "hat-happy-hour-starts-at-4",
    type: "hats",
    name: "Happy Hour Starts at 4",
    tagline: "Embroidered dad hat",
    description:
      "Clock in, clock out, clock says 4. Stitched on a relaxed cotton dad hat with a little clock set to the most important time of day, plus a small The Villages Everything App mark on the back above the strap.",
    priceCents: 3000,
    image: "/shop/mock/hat-happy-hour-starts-at-4--khaki.png",
    colors: [
      { id: "khaki", label: "Khaki", hex: "#c8b07e", image: "/shop/mock/hat-happy-hour-starts-at-4--khaki.png", backImage: "/shop/mock/hat-happy-hour-starts-at-4-back--khaki.png" },
      { id: "stone", label: "Stone", hex: "#d9d2c2", image: "/shop/mock/hat-happy-hour-starts-at-4--stone.png", backImage: "/shop/mock/hat-happy-hour-starts-at-4-back--stone.png" },
      { id: "white", label: "White", hex: "#f6f6f4", image: "/shop/mock/hat-happy-hour-starts-at-4--white.png", backImage: "/shop/mock/hat-happy-hour-starts-at-4-back--white.png" },
    ],
    printfulProduct: "Yupoong 6245CM Classic Dad Hat (catalog product 206), embroidery front",
    variants: [
      { sku: "hat-hh4-khaki", label: "Khaki / One size", color: "khaki", size: "One size", printfulVariantId: 7855 },
      { sku: "hat-hh4-stone", label: "Stone / One size", color: "stone", size: "One size", printfulVariantId: 7859 },
      { sku: "hat-hh4-white", label: "White / One size", color: "white", size: "One size", printfulVariantId: 7853 },
    ],
    files: [
      { type: "embroidery_front", path: "/shop/print/hat-happy-hour-starts-at-4.png" },
      { type: "embroidery_back", path: "/shop/print/hat-happy-hour-starts-at-4-back.png" },
    ],
    options: [
      { id: "thread_colors", value: ["#01784E", "#E25C27", "#FFFFFF"] },
      { id: "thread_colors_back", value: ["#01784E"] },
    ],
    taxCode: CLOTHING,
  },
  {
    slug: "hat-golden-hour-patch",
    type: "hats",
    name: "Golden Hour Patch",
    tagline: "Embroidered dad hat",
    description:
      "The app's sunset golf-cart badge, flamingo and all, stitched as a round patch with a gold ring on a relaxed cotton dad hat. On the back: a little striped sunset and palm above The Villages Everything App wordmark.",
    priceCents: 3000,
    image: "/shop/mock/hat-golden-hour-patch--khaki.png",
    colors: [
      { id: "khaki", label: "Khaki", hex: "#c8b07e", image: "/shop/mock/hat-golden-hour-patch--khaki.png", backImage: "/shop/mock/hat-golden-hour-patch-back--khaki.png" },
      { id: "stone", label: "Stone", hex: "#d9d2c2", image: "/shop/mock/hat-golden-hour-patch--stone.png", backImage: "/shop/mock/hat-golden-hour-patch-back--stone.png" },
      { id: "white", label: "White", hex: "#f6f6f4", image: "/shop/mock/hat-golden-hour-patch--white.png", backImage: "/shop/mock/hat-golden-hour-patch-back--white.png" },
    ],
    printfulProduct: "Yupoong 6245CM Classic Dad Hat (catalog product 206), embroidery front",
    variants: [
      { sku: "hat-ghp-khaki", label: "Khaki / One size", color: "khaki", size: "One size", printfulVariantId: 7855 },
      { sku: "hat-ghp-stone", label: "Stone / One size", color: "stone", size: "One size", printfulVariantId: 7859 },
      { sku: "hat-ghp-white", label: "White / One size", color: "white", size: "One size", printfulVariantId: 7853 },
    ],
    files: [
      { type: "embroidery_front", path: "/shop/print/hat-golden-hour-patch.png" },
      { type: "embroidery_back", path: "/shop/print/hat-golden-hour-patch-back.png" },
    ],
    options: [
      { id: "thread_colors", value: ["#01784E", "#E25C27", "#FFFFFF", "#7BA35A", "#FFCC00", "#000000"] },
      { id: "thread_colors_back", value: ["#000000", "#E25C27", "#01784E", "#FFCC00"] },
    ],
    taxCode: CLOTHING,
  },
  {
    slug: "hat-town-square-cruiser",
    type: "hats",
    name: "Town Square Cruiser",
    tagline: "Embroidered dad hat",
    description:
      "The app's sunset golf-cart badge stitched as a round patch with a palm-green ring on a relaxed cotton dad hat. On the back: a golden sun, a palm and a blue waterline above The Villages Everything App wordmark.",
    priceCents: 3000,
    image: "/shop/mock/hat-town-square-cruiser--khaki.png",
    colors: [
      { id: "khaki", label: "Khaki", hex: "#c8b07e", image: "/shop/mock/hat-town-square-cruiser--khaki.png", backImage: "/shop/mock/hat-town-square-cruiser-back--khaki.png" },
      { id: "stone", label: "Stone", hex: "#d9d2c2", image: "/shop/mock/hat-town-square-cruiser--stone.png", backImage: "/shop/mock/hat-town-square-cruiser-back--stone.png" },
      { id: "white", label: "White", hex: "#f6f6f4", image: "/shop/mock/hat-town-square-cruiser--white.png", backImage: "/shop/mock/hat-town-square-cruiser-back--white.png" },
    ],
    printfulProduct: "Yupoong 6245CM Classic Dad Hat (catalog product 206), embroidery front",
    variants: [
      { sku: "hat-tsc-khaki", label: "Khaki / One size", color: "khaki", size: "One size", printfulVariantId: 7855 },
      { sku: "hat-tsc-stone", label: "Stone / One size", color: "stone", size: "One size", printfulVariantId: 7859 },
      { sku: "hat-tsc-white", label: "White / One size", color: "white", size: "One size", printfulVariantId: 7853 },
    ],
    files: [
      { type: "embroidery_front", path: "/shop/print/hat-town-square-cruiser.png" },
      { type: "embroidery_back", path: "/shop/print/hat-town-square-cruiser-back.png" },
    ],
    options: [
      { id: "thread_colors", value: ["#01784E", "#E25C27", "#FFFFFF", "#7BA35A", "#FFCC00", "#000000"] },
      { id: "thread_colors_back", value: ["#000000", "#E25C27", "#01784E", "#FFCC00", "#3399FF"] },
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
    image: "/shop/mock/mug-coffee-pickleball-nap-front--white.png",
    // One colour with a back view so the product page shows the Front/Back toggle (same as the hat).
    // Both mockups are slices of the real wrap print file: front = text side, back = pickleball + wordmark.
    colors: [
      {
        id: "white",
        label: "White",
        hex: "#fbfbf9",
        image: "/shop/mock/mug-coffee-pickleball-nap-front--white.png",
        backImage: "/shop/mock/mug-coffee-pickleball-nap-back--white.png",
      },
    ],
    printfulProduct: "White Glossy Mug (catalog product 19)",
    variants: [
      { sku: "mug-cpn-11", label: "11 oz", color: "white", size: "11 oz", printfulVariantId: 1320 },
      { sku: "mug-cpn-15", label: "15 oz", color: "white", size: "15 oz", printfulVariantId: 4830 },
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
    image: "/shop/mock/sticker-my-other-ride-straight-v2--white.png",
    printfulProduct: "Kiss-Cut Stickers (catalog product 358)",
    variants: [
      { sku: "stk-moric-3", label: "3 x 3 in", size: "3 x 3 in", printfulVariantId: 10163 },
      { sku: "stk-moric-4", label: "4 x 4 in", size: "4 x 4 in", printfulVariantId: 10164 },
    ],
    files: [{ type: "default", path: "/shop/print/sticker-my-other-ride-v2.png" }],
    taxCode: GENERAL,
  },
  {
    // Same sticker on a cream (--cream #fff8ee) field; lettering in the dark sticker's deep green so it stays legible.
    slug: "sticker-my-other-ride-light",
    type: "stickers",
    name: "My Other Ride Is a Golf Cart (Light)",
    tagline: "Kiss-cut sticker, light",
    description:
      "The same sunset golf-cart badge and ring of truth on a light cream background. For dark coolers, dark water bottles and dark golf carts.",
    priceCents: 500,
    image: "/shop/mock/sticker-my-other-ride-light-v2--white.png",
    printfulProduct: "Kiss-Cut Stickers (catalog product 358)",
    variants: [
      { sku: "stk-moric-light-3", label: "3 x 3 in", size: "3 x 3 in", printfulVariantId: 10163 },
      { sku: "stk-moric-light-4", label: "4 x 4 in", size: "4 x 4 in", printfulVariantId: 10164 },
    ],
    // v2: adds two deep-green rings (inside the outer edge, and around the logo clear of the web address).
    files: [{ type: "default", path: "/shop/print/sticker-my-other-ride-light-v2.png" }],
    taxCode: GENERAL,
  },
  // ---- Enamel pins (1 in hard enamel, fulfillment "manual", pre-order).
  {
    slug: "pin-out-of-office",
    type: "pins",
    name: "Out of Office, Permanently Pin",
    tagline: "My alarm clock retired too",
    description: "A sleepy, unplugged alarm clock in sunglasses on navy and sunset orange. For the neighbor whose only meeting is the 9 a.m. tee time. A 1 inch hard enamel pin with polished metal lines and a rubber clutch back.",
    priceCents: PIN_PRICE_CENTS,
    image: "/shop/pins/villages-pin-1-out-of-office-permanently-v2e.png",
    printfulProduct: "Not Printful: hard enamel pin, made in bulk and mailed by us (fulfillment manual)",
    variants: [{ sku: "pin-ooo-1in", label: "1 in", size: "1 in", printfulVariantId: 0 }],
    files: [],
    taxCode: GENERAL,
    fulfillment: "manual",
    preorder: PIN_PREORDER,
  },
  {
    slug: "pin-band-starts-at-5",
    type: "pins",
    name: "Band Starts at 5 PM Pin",
    tagline: "Lawn chair status",
    description: "Two webbed lawn chairs and the only schedule that matters on the square. Worth it. Front row. A 1 inch hard enamel pin with polished metal lines and a rubber clutch back.",
    priceCents: PIN_PRICE_CENTS,
    image: "/shop/pins/villages-pin-2-band-starts-at-5-v2f.png",
    printfulProduct: "Not Printful: hard enamel pin, made in bulk and mailed by us (fulfillment manual)",
    variants: [{ sku: "pin-bs5-1in", label: "1 in", size: "1 in", printfulVariantId: 0 }],
    files: [],
    taxCode: GENERAL,
    fulfillment: "manual",
    preorder: PIN_PREORDER,
  },
  {
    slug: "pin-speed-demon",
    type: "pins",
    name: "Speed Demon Pin",
    tagline: "Golf cart division",
    description: "A red shield with the speedometer pinned at 19.9 MPH. Pedal to the metal (sort of). A 1 inch hard enamel pin with polished metal lines and a rubber clutch back.",
    priceCents: PIN_PRICE_CENTS,
    image: "/shop/pins/villages-pin-3-speed-demon-shield.png",
    printfulProduct: "Not Printful: hard enamel pin, made in bulk and mailed by us (fulfillment manual)",
    variants: [{ sku: "pin-spd-1in", label: "1 in", size: "1 in", printfulVariantId: 0 }],
    files: [],
    taxCode: GENERAL,
    fulfillment: "manual",
    preorder: PIN_PREORDER,
  },
  {
    slug: "pin-golden-hour",
    type: "pins",
    name: "Golden Hour Pin",
    tagline: "The Villages, FL",
    description: "A town-square clock tower and palms against a purple-to-peach sunset, ringed in turquoise. A 1 inch hard enamel pin with polished metal lines and a rubber clutch back.",
    priceCents: PIN_PRICE_CENTS,
    image: "/shop/pins/villages-pin-4-golden-hour-clock-tower-v2.png",
    printfulProduct: "Not Printful: hard enamel pin, made in bulk and mailed by us (fulfillment manual)",
    variants: [{ sku: "pin-gh-1in", label: "1 in", size: "1 in", printfulVariantId: 0 }],
    files: [],
    taxCode: GENERAL,
    fulfillment: "manual",
    preorder: PIN_PREORDER,
  },
  {
    slug: "pin-everything-app-logo",
    type: "pins",
    name: "Everything App Logo Pin",
    tagline: "The sunset cart badge",
    description: "The app's full-color sunset golf-cart badge, flamingo and all, in a gold and deep green rim. A 1 inch hard enamel pin with polished metal lines and a rubber clutch back.",
    priceCents: PIN_PRICE_CENTS,
    image: "/shop/pins/villages-pin-5-everything-app-logo.png",
    printfulProduct: "Not Printful: hard enamel pin, made in bulk and mailed by us (fulfillment manual)",
    variants: [{ sku: "pin-logo-1in", label: "1 in", size: "1 in", printfulVariantId: 0 }],
    files: [],
    taxCode: GENERAL,
    fulfillment: "manual",
    preorder: PIN_PREORDER,
  },
  {
    slug: "pin-everything-app-shield",
    type: "pins",
    name: "Everything App Shield Pin",
    tagline: "Est. on the app",
    description: "The sunset golf-cart badge ringed in coral on a cream shield with a coral and turquoise frame. A 1 inch hard enamel pin with polished metal lines and a rubber clutch back.",
    priceCents: PIN_PRICE_CENTS,
    image: "/shop/pins/villages-pin-6-everything-app-logo-shield-v2e.png",
    printfulProduct: "Not Printful: hard enamel pin, made in bulk and mailed by us (fulfillment manual)",
    variants: [{ sku: "pin-shld-1in", label: "1 in", size: "1 in", printfulVariantId: 0 }],
    files: [],
    taxCode: GENERAL,
    fulfillment: "manual",
    preorder: PIN_PREORDER,
  },
  // ---- Name badges: Lasercraft Executive 3" x 2", made from our own print files (fulfillment "manual").
  //      Price is per badge and depends on the material (BADGE_MATERIALS in badges.ts); priceCents is the "from" price. ----
  {
    slug: "custom-name-badge",
    type: "badges",
    name: "Custom Name Badge",
    tagline: "Your name, your village",
    description:
      "A full-color 3\" x 2\" name badge with a magnetic two-post backing (no pin holes). Pick one of seven themes, type your name (and your village on the themes that print it), choose White Acrylic or White Aluminum, and watch the preview update as you type.",
    priceCents: BADGE_FROM_CENTS,
    priceNote: `From ${formatPrice(BADGE_FROM_CENTS)}`,
    image: "/shop/badges/card-custom-name-badge-3x2.png",
    printfulProduct: "Not Printful: Lasercraft Executive 3 x 2 in magnetic name badge (two-post), printed from our rendered 300 dpi file",
    variants: BADGE_THEMES.map((t) => ({ sku: customBadgeSku(t.id), label: t.label, size: BADGE_SIZE.label, printfulVariantId: 0 })),
    files: [],
    taxCode: GENERAL,
    fulfillment: "manual",
    badge: { kind: "custom" },
  },
  {
    slug: "ready-badge-jonathan-edenfield",
    type: "badges",
    name: "Jonathan, Edenfield",
    tagline: "Ready-made name badge",
    description: "A ready-made Edenfield name badge for Jonathan. 3\" x 2\" with a magnetic two-post backing.",
    priceCents: BADGE_FROM_CENTS,
    priceNote: `From ${formatPrice(BADGE_FROM_CENTS)}`,
    image: "/shop/badges/ready/jonathan-edenfield-3x2.png",
    printfulProduct: "Not Printful: Lasercraft Executive 3 x 2 in magnetic name badge (two-post), print-ready file supplied",
    variants: [{ sku: "badge-ready-jonathan", label: BADGE_SIZE.label, size: BADGE_SIZE.label, printfulVariantId: 0 }],
    files: [{ type: "default", path: "/shop/badges/ready/jonathan-edenfield-3x2-bleed.png" }],
    taxCode: GENERAL,
    fulfillment: "manual",
    listed: false,
    hidden: !READY_MADE_ENABLED,
    badge: { kind: "ready", size: "3x2in", file: "/shop/badges/ready/jonathan-edenfield-3x2.png", bleedFile: "/shop/badges/ready/jonathan-edenfield-3x2-bleed.png", alt: "Edenfield name badge reading The Village of Edenfield, JONATHAN" },
  },
  {
    slug: "ready-badge-lucy-edenfield",
    type: "badges",
    name: "Lucy, Edenfield",
    tagline: "Ready-made name badge",
    description: "A ready-made Edenfield name badge for Lucy. 3\" x 2\" with a magnetic two-post backing.",
    priceCents: BADGE_FROM_CENTS,
    priceNote: `From ${formatPrice(BADGE_FROM_CENTS)}`,
    image: "/shop/badges/ready/lucy-edenfield-3x2.png",
    printfulProduct: "Not Printful: Lasercraft Executive 3 x 2 in magnetic name badge (two-post), print-ready file supplied",
    variants: [{ sku: "badge-ready-lucy", label: BADGE_SIZE.label, size: BADGE_SIZE.label, printfulVariantId: 0 }],
    files: [{ type: "default", path: "/shop/badges/ready/lucy-edenfield-3x2-bleed.png" }],
    taxCode: GENERAL,
    fulfillment: "manual",
    listed: false,
    hidden: !READY_MADE_ENABLED,
    badge: { kind: "ready", size: "3x2in", file: "/shop/badges/ready/lucy-edenfield-3x2.png", bleedFile: "/shop/badges/ready/lucy-edenfield-3x2-bleed.png", alt: "Edenfield name badge reading The Village of Edenfield, LUCY" },
  },
];

/** Products that can be shown, added to a cart and checked out. */
export function isOrderable(product: Product) {
  return product.hidden !== true;
}

/** True when the sku belongs to a product that is not hidden. */
export function isOrderableSku(sku: string) {
  const found = findVariant(sku);
  return !!found && isOrderable(found.product);
}

/** Products shown in the /shop grid. */
export const LISTED_PRODUCTS = PRODUCTS.filter((p) => p.listed !== false && isOrderable(p));

/** Ready-made badges shown on the badge page (none while READY_MADE_ENABLED is false). */
export const READY_BADGE_PRODUCTS = PRODUCTS.filter((p) => p.badge?.kind === "ready" && isOrderable(p));

/** Product pages served by /shop/[slug] (the custom badge has its own page; ready-made badges live on it). */
export const SLUG_PAGE_PRODUCTS = PRODUCTS.filter((p) => p.type !== "badges" && isOrderable(p));

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

/** Where a cart line links back to. */
export function productHref(product: Product) {
  return product.type === "badges" ? (product.badge?.kind === "ready" && isOrderable(product) ? "/shop/custom-name-badge#ready-made" : "/shop/custom-name-badge") : `/shop/${product.slug}`;
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
