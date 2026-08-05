import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deletePhoto, getPhotos, upsertPhoto } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ photos: getPhotos() });
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
    const images = Array.isArray(body.images)
      ? body.images
      : body.imageUrl
        ? [{ id: "img-0", url: body.imageUrl, caption: "" }]
        : [];
    const content = upsertPhoto({
      id: body.id || undefined,
      title: body.title,
      caption: body.caption,
      images,
      featuredImageId: body.featuredImageId,
      imageUrl: body.imageUrl,
      tags,
      featured: !!body.featured,
      publishedAt: body.publishedAt,
    });
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save photo" },
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
    const content = deletePhoto(id);
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete photo" },
      { status: 400 }
    );
  }
}
