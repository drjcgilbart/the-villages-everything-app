import { NextResponse } from "next/server";
import { ensureDurableHydrated } from "@/lib/dataFs";
import { getSessionMember } from "@/lib/memberAuth";
import { addParkPhoto, readParkPhotos } from "@/lib/parkGallery";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDurableHydrated();
  return NextResponse.json(
    { photos: readParkPhotos() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: Request) {
  await ensureDurableHydrated();
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Sign in to hang a photo." }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "The account has to be approved before the gallery keeps a photo." },
      { status: 403 }
    );
  }
  const body = (await req.json().catch(() => null)) as {
    park?: string;
    caption?: string;
    image?: string;
  } | null;
  const park = String(body?.park || "").trim().slice(0, 80);
  const caption = String(body?.caption || "").trim().slice(0, 180);
  const image = String(body?.image || "");
  if (!park || !caption || !image.startsWith("data:image/jpeg")) {
    return NextResponse.json({ error: "A park, a caption, and a photo." }, { status: 400 });
  }
  if (image.length > 180_000) {
    return NextResponse.json({ error: "That photo is still too big. Try a smaller one." }, { status: 400 });
  }
  const first = member.name.trim().split(/\s+/)[0] || "A neighbor";
  const photos = await addParkPhoto({
    id: `park-${Date.now().toString(36)}`,
    park,
    caption,
    by: first,
    image,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ photos });
}
