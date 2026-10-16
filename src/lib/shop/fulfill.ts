import type Stripe from "stripe";
import { DedupeStore } from "./idempotency";
import { createPrintfulOrder, sessionToPrintfulOrder } from "./printful";
import { autoConfirm, SHOP_SESSION_SOURCE } from "./config";
import { logError, logInfo } from "./log";

type Deps = {
  store: DedupeStore;
  retrieveSession: (id: string) => Promise<Stripe.Checkout.Session>;
  createOrder?: typeof createPrintfulOrder;
};

/** Handle a verified Stripe event. Returns a short status string. Idempotent by session id. */
export async function handleStripeEvent(event: Stripe.Event, deps: Deps): Promise<string> {
  if (event.type !== "checkout.session.completed") return "ignored";
  const partial = event.data.object as Stripe.Checkout.Session;
  // Same Stripe account as memberships and tips: only shop sessions become Printful orders.
  if (partial.metadata?.source !== SHOP_SESSION_SOURCE) return "not-shop";
  if (partial.payment_status !== "paid") return "unpaid";
  if (deps.store.claim) {
    if (!(await deps.store.claim(partial.id))) return "duplicate";
  } else {
    if (await deps.store.has(partial.id)) return "duplicate";
    await deps.store.add(partial.id);
  }
  try {
    const session = await deps.retrieveSession(partial.id);
    const order = sessionToPrintfulOrder(session);
    const result = await (deps.createOrder ?? createPrintfulOrder)(order, autoConfirm());
    logInfo("shop-stripe-webhook", "printful order created", { session: partial.id, printfulId: result?.id, status: result?.status });
    return "created";
  } catch (err) {
    await deps.store.remove(partial.id); // let Stripe retry
    logError("shop-stripe-webhook", err, { session: partial.id });
    throw err;
  }
}
