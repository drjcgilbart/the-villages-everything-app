/** Bump this when replacing public graphics so browsers fetch fresh files. */
export const GRAPHICS_V = "3";

export function graphic(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${clean}?v=${GRAPHICS_V}`;
}
