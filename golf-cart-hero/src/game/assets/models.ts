import * as THREE from "three";
import { assetUrl } from "../assetUrl";
import type { CartDef } from "../data/carts";
import {
  flagColorForTier,
  type DonationTierUsd,
} from "../donations";
import { driverEmoji, type DriverDef } from "../data/drivers";
import type { AssetMaterials } from "./loader";
import { cloneCartGlb, hasCartGlb } from "./cartGlb";
import { theme } from "../../theme";

const mascotLoader = new THREE.TextureLoader();
let mascotTexture: THREE.Texture | null = null;
let mascotLoadStarted = false;

function ensureMascotTexture(): THREE.Texture | null {
  if (mascotTexture) return mascotTexture;
  if (!mascotLoadStarted) {
    mascotLoadStarted = true;
    mascotLoader.load(
      assetUrl("assets/mascot-logo.jpg"),
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mascotTexture = tex;
        // Refresh any flag materials waiting on the logo
        for (const mat of pendingMascotMats) {
          mat.map = tex;
          mat.color.setHex(0xffffff);
          mat.needsUpdate = true;
        }
        pendingMascotMats.length = 0;
      },
      undefined,
      () => {
        console.warn("[assets] Could not load mascot-logo.jpg for donor flags");
      }
    );
  }
  return mascotTexture;
}

const pendingMascotMats: THREE.MeshBasicMaterial[] = [];

function solid(color: string, rough = 0.7, metal = 0.2) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}

function mesh(
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
  opts?: { sx?: number; sy?: number; sz?: number; rx?: number; ry?: number; rz?: number; cast?: boolean }
) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  if (opts?.sx != null || opts?.sy != null || opts?.sz != null) {
    m.scale.set(opts.sx ?? 1, opts.sy ?? 1, opts.sz ?? 1);
  }
  if (opts?.rx) m.rotation.x = opts.rx;
  if (opts?.ry) m.rotation.y = opts.ry;
  if (opts?.rz) m.rotation.z = opts.rz;
  m.castShadow = opts?.cast !== false;
  m.receiveShadow = true;
  return m;
}

/**
 * Build an open-top 3D golf cart (turns with the racer).
 * Prefers custom GLB meshes; falls back to procedural geometry.
 * No roofs so Florida critter drivers stay visible.
 */
export function buildTexturedCart(
  cart: CartDef,
  driver: DriverDef,
  isPlayer: boolean,
  mats: AssetMaterials,
  displayName?: string,
  donationTier?: DonationTierUsd | null
): THREE.Group {
  const g = new THREE.Group();
  if (isPlayer) g.scale.setScalar(cart.id === "cybertruck" ? 1.04 : 1.14);

  const glbBody = hasCartGlb(cart.id) ? cloneCartGlb(cart.id) : null;
  if (glbBody) {
    g.add(glbBody);
  } else if (cart.id === "cybertruck") {
    buildCybertruckCart(g);
  } else if (cart.id === "evolution") {
    buildEvolutionCart(g, cart, mats);
  } else if (cart.id === "hotrod") {
    buildStreetRodCart(g, cart, mats);
  } else {
    buildYamahaCart(g, cart, mats);
  }

  // Closed-cabin Cybertruck stays empty — no cartoon driver in the stainless cab
  if (cart.id !== "cybertruck") addVisibleDriver(g, cart, driver);

  if (isPlayer) {
    const label = (displayName || "YOU").slice(0, 16);
    const plate = makeTextSprite(label, "#1c2430", theme.gold);
    const plateY = cart.id === "cybertruck" ? 2.45 : 2.15;
    plate.position.set(0, plateY, cart.id === "evolution" ? 0.1 : cart.id === "cybertruck" ? 0.2 : 0.05);
    plate.scale.set(Math.max(2.2, label.length * 0.28), 0.7, 1);
    plate.name = "nameplate";
    g.add(plate);

    if (donationTier) {
      addDonationFlag(g, cart, donationTier);
    }
  }

  g.rotation.order = "YXZ";
  return g;
}

/**
 * Small flag on the rear of the cart for tip supporters.
 * Cloth color matches highest donation: red $1 · blue $3 · gold $5.
 * Mascot logo sits on the cloth in a matching tinted badge.
 */
