import type { FeatureKey } from "./membershipTiers";
import { NEWS_PRESETS } from "./newsCatalog";
import { sampleBoards } from "./sampleBoards";

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
  | "portfolio"
  | "weather";

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
  weather: "weather",
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
  { id: "tesla", label: "Tesla", emoji: "⚡" },
  { id: "space", label: "Space travel", emoji: "🚀" },
  { id: "cooking", label: "Cooking", emoji: "🍲" },
  { id: "garden", label: "Gardening", emoji: "🌿" },
  { id: "cars", label: "Classic cars", emoji: "🚗" },
  { id: "tech", label: "Technology", emoji: "💻" },
  { id: "sports", label: "Sports", emoji: "🏈" },
  { id: "grandkids", label: "Family & grandkids", emoji: "👨‍👩‍👧" },
] as const;

export const MAINT_KINDS = [
  { id: "golf-cart", label: "Golf cart", emoji: "⛳", meter: "miles" },
  { id: "car", label: "Car / truck", emoji: "🚗", meter: "miles" },
  { id: "house", label: "House", emoji: "🏠", meter: "" },
  { id: "hvac", label: "A/C / HVAC", emoji: "❄️", meter: "" },
  { id: "appliance", label: "Appliance", emoji: "🔌", meter: "" },
  { id: "pool", label: "Pool / spa", emoji: "🏊", meter: "hours" },
  { id: "generator", label: "Generator", emoji: "⚡", meter: "hours" },
  { id: "other", label: "Other", emoji: "🔧", meter: "miles" },
] as const;

export const RECIPE_CATEGORIES = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "appetizer",
  "drink",
  "other",
] as const;

export type NoteItem = { id: string; text: string; extra?: string; done?: boolean };

export type NewsTopicFollow = {
  id: string;
  presetId: string;
  label: string;
  query: string;
  ticker: string;
  emoji: string;
};
export type NewsPerson = {
  id: string;
  name: string;
  topics: NewsTopicFollow[];
  creators: { id: string; name: string; url: string }[];
  muteWords: string[];
  saved: { id: string; title: string; url: string }[];
  hidden: string[];
};
export type NewsBoard = {
  topics: string[];
  customTopics: string[];
  youtube: { id: string; name: string; url: string }[];
  saved: { id: string; title: string; url: string }[];
  people: NewsPerson[];
  activePersonId: string;
};

export type EntShow = {
  id: string;
  title: string;
  when: string;
  venue: string;
  date: string;
  time: string;
  confirmation: string;
  notes: string;
};
export type EntClub = {
  id: string;
  name: string;
  when: string;
  rec: string;
  location: string;
  kind: string;
  days: string[];
  interval: number;
  time: string;
  extraDates: { date: string; time: string }[];
  notes: string;
};
export type EntWatch = {
  id: string;
  title: string;
  type: string;
  where: string;
  date: string;
  time: string;
  days: string[];
  notes: string;
  done?: boolean;
};
export type EntertainmentBoard = {
  tonightSquare: string;
  tonightNotes: string;
  tonightDate: string;
  watchLater: EntWatch[];
  shows: EntShow[];
  clubs: EntClub[];
  golfFavs: string[];
  pickleFavs: string[];
};

export type FoodFavorite = {
  id: string;
  name: string;
  square: string;
  cuisine: string;
  notes: string;
};
export type FoodHappyHour = {
  id: string;
  place: string;
  square: string;
  days: string[];
  startTime: string;
  endTime: string;
  specials: string;
};
export type FoodGrocery = {
  id: string;
  name: string;
  store: string;
  aisle: string;
  done: boolean;
};
export type FoodCellar = {
  id: string;
  name: string;
  kind: string;
  notes: string;
};
export type FoodRecipe = {
  id: string;
  name: string;
  category: string;
  source: string;
  ingredients: string;
  steps: string;
  notes: string;
  photoName: string;
};
export type FoodBoard = {
  favorites: FoodFavorite[];
  happyHours: FoodHappyHour[];
  grocery: FoodGrocery[];
  groceryStores: string[];
  cellar: FoodCellar[];
  meals: Record<string, { breakfast: string; lunch: string; dinner: string }>;
  recipes: FoodRecipe[];
  tipPct: number;
};

export type GymSet = { weight: number | ""; reps: number | ""; seconds: number | "" };
export type GymLift = { name: string; kind: string; equipment: string; sets: GymSet[] };
export type GymWorkout = {
  id: string;
  date: string;
  time: string;
  gymId: string;
  gymName: string;
  durationMin: number | "";
  felt: string;
  notes: string;
  exercises: GymLift[];
};
export type GymPlace = {
  id: string;
  name: string;
  kind: string;
  chain: string;
  location: string;
  address: string;
  phone: string;
  hours: string;
  membership: string;
  notes: string;
};
export type GymSupplement = {
  id: string;
  name: string;
  dose: string;
  when: string;
  days: string;
  notes: string;
};

export type GymBoard = {
  homeGymId: string;
  gyms: GymPlace[];
  workouts: GymWorkout[];
  supplements: GymSupplement[];
  supplementLogs: { id: string; supplementId: string; name: string; date: string }[];
};

