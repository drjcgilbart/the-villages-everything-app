import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { adminMailConfigured, adminNotifyEmail } from "@/lib/adminNotify";
import {
  applyPendingEdit,
  countPendingByTab,
  listPendingApprovals,
  type PendingKind,
} from "@/lib/pendingApprovals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await listPendingApprovals();
    const counts = countPendingByTab(items);
    return NextResponse.json({
      items,
      counts,
      total: items.length,
      emailConfigured: adminMailConfigured(),
      notifyEmail: adminNotifyEmail(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not load pending approvals",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const action = String(body.action || "").toLowerCase();
    if (action !== "update") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
    const kind = String(body.kind || "") as PendingKind;
    const id = String(body.id || "");
    if (!kind || !id) throw new Error("kind and id are required");
    const fields =
      body.fields && typeof body.fields === "object"
        ? (body.fields as Record<string, string>)
        : {};
    const saved = await applyPendingEdit(kind, id, fields, Boolean(body.approve));
    return NextResponse.json({
      ok: true,
      saved,
      message: body.approve ? "Saved and approved" : "Saved",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Could not save edits",
      },
      { status: 400 }
    );
  }
}
