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
  { id: "golf-cart", label: "Golf cart", emoji: "⛳", meter: "miles" },
  { id: "car", label: "Car / truck", emoji: "🚗", meter: "miles" },
  { id: "house", label: "House", emoji: "🏠", meter: "" },
  { id: "hvac", label: "A/C / HVAC", emoji: "❄️", meter: "" },
  { id: "appliance", label: "Appliance", emoji: "🔌", meter: "" },
  { id: "pool", label: "Pool / spa", emoji: "🏊", meter: "hours" },
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

export type NewsBoard = {
  topics: string[];
  customTopics: string[];
  youtube: { id: string; name: string; url: string }[];
  saved: { id: string; title: string; url: string }[];
};

export type EntertainmentBoard = {
  tonightSquare: string;
  tonightNotes: string;
  tonightDate: string;
  watchLater: NoteItem[];
  shows: { id: string; title: string; when: string; venue: string; notes: string }[];
  clubs: { id: string; name: string; when: string; rec: string }[];
};

export type FoodBoard = {
  favorites: NoteItem[];
  happyHours: NoteItem[];
  grocery: NoteItem[];
  groceryStores: string[];
  cellar: NoteItem[];
  meals: Record<string, { breakfast: string; lunch: string; dinner: string }>;
  recipes: { id: string; name: string; category: string; notes: string }[];
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
  make: string;
  model: string;
  meter: number | null;
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
  done: boolean;
  alarmEnabled: boolean;
};
export type MaintenanceBoard = { assets: MaintAsset[]; tasks: MaintTask[] };

export type MemoriesBoard = {
  photos: { id: string; caption: string; extra?: string; date: string }[];
};

export type GolfRound = {
  id: string;
  date: string;
  course: string;
  holes: 9 | 18;
  scores: (number | "")[];
  par: number[];
  notes: string;
};
export type GolfLogBoard = {
  rounds: GolfRound[];
  teeTimes: { id: string; date: string; time: string; course: string; notes: string }[];
  looking: NoteItem[];
};

export type PickleMatch = {
  id: string;
  date: string;
  partner: string;
  opponent: string;
  score: string;
  court: string;
  win: boolean;
};
export type PickleballLogBoard = {
  profile: {
    name: string;
    duprSingles: string;
    duprDoubles: string;
    notes: string;
  };
  matches: PickleMatch[];
  people: { id: string; name: string; notes: string }[];
  looking: NoteItem[];
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
    news: { topics: ["villages"], customTopics: [], youtube: [], saved: [] },
    entertainment: {
      tonightSquare: "",
      tonightNotes: "",
      tonightDate: "",
      watchLater: [],
      shows: [],
      clubs: [],
    },
    food: {
      favorites: [],
      happyHours: [],
      grocery: [],
      groceryStores: [],
      cellar: [],
      meals: {},
      recipes: [],
      tipPct: 18,
    },
    gym: {
      homeGymId: "",
      gyms: [],
      workouts: [],
      supplements: [],
      supplementLogs: [],
    },
    maintenance: { assets: [], tasks: [] },
    memories: { photos: [] },
    golfLog: { rounds: [], teeTimes: [], looking: [] },
    pickleballLog: {
      profile: { name: "", duprSingles: "", duprDoubles: "", notes: "" },
      matches: [],
      people: [],
      looking: [],
    },
    health: {},
    pets: {},
    calendar: { items: [] },
    portfolio: { holdings: [] },
  };
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
  return { topics: topics.length ? topics : ["villages"], customTopics, youtube, saved };
}