function addDonationFlag(
  g: THREE.Group,
  cart: CartDef,
  tier: DonationTierUsd
) {
  const flag = new THREE.Group();
  flag.name = "donation-flag";

  const clothColor = flagColorForTier(tier);
  // Mount toward the rear passenger side so chase cam can see it
  const rearZ =
    cart.id === "cybertruck" ? -1.85 : cart.id === "evolution" ? -1.15 : cart.id === "hotrod" ? -1.05 : -1.2;
  const flagY = cart.id === "cybertruck" ? 1.35 : 1.2;
  flag.position.set(0.55, flagY, rearZ);

  const pole = solid("#4a4038", 0.65, 0.35);
  const ball = solid(clothColor, 0.45, 0.4);
  flag.add(
    mesh(new THREE.CylinderGeometry(0.028, 0.032, 1.05, 8), pole, 0, 0.52, 0, {
      cast: false,
    })
  );
  flag.add(
    mesh(new THREE.SphereGeometry(0.05, 8, 8), ball, 0, 1.08, 0, { cast: false })
  );

  // Cloth (double-sided plane)
  const clothMat = new THREE.MeshStandardMaterial({
    color: clothColor,
    roughness: 0.75,
    metalness: tier === 5 ? 0.45 : 0.12,
    side: THREE.DoubleSide,
  });
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.48), clothMat);
  cloth.position.set(0.38, 0.82, 0);
  cloth.rotation.y = Math.PI / 2;
  cloth.castShadow = false;
  cloth.receiveShadow = false;
  flag.add(cloth);

  // Gold trim fringe for top tier
  if (tier === 5) {
    const trim = new THREE.Mesh(
      new THREE.PlaneGeometry(0.74, 0.06),
      new THREE.MeshStandardMaterial({
        color: "#fff3c4",
        roughness: 0.35,
        metalness: 0.7,
        side: THREE.DoubleSide,
      })
    );
    trim.position.set(0.38, 1.04, 0);
    trim.rotation.y = Math.PI / 2;
    flag.add(trim);
  }

  // Mascot badge on the flag (tinted toward flag color)
  const mascotMat = new THREE.MeshBasicMaterial({
    color: clothColor,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mascotTex = ensureMascotTexture();
  if (mascotTex) {
    mascotMat.map = mascotTex;
    mascotMat.color.setHex(0xffffff);
  } else {
    pendingMascotMats.push(mascotMat);
  }
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.16, 20), mascotMat);
  badge.position.set(0.4, 0.82, 0.01);
  badge.rotation.y = Math.PI / 2;
  flag.add(badge);

  // Soft wave lean so it reads as a flag, not a billboard
  flag.rotation.z = -0.08;
  flag.rotation.y = 0.15;
  g.add(flag);
}

/**
 * Driver critter clearly seated in the cart — body + oversized emoji face.
 * Roofs are omitted so the chase cam can always read who is driving.
 */
function addVisibleDriver(g: THREE.Group, cart: CartDef, driver: DriverDef) {
  // Open cockpit — full-size critter so chase cam always sees who is driving
  const seatZ = cart.id === "evolution" ? 0.22 : cart.id === "hotrod" ? 0.08 : 0.12;
  const seatX = 0.28;
  const seatY = 1.08;
  const bodyScale = 1;

  // Soft body mass so the seat feels occupied even from a distance
  const fur = solid(driverBodyColor(driver), 0.75, 0.08);
  const belly = solid("#f5efe4", 0.8, 0.05);
  g.add(
    mesh(new THREE.SphereGeometry(0.28 * bodyScale, 14, 12), fur, seatX, seatY + 0.22 * bodyScale, seatZ, {
      sx: 0.95,
      sy: 1.05,
      sz: 0.85,
    })
  );
  g.add(
    mesh(
      new THREE.SphereGeometry(0.16 * bodyScale, 12, 10),
      belly,
      seatX,
      seatY + 0.12 * bodyScale,
      seatZ + 0.12 * bodyScale,
      {
        sx: 1.1,
        sy: 0.9,
        sz: 0.7,
        cast: false,
      }
    )
  );
  // Head base under the emoji
  g.add(
    mesh(new THREE.SphereGeometry(0.2 * bodyScale, 12, 10), fur, seatX, seatY + 0.52 * bodyScale, seatZ + 0.02, {
      sx: 1,
      sy: 0.95,
      sz: 0.9,
    })
  );

  // Large emoji billboard — main identity of the chosen Florida critter
  const emoji = makeTextSprite(driverEmoji(driver), "#000", "transparent");
  emoji.position.set(seatX, seatY + 0.58 * bodyScale, seatZ + 0.02);
  const es = 1.85 * bodyScale;
  emoji.scale.set(es, es, 1);
  emoji.name = "driver-emoji";
  g.add(emoji);

  addGatePassArm(g, seatX, seatY, seatZ, fur);
}

/** Driver's right arm + HOA card, animated when waving at a community gate. */
function addGatePassArm(
  g: THREE.Group,
  seatX: number,
  seatY: number,
  seatZ: number,
  fur: THREE.Material
) {
  const arm = new THREE.Group();
  arm.name = "gate-pass-arm";
  arm.position.set(seatX + 0.26, seatY + 0.38, seatZ + 0.06);
  arm.rotation.z = 0.85;
  arm.rotation.x = 0.15;

  const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.22, 4, 8), fur);
  upper.position.set(0.14, 0, 0);
  upper.rotation.z = Math.PI / 2;
  arm.add(upper);

  const card = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.13, 0.012),
    solid("#f4efe4", 0.55, 0.08)
  );
  card.position.set(0.3, 0.02, 0.02);
  card.rotation.y = 0.15;
  arm.add(card);
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.028, 0.014),
    solid("#1f6b4a", 0.45, 0.1)
  );
  stripe.position.set(0.3, 0.045, 0.02);
  arm.add(stripe);
  const chip = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.03, 0.015),
    solid("#e8b84a", 0.3, 0.7)
  );
  chip.position.set(0.24, -0.01, 0.022);
  arm.add(chip);

  g.add(arm);
}

function driverBodyColor(driver: DriverDef): string {
  const id = driver.id;
  if (id === "alligator") return "#3d7a48";
  if (id === "turtle") return "#5a8a40";
  if (id === "manatee") return "#8a9aaa";
  if (id === "armadillo") return "#9a8060";
  if (id === "raccoon") return "#6a6058";
  if (id === "pelican") return "#e8e0d0";
  if (id === "ibis") return "#f0f0f0";
  if (id === "otter") return "#8a6a48";
  return driver.color || "#6a8a5a";
}

