import { readJsonFile, writeJsonFile, writeJsonFileAsync } from "./dataFs";
import { isTopTierDonationBadge } from "./donations";
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

export type TopTierNominationStatus = "pending" | "approved" | "rejected";

/** Queued for Square Royalty (1 year) after Golden Loofah / Custom Star Loofah tip. */
export type TopTierNomination = {
  status: TopTierNominationStatus;
  source: string;
  requestedAt: string;
  proposedExpiresAt: string;
  decidedAt?: string | null;
};

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
   * (cup_of_joe | fancy_latte | early_bird_brunch | golden_loofah | custom_star_loofah).
   */
  donationBadges?: string[];
  /**
   * @deprecated use donationBadges includes golden_loofah
   * Kept for older records — normalized on read.
   */
  goldenLoofah?: boolean;
  goldenLoofahAt?: string | null;
  /** When paid plan (e.g. Square Royalty) expires */
  planExpiresAt?: string | null;
  /** Top-tier membership nomination from big tip */
  topTierNomination?: TopTierNomination | null;
  /** One-time Square Royalty free month. Standing `plan` is what they revert to. */
  trial?: RoyaltyTrial | null;
};

export type RoyaltyTrial = {
  startedAt: string;
  expiresAt: string;
  source: string;
};

export const ROYALTY_TRIAL_DAYS = 30;

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

function normalizeTopTier(
  raw: Partial<MemberSpaceRecord>
): TopTierNomination | null {
  const t = raw.topTierNomination;
  if (!t || typeof t !== "object") return null;
  if (!t.status || !t.requestedAt) return null;
  return {
    status: t.status,
    source: String(t.source || "donation"),
    requestedAt: t.requestedAt,
    proposedExpiresAt: t.proposedExpiresAt || t.requestedAt,
    decidedAt: t.decidedAt || null,
  };
}

function normalizeRecord(raw: Partial<MemberSpaceRecord> & { plan?: AnyStoredPlan }): MemberSpaceRecord {
  const donationBadges = normalizeDonationBadges(raw);
  let plan = normalizePlan(raw.plan);
  const planExpiresAt = raw.planExpiresAt || null;
  // Expire Square Royalty (or any timed plan) when past date
  if (
    planExpiresAt &&
    new Date(planExpiresAt).getTime() < Date.now() &&
    plan === "square_royalty"
  ) {
    plan = "porch_waver";
  }
  return {
    memberId: String(raw.memberId || ""),
    plan,
    favoriteClubIds: Array.isArray(raw.favoriteClubIds)
      ? raw.favoriteClubIds.map(String)
      : [],
    spaceTitle: raw.spaceTitle,
    updatedAt: raw.updatedAt || new Date().toISOString(),
    stripeCustomerId: raw.stripeCustomerId,
    stripeSubscriptionId: raw.stripeSubscriptionId,
    donationBadges,
    goldenLoofah:
      donationBadges.includes("golden_loofah") ||
      donationBadges.includes("custom_star_loofah"),
    goldenLoofahAt: raw.goldenLoofahAt || null,
    planExpiresAt,
    topTierNomination: normalizeTopTier(raw),
    trial: normalizeTrial(raw),
  };
}

function normalizeTrial(raw: Partial<MemberSpaceRecord>): RoyaltyTrial | null {
  const t = raw.trial;
  if (!t || typeof t !== "object") return null;
  if (!t.startedAt || !t.expiresAt) return null;
  return {
    startedAt: String(t.startedAt),
    expiresAt: String(t.expiresAt),
    source: String(t.source || "request"),
  };
}

export function isRoyaltyTrialActive(space: MemberSpaceRecord): boolean {
  if (!space.trial?.expiresAt) return false;
  const ends = new Date(space.trial.expiresAt).getTime();
  return Number.isFinite(ends) && ends > Date.now();
}

export function hasUsedRoyaltyTrial(space: MemberSpaceRecord): boolean {
  return Boolean(space.trial?.startedAt);
}

