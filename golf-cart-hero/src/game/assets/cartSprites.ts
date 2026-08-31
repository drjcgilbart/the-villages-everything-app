import * as THREE from "three";
import { assetUrl } from "../assetUrl";
import type { CartId } from "../data/carts";

/**
 * Open-top photo cutouts from the user's uploaded cart references.
 * Roofs removed so drivers stay visible in-game.
 */
export const CART_SPRITE_URLS: Partial<Record<CartId, string>> = {
  yamaha: assetUrl("assets/carts/game/yamaha-opentop.png"),
  evolution: assetUrl("assets/carts/game/evolution-opentop.png"),
  hotrod: assetUrl("assets/carts/game/hotrod-opentop.png"),
};

/** World size of each photo hull (width × height). Tuned to photo aspect. */
export const CART_SPRITE_SIZE: Partial<Record<CartId, { w: number; h: number }>> = {
  yamaha: { w: 3.45, h: 2.35 },
  evolution: { w: 4.35, h: 2.4 },
  hotrod: { w: 3.55, h: 2.25 },
};

export type CartSpriteLibrary = Partial<Record<CartId, THREE.Texture>>;

function processCartImage(img: HTMLImageElement): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const a = d[i + 3];
    if (a < 8) continue;
    const greenDominance = g - Math.max(r, b);
    if (g > 90 && greenDominance > 30) {
      const alpha =
        greenDominance > 65 ? 0 : Math.max(0, 1 - (greenDominance - 30) / 35);
      d[i + 3] = Math.min(a, Math.round(alpha * 255));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
}

/** Load open-top photo hulls for all three carts. */
export async function loadCartSprites(): Promise<CartSpriteLibrary> {
  const out: CartSpriteLibrary = {};
  const ids = Object.keys(CART_SPRITE_URLS) as CartId[];
  await Promise.all(
    ids.map(async (id) => {
      const url = CART_SPRITE_URLS[id];
      if (!url) return;
      try {
        const img = await loadImage(url);
        out[id] = processCartImage(img);
      } catch (err) {
        console.warn(`[cartSprites] ${id} failed`, err);
      }
    })
  );
  return out;
}
