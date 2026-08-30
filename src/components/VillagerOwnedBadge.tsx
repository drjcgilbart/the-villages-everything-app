/**
 * Badge for Local Pros listings whose owner lives in The Villages.
 * Uses the site mascot so it reads as “one of us” from across the card.
 */
export function VillagerOwnedBadge({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`villager-owned-badge villager-owned-badge-${size}`}
      title="The owner lives in The Villages"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/graphics/mascot-180.png" alt="" />
      <span>Villager</span>
    </span>
  );
}
