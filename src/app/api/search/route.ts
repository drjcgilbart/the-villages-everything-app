import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { searchSiteAsync } from "@/lib/siteSearch";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = rateLimitResponse(req, "site-search", 40, 60 * 1000);
  if (limited) return limited;
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") || "").trim().slice(0, 120);
  if (q.length < 2) {
    return NextResponse.json({ query: q, hits: [], empty: true });
  }
  const hits = await searchSiteAsync(q, 20);
  return NextResponse.json({ query: q, hits, empty: hits.length === 0 });
}
