/** Neighbor-facing Facebook groups, TeamReach codes, and local tips per village. */

export type VillageLocalKind = "facebook" | "teamreach" | "tip";

export type VillageLocalSource = "curated" | "neighbor";

export type VillageLocalLink = {
  id: string;
  villageSlug: string;
  kind: Exclude<VillageLocalKind, "tip">;
  title: string;
  /** Facebook group URL */
  url?: string;
  /** TeamReach join code — never invent; only store what a neighbor submitted or we verified */
  code?: string;
  note?: string;
  source: VillageLocalSource;
  submittedBy?: string;
  createdAt: string;
  hidden?: boolean;
};

export type VillageLocalTip = {
  id: string;
  villageSlug: string;
  title: string;
  body: string;
  source: VillageLocalSource;
  submittedBy?: string;
  createdAt: string;
  hidden?: boolean;
};

export type VillageLocalData = {
  links: VillageLocalLink[];
  tips: VillageLocalTip[];
  updatedAt: string | null;
};

export type VillageLocalBundle = {
  facebook: VillageLocalLink[];
  teamreach: VillageLocalLink[];
  tips: VillageLocalTip[];
};
