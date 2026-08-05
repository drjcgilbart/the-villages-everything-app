import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecCenterFavoriteButton } from "@/components/RecCenterBrowser";
import {
  OFFICIAL_REC_CENTERS_URL,
  OFFICIAL_REC_MAP_URL,
  REC_CENTERS,
  getRecCenter,
  mapsUrl,
  otherRecCenters,
  typeHours,
  typeLabel,
  typeAmenityLine,
} from "@/lib/recCenters";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return REC_CENTERS.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const center = getRecCenter(slug);
  if (!center) return { title: "Rec Center" };
  return {
    title: center.name,
    description: center.blurb,
  };
}

export default async function RecCenterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const center = getRecCenter(slug);
  if (!center) notFound();

  const others = otherRecCenters(center.id, 8);

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <p className="ts-detail-crumb">
            <Link href="/rec-centers">Rec Centers</Link>
            <span aria-hidden="true"> · </span>
            <span>{typeLabel(center.type)}</span>
          </p>
          <h1>{center.name}</h1>
          <p className="subtitle">{center.blurb}</p>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <RecCenterFavoriteButton id={center.id} name={center.shortName} />
            <a
              href={mapsUrl(center)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Open in Maps
            </a>
            <a
              href={center.officialPage}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Official page
            </a>
            {center.phone && (
              <a href={`tel:${center.phone.replace(/\D/g, "")}`} className="btn btn-ghost btn-sm">
                Call {center.phone}
              </a>
            )}
            <Link href="/rec-centers" className="btn btn-ghost btn-sm">
              ← All centers
            </Link>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <figure className="rc-hero-figure">
            <Image
              src={center.image}
              alt={`Whimsical illustration of ${center.shortName} recreation center`}
              width={960}
              height={960}
              className="rc-hero-img"
              priority
            />
            <figcaption className="ts-photo-credit">
              Original whimsical illustration for The Villages Hub · free to use
              on this site · inspired by {center.theme.toLowerCase()}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="shell dining-detail-grid">
          <div>
            <div className="about-panel">
              <h2>About this center</h2>
              <p className="ts-detail-about">{center.about}</p>
              <ul className="restaurant-details-list">
                <li>
                  <strong>Type</strong> {typeLabel(center.type)}
                </li>
                <li>
                  <strong>Theme</strong> {center.theme}
                </li>
                <li>
                  <strong>Address</strong> {center.address}
                  <br />
                  <span className="ts-detail-muted">The Villages, FL</span>
                </li>
                {center.phone && (
                  <li>
                    <strong>Phone</strong> {center.phone}
                  </li>
                )}
                <li>
                  <strong>Typical hours</strong> {typeHours(center.type)}
                </li>
                <li>
                  <strong>Area</strong> {center.areaHint}
                </li>
              </ul>
            </div>

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>What you&apos;ll usually find</h2>
              <p className="ts-detail-muted" style={{ marginTop: 0 }}>
                {typeAmenityLine(center.type)}. Exact rooms and courts vary —
                confirm on the official listing.
              </p>
              <ul className="topic-highlight-list">
                {center.amenities.map((a) => (
                  <li key={a}>
                    <strong>{a}</strong>
                    <span>Neighbor orientation note</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Cool &amp; relevant</h2>
              <ul className="topic-highlight-list">
                {center.coolBits.map((bit) => (
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
                {center.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="about-panel" style={{ marginBottom: "1rem" }}>
              <h2>Official &amp; maps</h2>
              <ul className="ts-links-list">
                <li>
                  <a
                    href={center.officialPage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official {center.shortName} page
                  </a>
                  <span>thevillages.com recreation listing</span>
                </li>
                <li>
                  <a
                    href={mapsUrl(center)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Maps directions
                  </a>
                  <span>{center.address}</span>
                </li>
                <li>
                  <a
                    href={OFFICIAL_REC_MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    District recreation map (PDF)
                  </a>
                  <span>All centers on one map</span>
                </li>
                <li>
                  <a
                    href={OFFICIAL_REC_CENTERS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Centers by type (District)
                  </a>
                  <span>Authoritative directory &amp; hours notes</span>
                </li>
                <li>
                  <a
                    href="https://www.districtgov.org/whats-happening/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    What&apos;s Happening
                  </a>
                  <span>Closures &amp; maintenance notices</span>
                </li>
                <li>
                  <a
                    href="https://www.districtgov.org/recreation/guest-info/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Guest ID info
                  </a>
                  <span>When friends visit from out of area</span>
                </li>
              </ul>
            </div>

            <div className="quote-box" style={{ marginBottom: "1rem" }}>
              Cart-path truth: the best rec center is the one you can reach
              before your coffee gets cold — and {center.shortName} might be
              that pin.
            </div>

            <div className="about-panel">
              <h2>More {typeLabel(center.type).toLowerCase()}s</h2>
              <div className="ts-other-squares">
                {others.map((c) => (
                  <Link
                    key={c.id}
                    href={`/rec-centers/${c.id}`}
                    className="ts-other-square"
                  >
                    <Image
                      src={c.image}
                      alt=""
                      width={120}
                      height={120}
                      className="ts-other-square-img"
                    />
                    <span>{c.shortName}</span>
                  </Link>
                ))}
              </div>
              <p style={{ margin: "0.85rem 0 0" }}>
                <Link href="/rec-centers" className="text-link">
                  Browse all centers →
                </Link>
              </p>
            </div>

            <div className="topic-quick-links" style={{ marginTop: "1rem" }}>
              <Link href="/town-squares" className="btn btn-ghost btn-sm">
                Town Squares
              </Link>
              <Link href="/calendar" className="btn btn-ghost btn-sm">
                Calendar
              </Link>
              <Link href="/my-village" className="btn btn-ghost btn-sm">
                My Village
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
