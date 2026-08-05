import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TownSquareFavoriteButton } from "@/components/TownSquareBrowser";
import {
  OFFICIAL_LIVE_CAMS_URL,
  TOWN_SQUARES,
  getTownSquare,
  mapsUrl,
  otherTownSquares,
} from "@/lib/townSquares";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return TOWN_SQUARES.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const square = getTownSquare(slug);
  if (!square) return { title: "Town Square" };
  return {
    title: square.name,
    description: square.blurb,
  };
}

export default async function TownSquareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const square = getTownSquare(slug);
  if (!square) notFound();

  const others = otherTownSquares(square.id);
  const externalLinks = square.links.filter((l) => l.href.startsWith("http"));
  const internalLinks = square.links.filter((l) => l.href.startsWith("/"));

  const gallery = square.gallery ?? [];

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <p className="ts-detail-crumb">
            <Link href="/town-squares">Town Squares</Link>
            <span aria-hidden="true"> · </span>
            <span>{square.shortName}</span>
          </p>
          <h1>{square.name}</h1>
          <p className="subtitle">{square.blurb}</p>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <TownSquareFavoriteButton
              id={square.id}
              name={square.shortName}
            />
            <a
              href={OFFICIAL_LIVE_CAMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Official live cams
            </a>
            <a
              href={mapsUrl(square)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Open in Maps
            </a>
            <a
              href={square.officialPage}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Official square page
            </a>
            <Link href="/town-squares" className="btn btn-ghost btn-sm">
              ← All squares
            </Link>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <figure className="ts-hero-figure">
            <Image
              src={square.photo.src}
              alt={square.photo.alt}
              width={1280}
              height={720}
              className="ts-hero-img"
              priority
            />
            <figcaption className="ts-photo-credit">
              {square.photo.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="shell dining-detail-grid">
          <div>
            <div className="about-panel">
              <h2>About this square</h2>
              <p className="ts-detail-about">{square.about}</p>
              <ul className="restaurant-details-list">
                <li>
                  <strong>Theme</strong> {square.theme}
                </li>
                <li>
                  <strong>Area</strong> {square.area}
                </li>
                <li>
                  <strong>Address</strong> {square.address}
                  <br />
                  <span className="ts-detail-muted">{square.cityStateZip}</span>
                </li>
                <li>
                  <strong>Live cam</strong> {square.camNote}
                </li>
              </ul>
            </div>

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Highlights</h2>
              <ul className="topic-highlight-list">
                {square.highlights.map((h) => (
                  <li key={h}>
                    <strong>{h}</strong>
                    <span>Square-specific orientation for residents &amp; guests.</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Cool &amp; relevant</h2>
              <ul className="topic-highlight-list">
                {square.coolBits.map((bit) => (
                  <li key={bit.title}>
                    <strong>{bit.title}</strong>
                    <span>{bit.body}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Neighbor tips</h2>
              <ul className="ts-tips-list">
                {square.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>

            {gallery.length > 0 && (
              <div className="about-panel" style={{ marginTop: "1rem" }}>
                <h2>More looks</h2>
                <div className="ts-gallery">
                  {gallery.map((shot) => (
                    <figure key={shot.src} className="ts-gallery-item">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={640}
                        height={400}
                        className="ts-gallery-img"
                      />
                      <figcaption className="ts-photo-credit">
                        {shot.credit}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="about-panel" style={{ marginBottom: "1rem" }}>
              <h2>On &amp; around the square</h2>
              <p className="ts-detail-muted" style={{ marginTop: 0 }}>
                Names change; treat this as a vibe checklist, not a phone book.
                Confirm hours on the official square page.
              </p>
              <ul className="ts-spots-list">
                {square.knownSpots.map((spot) => (
                  <li key={spot.name}>
                    <strong>{spot.name}</strong>
                    <span>{spot.kind}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-panel" style={{ marginBottom: "1rem" }}>
              <h2>Curated links</h2>
              <p className="ts-detail-muted" style={{ marginTop: 0 }}>
                Official pages first, plus maps and independent guides. Outbound
                links only — we don&apos;t re-host cams or claim affiliation
                with The Villages®.
              </p>
              <ul className="ts-links-list">
                {externalLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                    <span>{link.note}</span>
                  </li>
                ))}
                {internalLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}>{link.label}</Link>
                    <span>{link.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="quote-box" style={{ marginBottom: "1rem" }}>
              Cart path truth: free music, questionable dance moves, excellent
              people-watching — starting at {square.shortName}.
            </div>

            <div className="about-panel">
              <h2>Other squares</h2>
              <p className="ts-detail-muted" style={{ marginTop: 0 }}>
                Square-hop when the battery (and the knees) allow.
              </p>
              <div className="ts-other-squares">
                {others.map((s) => (
                  <Link
                    key={s.id}
                    href={`/town-squares/${s.id}`}
                    className="ts-other-square"
                  >
                    <Image
                      src={s.photo.src}
                      alt=""
                      width={120}
                      height={80}
                      className="ts-other-square-img"
                    />
                    <span>{s.shortName}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="topic-quick-links" style={{ marginTop: "1rem" }}>
              <Link href="/dining" className="btn btn-ghost btn-sm">
                Dining
              </Link>
              <Link href="/calendar" className="btn btn-ghost btn-sm">
                Calendar
              </Link>
              <Link href="/community-resources" className="btn btn-ghost btn-sm">
                Community Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
