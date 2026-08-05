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
};

type SpaceFile = {
  spaces: MemberSpaceRecord[];
  updatedAt: string | null;
};

function empty(): SpaceFile {
  return { spaces: [], updatedAt: null };
}

function normalizeRecord(raw: Partial<MemberSpaceRecord> & { plan?: AnyStoredPlan }): MemberSpaceRecord {
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
  rec.updatedAt = new Date().toISOString();
  saveMemberSpaces(data);
  return normalizeRecord(rec);
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
