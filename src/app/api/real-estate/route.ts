import { NextResponse } from "next/server";
import {
  getPublicAgents,
  getPublicListings,
  loadRealEstate,
  marketSummary,
} from "@/lib/realEstate";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = loadRealEstate();
  return NextResponse.json({
    listings: getPublicListings(),
    agents: getPublicAgents(),
    market: data.market,
    summary: marketSummary(),
  });
}
