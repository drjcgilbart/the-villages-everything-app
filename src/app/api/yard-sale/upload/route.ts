import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import {
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  saveYardUpload,
} from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "yard-sale-upload", 24, 15 * 60 * 1000);
  if (limited) return limited;

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
        { error: "Only images or one short video are allowed" },
        { status: 400 }
      );
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 3 MB after shrinking" },
        { status: 400 }
      );
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Video must be under 20 MB after shrinking — keep it short" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveYardUpload(
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
