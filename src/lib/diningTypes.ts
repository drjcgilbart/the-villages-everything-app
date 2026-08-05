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

export type DiningData = {
  restaurants: Restaurant[];
  reviews: Review[];
  interviews: Interview[];
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
