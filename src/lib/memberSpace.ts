import { readJsonFile, writeJsonFile } from "./dataFs";
import {
  type AnyStoredPlan,
  type FeatureKey,
  type HubPlanId,
  canAccess,
  effectivePlan,
  featuresForPlan,
  getTier,
  isPaidPlan,
  normalizePlan,
} from "./membershipTiers";

const SPACE_FILE = "member-space.json";

/** @deprecated use HubPlanId — kept as alias for imports */
export type HubPlan = HubPlanId;

export type MemberSpaceRecord = {
  memberId: string;
  plan: HubPlanId;
  favoriteClubIds: string[];
  /** Optional display name override */
  spaceTitle?: string;
  updatedAt: string;
  /** Stripe customer / subscription ids when wired */
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  /**
   * Donation badges earned via “Buy me a cup of Joe” tiers
   * (cup_of_joe | fancy_latte | early_bird_brunch | golden_loofah).
   */
  donationBadges?: string[];
  /**
   * @deprecated use donationBadges includes golden_loofah
   * Kept for older records — normalized on read.
   */
  goldenLoofah?: boolean;
  goldenLoofahAt?: string | null;
};

type SpaceFile = {
  spaces: MemberSpaceRecord[];
  updatedAt: string | null;
};

function empty(): SpaceFile {
  return { spaces: [], updatedAt: null };
}

function normalizeDonationBadges(raw: Partial<MemberSpaceRecord>): string[] {
  const set = new Set<string>();
  if (Array.isArray(raw.donationBadges)) {
    for (const id of raw.donationBadges) {
      if (id) set.add(String(id));
    }
  }
  // Legacy field
  if (raw.goldenLoofah) set.add("golden_loofah");
  return [...set];
}

function normalizeRecord(raw: Partial<MemberSpaceRecord> & { plan?: AnyStoredPlan }): MemberSpaceRecord {
  const donationBadges = normalizeDonationBadges(raw);
  return {
    memberId: String(raw.memberId || ""),
    plan: normalizePlan(raw.plan),
    favoriteClubIds: Array.isArray(raw.favoriteClubIds)
      ? raw.favoriteClubIds.map(String)
      : [],
    spaceTitle: raw.spaceTitle,
    updatedAt: raw.updatedAt || new Date().toISOString(),
    stripeCustomerId: raw.stripeCustomerId,
    stripeSubscriptionId: raw.stripeSubscriptionId,
    donationBadges,
    goldenLoofah: donationBadges.includes("golden_loofah"),
    goldenLoofahAt: raw.goldenLoofahAt || null,
  };
}

export function loadMemberSpaces(): SpaceFile {
  const raw = readJsonFile<SpaceFile>(SPACE_FILE);
  if (!raw) return empty();
  return {
    spaces: Array.isArray(raw.spaces)
      ? raw.spaces.map((s) => normalizeRecord(s))
      : [],
    updatedAt: raw.updatedAt || null,
  };
}

export function saveMemberSpaces(data: SpaceFile) {
  data.updatedAt = new Date().toISOString();
  try {
    writeJsonFile(SPACE_FILE, data);
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Could not save member space on this host"
    );
  }
  return data;
}

export function getMemberSpace(memberId: string): MemberSpaceRecord {
  const data = loadMemberSpaces();
  const existing = data.spaces.find((s) => s.memberId === memberId);
  if (existing) return normalizeRecord(existing);
  const created: MemberSpaceRecord = {
    memberId,
    plan: "porch_waver",
    favoriteClubIds: [],
    updatedAt: new Date().toISOString(),
  };
  data.spaces.push(created);
  saveMemberSpaces(data);
  return created;
}

