import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember } from "@/lib/memberAuth";
import {
  getApprovedListings,
  getListingsByMember,
  listAllListings,
  listingWithSeller,
} from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Public: approved listings. Admin: all. Member: optional mine=1 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "1";
  const all = searchParams.get("all") === "1";

  if (all) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const listings = listAllListings().map(listingWithSeller);
    return NextResponse.json({ listings });
  }

  if (mine) {
    const member = await getSessionMember();
    if (!member) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    const listings = getListingsByMember(member.id);
    return NextResponse.json({ listings });
  }

  const listings = getApprovedListings().map(listingWithSeller);
  return NextResponse.json({ listings });
}
