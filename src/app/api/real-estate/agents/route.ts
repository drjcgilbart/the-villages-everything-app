import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteAgent,
  getPublicAgents,
  loadRealEstate,
  upsertAgent,
} from "@/lib/realEstate";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await isAdminAuthenticated();
  if (admin) {
    return NextResponse.json({ agents: loadRealEstate().agents });
  }
  return NextResponse.json({ agents: getPublicAgents() });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const specialties = String(body.specialties || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const data = upsertAgent({
      id: body.id || undefined,
      name: body.name,
      brokerage: body.brokerage,
      phone: body.phone,
      email: body.email,
      website: body.website,
      bio: body.bio,
      specialties,
      tier: body.tier,
      acceptsLeads: body.acceptsLeads !== false,
      photoUrl: body.photoUrl,
      active: body.active !== false,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save agent" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data = deleteAgent(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete agent" },
      { status: 400 }
    );
  }
}
