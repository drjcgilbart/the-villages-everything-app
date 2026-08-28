import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createReply,
  deleteReply,
  getAllReplies,
  getRepliesForThread,
  loadForumAsync,
  toPublicReply,
  updateReply,
} from "@/lib/forum";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  await loadForumAsync();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";

  if (all) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({
      replies: getAllReplies().map(toPublicReply),
    });
  }

  const threadId = searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
  }
  return NextResponse.json({
    replies: getRepliesForThread(threadId).map(toPublicReply),
  });
}

export async function POST(req: Request) {
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "forum-reply", 30, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    if (body.website || body.company) {
      return NextResponse.json({ ok: true, reply: null });
    }
    const session = await getSessionMember();
    const { reply, editToken } = await createReply({
      threadId: String(body.threadId || ""),
      authorName: String(body.authorName || session?.name || ""),
      body: String(body.body || ""),
      authorMemberId: session?.id || null,
    });
    return NextResponse.json({ reply, editToken });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not post reply" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Missing message id" }, { status: 400 });
    }
    const isAdmin = await isAdminAuthenticated();
    const session = await getSessionMember();
    const reply = await updateReply(
      id,
      {
        body: body.body,
        authorName: body.authorName,
        hidden: body.hidden,
      },
      {
        isAdmin,
        editToken: body.editToken != null ? String(body.editToken) : null,
        sessionMemberId: session?.id || null,
      }
    );
    return NextResponse.json({ reply });
  } catch (err) {
    const code = (err as { code?: number })?.code || 400;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update reply" },
      { status: code === 403 ? 403 : 400 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id") || "";
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = String((body as { id?: string }).id || "");
    }
    if (!id) {
      return NextResponse.json({ error: "Missing message id" }, { status: 400 });
    }
    await deleteReply(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete reply" },
      { status: 400 }
    );
  }
}
