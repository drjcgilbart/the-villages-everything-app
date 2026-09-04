import { getAdminPassword } from "./auth";
import { cacheDurableJson, pullDurableJson } from "./dataFs";
import {
  loadMemberSpaces,
  saveMemberSpacesAsync,
  updateMemberSpace,
} from "./memberSpace";
import { isInsecureAdminConfig, secretsMatch } from "./security";
import { isSiteOwnerEmail } from "./siteOwner";
import {
  ensureApprovedOwnerMember,
  getMemberByEmail,
  hydrateYardSale,
  loadYardSale,
  saveYardSaleAsync,
  verifyPassword,
} from "./yardSale";
import type { Member } from "./yardSaleTypes";

async function pullOwnerDurable() {
  await hydrateYardSale();
  try {
    const text = await pullDurableJson("member-space.json");
    if (text) cacheDurableJson("member-space.json", text);
  } catch (err) {
    console.error("[owner] member-space pull failed", err);
  }
}

function adminPasswordUnlocks(password: string): boolean {
  if (isInsecureAdminConfig()) return false;
  return secretsMatch(String(password || ""), getAdminPassword());
}

/** Approve the owner member and unlock Square Royalty (persisted to Redis). */
export async function grantSiteOwnerFullAccess(member: Member): Promise<Member> {
  if (!isSiteOwnerEmail(member.email)) return member;
  if (member.status === "rejected" || member.status === "suspended") {
    return member;
  }
  await pullOwnerDurable();
  const approved = ensureApprovedOwnerMember(member.email);
  updateMemberSpace(approved.id, {
    plan: "square_royalty",
    planExpiresAt: null,
  });
  await saveYardSaleAsync(loadYardSale());
  await saveMemberSpacesAsync(loadMemberSpaces());
  return approved;
}

/**
 * Sign-in path for allowlisted owner emails.
 * Accepts the Hub password on that account, or a strong ADMIN_PASSWORD.
 * Never hardcodes a password. Creates the Hub account if Redis/Blob lost it.
 */
export async function unlockSiteOwnerByPassword(
  email: string,
  password: string
): Promise<Member | null> {
  if (!isSiteOwnerEmail(email)) return null;
  await pullOwnerDurable();
  const existing = getMemberByEmail(email);
  const pw = String(password || "");
  if (existing) {
    const hubOk = verifyPassword(pw, existing.passwordHash);
    const adminOk = adminPasswordUnlocks(pw);
    if (!hubOk && !adminOk) return null;
    if (existing.status === "rejected" || existing.status === "suspended") {
      throw new Error("This account is suspended. Contact the site admin.");
    }
    return grantSiteOwnerFullAccess(existing);
  }
  if (pw.length < 8 && !adminPasswordUnlocks(pw)) return null;
  const created = ensureApprovedOwnerMember(email, pw);
  return grantSiteOwnerFullAccess(created);
}