export type MaintAsset = {
  id: string;
  name: string;
  kind: string;
  year: string;
  make: string;
  model: string;
  meter: number | null;
  vendor: string;
  notes: string;
};
export type MaintTask = {
  id: string;
  assetId: string;
  title: string;
  notes: string;
  dueDate: string;
  dueMeter: number | null;
  repeatEvery: number;
  repeatUnit: string;
  repeatEnabled: boolean;
  autoRepeat: boolean;
  alarmEnabled: boolean;
  alarmTime: string;
  remindDays: number;
  done: boolean;
  doneDate: string;
  doneMeter: number | null;
  cost: string;
  doneNotes: string;
};
export type MaintenanceBoard = {
  assets: MaintAsset[];
  tasks: MaintTask[];
  activeAssetId: string;
};

export type MemoryKind = "photo" | "video";
export type MemoryItem = {
  id: string;
  kind: MemoryKind;
  name: string;
  url: string;
  caption: string;
  place: string;
  date: string;
  section: string;
  addedAt: string;
};
export type MemoriesBoard = {
  photos: MemoryItem[];
};

export type GolfPlayerCard = {
  name: string;
  hdcp: string;
  scores: (number | "")[];
};
export type GolfRound = {
  id: string;
  date: string;
  course: string;
  courseId: string;
  holes: 9 | 18;
  scores: (number | "")[];
  par: number[];
  notes: string;
  players: GolfPlayerCard[];
};
export type GolfLookingNote = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  need: string;
  hdcp: string;
  notes: string;
};
export type GolfRegular = { id: string; name: string; hdcp: string; phone: string };
export type GolfLogBoard = {
  rounds: GolfRound[];
  teeTimes: { id: string; date: string; time: string; course: string; notes: string }[];
  looking: GolfLookingNote[];
  regulars: GolfRegular[];
  favoriteCourseIds: string[];
  myName: string;
  myHdcp: string;
};

export type PickleMatch = {
  id: string;
  date: string;
  time: string;
  format: string;
  partner: string;
  opponent: string;
  opp1: string;
  opp2: string;
  score: string;
  court: string;
  courtId: string;
  win: boolean;
  postedDupr: boolean;
  notes: string;
};
export type PicklePerson = {
  id: string;
  name: string;
  notes: string;
  dupr: string;
  kind: string;
  phone: string;
};
export type PickleLookingNote = {
  id: string;
  name: string;
  need: string;
  format: string;
  court: string;
  courtName: string;
  date: string;
  time: string;
  contact: string;
  notes: string;
};
export type PickleLeague = { id: string; name: string; when: string; notes: string };
export type PickleballLogBoard = {
  profile: {
    name: string;
    duprSingles: string;
    duprDoubles: string;
    notes: string;
    phone: string;
    pcvg: string;
  };
  matches: PickleMatch[];
  people: PicklePerson[];
  looking: PickleLookingNote[];
  favoriteCourtIds: string[];
  leagues: PickleLeague[];
};

export type CalTask = {
  id: string;
  title: string;
  notes: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timerMinutes: number | null;
  timerEndsAt: number | null;
  timerPausedMs: number | null;
  alarmEnabled: boolean;
  done: boolean;
};
export type CalendarBoard = { tasks: CalTask[] };

export type FinHolding = {
  id: string;
  kind: string;
  symbol: string;
  shares: number;
  avgCost: number;
  divShare: number;
  divFreq: string;
  exDiv: string;
  payDate: string;
  divGot: number;
};
export type FinAccount = {
  id: string;
  name: string;
  included: boolean;
  holdings: FinHolding[];
};
export type PortfolioBoard = {
  holdings: unknown[];
  accounts: FinAccount[];
  watchlist: string[];
};

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
  calendar: CalendarBoard;
  portfolio: PortfolioBoard;
  weather: Record<string, unknown>;
};

function clip(s: unknown, n: number) {
  return String(s || "").trim().slice(0, n);
}

