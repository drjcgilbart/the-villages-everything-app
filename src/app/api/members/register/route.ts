import { NextResponse } from "next/server";
import { notifyAdminOfApprovalRequest } from "@/lib/adminNotify";
import { acceptHouseholdInvite } from "@/lib/household";
import { memberCookieOptions } from "@/lib/memberAuth";
import { loadMemberSpaces, saveMemberSpacesAsync } from "@/lib/memberSpace";
import {
  getMemberById,
  hydrateYardSale,
  loadYardSale,
  registerMember,
  saveYardSaleAsync,
  toPublicMember,
} from "@/lib/yardSale";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { grantSiteOwnerFullAccess } from "@/lib/siteOwnerAccess";
import { isSiteOwnerEmail } from "@/lib/siteOwner";

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
    if (isSiteOwnerEmail(member.email)) {
      const full = getMemberById(member.id);
      if (full) {
        await grantSiteOwnerFullAccess(full);
      }
    }
    const ownerReady = isSiteOwnerEmail(member.email);
    const updatedPending =
      !ownerReady && member.status === "pending" && !householdJoined;
    if (updatedPending) {
      await notifyAdminOfApprovalRequest({
        topic: "Members",
        title: member.name,
        submittedBy: member.name,
        createdAt: member.createdAt,
        details: {
          name: member.name,
          email: member.email,
          phone: member.phone,
          village: member.village,
          status: member.status,
        },
      });
    }
    const fresh = getMemberById(member.id);
    const publicMember = fresh ? toPublicMember(fresh) : member;
    const message = ownerReady
      ? "Site owner is approved with full My Space access. Open My Space."
      : householdJoined
      ? "You’re in on this browser. Open My Space — your boards are yours, on that household plan."
      : updatedPending
        ? "Thanks! Your membership request is on file (or was updated). You can sign in with this password while pending; posting listings still needs admin approval."
        : "Thanks! Your membership request was submitted. You’ll be able to post listings after the admin approves you.";
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
