import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cache = new Map<string, { id: string; at: number }>();
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 80);
  if (q.length < 2) {
    return NextResponse.json({ id: null });
  }
  const key = q.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return NextResponse.json({ id: cached.id });
  }
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${q} exercise proper form`
    )}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TheVillagesEverythingApp/1.0; +https://www.thevillageseverythingapp.com)",
        "Accept-Language": "en-US,en;q=0.8",
      },
    });
    const html = await res.text();
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (!match?.[1]) return NextResponse.json({ id: null });
    cache.set(key, { id: match[1], at: Date.now() });
    return NextResponse.json({ id: match[1] });
  } catch {
    return NextResponse.json({ id: null });
  }
}
