import { NextResponse } from "next/server";
import { saveBomUpload } from "@/lib/bestOfMonth";
import { rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "bom-upload", 20, 15 * 60 * 1000);
  if (limited) return limited;
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
        { error: "File must be under 12 MB" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await saveBomUpload(
      buffer,
      file.name || "upload.jpg",
      file.type || ""
    );
    return NextResponse.json({
      url: result.url,
      fileType: result.fileType,
      name: file.name,
    });
  } catch (err) {
    console.error("[bom/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
