import Link from "next/link";
import { notFound } from "next/navigation";
import { ClubFavoriteButton } from "@/components/ClubFavoriteButton";
import {
  getApprovedClubById,
  loadClubListingsAsync,
} from "@/lib/clubListings";
import { membershipLabel } from "@/lib/clubListingsTypes";
import { clubCategoryHref } from "@/lib/clubPaths";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadClubListingsAsync();
  const listing = getApprovedClubById(decodeURIComponent(id), data);
  if (!listing) return { title: "Club" };
  return {
    title: listing.name,
    description: `${listing.name} · ${listing.location} · ${listing.category}`,
  };
}

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadClubListingsAsync();
  const listing = getApprovedClubById(decodeURIComponent(id), data);
  if (!listing) notFound();

  return (
    <div className="section">
      <div className="shell" style={{ maxWidth: "46rem" }}>
        <p className="kicker">
          <Link href="/club-zone#leader-directory" className="text-link">
            Club directory
          </Link>
          {" · "}
          <Link href={clubCategoryHref(listing.category)} className="text-link">
            {listing.category}
          </Link>
        </p>
        <div className="about-panel club-detail-panel">
          <div className="club-detail-head">
            <div>
              <span className="pill">{listing.category}</span>
              <h1 style={{ margin: "0.45rem 0 0.35rem" }}>{listing.name}</h1>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                {membershipLabel(listing.membershipStatus)}
              </p>
            </div>
            <ClubFavoriteButton
              clubId={listing.id}
              name={listing.name}
              variant="full"
            />
          </div>
          <p>{listing.description}</p>
          <ul className="club-leader-meta">
            <li>
              <strong>Location:</strong> {listing.location}
            </li>
            <li>
              <strong>Leader:</strong> {listing.leaderName}
            </li>
            {listing.email ? (
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${listing.email}`}>{listing.email}</a>
              </li>
            ) : null}
            {listing.phone ? (
              <li>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${listing.phone.replace(/[^\d+]/g, "")}`}>
                  {listing.phone}
                </a>
              </li>
            ) : null}
            {listing.website ? (
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site
                </a>
              </li>
            ) : null}
          </ul>
          <p className="panel-hint" style={{ marginBottom: 0 }}>
            From the District Recreation Club Contacts list. Confirm times with
            the leader before you go.{" "}
            <Link href="/club-zone#club-leader-form" className="text-link">
              Club leader? Update this listing
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
