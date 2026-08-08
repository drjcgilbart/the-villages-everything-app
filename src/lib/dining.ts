import crypto from "crypto";
import { readJsonFile, writeJsonFile } from "./dataFs";
import type {
  Cuisine,
  DiningData,
  Interview,
  PriceRange,
  RankedRestaurant,
  RatingBreakdown,
  Restaurant,
  RestaurantSuggestion,
  RestaurantStats,
  Review,
} from "./diningTypes";
import { CUISINES, PRICE_RANGES } from "./diningTypes";

const DINING_FILE = "dining.json";

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

export function slugify(text: string) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Fallback only when dining.json is missing.
 * Prefer the real listings in data/dining.json (verified public sources).
 * Never re-seed fictional restaurants.
 */
function seedData(): DiningData {
  const now = new Date().toISOString();
  const restaurants: Restaurant[] = [
    {
      id: "rest-bella-vita",
      name: "Bella Vita Italian Steakhouse",
      slug: "bella-vita-italian-steakhouse",
      cuisine: "Italian",
      tags: ["steak", "date-night", "town-square"],
      area: "Spanish Springs",
      address: "1101 Main St, The Villages, FL 32159",
      phone: "(352) 775-2353",
      website: "https://www.bellavitaitaliansteakhouse.com/",
      priceRange: "$$$",
      description:
        "Italian steakhouse on Spanish Springs Town Square — steaks, pasta, and polished dinner service.",
      specialties: ["Prime steaks", "Classic pasta"],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "rest-chop-house",
      name: "Chop House at Lake Sumter",
      slug: "chop-house-at-lake-sumter",
      cuisine: "Steakhouse",
      tags: ["steak", "date-night", "town-square"],
      area: "Lake Sumter Landing",
      address: "1045 Old Camp Rd, The Villages, FL 32162",
      phone: "(352) 750-6000",
      website: "https://www.chophousedining.com/",
      priceRange: "$$$$",
      description:
        "Upscale steaks and seafood at Lake Sumter Landing.",
      specialties: ["Aged steaks", "Seafood"],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "rest-prima",
      name: "Prima Italian Steakhouse",
      slug: "prima-italian-steakhouse",
      cuisine: "Italian",
      tags: ["steak", "italian", "town-square"],
      area: "Brownwood Paddock Square",
      address: "3660 Kiessel Rd, The Villages, FL 32163",
      phone: "(352) 391-9939",
      website: "https://www.primaitaliansteakhouse.com/",
      priceRange: "$$$",
      description:
        "Modern Italian steakhouse on Brownwood Paddock Square.",
      specialties: ["Hand-cut steaks", "Italian classics"],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    restaurants,
    reviews: [],
    interviews: [],
    suggestions: [],
    updatedAt: now,
  };
}

export function loadDining(): DiningData {
  const raw = readJsonFile<DiningData>(DINING_FILE);
  if (!raw) return seedData();
  return {
    restaurants: Array.isArray(raw.restaurants) ? raw.restaurants : [],
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    interviews: Array.isArray(raw.interviews) ? raw.interviews : [],
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions : [],
    updatedAt: raw.updatedAt || null,
  };
}

export function saveDining(data: DiningData) {
  data.updatedAt = new Date().toISOString();
  writeJsonFile(DINING_FILE, data);
  return data;
}

function emptyBreakdown(): RatingBreakdown {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
}

export function getVisibleReviews(
  reviews: Review[],
  restaurantId?: string
): Review[] {
  return reviews
    .filter((r) => !r.hidden)
    .filter((r) => (restaurantId ? r.restaurantId === restaurantId : true))
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function computeStats(
  restaurantId: string,
  reviews: Review[]
): RestaurantStats {
  const list = getVisibleReviews(reviews, restaurantId);
  const breakdown = emptyBreakdown();
  let sum = 0;
  let would = 0;
  for (const r of list) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    breakdown[star] += 1;
    sum += star;
    if (r.wouldReturn) would += 1;
  }
  const reviewCount = list.length;
  return {
    restaurantId,
    reviewCount,
    averageRating: reviewCount ? Math.round((sum / reviewCount) * 10) / 10 : 0,
    wouldReturnPct: reviewCount ? Math.round((would / reviewCount) * 100) : 0,
    breakdown,
  };
}

export function getRestaurantBySlug(slug: string): Restaurant | null {
  return loadDining().restaurants.find((r) => r.slug === slug) || null;
}

export function getRestaurantById(id: string): Restaurant | null {
  return loadDining().restaurants.find((r) => r.id === id) || null;
}

export function withStats(restaurants: Restaurant[], reviews: Review[]) {
  return restaurants.map((r) => ({
    ...r,
    stats: computeStats(r.id, reviews),
  }));
}

/** Top N restaurants for a cuisine, by average rating then review count. */
export function topByCuisine(
  cuisine: Cuisine,
  limit = 5,
  minReviews = 1
): RankedRestaurant[] {
  const data = loadDining();
  const ranked = withStats(
    data.restaurants.filter((r) => r.cuisine === cuisine),
    data.reviews
  )
    .filter((r) => r.stats.reviewCount >= minReviews)
    .sort((a, b) => {
      if (b.stats.averageRating !== a.stats.averageRating) {
        return b.stats.averageRating - a.stats.averageRating;
      }
      return b.stats.reviewCount - a.stats.reviewCount;
    })
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  return ranked;
}

/**
 * Top N per cuisine.
 * Default minReviews=0 so boards (and jump anchors) still appear for
 * real directory restaurants that do not have community ratings yet.
 */
export function allCuisineLeaders(limit = 5, minReviews = 0) {
  return CUISINES.map((cuisine) => ({
    cuisine,
    leaders: topByCuisine(cuisine, limit, minReviews),
  })).filter((block) => block.leaders.length > 0);
}

/** Cuisines that currently have at least one restaurant listed. */
export function cuisinesWithRestaurants(): Cuisine[] {
  const data = loadDining();
  const present = new Set(data.restaurants.map((r) => r.cuisine));
  return CUISINES.filter((c) => present.has(c));
}

export function overallLeaders(limit = 10, minReviews = 1): RankedRestaurant[] {
  const data = loadDining();
  return withStats(data.restaurants, data.reviews)
    .filter((r) => r.stats.reviewCount >= minReviews)
    .sort((a, b) => {
      if (b.stats.averageRating !== a.stats.averageRating) {
        return b.stats.averageRating - a.stats.averageRating;
      }
      return b.stats.reviewCount - a.stats.reviewCount;
    })
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function recentReviews(limit = 8) {
  const data = loadDining();
  return getVisibleReviews(data.reviews)
    .slice(0, limit)
    .map((review) => ({
      review,
      restaurant: data.restaurants.find((r) => r.id === review.restaurantId) || null,
    }));
}

export function getInterviews(opts?: { restaurantId?: string; featuredOnly?: boolean }) {
  const data = loadDining();
  return data.interviews
    .filter((i) => (opts?.restaurantId ? i.restaurantId === opts.restaurantId : true))
    .filter((i) => (opts?.featuredOnly ? i.featured : true))
    .slice()
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

export function upsertRestaurant(
  input: Partial<Restaurant> & {
    name: string;
    cuisine: Cuisine;
    description: string;
  }
) {
  const data = loadDining();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = data.restaurants.findIndex((r) => r.id === input.id);
    if (idx < 0) throw new Error("Restaurant not found");
    const prev = data.restaurants[idx];
    data.restaurants[idx] = {
      ...prev,
      ...input,
      name: String(input.name).trim().slice(0, 120),
      slug: input.slug ? slugify(input.slug) : prev.slug,
      cuisine: input.cuisine || prev.cuisine,
      tags: Array.isArray(input.tags) ? input.tags : prev.tags,
      area: String(input.area ?? prev.area ?? "").slice(0, 80),
      address: input.address !== undefined ? String(input.address).slice(0, 160) : prev.address,
      phone: input.phone !== undefined ? String(input.phone).slice(0, 40) : prev.phone,
      website: input.website !== undefined ? String(input.website).slice(0, 200) : prev.website,
      priceRange: (input.priceRange || prev.priceRange) as PriceRange,
      description: String(input.description ?? prev.description).slice(0, 2000),
      specialties: Array.isArray(input.specialties) ? input.specialties : prev.specialties,
      imageUrl: input.imageUrl !== undefined ? input.imageUrl || undefined : prev.imageUrl,
      featured: input.featured !== undefined ? !!input.featured : prev.featured,
      updatedAt: now,
    };
  } else {
    const name = String(input.name).trim().slice(0, 120);
    let slug = slugify(input.slug || name);
    if (data.restaurants.some((r) => r.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    data.restaurants.unshift({
      id: uid("rest"),
      name,
      slug,
      cuisine: input.cuisine,
      tags: Array.isArray(input.tags) ? input.tags : [],
      area: String(input.area || "The Villages").slice(0, 80),
      address: input.address ? String(input.address).slice(0, 160) : undefined,
      phone: input.phone ? String(input.phone).slice(0, 40) : undefined,
      website: input.website ? String(input.website).slice(0, 200) : undefined,
      priceRange: (input.priceRange || "$$") as PriceRange,
      description: String(input.description).slice(0, 2000),
      specialties: Array.isArray(input.specialties) ? input.specialties : [],
      imageUrl: input.imageUrl || undefined,
      featured: !!input.featured,
      createdAt: now,
      updatedAt: now,
    });
  }
  return saveDining(data);
}

export function deleteRestaurant(id: string) {
  const data = loadDining();
  data.restaurants = data.restaurants.filter((r) => r.id !== id);
  data.reviews = data.reviews.filter((r) => r.restaurantId !== id);
  data.interviews = data.interviews.filter((i) => i.restaurantId !== id);
  return saveDining(data);
}

function normalizeCuisine(raw: unknown): Cuisine {
  const c = String(raw || "").trim();
  return CUISINES.includes(c as Cuisine) ? (c as Cuisine) : "Other";
}

function normalizePrice(raw: unknown): PriceRange {
  const p = String(raw || "").trim();
  return PRICE_RANGES.includes(p as PriceRange) ? (p as PriceRange) : "$$";
}

/** Public: visitor suggests a restaurant for admin review. */
export function submitRestaurantSuggestion(input: {
  name: string;
  cuisine?: string;
  area?: string;
  address?: string;
  phone?: string;
  website?: string;
  priceRange?: string;
  description?: string;
  specialties?: string[] | string;
  tags?: string[] | string;
  suggestedBy: string;
  suggestedByEmail?: string;
  note?: string;
}): RestaurantSuggestion {
  const data = loadDining();
  const name = String(input.name || "").trim().slice(0, 120);
  if (name.length < 2) throw new Error("Please enter the restaurant name");

  const suggestedBy = String(input.suggestedBy || "").trim().slice(0, 60);
  if (suggestedBy.length < 2) throw new Error("Please enter your name");

  const description = String(input.description || "").trim().slice(0, 2000);
  if (description.length < 10) {
    throw new Error(
      "Add a short description so we know why this spot belongs in the guide"
    );
  }

  // Soft dedupe against live list and pending suggestions
  const nameKey = name.toLowerCase();
  if (data.restaurants.some((r) => r.name.toLowerCase() === nameKey)) {
    throw new Error("That restaurant is already listed in Dining");
  }
  if (
    data.suggestions.some(
      (s) =>
        s.status === "pending" && s.name.toLowerCase() === nameKey
    )
  ) {
    throw new Error(
      "Someone already suggested that spot — it's waiting for admin review"
    );
  }

  const splitList = (v: string[] | string | undefined) => {
    if (Array.isArray(v)) return v.map(String).map((t) => t.trim()).filter(Boolean);
    return String(v || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const suggestion: RestaurantSuggestion = {
    id: uid("sug"),
    name,
    cuisine: normalizeCuisine(input.cuisine),
    tags: splitList(input.tags).slice(0, 12),
    area: String(input.area || "The Villages").trim().slice(0, 80) || "The Villages",
    address: input.address
      ? String(input.address).trim().slice(0, 160)
      : undefined,
    phone: input.phone ? String(input.phone).trim().slice(0, 40) : undefined,
    website: input.website
      ? String(input.website).trim().slice(0, 200)
      : undefined,
    priceRange: normalizePrice(input.priceRange),
    description,
    specialties: splitList(input.specialties).slice(0, 8),
    suggestedBy,
    suggestedByEmail: input.suggestedByEmail
      ? String(input.suggestedByEmail).trim().slice(0, 120)
      : undefined,
    note: input.note ? String(input.note).trim().slice(0, 500) : undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  data.suggestions.unshift(suggestion);
  saveDining(data);
  return suggestion;
}

export function listRestaurantSuggestions(opts?: {
  status?: RestaurantSuggestion["status"] | "all";
}): RestaurantSuggestion[] {
  const data = loadDining();
  const status = opts?.status || "all";
  return data.suggestions
    .filter((s) => (status === "all" ? true : s.status === status))
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

/** Admin: approve → creates live restaurant and marks suggestion approved. */
export function approveRestaurantSuggestion(id: string): {
  suggestion: RestaurantSuggestion;
  restaurant: Restaurant;
} {
  const data = loadDining();
  const idx = data.suggestions.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("Suggestion not found");
  const sug = data.suggestions[idx];

  if (sug.status === "approved" && sug.approvedRestaurantId) {
    const existing = data.restaurants.find(
      (r) => r.id === sug.approvedRestaurantId
    );
    if (existing) return { suggestion: sug, restaurant: existing };
  }
  if (sug.status === "rejected") {
    throw new Error(
      "That suggestion was rejected — re-submit or add the restaurant manually"
    );
  }

  // Already live under the same name? Link without duplicating.
  const nameKey = sug.name.toLowerCase();
  let restaurant = data.restaurants.find((r) => r.name.toLowerCase() === nameKey);
  const now = new Date().toISOString();

  if (!restaurant) {
    let slug = slugify(sug.name);
    if (data.restaurants.some((r) => r.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    restaurant = {
      id: uid("rest"),
      name: sug.name,
      slug,
      cuisine: sug.cuisine,
      tags: sug.tags || [],
      area: sug.area || "The Villages",
      address: sug.address,
      phone: sug.phone,
      website: sug.website,
      priceRange: sug.priceRange || "$$",
      description: sug.description,
      specialties: sug.specialties || [],
      featured: false,
      createdAt: now,
      updatedAt: now,
    };
    data.restaurants.unshift(restaurant);
  }

  data.suggestions[idx] = {
    ...sug,
    status: "approved",
    reviewedAt: now,
    approvedRestaurantId: restaurant.id,
  };
  saveDining(data);
  return { suggestion: data.suggestions[idx], restaurant };
}

export function rejectRestaurantSuggestion(
  id: string,
  reason?: string
): RestaurantSuggestion {
  const data = loadDining();
  const idx = data.suggestions.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("Suggestion not found");
  if (data.suggestions[idx].status === "approved") {
    throw new Error("Already approved — remove the restaurant from the live list if needed");
  }
  data.suggestions[idx] = {
    ...data.suggestions[idx],
    status: "rejected",
    reviewedAt: new Date().toISOString(),
    rejectReason: reason ? String(reason).trim().slice(0, 300) : undefined,
  };
  saveDining(data);
  return data.suggestions[idx];
}

export function deleteRestaurantSuggestion(id: string) {
  const data = loadDining();
  data.suggestions = data.suggestions.filter((s) => s.id !== id);
  return saveDining(data);
}

export function addReview(input: {
  restaurantId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  wouldReturn?: boolean;
  dish?: string;
  authorMemberId?: string | null;
}) {
  const data = loadDining();
  if (!data.restaurants.some((r) => r.id === input.restaurantId)) {
    throw new Error("Restaurant not found");
  }
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 0)));
  if (rating < 1) throw new Error("Rating must be 1–5 stars");
  const authorName = String(input.authorName || "").trim().slice(0, 60);
  if (authorName.length < 2) throw new Error("Please enter your name");
  const title = String(input.title || "").trim().slice(0, 120);
  const body = String(input.body || "").trim().slice(0, 2000);
  if (title.length < 3) throw new Error("Please add a short title");
  if (body.length < 10) throw new Error("Review is a bit short — give us a few more details");

  const review: Review = {
    id: uid("rev"),
    restaurantId: input.restaurantId,
    authorName,
    authorMemberId: input.authorMemberId || null,
    rating,
    title,
    body,
    wouldReturn: input.wouldReturn !== false,
    dish: input.dish ? String(input.dish).slice(0, 80) : undefined,
    createdAt: new Date().toISOString(),
  };
  data.reviews.unshift(review);
  saveDining(data);
  return review;
}

export function setReviewHidden(id: string, hidden: boolean) {
  const data = loadDining();
  const idx = data.reviews.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Review not found");
  data.reviews[idx] = { ...data.reviews[idx], hidden: !!hidden };
  return saveDining(data);
}

export function deleteReview(id: string) {
  const data = loadDining();
  data.reviews = data.reviews.filter((r) => r.id !== id);
  return saveDining(data);
}

export function upsertInterview(
  input: Partial<Interview> & {
    restaurantId: string;
    personName: string;
    role: string;
    title: string;
    body: string;
  }
) {
  const data = loadDining();
  if (!data.restaurants.some((r) => r.id === input.restaurantId)) {
    throw new Error("Restaurant not found");
  }
  const now = new Date().toISOString();
  if (input.id) {
    const idx = data.interviews.findIndex((i) => i.id === input.id);
    if (idx < 0) throw new Error("Interview not found");
    const prev = data.interviews[idx];
    data.interviews[idx] = {
      ...prev,
      ...input,
      personName: String(input.personName).trim().slice(0, 80),
      role: String(input.role).trim().slice(0, 80),
      title: String(input.title).trim().slice(0, 160),
      excerpt: String(input.excerpt ?? prev.excerpt ?? "").slice(0, 400),
      body: String(input.body),
      quote: input.quote !== undefined ? String(input.quote).slice(0, 280) : prev.quote,
      imageUrl: input.imageUrl !== undefined ? input.imageUrl || undefined : prev.imageUrl,
      featured: input.featured !== undefined ? !!input.featured : prev.featured,
      publishedAt: input.publishedAt || prev.publishedAt,
    };
  } else {
    data.interviews.unshift({
      id: uid("int"),
      restaurantId: input.restaurantId,
      personName: String(input.personName).trim().slice(0, 80),
      role: String(input.role).trim().slice(0, 80),
      title: String(input.title).trim().slice(0, 160),
      excerpt: String(input.excerpt || "").slice(0, 400),
      body: String(input.body),
      quote: input.quote ? String(input.quote).slice(0, 280) : undefined,
      imageUrl: input.imageUrl || undefined,
      publishedAt: input.publishedAt || now,
      featured: !!input.featured,
    });
  }
  return saveDining(data);
}

export function deleteInterview(id: string) {
  const data = loadDining();
  data.interviews = data.interviews.filter((i) => i.id !== id);
  return saveDining(data);
}

export function diningSummary() {
  const data = loadDining();
  const stats = withStats(data.restaurants, data.reviews);
  const withReviews = stats.filter((r) => r.stats.reviewCount > 0);
  const avgAll = withReviews.length
    ? Math.round(
        (withReviews.reduce((s, r) => s + r.stats.averageRating, 0) /
          withReviews.length) *
          10
      ) / 10
    : 0;
  return {
    restaurantCount: data.restaurants.length,
    reviewCount: getVisibleReviews(data.reviews).length,
    interviewCount: data.interviews.length,
    averageRating: avgAll,
    cuisineCount: new Set(data.restaurants.map((r) => r.cuisine)).size,
  };
}
