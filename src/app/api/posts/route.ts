import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deletePost, loadContent, upsertPost } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ posts: loadContent().posts });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const tags = String(body.tags || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const content = upsertPost({
      id: body.id || undefined,
      type: body.type === "vlog" ? "vlog" : "blog",
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      body: body.body,
      coverImage: body.coverImage,
      tags,
      featured: !!body.featured,
      publishedAt: body.publishedAt,
    });
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save post" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const content = deletePost(id);
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete post" },
      { status: 400 }
    );
  }
}