/** Closed-cabin stainless Cybertruck fallback if the GLB is missing. */
function buildCybertruckCart(g: THREE.Group) {
  const steel = solid("#f2f5f9", 0.1, 0.92);
  const blackMatte = solid("#141416", 0.82, 0.12);
  const cladding = solid("#2a2c30", 0.78, 0.08);
  const glass = new THREE.MeshStandardMaterial({
    color: "#14161a",
    roughness: 0.08,
    metalness: 0.7,
    transparent: true,
    opacity: 0.9,
  });
  const lightBar = new THREE.MeshStandardMaterial({
    color: "#f4f7fb",
    emissive: "#eef4ff",
    emissiveIntensity: 1.2,
    roughness: 0.15,
    metalness: 0.4,
  });
  const tailBar = new THREE.MeshStandardMaterial({
    color: "#ff2a2a",
    emissive: "#ff1a1a",
    emissiveIntensity: 1.1,
    roughness: 0.25,
    metalness: 0.3,
  });
  const tire = solid("#0c0c0e", 0.94, 0.04);
  const disc = solid("#161618", 0.55, 0.35);

  g.add(mesh(new THREE.BoxGeometry(1.72, 0.78, 2.4), steel, 0, 0.9, 0.35));
  g.add(mesh(new THREE.BoxGeometry(1.7, 0.16, 3.4), cladding, 0, 0.36, 0.05, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(1.22, 0.03, 0.85), glass, 0, 1.42, 0.82, { rx: 0.52, cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.03, 0.3, 0.82), glass, -0.91, 1.36, 0.1, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.03, 0.3, 0.82), glass, 0.91, 1.36, 0.1, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(1.58, 0.045, 0.06), lightBar, 0, 0.78, 1.92, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(1.68, 0.055, 1.64), blackMatte, 0, 1.42, -1.15, { rx: -0.35 }));
  g.add(mesh(new THREE.BoxGeometry(0.1, 1.15, 1.42), steel, -0.84, 1.05, -1.2));
  g.add(mesh(new THREE.BoxGeometry(0.1, 1.15, 1.42), steel, 0.84, 1.05, -1.2));
  g.add(mesh(new THREE.BoxGeometry(1.68, 0.7, 0.08), steel, 0, 0.82, -1.9, { rx: 0.04 }));
  g.add(mesh(new THREE.BoxGeometry(1.58, 0.05, 0.05), tailBar, 0, 1.16, -1.94, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(1.72, 0.22, 0.32), blackMatte, 0, 0.4, -2.02));

  const track = 1.5;
  const wheelBase = 2.15;
  const radius = 0.46;
  for (const [x, z] of [
    [-track / 2, wheelBase / 2],
    [track / 2, wheelBase / 2],
    [-track / 2, -wheelBase / 2],
    [track / 2, -wheelBase / 2],
  ] as const) {
    const rubber = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.32, 24), tire);
    rubber.rotation.z = Math.PI / 2;
    rubber.position.set(x, 0.46, z);
    rubber.castShadow = true;
    g.add(rubber);
    const cover = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.78, radius * 0.78, 0.34, 22), disc);
    cover.rotation.z = Math.PI / 2;
    cover.position.set(x, 0.46, z);
    g.add(cover);
  }
}

/**
 * Yamaha Drive2 (user photo) — OPEN TOP so driver is visible.
 * Glossy white rounded cowl, black chin bumper, Yamaha-style badge,
 * two-tone charcoal/cream seats, black multi-spoke wheels, short windshield.
 */
