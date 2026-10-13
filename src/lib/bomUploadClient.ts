/** Shrink Best of the Month photos in the browser before upload. */

/** Must stay under the Redis fallback limit (~4 MB raw; base64 is larger). */
export const BOM_MAX_UPLOAD_BYTES = 1.8 * 1024 * 1024;

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
  });
}

/** Load image into a canvas-drawable source (bitmap preferred, <img> fallback). */
async function loadImageSource(
  file: File
): Promise<
  | { kind: "bitmap"; bitmap: ImageBitmap }
  | { kind: "img"; img: HTMLImageElement; objectUrl: string }
> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return { kind: "bitmap", bitmap };
    } catch {
      /* fall through to Image() */
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () =>
        reject(
          new Error(
            "Could not read this photo in the browser. Please save it as a JPG (not HEIC) and try again."
          )
        );
      el.src = objectUrl;
    });
    return { kind: "img", img, objectUrl };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    throw err;
  }
}

/**
 * Automatically resize/compress phone photos until they are small enough to
 * upload. 4–12 MB phone photos become ~400 KB–1.5 MB JPEGs.
 */
export async function prepareBomUploadFile(
  file: File
): Promise<{ file: File; originalBytes: number; compressed: boolean }> {
  const name = file.name || "photo.jpg";
  const originalBytes = file.size;
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(name);
  if (isPdf) {
    if (file.size > BOM_MAX_UPLOAD_BYTES) {
      throw new Error(
        "PDF is too large (max about 1.8 MB). Please use a smaller PDF or a JPG photo."
      );
    }
    return { file, originalBytes, compressed: false };
  }

  if (
    file.size <= BOM_MAX_UPLOAD_BYTES &&
    /jpe?g$/i.test(name) &&
    file.type === "image/jpeg"
  ) {
    return { file, originalBytes, compressed: false };
  }

  const source = await loadImageSource(file);
  const srcW =
    source.kind === "bitmap" ? source.bitmap.width : source.img.naturalWidth;
  const srcH =
    source.kind === "bitmap" ? source.bitmap.height : source.img.naturalHeight;

  if (!srcW || !srcH) {
    if (source.kind === "img") URL.revokeObjectURL(source.objectUrl);
    if (source.kind === "bitmap") source.bitmap.close?.();
    throw new Error("Could not read photo dimensions. Try exporting as JPG.");
  }

  const edgeSteps = [1920, 1600, 1280, 1024, 800, 640];
  const qualitySteps = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35];
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
      if (source.kind === "bitmap") {
        ctx.drawImage(source.bitmap, 0, 0, w, h);
      } else {
        ctx.drawImage(source.img, 0, 0, w, h);
      }

      for (const q of qualitySteps) {
        const blob = await canvasToJpegBlob(canvas, q);
        if (!blob || blob.size < 200) continue;
        best = blob;
        if (blob.size <= BOM_MAX_UPLOAD_BYTES) {
          const base = name.replace(/\.[^.]+$/, "") || "photo";
          const out = new File([blob], `${base}.jpg`, { type: "image/jpeg" });
          return { file: out, originalBytes, compressed: true };
        }
      }
    }
  } finally {
    if (source.kind === "bitmap") source.bitmap.close?.();
    if (source.kind === "img") URL.revokeObjectURL(source.objectUrl);
  }

  if (best && best.size <= BOM_MAX_UPLOAD_BYTES * 1.15) {
    const base = name.replace(/\.[^.]+$/, "") || "photo";
    return {
      file: new File([best], `${base}.jpg`, { type: "image/jpeg" }),
      originalBytes,
      compressed: true,
    };
  }

  throw new Error(
    `Could not compress this photo under ${Math.round((BOM_MAX_UPLOAD_BYTES / (1024 * 1024)) * 10) / 10} MB (started at ${Math.round(originalBytes / 1024)} KB). Try a different JPG or screenshot the photo and upload that.`
  );
}
