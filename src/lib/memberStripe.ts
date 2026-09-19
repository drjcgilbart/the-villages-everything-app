import { ensureDurableHydrated } from "./dataFs";
import {
  loadMemberSpaces,
  saveMemberSpacesAsync,
  updateMemberSpace,
} from "./memberSpace";
import {
  getTier,
  normalizePlan,
  planFromStripePriceId,
  type HubPlanId,
} from "./membershipTiers";
import { getStripe } from "./stripe";
import {
  appendAdminLog,
  loadYardSale,
  saveYardSaleAsync,
} from "./yardSale";

export type FulfilledMembership = {
  memberId: string;
  plan: HubPlanId;
  planLabel: string;
};

/**
 * Verify a Stripe Checkout session and persist the paid Hub plan to Redis/Blob.
 * Callers must not use the sync updateMemberSpace-only path on Vercel — that
 * write dies with the serverless instance and the neighbor looks unpaid.
 */
export async function fulfillPaidMembershipSession(
  sessionId: string,
  opts?: { requireMemberId?: string }
): Promise<FulfilledMembership> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }
  await ensureDurableHydrated();

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price"],
  });

  if (session.mode !== "subscription") {
    throw new Error("Not a membership checkout");
  }
  if (session.payment_status !== "paid" && session.status !== "complete") {
    throw new Error("Payment not complete");
  }

  const memberId = String(
    session.metadata?.memberId || session.client_reference_id || ""
  ).trim();
  if (!memberId) {
    throw new Error("Checkout is missing the member id");
  }
  if (opts?.requireMemberId && opts.requireMemberId !== memberId) {
    throw new Error("Signed-in account doesn’t match this payment");
  }

  let plan: HubPlanId = normalizePlan(
    session.metadata?.plan || "cart_path_regular"
  );
  const priceId =
    session.line_items?.data?.[0]?.price &&
    typeof session.line_items.data[0].price === "object"
      ? session.line_items.data[0].price.id
      : null;
  if (priceId) {
    plan = planFromStripePriceId(priceId);
  }
  if (session.metadata?.plan) {
    plan = normalizePlan(session.metadata.plan);
  }

  const subId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  const custId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  updateMemberSpace(memberId, {
    plan,
    ...(subId ? { stripeSubscriptionId: subId } : {}),
    ...(custId ? { stripeCustomerId: custId } : {}),
  });
  await saveMemberSpacesAsync(loadMemberSpaces());

  const planLabel = getTier(plan).label;
  appendAdminLog(memberId, `Paid ${planLabel} via Stripe.`);
  await saveYardSaleAsync(loadYardSale());

  return { memberId, plan, planLabel };
}