function buildYamahaCart(g: THREE.Group, cart: CartDef, mats: AssetMaterials) {
  const white = solid("#f7f7f5", 0.22, 0.48);
  const whiteSoft = solid("#ecece8", 0.32, 0.38);
  const black = solid("#121214", 0.48, 0.32);
  const blackMatte = solid("#1a1a1c", 0.78, 0.12);
  const charcoal = solid("#2a2a2e", 0.82, 0.1);
  const cream = solid("#f0ebe4", 0.68, 0.08);
  const silver = solid("#c4c8cc", 0.28, 0.78);
  const tire = solid("#141416", 0.92, 0.05);
  const hl = solid("#fff8e8", 0.12, 0.95);
  const amber = solid("#e8a030", 0.4, 0.35);

  // Underbody + steps
  g.add(mesh(new THREE.BoxGeometry(1.55, 0.12, 2.6), blackMatte, 0, 0.36, 0));
  g.add(mesh(new THREE.BoxGeometry(0.14, 0.07, 1.7), black, -0.8, 0.34, -0.05));
  g.add(mesh(new THREE.BoxGeometry(0.14, 0.07, 1.7), black, 0.8, 0.34, -0.05));

  // Main white body tub (rounded via side spheres)
  g.add(mesh(new THREE.BoxGeometry(1.42, 0.48, 2.0), white, 0, 0.72, -0.1));
  g.add(mesh(new THREE.SphereGeometry(0.45, 16, 12), white, -0.62, 0.62, 0.15, { sx: 0.55, sy: 0.75, sz: 1.8 }));
  g.add(mesh(new THREE.SphereGeometry(0.45, 16, 12), white, 0.62, 0.62, 0.15, { sx: 0.55, sy: 0.75, sz: 1.8 }));

  // Front cowl — Drive2 “smile” face
  g.add(mesh(new THREE.BoxGeometry(1.28, 0.5, 0.78), white, 0, 0.74, 1.1));
  g.add(mesh(new THREE.SphereGeometry(0.62, 18, 14), white, 0, 0.72, 1.05, { sx: 1.05, sy: 0.58, sz: 0.82 }));
  // Fender bulbs
  g.add(mesh(new THREE.SphereGeometry(0.5, 16, 14), white, -0.58, 0.55, 1.0, { sx: 0.78, sy: 0.88, sz: 1.2 }));
  g.add(mesh(new THREE.SphereGeometry(0.5, 16, 14), white, 0.58, 0.55, 1.0, { sx: 0.78, sy: 0.88, sz: 1.2 }));

  // Black lower chin + bumper
  g.add(mesh(new THREE.BoxGeometry(1.22, 0.2, 0.32), black, 0, 0.4, 1.45));
  g.add(mesh(new THREE.BoxGeometry(1.05, 0.1, 0.14), blackMatte, 0, 0.48, 1.55));
  // Headlights
  g.add(mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.09, 14), hl, -0.38, 0.66, 1.5, { rx: Math.PI / 2 }));
  g.add(mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.09, 14), hl, 0.38, 0.66, 1.5, { rx: Math.PI / 2 }));
  g.add(mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 16), black, -0.38, 0.66, 1.5, { cast: false }));
  g.add(mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 16), black, 0.38, 0.66, 1.5, { cast: false }));
  // Amber markers
  g.add(mesh(new THREE.BoxGeometry(0.12, 0.05, 0.04), amber, -0.72, 0.72, 1.15, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.12, 0.05, 0.04), amber, 0.72, 0.72, 1.15, { cast: false }));
  // Yamaha-style round badge
  g.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 16), black, 0, 0.72, 1.52, { rx: Math.PI / 2 }));
  g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16), silver, 0, 0.72, 1.54, { rx: Math.PI / 2, cast: false }));

  // Rear haunches + YAMAHA rocker hint
  g.add(mesh(new THREE.BoxGeometry(1.42, 0.48, 0.62), white, 0, 0.72, -1.2));
  g.add(mesh(new THREE.SphereGeometry(0.44, 14, 12), white, -0.55, 0.56, -1.12, { sx: 0.72, sy: 0.78, sz: 1.1 }));
  g.add(mesh(new THREE.SphereGeometry(0.44, 14, 12), white, 0.55, 0.56, -1.12, { sx: 0.72, sy: 0.78, sz: 1.1 }));
  g.add(mesh(new THREE.BoxGeometry(0.95, 0.08, 0.05), solid("#c02828", 0.35, 0.45), 0, 0.7, -1.52));
  g.add(mesh(new THREE.BoxGeometry(0.55, 0.08, 0.03), black, 0.72, 0.58, -0.35, { cast: false }));

  // Dash + wheel
  g.add(mesh(new THREE.BoxGeometry(1.28, 0.22, 0.4), blackMatte, 0, 0.98, 0.5));
  g.add(mesh(new THREE.BoxGeometry(0.55, 0.06, 0.22), silver, 0, 1.08, 0.48, { cast: false }));
  g.add(mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.36, 8), black, 0.32, 0.95, 0.36, { rx: 0.9 }));
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 10, 18), black);
  sw.position.set(0.32, 1.1, 0.3);
  sw.rotation.x = Math.PI / 2.35;
  g.add(sw);

  // OPEN-TOP: short windshield only (no roof / posts) so driver shows
  g.add(mesh(new THREE.BoxGeometry(0.055, 0.62, 0.055), black, -0.68, 1.22, 0.55));
  g.add(mesh(new THREE.BoxGeometry(0.055, 0.62, 0.055), black, 0.68, 1.22, 0.55));
  g.add(mesh(new THREE.BoxGeometry(1.4, 0.05, 0.05), black, 0, 1.55, 0.55));
  g.add(mesh(new THREE.BoxGeometry(1.38, 0.05, 0.05), black, 0, 0.95, 0.58));
  g.add(mesh(new THREE.BoxGeometry(1.35, 0.04, 0.04), black, 0, 1.25, 0.56));
  g.add(mesh(new THREE.BoxGeometry(1.3, 0.55, 0.035), mats.glass, 0, 1.25, 0.56, { rx: -0.06, cast: false }));
  // Mirrors
  g.add(mesh(new THREE.BoxGeometry(0.14, 0.1, 0.08), black, -0.78, 1.35, 0.52));
  g.add(mesh(new THREE.BoxGeometry(0.14, 0.1, 0.08), black, 0.78, 1.35, 0.52));
  g.add(mesh(new THREE.BoxGeometry(0.1, 0.08, 0.02), silver, -0.78, 1.35, 0.58, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.1, 0.08, 0.02), silver, 0.78, 1.35, 0.58, { cast: false }));

  // Two-tone seats (photo: dark base, light inserts)
  for (const x of [-0.34, 0.34]) {
    g.add(mesh(new THREE.BoxGeometry(0.5, 0.16, 0.52), charcoal, x, 0.96, 0.02));
    g.add(mesh(new THREE.BoxGeometry(0.42, 0.12, 0.44), cream, x, 1.03, 0.02, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.5, 0.58, 0.15), charcoal, x, 1.3, -0.24));
    g.add(mesh(new THREE.BoxGeometry(0.4, 0.45, 0.1), cream, x, 1.32, -0.2, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.34, 0.16, 0.12), cream, x, 1.62, -0.24));
  }
  g.add(mesh(new THREE.BoxGeometry(1.28, 0.15, 0.44), charcoal, 0, 0.96, -0.8));
  g.add(mesh(new THREE.BoxGeometry(1.18, 0.1, 0.36), cream, 0, 1.02, -0.8, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(1.28, 0.52, 0.13), charcoal, 0, 1.26, -1.02));
  g.add(mesh(new THREE.BoxGeometry(1.18, 0.42, 0.09), cream, 0, 1.28, -0.98, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.1, 0.3, 0.48), whiteSoft, -0.72, 1.0, -0.05));
  g.add(mesh(new THREE.BoxGeometry(0.1, 0.3, 0.48), whiteSoft, 0.72, 1.0, -0.05));

  addWheels(g, {
    track: 1.0,
    wheelBase: 1.62,
    radius: 0.42,
    width: 0.32,
    y: 0.42,
    tire,
    rim: black,
    hub: silver,
    spokes: true,
    spokeColor: black,
  });
  void cart;
}

