import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { sweepUnconfirmedEmailReminders } from "@/lib/memberEmailReminder";
import { isCronAuthorized } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/** Daily: remind pending members who have not confirmed their email since yesterday. */
export async function POST(req: Request) {
  const cron = isCronAuthorized(req);
  const admin = await isAdminAuthenticated();
  if (!cron && !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sweepUnconfirmedEmailReminders();
    return NextResponse.json({
      ok: true,
      mode: cron ? "cron" : "admin",
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Confirmation reminder failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
