import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteListing,
  getPublicListings,
  loadRealEstate,
  upsertListing,
} from "@/lib/realEstate";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await isAdminAuthenticated();
  if (admin) {
    return NextResponse.json({ listings: loadRealEstate().listings });
  }
  return NextResponse.json({ listings: getPublicListings() });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = upsertListing({
      id: body.id || undefined,
      title: body.title,
      village: body.village,
      address: body.address,
      price: Number(body.price),
      beds: Number(body.beds),
      baths: Number(body.baths),
      sqft: body.sqft ? Number(body.sqft) : undefined,
      propertyType: body.propertyType,
      status: body.status,
      summary: body.summary,
      listingUrl: body.listingUrl,
      imageUrl: body.imageUrl,
      agentId: body.agentId,
      featured: !!body.featured,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save listing" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data = deleteListing(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete listing" },
      { status: 400 }
    );
  }
}
