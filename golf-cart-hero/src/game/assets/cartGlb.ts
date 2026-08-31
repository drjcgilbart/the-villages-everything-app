/**
 * Custom open-top cart GLB models (exported via scripts/export-cart-glbs.mjs).
 * Real 3D meshes that turn with the racer — not photo billboards.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { assetUrl } from "../assetUrl";
import type { CartId } from "../data/carts";

const CART_GLB_URLS: Record<CartId, string> = {
  yamaha: assetUrl("assets/models/carts/yamaha.glb"),
  evolution: assetUrl("assets/models/carts/evolution.glb"),
  hotrod: assetUrl("assets/models/carts/hotrod.glb"),
  cybertruck: assetUrl("assets/models/carts/cybertruck.glb"),
};

/** Template scenes (one per cart). Cloned for each racer. */
const templates: Partial<Record<CartId, THREE.Object3D>> = {};
let loadPromise: Promise<void> | null = null;

function prepareTemplate(root: THREE.Object3D): THREE.Object3D {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // Materials from GLB export are already MeshStandardMaterial
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const std = m as THREE.MeshStandardMaterial;
        if (std?.map) {
          std.map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    }
  });
  return root;
}

/** Load all cart GLBs (safe to call multiple times). */
export function loadCartGlbs(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const loader = new GLTFLoader();
    const ids = Object.keys(CART_GLB_URLS) as CartId[];
    await Promise.all(
      ids.map(
        (id) =>
          new Promise<void>((resolve) => {
            loader.load(
              CART_GLB_URLS[id],
              (gltf) => {
                templates[id] = prepareTemplate(gltf.scene);
                console.info(`[cartGlb] Loaded ${id}.glb`);
                resolve();
              },
              undefined,
              (err) => {
                console.warn(`[cartGlb] Failed to load ${id}.glb — procedural fallback`, err);
                resolve();
              }
            );
          })
      )
    );
  })();
  return loadPromise;
}

export function hasCartGlb(id: CartId): boolean {
  return !!templates[id];
}

/**
 * Clone a cart body mesh for one racer.
 * Returns null if that GLB didn't load (caller should use procedural).
 */
export function cloneCartGlb(id: CartId): THREE.Group | null {
  const src = templates[id];
  if (!src) return null;
  const clone = src.clone(true);
  // Deep-clone materials so racers don't share material state
  clone.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else {
        mesh.material = mesh.material.clone();
      }
    }
  });
  if (id === "cybertruck") tintCybertruckSilver(clone);
  const g = new THREE.Group();
  g.name = `cart-glb-${id}`;
  g.add(clone);
  return g;
}

/** Bright stainless: high metal + low roughness. Scene env map provides the reflections. */
function tintCybertruckSilver(root: THREE.Object3D) {
  const silver = new THREE.Color("#f2f5f9");
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      const std = m as THREE.MeshStandardMaterial;
      if (!std?.isMeshStandardMaterial) continue;
      if (std.emissive && std.emissive.getHex() > 0) continue;
      if (std.transparent) continue;
      const lum = std.color.r * 0.3 + std.color.g * 0.4 + std.color.b * 0.2;
      if (std.metalness > 0.35 || lum > 0.4) {
        std.color.copy(silver);
        std.metalness = 0.92;
        std.roughness = 0.1;
        std.envMapIntensity = 2.15;
        std.needsUpdate = true;
      }
    }
  });
}
