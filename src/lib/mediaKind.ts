/** True when a stored upload URL is a PDF, not a picture. */
export function isPdfMediaUrl(url: string): boolean {
  const path = String(url || "").split("?")[0].split("#")[0].toLowerCase();
  return path.endsWith(".pdf");
}

export function isPdfUpload(file: { name?: string; type?: string }): boolean {
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  return type === "application/pdf" || name.endsWith(".pdf");
}
