import {
  CLUB_LISTING_CATEGORIES,
  type ClubListing,
  type ClubListingCategory,
} from "./clubListingsTypes";

export type ClubListSummary = Pick<
  ClubListing,
  "id" | "name" | "category" | "location" | "membershipStatus"
>;

export const CLUB_CATEGORY_ICONS: Record<ClubListingCategory, string> = {
  "Sports & Recreation": "🏓",
  "Cards & Games": "🃏",
  "Music & Performance": "🎵",
  Dance: "💃",
  "Arts & Crafts": "🎨",
  "Fitness & Wellness": "💪",
  "Social & Community": "☕",
  "Books & Writing": "📚",
  Golf: "⛳",
  "Walking & Running": "🚶",
  "Regional & Heritage": "🗺️",
  Technology: "💻",
  "Pets & Animals": "🐾",
  "Volunteering & Service": "🤝",
  Other: "⭐",
};

export function clubCategorySlug(category: string): string {
  return String(category || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function clubCategoryFromSlug(
  slug: string
): ClubListingCategory | null {
  const s = clubCategorySlug(slug);
  return (
    CLUB_LISTING_CATEGORIES.find((c) => clubCategorySlug(c) === s) || null
  );
}

export function clubCategoryHref(category: string): string {
  return `/club-zone/category/${clubCategorySlug(category)}`;
}

export function clubDetailHref(listing: Pick<ClubListing, "id">): string {
  return `/club-zone/club/${encodeURIComponent(listing.id)}`;
}

export function summarizeClub(l: ClubListing): ClubListSummary {
  return {
    id: l.id,
    name: l.name,
    category: l.category,
    location: l.location,
    membershipStatus: l.membershipStatus,
  };
}
