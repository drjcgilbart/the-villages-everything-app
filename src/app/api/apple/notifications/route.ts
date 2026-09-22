import { NextRequest, NextResponse } from "next/server";
import { applyAppleTransaction, verifyAppleNotification, verifyAppleTransaction } from "@/lib/appleMembership";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * App Store Server Notifications V2.
 * Renewals, expirations, and refunds update the same neighbor account.
 */
export async function POST(req: NextRequest) {
  let signedPayload = "";
  try {
    const body = (await req.json()) as { signedPayload?: string };
    signedPayload = String(body.signedPayload || "").trim();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!signedPayload) {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }
  try {
    const note = await verifyAppleNotification(signedPayload);
    const signedTransaction = note.data?.signedTransactionInfo;
    if (signedTransaction) {
      const tx = await verifyAppleTransaction(signedTransaction);
      try {
        await applyAppleTransaction(tx);
      } catch (e) {
        const message = e instanceof Error ? e.message : "";
        if (!/sign in/i.test(message)) throw e;
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Apple notification", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not apply Apple notification" }, { status: 500 });
  }
}
