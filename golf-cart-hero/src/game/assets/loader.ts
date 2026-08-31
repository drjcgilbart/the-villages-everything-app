import * as THREE from "three";
import { assetUrl } from "../assetUrl";
import { loadCartSprites, type CartSpriteLibrary } from "./cartSprites";

export type TextureKey =
  | "asphalt"
  | "grass"
  | "fairway"
  | "sidewalk"
  | "water"
  | "curb"
  | "stucco"
  | "roof"
  | "woodDoor"
  | "glass"
  | "palmBark"
  | "palmBarkAlt"
  | "palmFrond"
  | "cartYamaha"
  | "cartEvolution"
  | "cartHotrod";

const TEXTURE_URLS: Record<TextureKey, string> = {
  asphalt: assetUrl("assets/textures/terrain/asphalt.jpg"),
  grass: assetUrl("assets/textures/terrain/grass.jpg"),
  fairway: assetUrl("assets/textures/terrain/fairway.jpg"),
  sidewalk: assetUrl("assets/textures/terrain/sidewalk.jpg"),
  water: assetUrl("assets/textures/terrain/water.jpg"),
  curb: assetUrl("assets/textures/terrain/curb.jpg"),
  stucco: assetUrl("assets/textures/buildings/stucco.jpg"),
  roof: assetUrl("assets/textures/buildings/roof_terracotta.jpg"),
  woodDoor: assetUrl("assets/textures/buildings/wood_door.jpg"),
  glass: assetUrl("assets/textures/buildings/glass.jpg"),
  palmBark: assetUrl("assets/textures/foliage/palm_bark.jpg"),
  palmBarkAlt: assetUrl("assets/textures/foliage/palm_bark_alt.jpg"),
  palmFrond: assetUrl("assets/textures/foliage/palm_frond.jpg"),
  cartYamaha: assetUrl("assets/textures/carts/paint_yamaha.jpg"),
  cartEvolution: assetUrl("assets/textures/carts/paint_evolution.jpg"),
  cartHotrod: assetUrl("assets/textures/carts/paint_hotrod.jpg"),
};

export type AssetLibrary = {
  textures: Partial<Record<TextureKey, THREE.Texture>>;
  materials: AssetMaterials;
  /** Photo cutouts of the three user-uploaded golf carts */
  cartSprites: CartSpriteLibrary;
  ready: boolean;
};

export type AssetMaterials = {
  asphalt: THREE.MeshStandardMaterial;
  asphaltDark: THREE.MeshStandardMaterial;
  grass: THREE.MeshStandardMaterial;
  grassDeep: THREE.MeshStandardMaterial;
  fairway: THREE.MeshStandardMaterial;
  sidewalk: THREE.MeshStandardMaterial;
  water: THREE.MeshStandardMaterial;
  curb: THREE.MeshStandardMaterial;
  stucco: THREE.MeshStandardMaterial;
  stuccoAlt: THREE.MeshStandardMaterial;
  roof: THREE.MeshStandardMaterial;
  roofBlue: THREE.MeshStandardMaterial;
  roofGreen: THREE.MeshStandardMaterial;
  woodDoor: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  palmBark: THREE.MeshStandardMaterial;
  palmFrond: THREE.MeshStandardMaterial;
  palmFrondLite: THREE.MeshStandardMaterial;
  cartPaint: {
    yamaha: THREE.MeshStandardMaterial;
    evolution: THREE.MeshStandardMaterial;
    hotrod: THREE.MeshStandardMaterial;
  };
  line: THREE.MeshStandardMaterial;
  center: THREE.MeshStandardMaterial;
  sand: THREE.MeshStandardMaterial;
  plaza: THREE.MeshStandardMaterial;
  parking: THREE.MeshStandardMaterial;
  lamp: THREE.MeshStandardMaterial;
  cloud: THREE.MeshStandardMaterial;
  hedge: THREE.MeshStandardMaterial;
  driveway: THREE.MeshStandardMaterial;
  fence: THREE.MeshStandardMaterial;
  shrub: THREE.MeshStandardMaterial;
  window: THREE.MeshStandardMaterial;
  door: THREE.MeshStandardMaterial;
};

function solid(color: string, rough = 0.85, metal = 0.15) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: metal,
  });
}

function textured(
  map: THREE.Texture | undefined,
  fallbackColor: string,
  opts: {
    rough?: number;
    metal?: number;
    repeat?: number;
    transparent?: boolean;
    opacity?: number;
    color?: string;
  } = {}
) {
  const mat = new THREE.MeshStandardMaterial({
    color: opts.color ?? "#ffffff",
    roughness: opts.rough ?? 0.85,
    metalness: opts.metal ?? 0.12,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
  });
  if (map) {
    const m = map.clone();
    m.wrapS = m.wrapT = THREE.RepeatWrapping;
    const r = opts.repeat ?? 1;
    m.repeat.set(r, r);
    m.colorSpace = THREE.SRGBColorSpace;
    m.needsUpdate = true;
    mat.map = m;
  } else {
    mat.color = new THREE.Color(fallbackColor);
  }
  return mat;
}

