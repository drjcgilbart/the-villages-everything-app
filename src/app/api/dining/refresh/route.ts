import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteRestaurant } from "@/lib/dining";
import { refreshDiningDirectory } from "@/lib/diningRefresh";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { action?: string; id?: string } = {};
  try {
    body = (await req.json()) as { action?: string; id?: string };
  } catch {
    body = {};
  }

  if (body.action === "remove-closed") {
    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Missing restaurant id" }, { status: 400 });
    }
    try {
      await deleteRestaurant(id);
      return NextResponse.json({ ok: true, removed: id });
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error ? err.message : "Could not remove restaurant",
        },
        { status: 400 }
      );
    }
  }

  try {
    const result = await refreshDiningDirectory();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Restaurant refresh failed",
      },
      { status: 502 }
    );
  }
}
