import { readFileSync } from "fs";
import { join } from "path";
import {
  Environment,
  SignedDataVerifier,
  type JWSTransactionDecodedPayload,
} from "@apple/app-store-server-library";
import { ensureDurableHydrated } from "./dataFs";
import {
  getMemberSpace,
  loadMemberSpaces,
  standingPlan,
  updateMemberSpaceAsync,
  type MemberSpaceRecord,
} from "./memberSpace";
import {
  APPLE_BUNDLE_ID,
  getTier,
  planFromAppleProductId,
  planRank,
  type HubPlanId,
} from "./membershipTiers";
import { appendAdminLog, loadYardSale, saveYardSaleAsync } from "./yardSale";

const ROOTS = ["AppleRootCA-G3.cer", "AppleRootCA-G2.cer"].map((name) =>
  readFileSync(join(process.cwd(), "certs", "apple", name))
);

function appAppleId(): number | undefined {
  const n = Number(process.env.APPLE_APP_APPLE_ID || "");
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export async function verifyAppleTransaction(signedTransaction: string) {
  const bundleId = process.env.APPLE_BUNDLE_ID || APPLE_BUNDLE_ID;
  const appleId = appAppleId();
  const attempts = [
    new SignedDataVerifier(ROOTS, Boolean(appleId), Environment.PRODUCTION, bundleId, appleId),
    new SignedDataVerifier(ROOTS, false, Environment.SANDBOX, bundleId),
  ];
  let last: unknown;
  for (const verifier of attempts) {
    try {
      return await verifier.verifyAndDecodeTransaction(signedTransaction);
    } catch (e) {
      last = e;
    }
  }
  const message = last instanceof Error ? last.message : "Apple could not confirm that purchase";
  throw new Error(message);
}

export async function verifyAppleNotification(signedPayload: string) {
  const bundleId = process.env.APPLE_BUNDLE_ID || APPLE_BUNDLE_ID;
  const appleId = appAppleId();
  const attempts = [
    new SignedDataVerifier(ROOTS, Boolean(appleId), Environment.PRODUCTION, bundleId, appleId),
    new SignedDataVerifier(ROOTS, false, Environment.SANDBOX, bundleId),
  ];
  let last: unknown;
  for (const verifier of attempts) {
    try {
      return await verifier.verifyAndDecodeNotification(signedPayload);
    } catch (e) {
      last = e;
    }
  }
  throw last instanceof Error ? last : new Error("Apple notification could not be verified");
}

function findByApple(tx: JWSTransactionDecodedPayload): MemberSpaceRecord | null {
  const token = String(tx.appAccountToken || "").toLowerCase();
  const original = String(tx.originalTransactionId || "");
  const spaces = loadMemberSpaces().spaces;
  const hit = spaces.find((s) => {
    if (token && s.appleAppAccountToken && s.appleAppAccountToken === token) return true;
    if (original && s.appleOriginalTransactionId === original) return true;
    return false;
  });
  return hit ? getMemberSpace(hit.memberId) : null;
}

export async function applyAppleTransaction(
  tx: JWSTransactionDecodedPayload,
  opts?: { memberId?: string }
): Promise<{ memberId: string; plan: HubPlanId; planLabel: string; active: boolean }> {
  await ensureDurableHydrated();
  const plan = planFromAppleProductId(tx.productId);
  if (!plan) throw new Error("That Apple product is not one of the membership plans.");
  if (tx.bundleId && tx.bundleId !== (process.env.APPLE_BUNDLE_ID || APPLE_BUNDLE_ID)) {
    throw new Error("That purchase is for a different app.");
  }

  const bound = findByApple(tx);
  const memberId = opts?.memberId || bound?.memberId || "";
  if (!memberId) throw new Error("Sign in on this phone, then subscribe again.");
  if (bound && opts?.memberId && bound.memberId !== opts.memberId) {
    throw new Error("This Apple subscription is already on another neighbor account.");
  }

  const space = getMemberSpace(memberId);
  const token = String(tx.appAccountToken || "").toLowerCase();
  if (token && space.appleAppAccountToken && token !== space.appleAppAccountToken) {
    throw new Error("This Apple purchase belongs to a different neighbor account.");
  }

  const revoked = typeof tx.revocationDate === "number" && tx.revocationDate > 0;
  const expiresMs = typeof tx.expiresDate === "number" ? tx.expiresDate : 0;
  const active = !revoked && expiresMs > Date.now();
  const expiresAt = expiresMs ? new Date(expiresMs).toISOString() : null;

  if (!active) {
    const current = standingPlan(space);
    const applePlan = planFromAppleProductId(space.appleProductId);
    const drop = !space.stripeSubscriptionId && applePlan && applePlan === current;
    await updateMemberSpaceAsync(memberId, {
      ...(drop ? { plan: "porch_waver" as const } : {}),
      appleOriginalTransactionId: tx.originalTransactionId || space.appleOriginalTransactionId,
      appleProductId: tx.productId || space.appleProductId,
      appleExpiresAt: expiresAt,
      ...(token ? { appleAppAccountToken: token } : {}),
    });
    appendAdminLog(memberId, "Apple subscription ended. Paid tools follow the website plan if there is one.");
    await saveYardSaleAsync(loadYardSale());
    return { memberId, plan: drop ? "porch_waver" : current, planLabel: getTier(drop ? "porch_waver" : current).label, active: false };
  }

  const current = standingPlan(space);
  const keepHigher =
    !!space.stripeSubscriptionId && planRank(current) > planRank(plan);
  const nextPlan = keepHigher ? current : plan;
  await updateMemberSpaceAsync(memberId, {
    plan: nextPlan,
    appleOriginalTransactionId: String(tx.originalTransactionId || ""),
    appleProductId: String(tx.productId || ""),
    appleExpiresAt: expiresAt,
    ...(token ? { appleAppAccountToken: token } : {}),
  });
  appendAdminLog(memberId, `Paid ${getTier(plan).label} via Apple.`);
  await saveYardSaleAsync(loadYardSale());
  return { memberId, plan: nextPlan, planLabel: getTier(nextPlan).label, active: true };
}
