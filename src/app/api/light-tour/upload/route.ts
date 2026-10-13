import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember } from "@/lib/memberAuth";
import { rejectIfCrossOrigin } from "@/lib/security";
import { saveUploadFile } from "@/lib/dataFs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const member = await getSessionMember();
  if (!(await isAdminAuthenticated())) {
    if (!member) {
      return NextResponse.json(
        { error: "Become a member first. The free Porch Waver plan is enough." },
        { status: 401 }
      );
    }
    if (member.status === "pending") {
      return NextResponse.json(
        { error: "Your membership is pending admin approval." },
        { status: 403 }
      );
    }
    if (member.status !== "approved") {
      return NextResponse.json({ error: "Membership is not active." }, { status: 403 });
    }
  }
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
