import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUpload } from "@/lib/content";
import { fetchUploadBlobBytes, fetchUploadRedisBytes } from "@/lib/dataFs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function mediaResponse(data: Buffer, filename: string, type: string, cache: string) {
  let contentType = type || "application/octet-stream";
  let downloadName = filename;
  if (data.subarray(0, 5).toString("ascii") === "%PDF-") {
    contentType = "application/pdf";
    if (!downloadName.toLowerCase().endsWith(".pdf")) downloadName = `${downloadName}.pdf`;
  }
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `inline; filename="${downloadName.replace(/"/g, "")}"`,
      "Cache-Control": cache,
    },
  });
}

const TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".pdf": "application/pdf",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;
  const safe = path.basename(decodeURIComponent(String(name || "")));
  if (!safe || safe === "." || safe === "..") {
    return new NextResponse("Not found", { status: 404 });
  }

  // 1) Local /tmp or bundled file (dev + same serverless instance)
  const filePath = resolveUpload(safe);
  if (filePath) {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type = TYPES[ext] || "application/octet-stream";
    return mediaResponse(data, safe, type, "public, max-age=3600");
  }

  // 1b) Committed static recovery folder (public/member-uploads) — used when
  // Vercel Blob Hobby is over quota and uploads can't live in Blob.
  try {
    const pub = path.join(process.cwd(), "public", "member-uploads", safe);
    if (fs.existsSync(pub) && fs.statSync(pub).isFile()) {
      const data = fs.readFileSync(pub);
      const ext = path.extname(pub).toLowerCase();
      const type = TYPES[ext] || "application/octet-stream";
      return mediaResponse(data, safe, type, "public, max-age=86400");
    }
  } catch {
    /* fall through */
  }

  // 2) Durable Vercel Blob — stream bytes (works for private stores with token)
  const fromBlob = await fetchUploadBlobBytes(safe);
  if (fromBlob) {
    return mediaResponse(fromBlob.data, safe, fromBlob.contentType, "public, max-age=3600");
  }

  // 3) Redis fallback (used when Blob Hobby is over quota)
  const fromRedis = await fetchUploadRedisBytes(safe);
  if (fromRedis) {
    return mediaResponse(fromRedis.data, safe, fromRedis.contentType, "public, max-age=3600");
  }

  return new NextResponse("Not found", { status: 404 });
}
