import { NextResponse } from "next/server";
import { saveGolfAceUpload } from "@/lib/golfClub";
import { rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 3 * 1024 * 1024;

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "golf-ace-upload", 20, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const form = await req.formData();
    const file = (
      form as unknown as { get: (name: string) => File | string | null }
    ).get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No photo uploaded" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Photo must be under 3 MB" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await saveGolfAceUpload(
      buffer,
      file.name || "photo.jpg",
      file.type || ""
    );
    return NextResponse.json({ url, name: file.name });
  } catch (err) {
    console.error("[golf/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
