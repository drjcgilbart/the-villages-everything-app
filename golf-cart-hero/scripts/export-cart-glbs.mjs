/**
 * Export distinct open-top cart GLBs:
 *   yamaha   — white classic, 4 seats (2 front + rear bench)
 *   evolution — cyan electric, 4 seats (2 rows × 2) — NOT 6
 *   hotrod   — blue/silver street rod, 2 seats only
 *   cybertruck — closed-cabin Tesla Cybertruck (no driver), stainless hull
 *
 * npm.cmd run export-carts
 */
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "assets", "models", "carts");

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;
    onerror = null;
    readAsArrayBuffer(blob) {
      Promise.resolve(blob.arrayBuffer())
        .then((buf) => {
          this.result = buf;
          this.onloadend?.({ target: this });
        })
        .catch((e) => this.onerror?.(e));
    }
    readAsDataURL(blob) {
      Promise.resolve(blob.arrayBuffer())
        .then((buf) => {
          this.result =
            "data:application/octet-stream;base64," +
            Buffer.from(buf).toString("base64");
          this.onloadend?.({ target: this });
        })
        .catch((e) => this.onerror?.(e));
    }
  };
}

function mat(color, rough = 0.4, metal = 0.35) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}

function add(p, geo, material, x, y, z, o = {}) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  if (o.sx != null || o.sy != null || o.sz != null) m.scale.set(o.sx ?? 1, o.sy ?? 1, o.sz ?? 1);
  if (o.rx) m.rotation.x = o.rx;
  if (o.ry) m.rotation.y = o.ry;
  if (o.rz) m.rotation.z = o.rz;
  m.castShadow = o.cast !== false;
  m.receiveShadow = true;
  p.add(m);
  return m;
}

function glassMat() {
  return new THREE.MeshStandardMaterial({
    color: "#9ecce8",
    roughness: 0.1,
    metalness: 0.55,
    transparent: true,
    opacity: 0.4,
  });
}

function addWheels(g, o) {
  const pos = [
    [-o.track / 2, o.wheelBase / 2],
    [o.track / 2, o.wheelBase / 2],
    [-o.track / 2, -o.wheelBase / 2],
    [o.track / 2, -o.wheelBase / 2],
  ];
  for (const [x, z] of pos) {
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(o.radius, o.radius, o.width, 28),
      o.tire
    );
    tire.rotation.z = Math.PI / 2;
    tire.position.set(x, o.y, z);
    tire.castShadow = true;
    g.add(tire);
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(o.radius * 0.58, o.radius * 0.58, o.width * 1.12, 22),
      o.rim
    );
    rim.rotation.z = Math.PI / 2;
    rim.position.set(x, o.y, z);
    g.add(rim);
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(o.radius * 0.22, o.radius * 0.22, o.width * 1.2, 14),
      o.hub
    );
    hub.rotation.z = Math.PI / 2;
    hub.position.set(x, o.y, z);
    g.add(hub);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(o.radius * 0.09, o.radius * 0.95, o.width * 0.12),
        o.spoke
      );
      spoke.position.set(x, o.y, z);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.x = a;
      g.add(spoke);
    }
  }
}

function seatBucket(g, x, z, cushion, bolster, tall = true) {
  add(g, new THREE.BoxGeometry(0.5, 0.16, 0.48), cushion, x, 0.96, z);
  add(g, new THREE.BoxGeometry(0.42, 0.1, 0.4), bolster, x, 1.03, z, { cast: false });
  add(g, new THREE.BoxGeometry(0.5, tall ? 0.58 : 0.48, 0.14), cushion, x, tall ? 1.3 : 1.24, z - 0.22);
  add(g, new THREE.BoxGeometry(0.4, tall ? 0.44 : 0.36, 0.1), bolster, x, tall ? 1.32 : 1.26, z - 0.18, {
    cast: false,
  });
  if (tall) add(g, new THREE.BoxGeometry(0.32, 0.14, 0.1), bolster, x, 1.62, z - 0.22);
}

