import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SPACE_PATH = path.join(DATA_DIR, "member-space.json");

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

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function empty(): SpaceFile {
  return { spaces: [], updatedAt: null };
}

export function loadMemberSpaces(): SpaceFile {
  ensure();
  if (!fs.existsSync(SPACE_PATH)) {
    const seed = empty();
    fs.writeFileSync(SPACE_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(SPACE_PATH, "utf8")) as SpaceFile;
    return {
      spaces: Array.isArray(raw.spaces) ? raw.spaces : [],
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return empty();
  }
}

export function saveMemberSpaces(data: SpaceFile) {
  ensure();
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(SPACE_PATH, JSON.stringify(data, null, 2), "utf8");
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
