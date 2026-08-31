import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { saveUploadFile } from "@/lib/dataFs";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, memberCanAccess } from "@/lib/memberSpace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "memories-upload", 24, 15 * 60 * 1000);
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
  if (!memberCanAccess(space, "memoriesAlbum")) {
    return NextResponse.json(
      { error: "Photos is locked on your plan" },
      { status: 403 }
    );
  }

  try {
    const form = await req.formData();
    const file = (
      form as unknown as { get: (name: string) => File | string | null }
    ).get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const type = file.type || "";
    const isVideo = type.startsWith("video/");
    const isImage = type.startsWith("image/");
    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only photos or movies are allowed" },
        { status: 400 }
      );
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Photo must be under 8 MB" },
        { status: 400 }
      );
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Movie must be under 25 MB — keep it short" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveUploadFile(
      buffer,
      file.name || (isVideo ? "clip.mp4" : "photo.jpg"),
      type || undefined
    );
    return NextResponse.json({
      url: saved.url,
      type: isVideo ? "video" : "photo",
      name: file.name || saved.name,
    });
  } catch (err) {
    console.error("[memories/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
