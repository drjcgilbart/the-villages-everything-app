import { NextResponse } from "next/server";
import { ensureDurableHydrated } from "@/lib/dataFs";
import { getSessionMember } from "@/lib/memberAuth";
import { addRangePhoto, readRangeGallery } from "@/lib/rangeLog";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDurableHydrated();
  return NextResponse.json(readRangeGallery(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  await ensureDurableHydrated();
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Sign in to hang a photo." }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "The account has to be approved before the wall keeps a photo." },
      { status: 403 }
    );
  }
  const body = (await req.json().catch(() => null)) as {
    range?: string;
    gear?: string;
    caption?: string;
    image?: string;
  } | null;
  const range = String(body?.range || "").trim().slice(0, 80);
  const caption = String(body?.caption || "").trim().slice(0, 180);
  const image = String(body?.image || "");
  if (!range || !caption || !image.startsWith("data:image/jpeg") || image.length > 180_000) {
    return NextResponse.json({ error: "A range, a caption, and a smaller photo." }, { status: 400 });
  }
  const first = member.name.trim().split(/\s+/)[0] || "A neighbor";
  const log = await addRangePhoto({
    id: `range-${Date.now().toString(36)}`,
    range,
    gear: String(body?.gear || "").trim().slice(0, 60),
    caption,
    by: first,
    image,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json(log);
}
