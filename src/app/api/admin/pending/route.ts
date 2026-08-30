import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { adminMailConfigured, adminNotifyEmail } from "@/lib/adminNotify";
import {
  countPendingByTab,
  listPendingApprovals,
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
