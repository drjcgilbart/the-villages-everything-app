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

/** Always shown for any Hub member account we can identify. */
export const GOLDEN_LOOFAH: BadgeDef = {
  id: "golden_loofah",
  label: "Golden Loofah",
  title:
    "Golden Loofah — official Hub member. Scrubbing the day clean, one cart path at a time.",
  image: "/graphics/badges/golden-loofah.jpg",
};

/** Unique paid-tier badges (Porch Waver keeps only the Golden Loofah). */
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
  // Suspended/rejected still may show loofah lightly? Keep for pending+approved only.
  if (member.status === "rejected" || member.status === "suspended") {
    return [];
  }
  const spacePlan = plan ?? getMemberSpace(member.id).plan;
  const planId = effectivePlan(spacePlan);
  const badges: BadgeDef[] = [GOLDEN_LOOFAH];
  if (isPaidPlan(planId)) {
    const tierBadge = TIER_BADGES[normalizePlan(planId)];
    if (tierBadge) badges.push(tierBadge);
  }
  return badges;
}

export function findMemberByDisplayName(name: string): Member | null {
  const q = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  if (q.length < 2) return null;
  const members = loadYardSale().members;
  return (
    members.find((m) => m.name.trim().toLowerCase().replace(/\s+/g, " ") === q) ||
    null
  );
}

/**
 * Resolve badges for a displayed author name and/or known member id.
 * Golden Loofah always appears for identifiable Hub members.
 * Paid tiers add their unique badge.
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
    GOLDEN_LOOFAH,
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
