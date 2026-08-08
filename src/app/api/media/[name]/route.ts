import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUpload } from "@/lib/content";
import { fetchUploadBlobBytes } from "@/lib/dataFs";

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
    return new NextResponse(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // 1b) Committed static recovery folder (public/member-uploads) — used when
  // Vercel Blob Hobby is over quota and uploads can't live in Blob.
  try {
    const pub = path.join(process.cwd(), "public", "member-uploads", safe);
    if (fs.existsSync(pub) && fs.statSync(pub).isFile()) {
      const data = fs.readFileSync(pub);
      const ext = path.extname(pub).toLowerCase();
      const type = TYPES[ext] || "application/octet-stream";
      return new NextResponse(data, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  } catch {
    /* fall through */
  }

  // 2) Durable Vercel Blob — stream bytes (works for private stores with token)
  const fromBlob = await fetchUploadBlobBytes(safe);
  if (fromBlob) {
    return new NextResponse(new Uint8Array(fromBlob.data), {
      headers: {
        "Content-Type": fromBlob.contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return new NextResponse("Not found", { status: 404 });
}
