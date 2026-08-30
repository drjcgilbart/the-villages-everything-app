import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteLocalService,
  loadLocalServicesAsync,
  setLocalServiceStatus,
  setLocalServiceVillagerOwned,
  updateLocalService,
} from "@/lib/localServices";
import { isVillagerOwned } from "@/lib/localServicesTypes";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await loadLocalServicesAsync();
  return NextResponse.json({
    listings: data.listings,
    pending: data.listings.filter((l) => l.status === "pending"),
    approved: data.listings.filter((l) => l.status === "approved"),
    updatedAt: data.updatedAt,
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const action = String(body.action || "").toLowerCase();
    const id = String(body.id || "").trim();
    if (!id) throw new Error("id is required");

    if (action === "approve" || action === "reject" || action === "pending") {
      const listing = await setLocalServiceStatus(
        id,
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : "pending"
      );
      return NextResponse.json({
        ok: true,
        listing,
        message:
          action === "approve"
            ? `${listing.businessName} is now live on Local Pros.`
            : `Listing marked ${action}.`,
      });
    }

    if (action === "update") {
      const listing = await updateLocalService(id, {
        businessName: body.businessName,
        contactName: body.contactName,
        category: body.category,
        description: body.description,
        village: body.village,
        serviceArea: body.serviceArea,
        phone: body.phone,
        email: body.email,
        website: body.website,
        photoUrl: body.photoUrl,
        extraPhotos: body.extraPhotos,
        photos: body.photos,
        adminNote: body.adminNote,
        villagerOwned:
          body.villagerOwned === undefined
            ? undefined
            : Boolean(body.villagerOwned),
      });
      return NextResponse.json({
        ok: true,
        listing,
        message: `Updated “${listing.businessName}”.`,
      });
    }

    if (action === "set-villager-owned") {
      const listing = await setLocalServiceVillagerOwned(
        id,
        Boolean(body.villagerOwned)
      );
      return NextResponse.json({
        ok: true,
        listing,
        message: isVillagerOwned(listing)
          ? `${listing.businessName} now shows the Villager badge.`
          : `${listing.businessName} no longer shows the Villager badge.`,
      });
    }

    if (action === "delete") {
      await deleteLocalService(id);
      return NextResponse.json({ ok: true, message: "Listing deleted" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Admin action failed" },
      { status: 400 }
    );
  }
}
