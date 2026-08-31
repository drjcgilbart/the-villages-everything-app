import { NextResponse } from "next/server";
import { confirmGolfCartHeroSession } from "@/lib/golfCartHeroDonate";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!getStripe()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let body: { sessionId?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = String(body.sessionId || "").trim();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  try {
    const result = await confirmGolfCartHeroSession(sessionId);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Confirm failed";
    console.error("golf-cart-hero donate confirm error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
