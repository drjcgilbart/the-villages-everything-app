import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createThread,
  deleteThread,
  getAllThreads,
  getCategories,
  getVisibleThreads,
  loadForumAsync,
  toPublicThread,
  updateThread,
} from "@/lib/forum";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  await loadForumAsync();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  const all = searchParams.get("all") === "1";

  if (all) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({
      threads: getAllThreads().map(toPublicThread),
      categories: getCategories(),
    });
  }

  return NextResponse.json({
    threads: getVisibleThreads(categoryId || undefined).map(toPublicThread),
    categories: getCategories(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Honeypot — bots fill this (silent success, no thread created)
    if (body.website || body.company) {
      return NextResponse.json({ ok: true, thread: null });
    }
    const session = await getSessionMember();
    const { thread, editToken } = await createThread({
      categoryId: String(body.categoryId || ""),
      title: String(body.title || ""),
      authorName: String(body.authorName || session?.name || ""),
      body: String(body.body || ""),
      authorMemberId: session?.id || null,
    });
    return NextResponse.json({ thread, editToken });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not start conversation",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Missing conversation id" }, { status: 400 });
    }
    const isAdmin = await isAdminAuthenticated();
    const session = await getSessionMember();
    const thread = await updateThread(
      id,
      {
        title: body.title,
        body: body.body,
        authorName: body.authorName,
        hidden: body.hidden,
        locked: body.locked,
        pinned: body.pinned,
        categoryId: body.categoryId,
      },
      {
        isAdmin,
        editToken: body.editToken != null ? String(body.editToken) : null,
        sessionMemberId: session?.id || null,
      }
    );
    return NextResponse.json({ thread });
  } catch (err) {
    const code = (err as { code?: number })?.code || 400;
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not update conversation",
      },
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
      return NextResponse.json({ error: "Missing conversation id" }, { status: 400 });
    }
    await deleteThread(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not delete conversation",
      },
      { status: 400 }
    );
  }
}
