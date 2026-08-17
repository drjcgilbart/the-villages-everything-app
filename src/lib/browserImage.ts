/** Client-only: shrink phone photos so Studio uploads survive Redis fallback. */
const TARGET_BYTES = 1.8 * 1024 * 1024;

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

export async function prepareStudioImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) {
    return file;
  }
  if (file.size <= TARGET_BYTES && /jpe?g$/i.test(file.name) && file.type === "image/jpeg") {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read this photo"));
      el.src = objectUrl;
    });
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;
    if (!srcW || !srcH) return file;

    const edgeSteps = [1920, 1600, 1280, 1024, 800];
    const qualitySteps = [0.85, 0.75, 0.65, 0.55];
    let best: Blob | null = null;

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
      ctx.drawImage(img, 0, 0, w, h);
      for (const q of qualitySteps) {
        const blob = await canvasToJpeg(canvas, q);
        if (!blob || blob.size < 200) continue;
        best = blob;
        if (blob.size <= TARGET_BYTES) {
          const base = (file.name || "photo").replace(/\.[^.]+$/, "") || "photo";
          return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
        }
      }
    }
    if (best) {
      const base = (file.name || "photo").replace(/\.[^.]+$/, "") || "photo";
      return new File([best], `${base}.jpg`, { type: "image/jpeg" });
    }
    return file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
