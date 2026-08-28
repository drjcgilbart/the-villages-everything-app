import { NextResponse } from "next/server";
import {
  publicGolfFeed,
  submitAce,
  submitFoursome,
  submitGolfRound,
} from "@/lib/golfClub";
import { golfBadgesForName } from "@/lib/golfBadges";
import { FOURSOME_SECTIONS, GOLF_COURSES } from "@/lib/golfClubTypes";
import { rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const feed = await publicGolfFeed();
    const names = new Set<string>();
    for (const r of feed.handicapLeaders) names.add(r.playerName);
    for (const r of feed.courseLeaders) names.add(r.playerName);
    for (const r of feed.recentRounds) names.add(r.playerName);
    for (const a of feed.aces) names.add(a.playerName);
    const playerBadges: Record<string, ReturnType<typeof golfBadgesForName>> =
      {};
    for (const name of names) {
      const badges = golfBadgesForName(name);
      if (badges.length) playerBadges[name] = badges;
    }
    return NextResponse.json({
      ...feed,
      playerBadges,
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
  const limited = rateLimitResponse(req, "golf-submit", 12, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    const action = String(body.action || "").toLowerCase();

    if (action === "submit-round") {
      const round = await submitGolfRound({
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
      const post = await submitFoursome({
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
      const ace = await submitAce({
        playerName: String(body.playerName || ""),
        course: String(body.course || ""),
        hole: body.hole,
        playDate: String(body.playDate || ""),
        clubUsed: body.clubUsed ? String(body.clubUsed) : undefined,
        story: body.story ? String(body.story) : undefined,
        photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
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