function showRows(raw: unknown): EntertainmentBoard["shows"] {
  if (!Array.isArray(raw)) return [];
  const out: EntertainmentBoard["shows"] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const title = clip(r.title || r.text, 80);
    if (!title) continue;
    out.push({
      id: clip(r.id, 40) || uid("sh"),
      title,
      when: clip(r.when || r.extra, 60),
      venue: clip(r.venue, 80),
      notes: clip(r.notes, 200),
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
    const name = clip(r.name || r.text, 80);
    if (!name) continue;
    out.push({
      id: clip(r.id, 40) || uid("cl"),
      name,
      when: clip(r.when || r.extra, 60),
      rec: clip(r.rec, 80),
    });
  }
  return out;
}

function sanitizeEnt(raw: Partial<EntertainmentBoard> | undefined): EntertainmentBoard {
  return {
    tonightSquare: clip(raw?.tonightSquare, 60),
    tonightNotes: clip(raw?.tonightNotes, 200),
    tonightDate: clip(raw?.tonightDate, 12),
    watchLater: notes(raw?.watchLater),
    shows: showRows(raw?.shows),
    clubs: clubRows(raw?.clubs),
  };
}

function recipeRows(raw: unknown): FoodBoard["recipes"] {
  if (!Array.isArray(raw)) return [];
  const out: FoodBoard["recipes"] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = clip(r.name || r.text, 80);
    if (!name) continue;
    out.push({
      id: clip(r.id, 40) || uid("rc"),
      name,
      category: clip(r.category, 20) || "other",
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
      const f = r as Partial<FoodBoard> & { recipes?: unknown };
      const recs = recipeRows(f.recipes);
      const oldRecipes = !recs.length ? notes((f as { recipes?: unknown }).recipes, 240) : [];
      return {
        favorites: notes(f.favorites),
        happyHours: notes(f.happyHours),
        grocery: notes(f.grocery),
        groceryStores: Array.isArray(f.groceryStores)
          ? f.groceryStores.map((s) => clip(s, 60)).filter(Boolean).slice(0, 20)
          : [],
        cellar: notes(f.cellar),
        meals: mealMap(f.meals),
        recipes: recs.length
          ? recs
          : oldRecipes.map((n) => ({
              id: n.id,
              name: n.text,
              category: "other",
              notes: n.extra || "",
            })),
        tipPct: Math.min(40, Math.max(0, Number(f.tipPct) || 18)),
      };
    }
    case "gym": {
      const g = r as Partial<GymBoard>;
      return {
        homeGymId: clip(g.homeGymId, 80),
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
          : [],
        workouts: gymWorkouts(g.workouts),
        supplements: gymSupps(g.supplements),
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
          : [],
      };
    }
    case "maintenance": {
      const m = r as Partial<MaintenanceBoard> & { jobs?: unknown };
      const assets: MaintAsset[] = Array.isArray(m.assets)
        ? m.assets
            .map((a) => ({
              id: clip(a?.id, 40) || uid("asset"),
              name: clip(a?.name, 80),
              kind: clip(a?.kind, 20) || "other",
              make: clip(a?.make, 60),
              model: clip(a?.model, 60),
              meter: typeof a?.meter === "number" ? a.meter : null,
              notes: clip(a?.notes, 400),
            }))
            .filter((a) => a.name)
            .slice(0, 40)
        : [];
      let tasks: MaintTask[] = Array.isArray(m.tasks)
        ? m.tasks
            .map((t) => ({
              id: clip(t?.id, 40) || uid("job"),
              assetId: clip(t?.assetId, 40),
              title: clip(t?.title, 120),
              notes: clip(t?.notes, 400),
              dueDate: clip(t?.dueDate, 12),
              dueMeter: typeof t?.dueMeter === "number" ? t.dueMeter : null,
              repeatEvery: Math.max(1, Number(t?.repeatEvery) || 1),
              repeatUnit: clip(t?.repeatUnit, 12) || "months",
              done: t?.done === true,
              alarmEnabled: t?.alarmEnabled === true,
            }))
            .filter((t) => t.title)
            .slice(0, 80)
        : [];
      if (!tasks.length) {
        tasks = notes(m.jobs).map((n) => ({
          id: n.id,
          assetId: "",
          title: n.text,
          notes: n.extra || "",
          dueDate: "",
          dueMeter: null,
          repeatEvery: 1,
          repeatUnit: "months",
          done: !!n.done,
          alarmEnabled: false,
        }));
      }
      return { assets, tasks };
    }
    case "memories": {
      const photosRaw = (r as MemoriesBoard).photos;
      if (!Array.isArray(photosRaw)) return { photos: [] };
      return {
        photos: photosRaw
          .map((p) => {
            const row = p as unknown as Record<string, unknown>;
            const caption = clip(row.caption || row.text, 120);
            if (!caption) return null;
            return {
              id: clip(row.id, 40) || uid("ph"),
              caption,
              extra: clip(row.extra, 200) || undefined,
              date: clip(row.date, 12),
            };
          })
          .filter(Boolean)
          .slice(0, MAX_ITEMS) as MemoriesBoard["photos"],
      };
    }
    case "golfLog": {
      const g = r as Partial<GolfLogBoard>;
      const rounds: GolfRound[] = Array.isArray(g.rounds)
        ? g.rounds
            .map((row) => {
              const rec = row as unknown as Record<string, unknown>;
              if (typeof rec.text === "string" && rec.text && !rec.course) {
                return {
                  id: clip(rec.id, 40) || uid("rd"),
                  date: clip(rec.date, 12),
                  course: clip(rec.text, 80),
                  holes: 9 as const,
                  scores: Array(9).fill("") as (number | "")[],
                  par: Array(9).fill(3),
                  notes: clip(rec.extra, 200),
                };
              }
              const holes = Number(rec.holes) === 18 ? 18 : 9;
              const scores = Array.isArray(rec.scores)
                ? (rec.scores as (number | "")[]).slice(0, holes)
                : [];
              while (scores.length < holes) scores.push("");
              const par = Array.isArray(rec.par)
                ? (rec.par as number[]).slice(0, holes)
                : [];
              while (par.length < holes) par.push(3);
              const course = clip(rec.course, 80);
              if (!course) return null;
              return {
                id: clip(rec.id, 40) || uid("rd"),
                date: clip(rec.date, 12),
                course,
                holes: holes as 9 | 18,
                scores,
                par,
                notes: clip(rec.notes, 200),
              };
            })
            .filter(Boolean)
            .slice(0, 80) as GolfRound[]
        : [];
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
          : [],
        looking: notes(g.looking),
      };
    }
    case "pickleballLog": {
      const p = r as Partial<PickleballLogBoard> & { matches?: unknown };
      const matches: PickleMatch[] = Array.isArray(p.matches)
        ? (p.matches as unknown[])
            .map((row) => {
              const rec = row as Record<string, unknown>;
              if (typeof rec.text === "string" && rec.text && rec.score == null && rec.opponent == null) {
                return {
                  id: clip(rec.id, 40) || uid("pm"),
                  date: clip(rec.date, 12),
                  partner: "",
                  opponent: "",
                  score: clip(rec.extra, 40),
                  court: clip(rec.text, 80),
                  win: false,
                };
              }
              return {
                id: clip(rec.id, 40) || uid("pm"),
                date: clip(rec.date, 12),
                partner: clip(rec.partner, 60),
                opponent: clip(rec.opponent, 80),
                score: clip(rec.score, 40),
                court: clip(rec.court, 80),
                win: rec.win === true,
              };
            })
            .slice(0, 80)
        : [];
      const prof = p.profile || { name: "", duprSingles: "", duprDoubles: "", notes: "" };
      return {
        profile: {
          name: clip(prof.name, 60),
          duprSingles: clip(prof.duprSingles, 8),
          duprDoubles: clip(prof.duprDoubles, 8),
          notes: clip(prof.notes, 400),
        },
        matches,
        people: Array.isArray(p.people)
          ? p.people
              .map((pe) => ({
                id: clip(pe?.id, 40) || uid("pp"),
                name: clip(pe?.name, 60),
                notes: clip(pe?.notes, 200),
              }))
              .filter((pe) => pe.name)
              .slice(0, 40)
          : [],
        looking: notes(p.looking),
      };
    }
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