// ─── YAMAHA: compact white classic, 4 seats ───
function buildYamaha() {
  const g = new THREE.Group();
  g.name = "cart-yamaha";
  const white = mat("#f8f8f6", 0.18, 0.52);
  const whiteSoft = mat("#ecece8", 0.28, 0.4);
  const black = mat("#101012", 0.42, 0.38);
  const blackMatte = mat("#1a1a1c", 0.78, 0.12);
  const charcoal = mat("#2c2c30", 0.8, 0.1);
  const cream = mat("#f2ebe3", 0.62, 0.08);
  const silver = mat("#c8ccd0", 0.22, 0.82);
  const tire = mat("#121214", 0.92, 0.05);
  const hl = mat("#fff8e8", 0.1, 0.95);
  const amber = mat("#e8a030", 0.38, 0.35);
  const glass = glassMat();

  // Compact body (shorter than Evolution)
  add(g, new THREE.BoxGeometry(1.5, 0.12, 2.35), blackMatte, 0, 0.35, 0);
  add(g, new THREE.BoxGeometry(0.14, 0.06, 1.5), black, -0.78, 0.33, 0);
  add(g, new THREE.BoxGeometry(0.14, 0.06, 1.5), black, 0.78, 0.33, 0);

  add(g, new THREE.BoxGeometry(1.38, 0.48, 1.85), white, 0, 0.7, -0.05);
  add(g, new THREE.SphereGeometry(0.42, 20, 16), white, -0.6, 0.6, 0.1, { sx: 0.55, sy: 0.85, sz: 1.7 });
  add(g, new THREE.SphereGeometry(0.42, 20, 16), white, 0.6, 0.6, 0.1, { sx: 0.55, sy: 0.85, sz: 1.7 });

  // Rounded Drive2 nose
  add(g, new THREE.SphereGeometry(0.7, 24, 18), white, 0, 0.7, 1.0, { sx: 1.0, sy: 0.55, sz: 0.85 });
  add(g, new THREE.SphereGeometry(0.5, 20, 16), white, -0.55, 0.52, 0.95, { sx: 0.75, sy: 0.9, sz: 1.15 });
  add(g, new THREE.SphereGeometry(0.5, 20, 16), white, 0.55, 0.52, 0.95, { sx: 0.75, sy: 0.9, sz: 1.15 });
  add(g, new THREE.BoxGeometry(1.2, 0.18, 0.3), black, 0, 0.38, 1.4);
  add(g, new THREE.CylinderGeometry(0.1, 0.11, 0.09, 16), hl, -0.36, 0.64, 1.45, { rx: Math.PI / 2 });
  add(g, new THREE.CylinderGeometry(0.1, 0.11, 0.09, 16), hl, 0.36, 0.64, 1.45, { rx: Math.PI / 2 });
  add(g, new THREE.CylinderGeometry(0.1, 0.1, 0.04, 18), black, 0, 0.7, 1.48, { rx: Math.PI / 2 });
  add(g, new THREE.CylinderGeometry(0.07, 0.07, 0.03, 18), silver, 0, 0.7, 1.5, { rx: Math.PI / 2, cast: false });
  add(g, new THREE.BoxGeometry(0.1, 0.05, 0.04), amber, -0.7, 0.7, 1.1, { cast: false });
  add(g, new THREE.BoxGeometry(0.1, 0.05, 0.04), amber, 0.7, 0.7, 1.1, { cast: false });

  // Rear
  add(g, new THREE.BoxGeometry(1.36, 0.46, 0.55), white, 0, 0.7, -1.1);
  add(g, new THREE.SphereGeometry(0.4, 16, 12), white, -0.52, 0.54, -1.05, { sx: 0.7, sy: 0.75, sz: 1.05 });
  add(g, new THREE.SphereGeometry(0.4, 16, 12), white, 0.52, 0.54, -1.05, { sx: 0.7, sy: 0.75, sz: 1.05 });
  add(g, new THREE.BoxGeometry(0.9, 0.07, 0.05), mat("#c02828", 0.35, 0.45), 0, 0.68, -1.4);

  // Dash + wheel
  add(g, new THREE.BoxGeometry(1.25, 0.2, 0.38), blackMatte, 0, 0.96, 0.48);
  add(g, new THREE.BoxGeometry(0.5, 0.05, 0.2), silver, 0, 1.05, 0.46, { cast: false });
  add(g, new THREE.CylinderGeometry(0.04, 0.05, 0.32, 10), black, 0.3, 0.94, 0.35, { rx: 0.9 });
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.028, 12, 22), black);
  sw.position.set(0.3, 1.08, 0.28);
  sw.rotation.x = Math.PI / 2.35;
  g.add(sw);

  // Open windshield
  add(g, new THREE.BoxGeometry(0.05, 0.6, 0.05), black, -0.66, 1.2, 0.52);
  add(g, new THREE.BoxGeometry(0.05, 0.6, 0.05), black, 0.66, 1.2, 0.52);
  add(g, new THREE.BoxGeometry(1.36, 0.05, 0.05), black, 0, 1.52, 0.52);
  add(g, new THREE.BoxGeometry(1.34, 0.05, 0.05), black, 0, 0.92, 0.55);
  add(g, new THREE.BoxGeometry(1.28, 0.55, 0.03), glass, 0, 1.22, 0.53, { rx: -0.06, cast: false });
  add(g, new THREE.BoxGeometry(0.12, 0.09, 0.07), black, -0.76, 1.32, 0.5);
  add(g, new THREE.BoxGeometry(0.12, 0.09, 0.07), black, 0.76, 1.32, 0.5);

  // 4 SEATS: 2 front buckets + rear bench (2-wide)
  seatBucket(g, -0.34, 0.05, charcoal, cream);
  seatBucket(g, 0.34, 0.05, charcoal, cream);
  add(g, new THREE.BoxGeometry(1.22, 0.15, 0.42), charcoal, 0, 0.96, -0.72);
  add(g, new THREE.BoxGeometry(1.12, 0.1, 0.34), cream, 0, 1.02, -0.72, { cast: false });
  add(g, new THREE.BoxGeometry(1.22, 0.5, 0.12), charcoal, 0, 1.24, -0.94);
  add(g, new THREE.BoxGeometry(1.12, 0.4, 0.09), cream, 0, 1.26, -0.9, { cast: false });
  add(g, new THREE.BoxGeometry(0.09, 0.28, 0.42), whiteSoft, -0.7, 1.0, 0);
  add(g, new THREE.BoxGeometry(0.09, 0.28, 0.42), whiteSoft, 0.7, 1.0, 0);

  addWheels(g, {
    track: 0.98,
    wheelBase: 1.48,
    radius: 0.4,
    width: 0.3,
    y: 0.4,
    tire,
    rim: black,
    hub: silver,
    spoke: black,
  });
  return g;
}

