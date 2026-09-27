import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { saveUpload } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 80 * 1024 * 1024; // 80 MB

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = (
      form as unknown as { get: (name: string) => File | string | null }
    ).get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 80 MB)" },
        { status: 400 }
      );
    }
    const type = file.type || "";
    const nameLower = (file.name || "").toLowerCase();
    const isVideo = type.startsWith("video/");
    const isImage = type.startsWith("image/");
    const isPdf = type === "application/pdf" || nameLower.endsWith(".pdf");
    if (!isVideo && !isImage && !isPdf) {
      return NextResponse.json(
        { error: "Only video, image, or PDF files are allowed" },
        { status: 400 }
      );
    }
    let filename = file.name || (isVideo ? "video.mp4" : isPdf ? "document.pdf" : "image.jpg");
    if (isPdf && !filename.toLowerCase().endsWith(".pdf")) filename = `${filename}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUpload(
      buffer,
      filename,
      isPdf ? "application/pdf" : type || undefined
    );
    return NextResponse.json({
      url,
      type: isVideo ? "video" : isPdf ? "pdf" : "image",
      name: file.name,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
