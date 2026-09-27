const PICTURE_EXT = /\.(jpe?g|png|webp|gif|heic|heif|mp4|webm|mov)$/i;

/** True when a stored upload URL is a PDF, not a picture. */
export function isPdfMediaUrl(url: string): boolean {
  const path = String(url || "").split("?")[0].split("#")[0].toLowerCase();
  if (path.endsWith(".pdf")) return true;
  // A long original filename used to lose ".pdf" when it was shortened.
  return path.includes("/api/media/") && !PICTURE_EXT.test(path);
}

export function isPdfUpload(file: { name?: string; type?: string }): boolean {
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  return type === "application/pdf" || name.endsWith(".pdf");
}
