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
export const maxDuration = 60;

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

function messageText(json: Record<string, unknown>): string {
  const choices = json.choices as
    | { message?: { content?: unknown; reasoning_content?: unknown } }[]
    | undefined;
  const msg = choices?.[0]?.message;
  const content = msg?.content;
  if (typeof content === "string" && content.trim()) return content;
  if (Array.isArray(content)) {
    const joined = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object") {
          const p = part as { text?: string; content?: string };
          return p.text || p.content || "";
        }
        return "";
      })
      .join("");
    if (joined.trim()) return joined;
  }
  if (typeof json.output_text === "string" && json.output_text.trim()) {
    return json.output_text;
  }
  return "";
}

function slimSnapshot(snap: DaySnapshot): DaySnapshot {
  return {
    ...snap,
    gyms: (snap.gyms || []).map((g) => ({
      ...g,
      media: (g.media || []).map((m) => ({
        ...m,
        url: m.url ? "[photo]" : "",
        localId: m.localId ? "[local]" : "",
      })),
    })),
  };
}

async function askXai(
  key: string,
  snap: DaySnapshot
): Promise<{ story: DayRecapStory | null; error: string | null }> {
  const models = [
    { model: "grok-4.6", extra: { reasoning_effort: "low" } },
    { model: "grok-4.6", extra: {} },
    { model: "grok-4.5", extra: { reasoning_effort: "low" } },
  ];
  let lastError: string | null = null;
  for (const attempt of models) {
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: attempt.model,
          temperature: 0.6,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: recapSystemPrompt() },
            {
              role: "user",
              content: `Write the recap JSON for this private day log:\n${JSON.stringify(slimSnapshot(snap)).slice(0, 10000)}`,
            },
          ],
          ...attempt.extra,
        }),
        signal: AbortSignal.timeout(50_000),
      });
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown> & {
        error?: { message?: string } | string;
      };
      if (!res.ok) {
        const errMsg =
          typeof json.error === "string"
            ? json.error
            : json.error?.message || `xAI ${res.status}`;
        lastError = `${attempt.model}: ${errMsg}`.slice(0, 180);
        console.error("[day-recap] xAI", attempt.model, res.status, errMsg);
        continue;
      }
      const raw = messageText(json);
      const story = parseStory(raw);
      if (story) return { story, error: null };
      lastError = `${attempt.model}: reply was not valid recap JSON`.slice(0, 180);
    } catch (err) {
      lastError =
        err instanceof Error && err.name === "TimeoutError"
          ? `${attempt.model}: timed out`
          : `${attempt.model}: ${err instanceof Error ? err.message : "network error"}`;
      console.error("[day-recap]", attempt.model, err);
    }
  }
  return { story: null, error: lastError };
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

  let body: { snapshot?: DaySnapshot; useGrok?: boolean } = {};
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
  const grokConfigured = Boolean(key);
  const wantGrok = body.useGrok === true;
  if (!wantGrok || !key) {
    return NextResponse.json({
      story: fallback,
      source: "local",
      grokConfigured,
    });
  }

  const { story, error } = await askXai(key, snap);
  return NextResponse.json({
    story: story || fallback,
    source: story ? "grok" : "local",
    grokConfigured,
    grokError: story ? undefined : error,
  });
}
