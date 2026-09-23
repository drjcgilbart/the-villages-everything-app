import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { suggestPostFields } from "@/lib/postDraft";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "post-suggest", 30, 15 * 60 * 1000);
  if (limited) return limited;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { title?: string; body?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const story = String(body.body || "").trim();
  if (story.length < 20) {
    return NextResponse.json(
      { error: "Write the story in the body first. A sentence or two is enough to start." },
      { status: 400 }
    );
  }
  const suggestion = await suggestPostFields(String(body.title || ""), story);
  return NextResponse.json(suggestion);
}
