import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createThread,
  getVisibleThreads,
  loadForumAsync,
  setThreadHidden,
} from "@/lib/forum";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  await loadForumAsync();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  return NextResponse.json({ threads: getVisibleThreads(categoryId || undefined) });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Honeypot — bots fill this (silent success, no thread created)
    if (body.website || body.company) {
      return NextResponse.json({ ok: true, thread: null });
    }
    const session = await getSessionMember();
    const thread = await createThread({
      categoryId: String(body.categoryId || ""),
      title: String(body.title || ""),
      authorName: String(body.authorName || session?.name || ""),
      body: String(body.body || ""),
      authorMemberId: session?.id || null,
    });
    return NextResponse.json({ thread });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not start conversation" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = await setThreadHidden(String(body.id || ""), !!body.hidden);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update thread" },
      { status: 400 }
    );
  }
}
