export type DiningRefreshChange = {
  name: string;
  fields: string[];
};

export type DiningClosedCandidate = {
  id: string;
  name: string;
  area: string;
  reason: string;
  evidence: string;
};

export type DiningRefreshResult = {
  ok: boolean;
  added: { name: string; area: string; cuisine: string }[];
  updated: DiningRefreshChange[];
  skippedComingSoon: string[];
  closedCandidates: DiningClosedCandidate[];
  sources: string[];
  errors: string[];
  restaurantCount: number;
};
