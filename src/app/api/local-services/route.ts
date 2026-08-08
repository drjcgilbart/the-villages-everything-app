import { NextResponse } from "next/server";
import {
  listApprovedServices,
  loadLocalServicesAsync,
  submitLocalService,
} from "@/lib/localServices";
import { LOCAL_SERVICE_CATEGORIES } from "@/lib/localServicesTypes";

export const dynamic = "force-dynamic";

/** Public: approved service directory + form metadata */
export async function GET() {
  try {
    const data = await loadLocalServicesAsync();
    const approved = listApprovedServices(data);
    return NextResponse.json({
      listings: approved,
      categories: LOCAL_SERVICE_CATEGORIES,
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
  try {
    const body = await req.json();
    const listing = await submitLocalService({
      businessName: body.businessName,
      contactName: body.contactName,
      category: body.category,
      description: body.description,
      village: body.village,
      phone: body.phone,
      email: body.email,
      website: body.website,
      photoUrl: body.photoUrl,
      submittedByName: body.submittedByName,
      replacesId: body.replacesId,
    });
    return NextResponse.json({
      ok: true,
      listing: {
        id: listing.id,
        businessName: listing.businessName,
        status: listing.status,
        replacesId: listing.replacesId,
      },
      message: listing.replacesId
        ? "Update submitted! An admin will review it before the public page changes."
        : "Thanks! Your listing is pending admin approval. Once approved, it appears on Support Local Villagers.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submit failed" },
      { status: 400 }
    );
  }
}
