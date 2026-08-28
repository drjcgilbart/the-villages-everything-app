import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteAce,
  loadGolfClubAsync,
  setAceStatus,
  setFoursomeStatus,
  setRoundStatus,
  updateAce,
} from "@/lib/golfClub";
import type { GolfModStatus } from "@/lib/golfClubTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await loadGolfClubAsync();
  return NextResponse.json({
    rounds: data.rounds,
    foursomes: data.foursomes,
    aces: data.aces,
    pending: {
      rounds: data.rounds.filter((r) => r.status === "pending"),
      aces: data.aces.filter((a) => a.status === "pending"),
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

    if (kind === "round") {
      if (!["approve", "reject", "pending"].includes(action)) {
        throw new Error("Invalid round action");
      }
      const status = (
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : "pending"
      ) as GolfModStatus;
      const round = await setRoundStatus(id, status);
      return NextResponse.json({ ok: true, round });
    }

    if (kind === "ace") {
      if (action === "delete") {
        await deleteAce(id);
        return NextResponse.json({ ok: true });
      }
      if (action === "update") {
        const ace = await updateAce(id, {
          playerName: body.playerName,
          course: body.course,
          hole: body.hole,
          playDate: body.playDate,
          clubUsed: body.clubUsed,
          story: body.story,
          photoUrl: body.photoUrl,
          status: body.status,
        });
        return NextResponse.json({ ok: true, ace });
      }
      if (!["approve", "reject", "pending"].includes(action)) {
        throw new Error("Invalid ace action");
      }
      const status = (
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : "pending"
      ) as GolfModStatus;
      const ace = await setAceStatus(id, status);
      return NextResponse.json({ ok: true, ace });
    }

    if (kind === "foursome") {
      if (!["open", "filled", "hidden"].includes(action)) {
        throw new Error("Invalid foursome action");
      }
      const post = await setFoursomeStatus(
        id,
        action as "open" | "filled" | "hidden"
      );
      return NextResponse.json({ ok: true, post });
    }

    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Admin action failed" },
      { status: 400 }
    );
  }
}
