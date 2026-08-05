import { readJsonFile, writeJsonFile } from "./dataFs";

const SPACE_FILE = "member-space.json";

export type HubPlan = "free" | "subscriber";

export type MemberSpaceRecord = {
  memberId: string;
  plan: HubPlan;
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

export function loadMemberSpaces(): SpaceFile {
  const raw = readJsonFile<SpaceFile>(SPACE_FILE);
  if (!raw) return empty();
  return {
    spaces: Array.isArray(raw.spaces) ? raw.spaces : [],
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
  if (existing) return existing;
  const created: MemberSpaceRecord = {
    memberId,
    plan: "free",
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
      plan: "free",
      favoriteClubIds: [],
      updatedAt: new Date().toISOString(),
    };
    data.spaces.push(rec);
  }
  if (patch.plan) rec.plan = patch.plan;
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
  return rec;
}

export function isSubscriber(space: MemberSpaceRecord): boolean {
  return space.plan === "subscriber";
}

/** Dev / admin convenience: unlock when env allows or plan is subscriber */
export function memberHasSpaceAccess(space: MemberSpaceRecord): boolean {
  if (space.plan === "subscriber") return true;
  if (process.env.HUB_MEMBER_OPEN_ACCESS === "true") return true;
  return false;
}
