import { NextResponse } from "next/server";
import { notifyAdminOfApprovalRequest } from "@/lib/adminNotify";
import {
  computeServiceStats,
  listApprovedServices,
  loadLocalServicesAsync,
  submitLocalService,
} from "@/lib/localServices";
import {
  LOCAL_PROS_CATEGORIES,
  isVillagerOwned,
} from "@/lib/localServicesTypes";

export const dynamic = "force-dynamic";

/** Public: approved Local Pros directory (includes former Support Local listings). */
export async function GET() {
  try {
    const data = await loadLocalServicesAsync();
    const approved = listApprovedServices(data).map((l) => ({
      ...l,
      villagerOwned: isVillagerOwned(l),
      stats: computeServiceStats(l.id, data.reviews),
    }));
    return NextResponse.json({
      listings: approved,
      categories: LOCAL_PROS_CATEGORIES,
      pendingCount: data.listings.filter((l) => l.status === "pending").length,
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
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "local-svc-submit", 8, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
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
      scope: "area",
      villagerOwned: Boolean(body.villagerOwned),
    });
    await notifyAdminOfApprovalRequest({
      topic: listing.villagerOwned ? "Local Pros · Villager" : "Local Pros",
      title: listing.businessName,
      submittedBy: listing.submittedByName || listing.contactName,
      createdAt: listing.createdAt,
      details: {
        businessName: listing.businessName,
        contactName: listing.contactName,
        category: listing.category,
        description: listing.description,
        village: listing.village,
        serviceArea: listing.serviceArea,
        address: listing.address,
        phone: listing.phone,
        email: listing.email,
        website: listing.website,
        submittedBy: listing.submittedByName,
        villagerOwned: listing.villagerOwned ? "Yes — lives in The Villages" : "No",
        replacesId: listing.replacesId,
        listingId: listing.id,
      },
    });
    return NextResponse.json({
      ok: true,
      listing: {
        id: listing.id,
        businessName: listing.businessName,
        status: listing.status,
        replacesId: listing.replacesId,
        villagerOwned: listing.villagerOwned,
      },
      message: listing.replacesId
        ? "Update submitted! An admin will review it before the public page changes."
        : "Thanks! Your listing is pending admin approval. Once approved, it appears on Local Pros.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submit failed" },
      { status: 400 }
    );
  }
}
