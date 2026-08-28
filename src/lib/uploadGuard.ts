/**
 * Reject uploads whose bytes don't match an allowed image / pdf / video type.
 * Filename + Content-Type are not enough (they are attacker-controlled).
 */
const ALLOWED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".heic",
  ".heif",
  ".pdf",
  ".mp4",
  ".mov",
  ".webm",
]);

function startsWith(buf: Buffer, bytes: number[]): boolean {
  if (buf.length < bytes.length) return false;
  return bytes.every((b, i) => buf[i] === b);
}

function asciiAt(buf: Buffer, start: number, text: string): boolean {
  if (buf.length < start + text.length) return false;
  return buf.subarray(start, start + text.length).toString("ascii") === text;
}

export function detectUploadKind(
  buffer: Buffer
): "image" | "pdf" | "video" | null {
  if (!buffer?.length) return null;
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "image";
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image";
  }
  if (startsWith(buffer, [0x47, 0x49, 0x46, 0x38])) return "image";
  if (asciiAt(buffer, 0, "RIFF") && asciiAt(buffer, 8, "WEBP")) return "image";
  if (asciiAt(buffer, 0, "%PDF")) return "pdf";
  if (asciiAt(buffer, 4, "ftyp")) {
    const brand = buffer.subarray(8, 12).toString("ascii").toLowerCase();
    if (
      brand.startsWith("heic") ||
      brand.startsWith("heif") ||
      brand.startsWith("mif1") ||
      brand.startsWith("msf1")
    ) {
      return "image";
    }
    return "video";
  }
  if (startsWith(buffer, [0x1a, 0x45, 0xdf, 0xa3])) return "video";
  return null;
}

export function assertSafeUpload(
  buffer: Buffer,
  filename: string,
  mime = ""
): "image" | "pdf" | "video" {
  const ext = (filename.match(/\.[a-z0-9]+$/i)?.[0] || "").toLowerCase();
  if (ext && !ALLOWED_EXT.has(ext)) {
    throw new Error("That file type is not allowed");
  }

  const kind = detectUploadKind(buffer);
  if (!kind) {
    throw new Error("File contents are not a supported photo, PDF, or video");
  }

  const mimeLower = (mime || "").toLowerCase();
  if (kind === "image" && mimeLower && !mimeLower.startsWith("image/") && mimeLower !== "application/octet-stream") {
    throw new Error("Photo upload MIME type did not match the file");
  }
  if (kind === "pdf" && mimeLower && mimeLower !== "application/pdf" && mimeLower !== "application/octet-stream") {
    throw new Error("PDF upload MIME type did not match the file");
  }
  if (kind === "video" && mimeLower && !mimeLower.startsWith("video/") && mimeLower !== "application/octet-stream") {
    throw new Error("Video upload MIME type did not match the file");
  }
  if (ext === ".pdf" && kind !== "pdf") {
    throw new Error("File is not a PDF");
  }
  if ([".mp4", ".mov", ".webm"].includes(ext) && kind !== "video") {
    throw new Error("File is not a video");
  }
  return kind;
}
