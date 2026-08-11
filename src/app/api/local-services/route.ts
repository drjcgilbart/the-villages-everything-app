import { NextResponse } from "next/server";
import {
  computeServiceStats,
  listApprovedServices,
  loadLocalServicesAsync,
  submitLocalService,
} from "@/lib/localServices";
import {
  categoriesForScope,
  listingScope,
  type LocalServiceScope,
} from "@/lib/localServicesTypes";

export const dynamic = "force-dynamic";

function parseScopeParam(v: string | null): LocalServiceScope {
  return v === "area" ? "area" : "villager";
}

/** Public: approved service directory + form metadata (filtered by scope) */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = parseScopeParam(searchParams.get("scope"));
    const data = await loadLocalServicesAsync();
    const approved = listApprovedServices(data, scope).map((l) => ({
      ...l,
      stats: computeServiceStats(l.id, data.reviews),
    }));
    return NextResponse.json({
      listings: approved,
      categories: categoriesForScope(scope),
      scope,
      pendingCount: data.listings.filter(
        (l) => l.status === "pending" && listingScope(l) === scope
      ).length,
      updatedAt: data.updatedAt,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not load local services",
      },
      { status: 500 }
    );
  }
}

/** Public: submit a new listing or an update for admin approval */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scope: LocalServiceScope =
      body.scope === "area" ? "area" : "villager";
    const listing = await submitLocalService({
      businessName: body.businessName,
      contactName: body.contactName,
      category: body.category,
      description: body.description,
      village: body.village,
      serviceArea: body.serviceArea,
      address: body.address,
      phone: body.phone,
      email: body.email,
      website: body.website,
      mapsUrl: body.mapsUrl,
      photoUrl: body.photoUrl,
      extraPhotos: body.extraPhotos,
      photos: body.photos,
      submittedByName: body.submittedByName,
      replacesId: body.replacesId,
      scope,
    });
    const liveWhere =
      scope === "area"
        ? "Local Pros (area businesses)"
        : "Support Local Villagers";
    return NextResponse.json({
      ok: true,
      listing: {
        id: listing.id,
        businessName: listing.businessName,
        status: listing.status,
        replacesId: listing.replacesId,
        scope: listing.scope || "villager",
      },
      message: listing.replacesId
        ? "Update submitted! An admin will review it before the public page changes."
        : `Thanks! Your listing is pending admin approval. Once approved, it appears on ${liveWhere}.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submit failed" },
      { status: 400 }
    );
  }
}
