import { NextResponse } from "next/server";
import { getApprovedClubById, loadClubListingsAsync } from "@/lib/clubListings";
import { clubMeetingsInRange } from "@/lib/meetingCode";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, memberCanAccess } from "@/lib/memberSpace";

export const dynamic = "force-dynamic";

/** Starred clubs whose published meeting code falls in this date range. */
export async function GET(req: Request) {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  const space = getMemberSpace(member.id);
  if (!memberCanAccess(space, "calendarBoard")) {
    return NextResponse.json({ events: [] });
  }
  const url = new URL(req.url);
  const start = String(url.searchParams.get("start") || "");
  const end = String(url.searchParams.get("end") || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || end < start) {
    return NextResponse.json({ error: "Missing date range" }, { status: 400 });
  }
  const ids = new Set(space.favoriteClubIds || []);
  if (!ids.size) return NextResponse.json({ events: [] });

  const data = await loadClubListingsAsync();
  const events = [];
  for (const id of ids) {
    const club = getApprovedClubById(id, data);
    if (!club) continue;
    for (const meet of clubMeetingsInRange(club.description, start, end)) {
      events.push({
        id: `favclub:${club.id}:${meet.date}:${meet.time}`,
        kind: "club" as const,
        title: club.name,
        date: meet.date,
        time: meet.time,
        location: club.location,
        notes: "Starred club. Confirm the time with the leader — the district list changes.",
        href: `/club-zone/club/${encodeURIComponent(club.id)}`,
        source: { board: "club" as const, id: club.id, repeats: true },
      });
    }
  }
  return NextResponse.json({ events });
}
