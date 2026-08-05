import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUpload } from "@/lib/content";

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
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;
  const filePath = resolveUpload(name);
  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }
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
