import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { listMembers, setMemberStatus } from "@/lib/yardSale";
import type { MemberStatus } from "@/lib/yardSaleTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ members: listMembers() });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const status = body.status as MemberStatus;
    if (!["pending", "approved", "rejected", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const member = setMemberStatus(body.id, status, body.notes);
    return NextResponse.json({ member, members: listMembers() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 400 }
    );
  }
}