function safeMemoryUrl(raw: unknown) {
  const u = clip(raw, 220);
  if (!u.startsWith("/api/media/")) return "";
  if (/[\s"'<>\\]/.test(u)) return "";
  return u;
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
  return sampleBoards();
}

function hasKey(obj: object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function jsonBlob(raw: unknown, fallback: Record<string, unknown>): Record<string, unknown> {
  try {
    const s = JSON.stringify(raw && typeof raw === "object" ? raw : fallback);
    if (s.length > 400_000) return fallback;
    const parsed = JSON.parse(s) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback;
    return parsed as Record<string, unknown>;
  } catch {
    return fallback;
  }
}

function sanitizeNews(raw: Partial<NewsBoard> | undefined): NewsBoard {
  const allowed = new Set<string>(NEWS_TOPICS.map((t) => t.id));
  const presetMap = new Map<string, (typeof NEWS_PRESETS)[number]>(
    NEWS_PRESETS.map((t) => [t.id, t])
  );
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
  const customTopics = Array.isArray(raw?.customTopics)
    ? raw!.customTopics.map((t) => clip(t, 40)).filter(Boolean).slice(0, 12)
    : [];
  const youtube = Array.isArray(raw?.youtube)
    ? raw!.youtube
        .map((y) => ({
          id: clip(y?.id, 40) || uid("yt"),
          name: clip(y?.name, 60),
          url: clip(y?.url, 240),
        }))
        .filter((y) => y.name)
        .slice(0, 20)
    : [];
  const followFromLegacy = (): NewsTopicFollow[] => {
    const follows: NewsTopicFollow[] = [];
    for (const id of topics.length ? topics : ["villages"]) {
      const p = presetMap.get(id);
      if (!p) continue;
      follows.push({
        id: uid("top"),
        presetId: p.id,
        label: p.label,
        query: p.query,
        ticker: p.ticker,
        emoji: p.emoji,
      });
    }
    for (const label of customTopics) {
      follows.push({
        id: uid("top"),
        presetId: "",
        label,
        query: label,
        ticker: "",
        emoji: "📌",
      });
    }
    return follows.slice(0, 12);
  };
  const people: NewsPerson[] = Array.isArray(raw?.people)
    ? raw!.people
        .map((p) => {
          const topicsFollow: NewsTopicFollow[] = Array.isArray(p?.topics)
            ? p.topics
                .map((t) => ({
                  id: clip(t?.id, 40) || uid("top"),
                  presetId: clip(t?.presetId, 20),
                  label: clip(t?.label, 60),
                  query: clip(t?.query, 120) || clip(t?.label, 60),
                  ticker: clip(t?.ticker, 8),
                  emoji: clip(t?.emoji, 8),
                }))
                .filter((t) => t.label)
                .slice(0, 12)
            : [];
          return {
            id: clip(p?.id, 40) || uid("who"),
            name: clip(p?.name, 40) || "Me",
            topics: topicsFollow,
            creators: Array.isArray(p?.creators)
              ? p.creators
                  .map((c) => ({
                    id: clip(c?.id, 40) || uid("yt"),
                    name: clip(c?.name, 80),
                    url: clip(c?.url, 240),
                  }))
                  .filter((c) => c.name)
                  .slice(0, 16)
              : [],
            muteWords: Array.isArray(p?.muteWords)
              ? p.muteWords.map((w) => clip(w, 40)).filter(Boolean).slice(0, 20)
              : [],
            saved: Array.isArray(p?.saved)
              ? p.saved
                  .map((s) => ({
                    id: clip(s?.id, 40) || uid("s"),
                    title: clip(s?.title, 80),
                    url: clip(s?.url, 240),
                  }))
                  .filter((s) => s.title)
                  .slice(0, 40)
              : [],
            hidden: Array.isArray(p?.hidden)
              ? p.hidden.map((u) => clip(u, 240)).filter(Boolean).slice(0, 80)
              : [],
          };
        })
        .slice(0, 8)
    : sampleBoards().news.people;
  if (!people.length) {
    people.push({
      id: "me",
      name: "Me",
      topics: followFromLegacy(),
      creators: youtube,
      muteWords: [],
      saved,
      hidden: [],
    });
  }
  const activePersonId = people.some((p) => p.id === clip(raw?.activePersonId, 40))
    ? clip(raw?.activePersonId, 40)
    : people[0].id;
  return {
    topics: topics.length ? topics : ["villages"],
    customTopics,
    youtube,
    saved,
    people,
    activePersonId,
  };
}

function showRows(raw: unknown): EntertainmentBoard["shows"] {
  if (!Array.isArray(raw)) return [];
  const out: EntertainmentBoard["shows"] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const title = clip(r.title || r.text, 160);
    if (!title) continue;
    out.push({
      id: clip(r.id, 40) || uid("sh"),
      title,
      when: clip(r.when || r.extra, 60),
      venue: clip(r.venue, 80),
      date: clip(r.date, 12),
      time: clip(r.time, 8),
      confirmation: clip(r.confirmation, 80),
      notes: clip(r.notes, 400),
    });
  }
  return out;
}

function clubRows(raw: unknown): EntertainmentBoard["clubs"] {
  if (!Array.isArray(raw)) return [];
  const out: EntertainmentBoard["clubs"] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = clip(r.name || r.text, 120);
    if (!name) continue;
    const days = Array.isArray(r.days) ? r.days.map((d) => String(d)).slice(0, 7) : [];
    const extraDates = Array.isArray(r.extraDates)
      ? (r.extraDates as { date?: string; time?: string }[])
          .map((d) => ({ date: clip(d.date, 12), time: clip(d.time, 8) }))
          .filter((d) => d.date)
          .slice(0, 20)
      : [];
    out.push({
      id: clip(r.id, 40) || uid("cl"),
      name,
      when: clip(r.when || r.extra, 60),
      rec: clip(r.rec || r.location, 80),
      location: clip(r.location || r.rec, 80),
      kind: clip(r.kind, 20) || "weekly",
      days,
      interval: Number(r.interval) === 2 ? 2 : 1,
      time: clip(r.time, 8),
      extraDates,
      notes: clip(r.notes, 400),
    });
  }
  return out;
}

function watchRows(raw: unknown): EntertainmentBoard["watchLater"] {
  if (!Array.isArray(raw)) return [];
  const out: EntertainmentBoard["watchLater"] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const title = clip(r.title || r.text, 120);
    if (!title) continue;
    const days = Array.isArray(r.days) ? r.days.map((d) => String(d)).slice(0, 7) : [];
    out.push({
      id: clip(r.id, 40) || uid("wl"),
      title,
      type: clip(r.type, 20) || "movie",
      where: clip(r.where || r.extra, 80),
      date: clip(r.date, 12),
      time: clip(r.time, 8),
      days,
      notes: clip(r.notes, 400),
      done: r.done === true,
    });
  }
  return out;
}

