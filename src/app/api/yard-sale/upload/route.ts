import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember } from "@/lib/memberAuth";
import {
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  saveYardUpload,
} from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const member = await getSessionMember();
  const admin = await isAdminAuthenticated();
  if (!admin && (!member || member.status !== "approved")) {
    return NextResponse.json(
      { error: "Approved members only can upload yard-sale media" },
      { status: 403 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const type = file.type || "";
    const isVideo = type.startsWith("video/");
    const isImage = type.startsWith("image/");
    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only images or one short video are allowed" },
        { status: 400 }
      );
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 8 MB" },
        { status: 400 }
      );
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Video must be under 40 MB (keep it short)" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = saveYardUpload(
      buffer,
      file.name || (isVideo ? "clip.mp4" : "photo.jpg")
    );
    return NextResponse.json({
      url,
      type: isVideo ? "video" : "image",
      name: file.name,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
