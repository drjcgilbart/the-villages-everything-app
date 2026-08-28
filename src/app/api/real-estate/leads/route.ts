import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addLead,
  deleteLead,
  loadRealEstate,
  setLeadStatus,
} from "@/lib/realEstate";
import type { LeadType } from "@/lib/realEstateTypes";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ leads: loadRealEstate().leads });
}

export async function POST(req: Request) {
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "re-lead", 8, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    const type = (["buyer", "seller", "general"].includes(body.type)
      ? body.type
      : "general") as LeadType;
    const lead = addLead({
      type,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      village: body.village,
      budget: body.budget,
      agentId: body.agentId,
      listingId: body.listingId,
    });
    return NextResponse.json({
      ok: true,
      lead: { id: lead.id, createdAt: lead.createdAt },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save inquiry" },
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
    const data = setLeadStatus(String(body.id || ""), body.status);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update lead" },
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
    const data = deleteLead(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete lead" },
      { status: 400 }
    );
  }
}
