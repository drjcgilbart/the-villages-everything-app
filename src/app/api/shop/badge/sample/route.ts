import { NextResponse } from "next/server";
import { getBadgeTheme, validateBadgeText } from "@/lib/shop/badges";
import { renderBadgePng } from "@/lib/shop/badge-render";
import { buildShopOrderEmail } from "@/lib/shop/fulfill";
import type { ShopOrderRecord } from "@/lib/shop/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Test-only helper for the badge print files and the admin order email. Off unless SHOP_BADGE_SAMPLES=true,
// and never on Vercel production. It sends nothing and stores nothing.
//   GET ?theme=edenfield&name=Mary&village=Fenney[&bleed=0]  -> print PNG
//   GET ?email=1                                             -> the admin email for a sample order, as JSON
function enabled() {
  return process.env.SHOP_BADGE_SAMPLES === "true" && process.env.VERCEL_ENV !== "production";
}

export async function GET(req: Request) {
  if (!enabled()) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const q = new URL(req.url).searchParams;
  if (q.get("email")) {
    const record: ShopOrderRecord = {
      sessionId: "cs_test_SAMPLEbadgeorder",
      createdAt: new Date().toISOString(),
      status: "needs-manual-fulfillment",
      reason: "Name badges only: made by hand from the attached print files.",
      amountTotalCents: 2000 + 2500 + 2500 + 599,
      shippingCents: 599,
      livemode: false,
      lines: [
        { sku: "badge-custom-edenfield", name: "Custom Name Badge", label: "\u201cMary\u201d \u00b7 Village of Fenney \u00b7 White Acrylic (1/8\" cast acrylic) \u00b7 3\" x 2\" magnetic", quantity: 1, unitCents: 2000, badge: { kind: "custom", theme: "edenfield", name: "Mary", village: "Fenney", size: "3x2in", material: "white-acrylic", materialLabel: "White Acrylic (1/8\" cast acrylic)" } },
        { sku: "badge-ready-lucy", name: "Lucy, Edenfield", label: "Ready-made design \u00b7 White Aluminum (.025\" gloss white aluminum) \u00b7 3\" x 2\" magnetic", quantity: 1, unitCents: 2500, badge: { kind: "ready", theme: "edenfield-ready", name: "Lucy", village: "Edenfield", size: "3x2in", material: "white-aluminum", materialLabel: "White Aluminum (.025\" gloss white aluminum)" } },
        { sku: "badge-custom-golf", name: "Custom Name Badge", label: "\u201cLinda\u201d \u00b7 White Aluminum (.025\" gloss white aluminum) \u00b7 3\" x 2\" magnetic", quantity: 1, unitCents: 2500, badge: { kind: "custom", theme: "golf", name: "Linda", size: "3x2in", material: "white-aluminum", materialLabel: "White Aluminum (.025\" gloss white aluminum)" } },
      ],
      recipient: { name: "Sample Buyer", address1: "1 Sample Way", city: "The Villages", state_code: "FL", country_code: "US", zip: "32162", email: "sample@example.com" },
    };
    const mail = await buildShopOrderEmail(record, { storeFiles: false });
    return NextResponse.json({
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      attachments: mail.attachments.map((a) => ({ filename: a.filename, bytes: Buffer.from(a.contentBase64, "base64").length, contentType: a.contentType })),
    });
  }
  const theme = getBadgeTheme(q.get("theme") ?? "");
  if (!theme) return NextResponse.json({ error: "Unknown theme" }, { status: 400 });
  const { ok, text, errors } = validateBadgeText(theme, { name: q.get("name"), village: q.get("village") });
  if (!ok) return NextResponse.json({ error: errors }, { status: 400 });
  const png = await renderBadgePng(theme, text, { bleed: q.get("bleed") !== "0" });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": "no-store" } });
}
