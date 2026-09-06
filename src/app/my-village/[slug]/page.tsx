import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VillageSaveButton } from "@/components/VillageBrowser";
import { VillageLocalHub } from "@/components/VillageLocalHub";
import { VillageNeighborsSection } from "@/components/VillageNeighbors";
import { ensureDurableHydrated } from "@/lib/dataFs";
import { listApprovedServices } from "@/lib/localServices";
import { getRecCenter, typeLabel } from "@/lib/recCenters";
import { getApprovedListings, listingWithSeller } from "@/lib/yardSale";
import { getVillageArt, motifEmoji } from "@/lib/villageArt";
import {
  getVillageAmenities,
  mentionsVillage,
} from "@/lib/villageAmenities";
import { getVillageLocalBundle } from "@/lib/villageLocal";
import { getNeighborsForVillage } from "@/lib/villageNeighbors";
import {
  VILLAGES,
  cddLabel,
  getRegion,
  getVillageBySlug,
  villagesByRegion,
} from "@/lib/villages";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return VILLAGES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const village = getVillageBySlug(slug);
  if (!village) return { title: "Village" };
  return {
    title: `Village of ${village.name}`,
    description: `Facebook groups, TeamReach codes, nearby rec and golf, and neighbor tips for the Village of ${village.name} in The Villages, FL.`,
  };
}

