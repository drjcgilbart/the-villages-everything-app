import { NextRequest, NextResponse } from "next/server";
import { googleNewsRss, parseNewsRss } from "@/lib/newsCatalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const cache = new Map<string, { at: number; items: ReturnType<typeof parseNewsRss> }>();
const TTL_MS = 15 * 60 * 1000;

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 120);
  if (q.length < 2) {
    return NextResponse.json({ error: "Provide q" }, { status: 400 });
  }
  const hit = cache.get(q.toLowerCase());
  if (hit && Date.now() - hit.at < TTL_MS) {
    return NextResponse.json({ items: hit.items, cached: true, query: q });
  }
  try {
    const res = await fetch(googleNewsRss(q), {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "TheVillagesHub/1.0 (news briefing; educational)",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Headlines unavailable", items: [] },
        { status: 502 }
      );
    }
    const xml = await res.text();
    const items = parseNewsRss(xml, 8);
    cache.set(q.toLowerCase(), { at: Date.now(), items });
    return NextResponse.json(
      { items, cached: false, query: q },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Headlines unavailable", items: [] },
      { status: 502 }
    );
  }
}
