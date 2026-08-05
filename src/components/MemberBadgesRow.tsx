import type { BadgeDef } from "@/lib/memberBadgeTypes";

/** Pure badge strip — safe in client and server components. */
export function MemberBadgesRow({ badges }: { badges: BadgeDef[] }) {
  if (!badges?.length) return null;
  return (
    <span className="member-badges" aria-label="Member badges">
      {badges.map((b) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={b.id}
          src={b.image}
          alt={b.label}
          title={b.title}
          width={22}
          height={22}
          className="member-badge"
          loading="lazy"
        />
      ))}
    </span>
  );
}
