import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  listSafetyReports,
  loadSafety,
  setSafetyReportStatus,
} from "@/lib/safety";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = loadSafety();
  return NextResponse.json({
    reports: listSafetyReports(),
    openCount: data.reports.filter((r) => r.status === "open").length,
    blockCount: data.blocks.length,
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { id?: string; status?: string };
    const status = body.status === "reviewed" ? "reviewed" : "open";
    const report = await setSafetyReportStatus(String(body.id || ""), status);
    return NextResponse.json({ ok: true, report, reports: listSafetyReports() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 400 }
    );
  }
}
