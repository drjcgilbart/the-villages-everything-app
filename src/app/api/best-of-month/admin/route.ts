import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  ensurePastMonthsTabulatedAsync,
  loadBomAsync,
  setBomEntryStatusAsync,
  tabulateMonth,
  tabulatePreviousMonthIfNeeded,
  bomMonthKey,
  previousMonthKey,
  saveBomAsync,
} from "@/lib/bestOfMonth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let data = await loadBomAsync();
  data = await ensurePastMonthsTabulatedAsync(data);
  return NextResponse.json({
    entries: data.entries,
    results: data.results,
    monthKey: bomMonthKey(),
    pending: data.entries.filter((e) => e.status === "pending"),
  });
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
      // keep sync helper but force hydrate + durable save path first
      await loadBomAsync();
      const data = tabulatePreviousMonthIfNeeded();
      await saveBomAsync(data);
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
