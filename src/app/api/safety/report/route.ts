import { NextResponse } from "next/server";
import { notifyAdminOfApprovalRequest } from "@/lib/adminNotify";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember } from "@/lib/memberAuth";
import {
  createSafetyReport,
  isReportTargetType,
} from "@/lib/safety";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "safety-report", 8);
  if (limited) return limited;

  try {
    const body = (await req.json()) as {
      targetType?: string;
      targetId?: string;
      targetMemberId?: string;
      targetLabel?: string;
      reason?: string;
      details?: string;
    };
    const targetType = String(body.targetType || "");
    if (!isReportTargetType(targetType)) {
      return NextResponse.json({ error: "Unknown content type" }, { status: 400 });
    }
    const member = await getSessionMember();
    const report = await createSafetyReport({
      targetType,
      targetId: String(body.targetId || ""),
      targetMemberId: body.targetMemberId || null,
      targetLabel: body.targetLabel,
      reason: String(body.reason || ""),
      details: body.details,
      reporterMemberId: member?.id || null,
      reporterName: member?.name || null,
    });
    await notifyAdminOfApprovalRequest({
      topic: "Safety",
      title: `Report: ${report.reason}`,
      submittedBy: member?.name || "Visitor",
      createdAt: report.createdAt,
      details: {
        targetType: report.targetType,
        targetId: report.targetId,
        targetLabel: report.targetLabel || "",
        details: report.details || "",
      },
    });
    return NextResponse.json({
      ok: true,
      message:
        "Thanks. We review reports and hide or remove content that breaks the house rules, usually within 24 hours.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not send report" },
      { status: 400 }
    );
  }
}
