import { MemberBadgesRow } from "@/components/MemberBadgesRow";
import {
  resolveAuthorBadges,
  type BadgeDef,
} from "@/lib/memberBadges";

type Props = {
  name: string;
  /** When known (logged-in author, seller id, etc.) */
  memberId?: string | null;
  /** Precomputed badges (skip server lookup) */
  badges?: BadgeDef[];
  className?: string;
  as?: "span" | "strong";
};

/**
 * Display name + badges:
 * - Donation / paid membership badges when a hub member is matched
 * - Golf skill badges (bronze · silver · gold · pink ace ⛳) for members
 *   OR visitors who have approved Golf hub results under this name
 * Server components only — uses filesystem lookup.
 */
export function MemberName({
  name,
  memberId,
  badges: badgesProp,
  className = "",
  as = "span",
}: Props) {
  const badges =
    badgesProp ??
    resolveAuthorBadges({ memberId, authorName: name });
  const Tag = as;

  return (
    <Tag className={`member-name ${className}`.trim()}>
      <span className="member-name-text">{name}</span>
      <MemberBadgesRow badges={badges} />
    </Tag>
  );
}

export { MemberBadgesRow } from "@/components/MemberBadgesRow";
