import { NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import {
  blockMember,
  blockedIdsFor,
  listBlocksFor,
  unblockMember,
} from "@/lib/safety";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ member: null, blockedIds: [], blocks: [] });
  }
  return NextResponse.json({
    member: { id: member.id, name: member.name },
    blockedIds: [...blockedIdsFor(member.id)],
    blocks: listBlocksFor(member.id),
  });
}

export async function POST(req: Request) {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in to block someone" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      memberId?: string;
      unblock?: boolean;
    };
    const targetId = String(body.memberId || "").trim();
    if (body.unblock) {
      await unblockMember(member.id, targetId);
      return NextResponse.json({
        ok: true,
        blockedIds: [...blockedIdsFor(member.id)],
      });
    }
    await blockMember(member.id, targetId);
    return NextResponse.json({
      ok: true,
      blockedIds: [...blockedIdsFor(member.id)],
      message: "You won’t see this neighbor’s posts while you’re signed in.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update block list" },
      { status: 400 }
    );
  }
}