function sanitizeEnt(raw: Partial<EntertainmentBoard> | undefined): EntertainmentBoard {
  const src = raw && typeof raw === "object" ? raw : {};
  const samples = sampleBoards().entertainment;
  return {
    tonightSquare: hasKey(src, "tonightSquare")
      ? clip(src.tonightSquare, 60)
      : samples.tonightSquare,
    tonightNotes: hasKey(src, "tonightNotes")
      ? clip(src.tonightNotes, 400)
      : samples.tonightNotes,
    tonightDate: hasKey(src, "tonightDate")
      ? clip(src.tonightDate, 12)
      : samples.tonightDate,
    watchLater: Array.isArray(src.watchLater)
      ? watchRows(src.watchLater)
      : samples.watchLater,
    shows: Array.isArray(src.shows) ? showRows(src.shows) : samples.shows,
    clubs: Array.isArray(src.clubs) ? clubRows(src.clubs) : samples.clubs,
    golfFavs: Array.isArray(src.golfFavs)
      ? src.golfFavs.map((s) => clip(s, 40)).filter(Boolean).slice(0, 40)
      : samples.golfFavs,
    pickleFavs: Array.isArray(src.pickleFavs)
      ? src.pickleFavs.map((s) => clip(s, 40)).filter(Boolean).slice(0, 40)
      : samples.pickleFavs,
  };
}

function recipeRows(raw: unknown): FoodBoard["recipes"] {
  if (!Array.isArray(raw)) return [];
  const out: FoodBoard["recipes"] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = clip(r.name || r.text, 120);
    if (!name) continue;
    out.push({
      id: clip(r.id, 40) || uid("rc"),
      name,
      category: clip(r.category, 20) || "other",
      source: clip(r.source, 120),
      ingredients: clip(r.ingredients, 4000),
      steps: clip(r.steps, 4000),
      notes: clip(r.notes || r.extra, 2000),
      photoName: clip(r.photoName, 120),
    });
  }
  return out;
}

const FOOD_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function foodFavorites(raw: unknown): FoodFavorite[] {
  if (!Array.isArray(raw)) return [];
  const out: FoodFavorite[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = clip(r.name || r.text, 120);
    if (!name) continue;
    out.push({
      id: clip(r.id, 40) || uid("fv"),
      name,
      square: clip(r.square, 40) || "other",
      cuisine: clip(r.cuisine, 60),
      notes: clip(r.notes || r.extra, 400),
    });
  }
  return out;
}

function foodHappy(raw: unknown): FoodHappyHour[] {
  if (!Array.isArray(raw)) return [];
  const out: FoodHappyHour[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const place = clip(r.place || r.text, 120);
    if (!place) continue;
    const days = Array.isArray(r.days)
      ? r.days.map((d) => String(d)).filter((d) => FOOD_DAYS.includes(d))
      : [];
    out.push({
      id: clip(r.id, 40) || uid("hh"),
      place,
      square: clip(r.square, 40) || "other",
      days,
      startTime: /^\d{2}:\d{2}$/.test(String(r.startTime || "")) ? String(r.startTime) : "15:00",
      endTime: /^\d{2}:\d{2}$/.test(String(r.endTime || "")) ? String(r.endTime) : "18:00",
      specials: clip(r.specials || r.extra, 240),
    });
  }
  return out;
}

function foodGrocery(raw: unknown): FoodGrocery[] {
  if (!Array.isArray(raw)) return [];
  const out: FoodGrocery[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = clip(r.name || r.text, 120);
    if (!name) continue;
    out.push({
      id: clip(r.id, 40) || uid("gr"),
      name,
      store: clip(r.store, 60),
      aisle: clip(r.aisle || r.extra, 40),
      done: r.done === true,
    });
  }
  return out;
}

function foodCellar(raw: unknown): FoodCellar[] {
  if (!Array.isArray(raw)) return [];
  const out: FoodCellar[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = clip(r.name || r.text, 120);
    if (!name) continue;
    out.push({
      id: clip(r.id, 40) || uid("ce"),
      name,
      kind: clip(r.kind, 40) || "wine",
      notes: clip(r.notes || r.extra, 400),
    });
  }
  return out;
}

function mealMap(raw: unknown): FoodBoard["meals"] {
  if (!raw || typeof raw !== "object") return {};
  const out: FoodBoard["meals"] = {};
  for (const [day, val] of Object.entries(raw as Record<string, unknown>).slice(0, 90)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    const v = val && typeof val === "object" ? (val as Record<string, unknown>) : {};
    out[day] = {
      breakfast: clip(v.breakfast, 80),
      lunch: clip(v.lunch, 80),
      dinner: clip(v.dinner, 80),
    };
  }
  return out;
}

