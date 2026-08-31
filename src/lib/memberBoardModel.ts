import type { FeatureKey } from "./membershipTiers";

const MAX_ITEMS = 60;

export type StoredBoardId =
  | "news"
  | "entertainment"
  | "food"
  | "gym"
  | "maintenance"
  | "memories"
  | "golfLog"
  | "pickleballLog"
  | "health"
  | "pets"
  | "calendar"
  | "portfolio";

export const STORED_BOARD_FEATURE: Record<StoredBoardId, FeatureKey> = {
  news: "newsPrefs",
  entertainment: "entertainmentLog",
  food: "foodLog",
  gym: "gymLog",
  maintenance: "maintenanceLog",
  memories: "memoriesAlbum",
  golfLog: "golfLog",
  pickleballLog: "pickleballLog",
  health: "healthLog",
  pets: "petSchedule",
  calendar: "calendarBoard",
  portfolio: "portfolio",
};

export const NEWS_TOPICS = [
  { id: "villages", label: "The Villages", emoji: "🏡" },
  { id: "florida", label: "Florida", emoji: "🌴" },
  { id: "storms", label: "Storms", emoji: "🌀" },
  { id: "medicare", label: "Medicare", emoji: "💚" },
  { id: "golf", label: "Golf", emoji: "⛳" },
  { id: "pickleball", label: "Pickleball", emoji: "🏓" },
  { id: "markets", label: "Markets", emoji: "📈" },
  { id: "travel", label: "Travel", emoji: "✈️" },
] as const;

export const MAINT_KINDS = [
  { id: "golf-cart", label: "Golf cart", emoji: "⛳" },
  { id: "car", label: "Car", emoji: "🚗" },
  { id: "house", label: "House", emoji: "🏠" },
  { id: "hvac", label: "A/C", emoji: "❄️" },
  { id: "other", label: "Other", emoji: "🔧" },
] as const;

export type NoteItem = { id: string; text: string; extra?: string; done?: boolean };

export type NewsBoard = {
  topics: string[];
  saved: { id: string; title: string; url: string }[];
};

export type EntertainmentBoard = {
  tonightSquare: string;
  tonightNotes: string;
  watchLater: NoteItem[];
  shows: NoteItem[];
};

export type FoodBoard = {
  grocery: NoteItem[];
  recipes: NoteItem[];
  cellar: NoteItem[];
};

export type GymBoard = {
  workouts: NoteItem[];
  supplements: NoteItem[];
};

export type MaintenanceBoard = { jobs: NoteItem[] };
export type MemoriesBoard = { photos: NoteItem[] };
export type GolfLogBoard = { rounds: NoteItem[] };
export type PickleballLogBoard = { matches: NoteItem[] };

export type MemberBoards = {
  news: NewsBoard;
  entertainment: EntertainmentBoard;
  food: FoodBoard;
  gym: GymBoard;
  maintenance: MaintenanceBoard;
  memories: MemoriesBoard;
  golfLog: GolfLogBoard;
  pickleballLog: PickleballLogBoard;
  health: Record<string, unknown>;
  pets: Record<string, unknown>;
  calendar: { items: unknown[] };
  portfolio: { holdings: unknown[] };
};

function clip(s: unknown, n: number) {
  return String(s || "").trim().slice(0, n);
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function notes(raw: unknown, extraMax = 80): NoteItem[] {
  if (!Array.isArray(raw)) return [];
  const out: NoteItem[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as NoteItem;
    const text = clip(r.text, 160);
    if (!text) continue;
    out.push({
      id: clip(r.id, 40) || uid("n"),
      text,
      extra: clip(r.extra, extraMax) || undefined,
      done: r.done === true ? true : undefined,
    });
  }
  return out;
}

export function emptyBoards(): MemberBoards {
  return {
    news: { topics: ["villages"], saved: [] },
    entertainment: {
      tonightSquare: "",
      tonightNotes: "",
      watchLater: [],
      shows: [],
    },
    food: { grocery: [], recipes: [], cellar: [] },
    gym: { workouts: [], supplements: [] },
    maintenance: { jobs: [] },
    memories: { photos: [] },
    golfLog: { rounds: [] },
    pickleballLog: { matches: [] },
    health: {},
    pets: {},
    calendar: { items: [] },
    portfolio: { holdings: [] },
  };
}

function jsonBlob(raw: unknown, fallback: Record<string, unknown>): Record<string, unknown> {
  try {
    const s = JSON.stringify(raw && typeof raw === "object" ? raw : fallback);
    if (s.length > 180_000) return fallback;
    const parsed = JSON.parse(s) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback;
    return parsed as Record<string, unknown>;
  } catch {
    return fallback;
  }
}

function sanitizeNews(raw: Partial<NewsBoard> | undefined): NewsBoard {
  const allowed = new Set<string>(NEWS_TOPICS.map((t) => t.id));
  const topics = Array.isArray(raw?.topics)
    ? raw!.topics.map((t) => String(t)).filter((t) => allowed.has(t)).slice(0, 12)
    : ["villages"];
  const saved = Array.isArray(raw?.saved)
    ? raw!.saved
        .map((s) => ({
          id: clip(s?.id, 40) || uid("s"),
          title: clip(s?.title, 80),
          url: clip(s?.url, 240),
        }))
        .filter((s) => s.title)
        .slice(0, MAX_ITEMS)
    : [];
  return { topics: topics.length ? topics : ["villages"], saved };
}

function sanitizeEnt(raw: Partial<EntertainmentBoard> | undefined): EntertainmentBoard {
  return {
    tonightSquare: clip(raw?.tonightSquare, 60),
    tonightNotes: clip(raw?.tonightNotes, 200),
    watchLater: notes(raw?.watchLater),
    shows: notes(raw?.shows),
  };
}

export function sanitizeBoard(
  id: StoredBoardId,
  raw: unknown
): MemberBoards[StoredBoardId] {
  const r = raw && typeof raw === "object" ? raw : {};
  switch (id) {
    case "news":
      return sanitizeNews(r as Partial<NewsBoard>);
    case "entertainment":
      return sanitizeEnt(r as Partial<EntertainmentBoard>);
    case "food":
      return {
        grocery: notes((r as FoodBoard).grocery),
        recipes: notes((r as FoodBoard).recipes, 240),
        cellar: notes((r as FoodBoard).cellar),
      };
    case "gym":
      return {
        workouts: notes((r as GymBoard).workouts),
        supplements: notes((r as GymBoard).supplements),
      };
    case "maintenance":
      return { jobs: notes((r as MaintenanceBoard).jobs) };
    case "memories":
      return { photos: notes((r as MemoriesBoard).photos, 200) };
    case "golfLog":
      return { rounds: notes((r as GolfLogBoard).rounds) };
    case "pickleballLog":
      return { matches: notes((r as PickleballLogBoard).matches) };
    case "health":
      return jsonBlob(r, {});
    case "pets":
      return jsonBlob(r, {});
    case "calendar": {
      const blob = jsonBlob(r, { items: [] });
      return {
        items: Array.isArray(blob.items) ? blob.items.slice(0, 80) : [],
      };
    }
    case "portfolio": {
      const blob = jsonBlob(r, { holdings: [] });
      return {
        holdings: Array.isArray(blob.holdings) ? blob.holdings.slice(0, 80) : [],
      };
    }
  }
}

export function isStoredBoardId(id: string): id is StoredBoardId {
  return id in STORED_BOARD_FEATURE;
}
