import { NextResponse } from "next/server";
import {
  publicPickleballFeed,
  submitPickleballLooking,
  submitPickleballRating,
} from "@/lib/pickleballClub";
import { PICKLEBALL_COURTS } from "@/lib/pickleballTypes";
import { rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const feed = await publicPickleballFeed();
    return NextResponse.json({
      ...feed,
      courts: PICKLEBALL_COURTS,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not load pickleball",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "pickleball-submit", 12, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    const action = String(body.action || "").toLowerCase();

    if (action === "submit-rating") {
      const rating = await submitPickleballRating({
        playerName: String(body.playerName || ""),
        duprDoubles: body.duprDoubles,
        duprSingles: body.duprSingles,
        pcvg: body.pcvg ? String(body.pcvg) : undefined,
        courtName: body.courtName ? String(body.courtName) : undefined,
        notes: body.notes ? String(body.notes) : undefined,
      });
      return NextResponse.json({
        ok: true,
        rating,
        message:
          "DUPR snapshot submitted. It will appear on the board after admin approval.",
      });
    }

    if (action === "submit-looking") {
      const post = await submitPickleballLooking({
        organizerName: String(body.organizerName || ""),
        format: body.format,
        playersNeeded: body.playersNeeded,
        courtId: body.courtId ? String(body.courtId) : undefined,
        whenNote: String(body.whenNote || ""),
        message: String(body.message || ""),
        contact: String(body.contact || ""),
        duprNote: body.duprNote ? String(body.duprNote) : undefined,
      });
      return NextResponse.json({
        ok: true,
        post,
        message: "Looking-for-a-game post is live — good luck filling the court!",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save" },
      { status: 400 }
    );
  }
}
