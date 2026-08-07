/** Client-safe types for Best of the Month Club */

export const BOM_CATEGORIES = [
  "pet",
  "car",
  "golf-cart",
  "villager",
  "landscaping",
  "house",
  "best-of-rest",
] as const;

export type BomCategory = (typeof BOM_CATEGORIES)[number];

export const BOM_CATEGORY_META: Record<
  BomCategory,
  { label: string; shortLabel: string; blurb: string; art: string }
> = {
  pet: {
    label: "Pet of the Month",
    shortLabel: "Pets",
    blurb: "Fur, feathers, scales — your best buddy on the cart path.",
    art: "/graphics/best-of-month/pet.jpg",
  },
  car: {
    label: "Car of the Month",
    shortLabel: "Cars",
    blurb: "Classics, convertibles, and driveway showpieces.",
    art: "/graphics/best-of-month/car.jpg",
  },
  "golf-cart": {
    label: "Golf Cart of the Month",
    shortLabel: "Golf carts",
    blurb: "Decorated, lifted, or just perfectly loved.",
    art: "/graphics/best-of-month/golf-cart.jpg",
  },
  villager: {
    label: "Villager of the Month",
    shortLabel: "Villagers",
    blurb: "Neighbors who make The Villages feel like home.",
    art: "/graphics/best-of-month/villager.jpg",
  },
  landscaping: {
    label: "Landscaping of the Month",
    shortLabel: "Landscaping",
    blurb: "Beds, blooms, palms, and curb appeal that stops the cart.",
    art: "/graphics/best-of-month/landscaping.jpg",
  },
  house: {
    label: "House of the Month",
    shortLabel: "Houses",
    blurb: "Facades, lanais, and homes that look like a postcard.",
    art: "/graphics/best-of-month/house.jpg",
  },
  "best-of-rest": {
    label: "Best of the Rest",
    shortLabel: "Best of the rest",
    blurb: "Anything wonderful that doesn’t fit the other boxes — surprise us.",
    art: "/graphics/best-of-month/best-of-rest.jpg",
  },
};

export type BomEntryStatus = "pending" | "approved" | "rejected";

export type BomFileType = "image" | "pdf";

export type BomEntry = {
  id: string;
  category: BomCategory;
  /** Subject name (pet name, car, cart, person) */
  title: string;
  description?: string;
  submitterName: string;
  imageUrl: string;
  fileType: BomFileType;
  status: BomEntryStatus;
  /** Competition month YYYY-MM (Florida) */
  monthKey: string;
  createdAt: string;
  /** Denormalized running total */
  votes: number;
};

export type BomVote = {
  id: string;
  entryId: string;
  category: BomCategory;
  monthKey: string;
  /** Stable browser voter id (cookie) */
  voterKey: string;
  createdAt: string;
};

export type BomCategoryResult = {
  category: BomCategory;
  winnerEntryId: string | null;
  honorableMentionIds: string[];
};

export type BomMonthResults = {
  /** Month that was voted on (YYYY-MM) */
  monthKey: string;
  /** Month these results are featured as “last month’s winners” */
  featuredInMonthKey: string;
  tabulatedAt: string;
  categories: BomCategoryResult[];
};

export type BomData = {
  entries: BomEntry[];
  votes: BomVote[];
  results: BomMonthResults[];
  updatedAt: string | null;
};