/**
 * Evolution multi-row electric (user photo):
 * bright cyan body, black lower cladding, orange multi-spoke wheels,
 * OPEN TOP — long cyan body, orange multi-spoke rims, LED bars,
 * circular side vents, 3×2 white seats with cyan armrests (driver visible).
 */
function buildEvolutionCart(g: THREE.Group, cart: CartDef, mats: AssetMaterials) {
  // Match photo colors — solid cyan, not generic blue paint map
  const cyan = solid("#2fd0e0", 0.3, 0.48);
  const cyanBright = solid("#5ee0ec", 0.32, 0.42);
  const black = solid("#121418", 0.5, 0.3);
  const blackSoft = solid("#1e2228", 0.65, 0.2);
  const seatWhite = solid("#eef3f6", 0.78, 0.08);
  const armCyan = solid("#4ec8d8", 0.45, 0.3);
  const orange = solid("#ff7a28", 0.35, 0.4);
  const orangeDeep = solid("#e85a10", 0.4, 0.35);
  const tire = solid("#141416", 0.92, 0.05);
  const led = solid("#e8f6ff", 0.15, 0.9);
  const silver = solid("#c0c6cc", 0.3, 0.7);

  // Mid chassis / floor (4-seater — not limo length)
  g.add(mesh(new THREE.BoxGeometry(1.68, 0.14, 2.55), blackSoft, 0, 0.36, 0));

  // Mid-length cyan body — 4 seats (not a 6-seater limo)
  g.add(mesh(new THREE.BoxGeometry(1.52, 0.5, 2.15), cyan, 0, 0.72, -0.08));

  // Black lower rocker / cladding
  g.add(mesh(new THREE.BoxGeometry(1.7, 0.28, 2.35), black, 0, 0.48, -0.05));
  g.add(mesh(new THREE.BoxGeometry(0.22, 0.07, 1.7), black, -0.9, 0.34, -0.05));
  g.add(mesh(new THREE.BoxGeometry(0.22, 0.07, 1.7), black, 0.9, 0.34, -0.05));
  for (const z of [0.25, -0.35]) {
    g.add(mesh(new THREE.BoxGeometry(0.18, 0.03, 0.08), silver, -0.9, 0.38, z, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.18, 0.03, 0.08), silver, 0.9, 0.38, z, { cast: false }));
  }

  // ——— Front fascia (aggressive modern face) ———
  g.add(mesh(new THREE.BoxGeometry(1.55, 0.52, 0.7), cyan, 0, 0.74, 1.28));
  // Sculpted hood peak
  g.add(mesh(new THREE.BoxGeometry(0.7, 0.18, 0.55), cyanBright, 0, 0.95, 1.2));
  // Black lower front splitter
  g.add(mesh(new THREE.BoxGeometry(1.4, 0.18, 0.35), black, 0, 0.42, 1.52));
  // Center badge plate
  g.add(mesh(new THREE.BoxGeometry(0.28, 0.22, 0.06), blackSoft, 0, 0.78, 1.62));
  g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 10), silver, 0, 0.78, 1.65, { rx: Math.PI / 2, cast: false }));
  // Horizontal LED light bars (photo signature)
  g.add(mesh(new THREE.BoxGeometry(0.42, 0.1, 0.07), led, -0.48, 0.72, 1.6));
  g.add(mesh(new THREE.BoxGeometry(0.42, 0.1, 0.07), led, 0.48, 0.72, 1.6));
  // Black bezels around lights
  g.add(mesh(new THREE.BoxGeometry(0.48, 0.16, 0.05), black, -0.48, 0.72, 1.56, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.48, 0.16, 0.05), black, 0.48, 0.72, 1.56, { cast: false }));
  // Front fender arches (black inserts)
  g.add(mesh(new THREE.SphereGeometry(0.48, 14, 12), cyan, -0.72, 0.55, 1.15, { sx: 0.78, sy: 0.88, sz: 1.2 }));
  g.add(mesh(new THREE.SphereGeometry(0.48, 14, 12), cyan, 0.72, 0.55, 1.15, { sx: 0.78, sy: 0.88, sz: 1.2 }));
  g.add(mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 16), black, -0.72, 0.42, 1.15, { rx: Math.PI / 2, cast: false }));
  g.add(mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 16), black, 0.72, 0.42, 1.15, { rx: Math.PI / 2, cast: false }));

  // ——— Side body details ———
  // Circular decorative vents (photo has two large rings on door area)
  for (const z of [0.15, -0.55]) {
    g.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), black, -0.84, 0.78, z, { rz: Math.PI / 2 }));
    g.add(mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 16), silver, -0.84, 0.78, z, { rz: Math.PI / 2, cast: false }));
    g.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), black, 0.84, 0.78, z, { rz: Math.PI / 2 }));
    g.add(mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 16), silver, 0.84, 0.78, z, { rz: Math.PI / 2, cast: false }));
  }
  // Cyan accent stripe on rocker
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.1, 2.2), cyanBright, -0.88, 0.55, -0.15, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.1, 2.2), cyanBright, 0.88, 0.55, -0.15, { cast: false }));

  // ——— Rear ———
  g.add(mesh(new THREE.BoxGeometry(1.58, 0.48, 0.55), cyan, 0, 0.72, -1.45));
  g.add(mesh(new THREE.SphereGeometry(0.42, 12, 10), cyan, -0.65, 0.55, -1.35, { sx: 0.7, sy: 0.8, sz: 1.05 }));
  g.add(mesh(new THREE.SphereGeometry(0.42, 12, 10), cyan, 0.65, 0.55, -1.35, { sx: 0.7, sy: 0.8, sz: 1.05 }));
  // Rear light bar
  g.add(mesh(new THREE.BoxGeometry(1.0, 0.1, 0.06), solid("#ff4040", 0.35, 0.5), 0, 0.75, -1.72));

  // OPEN-TOP: short windshield only — no roof so the driver stays visible
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.62, 0.06), silver, -0.74, 1.22, 0.7));
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.62, 0.06), silver, 0.74, 1.22, 0.7));
  g.add(mesh(new THREE.BoxGeometry(1.52, 0.06, 0.06), silver, 0, 1.55, 0.68));
  g.add(mesh(new THREE.BoxGeometry(1.5, 0.05, 0.05), black, 0, 0.95, 0.76));
  g.add(mesh(new THREE.BoxGeometry(1.44, 0.58, 0.04), mats.glass, 0, 1.25, 0.7, { rx: -0.1, cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.04, 0.45, 0.03), black, -0.12, 1.22, 0.76, { rz: 0.28, cast: false }));
  // Short rear side panels only (not roof pillars)
  g.add(mesh(new THREE.BoxGeometry(0.08, 0.5, 0.45), cyan, -0.84, 1.2, -1.25));
  g.add(mesh(new THREE.BoxGeometry(0.08, 0.5, 0.45), cyan, 0.84, 1.2, -1.25));

  // Side mirrors
  g.add(mesh(new THREE.BoxGeometry(0.08, 0.06, 0.22), black, -0.9, 1.38, 0.62));
  g.add(mesh(new THREE.BoxGeometry(0.15, 0.12, 0.06), black, -0.98, 1.4, 0.52));
  g.add(mesh(new THREE.BoxGeometry(0.08, 0.06, 0.22), black, 0.9, 1.38, 0.62));
  g.add(mesh(new THREE.BoxGeometry(0.15, 0.12, 0.06), black, 0.95, 1.4, 0.52));

  // 4 seats only: 2 rows × 2 (no third row)
  const rows = [0.25, -0.55];
  for (const z of rows) {
    for (const x of [-0.36, 0.36]) {
      g.add(mesh(new THREE.BoxGeometry(0.5, 0.15, 0.44), seatWhite, x, 0.98, z));
      g.add(mesh(new THREE.BoxGeometry(0.5, 0.55, 0.12), seatWhite, x, 1.28, z - 0.2));
      g.add(mesh(new THREE.BoxGeometry(0.28, 0.13, 0.1), seatWhite, x, 1.58, z - 0.2));
      g.add(mesh(new THREE.BoxGeometry(0.08, 0.11, 0.36), armCyan, x - 0.26, 1.1, z));
      g.add(mesh(new THREE.BoxGeometry(0.08, 0.11, 0.36), armCyan, x + 0.26, 1.1, z));
    }
  }

  // Dash + black steering wheel
  g.add(mesh(new THREE.BoxGeometry(1.4, 0.28, 0.42), blackSoft, 0, 0.98, 0.58));
  g.add(mesh(new THREE.BoxGeometry(0.45, 0.08, 0.22), cyanBright, 0, 1.1, 0.55, { cast: false }));
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.028, 8, 14), black);
  sw.position.set(0.32, 1.15, 0.42);
  sw.rotation.x = Math.PI / 2.35;
  g.add(sw);
  // Column
  g.add(mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.32, 8), black, 0.32, 1.0, 0.48, { rx: 0.85 }));

  // Orange multi-spoke wheels (signature look, mid wheelbase for 4-seater)
  addWheels(g, {
    track: 1.08,
    wheelBase: 1.65,
    radius: 0.45,
    width: 0.35,
    y: 0.45,
    tire,
    rim: orange,
    hub: orangeDeep,
    spokes: true,
    spokeColor: orange,
  });

  void cart;
}

