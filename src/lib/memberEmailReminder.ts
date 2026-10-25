import { isAppleReviewEmail } from "./appleReviewAccount";
import { sendMemberVerificationEmail, memberEmailIsVerified } from "./memberEmailVerify";
import { hydrateYardSale, loadYardSale, markEmailConfirmReminderSent } from "./yardSale";

/** Florida calendar day, so "the day after" matches the join date neighbors see. */
export function floridaDateKey(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * One reminder for each pending member who still has not pressed Confirm my email
 * and whose request date is before today. A later run does not send it again.
 */
export async function sweepUnconfirmedEmailReminders() {
  await hydrateYardSale();
  const today = floridaDateKey();
  const due = loadYardSale().members.filter((member) => {
    if (member.status !== "pending") return false;
    if (memberEmailIsVerified(member)) return false;
    if (isAppleReviewEmail(member.email)) return false;
    if (member.emailConfirmReminderSentAt) return false;
    if (!member.email || !member.createdAt) return false;
    const created = Date.parse(member.createdAt);
    if (!Number.isFinite(created)) return false;
    return floridaDateKey(new Date(created)) < today;
  });

  let sent = 0;
  const failed: string[] = [];
  for (const member of due) {
    const result = await sendMemberVerificationEmail(member.id, { reminder: true });
    if (!result.ok) {
      failed.push(member.id);
      continue;
    }
    if (result.already) continue;
    await markEmailConfirmReminderSent(member.id);
    sent += 1;
  }
  return { due: due.length, sent, failed: failed.length };
}
