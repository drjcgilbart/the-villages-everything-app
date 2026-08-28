/** Client-only: shrink oversized photos with as little quality loss as possible. */

export const DEFAULT_PHOTO_MAX_BYTES = 2.6 * 1024 * 1024;

function canvasToJpeg(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

type ImageSource =
  | { kind: "bitmap"; bitmap: ImageBitmap }
  | { kind: "img"; img: HTMLImageElement; objectUrl: string };

async function loadImageSource(file: File): Promise<ImageSource> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return { kind: "bitmap", bitmap };
    } catch {
      /* HEIC / odd phone formats often need the <img> path */
    }
  }
  const objectUrl = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () =>
      reject(
        new Error(
          "Could not read this photo in the browser. Save it as a JPG and try again."
        )
      );
    el.src = objectUrl;
  });
  return { kind: "img", img, objectUrl };
}

function releaseSource(source: ImageSource) {
  if (source.kind === "bitmap") source.bitmap.close?.();
  else URL.revokeObjectURL(source.objectUrl);
}

function namedJpeg(file: File, blob: Blob): File {
  const base = (file.name || "photo").replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export type PreparedUploadImage = {
  file: File;
  originalBytes: number;
  compressed: boolean;
};

/**
 * If the photo already fits, it is left alone.
 * If it is too large, we first try high-quality JPEG at full size, then
 * gently shrink the long edge only as far as needed.
 */
export async function prepareUploadImageFile(
  file: File,
  opts?: { maxBytes?: number }
): Promise<PreparedUploadImage> {
  const maxBytes = opts?.maxBytes ?? DEFAULT_PHOTO_MAX_BYTES;
  const originalBytes = file.size;
  const name = file.name || "photo.jpg";

  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|heif)$/i.test(name)) {
    return { file, originalBytes, compressed: false };
  }

  if (
    originalBytes <= maxBytes &&
    /jpe?g$/i.test(name) &&
    (file.type === "image/jpeg" || file.type === "image/jpg")
  ) {
    return { file, originalBytes, compressed: false };
  }

  const source = await loadImageSource(file);
  const srcW =
    source.kind === "bitmap" ? source.bitmap.width : source.img.naturalWidth;
  const srcH =
    source.kind === "bitmap" ? source.bitmap.height : source.img.naturalHeight;

  if (!srcW || !srcH) {
    releaseSource(source);
    throw new Error("Could not read photo dimensions. Try exporting as JPG.");
  }

  const edgeSteps = [
    Math.max(srcW, srcH),
    2560,
    2200,
    1920,
    1600,
    1400,
    1280,
    1024,
  ].filter((n, i, arr) => n >= 640 && arr.indexOf(n) === i);
  const qualitySteps = [0.92, 0.88, 0.84, 0.8, 0.76, 0.7];

  let best: Blob | null = null;
  try {
    for (const maxEdge of edgeSteps) {
      const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
      const w = Math.max(1, Math.round(srcW * scale));
      const h = Math.max(1, Math.round(srcH * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      if (source.kind === "bitmap") ctx.drawImage(source.bitmap, 0, 0, w, h);
      else ctx.drawImage(source.img, 0, 0, w, h);

      for (const q of qualitySteps) {
        const blob = await canvasToJpeg(canvas, q);
        if (!blob || blob.size < 200) continue;
        best = blob;
        if (blob.size <= maxBytes) {
          return {
            file: namedJpeg(file, blob),
            originalBytes,
            compressed: true,
          };
        }
      }
    }
  } finally {
    releaseSource(source);
  }

  if (best && best.size <= maxBytes * 1.08) {
    return { file: namedJpeg(file, best), originalBytes, compressed: true };
  }

  throw new Error(
    `This photo is still too large after automatic resize (${Math.round(originalBytes / 1024)} KB). Try a JPG screenshot of the picture.`
  );
}

/** Studio / Redis fallback — slightly tighter cap. */
export async function prepareStudioImageFile(file: File): Promise<File> {
  const prepared = await prepareUploadImageFile(file, {
    maxBytes: 1.8 * 1024 * 1024,
  });
  return prepared.file;
}
