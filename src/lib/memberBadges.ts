import {
  CUSTOM_STAR_LOOFAH,
  DONATION_BADGE_ORDER,
  donationBadgeById,
  donationBadgeDef,
  DONATION_PRESETS,
} from "./donations";
import {
  effectivePlan,
  isPaidPlan,
  normalizePlan,
  type HubPlanId,
} from "./membershipTiers";
import { getMemberSpace } from "./memberSpace";
import { getMemberById, loadYardSale } from "./yardSale";
import type { Member } from "./yardSaleTypes";
import type { BadgeDef } from "./memberBadgeTypes";

export type { BadgeDef } from "./memberBadgeTypes";

/**
 * Golden Loofah — top “Buy me a cup of Joe” donation tier ($25+).
 */
export const GOLDEN_LOOFAH: BadgeDef = donationBadgeDef(
  DONATION_PRESETS.find((p) => p.badgeId === "golden_loofah")!
);

/** Unique paid-membership-tier badges (separate from donation tips). Porch is base — no name badge. */
export const TIER_BADGES: Record<HubPlanId, BadgeDef | null> = {
  porch_waver: null,
  cart_path_regular: {
    id: "cart_path_regular",
    label: "Cart Path Regular",
    title: "Cart Path Regular — knows which gate is which (most days).",
    image: "/graphics/badges/cart-path-regular.jpg",
  },
  lanai_legend: {
    id: "lanai_legend",
    label: "Lanai Legend",
    title: "Lanai Legend — screened-in serenity with a side of spreadsheets.",
    image: "/graphics/badges/lanai-legend.jpg",
  },
  square_royalty: {
    id: "square_royalty",
    label: "Square Royalty",
    title:
      "Square Royalty — metaphorical front row at the square. Parking still chaos.",
    image: "/graphics/badges/square-royalty.jpg",
  },
};

export function badgesForMemberRecord(
  member: Pick<Member, "id" | "status">,
  plan?: string | null
): BadgeDef[] {
  if (member.status === "rejected" || member.status === "suspended") {
    return [];
  }
  const space = getMemberSpace(member.id);
  const spacePlan = plan ?? space.plan;
  const planId = effectivePlan(spacePlan);
  const badges: BadgeDef[] = [];

  // Donation tip badges (cup of joe → golden loofah), display order humble → flashy
  const earned = new Set(space.donationBadges || []);
  if (space.goldenLoofah) earned.add("golden_loofah");
  for (const id of DONATION_BADGE_ORDER) {
    if (earned.has(id)) {
      const def = donationBadgeById(id);
      if (def) badges.push(def);
    }
  }

  if (isPaidPlan(planId)) {
    const tierBadge = TIER_BADGES[normalizePlan(planId)];
    if (tierBadge) badges.push(tierBadge);
  }
  return badges;
}

function normalizePersonName(name: string) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function findMemberByDisplayName(name: string): Member | null {
  const q = normalizePersonName(name);
  if (q.length < 2) return null;
  const members = loadYardSale().members;
  // Exact full-name match first
  const exact = members.find((m) => normalizePersonName(m.name) === q);
  if (exact) return exact;
  // “Jonathan” matches “Jonathan Gilbart” when unique
  const first = members.filter((m) => {
    const n = normalizePersonName(m.name);
    return n === q || n.startsWith(q + " ") || n.endsWith(" " + q);
  });
  if (first.length === 1) return first[0];
  return null;
}

/**
 * Resolve badges for a displayed author name and/or known member id.
 * Includes donation-tier badges and paid membership plan badges.
 */
export function resolveAuthorBadges(opts: {
  memberId?: string | null;
  authorName?: string | null;
}): BadgeDef[] {
  let member: Member | null = null;
  if (opts.memberId) {
    member = getMemberById(opts.memberId);
  }
  if (!member && opts.authorName) {
    member = findMemberByDisplayName(opts.authorName);
  }
  if (!member) return [];
  return badgesForMemberRecord(member);
}

export function allBadgeCatalog(): BadgeDef[] {
  return [
    ...DONATION_PRESETS.map(donationBadgeDef),
    donationBadgeDef(CUSTOM_STAR_LOOFAH),
    TIER_BADGES.cart_path_regular!,
    TIER_BADGES.lanai_legend!,
    TIER_BADGES.square_royalty!,
  ];
}

/** Attach badges to listingWithSeller() result for UI cards. */
export function withSellerBadges<
  T extends {
    seller?: { id?: string; name?: string; village?: string } | null;
  },
>(listing: T): T & {
  seller: (NonNullable<T["seller"]> & { badges: BadgeDef[] }) | null;
} {
  if (!listing.seller) {
    return { ...listing, seller: null };
  }
  const badges = resolveAuthorBadges({
    memberId: listing.seller.id,
    authorName: listing.seller.name,
  });
  return {
    ...listing,
    seller: { ...listing.seller, badges },
  };
}
