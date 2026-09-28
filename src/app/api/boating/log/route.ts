import { NextResponse } from "next/server";
import { addBoatPhoto, addCatchReport, readBoatLog } from "@/lib/boatLog";
import { ensureDurableHydrated } from "@/lib/dataFs";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDurableHydrated();
  return NextResponse.json(readBoatLog(), { headers: { "Cache-Control": "no-store" } });
}

async function memberOrError() {
  await ensureDurableHydrated();
  const member = await getSessionMember();
  if (!member) {
    return { error: NextResponse.json({ error: "Sign in to post." }, { status: 401 }) };
  }
  if (member.status !== "approved") {
    return {
      error: NextResponse.json(
        { error: "The account has to be approved before the board keeps a post." },
        { status: 403 }
      ),
    };
  }
  return { member };
}

export async function POST(req: Request) {
  const gate = await memberOrError();
  if (gate.error) return gate.error;
  const body = (await req.json().catch(() => null)) as {
    kind?: string;
    lake?: string;
    species?: string;
    bait?: string;
    note?: string;
    boat?: string;
    catchName?: string;
    caption?: string;
    image?: string;
  } | null;
  const first = gate.member!.name.trim().split(/\s+/)[0] || "A neighbor";
  const now = new Date().toISOString();
  if (body?.kind === "photo") {
    const boat = String(body.boat || "").trim().slice(0, 60);
    const caption = String(body.caption || "").trim().slice(0, 180);
    const image = String(body.image || "");
    if (!boat || !caption || !image.startsWith("data:image/jpeg") || image.length > 180_000) {
      return NextResponse.json({ error: "A boat, a caption, and a smaller photo." }, { status: 400 });
    }
    const log = await addBoatPhoto({
      id: `boat-${Date.now().toString(36)}`,
      boat,
      catchName: String(body.catchName || "").trim().slice(0, 60),
      caption,
      by: first,
      image,
      createdAt: now,
    });
    return NextResponse.json(log);
  }
  const lake = String(body?.lake || "").trim().slice(0, 60);
  const species = String(body?.species || "").trim().slice(0, 60);
  const bait = String(body?.bait || "").trim().slice(0, 80);
  if (!lake || !species) {
    return NextResponse.json({ error: "A lake and a species." }, { status: 400 });
  }
  const log = await addCatchReport({
    id: `catch-${Date.now().toString(36)}`,
    lake,
    species,
    bait,
    note: String(body?.note || "").trim().slice(0, 180),
    by: first,
    createdAt: now,
  });
  return NextResponse.json(log);
}