/**
 * Street Rod classic (user photo) — OPEN TOP.
 * Metallic blue cabin, silver nose & fenders, vertical chrome grille,
 * light-blue flame decals, open sides, chrome multi-spoke wheels.
 */
function buildStreetRodCart(g: THREE.Group, cart: CartDef, mats: AssetMaterials) {
  const blue = solid("#2a72c4", 0.24, 0.58);
  const blueDeep = solid("#1c5a9e", 0.28, 0.52);
  const blueBright = solid("#3a82d4", 0.26, 0.55);
  const silver = solid("#e8ecf0", 0.28, 0.62);
  const silverSoft = solid("#d4d9e0", 0.36, 0.5);
  const chrome = solid("#f0f4f6", 0.14, 0.95);
  const black = solid("#121214", 0.52, 0.28);
  const blackMatte = solid("#1a1a1c", 0.8, 0.12);
  const seatBlue = solid("#2a4f9a", 0.7, 0.15);
  const seatCream = solid("#d4dae4", 0.68, 0.1);
  const flame = solid("#7ec8f0", 0.32, 0.42);
  const flameHot = solid("#b0e4ff", 0.28, 0.48);
  const tire = solid("#101012", 0.92, 0.05);
  const hl = solid("#fff8e0", 0.14, 0.95);

  // Floor + running boards
  g.add(mesh(new THREE.BoxGeometry(1.55, 0.12, 2.4), blackMatte, 0, 0.36, 0));
  g.add(mesh(new THREE.BoxGeometry(0.2, 0.06, 1.15), silverSoft, -0.84, 0.32, -0.05));
  g.add(mesh(new THREE.BoxGeometry(0.2, 0.06, 1.15), silverSoft, 0.84, 0.32, -0.05));

  // Blue cabin (open sides)
  g.add(mesh(new THREE.BoxGeometry(1.38, 0.58, 1.55), blue, 0, 0.78, -0.22));
  g.add(mesh(new THREE.BoxGeometry(1.42, 0.05, 1.5), chrome, 0, 1.06, -0.2, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.08, 0.48, 0.95), blueDeep, -0.68, 0.85, -0.08));
  g.add(mesh(new THREE.BoxGeometry(0.08, 0.48, 0.95), blueDeep, 0.68, 0.85, -0.08));
  // Side chrome trim
  g.add(mesh(new THREE.BoxGeometry(0.04, 0.06, 1.2), chrome, -0.72, 0.95, -0.1, { cast: false }));
  g.add(mesh(new THREE.BoxGeometry(0.04, 0.06, 1.2), chrome, 0.72, 0.95, -0.1, { cast: false }));

  // Silver bulbous front fenders
  g.add(mesh(new THREE.SphereGeometry(0.62, 18, 16), silver, -0.7, 0.56, 0.95, { sx: 0.92, sy: 0.74, sz: 1.3 }));
  g.add(mesh(new THREE.SphereGeometry(0.62, 18, 16), silver, 0.7, 0.56, 0.95, { sx: 0.92, sy: 0.74, sz: 1.3 }));
  g.add(mesh(new THREE.SphereGeometry(0.32, 14, 12), silver, -0.55, 0.46, 1.48, { sx: 0.95, sy: 0.72, sz: 0.9 }));
  g.add(mesh(new THREE.SphereGeometry(0.32, 14, 12), silver, 0.55, 0.46, 1.48, { sx: 0.95, sy: 0.72, sz: 0.9 }));

  // Center nose / grille
  g.add(mesh(new THREE.BoxGeometry(0.78, 0.5, 0.72), silver, 0, 0.72, 1.15));
  g.add(mesh(new THREE.BoxGeometry(0.42, 0.16, 0.68), silverSoft, 0, 1.0, 1.08));
  g.add(mesh(new THREE.SphereGeometry(0.38, 14, 12), silver, 0, 0.88, 1.22, { sx: 0.95, sy: 0.48, sz: 0.72 }));
  // Vertical chrome grille (photo centerpiece)
  for (let i = -5; i <= 5; i++) {
    g.add(mesh(new THREE.BoxGeometry(0.032, 0.44, 0.05), chrome, i * 0.06, 0.64, 1.54, { cast: false }));
  }
  g.add(mesh(new THREE.BoxGeometry(0.76, 0.05, 0.06), chrome, 0, 0.88, 1.54));
  g.add(mesh(new THREE.BoxGeometry(0.76, 0.05, 0.06), chrome, 0, 0.4, 1.54));
  g.add(mesh(new THREE.BoxGeometry(0.05, 0.5, 0.06), chrome, -0.36, 0.64, 1.54));
  g.add(mesh(new THREE.BoxGeometry(0.05, 0.5, 0.06), chrome, 0.36, 0.64, 1.54));

  // Chrome bumper
  g.add(mesh(new THREE.BoxGeometry(1.6, 0.1, 0.15), chrome, 0, 0.28, 1.6));
  g.add(mesh(new THREE.SphereGeometry(0.11, 12, 10), chrome, -0.8, 0.28, 1.6));
  g.add(mesh(new THREE.SphereGeometry(0.11, 12, 10), chrome, 0.8, 0.28, 1.6));
  g.add(mesh(new THREE.BoxGeometry(0.09, 0.16, 0.12), chrome, -0.48, 0.35, 1.65));
  g.add(mesh(new THREE.BoxGeometry(0.09, 0.16, 0.12), chrome, 0.48, 0.35, 1.65));

  // Headlights
  g.add(mesh(new THREE.SphereGeometry(0.14, 14, 12), hl, -0.74, 0.72, 1.38));
  g.add(mesh(new THREE.SphereGeometry(0.14, 14, 12), hl, 0.74, 0.72, 1.38));
  g.add(mesh(new THREE.TorusGeometry(0.15, 0.024, 8, 16), chrome, -0.74, 0.72, 1.38, { cast: false }));
  g.add(mesh(new THREE.TorusGeometry(0.15, 0.024, 8, 16), chrome, 0.74, 0.72, 1.38, { cast: false }));

  // Flame decals — layered wedges along fender (light blue like photo)
  for (const side of [-1, 1]) {
    const x = side * 0.82;
    g.add(mesh(new THREE.BoxGeometry(0.06, 0.1, 0.7), flame, x, 0.62, 0.75, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.05, 0.16, 0.45), flameHot, x, 0.72, 1.0, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.045, 0.22, 0.28), flame, x, 0.82, 1.15, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.04, 0.12, 0.5), flameHot, x, 0.55, 0.65, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.035, 0.18, 0.2), flame, x, 0.9, 1.25, { cast: false }));
  }

  // Blue rear fenders
  g.add(mesh(new THREE.SphereGeometry(0.52, 16, 14), blueBright, -0.64, 0.56, -1.05, { sx: 0.88, sy: 0.74, sz: 1.2 }));
  g.add(mesh(new THREE.SphereGeometry(0.52, 16, 14), blueBright, 0.64, 0.56, -1.05, { sx: 0.88, sy: 0.74, sz: 1.2 }));
  g.add(mesh(new THREE.BoxGeometry(1.36, 0.5, 0.58), blue, 0, 0.74, -1.15));
  g.add(mesh(new THREE.BoxGeometry(0.95, 0.05, 0.05), chrome, 0, 0.7, -1.45, { cast: false }));
  // Rear deck lip (open bed look)
  g.add(mesh(new THREE.BoxGeometry(1.2, 0.12, 0.35), blueDeep, 0, 1.0, -1.25));

  // Interior
  g.add(mesh(new THREE.BoxGeometry(1.28, 0.1, 1.05), blackMatte, 0, 0.5, -0.08));
  g.add(mesh(new THREE.BoxGeometry(1.22, 0.22, 0.4), black, 0, 0.98, 0.48));
  g.add(mesh(new THREE.BoxGeometry(0.38, 0.06, 0.2), chrome, 0, 1.08, 0.45, { cast: false }));
  g.add(mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.32, 8), black, 0.28, 0.95, 0.34, { rx: 0.95 }));
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 10, 18), black);
  sw.position.set(0.28, 1.1, 0.28);
  sw.rotation.x = Math.PI / 2.4;
  g.add(sw);

  // Blue seats + cream inserts
  for (const x of [-0.34, 0.34]) {
    g.add(mesh(new THREE.BoxGeometry(0.52, 0.16, 0.5), seatBlue, x, 0.96, 0.0));
    g.add(mesh(new THREE.BoxGeometry(0.42, 0.1, 0.4), seatCream, x, 1.03, 0.02, { cast: false }));
    g.add(mesh(new THREE.BoxGeometry(0.52, 0.55, 0.14), seatBlue, x, 1.28, -0.22));
    g.add(mesh(new THREE.BoxGeometry(0.4, 0.4, 0.1), seatCream, x, 1.3, -0.18, { cast: false }));
  }

  // OPEN-TOP: compact windshield only (no roof)
  g.add(mesh(new THREE.BoxGeometry(1.18, 0.05, 0.05), chrome, 0, 1.48, 0.5));
  g.add(mesh(new THREE.BoxGeometry(0.05, 0.52, 0.05), chrome, -0.56, 1.2, 0.52));
  g.add(mesh(new THREE.BoxGeometry(0.05, 0.52, 0.05), chrome, 0.56, 1.2, 0.52));
  g.add(mesh(new THREE.BoxGeometry(1.12, 0.5, 0.04), mats.glass, 0, 1.2, 0.52, { rx: -0.16, cast: false }));
  // Yellow inspection sticker
  g.add(mesh(new THREE.BoxGeometry(0.14, 0.09, 0.02), solid("#e8c84a", 0.48, 0.22), 0.38, 1.38, 0.56, { cast: false }));

  addWheels(g, {
    track: 1.02,
    wheelBase: 1.55,
    radius: 0.42,
    width: 0.3,
    y: 0.42,
    tire,
    rim: chrome,
    hub: chrome,
    spokes: true,
    spokeColor: chrome,
  });
  void cart;
}

