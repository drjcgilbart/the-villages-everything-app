import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { originAllowed } from "@/lib/security";
import { hasHolidayLightsAcceptance, termsUserIdForRequest } from "@/lib/holidayLightsTermsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Same-origin map tiles for the printed tour sheet.
 * The browser cannot read OpenStreetMap tiles into a canvas (no CORS), and this
 * route must not become an open proxy: zoom 10–16 and The Villages box only.
 */
const NORTH = 29.6;
const SOUTH = 28.2;
const WEST = -82.8;
const EAST = -81.2;
const UA =
  "TheVillagesEverythingApp/1.0 (holiday-light-tour-sheet; https://www.thevillageseverythingapp.com)";

function readInt(raw: string | null): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) ? n : null;
}

function lonToX(lng: number, z: number) {
  return Math.floor(((lng + 180) / 360) * 2 ** z);
}

function latToY(lat: number, z: number) {
  const rad = (lat * Math.PI) / 180;
  const n = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  return Math.floor(((1 - n / Math.PI) / 2) * 2 ** z);
}

export async function GET(req: Request) {
  if (!originAllowed(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const limited = rateLimitResponse(req, "light-tour-tile", 240, 10 * 60 * 1000);
  if (limited) return limited;
  const termsUserId = await termsUserIdForRequest();
  if (!termsUserId || !(await hasHolidayLightsAcceptance(termsUserId))) {
    return NextResponse.json(
      { error: "Accept the Holiday Lights terms before a route can start." },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const z = readInt(url.searchParams.get("z"));
  const x = readInt(url.searchParams.get("x"));
  const y = readInt(url.searchParams.get("y"));
  if (z === null || x === null || y === null || z < 10 || z > 16) {
    return NextResponse.json({ error: "Bad map tile." }, { status: 400 });
  }
  const max = 2 ** z;
  const xMin = lonToX(WEST, z) - 1;
  const xMax = lonToX(EAST, z) + 1;
  const yMin = latToY(NORTH, z) - 1;
  const yMax = latToY(SOUTH, z) + 1;
  if (x < 0 || y < 0 || x >= max || y >= max || x < xMin || x > xMax || y < yMin || y > yMax) {
    return NextResponse.json({ error: "That tile is outside the tour." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, {
      headers: { "User-Agent": UA, Accept: "image/png" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) return new NextResponse(null, { status: 502 });
    const buf = new Uint8Array(await upstream.arrayBuffer());
    const png =
      buf.byteLength > 32 &&
      buf.byteLength < 500_000 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47;
    if (!png) return new NextResponse(null, { status: 502 });
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
