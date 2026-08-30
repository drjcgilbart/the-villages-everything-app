import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  loadPickleballClubAsync,
  setPickleballLookingStatus,
  setPickleballRatingStatus,
} from "@/lib/pickleballClub";
import type {
  PickleballLookingStatus,
  PickleballModStatus,
} from "@/lib/pickleballTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await loadPickleballClubAsync();
  return NextResponse.json({
    ratings: data.ratings,
    looking: data.looking,
    pending: {
      ratings: data.ratings.filter((r) => r.status === "pending"),
    },
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const kind = String(body.kind || "").toLowerCase();
    const action = String(body.action || "").toLowerCase();
    const id = String(body.id || "");
    if (!id) throw new Error("id is required");

    if (kind === "rating") {
      if (!["approve", "reject", "pending"].includes(action)) {
        throw new Error("Invalid rating action");
      }
      const status = (
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : "pending"
      ) as PickleballModStatus;
      const rating = await setPickleballRatingStatus(id, status);
      return NextResponse.json({ ok: true, rating });
    }

    if (kind === "looking") {
      if (!["filled", "hidden", "open"].includes(action)) {
        throw new Error("Invalid looking action");
      }
      const post = await setPickleballLookingStatus(
        id,
        action as PickleballLookingStatus
      );
      return NextResponse.json({ ok: true, post });
    }

    throw new Error("Unknown kind");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 400 }
    );
  }
}
