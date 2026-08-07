/**
 * Town Square free nightly entertainment — hours + lineup helpers.
 *
 * **Client-safe** (no Node `fs`). Live schedule loading lives in
 * `entertainmentFetch.ts` (server only). Pass `lineup` from the server when
 * you have auto-refreshed data; otherwise seed CURATED_LINEUP is used.
 *
 * **Not affiliated** with The Villages® operators.
 */

export const OFFICIAL_NIGHTLY_ENTERTAINMENT_URL =
  "https://www.thevillagesentertainment.com/nightly-entertainment/";

export const OFFICIAL_SUMMER_HOURS_URL =
  "https://www.thevillagesentertainment.com/entertainment-summer-hours/";

export type SquareId =
  | "spanish-springs"
  | "lake-sumter"
  | "brownwood"
  | "eastport"
  | "sawgrass-grove";

export type SquareShowHours = {
  /** e.g. "6:00 PM" */
  start: string;
  /** e.g. "10:00 PM" */
  end: string;
  /** Short label for UI */
  label: string;
  note?: string;
};

export type SquareAct = {
  name: string;
  /** Optional short vibe line */
  blurb?: string;
  /** If set, overrides default square hours for this act only */
  start?: string;
  end?: string;
};

/** One night at one square (may include midday + evening acts). */
export type SquareNightLineup = {
  /** YYYY-MM-DD (Florida calendar day) */
  date: string;
  squareId: SquareId;
  acts: SquareAct[];
  /** Optional official event deep link */
  officialUrl?: string;
};

export const SQUARE_ENTERTAINMENT_META: Record<
  SquareId,
  {
    shortName: string;
    entertainmentUrl: string;
    stageNote: string;
  }
> = {
  "spanish-springs": {
    shortName: "Spanish Springs",
    entertainmentUrl:
      "https://www.thevillagesentertainment.com/spanish-springs/",
    stageNote: "Main outdoor stage · free nightly music most evenings",
  },
  "lake-sumter": {
    shortName: "Lake Sumter Landing",
    entertainmentUrl: "https://www.thevillagesentertainment.com/",
    stageNote: "Waterfront market square stage · free nightly music most evenings",
  },
  brownwood: {
    shortName: "Brownwood",
    entertainmentUrl: "https://www.thevillagesentertainment.com/",
    stageNote: "Paddock Square stage · free nightly music & dancing most evenings",
  },
  eastport: {
    shortName: "Eastport",
    entertainmentUrl: "https://www.thevillagesentertainment.com/",
    stageNote: "Growth-edge square stage · free entertainment most evenings",
  },
  "sawgrass-grove": {
    shortName: "Sawgrass Grove",
    entertainmentUrl: "https://www.thevillagesentertainment.com/",
    stageNote:
      "Depot gathering spot · often midday + evening sets (check the day)",
  },
};

/**
 * Standard nightly window.
 * Summer 2026 (Jun 1 – Sep 30): 6:00 PM – 10:00 PM
 * Other months: typically 5:00 PM – 9:00 PM
 * Always confirm on official entertainment site.
 */
export function defaultNightHoursForDate(date: Date): SquareShowHours {
  const m = date.getMonth() + 1; // 1–12
  const d = date.getDate();
  const isSummer =
    (m > 6 && m < 9) ||
    (m === 6 && d >= 1) ||
    (m === 9 && d <= 30);

  if (isSummer) {
    return {
      start: "6:00 PM",
      end: "10:00 PM",
      label: "6:00 PM – 10:00 PM",
      note: "Summer hours (Jun 1 – Sep 30) · subject to change",
    };
  }
  return {
    start: "5:00 PM",
    end: "9:00 PM",
    label: "5:00 PM – 9:00 PM",
    note: "Standard season hours · subject to change",
  };
}

