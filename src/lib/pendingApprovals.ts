import { loadBomAsync, updateBomEntryAsync } from "./bestOfMonth";
import { BOM_CATEGORY_META } from "./bestOfMonthTypes";
import { loadClubListingsAsync, saveClubListingsAsync } from "./clubListings";
import { membershipLabel } from "./clubListingsTypes";
import { ensureDurableHydrated } from "./dataFs";
import { listRestaurantSuggestions, loadDining, saveDining } from "./dining";
import { loadGolfClubAsync, updateAce, updateRound } from "./golfClub";
import { loadLocalServicesAsync, updateLocalService } from "./localServices";
import { isVillagerOwned, listingScope } from "./localServicesTypes";
import { loadMemberSpaces } from "./memberSpace";
import {
  loadPickleballClubAsync,
  savePickleballClubAsync,
} from "./pickleballClub";
import {
  getListingById,
  loadYardSale,
  saveYardSaleAsync,
  updateListing,
} from "./yardSale";

export type PendingKind =
  | "member"
  | "member-royalty"
  | "yard-sale"
  | "dining"
  | "best-of-month"
  | "golf-round"
  | "golf-ace"
  | "pickleball-rating"
  | "club"
  | "local-pros"
  | "support-local";

export type PendingTab =
  | "members"
  | "yard"
  | "dining"
  | "bestof"
  | "golf"
  | "pickleball"
  | "clubs"
  | "localsvc";

export type PendingDetail = { label: string; value: string };

export type PendingEditField = {
  key: string;
  label: string;
  value: string;
  input?: "text" | "textarea" | "number" | "date";
};

export type PendingItem = {
  id: string;
  kind: PendingKind;
  tab: PendingTab;
  topic: string;
  title: string;
  submittedBy: string;
  createdAt: string;
  summary: string;
  details: PendingDetail[];
  editFields: PendingEditField[];
};

function field(
  key: string,
  label: string,
  value: string | number | boolean | null | undefined,
  input: PendingEditField["input"] = "text"
): PendingEditField {
  return {
    key,
    label,
    value: value == null ? "" : String(value),
    input: input === "text" && String(value || "").length > 80 ? "textarea" : input,
  };
}

function d(label: string, value: string | number | boolean | null | undefined) {
  if (value == null) return null;
  const v = String(value).trim();
  if (!v) return null;
  return { label, value: v.slice(0, 800) };
}

function details(rows: (PendingDetail | null)[]): PendingDetail[] {
  return rows.filter((r): r is PendingDetail => Boolean(r));
}

export function emptyPendingCounts(): Record<PendingTab, number> {
  return {
    members: 0,
    yard: 0,
    dining: 0,
    bestof: 0,
    golf: 0,
    pickleball: 0,
    clubs: 0,
    localsvc: 0,
  };
}

