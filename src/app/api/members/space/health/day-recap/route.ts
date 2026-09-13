import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, memberCanAccess } from "@/lib/memberSpace";
import {
  recapSystemPrompt,
  writeLocalDayStory,
  type DayRecapStory,
  type DaySnapshot,
} from "@/lib/healthDayRecap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseStory(raw: string): DayRecapStory | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const obj = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
    const article = String(obj.article || "").trim();
    if (!article) return null;
    const list = (v: unknown) =>
      Array.isArray(v)
        ? v.map((x) => String(x || "").trim()).filter(Boolean).slice(0, 6)
        : [];
    return {
      title: String(obj.title || "My day").slice(0, 140),
      headline: String(obj.headline || "").slice(0, 200),
      article: article.slice(0, 4500),
      highlights: list(obj.highlights),
      improve: list(obj.improve),
      bestMoment: String(obj.bestMoment || "").slice(0, 280),
      closer: String(obj.closer || "").slice(0, 280),
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "health-day-recap", 20, 15 * 60 * 1000);
  if (limited) return limited;

  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "Membership must be approved first" },
      { status: 403 }
    );
  }
  const space = getMemberSpace(member.id);
  if (!memberCanAccess(space, "healthLog")) {
    return NextResponse.json(
      { error: "Health is locked on your plan" },
      { status: 403 }
    );
  }

  let body: { snapshot?: DaySnapshot } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const snap = body.snapshot;
  if (!snap || typeof snap !== "object" || !snap.date) {
    return NextResponse.json({ error: "Missing day's notes" }, { status: 400 });
  }

  const fallback = writeLocalDayStory(snap);
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json({ story: fallback, source: "local" });
  }

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-4.6",
        temperature: 0.7,
        messages: [
          { role: "system", content: recapSystemPrompt() },
          {
            role: "user",
            content: `Write the recap JSON for this private day log:\n${JSON.stringify(snap).slice(0, 12000)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(45000),
    });
    const json = (await res.json().catch(() => ({}))) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };
    if (!res.ok) {
      console.error("[day-recap] xAI", res.status, json.error?.message);
      return NextResponse.json({ story: fallback, source: "local" });
    }
    const story = parseStory(String(json.choices?.[0]?.message?.content || ""));
    return NextResponse.json({
      story: story || fallback,
      source: story ? "grok" : "local",
    });
  } catch (err) {
    console.error("[day-recap]", err);
    return NextResponse.json({ story: fallback, source: "local" });
  }
}
