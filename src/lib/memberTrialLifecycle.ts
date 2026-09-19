import { ensureDurableHydrated } from "./dataFs";
import { isPaidPlan } from "./membershipTiers";
import {
  isRoyaltyTrialActive,
  loadMemberSpaces,
  saveMemberSpacesAsync,
  standingPlan,
  trialDaysRemaining,
  updateMemberSpace,
  type MemberSpaceRecord,
} from "./memberSpace";
import { sendTrialReminderEmail } from "./memberTrialMail";
import {
  appendAdminLog,
  getMemberById,
  loadYardSale,
  saveYardSaleAsync,
} from "./yardSale";

export const TRIAL_REMINDER_DAYS = 7;

export type TrialSweepResult = {
  reminded: number;
  expired: number;
  skippedPaid: number;
  errors: string[];
};

function currentTrial(memberId: string): MemberSpaceRecord["trial"] {
  const data = loadMemberSpaces();
  return data.spaces.find((s) => s.memberId === memberId)?.trial || null;
}

/**
 * Daily sweep: email the 7-day reminder once, then when the free month
 * actually ends move unpaid neighbors back to Porch Waver (paid plans stay).
 */
export async function sweepRoyaltyTrials(opts?: {
  sendMail?: boolean;
}): Promise<TrialSweepResult> {
  const sendMail = opts?.sendMail !== false;
  await ensureDurableHydrated();
  const result: TrialSweepResult = {
    reminded: 0,
    expired: 0,
    skippedPaid: 0,
    errors: [],
  };

  const spaces = loadMemberSpaces().spaces;
  for (const space of spaces) {
    const trial = space.trial;
    if (!trial?.expiresAt) continue;

    const standing = standingPlan(space);
    const paid = isPaidPlan(standing);
    const active = isRoyaltyTrialActive(space);
    const days = trialDaysRemaining(trial.expiresAt);

    if (
      sendMail &&
      active &&
      !paid &&
      days !== null &&
      days <= TRIAL_REMINDER_DAYS &&
      days >= 1 &&
      !trial.reminderSentAt
    ) {
      const member = getMemberById(space.memberId);
      const mail = await sendTrialReminderEmail(
        { name: member?.name, email: member?.email },
        days
      );
      if (mail.ok) {
        const latest = currentTrial(space.memberId) || trial;
        updateMemberSpace(space.memberId, {
          trial: {
            ...latest,
            reminderSentAt: new Date().toISOString(),
          },
        });
        appendAdminLog(
          space.memberId,
          `Seven-day trial reminder emailed (${days} day${days === 1 ? "" : "s"} left).`
        );
        result.reminded += 1;
      } else if ("error" in mail && mail.error) {
        result.errors.push(`${space.memberId}: ${mail.error}`);
      } else {
        result.errors.push(`${space.memberId}: mail not configured`);
      }
    }

    if (!active && !trial.endedAt) {
      const latest = currentTrial(space.memberId) || trial;
      if (paid) {
        updateMemberSpace(space.memberId, {
          trial: { ...latest, endedAt: new Date().toISOString() },
        });
        appendAdminLog(
          space.memberId,
          "Free month ended — paid membership kept."
        );
        result.skippedPaid += 1;
      } else {
        updateMemberSpace(space.memberId, {
          plan: "porch_waver",
          trial: { ...latest, endedAt: new Date().toISOString() },
        });
        appendAdminLog(
          space.memberId,
          "Free month ended — moved back to Porch Waver."
        );
        result.expired += 1;
      }
    }
  }

  await saveMemberSpacesAsync(loadMemberSpaces());
  await saveYardSaleAsync(loadYardSale());
  return result;
}
