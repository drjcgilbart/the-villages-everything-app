export type VillageNeighbor = {
  id: string;
  villageSlug: string;
  displayName: string;
  /** Optional street or unit hint — keep light for privacy */
  areaNote?: string;
  bio: string;
  interests: string[];
  /** e.g. "Since 2024", "Snowbird" */
  tenure?: string;
  createdAt: string;
  hidden?: boolean;
};

export type VillageNeighborsData = {
  neighbors: VillageNeighbor[];
  updatedAt: string | null;
};
