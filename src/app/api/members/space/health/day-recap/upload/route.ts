import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { saveUploadFile } from "@/lib/dataFs";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, memberCanAccess } from "@/lib/memberSpace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_PDF_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "health-day-pdf", 24, 15 * 60 * 1000);
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
  if (!memberCanAccess(space, "healthLog")) {
    return NextResponse.json(
      { error: "Health is locked on your plan" },
      { status: 403 }
    );
  }

  try {
    const form = await req.formData();
    const file = (
      form as unknown as { get: (name: string) => File | string | null }
    ).get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }
    const type = file.type || "";
    const name = file.name || "my-day.pdf";
    if (type && type !== "application/pdf" && type !== "application/octet-stream") {
      return NextResponse.json({ error: "Upload a PDF" }, { status: 400 });
    }
    if (!/\.pdf$/i.test(name) && type !== "application/pdf") {
      return NextResponse.json({ error: "Upload a PDF" }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "PDF must be under 8 MB" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.subarray(0, 4).toString("ascii") !== "%PDF") {
      return NextResponse.json({ error: "That file is not a PDF" }, { status: 400 });
    }
    const saved = await saveUploadFile(buffer, name.replace(/[^\w.-]+/g, "_") || "my-day.pdf", "application/pdf");
    return NextResponse.json({ url: saved.url, name: saved.name });
  } catch (err) {
    console.error("[day-recap/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