export async function listPendingApprovals(): Promise<PendingItem[]> {
  await ensureDurableHydrated();
  const [golf, pickle, clubs, services, bom] = await Promise.all([
    loadGolfClubAsync(),
    loadPickleballClubAsync(),
    loadClubListingsAsync(),
    loadLocalServicesAsync(),
    loadBomAsync(),
  ]);
  const yard = loadYardSale();
  const spaces = loadMemberSpaces();
  const items: PendingItem[] = [];

  for (const m of yard.members) {
    if (m.status !== "pending") continue;
    items.push({
      id: m.id,
      kind: "member",
      tab: "members",
      topic: "Members",
      title: m.name,
      submittedBy: m.name,
      createdAt: m.createdAt,
      summary: `${m.email}${m.village ? ` · ${m.village}` : ""}`,
      details: details([
        d("Name", m.name),
        d("Email", m.email),
        d("Phone", m.phone),
        d("Village", m.village),
      ]),
      editFields: [
        field("name", "Name", m.name),
        field("email", "Email", m.email),
        field("phone", "Phone", m.phone),
        field("village", "Village", m.village),
      ],
    });
  }

  for (const space of spaces.spaces) {
    if (space.topTierNomination?.status !== "pending") continue;
    const member = yard.members.find((m) => m.id === space.memberId);
    const nom = space.topTierNomination;
    items.push({
      id: space.memberId,
      kind: "member-royalty",
      tab: "members",
      topic: "Members · Square Royalty",
      title: member?.name || space.memberId,
      submittedBy: member?.name || "Member",
      createdAt: nom.requestedAt,
      summary: `Square Royalty nomination (${nom.source})`,
      details: details([
        d("Member", member?.name),
        d("Email", member?.email),
        d("Source", nom.source),
        d("Proposed through", nom.proposedExpiresAt),
      ]),
      editFields: [],
    });
  }

  for (const l of yard.listings) {
    if (l.status !== "pending") continue;
    const member = yard.members.find((m) => m.id === l.memberId);
    items.push({
      id: l.id,
      kind: "yard-sale",
      tab: "yard",
      topic: "Yard Sale",
      title: l.title,
      submittedBy: member?.name || l.memberId,
      createdAt: l.createdAt,
      summary: l.isFree ? "Free" : l.price != null ? `$${l.price}` : l.category,
      details: details([
        d("Title", l.title),
        d("Category", l.category),
        d("Price", l.isFree ? "Free" : l.price != null ? `$${l.price}` : ""),
        d("Condition", l.condition),
        d("Description", l.description),
        d("Seller", member?.name),
        d("Seller email", member?.email),
        d("Photos", l.images?.length ? `${l.images.length} photo(s)` : ""),
      ]),
      editFields: [
        field("title", "Title", l.title),
        field("category", "Category", l.category),
        field("price", "Price", l.isFree ? "Free" : l.price, "text"),
        field("condition", "Condition", l.condition),
        field("description", "Description", l.description, "textarea"),
      ],
    });
  }

  for (const s of listRestaurantSuggestions({ status: "pending" })) {
    items.push({
      id: s.id,
      kind: "dining",
      tab: "dining",
      topic: "Dining",
      title: s.name,
      submittedBy: s.suggestedBy,
      createdAt: s.createdAt,
      summary: `${s.cuisine} · ${s.area}`,
      details: details([
        d("Restaurant", s.name),
        d("Cuisine", s.cuisine),
        d("Area", s.area),
        d("Address", s.address),
        d("Phone", s.phone),
        d("Website", s.website),
        d("Description", s.description),
        d("Suggested by", s.suggestedBy),
        d("Suggestor email", s.suggestedByEmail),
        d("Note", s.note),
      ]),
      editFields: [
        field("name", "Restaurant", s.name),
        field("cuisine", "Cuisine", s.cuisine),
        field("area", "Area", s.area),
        field("address", "Address", s.address),
        field("phone", "Phone", s.phone),
        field("website", "Website", s.website),
        field("description", "Description", s.description, "textarea"),
        field("note", "Note", s.note, "textarea"),
      ],
    });
  }

  for (const e of bom.entries) {
    if (e.status !== "pending") continue;
    items.push({
      id: e.id,
      kind: "best-of-month",
      tab: "bestof",
      topic: "Best of the Month",
      title: e.title,
      submittedBy: e.submitterName,
      createdAt: e.createdAt,
      summary: `${BOM_CATEGORY_META[e.category]?.label || e.category} · ${e.monthKey}`,
      details: details([
        d("Title", e.title),
        d("Category", BOM_CATEGORY_META[e.category]?.label || e.category),
        d("Month", e.monthKey),
        d("Submitted by", e.submitterName),
        d("Description", e.description),
        d("File", e.fileType),
        d("Image / PDF", e.imageUrl),
      ]),
      editFields: [
        field("title", "Title", e.title),
        field("submitterName", "Submitted by", e.submitterName),
        field("description", "Description", e.description, "textarea"),
      ],
    });
  }

  for (const r of golf.rounds) {
    if (r.status !== "pending") continue;
    items.push({
      id: r.id,
      kind: "golf-round",
      tab: "golf",
      topic: "Golf · round",
      title: `${r.playerName} · ${r.course}`,
      submittedBy: r.playerName,
      createdAt: r.createdAt,
      summary: `${r.holes} holes · score ${r.score}${r.handicap != null ? ` · HCP ${r.handicap}` : ""}`,
      details: details([
        d("Player", r.playerName),
        d("Course", r.course),
        d("Date", r.playDate),
        d("Time", r.playTime),
        d("Holes", r.holes),
        d("Score", r.score),
        d("Handicap", r.handicap),
        d("Notes", r.notes),
      ]),
      editFields: [
        field("playerName", "Player", r.playerName),
        field("course", "Course", r.course),
        field("playDate", "Date", r.playDate, "date"),
        field("playTime", "Time", r.playTime),
        field("holes", "Holes", r.holes, "number"),
        field("score", "Score", r.score, "number"),
        field("handicap", "Handicap", r.handicap, "number"),
        field("notes", "Notes", r.notes, "textarea"),
      ],
    });
  }

  for (const a of golf.aces) {
    if (a.status !== "pending") continue;
    items.push({
      id: a.id,
      kind: "golf-ace",
      tab: "golf",
      topic: "Golf · hole-in-one",
      title: `${a.playerName} · ${a.course} hole ${a.hole}`,
      submittedBy: a.playerName,
      createdAt: a.createdAt,
      summary: a.playDate,
      details: details([
        d("Player", a.playerName),
        d("Course", a.course),
        d("Hole", a.hole),
        d("Date", a.playDate),
        d("Club", a.clubUsed),
        d("Story", a.story),
        d("Photo", a.photoUrl),
      ]),
      editFields: [
        field("playerName", "Player", a.playerName),
        field("course", "Course", a.course),
        field("hole", "Hole", a.hole, "number"),
        field("playDate", "Date", a.playDate, "date"),
        field("clubUsed", "Club", a.clubUsed),
        field("story", "Story", a.story, "textarea"),
      ],
    });
  }

  for (const r of pickle.ratings) {
    if (r.status !== "pending") continue;
    items.push({
      id: r.id,
      kind: "pickleball-rating",
      tab: "pickleball",
      topic: "Pickleball · DUPR",
      title: r.playerName,
      submittedBy: r.playerName,
      createdAt: r.createdAt,
      summary: [
        r.duprDoubles !== "" ? `Doubles ${r.duprDoubles}` : "",
        r.duprSingles !== "" ? `Singles ${r.duprSingles}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
      details: details([
        d("Player", r.playerName),
        d("DUPR doubles", r.duprDoubles === "" ? "" : r.duprDoubles),
        d("DUPR singles", r.duprSingles === "" ? "" : r.duprSingles),
        d("PCVG", r.pcvg),
        d("Court", r.courtName),
        d("Notes", r.notes),
      ]),
      editFields: [
        field("playerName", "Player", r.playerName),
        field("duprDoubles", "DUPR doubles", r.duprDoubles === "" ? "" : r.duprDoubles),
        field("duprSingles", "DUPR singles", r.duprSingles === "" ? "" : r.duprSingles),
        field("pcvg", "PCVG", r.pcvg),
        field("courtName", "Court", r.courtName),
        field("notes", "Notes", r.notes, "textarea"),
      ],
    });
  }

  for (const c of clubs.listings) {
    if (c.status !== "pending") continue;
    items.push({
      id: c.id,
      kind: "club",
      tab: "clubs",
      topic: "Clubs",
      title: c.name,
      submittedBy: c.submittedByName || c.leaderName,
      createdAt: c.createdAt,
      summary: `${c.category} · ${c.location}`,
      details: details([
        d("Club", c.name),
        d("Category", c.category),
        d("Location", c.location),
        d("Leader", c.leaderName),
        d("Membership", membershipLabel(c.membershipStatus)),
        d("Description", c.description),
        d("Email", c.email),
        d("Phone", c.phone),
        d("Website", c.website),
        d("Submitted by", c.submittedByName),
        d("Replaces", c.replacesId),
      ]),
      editFields: [
        field("name", "Club", c.name),
        field("category", "Category", c.category),
        field("location", "Location", c.location),
        field("leaderName", "Leader", c.leaderName),
        field("description", "Description", c.description, "textarea"),
        field("email", "Email", c.email),
        field("phone", "Phone", c.phone),
        field("website", "Website", c.website),
      ],
    });
  }

  for (const l of services.listings) {
    if (l.status !== "pending") continue;
    const isArea = listingScope(l) === "area";
    items.push({
      id: l.id,
      kind: isArea ? "local-pros" : "support-local",
      tab: "localsvc",
      topic: isVillagerOwned(l) ? "Local Pros · Villager" : "Local Pros",
      title: l.businessName,
      submittedBy: l.submittedByName || l.contactName,
      createdAt: l.createdAt,
      summary: `${l.category}${l.village ? ` · ${l.village}` : ""}`,
      details: details([
        d("Business", l.businessName),
        d("Contact", l.contactName),
        d("Category", l.category),
        d("Description", l.description),
        d("Village", l.village),
        d("Service area", l.serviceArea),
        d("Address", l.address),
        d("Phone", l.phone),
        d("Email", l.email),
        d("Website", l.website),
        d("Submitted by", l.submittedByName),
        d("Villager-owned", isVillagerOwned(l) ? "Yes" : "No"),
        d("Replaces", l.replacesId),
      ]),
      editFields: [
        field("businessName", "Business", l.businessName),
        field("contactName", "Contact", l.contactName),
        field("category", "Category", l.category),
        field("description", "Description", l.description, "textarea"),
        field("village", "Village", l.village),
        field("serviceArea", "Service area", l.serviceArea),
        field("address", "Address", l.address),
        field("phone", "Phone", l.phone),
        field("email", "Email", l.email),
        field("website", "Website", l.website),
      ],
    });
  }

  items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return items;
}

export function countPendingByTab(items: PendingItem[]): Record<PendingTab, number> {
  const counts = emptyPendingCounts();
  for (const item of items) counts[item.tab] += 1;
  return counts;
}

function str(fields: Record<string, string>, key: string) {
  return fields[key] !== undefined ? fields[key] : undefined;
}

/** Admin: save edited fields on a pending item. Optionally approve in the same save. */
export async function applyPendingEdit(
  kind: PendingKind,
  id: string,
  fields: Record<string, string>,
  approve = false
) {
  await ensureDurableHydrated();
  const status = approve ? "approved" : undefined;

  switch (kind) {
    case "golf-ace": {
      return updateAce(id, {
        playerName: str(fields, "playerName"),
        course: str(fields, "course"),
        hole: str(fields, "hole"),
        playDate: str(fields, "playDate"),
        clubUsed: str(fields, "clubUsed"),
        story: str(fields, "story"),
        status,
      });
    }
    case "golf-round": {
      return updateRound(id, {
        playerName: str(fields, "playerName"),
        course: str(fields, "course"),
        playDate: str(fields, "playDate"),
        playTime: str(fields, "playTime"),
        holes: str(fields, "holes"),
        score: str(fields, "score"),
        handicap: str(fields, "handicap"),
        notes: str(fields, "notes"),
        status,
      });
    }
    case "best-of-month": {
      return updateBomEntryAsync(id, {
        title: str(fields, "title"),
        description: str(fields, "description"),
        submitterName: str(fields, "submitterName"),
        status,
      });
    }
    case "local-pros":
    case "support-local": {
      const listing = await updateLocalService(id, {
        businessName: str(fields, "businessName"),
        contactName: str(fields, "contactName"),
        category: str(fields, "category"),
        description: str(fields, "description"),
        village: str(fields, "village"),
        serviceArea: str(fields, "serviceArea"),
        address: str(fields, "address"),
        phone: str(fields, "phone"),
        email: str(fields, "email"),
        website: str(fields, "website"),
      });
      if (approve) {
        const { setLocalServiceStatus } = await import("./localServices");
        return setLocalServiceStatus(id, "approved");
      }
      return listing;
    }
    case "yard-sale": {
      const existing = getListingById(id);
      if (!existing) throw new Error("Listing not found");
      const priceRaw = str(fields, "price");
      const isFree =
        priceRaw !== undefined
          ? priceRaw.trim().toLowerCase() === "free" || priceRaw.trim() === "0"
          : undefined;
      const CONDITIONS = [
        "new",
        "like_new",
        "good",
        "fair",
        "for_parts",
        "freebie",
      ] as const;
      const condRaw = str(fields, "condition")?.trim();
      const listing = updateListing(id, existing.memberId, {
        isAdmin: true,
        title: str(fields, "title"),
        category: str(fields, "category"),
        condition:
          condRaw && (CONDITIONS as readonly string[]).includes(condRaw)
            ? (condRaw as (typeof CONDITIONS)[number])
            : undefined,
        description: str(fields, "description"),
        ...(priceRaw !== undefined
          ? {
              isFree: Boolean(isFree),
              price: isFree ? 0 : Number(priceRaw.replace(/[^0-9.]/g, "")),
            }
          : {}),
        ...(approve ? { status: "approved" as const } : {}),
      });
      await saveYardSaleAsync(loadYardSale());
      return listing;
    }
    case "dining": {
      const data = loadDining();
      const idx = data.suggestions.findIndex((s) => s.id === id);
      if (idx < 0) throw new Error("Dining suggestion not found");
      const cur = data.suggestions[idx];
      data.suggestions[idx] = {
        ...cur,
        name: str(fields, "name")?.trim() || cur.name,
        cuisine: str(fields, "cuisine")?.trim()
          ? (str(fields, "cuisine")!.trim() as typeof cur.cuisine)
          : cur.cuisine,
        area: str(fields, "area")?.trim() || cur.area,
        address: str(fields, "address")?.trim() || cur.address,
        phone: str(fields, "phone")?.trim() || cur.phone,
        website: str(fields, "website")?.trim() || cur.website,
        description: str(fields, "description")?.trim() || cur.description,
        note: str(fields, "note")?.trim() || cur.note,
        status: approve ? "approved" : cur.status,
      };
      saveDining(data);
      return data.suggestions[idx];
    }
    case "club": {
      const data = await loadClubListingsAsync();
      const idx = data.listings.findIndex((l) => l.id === id);
      if (idx < 0) throw new Error("Club listing not found");
      const cur = data.listings[idx];
      data.listings[idx] = {
        ...cur,
        name: str(fields, "name")?.trim() || cur.name,
        category: (str(fields, "category")?.trim() ||
          cur.category) as typeof cur.category,
        location: str(fields, "location")?.trim() || cur.location,
        leaderName: str(fields, "leaderName")?.trim() || cur.leaderName,
        description: str(fields, "description")?.trim() || cur.description,
        email: str(fields, "email")?.trim() || cur.email,
        phone: str(fields, "phone")?.trim() || cur.phone,
        website: str(fields, "website")?.trim() || cur.website,
        status: approve ? "approved" : cur.status,
        updatedAt: new Date().toISOString(),
      };
      await saveClubListingsAsync(data);
      return data.listings[idx];
    }
    case "pickleball-rating": {
      const data = await loadPickleballClubAsync();
      const rec = data.ratings.find((x) => x.id === id);
      if (!rec) throw new Error("Rating not found");
      if (str(fields, "playerName")) rec.playerName = str(fields, "playerName")!.trim();
      if (fields.duprDoubles !== undefined) {
        const t = fields.duprDoubles.trim();
        rec.duprDoubles = t === "" ? "" : Number(t);
      }
      if (fields.duprSingles !== undefined) {
        const t = fields.duprSingles.trim();
        rec.duprSingles = t === "" ? "" : Number(t);
      }
      if (fields.pcvg !== undefined) rec.pcvg = fields.pcvg.trim() || undefined;
      if (fields.courtName !== undefined) rec.courtName = fields.courtName.trim() || undefined;
      if (fields.notes !== undefined) rec.notes = fields.notes.trim() || undefined;
      if (approve) rec.status = "approved";
      await savePickleballClubAsync(data);
      return rec;
    }
    case "member": {
      const data = loadYardSale();
      const idx = data.members.findIndex((m) => m.id === id);
      if (idx < 0) throw new Error("Member not found");
      const cur = data.members[idx];
      data.members[idx] = {
        ...cur,
        name: str(fields, "name")?.trim() || cur.name,
        email: str(fields, "email")?.trim().toLowerCase() || cur.email,
        phone: str(fields, "phone")?.trim() || cur.phone,
        village: str(fields, "village")?.trim() || cur.village,
        status: approve ? "approved" : cur.status,
        approvedAt:
          approve && cur.status !== "approved"
            ? new Date().toISOString()
            : cur.approvedAt,
      };
      await saveYardSaleAsync(data);
      return data.members[idx];
    }
    case "member-royalty":
      throw new Error("Square Royalty nominations are approve/reject only");
    default:
      throw new Error("This item cannot be edited here");
  }
}
