import Link from "next/link";
import { ClubFavoriteButton } from "@/components/ClubFavoriteButton";
import { clubDetailHref } from "@/lib/clubPaths";
import type { ClubListSummary } from "@/lib/clubPaths";

export function ClubListRows({
  listings,
}: {
  listings: ClubListSummary[];
}) {
  if (listings.length === 0) {
    return (
      <div className="empty-state about-panel">No clubs in this list yet.</div>
    );
  }
  return (
    <ul className="club-row-list">
      {listings.map((l) => (
        <li key={l.id} className="club-row">
          <ClubFavoriteButton clubId={l.id} name={l.name} />
          <Link href={clubDetailHref(l)} className="club-row-main">
            <strong>{l.name}</strong>
            <span>{l.location}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
