import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createThread,
  getVisibleThreads,
  setThreadHidden,
} from "@/lib/forum";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  return NextResponse.json({ threads: getVisibleThreads(categoryId || undefined) });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Honeypot — bots fill this
    if (body.website || body.company) {
      return NextResponse.json({ ok: true });
    }
    const thread = createThread({
      categoryId: String(body.categoryId || ""),
      title: String(body.title || ""),
      authorName: String(body.authorName || ""),
      body: String(body.body || ""),
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
    const data = setThreadHidden(String(body.id || ""), !!body.hidden);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update thread" },
      { status: 400 }
    );
  }
}
