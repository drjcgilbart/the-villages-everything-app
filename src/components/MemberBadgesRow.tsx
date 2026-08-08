import type { BadgeDef } from "@/lib/memberBadgeTypes";

/** Pure badge strip — safe in client and server components. */
export function MemberBadgesRow({ badges }: { badges: BadgeDef[] }) {
  if (!badges?.length) return null;
  return (
    <span className="member-badges" aria-label="Member badges">
      {badges.map((b) => {
        const metalClass = b.metal ? ` member-badge-metal-${b.metal}` : "";
        const kindClass = b.kind === "golf" ? " member-badge-golf" : "";
        return (
          <span
            key={b.id}
            className={`member-badge-wrap${kindClass}${metalClass}`}
            title={b.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.image}
              alt={b.label}
              width={40}
              height={40}
              className="member-badge"
              loading="lazy"
            />
            {b.emoji && (
              <span className="member-badge-emoji" aria-hidden>
                {b.emoji}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
