import { NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember } from "@/lib/memberAuth";
import { isInsecureAdminConfig, secretsMatch } from "@/lib/security";
import { isSiteOwnerEmail } from "@/lib/siteOwner";
import {
  changeOwnPassword,
  hydrateYardSale,
  loadYardSale,
  saveYardSaleAsync,
  setMemberPassword,
  verifyPassword,
} from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "member-password", 6);
  if (limited) return limited;

  try {
    await hydrateYardSale();
    const member = await getSessionMember();
    if (!member) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }
    const body = (await req.json().catch(() => ({}))) as {
      currentPassword?: string;
      newPassword?: string;
    };
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    const hubOk = verifyPassword(currentPassword, member.passwordHash);
    const ownerAdminOk =
      isSiteOwnerEmail(member.email) &&
      !isInsecureAdminConfig() &&
      secretsMatch(currentPassword, getAdminPassword());

    if (ownerAdminOk && !hubOk) {
      // Owner signed in with ADMIN_PASSWORD; set a real Hub password.
      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
      }
      setMemberPassword(member.id, newPassword);
    } else {
      changeOwnPassword(member.id, currentPassword, newPassword);
    }

    await saveYardSaleAsync(loadYardSale());
    return NextResponse.json({
      ok: true,
      message: "Password updated. Use the new password next time you sign in.",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not change password";
    const status = /incorrect|sign in/i.test(msg) ? 401 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
