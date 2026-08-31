/** Prefix a public/ path with Vite's base (works at / and /golf-cart-hero/). */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}${clean}` : `${base}/${clean}`;
}
