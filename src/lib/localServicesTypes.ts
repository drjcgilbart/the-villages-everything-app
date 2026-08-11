/** Client-safe types for service directories (villagers + area pros) */

/** Villager-run neighbor directory (Support Local Villagers) */
export const LOCAL_SERVICE_CATEGORIES = [
  "Home & Handyman",
  "Landscaping & Lawn",
  "Cleaning & Organizing",
  "Golf Cart & Auto",
  "Health & Wellness",
  "Pets",
  "Tech & Computers",
  "Music & Lessons",
  "Arts, Crafts & Makers",
  "Professional Services",
  "Food & Catering",
  "Other",
] as const;

/**
 * Area businesses in & around The Villages — trades people always need.
 * (Not limited to Villager-run shops.)
 */
export const AREA_SERVICE_CATEGORIES = [
  "Electricians",
  "Plumbers",
  "HVAC & Air Conditioning",
  "Landscaping & Lawn Care",
  "Lightning Protection",
  "Aluminum Screens & Enclosures",
  "Pools — Build & Service",
  "Birdcages & Lanai Enclosures",
  "Driveways, Pavers & Staining",
  "Roofing",
  "Painting",
  "Pressure Washing & Window Cleaning",
  "Garage Doors",
  "Irrigation & Sprinklers",
  "Pest Control",
  "Solar Energy",
  "Concrete & Hardscape",
  "Tree Service",
  "Handyman & Remodeling",
  "Flooring",
  "Security Systems",
  "Moving & Hauling",
  "Appliance Repair",
  "Golf Cart Service",
  "Gutter Cleaning & Installation",
  "Fence & Gate",
  "Other",
] as const;

export type LocalServiceScope = "villager" | "area";

export type VillagerServiceCategory = (typeof LOCAL_SERVICE_CATEGORIES)[number];
export type AreaServiceCategory = (typeof AREA_SERVICE_CATEGORIES)[number];
export type LocalServiceCategory = VillagerServiceCategory | AreaServiceCategory;

export type LocalServiceModStatus = "pending" | "approved" | "rejected";

export type LocalServiceStats = {
  reviewCount: number;
  averageRating: number;
};

/** Service listing (pending or live) — villager neighbor OR area pro */
export type LocalServiceListing = {
  id: string;
  /**
   * villager = Support Local Villagers (neighbor-run)
   * area = Local Pros (businesses serving The Villages area)
   * Missing/legacy → treated as villager
   */
  scope?: LocalServiceScope;
  /** Business or display name */
  businessName: string;
  /** Person to ask for */
  contactName: string;
  category: LocalServiceCategory;
  description: string;
  /** Village / area served (optional) */
  village?: string;
  /** City / town for area pros (e.g. Lady Lake, Wildwood) */
  serviceArea?: string;
  /** Street address (public business listing) */
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  /**
   * Optional maps / directory link (e.g. Google Maps place URL from public web).
   * Shown as “Map / reviews” on the card — not scraped privately.
   */
  mapsUrl?: string;
  /**
   * Main photo shown on the card grid (portrait, logo, shop, business card).
   * Prefer this over photoUrls[0] when both exist.
   */
  photoUrl?: string;
  /**
   * Up to 2 extra photos (shown in the detail pop-out with the main photo).
   * Total gallery = main + extras (max 3 images).
   */
  extraPhotos?: string[];
  /** Who filled the form */
  submittedByName: string;
  status: LocalServiceModStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  adminNote?: string;
  /**
   * If this submission updates an existing approved listing,
   * admin approve will replace that listing.
   */
  replacesId?: string;
  /** Present on API payloads when stats are joined */
  stats?: LocalServiceStats;
};

/** 1–5 star community review for a service listing (dining-style). */
export type LocalServiceReview = {
  id: string;
  listingId: string;
  authorName: string;
  /** Hub member id when posted while signed in */
  authorMemberId?: string | null;
  /** 1–5 whole stars */
  rating: number;
  /** Optional short note */
  body?: string;
  createdAt: string;
  hidden?: boolean;
};

/** Snapshot of #1 in each area category — refreshed at most once per calendar day. */
export type LocalProsDailyChampion = {
  category: AreaServiceCategory;
  listingId: string;
  businessName: string;
  contactName: string;
  averageRating: number;
  reviewCount: number;
};

export type LocalProsDailyLeaderboard = {
  /** YYYY-MM-DD (America/New_York preferred) */
  asOf: string;
  updatedAt: string;
  champions: LocalProsDailyChampion[];
};

export type LocalServicesData = {
  listings: LocalServiceListing[];
  reviews?: LocalServiceReview[];
  /** Cached top-of-page champions for Local Pros */
  dailyLeaderboard?: LocalProsDailyLeaderboard | null;
  updatedAt: string | null;
};

/**
 * Whimsical Florida-critter art for each Local Pros trade
 * (under /public/graphics/local-pros).
 */
