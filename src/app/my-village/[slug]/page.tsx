import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VillageSaveButton } from "@/components/VillageBrowser";
import { VillageNeighborsSection } from "@/components/VillageNeighbors";
import { getNeighborsForVillage } from "@/lib/villageNeighbors";
import { getVillageArt, motifEmoji } from "@/lib/villageArt";
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
    description: village.blurb,
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
  // Neighbor store can fail on read-only hosts; never block the village page.
  let neighborProfiles: ReturnType<typeof getNeighborsForVillage> = [];
  try {
    neighborProfiles = getNeighborsForVillage(village.slug);
  } catch {
    neighborProfiles = [];
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
              <h2>Useful next stops</h2>
              <ul className="village-related-links">
                <li>
                  <Link href="/town-squares">Town Squares</Link> — free music,
                  shopping, dining
                </li>
                <li>
                  <Link href="/rec-centers">Rec Centers</Link> — pools,
                  pickleball, fitness
                </li>
                <li>
                  <Link href="/dining">Dining</Link> — rate local restaurants
                </li>
                <li>
                  <Link href="/golf-zone">Golf Zone</Link> — courses &amp; cart
                  culture
                </li>
                <li>
                  <Link href="/calendar">Calendar of Events</Link> — what&apos;s
                  on
                </li>
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
