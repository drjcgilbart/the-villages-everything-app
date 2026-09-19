import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteWealthPlace,
  loadWealthLocalAsync,
  upsertWealthPlace,
} from "@/lib/wealthLocalStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await loadWealthLocalAsync();
  return NextResponse.json({
    places: data.places,
    updatedAt: data.updatedAt,
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = String(body.action || "").toLowerCase();

    if (action === "save") {
      const place = await upsertWealthPlace(body);
      return NextResponse.json({
        ok: true,
        place,
        message: `Saved “${place.name}”.`,
      });
    }

    if (action === "delete") {
      const id = String(body.id || "").trim();
      if (!id) throw new Error("id is required");
      const ok = await deleteWealthPlace(id);
      if (!ok) throw new Error("Place not found");
      return NextResponse.json({ ok: true, message: "Deleted." });
    }

    throw new Error("Unknown action");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save" },
      { status: 400 }
    );
  }
}