function gymWorkouts(raw: unknown): GymWorkout[] {
  if (!Array.isArray(raw)) return [];
  const out: GymWorkout[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    if (typeof r.text === "string" && r.text && !r.exercises) {
      out.push({
        id: clip(r.id, 40) || uid("wo"),
        date: clip(r.date, 12),
        time: clip(r.time, 8),
        gymId: clip(r.gymId, 80),
        gymName: clip(r.extra, 80),
        durationMin: "",
        felt: "",
        notes: clip(r.text, 400),
        exercises: [],
      });
      continue;
    }
    const lifts: GymLift[] = Array.isArray(r.exercises)
      ? (r.exercises as GymLift[])
          .map((l) => ({
            name: clip(l?.name, 80),
            kind: clip(l?.kind, 20) || "machine",
            equipment: clip(l?.equipment, 80),
            sets: Array.isArray(l?.sets)
              ? l.sets.slice(0, 20).map((s) => ({
                  weight: s?.weight ?? "",
                  reps: s?.reps ?? "",
                  seconds: s?.seconds ?? "",
                }))
              : [],
          }))
          .filter((l) => l.name)
      : [];
    out.push({
      id: clip(r.id, 40) || uid("wo"),
      date: clip(r.date, 12),
      time: clip(r.time, 8),
      gymId: clip(r.gymId, 80),
      gymName: clip(r.gymName, 80),
      durationMin: typeof r.durationMin === "number" ? r.durationMin : "",
      felt: clip(r.felt, 20),
      notes: clip(r.notes, 400),
      exercises: lifts,
    });
  }
  return out;
}

