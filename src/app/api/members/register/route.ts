import { NextResponse } from "next/server";
import { acceptHouseholdInvite } from "@/lib/household";
import { memberCookieOptions } from "@/lib/memberAuth";
import { loadMemberSpaces, saveMemberSpacesAsync } from "@/lib/memberSpace";
import {
  getMemberById,
  hydrateYardSale,
  loadYardSale,
  markMemberEmailVerified,
  registerMember,
  saveYardSaleAsync,
  toPublicMember,
} from "@/lib/yardSale";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { grantSiteOwnerFullAccess } from "@/lib/siteOwnerAccess";
import { isSiteOwnerEmail } from "@/lib/siteOwner";
import {
  memberEmailIsVerified,
  notifyAdminOfConfirmedMemberRequest,
  sendMemberVerificationEmail,
} from "@/lib/memberEmailVerify";
import { isolateAllCopiedOwnerBoards, seedNewMemberBoards } from "@/lib/memberBoards";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "member-register", 6);
  if (limited) return limited;
  try {
    await hydrateYardSale();
    const body = await req.json();
    const member = registerMember({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      village: body.village,
    });
    const householdToken = String(body.householdToken || "").trim();
    let householdJoined = false;
    let householdError: string | null = null;
    if (householdToken) {
      try {
        acceptHouseholdInvite(member.id, householdToken);
        householdJoined = true;
        await saveMemberSpacesAsync(loadMemberSpaces());
      } catch (err) {
        householdError =
          err instanceof Error ? err.message : "Could not join that household.";
      }
    }
    await saveYardSaleAsync(loadYardSale());
    const stored = getMemberById(member.id);
    const wasVerified = stored ? memberEmailIsVerified(stored) : false;
    let mailFailed = false;
    if (isSiteOwnerEmail(member.email)) {
      await markMemberEmailVerified(member.id);
    } else if (!wasVerified) {
      const sent = await sendMemberVerificationEmail(member.id);
      mailFailed = !sent.ok;
    }
    if (!isSiteOwnerEmail(member.email)) {
      await seedNewMemberBoards(member.id);
      await isolateAllCopiedOwnerBoards();
    }
    if (isSiteOwnerEmail(member.email)) {
      const full = getMemberById(member.id);
      if (full) {
        await grantSiteOwnerFullAccess(full);
      }
    }
    const ownerReady = isSiteOwnerEmail(member.email);
    const updatedPending =
      !ownerReady && member.status === "pending" && !householdJoined;
    const fresh = getMemberById(member.id);
    const confirmed = fresh ? memberEmailIsVerified(fresh) : wasVerified;
    if (updatedPending && confirmed && fresh) {
      await notifyAdminOfConfirmedMemberRequest(fresh);
    }
    const publicMember = fresh ? toPublicMember(fresh) : member;
    const waitingNote = mailFailed
      ? " The confirmation email did not send. Sign in and press Send the confirmation email. The request stays off the admin list until the inbox is confirmed."
      : " Open that email and press Confirm my email. The request goes to the admin only after that. You can sign in with this password while you wait.";
    const message = ownerReady
      ? "Site owner is approved with full My Space access. Open My Space."
      : householdJoined
      ? `You’re in on this browser. Open My Space — your boards are yours, on that household plan.${
          confirmed ? "" : waitingNote
        }`
      : updatedPending && confirmed
        ? "Thanks! This email is already confirmed, so the request is with the admin. You can sign in while it is pending. Posting listings still needs admin approval."
        : updatedPending
          ? `Thanks! Your membership request is saved.${waitingNote} Posting listings still needs admin approval after that.`
          : `Thanks! Your membership request was submitted.${
              confirmed ? " You’ll be able to post listings after the admin approves you." : waitingNote
            }`;
    const res = NextResponse.json({
      ok: true,
      member: publicMember,
      householdJoined,
      householdError,
      message: householdError ? `${message} ${householdError}` : message,
    });
    if (householdJoined || ownerReady) {
      const cookie = memberCookieOptions(member.id);
      res.cookies.set(cookie.name, cookie.value, cookie);
    }
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Registration failed" },
      { status: 400 }
    );
  }
}
