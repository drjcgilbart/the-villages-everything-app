export const CUISINES = [
  "Mediterranean",
  "Asian",
  "American",
  "Indian",
  "Greek",
  "Burgers",
  "Pizza",
  "Seafood",
  "Mexican",
  "Italian",
  "Barbecue",
  "Caribbean",
  "Bakery",
  "Fast food",
  "Breakfast",
  "Steakhouse",
  "Cuban",
  "Latin American",
  "Irish",
  "Southern",
  "Coffee/Tea/Beverages",
  "Ice Cream & Sweet Treats",
] as const;

export type Cuisine = (typeof CUISINES)[number];

const FALLBACK_CUISINE: Cuisine = "American";
export const FALLBACK_CUISINE_ART = "/graphics/cuisines/other-v2.jpg";

const CUISINE_ALIASES: Record<string, Cuisine> = {
  bbq: "Barbecue",
  barbeque: "Barbecue",
  "bar-b-q": "Barbecue",
  "bar-b-que": "Barbecue",
  "fast-food": "Fast food",
  fastfood: "Fast food",
  "latin-american": "Latin American",
  latin: "Latin American",
  coffee: "Coffee/Tea/Beverages",
  tea: "Coffee/Tea/Beverages",
  cafe: "Coffee/Tea/Beverages",
  café: "Coffee/Tea/Beverages",
  beverages: "Coffee/Tea/Beverages",
  "coffee/tea/beverages": "Coffee/Tea/Beverages",
  "ice cream": "Ice Cream & Sweet Treats",
  icecream: "Ice Cream & Sweet Treats",
  "ice-cream": "Ice Cream & Sweet Treats",
  gelato: "Ice Cream & Sweet Treats",
  dessert: "Ice Cream & Sweet Treats",
  sweets: "Ice Cream & Sweet Treats",
  "frozen yogurt": "Ice Cream & Sweet Treats",
  "ice cream & sweet treats": "Ice Cream & Sweet Treats",
  other: FALLBACK_CUISINE,
};

export function isCuisine(value: string): value is Cuisine {
  return (CUISINES as readonly string[]).includes(value);
}

export function cuisineSlug(cuisine: string): string {
  return String(cuisine || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeCuisine(raw: unknown): Cuisine {
  const c = String(raw || "").trim();
  if (isCuisine(c)) return c;
  const key = c.toLowerCase();
  if (CUISINE_ALIASES[key]) return CUISINE_ALIASES[key];
  const match = CUISINES.find((item) => item.toLowerCase() === key);
  return match || FALLBACK_CUISINE;
}

/**
 * Whimsical card art for each cuisine (under /public/graphics/cuisines).
 * Each card features a different cute Florida creature as the waiter.
 */
export const CUISINE_ART: Record<Cuisine, string> = {
  Mediterranean: "/graphics/cuisines/mediterranean-v2.jpg", // white ibis
  Asian: "/graphics/cuisines/asian-v2.jpg", // sea turtle
  American: "/graphics/cuisines/american-v2.jpg", // brown pelican
  Indian: "/graphics/cuisines/indian-v2.jpg", // flamingo
  Greek: "/graphics/cuisines/greek-v2.jpg", // sandhill crane
  Burgers: "/graphics/cuisines/burgers-v2.jpg", // river otter
  Pizza: "/graphics/cuisines/pizza-v2.jpg", // gopher tortoise
  Seafood: "/graphics/cuisines/seafood-v2.jpg", // bottlenose dolphin
  Mexican: "/graphics/cuisines/mexican-v2.jpg", // armadillo
  Italian: "/graphics/cuisines/italian-v2.jpg", // manatee
  Barbecue: "/graphics/cuisines/bbq-v2.jpg", // alligator
  Caribbean: "/graphics/cuisines/caribbean-v2.jpg", // monk parakeet
  Bakery: "/graphics/cuisines/bakery-v2.jpg", // Florida scrub jay
  "Fast food": "/graphics/cuisines/fast-food-v2.jpg", // gray fox
  Breakfast: "/graphics/cuisines/breakfast-v2.jpg", // roseate spoonbill
  Steakhouse: "/graphics/cuisines/steakhouse-v2.jpg", // Florida black bear
  Cuban: "/graphics/cuisines/cuban-v2.jpg", // Cuban tree frog
  "Latin American": "/graphics/cuisines/latin-american-v2.jpg", // green iguana
  Irish: "/graphics/cuisines/irish-v2.jpg", // great blue heron
  Southern: "/graphics/cuisines/southern-v2.jpg", // wild turkey
  "Coffee/Tea/Beverages": "/graphics/cuisines/coffee-tea-v2.jpg", // snowy egret
  "Ice Cream & Sweet Treats": "/graphics/cuisines/sweets-v2.jpg", // key deer
};

export function cuisineArtPath(cuisine: string): string {
  const key = normalizeCuisine(cuisine);
  return CUISINE_ART[key] || FALLBACK_CUISINE_ART;
}

export const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"] as const;
export type PriceRange = (typeof PRICE_RANGES)[number];

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine: Cuisine;
  /** Secondary tags e.g. pizza, early-bird, outdoor */
  tags: string[];
  area: string;
  address?: string;
  phone?: string;
  website?: string;
  priceRange: PriceRange;
  description: string;
  /** Signature dishes or must-tries */
  specialties: string[];
  imageUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  restaurantId: string;
  authorName: string;
  /** Hub member id when posted while signed in */
  authorMemberId?: string | null;
  /** 1–5 whole stars */
  rating: number;
  title: string;
  body: string;
  /** Would you go back? */
  wouldReturn: boolean;
  /** Optional dish shout-out */
  dish?: string;
  createdAt: string;
  /** Soft-hide without delete */
  hidden?: boolean;
};

export type Interview = {
  id: string;
  restaurantId: string;
  personName: string;
  role: string;
  title: string;
  excerpt: string;
  body: string;
  quote?: string;
  imageUrl?: string;
  publishedAt: string;
  featured?: boolean;
};

/** Visitor-submitted restaurant; only listed after admin approval. */
export type RestaurantSuggestionStatus = "pending" | "approved" | "rejected";

export type RestaurantSuggestion = {
  id: string;
  name: string;
  cuisine: Cuisine;
  tags: string[];
  area: string;
  address?: string;
  phone?: string;
  website?: string;
  priceRange: PriceRange;
  description: string;
  specialties: string[];
  /** Who suggested it (display name) */
  suggestedBy: string;
  /** Optional email for follow-up (admin only) */
  suggestedByEmail?: string;
  /** Extra note for admin (why list it, etc.) */
  note?: string;
  status: RestaurantSuggestionStatus;
  createdAt: string;
  reviewedAt?: string;
  /** Set when approved — links to the live restaurant */
  approvedRestaurantId?: string;
  rejectReason?: string;
};

export type DiningData = {
  restaurants: Restaurant[];
  reviews: Review[];
  interviews: Interview[];
  suggestions: RestaurantSuggestion[];
  updatedAt: string | null;
};

export type RatingBreakdown = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type RestaurantStats = {
  restaurantId: string;
  reviewCount: number;
  averageRating: number;
  wouldReturnPct: number;
  breakdown: RatingBreakdown;
};

export type RankedRestaurant = Restaurant & {
  stats: RestaurantStats;
  rank: number;
};
