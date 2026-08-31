import * as THREE from "three";
import { assetUrl } from "../assetUrl";
import type { HazardType } from "../data/hazards";

/**
 * Whimsical high-quality obstacle art (white-background illustrations).
 * Loaded once; white is keyed out so they billboard cleanly in the 3D world.
 */
const HAZARD_SPRITE_URLS: Partial<Record<HazardType, string>> = {
  alligator: assetUrl("assets/hazards/alligator.jpg"),
  turtle: assetUrl("assets/hazards/turtle.jpg"),
  lightning: assetUrl("assets/hazards/lightning.jpg"),
  wanderer: assetUrl("assets/hazards/wanderer.jpg"),
  cop: assetUrl("assets/hazards/cop.jpg"),
  "porch-police": assetUrl("assets/hazards/porch-police.jpg"),
};

/** World height of the sprite plane per hazard type */
export const HAZARD_SPRITE_HEIGHT: Partial<Record<HazardType, number>> = {
  alligator: 2.8,
  turtle: 1.7,
  lightning: 4.2,
  wanderer: 3.4,
  cop: 2.9,
  "porch-police": 3.5,
};

const materialCache = new Map<HazardType, THREE.SpriteMaterial>();
let loadStarted = false;
let loadPromise: Promise<void> | null = null;

function keyOutWhite(img: HTMLImageElement): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    // Soft key: near-white → transparent
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    if (min > 235 && max - min < 28) {
      d[i + 3] = 0;
    } else if (min > 210 && max - min < 35) {
      // Soft edge
      const t = (min - 210) / 25;
      d[i + 3] = Math.round(d[i + 3] * (1 - t));
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
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

/** Prefetch all hazard sprites (call during asset load). */
export function loadHazardSprites(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadStarted = true;
  loadPromise = (async () => {
    const entries = Object.entries(HAZARD_SPRITE_URLS).filter(
      (entry): entry is [HazardType, string] => Boolean(entry[1]),
    );
    await Promise.all(
      entries.map(async ([type, url]) => {
        try {
          const img = await loadImage(url);
          const map = keyOutWhite(img);
          const mat = new THREE.SpriteMaterial({
            map,
            transparent: true,
            depthWrite: false,
            alphaTest: 0.08,
            fog: false,
          });
          materialCache.set(type, mat);
        } catch (err) {
          console.warn(`[hazards] sprite load failed for ${type}`, err);
        }
      })
    );
  })();
  return loadPromise;
}

export function hasHazardSprite(type: HazardType): boolean {
  return materialCache.has(type);
}

/** Create a billboard sprite for a hazard, or null if not loaded yet. */
export function createHazardSprite(type: HazardType): THREE.Sprite | null {
  if (!loadStarted) void loadHazardSprites();
  const mat = materialCache.get(type);
  if (!mat) return null;
  const sprite = new THREE.Sprite(mat);
  const h = HAZARD_SPRITE_HEIGHT[type] ?? 2.5;
  // Keep roughly square aspect from art
  sprite.scale.set(h * 1.05, h, 1);
  sprite.center.set(0.5, 0);
  sprite.position.y = 0.05;
  return sprite;
}
