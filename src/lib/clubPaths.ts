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

/** Cute Florida-critter cards (same art family as the old starter-club tiles). */
export const CLUB_CATEGORY_ART: Record<ClubListingCategory, string> = {
  "Sports & Recreation": "/graphics/clubs/pickleball.jpg",
  "Cards & Games": "/graphics/clubs/mah-jongg.jpg",
  "Music & Performance": "/graphics/clubs/karaoke.jpg",
  Dance: "/graphics/clubs/line-dancing.jpg",
  "Arts & Crafts": "/graphics/clubs/quilting.jpg",
  "Fitness & Wellness": "/graphics/clubs/yoga.jpg",
  "Social & Community": "/graphics/clubs/singles.jpg",
  "Books & Writing": "/graphics/clubs/book-clubs.jpg",
  Golf: "/graphics/clubs/golf-social.jpg",
  "Walking & Running": "/graphics/clubs/walking.jpg",
  "Regional & Heritage": "/graphics/clubs/state-clubs.jpg",
  Technology: "/graphics/clubs/technology.jpg",
  "Pets & Animals": "/graphics/clubs/pets.jpg",
  "Volunteering & Service": "/graphics/clubs/volunteer.jpg",
  Other: "/graphics/clubs/singles.jpg",
};

export const CLUB_CATEGORY_BLURB: Record<ClubListingCategory, string> = {
  "Sports & Recreation":
    "Pickleball, bocce, cycling, shuffleboard, and the rest of the outdoor scoreboard.",
  "Cards & Games":
    "Mah-Jongg, bridge, poker, and every table that fills before you sit down.",
  "Music & Performance":
    "Karaoke, ukulele circles, theater, and anyone who brought a mic.",
  Dance: "Line dancing, Zumba, and no-partner-required nights.",
  "Arts & Crafts":
    "Quilting, photography, painting, and show-and-tell energy.",
  "Fitness & Wellness":
    "Yoga, exercise classes, and feeling better without a gym lecture.",
  "Social & Community":
    "Mixers, neighborhood groups, and clubs that exist to say hello.",
  "Books & Writing":
    "Fiction, nonfiction, and writing groups — coffee optional, conversation not.",
  Golf: "Scrambles, social leagues, and tee times that come with friends.",
  "Walking & Running":
    "Morning loops, social miles, and accountability on the cart path.",
  "Regional & Heritage":
    "State clubs, hometown groups, and “we’re from the same place” energy.",
  Technology: "Phones, computers, and “how do I print this?” mutual aid.",
  "Pets & Animals":
    "Dog park regulars, birders, and four-legged icebreakers.",
  "Volunteering & Service":
    "Lions, tutors, veterans groups, and giving back close to home.",
  Other: "Everything that doesn’t sit neatly in another bin.",
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
