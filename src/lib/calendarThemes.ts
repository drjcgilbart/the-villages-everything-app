/** Visual themes for the public events calendar — color + art by town square. */

export type CalThemeId =
  | "spanish"
  | "sumter"
  | "brownwood"
  | "eastport"
  | "sawgrass"
  | "mix"
  | "show";

export type CalTheme = {
  id: CalThemeId;
  emoji: string;
  label: string;
  photo: string;
};

const SQUARES: { id: CalThemeId; match: RegExp; emoji: string; label: string; photo: string }[] =
  [
    {
      id: "spanish",
      match: /spanish springs/i,
      emoji: "🎸",
      label: "Spanish Springs",
      photo: "/graphics/town-squares/spanish-springs-v2.jpg",
    },
    {
      id: "sumter",
      match: /lake sumter|sumter landing/i,
      emoji: "⚓",
      label: "Lake Sumter Landing",
      photo: "/graphics/town-squares/lake-sumter-landing-v2.jpg",
    },
    {
      id: "brownwood",
      match: /brownwood/i,
      emoji: "🤠",
      label: "Brownwood",
      photo: "/graphics/town-squares/brownwood-v2.jpg",
    },
    {
      id: "eastport",
      match: /eastport/i,
      emoji: "🌅",
      label: "Eastport",
      photo: "/graphics/town-squares/eastport-v2.jpg",
    },
    {
      id: "sawgrass",
      match: /sawgrass/i,
      emoji: "🌴",
      label: "Sawgrass Grove",
      photo: "/graphics/town-squares/sawgrass-grove-v2.jpg",
    },
  ];

const SHOW: CalTheme = {
  id: "show",
  emoji: "🎵",
  label: "Live show",
  photo: "/graphics/theme-calendar.jpg",
};

const MIX: CalTheme = {
  id: "mix",
  emoji: "🎉",
  label: "Several squares",
  photo: "/graphics/theme-calendar.jpg",
};

export const CAL_THEME_LEGEND: CalTheme[] = [
  ...SQUARES.map(({ id, emoji, label, photo }) => ({ id, emoji, label, photo })),
  MIX,
  SHOW,
];

export function calendarThemeFromText(text: string): CalTheme {
  const hit = SQUARES.find((s) => s.match.test(text));
  return hit
    ? { id: hit.id, emoji: hit.emoji, label: hit.label, photo: hit.photo }
    : SHOW;
}

export function calendarThemeForEvents(
  events: { venue?: string; location?: string; sourceLabel?: string }[]
): CalTheme {
  if (!events.length) return SHOW;
  const themes = events.map((e) =>
    calendarThemeFromText(
      `${e.venue || ""} ${e.location || ""} ${e.sourceLabel || ""}`
    )
  );
  const ids = [...new Set(themes.map((t) => t.id))];
  if (ids.length > 1) return MIX;
  return themes[0];
}