// ─── EVOLUTION: cyan electric, 4 seats only (2×2), mid-length ───
function buildEvolution() {
  const g = new THREE.Group();
  g.name = "cart-evolution";
  const cyan = mat("#28d0e2", 0.22, 0.55);
  const cyanBright = mat("#55e4f2", 0.24, 0.5);
  const cyanDeep = mat("#18a8b8", 0.28, 0.5);
  const black = mat("#0e1014", 0.42, 0.38);
  const blackSoft = mat("#1a1e24", 0.6, 0.22);
  const seatWhite = mat("#f4f8fa", 0.7, 0.08);
  const armCyan = mat("#42c4d6", 0.36, 0.35);
  const orange = mat("#ff7818", 0.28, 0.48);
  const orangeDeep = mat("#e84e08", 0.32, 0.42);
  const tire = mat("#101214", 0.92, 0.05);
  const led = mat("#eef8ff", 0.08, 0.95);
  const silver = mat("#c0c6cc", 0.22, 0.78);
  const glass = glassMat();

  // MID body — not a limo (4 seats needs less length than 6)
  add(g, new THREE.BoxGeometry(1.68, 0.13, 2.55), blackSoft, 0, 0.35, 0);
  add(g, new THREE.BoxGeometry(1.52, 0.5, 2.15), cyan, 0, 0.7, -0.08);
  add(g, new THREE.SphereGeometry(0.46, 18, 14), cyan, -0.66, 0.58, -0.05, { sx: 0.55, sy: 0.85, sz: 1.85 });
  add(g, new THREE.SphereGeometry(0.46, 18, 14), cyan, 0.66, 0.58, -0.05, { sx: 0.55, sy: 0.85, sz: 1.85 });

  add(g, new THREE.BoxGeometry(1.7, 0.28, 2.35), black, 0, 0.45, 0);
  add(g, new THREE.BoxGeometry(0.22, 0.06, 1.7), black, -0.9, 0.31, 0);
  add(g, new THREE.BoxGeometry(0.22, 0.06, 1.7), black, 0.9, 0.31, 0);
  add(g, new THREE.BoxGeometry(0.05, 0.09, 1.9), cyanBright, -0.88, 0.52, 0, { cast: false });
  add(g, new THREE.BoxGeometry(0.05, 0.09, 1.9), cyanBright, 0.88, 0.52, 0, { cast: false });

  // Aggressive front
  add(g, new THREE.BoxGeometry(1.48, 0.52, 0.7), cyan, 0, 0.72, 1.2);
  add(g, new THREE.BoxGeometry(0.7, 0.18, 0.52), cyanBright, 0, 0.96, 1.12);
  add(g, new THREE.BoxGeometry(1.35, 0.18, 0.35), black, 0, 0.4, 1.45);
  add(g, new THREE.BoxGeometry(0.3, 0.22, 0.06), blackSoft, 0, 0.76, 1.55);
  add(g, new THREE.CylinderGeometry(0.08, 0.08, 0.04, 14), silver, 0, 0.76, 1.58, { rx: Math.PI / 2, cast: false });
  add(g, new THREE.BoxGeometry(0.48, 0.12, 0.08), led, -0.48, 0.7, 1.52);
  add(g, new THREE.BoxGeometry(0.48, 0.12, 0.08), led, 0.48, 0.7, 1.52);
  add(g, new THREE.BoxGeometry(0.52, 0.16, 0.05), black, -0.48, 0.7, 1.48, { cast: false });
  add(g, new THREE.BoxGeometry(0.52, 0.16, 0.05), black, 0.48, 0.7, 1.48, { cast: false });
  add(g, new THREE.SphereGeometry(0.5, 18, 16), cyan, -0.7, 0.5, 1.05, { sx: 0.78, sy: 0.9, sz: 1.2 });
  add(g, new THREE.SphereGeometry(0.5, 18, 16), cyan, 0.7, 0.5, 1.05, { sx: 0.78, sy: 0.9, sz: 1.2 });
  add(g, new THREE.TorusGeometry(0.38, 0.06, 10, 20), black, -0.7, 0.38, 1.05, { rx: Math.PI / 2, cast: false });
  add(g, new THREE.TorusGeometry(0.38, 0.06, 10, 20), black, 0.7, 0.38, 1.05, { rx: Math.PI / 2, cast: false });
  add(g, new THREE.BoxGeometry(0.1, 0.07, 0.05), mat("#ff9a20", 0.35, 0.4), -0.78, 0.7, 1.25, { cast: false });
  add(g, new THREE.BoxGeometry(0.1, 0.07, 0.05), mat("#ff9a20", 0.35, 0.4), 0.78, 0.7, 1.25, { cast: false });

  // One pair of side vents (mid body)
  add(g, new THREE.CylinderGeometry(0.2, 0.2, 0.07, 20), black, -0.82, 0.76, -0.15, { rz: Math.PI / 2 });
  add(g, new THREE.TorusGeometry(0.16, 0.035, 10, 20), silver, -0.82, 0.76, -0.15, { rz: Math.PI / 2, cast: false });
  add(g, new THREE.CylinderGeometry(0.2, 0.2, 0.07, 20), black, 0.82, 0.76, -0.15, { rz: Math.PI / 2 });
  add(g, new THREE.TorusGeometry(0.16, 0.035, 10, 20), silver, 0.82, 0.76, -0.15, { rz: Math.PI / 2, cast: false });

  // Rear
  add(g, new THREE.BoxGeometry(1.48, 0.48, 0.5), cyanDeep, 0, 0.7, -1.25);
  add(g, new THREE.SphereGeometry(0.4, 14, 12), cyan, -0.62, 0.52, -1.18, { sx: 0.7, sy: 0.8, sz: 1.05 });
  add(g, new THREE.SphereGeometry(0.4, 14, 12), cyan, 0.62, 0.52, -1.18, { sx: 0.7, sy: 0.8, sz: 1.05 });
  add(g, new THREE.BoxGeometry(1.0, 0.09, 0.06), mat("#ff3030", 0.3, 0.55), 0, 0.74, -1.52);
  add(g, new THREE.BoxGeometry(0.08, 0.45, 0.35), cyan, -0.8, 1.15, -1.1);
  add(g, new THREE.BoxGeometry(0.08, 0.45, 0.35), cyan, 0.8, 1.15, -1.1);

  // Open windshield
  add(g, new THREE.BoxGeometry(0.06, 0.6, 0.06), silver, -0.72, 1.2, 0.65);
  add(g, new THREE.BoxGeometry(0.06, 0.6, 0.06), silver, 0.72, 1.2, 0.65);
  add(g, new THREE.BoxGeometry(1.48, 0.05, 0.05), silver, 0, 1.52, 0.63);
  add(g, new THREE.BoxGeometry(1.46, 0.05, 0.05), black, 0, 0.92, 0.7);
  add(g, new THREE.BoxGeometry(1.4, 0.55, 0.035), glass, 0, 1.22, 0.65, { rx: -0.1, cast: false });
  add(g, new THREE.BoxGeometry(0.08, 0.06, 0.2), black, -0.88, 1.35, 0.58);
  add(g, new THREE.BoxGeometry(0.14, 0.11, 0.06), black, -0.96, 1.37, 0.48);
  add(g, new THREE.BoxGeometry(0.08, 0.06, 0.2), black, 0.88, 1.35, 0.58);
  add(g, new THREE.BoxGeometry(0.14, 0.11, 0.06), black, 0.96, 1.37, 0.48);

  // 4 SEATS only: 2 rows × 2 (NOT a third row)
  for (const z of [0.25, -0.55]) {
    for (const x of [-0.36, 0.36]) {
      add(g, new THREE.BoxGeometry(0.5, 0.15, 0.44), seatWhite, x, 0.96, z);
      add(g, new THREE.BoxGeometry(0.5, 0.55, 0.12), seatWhite, x, 1.28, z - 0.2);
      add(g, new THREE.BoxGeometry(0.28, 0.13, 0.1), seatWhite, x, 1.58, z - 0.2);
      add(g, new THREE.BoxGeometry(0.08, 0.11, 0.36), armCyan, x - 0.26, 1.1, z);
      add(g, new THREE.BoxGeometry(0.08, 0.11, 0.36), armCyan, x + 0.26, 1.1, z);
    }
  }

  add(g, new THREE.BoxGeometry(1.38, 0.26, 0.4), blackSoft, 0, 0.96, 0.55);
  add(g, new THREE.BoxGeometry(0.45, 0.07, 0.22), cyanBright, 0, 1.08, 0.52, { cast: false });
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.028, 12, 18), black);
  sw.position.set(0.3, 1.12, 0.38);
  sw.rotation.x = Math.PI / 2.35;
  g.add(sw);
  add(g, new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10), black, 0.3, 0.98, 0.45, { rx: 0.85 });

  // Signature orange wheels — larger than Yamaha
  addWheels(g, {
    track: 1.08,
    wheelBase: 1.65,
    radius: 0.45,
    width: 0.35,
    y: 0.45,
    tire,
    rim: orange,
    hub: orangeDeep,
    spoke: orange,
  });
  return g;
}

