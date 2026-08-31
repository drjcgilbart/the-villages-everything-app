import { NextRequest, NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import {
  acceptHouseholdInvite,
  householdClientPayload,
  inviteHouseholdMember,
  leaveHousehold,
  peekHouseholdInvite,
  removeHouseholdMember,
  revokeHouseholdInvite,
} from "@/lib/household";
import { getSessionMember } from "@/lib/memberAuth";
import {
  getMemberSpace,
  loadMemberSpaces,
  publicSpacePayload,
  saveMemberSpacesAsync,
} from "@/lib/memberSpace";
import { loadYardSale, saveYardSaleAsync, toPublicMember } from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function persistAll() {
  await saveMemberSpacesAsync(loadMemberSpaces());
  await saveYardSaleAsync(loadYardSale());
}

function payloadFor(memberId: string) {
  const space = getMemberSpace(memberId);
  return {
    space: {
      ...publicSpacePayload(space),
      household: householdClientPayload(memberId, space),
    },
  };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (token) {
    const limited = rateLimitResponse(req, "household-peek", 20);
    if (limited) return limited;
    const peek = peekHouseholdInvite(token);
    if (!peek) {
      return NextResponse.json(
        { error: "That household invite is missing or expired." },
        { status: 404 }
      );
    }
    return NextResponse.json({ invite: peek });
  }

  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  const space = getMemberSpace(member.id);
  return NextResponse.json({
    member: toPublicMember(member),
    space: {
      ...publicSpacePayload(space),
      household: householdClientPayload(member.id, space),
    },
  });
}

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req, "household", 20);
  if (limited) return limited;

  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  let body: {
    action?: string;
    email?: string;
    name?: string;
    token?: string;
    inviteId?: string;
    memberId?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = String(body.action || "").trim();
  try {
    if (action === "invite") {
      if (member.status !== "approved") {
        return NextResponse.json(
          { error: "Your neighbor account must be approved before inviting." },
          { status: 403 }
        );
      }
      const invited = inviteHouseholdMember(member.id, body.email || "", body.name);
      await persistAll();
      return NextResponse.json({
        ok: true,
        joinPath: invited.joinPath,
        email: invited.invite.email,
        ...payloadFor(member.id),
      });
    }

    if (action === "accept") {
      acceptHouseholdInvite(member.id, body.token);
      await persistAll();
      const next = getMemberSpace(member.id);
      return NextResponse.json({
        ok: true,
        member: toPublicMember(member),
        space: {
          ...publicSpacePayload(next),
          household: householdClientPayload(member.id, next),
        },
      });
    }

    if (action === "revoke") {
      revokeHouseholdInvite(member.id, String(body.inviteId || ""));
      await persistAll();
      return NextResponse.json({ ok: true, ...payloadFor(member.id) });
    }

    if (action === "remove") {
      removeHouseholdMember(member.id, String(body.memberId || ""));
      await persistAll();
      return NextResponse.json({ ok: true, ...payloadFor(member.id) });
    }

    if (action === "leave") {
      leaveHousehold(member.id);
      await persistAll();
      return NextResponse.json({ ok: true, ...payloadFor(member.id) });
    }

    return NextResponse.json({ error: "Unknown household action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Household update failed" },
      { status: 400 }
    );
  }
}
