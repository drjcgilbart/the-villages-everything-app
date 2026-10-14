import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { saveUploadFile } from "@/lib/dataFs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-upload", 40, 15 * 60 * 1000);
  if (limited) return limited;
  const form = await req.formData();
  const file = (
    form as unknown as { get: (name: string) => File | string | null }
  ).get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No photo uploaded." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Use a photo." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Photo must be under 3 MB." }, { status: 400 });
  }
  const saved = await saveUploadFile(Buffer.from(await file.arrayBuffer()), file.name || "house.jpg", file.type);
  return NextResponse.json({ url: saved.url });
}