// ─── HOT ROD: street rod, 2 seats only ───
function buildHotrod() {
  const g = new THREE.Group();
  g.name = "cart-hotrod";
  const blue = mat("#2870c8", 0.2, 0.6);
  const blueDeep = mat("#1a589c", 0.24, 0.55);
  const blueBright = mat("#3884d8", 0.22, 0.58);
  const silver = mat("#eef2f6", 0.24, 0.65);
  const silverSoft = mat("#d8dde4", 0.32, 0.52);
  const chrome = mat("#f2f6f8", 0.1, 0.95);
  const black = mat("#101012", 0.48, 0.32);
  const blackMatte = mat("#18181a", 0.8, 0.12);
  const seatBlue = mat("#284c98", 0.65, 0.15);
  const seatCream = mat("#d8dee8", 0.62, 0.1);
  const flame = mat("#78c4f0", 0.28, 0.45);
  const flameHot = mat("#aee4ff", 0.24, 0.5);
  const tire = mat("#0e0e10", 0.92, 0.05);
  const hl = mat("#fff8e0", 0.1, 0.95);
  const glass = glassMat();

  // Short 2-seater chassis
  add(g, new THREE.BoxGeometry(1.5, 0.11, 2.15), blackMatte, 0, 0.34, 0);
  add(g, new THREE.BoxGeometry(0.18, 0.05, 0.95), silverSoft, -0.82, 0.3, 0.05);
  add(g, new THREE.BoxGeometry(0.18, 0.05, 0.95), silverSoft, 0.82, 0.3, 0.05);

  // Compact blue cabin
  add(g, new THREE.BoxGeometry(1.32, 0.55, 1.25), blue, 0, 0.76, -0.05);
  add(g, new THREE.BoxGeometry(1.36, 0.04, 1.2), chrome, 0, 1.02, -0.05, { cast: false });
  add(g, new THREE.BoxGeometry(0.08, 0.42, 0.75), blueDeep, -0.65, 0.82, 0.05);
  add(g, new THREE.BoxGeometry(0.08, 0.42, 0.75), blueDeep, 0.65, 0.82, 0.05);

  // Big silver classic nose
  add(g, new THREE.SphereGeometry(0.68, 24, 20), silver, -0.68, 0.54, 0.9, { sx: 0.95, sy: 0.78, sz: 1.35 });
  add(g, new THREE.SphereGeometry(0.68, 24, 20), silver, 0.68, 0.54, 0.9, { sx: 0.95, sy: 0.78, sz: 1.35 });
  add(g, new THREE.SphereGeometry(0.36, 18, 14), silver, -0.52, 0.44, 1.45, { sx: 0.95, sy: 0.72, sz: 0.9 });
  add(g, new THREE.SphereGeometry(0.36, 18, 14), silver, 0.52, 0.44, 1.45, { sx: 0.95, sy: 0.72, sz: 0.9 });
  add(g, new THREE.BoxGeometry(0.82, 0.52, 0.75), silver, 0, 0.7, 1.1);
  add(g, new THREE.BoxGeometry(0.45, 0.16, 0.7), silverSoft, 0, 0.98, 1.02);
  add(g, new THREE.SphereGeometry(0.42, 18, 14), silver, 0, 0.86, 1.2, { sx: 0.95, sy: 0.48, sz: 0.72 });

  // Tall chrome grille
  for (let i = -5; i <= 5; i++) {
    add(g, new THREE.BoxGeometry(0.03, 0.48, 0.05), chrome, i * 0.06, 0.62, 1.52, { cast: false });
  }
  add(g, new THREE.BoxGeometry(0.78, 0.05, 0.06), chrome, 0, 0.88, 1.52);
  add(g, new THREE.BoxGeometry(0.78, 0.05, 0.06), chrome, 0, 0.38, 1.52);
  add(g, new THREE.BoxGeometry(0.05, 0.52, 0.06), chrome, -0.36, 0.62, 1.52);
  add(g, new THREE.BoxGeometry(0.05, 0.52, 0.06), chrome, 0.36, 0.62, 1.52);

  add(g, new THREE.BoxGeometry(1.58, 0.1, 0.15), chrome, 0, 0.26, 1.58);
  add(g, new THREE.SphereGeometry(0.11, 14, 12), chrome, -0.8, 0.26, 1.58);
  add(g, new THREE.SphereGeometry(0.11, 14, 12), chrome, 0.8, 0.26, 1.58);
  add(g, new THREE.SphereGeometry(0.15, 16, 14), hl, -0.72, 0.7, 1.35);
  add(g, new THREE.SphereGeometry(0.15, 16, 14), hl, 0.72, 0.7, 1.35);
  add(g, new THREE.TorusGeometry(0.16, 0.025, 10, 18), chrome, -0.72, 0.7, 1.35, { cast: false });
  add(g, new THREE.TorusGeometry(0.16, 0.025, 10, 18), chrome, 0.72, 0.7, 1.35, { cast: false });

  // Flames
  for (const side of [-1, 1]) {
    const x = side * 0.8;
    add(g, new THREE.BoxGeometry(0.06, 0.1, 0.7), flame, x, 0.6, 0.7, { cast: false });
    add(g, new THREE.BoxGeometry(0.05, 0.16, 0.48), flameHot, x, 0.7, 0.95, { cast: false });
    add(g, new THREE.BoxGeometry(0.045, 0.22, 0.28), flame, x, 0.8, 1.12, { cast: false });
    add(g, new THREE.BoxGeometry(0.04, 0.12, 0.5), flameHot, x, 0.52, 0.6, { cast: false });
  }

  // Short rear
  add(g, new THREE.SphereGeometry(0.5, 18, 16), blueBright, -0.6, 0.54, -0.85, { sx: 0.88, sy: 0.74, sz: 1.1 });
  add(g, new THREE.SphereGeometry(0.5, 18, 16), blueBright, 0.6, 0.54, -0.85, { sx: 0.88, sy: 0.74, sz: 1.1 });
  add(g, new THREE.BoxGeometry(1.28, 0.48, 0.5), blue, 0, 0.72, -0.95);
  add(g, new THREE.BoxGeometry(0.9, 0.05, 0.05), chrome, 0, 0.68, -1.22, { cast: false });
  add(g, new THREE.BoxGeometry(1.1, 0.1, 0.3), blueDeep, 0, 0.98, -1.05);

  // Interior + 2 SEATS only
  add(g, new THREE.BoxGeometry(1.2, 0.1, 0.9), blackMatte, 0, 0.48, 0.05);
  add(g, new THREE.BoxGeometry(1.15, 0.2, 0.36), black, 0, 0.96, 0.42);
  add(g, new THREE.BoxGeometry(0.35, 0.05, 0.18), chrome, 0, 1.05, 0.4, { cast: false });
  add(g, new THREE.CylinderGeometry(0.035, 0.04, 0.3, 10), black, 0.26, 0.94, 0.3, { rx: 0.95 });
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.028, 12, 20), black);
  sw.position.set(0.26, 1.08, 0.24);
  sw.rotation.x = Math.PI / 2.4;
  g.add(sw);

  seatBucket(g, -0.32, 0.02, seatBlue, seatCream);
  seatBucket(g, 0.32, 0.02, seatBlue, seatCream);
  // No rear seats

  // Compact open windshield
  add(g, new THREE.BoxGeometry(1.12, 0.05, 0.05), chrome, 0, 1.45, 0.45);
  add(g, new THREE.BoxGeometry(0.05, 0.5, 0.05), chrome, -0.54, 1.18, 0.48);
  add(g, new THREE.BoxGeometry(0.05, 0.5, 0.05), chrome, 0.54, 1.18, 0.48);
  add(g, new THREE.BoxGeometry(1.08, 0.48, 0.035), glass, 0, 1.18, 0.48, { rx: -0.16, cast: false });
  add(g, new THREE.BoxGeometry(0.14, 0.09, 0.02), mat("#e8c84a", 0.48, 0.22), 0.36, 1.35, 0.52, { cast: false });

  addWheels(g, {
    track: 1.0,
    wheelBase: 1.42,
    radius: 0.42,
    width: 0.3,
    y: 0.42,
    tire,
    rim: chrome,
    hub: chrome,
    spoke: chrome,
  });
  return g;
}

