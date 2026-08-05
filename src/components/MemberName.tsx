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
 * Display name + membership badges (Golden Loofah always for members;
 * paid tier badge for Cart Path Regular / Lanai Legend / Square Royalty).
 * Server components only — uses filesystem member lookup.
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
