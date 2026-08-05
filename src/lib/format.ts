export function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
  } catch {
    return iso;
  }
}

export function paragraphs(body: string) {
  return String(body || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
