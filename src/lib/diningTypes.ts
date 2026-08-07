export const CUISINES = [
  "American",
  "Italian",
  "Mexican",
  "Asian",
  "Seafood",
  "BBQ",
  "Breakfast",
  "Steakhouse",
  "Mediterranean",
  "Other",
] as const;

export type Cuisine = (typeof CUISINES)[number];

/**
 * Whimsical card art for each cuisine (under /public/graphics/cuisines).
 * Each card features a different cute Florida creature as the waiter.
 */
export const CUISINE_ART: Record<Cuisine, string> = {
  American: "/graphics/cuisines/american-v2.jpg", // brown pelican
  Italian: "/graphics/cuisines/italian-v2.jpg", // manatee
  Mexican: "/graphics/cuisines/mexican-v2.jpg", // armadillo
  Asian: "/graphics/cuisines/asian-v2.jpg", // sea turtle
  Seafood: "/graphics/cuisines/seafood-v2.jpg", // bottlenose dolphin
  BBQ: "/graphics/cuisines/bbq-v2.jpg", // alligator
  Breakfast: "/graphics/cuisines/breakfast-v2.jpg", // roseate spoonbill
  Steakhouse: "/graphics/cuisines/steakhouse-v2.jpg", // Florida black bear
  Mediterranean: "/graphics/cuisines/mediterranean-v2.jpg", // white ibis
  Other: "/graphics/cuisines/other-v2.jpg", // raccoon
};

export function cuisineArtPath(cuisine: string): string {
  if ((CUISINES as readonly string[]).includes(cuisine)) {
    return CUISINE_ART[cuisine as Cuisine];
  }
  return CUISINE_ART.Other;
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