type WheelOpts = {
  track: number;
  wheelBase: number;
  radius: number;
  width: number;
  y: number;
  tire: THREE.Material;
  rim: THREE.Material;
  hub: THREE.Material;
  spokes?: boolean;
  spokeColor?: THREE.Material;
  whitewall?: THREE.Material;
};

function addWheels(g: THREE.Group, o: WheelOpts) {
  const positions: [number, number][] = [
    [-o.track / 2, o.wheelBase / 2],
    [o.track / 2, o.wheelBase / 2],
    [-o.track / 2, -o.wheelBase / 2],
    [o.track / 2, -o.wheelBase / 2],
  ];
  for (const [x, z] of positions) {
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(o.radius, o.radius, o.width, 18),
      o.tire
    );
    tire.rotation.z = Math.PI / 2;
    tire.position.set(x, o.y, z);
    tire.castShadow = true;
    g.add(tire);

    if (o.whitewall) {
      const ww = new THREE.Mesh(
        new THREE.CylinderGeometry(o.radius * 0.72, o.radius * 0.72, o.width * 1.05, 16),
        o.whitewall
      );
      ww.rotation.z = Math.PI / 2;
      ww.position.set(x, o.y, z);
      g.add(ww);
    }

    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(o.radius * 0.55, o.radius * 0.55, o.width * 1.1, 14),
      o.rim
    );
    rim.rotation.z = Math.PI / 2;
    rim.position.set(x, o.y, z);
    g.add(rim);

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(o.radius * 0.22, o.radius * 0.22, o.width * 1.2, 10),
      o.hub
    );
    hub.rotation.z = Math.PI / 2;
    hub.position.set(x, o.y, z);
    g.add(hub);

    if (o.spokes) {
      const spokeMat = o.spokeColor ?? o.rim;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const spoke = new THREE.Mesh(
          new THREE.BoxGeometry(o.radius * 0.08, o.radius * 0.9, o.width * 0.15),
          spokeMat
        );
        spoke.position.set(x, o.y, z);
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.x = a;
        g.add(spoke);
      }
    }
  }
}

function makeTextSprite(text: string, fg: string, bg: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 128);
  if (bg !== "transparent") {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(8, 16, 496, 96, 24);
    ctx.fill();
  }
  ctx.fillStyle = fg;
  ctx.font = "bold 48px DM Sans, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true })
  );
}
