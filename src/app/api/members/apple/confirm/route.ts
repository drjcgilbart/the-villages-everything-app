import { NextRequest, NextResponse } from "next/server";
import { applyAppleTransaction, verifyAppleTransaction } from "@/lib/appleMembership";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Verify a StoreKit purchase and write the plan onto the signed-in neighbor. */
export async function POST(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  let signedTransaction = "";
  try {
    const body = (await req.json()) as { signedTransaction?: string };
    signedTransaction = String(body.signedTransaction || "").trim();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!signedTransaction) {
    return NextResponse.json({ error: "Missing Apple purchase" }, { status: 400 });
  }
  try {
    const tx = await verifyAppleTransaction(signedTransaction);
    const result = await applyAppleTransaction(tx, { memberId: member.id });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save the Apple membership" },
      { status: 400 }
    );
  }
}
