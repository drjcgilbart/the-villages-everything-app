import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  blobConfigured,
  durableConfigured,
  redisConfigured,
} from "@/lib/dataFs";
import {
  ensurePastMonthsTabulatedAsync,
  loadBomAsync,
  setBomEntryStatusAsync,
  updateBomEntryAsync,
  deleteBomEntryAsync,
  tabulateMonth,
  tabulatePreviousMonthIfNeededAsync,
  bomMonthKey,
  previousMonthKey,
  saveBomAsync,
} from "@/lib/bestOfMonth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    let data = await loadBomAsync();
    data = await ensurePastMonthsTabulatedAsync(data);
    const pending = data.entries.filter((e) => e.status === "pending");
    return NextResponse.json({
      entries: data.entries,
      results: data.results,
      monthKey: bomMonthKey(),
      pending,
      pendingCount: pending.length,
      blobConfigured: blobConfigured(),
      redisConfigured: redisConfigured(),
      durableConfigured: durableConfigured(),
      updatedAt: data.updatedAt,
    });
  } catch (err) {
    console.error("[bom/admin GET]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to load Best of Month",
        blobConfigured: blobConfigured(),
        redisConfigured: redisConfigured(),
        durableConfigured: durableConfigured(),
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

    if (action === "approve" || action === "reject" || action === "pending") {
      const status =
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : "pending";
      const entry = await setBomEntryStatusAsync(String(body.id || ""), status);
      return NextResponse.json({ ok: true, entry });
    }

    if (action === "update") {
      const entry = await updateBomEntryAsync(String(body.id || ""), {
        title: body.title,
        description: body.description,
        submitterName: body.submitterName,
        category: body.category,
        status: body.status,
      });
      return NextResponse.json({
        ok: true,
        entry,
        message: "Entry updated.",
      });
    }

    if (action === "delete") {
      await deleteBomEntryAsync(String(body.id || ""));
      return NextResponse.json({
        ok: true,
        message: "Entry deleted.",
      });
    }

    if (action === "tabulate") {
      const monthKey = String(body.monthKey || previousMonthKey(bomMonthKey()));
      let data = await loadBomAsync();
      if (!data.results.some((r) => r.monthKey === monthKey)) {
        data = tabulateMonth(data, monthKey);
        await saveBomAsync(data);
      }
      return NextResponse.json({
        ok: true,
        results: data.results.find((r) => r.monthKey === monthKey),
      });
    }

    if (action === "tabulate-previous") {
      const data = await tabulatePreviousMonthIfNeededAsync();
      return NextResponse.json({ ok: true, results: data.results[0] || null });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Admin action failed" },
      { status: 400 }
    );
  }
}