function gymSupps(raw: unknown): GymSupplement[] {
  if (!Array.isArray(raw)) return [];
  const out: GymSupplement[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = clip(r.name || r.text, 80);
    if (!name) continue;
    out.push({
      id: clip(r.id, 40) || uid("sup"),
      name,
      dose: clip(r.dose || r.extra, 40),
      when: clip(r.when, 40),
      days: clip(r.days, 40),
      notes: clip(r.notes, 200),
    });
  }
  return out;
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
    case "food": {
      const f = r as Partial<FoodBoard>;
      const samples = sampleBoards().food;
      return {
        favorites: Array.isArray(f.favorites)
          ? foodFavorites(f.favorites)
          : samples.favorites,
        happyHours: Array.isArray(f.happyHours)
          ? foodHappy(f.happyHours)
          : samples.happyHours,
        grocery: Array.isArray(f.grocery) ? foodGrocery(f.grocery) : samples.grocery,
        groceryStores: Array.isArray(f.groceryStores)
          ? f.groceryStores.map((s) => clip(s, 60)).filter(Boolean).slice(0, 20)
          : samples.groceryStores,
        cellar: Array.isArray(f.cellar) ? foodCellar(f.cellar) : samples.cellar,
        meals: hasKey(f, "meals") ? mealMap(f.meals) : samples.meals,
        recipes: Array.isArray(f.recipes) ? recipeRows(f.recipes) : samples.recipes,
        tipPct: Math.min(40, Math.max(0, Number(f.tipPct) || 18)),
      };
    }
    case "gym": {
      const g = r as Partial<GymBoard>;
      const samples = sampleBoards().gym;
      return {
        homeGymId: hasKey(g, "homeGymId") ? clip(g.homeGymId, 80) : samples.homeGymId,
        gyms: Array.isArray(g.gyms)
          ? g.gyms
              .map((p) => ({
                id: clip(p?.id, 40) || uid("gy"),
                name: clip(p?.name, 80),
                kind: clip(p?.kind, 20) || "independent",
                chain: clip(p?.chain, 40),
                location: clip(p?.location, 80),
                address: clip(p?.address, 120),
                phone: clip(p?.phone, 40),
                hours: clip(p?.hours, 120),
                membership: clip(p?.membership, 80),
                notes: clip(p?.notes, 400),
              }))
              .filter((p) => p.name)
              .slice(0, 40)
          : samples.gyms,
        workouts: Array.isArray(g.workouts) ? gymWorkouts(g.workouts) : samples.workouts,
        supplements: Array.isArray(g.supplements)
          ? gymSupps(g.supplements)
          : samples.supplements,
        supplementLogs: Array.isArray(g.supplementLogs)
          ? g.supplementLogs
              .map((l) => ({
                id: clip(l?.id, 40) || uid("sl"),
                supplementId: clip(l?.supplementId, 40),
                name: clip(l?.name, 80),
                date: clip(l?.date, 12),
              }))
              .filter((l) => l.name)
              .slice(0, 120)
          : samples.supplementLogs,
      };
    }
    case "maintenance": {
      const m = r as Partial<MaintenanceBoard> & { jobs?: unknown };
      const numOrNull = (v: unknown) => {
        if (typeof v === "number" && Number.isFinite(v)) return v;
        if (typeof v === "string" && v.trim() !== "") {
          const n = Number(v);
          return Number.isFinite(n) ? n : null;
        }
        return null;
      };
      const samples = sampleBoards().maintenance;
      const assets: MaintAsset[] = Array.isArray(m.assets)
        ? m.assets
            .map((a) => ({
              id: clip(a?.id, 40) || uid("asset"),
              name: clip(a?.name, 80),
              kind: clip(a?.kind, 20) || "other",
              year: clip(a?.year, 8),
              make: clip(a?.make, 60),
              model: clip(a?.model, 60),
              meter: numOrNull(a?.meter),
              vendor: clip(a?.vendor, 80),
              notes: clip(a?.notes, 400),
            }))
            .filter((a) => a.name)
            .slice(0, 40)
        : samples.assets;
      let tasks: MaintTask[] = Array.isArray(m.tasks)
        ? m.tasks
            .map((t) => ({
              id: clip(t?.id, 40) || uid("job"),
              assetId: clip(t?.assetId, 40),
              title: clip(t?.title, 120),
              notes: clip(t?.notes, 800),
              dueDate: clip(t?.dueDate, 12),
              dueMeter: numOrNull(t?.dueMeter),
              repeatEvery: Math.max(1, Number(t?.repeatEvery) || 1),
              repeatUnit: clip(t?.repeatUnit, 12) || "months",
              repeatEnabled: t?.repeatEnabled === true,
              autoRepeat: t?.autoRepeat !== false,
              alarmEnabled: t?.alarmEnabled !== false,
              alarmTime: clip(t?.alarmTime, 8) || "08:00",
              remindDays: Math.max(0, Math.min(90, Number(t?.remindDays) || 7)),
              done: t?.done === true,
              doneDate: clip(t?.doneDate, 12),
              doneMeter: numOrNull(t?.doneMeter),
              cost: clip(t?.cost, 20),
              doneNotes: clip(t?.doneNotes, 400),
            }))
            .filter((t) => t.title)
            .slice(0, 80)
        : [];
      if (!Array.isArray(m.tasks) && Array.isArray(m.jobs) && !tasks.length) {
        tasks = notes(m.jobs).map((n) => ({
          id: n.id,
          assetId: "",
          title: n.text,
          notes: n.extra || "",
          dueDate: "",
          dueMeter: null,
          repeatEvery: 1,
          repeatUnit: "months",
          repeatEnabled: false,
          autoRepeat: true,
          alarmEnabled: false,
          alarmTime: "08:00",
          remindDays: 7,
          done: !!n.done,
          doneDate: "",
          doneMeter: null,
          cost: "",
          doneNotes: "",
        }));
      }
      if (!Array.isArray(m.tasks) && !Array.isArray(m.jobs)) {
        tasks = samples.tasks;
      }
      const activeAssetId = clip(m.activeAssetId, 40);
      return {
        assets,
        tasks,
        activeAssetId: assets.some((a) => a.id === activeAssetId)
          ? activeAssetId
          : assets[0]?.id || "",
      };
    }
    case "memories": {
      const photosRaw = (r as MemoriesBoard).photos;
      if (!Array.isArray(photosRaw)) return { photos: sampleBoards().memories.photos };
      return {
        photos: photosRaw
          .map((p) => {
            const row = p as unknown as Record<string, unknown>;
            const url = safeMemoryUrl(row.url);
            const name = clip(row.name, 80);
            const caption =
              clip(row.caption || row.text, 120) ||
              name ||
              (url ? "Photo" : "");
            if (!caption && !url) return null;
            const kindRaw = clip(row.kind, 12).toLowerCase();
            const kind: MemoryKind =
              kindRaw === "video" || /\.(mp4|mov|webm)$/i.test(name)
                ? "video"
                : "photo";
            return {
              id: clip(row.id, 40) || uid("ph"),
              kind,
              name,
              url,
              caption,
              place: clip(row.place || row.extra, 200),
              date: clip(row.date, 12),
              section: clip(row.section, 40) || "private",
              addedAt: clip(row.addedAt, 24),
            };
          })
          .filter(Boolean)
          .slice(0, MAX_ITEMS) as MemoriesBoard["photos"],
      };
    }
    case "golfLog": {
      const g = r as Partial<GolfLogBoard>;
      const samples = sampleBoards().golfLog;
      const padScores = (raw: unknown, holes: number): (number | "")[] => {
        const scores = Array.isArray(raw) ? (raw as (number | "")[]).slice(0, holes) : [];
        while (scores.length < holes) scores.push("");
        return scores;
      };
      const rounds: GolfRound[] = Array.isArray(g.rounds)
        ? g.rounds
            .map((row) => {
              const rec = row as unknown as Record<string, unknown>;
              const holes = Number(rec.holes) === 18 ? 18 : 9;
              const par = Array.isArray(rec.par) ? (rec.par as number[]).slice(0, holes) : [];
              while (par.length < holes) par.push(3);
              const course =
                clip(rec.course, 80) ||
                (typeof rec.text === "string" ? clip(rec.text, 80) : "");
              if (!course) return null;
              let players: GolfPlayerCard[] = Array.isArray(rec.players)
                ? (rec.players as GolfPlayerCard[])
                    .map((pl) => ({
                      name: clip(pl?.name, 40),
                      hdcp: clip(pl?.hdcp, 8),
                      scores: padScores(pl?.scores, holes),
                    }))
                    .filter((pl) => pl.name || pl.scores.some((s) => s !== ""))
                    .slice(0, 4)
                : [];
              if (!players.length) {
                players = [
                  {
                    name: "Me",
                    hdcp: "",
                    scores: padScores(rec.scores, holes),
                  },
                ];
              }
              return {
                id: clip(rec.id, 40) || uid("rd"),
                date: clip(rec.date, 12),
                course,
                courseId: clip(rec.courseId, 40),
                holes: holes as 9 | 18,
                scores: players[0]?.scores || padScores(rec.scores, holes),
                par,
                notes: clip(rec.notes || rec.extra, 400),
                players,
              };
            })
            .filter(Boolean)
            .slice(0, 80) as GolfRound[]
        : samples.rounds;
      const looking: GolfLookingNote[] = Array.isArray(g.looking)
        ? g.looking
            .map((row) => {
              const rec = row as unknown as Record<string, unknown>;
              const notesText = clip(rec.notes || rec.text || rec.extra, 400);
              return {
                id: clip(rec.id, 40) || uid("lk"),
                name: clip(rec.name, 60),
                phone: clip(rec.phone, 40),
                date: clip(rec.date, 12),
                time: clip(rec.time, 8),
                need: clip(rec.need, 40) || "1 more",
                hdcp: clip(rec.hdcp, 8),
                notes: notesText,
              };
            })
            .filter((x) => x.notes || x.name || x.date)
            .slice(0, 40)
        : samples.looking;
      return {
        rounds,
        teeTimes: Array.isArray(g.teeTimes)
          ? g.teeTimes
              .map((t) => ({
                id: clip(t?.id, 40) || uid("tt"),
                date: clip(t?.date, 12),
                time: clip(t?.time, 8),
                course: clip(t?.course, 80),
                notes: clip(t?.notes, 200),
              }))
              .filter((t) => t.course || t.date)
              .slice(0, 40)
          : samples.teeTimes,
        looking,
        regulars: Array.isArray(g.regulars)
          ? g.regulars
              .map((x) => ({
                id: clip(x?.id, 40) || uid("gr"),
                name: clip(x?.name, 60),
                hdcp: clip(x?.hdcp, 8),
                phone: clip(x?.phone, 40),
              }))
              .filter((x) => x.name)
              .slice(0, 40)
          : samples.regulars,
        favoriteCourseIds: Array.isArray(g.favoriteCourseIds)
          ? g.favoriteCourseIds.map((id) => clip(id, 40)).filter(Boolean).slice(0, 80)
          : samples.favoriteCourseIds,
        myName: hasKey(g, "myName") ? clip(g.myName, 60) : samples.myName,
        myHdcp: hasKey(g, "myHdcp") ? clip(g.myHdcp, 8) : samples.myHdcp,
      };
    }
    case "pickleballLog": {
      const p = r as Partial<PickleballLogBoard> & { matches?: unknown };
      const samples = sampleBoards().pickleballLog;
      const matches: PickleMatch[] = Array.isArray(p.matches)
        ? (p.matches as unknown[])
            .map((row) => {
              const rec = row as Record<string, unknown>;
              const opp1 = clip(rec.opp1 || rec.opponent, 60);
              const opp2 = clip(rec.opp2, 60);
              const score = clip(rec.score, 80);
              return {
                id: clip(rec.id, 40) || uid("pm"),
                date: clip(rec.date, 12),
                time: clip(rec.time, 8),
                format: clip(rec.format, 20) || "doubles",
                partner: clip(rec.partner, 60),
                opponent: opp1,
                opp1,
                opp2,
                score,
                court: clip(rec.court, 80),
                courtId: clip(rec.courtId, 40),
                win: rec.win === true,
                postedDupr: rec.postedDupr === true,
                notes: clip(rec.notes, 400),
              };
            })
            .slice(0, 80)
        : samples.matches;
      const profRaw = hasKey(p, "profile")
        ? p.profile || { name: "", duprSingles: "", duprDoubles: "", notes: "" }
        : samples.profile;
      return {
        profile: {
          name: clip(profRaw.name, 60),
          duprSingles: clip(profRaw.duprSingles, 8),
          duprDoubles: clip(profRaw.duprDoubles, 8),
          notes: clip(profRaw.notes, 400),
          phone: clip((profRaw as { phone?: string }).phone, 40),
          pcvg: clip((profRaw as { pcvg?: string }).pcvg, 20),
        },
        matches,
        people: Array.isArray(p.people)
          ? p.people
              .map((pe) => {
                const rec = pe as unknown as Record<string, unknown>;
                return {
                  id: clip(rec.id, 40) || uid("pp"),
                  name: clip(rec.name, 60),
                  notes: clip(rec.notes, 200),
                  dupr: clip(rec.dupr, 8),
                  kind: clip(rec.kind, 20) || "both",
                  phone: clip(rec.phone, 40),
                };
              })
              .filter((pe) => pe.name)
              .slice(0, 40)
          : samples.people,
        looking: Array.isArray(p.looking)
          ? p.looking
              .map((row) => {
                const rec = row as unknown as Record<string, unknown>;
                const notesText = clip(rec.notes || rec.text || rec.extra, 400);
                return {
                  id: clip(rec.id, 40) || uid("pl"),
                  name: clip(rec.name, 60),
                  need: clip(rec.need, 8) || "1",
                  format: clip(rec.format, 20) || "doubles",
                  court: clip(rec.court, 40),
                  courtName: clip(rec.courtName, 80),
                  date: clip(rec.date, 12),
                  time: clip(rec.time, 8),
                  contact: clip(rec.contact || rec.phone, 80),
                  notes: notesText,
                };
              })
              .filter((x) => x.notes || x.name || x.date)
              .slice(0, 40)
          : samples.looking,
        favoriteCourtIds: Array.isArray(p.favoriteCourtIds)
          ? p.favoriteCourtIds.map((id) => clip(id, 40)).filter(Boolean).slice(0, 80)
          : samples.favoriteCourtIds,
        leagues: Array.isArray(p.leagues)
          ? p.leagues
              .map((l) => ({
                id: clip(l?.id, 40) || uid("lg"),
                name: clip(l?.name, 80),
                when: clip(l?.when, 80),
                notes: clip(l?.notes, 200),
              }))
              .filter((l) => l.name)
              .slice(0, 20)
          : samples.leagues,
      };
    }
    case "health":
      if (!Object.keys(r).length) return sampleBoards().health;
      return jsonBlob(r, {});
    case "weather":
      if (!Object.keys(r).length) return sampleBoards().weather;
      return jsonBlob(r, {});
    case "pets":
      if (!Object.keys(r).length) return sampleBoards().pets;
      return jsonBlob(r, {});
    case "calendar": {
      const blob = jsonBlob(r, {}) as {
        items?: unknown;
        tasks?: unknown;
      };
      if (!Array.isArray(blob.tasks) && !Array.isArray(blob.items)) {
        return sampleBoards().calendar;
      }
      const fromTasks = Array.isArray(blob.tasks) ? blob.tasks : [];
      const fromItems = Array.isArray(blob.items) ? blob.items : [];
      const raw = fromTasks.length ? fromTasks : fromItems;
      const tasks: CalTask[] = [];
      for (const row of raw.slice(0, 80)) {
        if (!row || typeof row !== "object") continue;
        const t = row as Record<string, unknown>;
        const title = clip(t.title || t.text, 200);
        if (!title) continue;
        const timerMin = Number(t.timerMinutes);
        tasks.push({
          id: clip(t.id, 40) || uid("cal"),
          title,
          notes: clip(t.notes || t.when || t.extra, 500),
          startDate: clip(t.startDate || t.date, 12),
          startTime: clip(t.startTime || t.time, 8),
          endDate: clip(t.endDate, 12),
          endTime: clip(t.endTime, 8),
          timerMinutes: Number.isFinite(timerMin) && timerMin > 0 ? Math.min(1440, timerMin) : null,
          timerEndsAt: typeof t.timerEndsAt === "number" ? t.timerEndsAt : null,
          timerPausedMs: typeof t.timerPausedMs === "number" ? t.timerPausedMs : null,
          alarmEnabled: t.alarmEnabled === true,
          done: t.done === true,
        });
      }
      return { tasks };
    }
    case "portfolio": {
      const blob = jsonBlob(r, {}) as {
        holdings?: unknown;
        accounts?: unknown;
        watchlist?: unknown;
      };
      if (
        !Array.isArray(blob.accounts) &&
        !Array.isArray(blob.holdings) &&
        !Array.isArray(blob.watchlist)
      ) {
        return sampleBoards().portfolio;
      }
      const holdings = Array.isArray(blob.holdings) ? blob.holdings.slice(0, 80) : [];
      const num = (v: unknown) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };
      let accounts: FinAccount[] = Array.isArray(blob.accounts)
        ? blob.accounts
            .map((a) => {
              const row = a as Partial<FinAccount>;
              const hs: FinHolding[] = Array.isArray(row.holdings)
                ? row.holdings
                    .map((h) => ({
                      id: clip(h?.id, 40) || uid("fh"),
                      kind: clip(h?.kind, 12) || "stock",
                      symbol: clip(h?.symbol, 16).toUpperCase(),
                      shares: num(h?.shares),
                      avgCost: num(h?.avgCost),
                      divShare: num(h?.divShare),
                      divFreq: clip(h?.divFreq, 16) || "none",
                      exDiv: clip(h?.exDiv, 12),
                      payDate: clip(h?.payDate, 12),
                      divGot: num(h?.divGot),
                    }))
                    .filter((h) => h.symbol || h.kind === "cash")
                    .slice(0, 40)
                : [];
              return {
                id: clip(row.id, 40) || uid("acct"),
                name: clip(row.name, 80) || "Account",
                included: row.included !== false,
                holdings: hs,
              };
            })
            .slice(0, 16)
        : [];
      if (!accounts.length && holdings.length) {
        accounts = [
          {
            id: uid("acct"),
            name: "My portfolio",
            included: true,
            holdings: holdings
              .map((raw) => {
                const h = raw as Record<string, unknown>;
                const symbol = clip(h.ticker || h.symbol, 16).toUpperCase();
                if (!symbol) return null;
                return {
                  id: clip(h.id, 40) || uid("fh"),
                  kind: "stock",
                  symbol,
                  shares: num(h.shares),
                  avgCost: num(h.costBasis ?? h.avgCost),
                  divShare: 0,
                  divFreq: "none",
                  exDiv: "",
                  payDate: "",
                  divGot: 0,
                } satisfies FinHolding;
              })
              .filter((h): h is FinHolding => h != null)
              .slice(0, 40),
          },
        ];
      }
      const watchlist = Array.isArray(blob.watchlist)
        ? blob.watchlist
            .map((s) => clip(s, 16).toUpperCase())
            .filter(Boolean)
            .slice(0, 40)
        : sampleBoards().portfolio.watchlist;
      return { holdings, accounts, watchlist };
    }
  }
}

export function isStoredBoardId(id: string): id is StoredBoardId {
  return id in STORED_BOARD_FEATURE;
}
