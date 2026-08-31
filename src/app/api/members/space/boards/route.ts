import { NextRequest, NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import {
  STORED_BOARD_FEATURE,
  getMemberBoards,
  isStoredBoardId,
  saveMemberBoard,
} from "@/lib/memberBoards";
import { getMemberSpace, memberCanAccess } from "@/lib/memberSpace";

export const dynamic = "force-dynamic";

export async function GET() {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  const space = getMemberSpace(member.id);
  const all = getMemberBoards(member.id);
  const boards: Record<string, unknown> = {};
  for (const [id, feature] of Object.entries(STORED_BOARD_FEATURE)) {
    if (memberCanAccess(space, feature)) {
      boards[id] = all[id as keyof typeof all];
    }
  }
  return NextResponse.json({ boards });
}

export async function PUT(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "Membership must be approved first" },
      { status: 403 }
    );
  }

  let body: { board?: string; data?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const boardId = String(body.board || "");
  if (!isStoredBoardId(boardId)) {
    return NextResponse.json({ error: "Unknown board" }, { status: 400 });
  }

  const space = getMemberSpace(member.id);
  const feature = STORED_BOARD_FEATURE[boardId];
  if (!memberCanAccess(space, feature)) {
    return NextResponse.json(
      { error: "This board is locked on your plan" },
      { status: 403 }
    );
  }

  const saved = await saveMemberBoard(member.id, boardId, body.data);
  return NextResponse.json({ board: boardId, data: saved });
}
