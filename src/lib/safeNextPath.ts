/** In-app redirect after Hub login. Rejects protocol-relative / external URLs. */
export function safeNextPath(raw: string | null | undefined, fallback = "/my-space") {
  const next = String(raw || "").trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return fallback;
  }
  return next;
}
