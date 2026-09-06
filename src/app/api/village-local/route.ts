import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember } from "@/lib/memberAuth";
import { getVillageBySlug } from "@/lib/villages";
import {
  addVillageLocalItem,
  getVillageLocalBundle,
  setVillageLocalHidden,
} from "@/lib/villageLocal";
import type { VillageLocalKind } from "@/lib/villageLocalTypes";

export const dynamic = "force-dynamic";

const KINDS = new Set<VillageLocalKind>(["facebook", "teamreach", "tip"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const villageSlug = searchParams.get("village") || "";
  if (!villageSlug) {
    return NextResponse.json({ error: "Missing village" }, { status: 400 });
  }
  return NextResponse.json(getVillageLocalBundle(villageSlug));
}

export async function POST(req: Request) {
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "village-local", 8, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    if (body.website || body.company) {
      return NextResponse.json({ ok: true });
    }
    const villageSlug = String(body.villageSlug || "");
    if (!getVillageBySlug(villageSlug)) {
      return NextResponse.json({ error: "Unknown village" }, { status: 400 });
    }
    const kind = String(body.kind || "") as VillageLocalKind;
    if (!KINDS.has(kind)) {
      return NextResponse.json({ error: "Pick Facebook, TeamReach, or a tip" }, { status: 400 });
    }
    const session = await getSessionMember();
    const saved = addVillageLocalItem({
      villageSlug,
      kind,
      title: body.title,
      url: body.url,
      code: body.code,
      note: body.note,
      body: body.body,
      submittedBy: body.submittedBy || session?.name,
    });
    return NextResponse.json({ ok: true, saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save" },
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
    const data = setVillageLocalHidden(String(body.id || ""), !!body.hidden);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update" },
      { status: 400 }
    );
  }
}