export const AREA_SERVICE_ART: Record<AreaServiceCategory, string> = {
  Electricians: "/graphics/local-pros/electricians.jpg",
  Plumbers: "/graphics/local-pros/plumbers.jpg",
  "HVAC & Air Conditioning": "/graphics/local-pros/hvac.jpg",
  "Landscaping & Lawn Care": "/graphics/local-pros/landscaping.jpg",
  "Lightning Protection": "/graphics/local-pros/lightning.jpg",
  "Aluminum Screens & Enclosures": "/graphics/local-pros/screens.jpg",
  "Pools — Build & Service": "/graphics/local-pros/pools.jpg",
  "Birdcages & Lanai Enclosures": "/graphics/local-pros/birdcages.jpg",
  "Driveways, Pavers & Staining": "/graphics/local-pros/driveways.jpg",
  Roofing: "/graphics/local-pros/roofing.jpg",
  Painting: "/graphics/local-pros/painting.jpg",
  "Pressure Washing & Window Cleaning": "/graphics/local-pros/pressure-wash.jpg",
  "Garage Doors": "/graphics/local-pros/garage-doors.jpg",
  "Irrigation & Sprinklers": "/graphics/local-pros/irrigation.jpg",
  "Pest Control": "/graphics/local-pros/pest-control.jpg",
  "Solar Energy": "/graphics/local-pros/solar.jpg",
  "Concrete & Hardscape": "/graphics/local-pros/concrete.jpg",
  "Tree Service": "/graphics/local-pros/tree-service.jpg",
  "Handyman & Remodeling": "/graphics/local-pros/handyman.jpg",
  Flooring: "/graphics/local-pros/flooring.jpg",
  "Security Systems": "/graphics/local-pros/security.jpg",
  "Moving & Hauling": "/graphics/local-pros/moving.jpg",
  "Appliance Repair": "/graphics/local-pros/appliance.jpg",
  "Golf Cart Service": "/graphics/local-pros/golf-cart.jpg",
  "Gutter Cleaning & Installation": "/graphics/local-pros/gutters.jpg",
  "Fence & Gate": "/graphics/local-pros/fence.jpg",
  Other: "/graphics/local-pros/other.jpg",
};

export function areaServiceArtPath(category: string): string {
  if ((AREA_SERVICE_CATEGORIES as readonly string[]).includes(category)) {
    return AREA_SERVICE_ART[category as AreaServiceCategory];
  }
  return AREA_SERVICE_ART.Other;
}

/** Filename slug for category art generation */
export function areaServiceArtSlug(category: AreaServiceCategory): string {
  const map: Record<AreaServiceCategory, string> = {
    Electricians: "electricians",
    Plumbers: "plumbers",
    "HVAC & Air Conditioning": "hvac",
    "Landscaping & Lawn Care": "landscaping",
    "Lightning Protection": "lightning",
    "Aluminum Screens & Enclosures": "screens",
    "Pools — Build & Service": "pools",
    "Birdcages & Lanai Enclosures": "birdcages",
    "Driveways, Pavers & Staining": "driveways",
    Roofing: "roofing",
    Painting: "painting",
    "Pressure Washing & Window Cleaning": "pressure-wash",
    "Garage Doors": "garage-doors",
    "Irrigation & Sprinklers": "irrigation",
    "Pest Control": "pest-control",
    "Solar Energy": "solar",
    "Concrete & Hardscape": "concrete",
    "Tree Service": "tree-service",
    "Handyman & Remodeling": "handyman",
    Flooring: "flooring",
    "Security Systems": "security",
    "Moving & Hauling": "moving",
    "Appliance Repair": "appliance",
    "Golf Cart Service": "golf-cart",
    "Gutter Cleaning & Installation": "gutters",
    "Fence & Gate": "fence",
    Other: "other",
  };
  return map[category] || "other";
}

export function listingScope(l: Pick<LocalServiceListing, "scope">): LocalServiceScope {
  return l.scope === "area" ? "area" : "villager";
}

export function categoriesForScope(
  scope: LocalServiceScope
): readonly LocalServiceCategory[] {
  return scope === "area"
    ? AREA_SERVICE_CATEGORIES
    : LOCAL_SERVICE_CATEGORIES;
}

/** Main photo first, then extras — max 3 total. */
export function listingPhotos(l: LocalServiceListing): string[] {
  const main = (l.photoUrl || "").trim();
  const extras = Array.isArray(l.extraPhotos)
    ? l.extraPhotos.map((u) => String(u || "").trim()).filter(Boolean)
    : [];
  const all: string[] = [];
  if (main) all.push(main);
  for (const u of extras) {
    if (!all.includes(u)) all.push(u);
    if (all.length >= 3) break;
  }
  return all;
}

/** Primary image for card thumbnails. */
export function listingMainPhoto(l: LocalServiceListing): string | undefined {
  return listingPhotos(l)[0];
}
