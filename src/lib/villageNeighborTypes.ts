export type NeighborBadge = {
  id: string;
  label: string;
  title: string;
  image: string;
};

export type VillageNeighbor = {
  id: string;
  villageSlug: string;
  displayName: string;
  /** Hub member id when posted while signed in */
  memberId?: string | null;
  /** Optional street or unit hint — keep light for privacy */
  areaNote?: string;
  bio: string;
  interests: string[];
  /** e.g. "Since 2024", "Snowbird" */
  tenure?: string;
  createdAt: string;
  hidden?: boolean;
  /** Resolved at read time for client UI */
  badges?: NeighborBadge[];
};

export type VillageNeighborsData = {
  neighbors: VillageNeighbor[];
  updatedAt: string | null;
};
