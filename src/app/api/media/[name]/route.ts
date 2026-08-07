import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUpload } from "@/lib/content";
import { resolveUploadBlobUrl } from "@/lib/dataFs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;
  const safe = path.basename(String(name || ""));

  // 1) Local /tmp or bundled file (dev + same serverless instance)
  const filePath = resolveUpload(safe);
  if (filePath) {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type = TYPES[ext] || "application/octet-stream";
    return new NextResponse(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 2) Durable Vercel Blob (survives across instances / cold starts)
  const blobUrl = await resolveUploadBlobUrl(safe);
  if (blobUrl) {
    return NextResponse.redirect(blobUrl, 302);
  }

  return new NextResponse("Not found", { status: 404 });
}
