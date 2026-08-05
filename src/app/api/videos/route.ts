import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteVideo, loadContent, upsertVideo } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ videos: loadContent().videos });
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
    const source = body.source === "upload" ? "upload" : "youtube";
    if (source === "upload" && !body.videoUrl) {
      return NextResponse.json(
        { error: "Upload a video file first (or paste a video URL)" },
        { status: 400 }
      );
    }
    const content = upsertVideo({
      id: body.id || undefined,
      title: body.title,
      description: body.description,
      source,
      youtubeId: body.youtubeId || body.youtubeUrl,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      tags,
      featured: !!body.featured,
      publishedAt: body.publishedAt,
    });
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save video" },
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
    const content = deleteVideo(id);
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete video" },
      { status: 400 }
    );
  }
}
