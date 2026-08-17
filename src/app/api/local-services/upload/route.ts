import { NextResponse } from "next/server";
import { saveLocalServiceUpload } from "@/lib/localServices";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

export async function POST(req: Request) {
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
        { error: "Photo must be under 3 MB" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await saveLocalServiceUpload(
      buffer,
      file.name || "photo.jpg",
      file.type || ""
    );
    return NextResponse.json({
      url,
      name: file.name,
      storedVia: url.startsWith("/api/media/") ? "app-media-proxy" : "direct",
    });
  } catch (err) {
    console.error("[local-services/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
