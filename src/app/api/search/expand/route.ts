import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 45;

export type ExpandHit = {
  title: string;
  url: string;
  snippet: string;
};

function parseHits(raw: string): ExpandHit[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start < 0 || end <= start) return [];
  try {
    const arr = JSON.parse(raw.slice(start, end + 1)) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const r = row as Record<string, unknown>;
        const url = String(r.url || r.href || "").trim();
        const title = String(r.title || "").trim();
        if (!url.startsWith("http") || !title) return null;
        return {
          title: title.slice(0, 140),
          url: url.slice(0, 400),
          snippet: String(r.snippet || r.body || "").trim().slice(0, 220),
        };
      })
      .filter(Boolean)
      .slice(0, 8) as ExpandHit[];
  } catch {
    return [];
  }
}

async function duckDuckGo(q: string): Promise<ExpandHit[]> {
  const res = await fetch(
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    {
      headers: {
        "User-Agent":
          "TheVillagesEverythingApp/1.0 (+https://www.thevillageseverythingapp.com)",
      },
      signal: AbortSignal.timeout(12_000),
    }
  );
  if (!res.ok) return [];
  const html = await res.text();
  const hits: ExpandHit[] = [];
  const re =
    /class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && hits.length < 8) {
    const url = decodeURIComponent(m[1] || "").replace(/&amp;/g, "&");
    const title = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const snippet = m[3].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!url.startsWith("http") || !title) continue;
    hits.push({ title: title.slice(0, 140), url, snippet: snippet.slice(0, 220) });
  }
  if (hits.length) return hits;
  const loose =
    /uddg=([^&"]+)[^>]*>[\s\S]*?class="result__a"[^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = loose.exec(html)) && hits.length < 8) {
    let url = "";
    try {
      url = decodeURIComponent(m[1]);
    } catch {
      url = m[1];
    }
    const title = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!url.startsWith("http") || !title) continue;
    hits.push({ title: title.slice(0, 140), url, snippet: "" });
  }
  return hits;
}

async function grokExpand(
  key: string,
  q: string,
  source: "web" | "x"
): Promise<ExpandHit[]> {
  const tool = source === "x" ? { type: "x_search" } : { type: "web_search" };
  const prompt =
    source === "x"
      ? `Search X (Twitter) for recent public posts about: ${q}. Focus on The Villages, Florida when relevant. Return ONLY a JSON array of up to 8 objects with keys title, url, snippet.`
      : `Search the public web for: ${q}. Prefer The Villages, Florida sources when relevant. Return ONLY a JSON array of up to 8 objects with keys title, url, snippet.`;
  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.6",
      reasoning_effort: "low",
      tools: [tool],
      input: prompt,
    }),
    signal: AbortSignal.timeout(35_000),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(
      typeof (json.error as { message?: string } | undefined)?.message === "string"
        ? (json.error as { message: string }).message
        : `xAI ${res.status}`
    );
  }
  const text =
    typeof json.output_text === "string"
      ? json.output_text
      : JSON.stringify(json.output || json);
  return parseHits(text);
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "site-search-expand", 12, 15 * 60 * 1000);
  if (limited) return limited;
  let body: { q?: string; source?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const q = String(body.q || "").trim().slice(0, 120);
  const source = body.source === "x" ? "x" : "web";
  if (q.length < 2) {
    return NextResponse.json({ error: "Type a longer search" }, { status: 400 });
  }

  const key = process.env.XAI_API_KEY?.trim();
  if (key) {
    try {
      const hits = await grokExpand(key, q, source);
      if (hits.length) {
        return NextResponse.json({ query: q, source, hits, via: "grok" });
      }
    } catch (err) {
      console.error("[search/expand] grok", err);
    }
  }

  const ddgQ =
    source === "x"
      ? `${q} site:x.com OR site:twitter.com`
      : `${q} The Villages Florida`;
  try {
    const hits = await duckDuckGo(ddgQ);
    return NextResponse.json({
      query: q,
      source,
      hits,
      via: "web",
      moreUrl:
        source === "x"
          ? `https://x.com/search?q=${encodeURIComponent(q)}&src=typed_query`
          : `https://duckduckgo.com/?q=${encodeURIComponent(ddgQ)}`,
    });
  } catch (err) {
    console.error("[search/expand] ddg", err);
    return NextResponse.json({
      query: q,
      source,
      hits: [],
      moreUrl:
        source === "x"
          ? `https://x.com/search?q=${encodeURIComponent(q)}&src=typed_query`
          : `https://duckduckgo.com/?q=${encodeURIComponent(ddgQ)}`,
    });
  }
}
