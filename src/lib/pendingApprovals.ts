import { loadBomAsync } from "./bestOfMonth";
import { BOM_CATEGORY_META } from "./bestOfMonthTypes";
import { loadClubListingsAsync } from "./clubListings";
import { membershipLabel } from "./clubListingsTypes";
import { ensureDurableHydrated } from "./dataFs";
import { listRestaurantSuggestions } from "./dining";
import { loadGolfClubAsync } from "./golfClub";
import { loadLocalServicesAsync } from "./localServices";
import { listingScope } from "./localServicesTypes";
import { loadMemberSpaces } from "./memberSpace";
import { loadPickleballClubAsync } from "./pickleballClub";
import { loadYardSale } from "./yardSale";

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
};

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
    });
  }

  for (const l of services.listings) {
    if (l.status !== "pending") continue;
    const isArea = listingScope(l) === "area";
    items.push({
      id: l.id,
      kind: isArea ? "local-pros" : "support-local",
      tab: "localsvc",
      topic: isArea ? "Local Pros" : "Support Local Villagers",
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
        d("Replaces", l.replacesId),
      ]),
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