/** Florida (America/New_York) calendar date as YYYY-MM-DD. */
export function floridaDateKey(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function parseDateKey(key: string): Date {
  const [y, m, day] = key.split("-").map(Number);
  return new Date(y, m - 1, day);
}

export function formatFriendlyDate(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Seed / offline fallback when no auto-refreshed schedule is available.
 * Server code should pass live nights from entertainmentFetch when possible.
 */
export const CURATED_LINEUP: SquareNightLineup[] = [
  // —— Fri Aug 7, 2026 ——
  {
    date: "2026-08-07",
    squareId: "spanish-springs",
    acts: [
      {
        name: "Jerico",
        blurb: "Southern-leaning rock spanning the last six decades.",
      },
    ],
  },
  {
    date: "2026-08-07",
    squareId: "lake-sumter",
    acts: [
      {
        name: "The 789s",
        blurb: "Rock, disco, and pop hits with full-band energy.",
      },
    ],
  },
  {
    date: "2026-08-07",
    squareId: "brownwood",
    acts: [
      {
        name: "CLUB CTRL Feat. DJ Lu-S",
        blurb: "Club-mode DJ set — beats, lights, dance floor.",
      },
    ],
  },
  {
    date: "2026-08-07",
    squareId: "sawgrass-grove",
    acts: [
      {
        name: "Scooter The DJ",
        blurb: "Popular dances & audience participation.",
      },
    ],
  },
  {
    date: "2026-08-07",
    squareId: "eastport",
    acts: [
      {
        name: "The Voodoo Gypsies",
        blurb: "Classic rock hits from the ’60s–’80s.",
      },
    ],
  },
  // —— Sat Aug 8, 2026 ——
  {
    date: "2026-08-08",
    squareId: "spanish-springs",
    acts: [
      {
        name: "The Fire Rhythms Band",
        blurb: "Caribbean heat, funk, rock, and Top 40 dance party.",
      },
    ],
  },
  {
    date: "2026-08-08",
    squareId: "lake-sumter",
    acts: [
      {
        name: "Bourbon Street Brass",
        blurb: "New Orleans brass, jazz, and good-time party music.",
      },
    ],
  },
  {
    date: "2026-08-08",
    squareId: "brownwood",
    acts: [
      {
        name: "Cable Cars",
        blurb: "Dynamic cover band — decades past and today.",
      },
    ],
  },
  {
    date: "2026-08-08",
    squareId: "eastport",
    acts: [
      {
        name: "Rocky and The Rollers",
        blurb: "Villages favorite — high-energy music from all eras.",
      },
    ],
  },
  {
    date: "2026-08-08",
    squareId: "sawgrass-grove",
    acts: [
      {
        name: "Greg Warren Trio",
        blurb: "High-energy country, classic rock & dance.",
        start: "12:00 PM",
        end: "3:00 PM",
      },
      {
        name: "Radlin’ Rootz",
        blurb: "Eclectic covers & originals from Ocala musicians.",
        start: "6:00 PM",
        end: "10:00 PM",
      },
    ],
  },
  // —— Sun Aug 9, 2026 ——
  {
    date: "2026-08-09",
    squareId: "spanish-springs",
    acts: [
      {
        name: "Osaka Fall",
        blurb: "Rare jams, glam rock, funk, pop, and soul.",
      },
    ],
  },
  {
    date: "2026-08-09",
    squareId: "lake-sumter",
    acts: [
      {
        name: "Pavani’s Band",
        blurb: "Raw talent & timeless ’70s–’80s hits.",
      },
    ],
  },
  {
    date: "2026-08-09",
    squareId: "brownwood",
    acts: [
      {
        name: "September Dogs",
        blurb: "Female-fronted band with layered vocals & energy.",
      },
    ],
  },
  {
    date: "2026-08-09",
    squareId: "sawgrass-grove",
    acts: [
      {
        name: "Anita Drink Band",
        blurb: "Rock ’n’ roll, country, blues, and originals.",
      },
    ],
  },
  {
    date: "2026-08-09",
    squareId: "eastport",
    acts: [
      {
        name: "Greg Warren Band",
        blurb: "Country, classic rock, and dance-all-night energy.",
      },
    ],
  },
  // —— Spanish Springs week ahead (from SS page) ——
  {
    date: "2026-08-10",
    squareId: "spanish-springs",
    acts: [{ name: "MPIRE", blurb: "Tight variety from the ’60s through today." }],
  },
  {
    date: "2026-08-11",
    squareId: "spanish-springs",
    acts: [
      {
        name: "The Dave Capp Project",
        blurb: "Rock, pop, blues, Motown & R&B.",
      },
    ],
  },
  {
    date: "2026-08-12",
    squareId: "spanish-springs",
    acts: [{ name: "Justin Heet Band", blurb: "Full-throttle rock party band." }],
  },
  {
    date: "2026-08-13",
    squareId: "spanish-springs",
    acts: [
      {
        name: "Billy Buchanan & His Rock N’ Soul Revue",
        blurb: "Soul, early rock, and blues.",
      },
    ],
  },
  {
    date: "2026-08-14",
    squareId: "spanish-springs",
    acts: [
      {
        name: "Zee-R Band",
        blurb: "Family-friendly classic hits from all eras.",
      },
    ],
  },
  {
    date: "2026-08-15",
    squareId: "spanish-springs",
    acts: [
      {
        name: "Rocky and The Rollers",
        blurb: "27 years in The Villages — high-energy crowd favorite.",
      },
    ],
  },
  {
    date: "2026-08-16",
    squareId: "spanish-springs",
    acts: [
      {
        name: "Sheila & The Sound",
        blurb: "From Aretha to Journey — retro dance-floor power.",
      },
    ],
  },
];

export type SquareDaySchedule = {
  squareId: SquareId;
  shortName: string;
  date: string;
  friendlyDate: string;
  hours: SquareShowHours;
  acts: SquareAct[];
  hasCuratedActs: boolean;
  entertainmentUrl: string;
  stageNote: string;
};

export function getLineupForSquareDate(
  squareId: SquareId,
  dateKey: string,
  lineup: SquareNightLineup[] = CURATED_LINEUP
): SquareNightLineup | undefined {
  return lineup.find((n) => n.squareId === squareId && n.date === dateKey);
}

export function getSquareDaySchedule(
  squareId: SquareId,
  dateKey = floridaDateKey(),
  lineup: SquareNightLineup[] = CURATED_LINEUP
): SquareDaySchedule {
  const meta = SQUARE_ENTERTAINMENT_META[squareId];
  const hours = defaultNightHoursForDate(parseDateKey(dateKey));
  const night = getLineupForSquareDate(squareId, dateKey, lineup);
  return {
    squareId,
    shortName: meta.shortName,
    date: dateKey,
    friendlyDate: formatFriendlyDate(dateKey),
    hours,
    acts: night?.acts ?? [],
    hasCuratedActs: Boolean(night?.acts?.length),
    entertainmentUrl: meta.entertainmentUrl,
    stageNote: meta.stageNote,
  };
}

export function getAllSquaresTonight(
  dateKey = floridaDateKey(),
  lineup: SquareNightLineup[] = CURATED_LINEUP
): SquareDaySchedule[] {
  const order: SquareId[] = [
    "spanish-springs",
    "lake-sumter",
    "brownwood",
    "eastport",
    "sawgrass-grove",
  ];
  return order.map((id) => getSquareDaySchedule(id, dateKey, lineup));
}

/** Next N days of schedules for one square (curated nights + today). */
export function getUpcomingForSquare(
  squareId: SquareId,
  days = 14,
  fromKey = floridaDateKey(),
  lineup: SquareNightLineup[] = CURATED_LINEUP
): SquareDaySchedule[] {
  const from = parseDateKey(fromKey);
  const out: SquareDaySchedule[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const localKey = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
    out.push(getSquareDaySchedule(squareId, localKey, lineup));
  }
  return out;
}

export function actTimeLabel(
  act: SquareAct,
  fallback: SquareShowHours
): string {
  if (act.start && act.end) return `${act.start} – ${act.end}`;
  if (act.start) return `from ${act.start}`;
  return fallback.label;
}
