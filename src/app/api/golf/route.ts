import { NextResponse } from "next/server";
import {
  publicGolfFeed,
  submitAce,
  submitFoursome,
  submitGolfRound,
} from "@/lib/golfClub";
import { FOURSOME_SECTIONS, GOLF_COURSES } from "@/lib/golfClubTypes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feed = publicGolfFeed();
    return NextResponse.json({
      ...feed,
      courses: GOLF_COURSES,
      sections: FOURSOME_SECTIONS,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not load golf club" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = String(body.action || "").toLowerCase();

    if (action === "submit-round") {
      const round = submitGolfRound({
        playerName: String(body.playerName || ""),
        handicap:
          body.handicap === "" || body.handicap === undefined
            ? null
            : Number(body.handicap),
        course: String(body.course || ""),
        playDate: String(body.playDate || ""),
        playTime: body.playTime ? String(body.playTime) : undefined,
        holes: body.holes,
        score: body.score,
        notes: body.notes ? String(body.notes) : undefined,
      });
      return NextResponse.json({
        ok: true,
        round,
        message:
          "Round submitted! It will appear on the leaderboard after admin approval.",
      });
    }

    if (action === "submit-foursome") {
      const post = submitFoursome({
        organizerName: String(body.organizerName || ""),
        section: body.section,
        playersNeeded: body.playersNeeded,
        course: body.course ? String(body.course) : undefined,
        whenNote: String(body.whenNote || ""),
        message: String(body.message || ""),
        contact: String(body.contact || ""),
      });
      return NextResponse.json({
        ok: true,
        post,
        message: "Foursome post is live — good luck filling the group!",
      });
    }

    if (action === "submit-ace") {
      const ace = submitAce({
        playerName: String(body.playerName || ""),
        course: String(body.course || ""),
        hole: body.hole,
        playDate: String(body.playDate || ""),
        clubUsed: body.clubUsed ? String(body.clubUsed) : undefined,
        story: body.story ? String(body.story) : undefined,
      });
      return NextResponse.json({
        ok: true,
        ace,
        message:
          "Hole-in-one submitted! After a quick admin check, we’ll celebrate it on the Ace Wall.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submit failed" },
      { status: 400 }
    );
  }
}