/** Closed-cabin Cybertruck — stainless origami hull, disc aero covers, no seats/driver. */
function buildCybertruck() {
  const g = new THREE.Group();
  g.name = "cart-cybertruck";

  // Bright stainless — env map in-game makes this actually shiny
  const steel = mat("#f1f4f8", 0.12, 0.88);
  const steelDark = mat("#dde3ea", 0.16, 0.82);
  const blackMatte = mat("#141416", 0.82, 0.12);
  const cladding = mat("#2a2c30", 0.78, 0.08);
  const glass = new THREE.MeshStandardMaterial({
    color: "#12151a",
    roughness: 0.08,
    metalness: 0.72,
    transparent: true,
    opacity: 0.92,
  });
  const lightBar = new THREE.MeshStandardMaterial({
    color: "#f4f7fb",
    roughness: 0.12,
    metalness: 0.4,
    emissive: "#eef4ff",
    emissiveIntensity: 1.35,
  });
  const tailBar = new THREE.MeshStandardMaterial({
    color: "#ff2a2a",
    roughness: 0.22,
    metalness: 0.35,
    emissive: "#ff1a1a",
    emissiveIntensity: 1.15,
  });
  const tire = mat("#0c0c0e", 0.94, 0.04);
  const disc = mat("#161618", 0.55, 0.35);
  const hub = mat("#2a2a2e", 0.4, 0.55);

  const halfW = 0.9;
  const pts = [];
  const ring = (z, y, w = halfW) => {
    pts.push(new THREE.Vector3(-w, y, z));
    pts.push(new THREE.Vector3(w, y, z));
  };
  // Cab + nose only — bed is built separately so it can stay open/silver
  ring(-0.52, 0.34, 0.9);
  ring(-0.52, 1.2, 0.9);
  ring(-0.38, 1.7, 0.88);
  ring(0.32, 1.74, 0.86);
  ring(2.08, 0.7, 0.82);
  ring(2.08, 0.34, 0.82);
  ring(0.9, 0.34, 0.88);

  const hull = new THREE.Mesh(new ConvexGeometry(pts), steel);
  hull.castShadow = true;
  hull.receiveShadow = true;
  g.add(hull);

  // Thin dark rocker — keep the body mostly silver
  add(g, new THREE.BoxGeometry(1.74, 0.16, 3.4), cladding, 0, 0.36, 0.05, { cast: false });
  add(g, new THREE.BoxGeometry(1.7, 0.14, 0.18), blackMatte, 0, 0.38, 2.02);
  add(g, new THREE.BoxGeometry(1.7, 0.16, 0.16), blackMatte, 0, 0.4, -1.98);

  // Wheel-arch lips (narrow, so they don't paint the doors black)
  for (const z of [1.12, -1.12]) {
    add(g, new THREE.BoxGeometry(1.88, 0.28, 0.55), cladding, 0, 0.44, z, { cast: false });
  }

  // Windshield: black glass ON the front slope (roof high → nose low).
  // +Z is the nose. Positive rx pitches the front of a Y-thin box DOWN, so it
  // lies back on the truck instead of standing up like an open hood.
  const glassTopZ = 0.5;
  const glassTopY = 1.64;
  const glassBotZ = 1.18;
  const glassBotY = 1.22;
  const gLen = Math.hypot(glassBotZ - glassTopZ, glassTopY - glassBotY);
  const gAng = Math.atan2(glassTopY - glassBotY, glassBotZ - glassTopZ);
  add(
    g,
    new THREE.BoxGeometry(1.22, 0.03, gLen),
    glass,
    0,
    (glassTopY + glassBotY) / 2 + 0.04,
    (glassTopZ + glassBotZ) / 2 + 0.02,
    { rx: gAng, cast: false }
  );

  // Side windows (black)
  add(g, new THREE.BoxGeometry(0.03, 0.3, 0.82), glass, -0.91, 1.36, 0.1, { cast: false });
  add(g, new THREE.BoxGeometry(0.03, 0.3, 0.82), glass, 0.91, 1.36, 0.1, { cast: false });

  // Rear cab glass, flush with the back of the greenhouse (not sticking up)
  add(g, new THREE.BoxGeometry(1.42, 0.26, 0.03), glass, 0, 1.48, -0.46, { cast: false });

  // Front light bar wrapping the nose
  add(g, new THREE.BoxGeometry(1.62, 0.045, 0.06), lightBar, 0, 0.78, 2.06, { cast: false });
  add(g, new THREE.BoxGeometry(0.05, 0.04, 0.28), lightBar, -0.8, 0.76, 1.92, { cast: false });
  add(g, new THREE.BoxGeometry(0.05, 0.04, 0.28), lightBar, 0.8, 0.76, 1.92, { cast: false });

  // Tonneau starts at the ROOF and rakes down to the tailgate
  const tonneau = new THREE.MeshStandardMaterial({
    color: "#1a1e24",
    roughness: 0.42,
    metalness: 0.28,
  });
  const rib = new THREE.MeshStandardMaterial({
    color: "#2a3038",
    roughness: 0.38,
    metalness: 0.32,
  });
  const tLen = Math.hypot(1.54, 0.56);
  const tAng = -Math.atan2(0.56, 1.54);
  add(g, new THREE.BoxGeometry(1.68, 0.055, tLen), tonneau, 0, 1.42, -1.15, { rx: tAng });
  for (let i = 0; i < 8; i++) {
    const t = (i + 0.5) / 8;
    add(
      g,
      new THREE.BoxGeometry(1.62, 0.012, 0.04),
      rib,
      0,
      1.7 - t * 0.56 + 0.03,
      -0.4 - t * 1.54,
      { rx: tAng, cast: false }
    );
  }

  // Silver tailgate under the low end of the tonneau
  add(g, new THREE.BoxGeometry(1.68, 0.7, 0.08), steel, 0, 0.8, -1.9, { rx: 0.04 });
  add(g, new THREE.BoxGeometry(1.5, 0.18, 1.38), steel, 0, 0.48, -1.2, { cast: false });

  // Fill the side rear quarters (cab roof → tailgate) so they aren't hollow
  function addBedSide(xPos) {
    const s = new THREE.Shape();
    s.moveTo(-0.5, 0.42);
    s.lineTo(-0.5, 1.7);
    s.lineTo(-1.92, 1.12);
    s.lineTo(-1.92, 0.42);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: false });
    geo.rotateY(-Math.PI / 2);
    const m = new THREE.Mesh(geo, steel);
    m.position.x = xPos;
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
  }
  addBedSide(-0.78);
  addBedSide(0.88);

  // Light bar at the back edge, under the tonneau
  add(g, new THREE.BoxGeometry(1.58, 0.05, 0.05), tailBar, 0, 1.14, -1.94, { cast: false });

  // Black rear bumper
  add(g, new THREE.BoxGeometry(1.72, 0.22, 0.32), blackMatte, 0, 0.4, -2.02);
  add(g, new THREE.BoxGeometry(0.18, 0.12, 0.12), blackMatte, 0, 0.32, -2.18, { cast: false });

  // Side mirrors
  add(g, new THREE.BoxGeometry(0.06, 0.05, 0.22), blackMatte, -0.98, 1.12, 0.72);
  add(g, new THREE.BoxGeometry(0.16, 0.1, 0.22), blackMatte, -1.12, 1.14, 0.62);
  add(g, new THREE.BoxGeometry(0.06, 0.05, 0.22), blackMatte, 0.98, 1.12, 0.72);
  add(g, new THREE.BoxGeometry(0.16, 0.1, 0.22), blackMatte, 1.12, 1.14, 0.62);

  // Door crease suggestion
  add(g, new THREE.BoxGeometry(0.02, 0.55, 0.9), steelDark, -0.91, 0.92, 0.15, { cast: false });
  add(g, new THREE.BoxGeometry(0.02, 0.55, 0.9), steelDark, 0.91, 0.92, 0.15, { cast: false });

  // Disc aero wheel covers (front 3/4 photo)
  const track = 1.52;
  const wheelBase = 2.22;
  const radius = 0.46;
  const width = 0.34;
  const wy = 0.46;
  const pos = [
    [-track / 2, wheelBase / 2],
    [track / 2, wheelBase / 2],
    [-track / 2, -wheelBase / 2],
    [track / 2, -wheelBase / 2],
  ];
  for (const [x, z] of pos) {
    const rubber = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 32), tire);
    rubber.rotation.z = Math.PI / 2;
    rubber.position.set(x, wy, z);
    rubber.castShadow = true;
    g.add(rubber);
    const cover = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.78, radius * 0.78, width * 1.08, 28),
      disc
    );
    cover.rotation.z = Math.PI / 2;
    cover.position.set(x, wy, z);
    g.add(cover);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.16, radius * 0.16, width * 1.16, 16), hub);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(x, wy, z);
    g.add(cap);
  }

  return g;
}

async function exportGlb(name, group) {
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const c = box.getCenter(new THREE.Vector3());
  group.position.x -= c.x;
  group.position.z -= c.z;
  group.position.y -= box.min.y;
  group.updateMatrixWorld(true);

  const exporter = new GLTFExporter();
  const ab = await exporter.parseAsync(group, { binary: true, onlyVisible: true });
  const out = path.join(OUT_DIR, `${name}.glb`);
  fs.writeFileSync(out, Buffer.from(ab));
  console.log(`  ${name}.glb  ${Math.round(ab.byteLength / 1024)} KB`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Exporting redesigned carts (2 or 4 seats only + Cybertruck)…");
  await exportGlb("yamaha", buildYamaha());
  await exportGlb("evolution", buildEvolution());
  await exportGlb("hotrod", buildHotrod());
  await exportGlb("cybertruck", buildCybertruck());
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