export function updateMemberSpace(
  memberId: string,
  patch: Partial<
    Pick<
      MemberSpaceRecord,
      | "plan"
      | "favoriteClubIds"
      | "spaceTitle"
      | "stripeCustomerId"
      | "stripeSubscriptionId"
      | "donationBadges"
      | "goldenLoofah"
      | "goldenLoofahAt"
    >
  >
): MemberSpaceRecord {
  const data = loadMemberSpaces();
  let rec = data.spaces.find((s) => s.memberId === memberId);
  if (!rec) {
    rec = {
      memberId,
      plan: "porch_waver",
      favoriteClubIds: [],
      donationBadges: [],
      updatedAt: new Date().toISOString(),
    };
    data.spaces.push(rec);
  }
  if (patch.plan) rec.plan = normalizePlan(patch.plan);
  if (patch.favoriteClubIds) {
    rec.favoriteClubIds = [...new Set(patch.favoriteClubIds.map(String))].slice(
      0,
      80
    );
  }
  if (patch.spaceTitle !== undefined) {
    rec.spaceTitle = String(patch.spaceTitle || "").slice(0, 80) || undefined;
  }
  if (patch.stripeCustomerId !== undefined) {
    rec.stripeCustomerId = patch.stripeCustomerId;
  }
  if (patch.stripeSubscriptionId !== undefined) {
    rec.stripeSubscriptionId = patch.stripeSubscriptionId;
  }
  if (patch.donationBadges) {
    rec.donationBadges = [...new Set(patch.donationBadges.map(String))];
    rec.goldenLoofah = rec.donationBadges.includes("golden_loofah");
    if (rec.goldenLoofah && !rec.goldenLoofahAt) {
      rec.goldenLoofahAt = new Date().toISOString();
    }
    if (!rec.goldenLoofah) rec.goldenLoofahAt = null;
  }
  if (patch.goldenLoofah !== undefined) {
    const badges = new Set(
      Array.isArray(rec.donationBadges) ? rec.donationBadges.map(String) : []
    );
    if (patch.goldenLoofah) {
      badges.add("golden_loofah");
      rec.goldenLoofah = true;
      if (!rec.goldenLoofahAt) {
        rec.goldenLoofahAt =
          patch.goldenLoofahAt || new Date().toISOString();
      }
    } else {
      badges.delete("golden_loofah");
      rec.goldenLoofah = false;
      rec.goldenLoofahAt = null;
    }
    rec.donationBadges = [...badges];
  }
  if (patch.goldenLoofahAt !== undefined && rec.goldenLoofah) {
    rec.goldenLoofahAt = patch.goldenLoofahAt;
  }
  rec.updatedAt = new Date().toISOString();
  saveMemberSpaces(data);
  return normalizeRecord(rec);
}

/** Award a donation-tier badge (idempotent; stacks with others). */
export function grantDonationBadge(
  memberId: string,
  badgeId: string
): MemberSpaceRecord {
  const existing = getMemberSpace(memberId);
  const badges = new Set(existing.donationBadges || []);
  if (badges.has(badgeId)) return existing;
  badges.add(badgeId);
  return updateMemberSpace(memberId, {
    donationBadges: [...badges],
    ...(badgeId === "golden_loofah"
      ? { goldenLoofah: true, goldenLoofahAt: new Date().toISOString() }
      : {}),
  });
}

/** Award Golden Loofah (idempotent). */
export function grantGoldenLoofah(memberId: string): MemberSpaceRecord {
  return grantDonationBadge(memberId, "golden_loofah");
}

/** True if plan is Cart Path Regular or higher (legacy “subscriber”). */
export function isSubscriber(space: MemberSpaceRecord): boolean {
  return isPaidPlan(effectivePlan(space.plan));
}

/** Any paid My Space dashboard modules (not just the upgrade wall). */
export function memberHasSpaceAccess(space: MemberSpaceRecord): boolean {
  return isPaidPlan(effectivePlan(space.plan));
}

export function memberCanAccess(
  space: MemberSpaceRecord,
  feature: FeatureKey
): boolean {
  return canAccess(effectivePlan(space.plan), feature);
}

export function publicSpacePayload(space: MemberSpaceRecord) {
  const plan = effectivePlan(space.plan);
  const tier = getTier(plan);
  const features = featuresForPlan(plan);
  return {
    plan,
    planLabel: tier.label,
    planTagline: tier.tagline,
    planRank: tier.rank,
    favoriteClubIds: space.favoriteClubIds,
    spaceTitle: space.spaceTitle,
    updatedAt: space.updatedAt,
    hasSpaceAccess: isPaidPlan(plan),
    isSubscriber: isPaidPlan(plan),
    goldenLoofah: !!space.goldenLoofah,
    goldenLoofahAt: space.goldenLoofahAt || null,
    donationBadges: space.donationBadges || [],
    features,
    tier: {
      id: tier.id,
      label: tier.label,
      shortLabel: tier.shortLabel,
      tagline: tier.tagline,
      blurb: tier.blurb,
    },
  };
}

export { normalizePlan, getTier, paidTiers } from "./membershipTiers";
export type { FeatureKey, HubPlanId } from "./membershipTiers";
