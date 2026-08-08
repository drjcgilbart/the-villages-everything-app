"use client";

import { MemberBadgesRow } from "@/components/MemberBadgesRow";
import type { BadgeDef } from "@/lib/memberBadgeTypes";

type Props = {
  name: string;
  badges?: BadgeDef[] | null;
  className?: string;
  as?: "span" | "strong";
};

/**
 * Client-safe name + golf badges (and any other badges passed from the feed).
 * Use on Golf hub boards; server pages use MemberName for full resolution.
 */
export function GolfPlayerName({
  name,
  badges,
  className = "",
  as = "span",
}: Props) {
  const Tag = as;
  return (
    <Tag className={`member-name golf-player-name ${className}`.trim()}>
      <span className="member-name-text">{name}</span>
      <MemberBadgesRow badges={badges || []} />
    </Tag>
  );
}
