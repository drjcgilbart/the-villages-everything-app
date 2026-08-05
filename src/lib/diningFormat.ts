/** Pure display helpers — safe for client components. */

export function starsLabel(rating: number) {
  const n = Math.min(5, Math.max(0, Math.round(rating)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export function formatRating(avg: number, count: number) {
  if (!count) return "No ratings yet";
  return `${avg.toFixed(1)} · ${count} review${count === 1 ? "" : "s"}`;
}
