import { NextResponse } from "next/server";
import { stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ready: stripeConfigured() });
}
