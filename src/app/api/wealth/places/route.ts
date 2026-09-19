import { NextResponse } from "next/server";
import { loadWealthLocalAsync } from "@/lib/wealthLocalStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadWealthLocalAsync();
  return NextResponse.json({
    places: data.places,
    updatedAt: data.updatedAt,
  });
}