function configureTexture(tex: THREE.Texture, repeat = 1) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Load all art-pack textures and build materials. Falls back to solid colors if a file fails. */
export async function loadAssets(): Promise<AssetLibrary> {
  const loader = new THREE.TextureLoader();
  const textures: Partial<Record<TextureKey, THREE.Texture>> = {};

  const { loadHazardSprites } = await import("./hazardSprites");
  const { loadCartGlbs } = await import("./cartGlb");

  let cartSprites: CartSpriteLibrary = {};
  await Promise.all([
    ...((Object.keys(TEXTURE_URLS) as TextureKey[]).map(
      (key) =>
        new Promise<void>((resolve) => {
          loader.load(
            TEXTURE_URLS[key],
            (tex) => {
              textures[key] = configureTexture(tex, 1);
              resolve();
            },
            undefined,
            () => {
              console.warn(`[assets] Failed to load ${TEXTURE_URLS[key]}`);
              resolve();
            }
          );
        })
    ) as Promise<void>[]),
    loadHazardSprites().catch((err) => {
      console.warn("[assets] Hazard sprites failed", err);
    }),
    loadCartSprites()
      .then((sprites) => {
        cartSprites = sprites;
      })
      .catch((err) => {
        console.warn("[assets] Cart photo sprites failed", err);
      }),
    loadCartGlbs().catch((err) => {
      console.warn("[assets] Cart GLB models failed", err);
    }),
  ]);

  const materials = buildMaterials(textures);
  return { textures, materials, cartSprites, ready: true };
}

export function buildMaterials(
  textures: Partial<Record<TextureKey, THREE.Texture>>
): AssetMaterials {
  const t = textures;
  return {
    // Slight color boost = “realistic cartoon” (readable, not grimy photoreal)
    asphalt: textured(t.asphalt, "#5a6270", { rough: 0.88, metal: 0.15, repeat: 8, color: "#e8e8ea" }),
    asphaltDark: textured(t.asphalt, "#4a515a", {
      rough: 0.9,
      metal: 0.12,
      repeat: 10,
      color: "#d0d0d4",
    }),
    grass: textured(t.grass, "#45a862", { rough: 0.92, metal: 0.04, repeat: 14, color: "#d8f0d0" }),
    grassDeep: textured(t.grass, "#2f8a50", {
      rough: 0.92,
      metal: 0.04,
      repeat: 18,
      color: "#b0e0b0",
    }),
    fairway: textured(t.fairway, "#55c878", { rough: 0.88, metal: 0.04, repeat: 10, color: "#d0f5d8" }),
    sidewalk: textured(t.sidewalk, "#e0d8cc", { rough: 0.86, metal: 0.08, repeat: 6, color: "#fff8f0" }),
    water: textured(t.water, "#3ab0d8", {
      rough: 0.1,
      metal: 0.5,
      repeat: 4,
      transparent: true,
      opacity: 0.88,
      color: "#c8f0ff",
    }),
    curb: textured(t.curb, "#48a868", { rough: 0.82, metal: 0.08, repeat: 4, color: "#d0f0d0" }),
    stucco: textured(t.stucco, "#f5ecde", { rough: 0.88, metal: 0.06, repeat: 3, color: "#fffaf2" }),
    stuccoAlt: textured(t.stucco, "#f0e6d6", {
      rough: 0.88,
      metal: 0.06,
      repeat: 3.5,
      color: "#fff6ea",
    }),
    roof: textured(t.roof, "#d06050", { rough: 0.78, metal: 0.12, repeat: 4, color: "#ffe0d8" }),
    roofBlue: textured(t.roof, "#4a8aaa", {
      rough: 0.78,
      metal: 0.12,
      repeat: 4,
      color: "#a0c8e8",
    }),
    roofGreen: textured(t.roof, "#3d8a5a", {
      rough: 0.78,
      metal: 0.12,
      repeat: 4,
      color: "#90d0a0",
    }),
    woodDoor: textured(t.woodDoor, "#6b4a32", { rough: 0.8, metal: 0.1, repeat: 1.5 }),
    glass: textured(t.glass, "#7ec8e8", {
      rough: 0.15,
      metal: 0.65,
      repeat: 1,
      transparent: true,
      opacity: 0.75,
    }),
    palmBark: textured(t.palmBark ?? t.palmBarkAlt, "#8b5a2b", {
      rough: 0.92,
      metal: 0.05,
      repeat: 2,
    }),
    palmFrond: textured(t.palmFrond, "#1f6b4a", { rough: 0.88, metal: 0.05, repeat: 2 }),
    palmFrondLite: textured(t.palmFrond, "#2a8a4a", {
      rough: 0.88,
      metal: 0.05,
      repeat: 2.5,
      color: "#d0f0d0",
    }),
    cartPaint: {
      yamaha: textured(t.cartYamaha, "#2f6f4e", { rough: 0.35, metal: 0.45, repeat: 2 }),
      evolution: textured(t.cartEvolution, "#3aa6c9", { rough: 0.32, metal: 0.5, repeat: 2 }),
      hotrod: textured(t.cartHotrod, "#e85d4c", { rough: 0.3, metal: 0.55, repeat: 2 }),
    },
    line: solid("#f4f4f0", 0.45, 0.35),
    center: solid("#f0c93a", 0.45, 0.35),
    sand: solid("#e8d5a8", 0.9, 0.1),
    plaza: solid("#e8dcc8", 0.85, 0.15),
    parking: solid("#6b7582", 0.85, 0.25),
    lamp: solid("#e8e0c8", 0.3, 0.7),
    cloud: solid("#ffffff", 0.95, 0.05),
    hedge: solid("#2d6b3a", 0.95, 0.08),
    driveway: textured(t.sidewalk, "#9a958c", { rough: 0.9, metal: 0.1, repeat: 2 }),
    fence: solid("#c4b49a", 0.85, 0.12),
    shrub: solid("#3d8a4a", 0.95, 0.08),
    window: textured(t.glass, "#7ec8e8", {
      rough: 0.2,
      metal: 0.55,
      repeat: 1,
      transparent: true,
      opacity: 0.8,
    }),
    door: textured(t.woodDoor, "#6b4a32", { rough: 0.8, metal: 0.1, repeat: 1 }),
  };
}

/** Synchronous placeholder materials (before async load completes). */
export function createFallbackMaterials(): AssetMaterials {
  return buildMaterials({});
}
