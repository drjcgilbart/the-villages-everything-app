import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUpload } from "@/lib/content";
import { fetchUploadBlobBytes, fetchUploadRedisBytes } from "@/lib/dataFs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function mediaResponse(req: Request, data: Buffer, filename: string, type: string, cache: string) {
  let contentType = type || "application/octet-stream";
  let downloadName = filename;
  if (data.subarray(0, 5).toString("ascii") === "%PDF-") {
    contentType = "application/pdf";
    if (!downloadName.toLowerCase().endsWith(".pdf")) downloadName = `${downloadName}.pdf`;
  }
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": `inline; filename="${downloadName.replace(/"/g, "")}"`,
    "Cache-Control": cache,
    "Accept-Ranges": "bytes",
  };
  if (contentType === "application/pdf") {
    const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.get("range") || "");
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Math.min(Number(match[2]), data.length - 1) : data.length - 1;
      if (start >= 0 && start < data.length && start <= end) {
        const slice = data.subarray(start, end + 1);
        return new NextResponse(new Uint8Array(slice), {
          status: 206,
          headers: {
            ...headers,
            "Content-Range": `bytes ${start}-${end}/${data.length}`,
            "Content-Length": String(slice.length),
          },
        });
      }
    }
  }
  headers["Content-Length"] = String(data.length);
  return new NextResponse(new Uint8Array(data), { headers });
}

async function loadNamedMedia(name: string) {
  const filePath = resolveUpload(name);
  if (filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return {
      data: fs.readFileSync(filePath),
      type: TYPES[ext] || "application/octet-stream",
      cache: "public, max-age=3600",
    };
  }
  try {
    const pub = path.join(process.cwd(), "public", "member-uploads", name);
    if (fs.existsSync(pub) && fs.statSync(pub).isFile()) {
      const ext = path.extname(pub).toLowerCase();
      return {
        data: fs.readFileSync(pub),
        type: TYPES[ext] || "application/octet-stream",
        cache: "public, max-age=86400",
      };
    }
  } catch {
    /* fall through */
  }
  const fromBlob = await fetchUploadBlobBytes(name);
  if (fromBlob) {
    return { data: fromBlob.data, type: fromBlob.contentType, cache: "public, max-age=3600" };
  }
  const fromRedis = await fetchUploadRedisBytes(name);
  if (fromRedis) {
    return { data: fromRedis.data, type: fromRedis.contentType, cache: "public, max-age=3600" };
  }
  return null;
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
  req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;
  const safe = path.basename(decodeURIComponent(String(name || "")));
  if (!safe || safe === "." || safe === "..") {
    return new NextResponse("Not found", { status: 404 });
  }
  const names = safe.toLowerCase().endsWith(".pdf") ? [safe, safe.slice(0, -4)] : [safe];
  for (const candidate of names) {
    if (!candidate || candidate === "." || candidate === "..") continue;
    const found = await loadNamedMedia(candidate);
    if (found) return mediaResponse(req, found.data, candidate, found.type, found.cache);
  }
  return new NextResponse("Not found", { status: 404 });
}
