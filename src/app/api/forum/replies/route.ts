import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createReply, getRepliesForThread, setReplyHidden } from "@/lib/forum";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
  }
  return NextResponse.json({ replies: getRepliesForThread(threadId) });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.website || body.company) {
      return NextResponse.json({ ok: true });
    }
    const reply = createReply({
      threadId: String(body.threadId || ""),
      authorName: String(body.authorName || ""),
      body: String(body.body || ""),
    });
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not post reply" },
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
    const data = setReplyHidden(String(body.id || ""), !!body.hidden);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update reply" },
      { status: 400 }
    );
  }
}
