import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addVillageNeighbor,
  getNeighborsForVillage,
  setNeighborHidden,
} from "@/lib/villageNeighbors";
import { getSessionMember } from "@/lib/memberAuth";
import { getVillageBySlug } from "@/lib/villages";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const villageSlug = searchParams.get("village") || "";
  if (!villageSlug) {
    return NextResponse.json({ error: "Missing village" }, { status: 400 });
  }
  return NextResponse.json({
    neighbors: getNeighborsForVillage(villageSlug),
  });
}

export async function POST(req: Request) {
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "village-neighbor", 8, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    // Honeypot
    if (body.website || body.company) {
      return NextResponse.json({ ok: true });
    }
    const villageSlug = String(body.villageSlug || "");
    if (!getVillageBySlug(villageSlug)) {
      return NextResponse.json({ error: "Unknown village" }, { status: 400 });
    }
    const session = await getSessionMember();
    const interests = String(body.interests || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const neighbor = addVillageNeighbor({
      villageSlug,
      displayName: body.displayName || session?.name,
      areaNote: body.areaNote,
      bio: body.bio,
      interests,
      tenure: body.tenure,
      memberId: session?.id || null,
    });
    return NextResponse.json({ neighbor });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save intro" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = setNeighborHidden(String(body.id || ""), !!body.hidden);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update" },
      { status: 400 }
    );
  }
}
