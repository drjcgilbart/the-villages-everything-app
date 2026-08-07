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

function seedData(): DiningData {
  const now = new Date().toISOString();
  const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

  function rev(
    restaurantId: string,
    authorName: string,
    rating: number,
    title: string,
    body: string,
    wouldReturn: boolean,
    dish: string | undefined,
    createdAt: string
  ): Review {
    return {
      id: uid("rev"),
      restaurantId,
      authorName,
      rating,
      title,
      body,
      wouldReturn,
      dish,
      createdAt,
    };
  }

  const restaurants: Restaurant[] = [
    {
      id: "rest-seed-1",
      name: "Village Bistro & Grill",
      slug: "village-bistro-grill",
      cuisine: "American",
      tags: ["early-bird", "outdoor", "family"],
      area: "Spanish Springs",
      address: "Near the square",
      priceRange: "$$",
      description:
        "Comfort classics with a Florida twist — burgers, salads, and the kind of early-bird specials that keep the parking lot full by 4:15.",
      specialties: ["Blackened grouper sandwich", "Sunset salad"],
      featured: true,
      createdAt: day(30),
      updatedAt: now,
    },
    {
      id: "rest-seed-2",
      name: "Cart Path Pizza Co.",
      slug: "cart-path-pizza",
      cuisine: "Italian",
      tags: ["pizza", "casual", "takeout"],
      area: "Lake Sumter Landing",
      priceRange: "$",
      description:
        "Thin-crust pies, garlic knots, and zero judgment if you show up in a decorated golf cart.",
      specialties: ["Villager supreme", "Truffle mushroom"],
      featured: true,
      createdAt: day(28),
      updatedAt: now,
    },
    {
      id: "rest-seed-3",
      name: "Fiesta Plaza Cantina",
      slug: "fiesta-plaza-cantina",
      cuisine: "Mexican",
      tags: ["margaritas", "live-music", "patio"],
      area: "Brownwood Paddock Square",
      priceRange: "$$",
      description:
        "Sizzling fajitas, fresh guacamole, and patio energy that feels like a permanent happy hour.",
      specialties: ["Street tacos", "Tableside guac"],
      createdAt: day(25),
      updatedAt: now,
    },
    {
      id: "rest-seed-4",
      name: "Lotus Lantern Kitchen",
      slug: "lotus-lantern-kitchen",
      cuisine: "Asian",
      tags: ["sushi", "noodles", "date-night"],
      area: "Mulberry Grove",
      priceRange: "$$",
      description:
        "Sushi rolls, stir-fries, and noodle bowls that convert even the “I only eat American food” crowd.",
      specialties: ["Dragon roll", "Pad Thai"],
      createdAt: day(22),
      updatedAt: now,
    },
    {
      id: "rest-seed-5",
      name: "Gulf & Green Seafood",
      slug: "gulf-and-green-seafood",
      cuisine: "Seafood",
      tags: ["fresh-catch", "oysters", "dinner"],
      area: "Lake Sumter Landing",
      priceRange: "$$$",
      description:
        "Coastal plates without the drive to the coast — oysters, grouper, and key lime for dessert.",
      specialties: ["Oysters Rockefeller", "Grouper piccata"],
      featured: true,
      createdAt: day(20),
      updatedAt: now,
    },
    {
      id: "rest-seed-6",
      name: "Smoky Spoke BBQ",
      slug: "smoky-spoke-bbq",
      cuisine: "BBQ",
      tags: ["brisket", "casual", "takeout"],
      area: "Sumter Landing outskirts",
      priceRange: "$$",
      description:
        "Low-and-slow meats, sticky sides, and sauce debates that last longer than dessert.",
      specialties: ["Brisket plate", "Mac & cheese"],
      createdAt: day(18),
      updatedAt: now,
    },
    {
      id: "rest-seed-7",
      name: "Sunrise Skillet Café",
      slug: "sunrise-skillet-cafe",
      cuisine: "Breakfast",
      tags: ["brunch", "coffee", "pancakes"],
      area: "Spanish Springs",
      priceRange: "$",
      description:
        "Eggs any style, bottomless coffee energy, and the best reason to wake up before pickleball.",
      specialties: ["Loaded skillet", "Blueberry pancakes"],
      createdAt: day(15),
      updatedAt: now,
    },
    {
      id: "rest-seed-8",
      name: "Ironwood Steakhouse",
      slug: "ironwood-steakhouse",
      cuisine: "Steakhouse",
      tags: ["steak", "date-night", "wine"],
      area: "Brownwood",
      priceRange: "$$$$",
      description:
        "Big steaks, bigger sides, and the occasional celebratory “we paid off the house” dinner.",
      specialties: ["Ribeye", "Loaded baked potato"],
      createdAt: day(12),
      updatedAt: now,
    },
    {
      id: "rest-seed-9",
      name: "Olive Branch Mediterranean",
      slug: "olive-branch-mediterranean",
      cuisine: "Mediterranean",
      tags: ["healthy", "hummus", "grill"],
      area: "Mulberry Grove",
      priceRange: "$$",
      description:
        "Fresh salads, grilled kebabs, and hummus that disappears before the pita arrives.",
      specialties: ["Mixed grill", "Falafel plate"],
      createdAt: day(10),
      updatedAt: now,
    },
    {
      id: "rest-seed-10",
      name: "Harbor House American",
      slug: "harbor-house-american",
      cuisine: "American",
      tags: ["waterfront", "cocktails", "dinner"],
      area: "Lake Sumter Landing",
      priceRange: "$$$",
      description:
        "Water views, elevated comfort food, and the default answer to “where should we go tonight?”",
      specialties: ["Short rib", "Crab cakes"],
      createdAt: day(8),
      updatedAt: now,
    },
  ];

  const reviews: Review[] = [
    rev("rest-seed-1", "Pat M.", 5, "Early-bird perfection", "Got seated at 4:10 and felt like a VIP.", true, "Grouper sandwich", day(5)),
    rev("rest-seed-1", "Linda R.", 4, "Solid neighborhood go-to", "Salads are huge. Service is cheerful.", true, undefined, day(4)),
    rev("rest-seed-1", "Tom K.", 5, "Bring the cart gang", "Outdoor tables + sunset = yes.", true, undefined, day(2)),
    rev("rest-seed-2", "Sue B.", 5, "Best pizza near the path", "Garlic knots alone are worth the trip.", true, "Villager supreme", day(6)),
    rev("rest-seed-2", "Mike D.", 4, "Quick and tasty", "Takeout was still hot. Impressive.", true, undefined, day(3)),
    rev("rest-seed-2", "Carol W.", 3, "Good, not transcendent", "Fine for a weeknight pie.", true, undefined, day(1)),
    rev("rest-seed-3", "James P.", 5, "Margarita mission accomplished", "Guac tableside is theater.", true, "Street tacos", day(7)),
    rev("rest-seed-3", "Nancy F.", 4, "Lively patio", "A little loud — in a good way.", true, undefined, day(2)),
    rev("rest-seed-4", "Helen C.", 5, "Sushi surprise", "Didn't expect this quality in-town.", true, "Dragon roll", day(4)),
    rev("rest-seed-4", "Bob A.", 4, "Noodles nailed it", "Pad Thai was properly balanced.", true, "Pad Thai", day(1)),
    rev("rest-seed-5", "Diane S.", 5, "Coastal without the drive", "Oysters were excellent.", true, "Oysters", day(5)),
    rev("rest-seed-5", "Rick T.", 5, "Special occasion spot", "Worth the $$$ for a birthday.", true, undefined, day(3)),
    rev("rest-seed-5", "Anita G.", 4, "Fresh catch energy", "Key lime sealed the deal.", true, undefined, day(1)),
    rev("rest-seed-6", "Greg H.", 5, "Brisket fans assemble", "Smoke ring for days.", true, "Brisket plate", day(4)),
    rev("rest-seed-6", "Paula J.", 4, "Messy in the best way", "Bring napkins. Many napkins.", true, undefined, day(2)),
    rev("rest-seed-7", "Kathy L.", 5, "Breakfast royalty", "Pancakes fluffy as a cloud.", true, "Blueberry pancakes", day(6)),
    rev("rest-seed-7", "Steve N.", 5, "Coffee refills forever", "Staff remembered my order.", true, undefined, day(2)),
    rev("rest-seed-8", "Ellen M.", 5, "Steak night win", "Ribeye cooked exactly right.", true, "Ribeye", day(5)),
    rev("rest-seed-8", "Doug C.", 4, "Pricey but polished", "Service was top-shelf.", true, undefined, day(2)),
    rev("rest-seed-9", "Maria V.", 5, "Fresh and bright", "Hummus is dangerous.", true, "Falafel plate", day(3)),
    rev("rest-seed-9", "Phil O.", 4, "Healthy that still tastes good", "Will be back after golf.", true, undefined, day(1)),
    rev("rest-seed-10", "Joan E.", 5, "Waterfront wow", "Crab cakes + view = anniversary sorted.", true, "Crab cakes", day(4)),
    rev("rest-seed-10", "Walt R.", 4, "Reliable elevated American", "Short rib falls off the bone.", true, "Short rib", day(2)),
    rev("rest-seed-10", "Betty Q.", 5, "Our default date night", "Never disappoints.", true, undefined, day(1)),
  ];

  const interviews: Interview[] = [
    {
      id: "int-seed-1",
      restaurantId: "rest-seed-5",
      personName: "Chef Angela Ruiz",
      role: "Executive Chef",
      title: "How Gulf & Green Sources a “Local” Catch",
      excerpt:
        "On specials boards, supplier relationships, and why grouper night sells out.",
      quote: "If it isn't tasting like the Gulf, it doesn't hit the plate.",
      body: `We run a tight specials board because the fish decides the menu — not the other way around.

Villagers know quality. They'll tell you if the oysters aren't singing. My favorite nights are when someone stops by the pass just to say the grouper reminded them of a trip to Cedar Key.

Retirement dining doesn't mean boring dining. It means we get to cook for people who have time to taste.`,
      publishedAt: day(3),
      featured: true,
    },
    {
      id: "int-seed-2",
      restaurantId: "rest-seed-2",
      personName: "Marco Bellini",
      role: "Owner & Dough Whisperer",
      title: "Cart Path Pizza: Built for the 9 a.m. Lunch Rush",
      excerpt:
        "Why takeout bags matter as much as the pie — and the secret to garlic knots.",
      quote: "If it survives a cart ride home, it's pizza done right.",
      body: `We designed the menu for people in a hurry between pickleball and grandkid pickup.

The dough is overnight. The knots are non-negotiable. And yes, we keep extra napkins by the door because the “I'll just have one slice in the cart” plan never works.`,
      publishedAt: day(6),
      featured: true,
    },
    {
      id: "int-seed-3",
      restaurantId: "rest-seed-7",
      personName: "Dee Patel",
      role: "General Manager",
      title: "Sunrise Skillet: Winning the Early Crowd",
      excerpt:
        "Coffee cadence, regulars by name, and the pancake that started a fan club.",
      quote: "Breakfast is a community sport around here.",
      body: `Our regulars arrive like clockwork. Some want quiet. Some want gossip. Everyone wants coffee that doesn't quit.

The blueberry pancakes weren't supposed to be famous — but try telling that to the table that ordered three stacks “for research.”`,
      publishedAt: day(9),
      featured: false,
    },
  ];

  return { restaurants, reviews, interviews, suggestions: [], updatedAt: now };
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

/** Top 5 for every cuisine that has enough reviews. */
export function allCuisineLeaders(limit = 5, minReviews = 1) {
  return CUISINES.map((cuisine) => ({
    cuisine,
    leaders: topByCuisine(cuisine, limit, minReviews),
  })).filter((block) => block.leaders.length > 0);
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
