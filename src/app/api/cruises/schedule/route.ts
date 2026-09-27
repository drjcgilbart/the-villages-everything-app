export const revalidate = 3600;

const PAGE = "https://www.portcanaveral.com/cruise/cruise-ship-schedule";

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

type Sailing = {
  line: string;
  ship: string;
  terminal: string;
  arrival: string;
  departure: string;
  departureKey: string;
  departureTime: string;
  type: string;
};

function easternKey(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDays(key: string, days: number) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function plain(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleShip(name: string) {
  const small = new Set(["of", "the", "and"]);
  return name
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) =>
      index > 0 && small.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function lineFor(ship: string, listed: string) {
  const name = ship.toUpperCase();
  if (name.startsWith("DISNEY")) return "Disney Cruise Line";
  if (name.startsWith("CARNIVAL")) return "Carnival";
  if (name.startsWith("MSC")) return "MSC Cruises";
  if (name.startsWith("NORWEGIAN")) return "Norwegian";
  if (name.includes("PRINCESS")) return "Princess";
  if (name.startsWith("CELEBRITY")) return "Celebrity";
  if (name.startsWith("MEIN SCHIFF")) return "TUI Cruises";
  if (name.startsWith("AIDA")) return "AIDA";
  if (
    name.includes("OF THE SEAS") ||
    name.startsWith("ICON ") ||
    name.startsWith("UTOPIA") ||
    name.startsWith("OASIS") ||
    name.startsWith("ALLURE") ||
    name.startsWith("HARMONY") ||
    name.startsWith("SYMPHONY") ||
    name.startsWith("WONDER OF") ||
    name.startsWith("ADVENTURE") ||
    name.startsWith("MARINER") ||
    name.startsWith("EXPLORER OF") ||
    name.startsWith("VOYAGER") ||
    name.startsWith("FREEDOM OF") ||
    name.startsWith("LIBERTY OF") ||
    name.startsWith("INDEPENDENCE OF") ||
    name.startsWith("BRILLIANCE") ||
    name.startsWith("RADIANCE") ||
    name.startsWith("SERENADE") ||
    name.startsWith("VISION ")
  ) {
    return "Royal Caribbean";
  }
  return listed.replace(/\s+/g, " ").trim() || "Cruise line";
}

function parseWhen(text: string) {
  const match = text.match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!match) return null;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return null;
  const key = `${match[3]}-${String(month).padStart(2, "0")}-${String(Number(match[2])).padStart(2, "0")}`;
  const time = match[4] ? `${match[4].padStart(2, "0")}:${match[5]}` : "";
  return { key, time };
}

function parseSailings(html: string): Sailing[] {
  const rows = html.match(/<tr class="[^"]*"[\s\S]*?<\/tr>/g) || [];
  const sailings: Sailing[] = [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((cell) => plain(cell[1]));
    if (cells.length < 6) continue;
    const [listed, shipRaw, terminal, arrival, departure, type] = cells;
    if (!/home port/i.test(type)) continue;
    const when = parseWhen(departure);
    if (!when || !shipRaw) continue;
    sailings.push({
      line: lineFor(shipRaw, listed),
      ship: titleShip(shipRaw),
      terminal: terminal || "Terminal on your documents",
      arrival,
      departure,
      departureKey: when.key,
      departureTime: when.time,
      type: "Home port",
    });
  }
  return sailings;
}

export async function GET() {
  try {
    const page = await fetch(PAGE, {
      headers: { "User-Agent": "the-villages-everything-app", Accept: "text/html" },
      next: { revalidate: 3600 },
    });
    if (!page.ok) throw new Error(`port page ${page.status}`);
    const pageHtml = await page.text();
    const frame = pageHtml.match(
      /iframe src="(https:\/\/3867087\.extforms\.netsuite\.com[^"]+)"/
    );
    if (!frame) throw new Error("schedule frame missing");
    const frameUrl = frame[1].replace(/&amp;/g, "&");
    const table = await fetch(frameUrl, {
      headers: { "User-Agent": "the-villages-everything-app", Accept: "text/html" },
      next: { revalidate: 3600 },
    });
    if (!table.ok) throw new Error(`schedule ${table.status}`);
    const today = easternKey();
    const horizon = addDays(today, 21);
    const sailings = parseSailings(await table.text())
      .filter((row) => row.departureKey >= today && row.departureKey <= horizon)
      .sort((a, b) =>
        a.departureKey === b.departureKey
          ? a.departureTime.localeCompare(b.departureTime) || a.ship.localeCompare(b.ship)
          : a.departureKey.localeCompare(b.departureKey)
      )
      .slice(0, 16);
    return Response.json({
      ok: true,
      updated: new Date().toISOString(),
      source: PAGE,
      sailings,
    });
  } catch {
    return Response.json({ ok: false, source: PAGE, sailings: [] });
  }
}
