import fs from "fs";

const p = "src/game/world3d.ts";
let s = fs.readFileSync(p, "utf8");
const start = s.indexOf("function buildHazardMesh(h: HazardInstance): THREE.Group {");
const end = s.indexOf("function makeTextSprite(text: string, fg: string, bg: string)");
if (start < 0 || end < 0) {
  console.error("markers", start, end);
  process.exit(1);
}

const replacement = `function buildHazardMesh(h: HazardInstance): { root: THREE.Group; isSprite: boolean } {
  const g = new THREE.Group();
  const sprite = createHazardSprite(h.type);
  if (sprite) {
    // Soft ground shadow under the art
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.7, 16),
      new THREE.MeshBasicMaterial({
        color: "#1c2430",
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.04;
    g.add(shadow);
    g.add(sprite);
    return { root: g, isSprite: true };
  }

  // Fallback simple marker if art not loaded yet
  const def = HAZARD_DEFS[h.type];
  const sScale = def.scale * 0.55;
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.55 * sScale, 12, 10),
    mat(def.color, 0.55, 0.2)
  );
  body.position.y = 0.55 * sScale;
  body.castShadow = true;
  g.add(body);
  return { root: g, isSprite: false };
}

`;

s = s.slice(0, start) + replacement + s.slice(end);
fs.writeFileSync(p, s);
console.log("ok, replaced buildHazardMesh");
