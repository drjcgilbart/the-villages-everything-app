/** Client-safe types for Support Local Villagers service directory */

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

export type LocalServiceCategory = (typeof LOCAL_SERVICE_CATEGORIES)[number];

export type LocalServiceModStatus = "pending" | "approved" | "rejected";

/** Neighbor service listing (pending or live) */
export type LocalServiceListing = {
  id: string;
  /** Business or display name */
  businessName: string;
  /** Person to ask for */
  contactName: string;
  category: LocalServiceCategory;
  description: string;
  /** Village / area served (optional) */
  village?: string;
  phone?: string;
  email?: string;
  website?: string;
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
};

export type LocalServicesData = {
  listings: LocalServiceListing[];
  updatedAt: string | null;
};

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