export default async function VillageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const village = getVillageBySlug(slug);
  if (!village) notFound();

  const region = getRegion(village.region);
  const art = getVillageArt(village);
  const nearbyVillages = villagesByRegion(village.region)
    .filter((v) => v.slug !== village.slug)
    .slice(0, 12);
  const amenities = getVillageAmenities(village);

  try {
    await ensureDurableHydrated();
  } catch {
    /* page still renders from bundled data */
  }

  let neighborProfiles: ReturnType<typeof getNeighborsForVillage> = [];
  let localBundle: ReturnType<typeof getVillageLocalBundle> = {
    facebook: [],
    teamreach: [],
    tips: [],
  };
  try {
    neighborProfiles = getNeighborsForVillage(village.slug);
  } catch {
    neighborProfiles = [];
  }
  try {
    localBundle = getVillageLocalBundle(village.slug);
  } catch {
    localBundle = { facebook: [], teamreach: [], tips: [] };
  }

  let yardHere: ReturnType<typeof listingWithSeller>[] = [];
  try {
    yardHere = getApprovedListings()
      .map(listingWithSeller)
      .filter((l) => mentionsVillage(l.seller?.village, village))
      .slice(0, 4);
  } catch {
    yardHere = [];
  }

  let prosHere: ReturnType<typeof listApprovedServices> = [];
  try {
    prosHere = listApprovedServices()
      .filter(
        (s) =>
          mentionsVillage(s.village, village) ||
          mentionsVillage(s.serviceArea, village)
      )
      .slice(0, 4);
  } catch {
    prosHere = [];
  }

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <div className="card-meta">
            <span className="pill pill-cuisine">{region.shortLabel}</span>
            <span>{village.county} County</span>
            <span>{cddLabel(village.cdd)}</span>
            <span className="pill">
              {motifEmoji(art.motif)} {art.motifLabel}
            </span>
          </div>
          <h1>Village of {village.name}</h1>
          <p className="subtitle">{village.blurb}</p>
          <div
            className="village-detail-art"
            style={{ ["--village-accent" as string]: art.accent }}
          >
            <Image
              src={art.image}
              alt={`Whimsical ${art.creature} scene for Village of ${village.name}`}
              width={960}
              height={540}
              className="village-detail-art-img"
              priority
            />
            <p className="village-detail-art-caption">
              <strong>{art.creature}</strong> · {art.motifLabel} · {art.hook}
            </p>
          </div>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <VillageSaveButton slug={village.slug} name={village.name} />
            <Link href="/my-village" className="btn btn-ghost btn-sm">
              ← All villages
            </Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="shell dining-detail-grid">
          <div>
            <div className="about-panel">
              <h2>At a glance</h2>
              <ul className="restaurant-details-list">
                <li>
                  <strong>Village</strong> {village.name}
                </li>
                <li>
                  <strong>Area</strong> {region.label}
                </li>
                <li>
                  <strong>County</strong> {village.county}
                </li>
                <li>
                  <strong>District</strong> {cddLabel(village.cdd)}
                </li>
                <li>
                  <strong>Square energy</strong> {region.nearestSquare}
                </li>
                <li>
                  <strong>Vibe</strong> {region.vibe}
                </li>
              </ul>
            </div>

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>About this area</h2>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                {region.description}
              </p>
              <p style={{ marginBottom: 0 }}>
                <Link href={`/my-village?region=${village.region}`} className="text-link">
                  Browse more in {region.shortLabel} →
                </Link>
              </p>
            </div>

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Close by for {village.name}</h2>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                Pins that actually matter from this village — not a generic
                Villages-wide list.
              </p>
              <ul className="village-related-links">
                {amenities.recs.map((rec) => (
                  <li key={rec.id}>
                    <Link href={`/rec-centers/${rec.id}`}>{rec.name}</Link>
                    {" — "}
                    {rec.id === village.slug
                      ? `this village’s ${typeLabel(rec.type).toLowerCase()}`
                      : rec.areaHint || rec.theme}
                    {rec.phone ? ` · ${rec.phone}` : ""}
                  </li>
                ))}
                {amenities.square && (
                  <li>
                    <Link href={`/town-squares/${amenities.square.id}`}>
                      {amenities.square.name}
                    </Link>
                    {" — nearest square · "}
                    {amenities.square.address}
                  </li>
                )}
                {amenities.golf.map((g) => (
                  <li key={g.id}>
                    <Link href="/golf-zone">
                      {g.name}
                      {g.kind === "championship" ? " Championship" : ""}
                    </Link>
                    {g.address ? ` — ${g.address}` : ` — ${g.kind} golf`}
                    {g.phone ? ` · ${g.phone}` : ""}
                  </li>
                ))}
                {amenities.pickle.map((p) => {
                  const rec = getRecCenter(p.id);
                  return (
                    <li key={`pk-${p.id}`}>
                      {rec ? (
                        <Link href={`/rec-centers/${rec.id}`}>{p.name}</Link>
                      ) : (
                        <Link href="/pickleball">{p.name}</Link>
                      )}
                      {" — pickleball"}
                      {p.courts ? ` · ${p.courts} courts` : ""}
                      {p.indoor ? " · indoor" : ""}
                    </li>
                  );
                })}
                <li>
                  <a
                    href="https://www.districtgov.org/districts/finder/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Find my CDD district
                  </a>{" "}
                  (official)
                </li>
              </ul>
            </div>
          </div>

          <div>
            {village.highlights.length > 0 && (
              <div className="about-panel" style={{ marginBottom: "1rem" }}>
                <h2>Highlights</h2>
                <ul className="topic-highlight-list">
                  {village.highlights.map((h) => (
                    <li key={h}>
                      <strong>{h}</strong>
                      <span>Local orientation note for residents &amp; newcomers.</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="quote-box" style={{ marginBottom: "1rem" }}>
              “I don&apos;t just live in The Villages — I live in the Village of{" "}
              {village.name}.”
            </div>

            {(yardHere.length > 0 || prosHere.length > 0) && (
              <div className="about-panel" style={{ marginBottom: "1rem" }}>
                <h2>Happening in {village.name}</h2>
                {yardHere.length > 0 && (
                  <>
                    <p style={{ color: "var(--muted)", marginTop: 0 }}>
                      Yard Sale listings from neighbors who listed this village.
                    </p>
                    <ul className="village-related-links">
                      {yardHere.map((l) => (
                        <li key={l.id}>
                          <Link href={`/yard-sale/${l.id}`}>{l.title}</Link>
                          {l.isFree
                            ? " — free"
                            : l.price != null
                              ? ` — $${l.price}`
                              : ""}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {prosHere.length > 0 && (
                  <>
                    <p style={{ color: "var(--muted)", marginTop: yardHere.length ? "0.75rem" : 0 }}>
                      Local pros / villagers serving {village.name}.
                    </p>
                    <ul className="village-related-links">
                      {prosHere.map((s) => (
                        <li key={s.id}>
                          <Link href="/local-pros">{s.businessName}</Link>
                          {s.category ? ` — ${s.category}` : ""}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            <div className="about-panel">
              <h2>Neighboring villages in {region.shortLabel}</h2>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                Same map area — handy when friends say “we&apos;re over in…”
              </p>
              <div className="village-neighbor-list">
                {nearbyVillages.map((n) => (
                  <Link key={n.slug} href={`/my-village/${n.slug}`}>
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <VillageLocalHub
            villageSlug={village.slug}
            villageName={village.name}
            initial={localBundle}
          />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <VillageNeighborsSection
            villageSlug={village.slug}
            villageName={village.name}
            initialNeighbors={neighborProfiles}
          />
        </div>
      </section>
    </article>
  );
}