/** Paid or free plan they keep after a trial (or without one). */
export function standingPlan(space: MemberSpaceRecord): HubPlanId {
  let plan = normalizePlan(space.plan);
  if (
    space.planExpiresAt &&
    new Date(space.planExpiresAt).getTime() < Date.now() &&
    plan === "square_royalty" &&
    !space.stripeSubscriptionId
  ) {
    plan = "porch_waver";
  }
  return plan;
}

/** Plan used for feature unlocks — trial Square Royalty overlays the standing plan. */
export function accessPlan(space: MemberSpaceRecord): HubPlanId {
  if (process.env.HUB_MEMBER_OPEN_ACCESS === "true") {
    return "square_royalty";
  }
  if (isRoyaltyTrialActive(space)) return "square_royalty";
  return standingPlan(space);
}

function plusDaysIso(days: number, from = new Date()) {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export function trialAvailable(space: MemberSpaceRecord): boolean {
  if (hasUsedRoyaltyTrial(space)) return false;
  if (isRoyaltyTrialActive(space)) return false;
  if (standingPlan(space) === "square_royalty") return false;
  return true;
}

export function startRoyaltyTrial(
  memberId: string,
  source = "request"
): MemberSpaceRecord {
  const existing = getMemberSpace(memberId);
  if (isRoyaltyTrialActive(existing)) {
    throw new Error("Your free Square Royalty month is already running.");
  }
  if (hasUsedRoyaltyTrial(existing)) {
    throw new Error(
      "You already used the free month. Pick a paid plan to keep the boards, or stay a Porch Waver."
    );
  }
  if (standingPlan(existing) === "square_royalty") {
    throw new Error("You’re already Square Royalty — no trial needed.");
  }
  const now = new Date();
  return updateMemberSpace(memberId, {
    trial: {
      startedAt: now.toISOString(),
      expiresAt: plusDaysIso(ROYALTY_TRIAL_DAYS, now),
      source,
    },
  });
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

/** Prefer in API routes so Vercel Blob finishes before the response. */
export async function saveMemberSpacesAsync(data: SpaceFile) {
  data.updatedAt = new Date().toISOString();
  try {
    await writeJsonFileAsync(SPACE_FILE, data);
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
      | "planExpiresAt"
      | "topTierNomination"
      | "trial"
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
    rec.goldenLoofah =
      rec.donationBadges.includes("golden_loofah") ||
      rec.donationBadges.includes("custom_star_loofah");
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
  if (patch.planExpiresAt !== undefined) {
    rec.planExpiresAt = patch.planExpiresAt;
  }
  if (patch.topTierNomination !== undefined) {
    rec.topTierNomination = patch.topTierNomination;
  }
  if (patch.trial !== undefined) {
    rec.trial = patch.trial;
  }
  rec.updatedAt = new Date().toISOString();
  saveMemberSpaces(data);
  return normalizeRecord(rec);
}

/** Same as updateMemberSpace but awaits durable Blob sync. */
export async function updateMemberSpaceAsync(
  memberId: string,
  patch: Parameters<typeof updateMemberSpace>[1]
): Promise<MemberSpaceRecord> {
  const rec = updateMemberSpace(memberId, patch);
  // Re-save full file async so Blob has the latest (update already wrote sync/memory)
  const data = loadMemberSpaces();
  await saveMemberSpacesAsync(data);
  return rec;
}

function plusOneYearIso(from = new Date()) {
  const d = new Date(from);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

/**
 * Queue Square Royalty (1 year) for admin approval after a top donation badge.
 * Does not auto-upgrade plan — admin must approve in the Admin Portal.
 */
export function nominateTopTierFromDonation(
  memberId: string,
  source: string
): MemberSpaceRecord {
  const existing = getMemberSpace(memberId);
  const nom = existing.topTierNomination;
  // Keep pending/approved as-is; re-open if previously rejected
  if (nom?.status === "pending" || nom?.status === "approved") {
    return existing;
  }
  const now = new Date();
  return updateMemberSpace(memberId, {
    topTierNomination: {
      status: "pending",
      source,
      requestedAt: now.toISOString(),
      proposedExpiresAt: plusOneYearIso(now),
      decidedAt: null,
    },
  });
}

/** Admin: approve 1-year Square Royalty. */
export function approveTopTierMembership(memberId: string): MemberSpaceRecord {
  const now = new Date();
  const expires = plusOneYearIso(now);
  const existing = getMemberSpace(memberId);
  return updateMemberSpace(memberId, {
    plan: "square_royalty",
    planExpiresAt: expires,
    topTierNomination: {
      status: "approved",
      source: existing.topTierNomination?.source || "admin",
      requestedAt:
        existing.topTierNomination?.requestedAt || now.toISOString(),
      proposedExpiresAt: expires,
      decidedAt: now.toISOString(),
    },
  });
}

/** Admin: reject top-tier nomination (plan unchanged). */
export function rejectTopTierMembership(memberId: string): MemberSpaceRecord {
  const existing = getMemberSpace(memberId);
  const now = new Date().toISOString();
  return updateMemberSpace(memberId, {
    topTierNomination: {
      status: "rejected",
      source: existing.topTierNomination?.source || "admin",
      requestedAt: existing.topTierNomination?.requestedAt || now,
      proposedExpiresAt:
        existing.topTierNomination?.proposedExpiresAt || plusOneYearIso(),
      decidedAt: now,
    },
  });
}

/** Award a donation-tier badge (idempotent; stacks with others). */
export function grantDonationBadge(
  memberId: string,
  badgeId: string
): MemberSpaceRecord {
  const existing = getMemberSpace(memberId);
  const badges = new Set(existing.donationBadges || []);
  const already = badges.has(badgeId);
  if (!already) {
    badges.add(badgeId);
    updateMemberSpace(memberId, {
      donationBadges: [...badges],
      ...(badgeId === "golden_loofah" || badgeId === "custom_star_loofah"
        ? { goldenLoofah: true, goldenLoofahAt: new Date().toISOString() }
        : {}),
    });
  }
  // Top donation badges always ensure a pending top-tier nomination exists
  if (isTopTierDonationBadge(badgeId)) {
    return nominateTopTierFromDonation(memberId, badgeId);
  }
  return getMemberSpace(memberId);
}

/** Award Golden Loofah (idempotent). */
export function grantGoldenLoofah(memberId: string): MemberSpaceRecord {
  return grantDonationBadge(memberId, "golden_loofah");
}

/** True if plan is Cart Path Regular or higher (legacy “subscriber”). */
export function isSubscriber(space: MemberSpaceRecord): boolean {
  return isPaidPlan(accessPlan(space));
}

/** Any paid My Space dashboard modules (not just the upgrade wall). */
export function memberHasSpaceAccess(space: MemberSpaceRecord): boolean {
  return isPaidPlan(accessPlan(space));
}

export function memberCanAccess(
  space: MemberSpaceRecord,
  feature: FeatureKey
): boolean {
  return canAccess(accessPlan(space), feature);
}

export function publicSpacePayload(space: MemberSpaceRecord) {
  const plan = accessPlan(space);
  const standing = standingPlan(space);
  const tier = getTier(plan);
  const standingTier = getTier(standing);
  const features = featuresForPlan(plan);
  const trialOn = isRoyaltyTrialActive(space);
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
    planExpiresAt: space.planExpiresAt || null,
    topTierNomination: space.topTierNomination || null,
    trialActive: trialOn,
    trialExpiresAt: trialOn ? space.trial?.expiresAt || null : space.trial?.expiresAt || null,
    trialAvailable: trialAvailable(space),
    standingPlan: standing,
    standingPlanLabel: standingTier.label,
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
