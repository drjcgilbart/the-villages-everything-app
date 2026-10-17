import { NextResponse } from "next/server";
import { getBadgeTheme } from "@/lib/shop/badges";
import { checkCustomBadge, PricingError } from "@/lib/shop/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Server check for a custom badge before it goes in the cart (checkout re-checks it). Same rules + profanity filter. */
export async function POST(req: Request) {
  let body: { theme?: unknown; name?: unknown; village?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const theme = getBadgeTheme(String(body?.theme ?? ""));
  if (!theme) return NextResponse.json({ error: "Please pick a theme." }, { status: 400 });
  try {
    const text = checkCustomBadge(theme, body);
    return NextResponse.json({ ok: true, theme: theme.id, text });
  } catch (err) {
    if (err instanceof PricingError) return NextResponse.json({ ok: false, error: err.message, fields: err.fields }, { status: 400 });
    return NextResponse.json({ ok: false, error: "Could not check that badge. Please try again." }, { status: 500 });
  }
}
