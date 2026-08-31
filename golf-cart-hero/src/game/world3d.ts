import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { theme } from "../theme";
import type { AssetMaterials } from "./assets/loader";
import { createFallbackMaterials } from "./assets/loader";
import { createHazardSprite, hasHazardSprite } from "./assets/hazardSprites";
import { buildTexturedCart } from "./assets/models";
import type { AreaTheme } from "./data/areas";
import { getDriveArea, type AreaId } from "./data/areas";
import {
  HAZARD_ART_FACES_RIGHT,
  HAZARD_DEFS,
  type HazardInstance,
} from "./data/hazards";
import { LANDMARKS, WORLD } from "./data/landmarks";
import type { DonationTierUsd } from "./donations";
import type { AmmoPickup, Projectile, SolidObstacle } from "./race";
import { projectileEmoji, projectileLabel } from "./race";
import {
  BRIDGE_PEAK_ELEV,
  CURB_WIDTH,
  ROAD_CLEAR_BUILDING,
  ROAD_CLEAR_PROP,
  ROAD_CLEAR_TREE,
  ROAD_HALF_WIDTH,
  SIDEWALK_WIDTH,
  TRACK_BRIDGES,
  TRACK_GATES,
  TRACK_ROUNDABOUTS,
  TRACK_WAYPOINTS,
  clearOfRoad,
  onRoundabout,
  type DecorBlob,
  type GateSite,
  type RoadSample,
  type RoundaboutSite,
} from "./data/track";
import type { Racer } from "./race";

type HazardMesh = {
  id: number;
  root: THREE.Group;
  /** True when using whimsical art billboard */
  isSprite: boolean;
  sprite?: THREE.Sprite;
  baseScaleX?: number;
  baseScaleY?: number;
  label?: THREE.Sprite;
};

export class World3D {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  private racerMeshes = new Map<string, THREE.Group>();
  private hazardMeshes = new Map<number, HazardMesh>();
  private projectileMeshes = new Map<number, THREE.Object3D>();
  private solidMarkers = new Map<number, THREE.Object3D>();
  private pickupMeshes = new Map<number, THREE.Group>();
  /** Animated community gate arms (raise / lower) */
  private gateArms: { arm: THREE.Object3D; site: GateSite }[] = [];
  private camPos = new THREE.Vector3();
  private camTarget = new THREE.Vector3();
  private lookAhead = new THREE.Vector3();
  private tmp = new THREE.Vector3();
  private clock = 0;

  private houseGeo: THREE.BoxGeometry;
  private palmTrunkGeo: THREE.CylinderGeometry;
  private palmLeafGeo: THREE.ConeGeometry;
  private materials: AssetMaterials;
  private areaTheme: AreaTheme = getDriveArea("spanish-springs").theme;
  private activeAreaId: AreaId = "spanish-springs";
  /** When true, next updateCamera snaps instead of lerping from origin */
  private cameraNeedsSnap = true;
  /** Track-local bounds used for ground / visibility */
  private trackBounds = { minX: -200, maxX: 200, minY: -200, maxY: 200, cx: 0, cz: 0 };

  constructor(canvas: HTMLCanvasElement, materials?: AssetMaterials) {
    this.materials = materials ?? createFallbackMaterials();
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // Slightly punchy “realistic cartoon” look
    this.renderer.toneMappingExposure = 1.22;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#7ec8ef");
    // Light distant haze only — full local track must stay solid, not fade into void
    this.scene.fog = new THREE.Fog("#c8e8f8", 280, 1100);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.85;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / Math.max(1, window.innerHeight),
      0.35,
      2800
    );

    this.houseGeo = new THREE.BoxGeometry(1, 1, 1);
    this.palmTrunkGeo = new THREE.CylinderGeometry(0.16, 0.24, 1, 12);
    this.palmLeafGeo = new THREE.ConeGeometry(1.1, 1.85, 8);
  }

  /** Hot-swap materials after async art pack load (rebuild world on next race). */
  setMaterials(materials: AssetMaterials) {
    this.materials = materials;
  }

  /** Build static world once per race, themed to a Town Square area */
  buildWorld(samples: RoadSample[], decor: DecorBlob[], areaId?: AreaId) {
    if (areaId) {
      this.activeAreaId = areaId;
      this.areaTheme = getDriveArea(areaId).theme;
    }
    const theme = this.areaTheme;

    // Track-local bounds so ground/fog/camera cover the whole loop immediately
    this.trackBounds = computeTrackBounds(samples, 160);

    // Clear previous dynamic content
    while (this.scene.children.length) this.scene.remove(this.scene.children[0]);
    this.racerMeshes.clear();
    this.hazardMeshes.clear();
    this.projectileMeshes.clear();
    this.solidMarkers.clear();
    this.pickupMeshes.clear();
    this.gateArms = [];

    // Sky gradient lives on the dome; solid mid color alone looks like a blank wall
    this.scene.background = new THREE.Color(theme.skyBottom);
    // Very light atmospheric haze only — never a solid fog wall that eats the road.
    // (Spanish Springs fog was #e8d4b0 ≈ sky, so the path vanished into tan void.)
    const loopSpan = Math.max(
      this.trackBounds.maxX - this.trackBounds.minX,
      this.trackBounds.maxY - this.trackBounds.minY
    );
    const fogNear = Math.max(380, loopSpan * 1.1);
    const fogFar = Math.max(1400, loopSpan * 3.5);
    // Cooler / lighter haze so dark asphalt stays readable even at range
    this.scene.fog = new THREE.Fog(theme.skyBottom, fogNear, fogFar);
    this.camera.far = Math.max(3200, fogFar + 600);
    this.camera.updateProjectionMatrix();

    // Tint materials to area palette — but KEEP asphalt dark/readable
    // so the cart path never blends into grass or plaza theming.
    this.materials.grass.color.set(theme.grass);
    this.materials.grassDeep.color.set(theme.grassDeep);
    this.materials.asphalt.color.set("#5a5e68");
    this.materials.asphaltDark.color.set("#484c54");
    this.materials.sidewalk.color.set(theme.sidewalk);
    // High-contrast green curb so road edges pop
    this.materials.curb.color.set("#3d9a58");
    this.materials.water.color.set(theme.water);
    this.materials.stucco.color.set(theme.stucco[0]);
    this.materials.stuccoAlt.color.set(theme.stucco[1] ?? theme.stucco[0]);
    this.materials.roof.color.set(theme.roof);
    this.materials.roofBlue.color.set(theme.roofAlt);
    this.materials.roofGreen.color.set(theme.roof);
    this.materials.plaza.color.set(theme.plaza);
    this.materials.line.color.set("#ffffff");
    this.materials.center.color.set("#f5d040");

    // CRITICAL: cart path + nearby terrain must never fog-blend into the horizon.
    // Fog on MeshStandardMaterial was washing the road into a solid tan wall.
    for (const m of [
      this.materials.asphalt,
      this.materials.asphaltDark,
      this.materials.line,
      this.materials.center,
      this.materials.curb,
      this.materials.sidewalk,
      this.materials.grass,
      this.materials.grassDeep,
      this.materials.fairway,
      this.materials.plaza,
      this.materials.parking,
      this.materials.sand,
    ]) {
      m.fog = false;
    }

    this.addLights(theme);
    this.addGround();
    this.addRoad(samples);
    this.addSidewalks(samples);
    this.addBridges(samples);
    this.addRoundabouts();
    this.addCommunityGates();
    this.addDecor(decor);
    this.addLandmarks(areaId);
    this.addStreetFurniture(samples);
    this.addRoadsideDetail(samples);
    this.addSkyDecor();

    // Camera must start on the track — never lerp in from world origin
    this.cameraNeedsSnap = true;

    // Compile / upload GPU state before first visible race frame (avoids blank hitch)
    this.renderer.compile(this.scene, this.camera);
  }

  /** Snap chase cam behind the player immediately (call after racers spawn). */
  snapCameraToPlayer(player: Racer) {
    this.cameraNeedsSnap = true;
    this.updateCamera(player, 1 / 60);
  }

  private addLights(theme: AreaTheme) {
    const hemi = new THREE.HemisphereLight(theme.skyBottom, theme.grassDeep, 1.15);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight("#fff6e0", 1.75);
    sun.position.set(140, 200, 90);
    sun.castShadow = true;
    // Smaller shadow map = less GPU hitch when the full track appears at once
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 5;
    sun.shadow.camera.far = 700;
    sun.shadow.camera.left = -280;
    sun.shadow.camera.right = 280;
    sun.shadow.camera.top = 280;
    sun.shadow.camera.bottom = -280;
    // Keep sun relative to the active track center
    sun.position.set(this.trackBounds.cx + 140, 200, this.trackBounds.cz + 90);
    sun.target.position.set(this.trackBounds.cx, 0, this.trackBounds.cz);
    this.scene.add(sun.target);
    sun.shadow.bias = -0.00015;
    sun.shadow.normalBias = 0.04;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight(theme.skyMid, 0.45);
    fill.position.set(-90, 50, -70);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(theme.accent, 0.3);
    rim.position.set(40, 20, -120);
    this.scene.add(rim);

    const skyGeo = new THREE.SphereGeometry(2200, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(theme.skyTop) },
        midColor: { value: new THREE.Color(theme.skyMid) },
        bottomColor: { value: new THREE.Color(theme.skyBottom) },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col = mix(bottomColor, midColor, smoothstep(-0.15, 0.25, h));
          col = mix(col, topColor, smoothstep(0.2, 0.85, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    this.scene.add(new THREE.Mesh(skyGeo, skyMat));
  }

  private addGround() {
    // Ground covers the active loop with a huge pad so the horizon is never a fog void
    const tb = this.trackBounds;
    const w = Math.max(900, (tb.maxX - tb.minX) * 2.2);
    const h = Math.max(900, (tb.maxY - tb.minY) * 2.2);
    const cx = tb.cx;
    const cz = tb.cz;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h, 24, 24),
      this.materials.grass
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(cx, 0, cz);
    ground.receiveShadow = true;
    ground.frustumCulled = false;
    this.scene.add(ground);

    // Multi-tone lawn patches only inside the track neighborhood
    const patchGeo = new THREE.CircleGeometry(1, 16);
    const rng = mulberry32(42);
    const dummy = new THREE.Object3D();
    const tones = [
      this.materials.grassDeep,
      mat("#4aad68", 0.95, 0.12),
      mat("#3d9458", 0.95, 0.12),
      mat("#5cb87a", 0.92, 0.12),
    ];
    const keepOffPavement = (x: number, z: number) =>
      clearOfRoad(x, z, ROAD_HALF_WIDTH + 4) &&
      !onRoundabout(x, z, ROAD_HALF_WIDTH + CURB_WIDTH + SIDEWALK_WIDTH + 4);

    for (const matRef of tones) {
      const mesh = new THREE.InstancedMesh(patchGeo, matRef, 70);
      let placed = 0;
      for (let tries = 0; tries < 220 && placed < 70; tries++) {
        const x = tb.minX + rng() * (tb.maxX - tb.minX);
        const z = tb.minY + rng() * (tb.maxY - tb.minY);
        if (!keepOffPavement(x, z)) continue;
        const s = 6 + rng() * 22;
        dummy.position.set(x, 0.02 + rng() * 0.02, z);
        dummy.scale.set(s, s * (0.7 + rng() * 0.5), s);
        dummy.rotation.x = -Math.PI / 2;
        dummy.rotation.z = rng() * Math.PI;
        dummy.updateMatrix();
        mesh.setMatrixAt(placed++, dummy.matrix);
      }
      mesh.count = placed;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }

    const sandMesh = new THREE.InstancedMesh(patchGeo, this.materials.sand, 50);
    let sandN = 0;
    for (let tries = 0; tries < 160 && sandN < 50; tries++) {
      const x = tb.minX + rng() * (tb.maxX - tb.minX);
      const z = tb.minY + rng() * (tb.maxY - tb.minY);
      if (!keepOffPavement(x, z)) continue;
      const s = 3 + rng() * 12;
      dummy.position.set(x, 0.03, z);
      dummy.scale.set(s, s * 0.6, s);
      dummy.rotation.x = -Math.PI / 2;
      dummy.updateMatrix();
      sandMesh.setMatrixAt(sandN++, dummy.matrix);
    }
    sandMesh.count = sandN;
    this.scene.add(sandMesh);
  }

  /** Mark road ribbons always-visible and bake bounds so they never pop in. */
  private finalizePathMesh(mesh: THREE.Mesh | THREE.InstancedMesh) {
    mesh.frustumCulled = false;
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeBoundingBox();
    // Inflate bounds so edge-on camera angles never cull the path
    if (mesh.geometry.boundingSphere) {
      mesh.geometry.boundingSphere.radius *= 1.35;
    }
    this.scene.add(mesh);
  }

  private addRoad(samples: RoadSample[]) {
    if (samples.length < 2) return;
    const half = ROAD_HALF_WIDTH;
    // Base height above grass; samples.elev adds overpass height
    const baseY = 0.08;
    const elevOf = (s: RoadSample) => baseY + (s.elev ?? 0);
    const left: THREE.Vector3[] = [];
    const right: THREE.Vector3[] = [];

    for (const s of samples) {
      const nx = Math.cos(s.angle + Math.PI / 2);
      const ny = Math.sin(s.angle + Math.PI / 2);
      const ey = elevOf(s);
      left.push(new THREE.Vector3(s.x - nx * half, ey, s.y - ny * half));
      right.push(new THREE.Vector3(s.x + nx * half, ey, s.y + ny * half));
    }
    // Close the loop for continuous asphalt
    left.push(left[0].clone());
    right.push(right[0].clone());

    const road = new THREE.Mesh(ribbonGeometry(left, right), this.materials.asphalt);
    road.receiveShadow = true;
    this.finalizePathMesh(road);

    // Underside slab on elevated ramps so you don't see through the thin asphalt ribbon
    // (screenshot showed houses/carts through the raised path)
    const underL: THREE.Vector3[] = [];
    const underR: THREE.Vector3[] = [];
    let anyElev = false;
    for (const s of samples) {
      const e = s.elev ?? 0;
      if (e > 0.35) anyElev = true;
      const nx = Math.cos(s.angle + Math.PI / 2);
      const ny = Math.sin(s.angle + Math.PI / 2);
      const uy = elevOf(s) - Math.min(0.55, 0.2 + e * 0.06);
      underL.push(new THREE.Vector3(s.x - nx * (half + 0.15), uy, s.y - ny * (half + 0.15)));
      underR.push(new THREE.Vector3(s.x + nx * (half + 0.15), uy, s.y + ny * (half + 0.15)));
    }
    if (anyElev) {
      underL.push(underL[0].clone());
      underR.push(underR[0].clone());
      const underMat = mat("#4a4e56", 0.85, 0.12);
      underMat.fog = false;
      const under = new THREE.Mesh(ribbonGeometry(underL, underR), underMat);
      under.receiveShadow = true;
      this.finalizePathMesh(under);
    }

    // Darker center lane band — same split as edge lines so it doesn't chord the circle
    const laneHalf = half * 0.4;
    const laneY = (s: RoadSample) => elevOf(s) + 0.005;
    for (const seg of markingSegments(samples, ROAD_HALF_WIDTH + 1.8)) {
      this.finalizePathMesh(
        new THREE.Mesh(
          ribbonGeometry(offsetLine(seg, -laneHalf, laneY), offsetLine(seg, laneHalf, laneY)),
          this.materials.asphaltDark,
        ),
      );
    }

    // Yellow dashed double-center line — omitted on roundabouts (no chord through the circle)
    const dummy = new THREE.Object3D();
    const yellowDash = new THREE.BoxGeometry(2.6, 0.06, 0.2);
    const nDashes = Math.ceil(samples.length / 3);
    const yelA = new THREE.InstancedMesh(yellowDash, this.materials.center, nDashes);
    const yelB = new THREE.InstancedMesh(yellowDash, this.materials.center, nDashes);
    let di = 0;
    for (let i = 0; i < samples.length; i += 3) {
      if (di >= nDashes) break;
      // dashed: skip every other
      if ((i / 3) % 2 >= 1) continue;
      const s = samples[i];
      if (onRoundabout(s.x, s.y, ROAD_HALF_WIDTH + 1.5)) continue;
      const nx = Math.cos(s.angle + Math.PI / 2);
      const ny = Math.sin(s.angle + Math.PI / 2);
      const gap = 0.22;
      const my = elevOf(s) + 0.04;
      dummy.position.set(s.x - nx * gap, my, s.y - ny * gap);
      dummy.rotation.y = -s.angle;
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      yelA.setMatrixAt(di, dummy.matrix);
      dummy.position.set(s.x + nx * gap, my, s.y + ny * gap);
      dummy.updateMatrix();
      yelB.setMatrixAt(di, dummy.matrix);
      di++;
    }
    yelA.count = di;
    yelB.count = di;
    yelA.instanceMatrix.needsUpdate = true;
    yelB.instanceMatrix.needsUpdate = true;
    yelA.frustumCulled = false;
    yelB.frustumCulled = false;
    this.scene.add(yelA);
    this.scene.add(yelB);

    // White edge lines + green curb stop at the circle, then resume after.
    // Continuous path ribbons would cut a chord across the circulating road.
    const edgeInset = 0.55;
    const markAt = (s: RoadSample) => elevOf(s) + 0.04;
    const curbY = (s: RoadSample) => elevOf(s) - 0.02;
    const curbOuter = half + CURB_WIDTH;
    const markSegs = markingSegments(samples, ROAD_HALF_WIDTH + 1.8);
    for (const seg of markSegs) {
      this.finalizePathMesh(
        new THREE.Mesh(
          ribbonGeometry(offsetLine(seg, -half, markAt), offsetLine(seg, -(half - edgeInset), markAt)),
          this.materials.line,
        ),
      );
      this.finalizePathMesh(
        new THREE.Mesh(
          ribbonGeometry(offsetLine(seg, half - edgeInset, markAt), offsetLine(seg, half, markAt)),
          this.materials.line,
        ),
      );
      this.finalizePathMesh(
        new THREE.Mesh(
          ribbonGeometry(offsetLine(seg, -curbOuter, curbY), offsetLine(seg, -half, curbY)),
          this.materials.curb,
        ),
      );
      this.finalizePathMesh(
        new THREE.Mesh(
          ribbonGeometry(offsetLine(seg, half, curbY), offsetLine(seg, curbOuter, curbY)),
          this.materials.curb,
        ),
      );
    }

    // Direction arrows along the path
    this.addRoadDirectionArrows(samples);

    this.addStartFinishGate(samples);
  }

  /** White chevron arrows painted on asphalt so race direction is obvious */
  private addRoadDirectionArrows(samples: RoadSample[]) {
    const dummy = new THREE.Object3D();
    const armGeo = new THREE.BoxGeometry(1.6, 0.05, 0.28);
    const white = this.materials.line;
    const step = Math.max(8, Math.floor(samples.length / 28));
    const count = Math.floor(samples.length / step);
    const leftArm = new THREE.InstancedMesh(armGeo, white, count);
    const rightArm = new THREE.InstancedMesh(armGeo, white, count);
    let i = 0;
    for (let si = step; si < samples.length && i < count; si += step) {
      if (si < 12 || si > samples.length - 8) continue;
      const s = samples[si];
      if (onRoundabout(s.x, s.y, ROAD_HALF_WIDTH + 1.5)) continue;
      const fx = Math.cos(s.angle);
      const fy = Math.sin(s.angle);
      const y = 0.12 + (s.elev ?? 0);
      const cx = s.x;
      const cz = s.y;
      dummy.position.set(cx - fy * 0.35, y, cz + fx * 0.35);
      dummy.rotation.set(0, -s.angle + 0.55, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      leftArm.setMatrixAt(i, dummy.matrix);
      dummy.position.set(cx + fy * 0.35, y, cz - fx * 0.35);
      dummy.rotation.set(0, -s.angle - 0.55, 0);
      dummy.updateMatrix();
      rightArm.setMatrixAt(i, dummy.matrix);
      i++;
    }
    leftArm.count = i;
    rightArm.count = i;
    leftArm.instanceMatrix.needsUpdate = true;
    rightArm.instanceMatrix.needsUpdate = true;
    leftArm.frustumCulled = false;
    rightArm.frustumCulled = false;
    this.scene.add(leftArm);
    this.scene.add(rightArm);
  }

  /**
   * Landscaped islands in the middle of each traffic circle —
   * grass ring, curb, small palms / fountain so it reads as a Villages roundabout.
   */
  private addRoundabouts() {
    if (!TRACK_ROUNDABOUTS.length) return;
    for (const r of TRACK_ROUNDABOUTS) {
      this.addRoundaboutIsland(r);
    }
  }

  private addRoundaboutIsland(r: RoundaboutSite) {
    const g = new THREE.Group();
    const elev = 0.08;
    const islandR = r.islandRadius;
    const half = ROAD_HALF_WIDTH;

    // Solid circulating pavement so grass never shows through the street
    const roadPad = new THREE.Mesh(
      new THREE.RingGeometry(islandR + 0.2, r.radius + half + 0.55, 80),
      this.materials.asphalt,
    );
    roadPad.rotation.x = -Math.PI / 2;
    roadPad.position.set(r.x, 0.09, r.y);
    roadPad.receiveShadow = true;
    g.add(roadPad);

    // Outer curb ring
    const curb = new THREE.Mesh(
      new THREE.TorusGeometry(islandR + 0.35, 0.22, 8, 40),
      mat("#d8d4cc", 0.75, 0.12)
    );
    curb.rotation.x = -Math.PI / 2;
    curb.position.set(r.x, elev + 0.12, r.y);
    curb.receiveShadow = true;
    g.add(curb);

    // Grass / landscaping disc
    const grass = new THREE.Mesh(
      new THREE.CircleGeometry(islandR, 40),
      this.materials.grass
    );
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(r.x, elev + 0.05, r.y);
    grass.receiveShadow = true;
    g.add(grass);

    // Inner mulch ring + mini fountain / planter
    const mulch = new THREE.Mesh(
      new THREE.CircleGeometry(islandR * 0.42, 24),
      mat("#8a6a48", 0.9, 0.05)
    );
    mulch.rotation.x = -Math.PI / 2;
    mulch.position.set(r.x, elev + 0.07, r.y);
    g.add(mulch);

    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(islandR * 0.22, islandR * 0.26, 0.45, 16),
      mat("#c8d0d8", 0.4, 0.55)
    );
    basin.position.set(r.x, elev + 0.3, r.y);
    basin.castShadow = true;
    g.add(basin);

    const water = new THREE.Mesh(
      new THREE.CircleGeometry(islandR * 0.16, 16),
      this.materials.water
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(r.x, elev + 0.54, r.y);
    g.add(water);

    // 3–4 small palms around the island
    const palms = 3 + Math.floor((r.x * 0.1 + r.y) % 2);
    for (let i = 0; i < palms; i++) {
      const ang = (i / palms) * Math.PI * 2 + 0.4;
      const pr = islandR * 0.68;
      const px = r.x + Math.cos(ang) * pr;
      const pz = r.y + Math.sin(ang) * pr;
      const trunk = new THREE.Mesh(
        this.palmTrunkGeo,
        this.materials.palmBark
      );
      trunk.position.set(px, elev + 1.1, pz);
      trunk.scale.set(0.7, 2.2, 0.7);
      trunk.castShadow = true;
      g.add(trunk);
      const leaf = new THREE.Mesh(this.palmLeafGeo, this.materials.palmFrond);
      leaf.position.set(px, elev + 2.5, pz);
      leaf.scale.setScalar(0.55);
      leaf.castShadow = true;
      g.add(leaf);
    }

    // Yield / roundabout hint ring on asphalt just outside island
    const yieldRing = new THREE.Mesh(
      new THREE.RingGeometry(islandR + 1.2, islandR + 1.55, 48),
      mat("#f5d040", 0.55, 0.2)
    );
    yieldRing.rotation.x = -Math.PI / 2;
    yieldRing.position.set(r.x, elev + 0.04, r.y);
    g.add(yieldRing);

    // White edge lines follow the circle — never cut a chord across the circulating road
    const outerMid = r.radius + half - 0.28;
    const innerMid = Math.max(islandR + 0.65, r.radius - half + 0.28);
    const lineY = elev + 0.11;
    const outerLine = new THREE.Mesh(
      new THREE.RingGeometry(outerMid - 0.28, outerMid + 0.28, 72),
      this.materials.line,
    );
    outerLine.rotation.x = -Math.PI / 2;
    outerLine.position.set(r.x, lineY, r.y);
    g.add(outerLine);
    const innerLine = new THREE.Mesh(
      new THREE.RingGeometry(innerMid - 0.28, innerMid + 0.28, 72),
      this.materials.line,
    );
    innerLine.rotation.x = -Math.PI / 2;
    innerLine.position.set(r.x, lineY, r.y);
    g.add(innerLine);

    // Green curb around the outer perimeter of the circulating road
    const curbMid = r.radius + half + CURB_WIDTH * 0.5;
    const outerCurb = new THREE.Mesh(
      new THREE.RingGeometry(curbMid - CURB_WIDTH * 0.5, curbMid + CURB_WIDTH * 0.5, 72),
      this.materials.curb,
    );
    outerCurb.rotation.x = -Math.PI / 2;
    outerCurb.position.set(r.x, elev + 0.05, r.y);
    outerCurb.receiveShadow = true;
    g.add(outerCurb);

    // Sidewalk around the outside only — never a beige chord through the lawn
    const swInner = r.radius + half + CURB_WIDTH;
    const swOuter = swInner + SIDEWALK_WIDTH;
    const walk = new THREE.Mesh(
      new THREE.RingGeometry(swInner, swOuter, 72),
      this.materials.sidewalk,
    );
    walk.rotation.x = -Math.PI / 2;
    walk.position.set(r.x, elev + 0.07, r.y);
    walk.receiveShadow = true;
    g.add(walk);

    this.scene.add(g);
  }

  /**
   * Villages gated-community entries: stucco pillars + barrier arm that raises.
   */
  private addCommunityGates() {
    if (!TRACK_GATES.length) return;
    for (const site of TRACK_GATES) {
      this.addCommunityGate(site);
    }
  }

  private addCommunityGate(site: GateSite) {
    const g = new THREE.Group();
    const half = ROAD_HALF_WIDTH;
    const nx = Math.cos(site.angle + Math.PI / 2);
    const ny = Math.sin(site.angle + Math.PI / 2);
    const fx = Math.cos(site.angle);
    const fy = Math.sin(site.angle);
    const elev = 0;

    const stucco = mat("#efe6d6", 0.82, 0.08);
    const cap = mat("#d4c4a8", 0.7, 0.15);
    const metal = mat("#4a5560", 0.4, 0.65);
    const armMat = mat("#c44738", 0.45, 0.35);
    const stripe = mat("#f5f5f0", 0.5, 0.2);

    // Twin pillars on each shoulder — square to the cart path so plaques sit on
    // the true front and back faces (not a world-axis corner).
    const postHalf = 0.62;
    for (const side of [-1, 1] as const) {
      const post = new THREE.Group();
      post.position.set(
        site.x + nx * (half + 1.35) * side,
        elev,
        site.y + ny * (half + 1.35) * side,
      );
      post.rotation.y = -site.angle;
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(postHalf * 2, 2.8, postHalf * 2),
        stucco
      );
      pillar.position.set(0, 1.4, 0);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      post.add(pillar);
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.28, 1.48), cap);
      top.position.set(0, 2.9, 0);
      post.add(top);
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 10),
        mat("#fff6d0", 0.25, 0.8)
      );
      lamp.position.set(0, 3.25, 0);
      post.add(lamp);

      // Local +X is along the path. Planes face +Z, so ±90° aims them up/down the road.
      for (const along of [-1, 1] as const) {
        const plaque = makeGatePlaqueMesh(site.label);
        plaque.position.set(along * (postHalf + 0.04), 2.02, 0);
        plaque.rotation.y = along > 0 ? Math.PI / 2 : -Math.PI / 2;
        post.add(plaque);
      }
      g.add(post);
    }

    // Low brick wall stubs flanking the pillars (classic neighborhood look)
    for (const side of [-1, 1] as const) {
      const wx = site.x + nx * (half + 2.8) * side - fx * 0.4;
      const wz = site.y + ny * (half + 2.8) * side - fy * 0.4;
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 1.1, 2.2),
        mat("#c4785a", 0.85, 0.08)
      );
      wall.position.set(wx, elev + 0.55, wz);
      wall.rotation.y = -site.angle;
      wall.castShadow = true;
      g.add(wall);
    }

    // Pivot post on the right shoulder
    const pivotX = site.x + nx * (half + 0.55);
    const pivotZ = site.y + ny * (half + 0.55);
    const pivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 1.15, 10),
      metal
    );
    pivot.position.set(pivotX, elev + 0.7, pivotZ);
    g.add(pivot);

    // Barrier arm: local −X spans across the road (−normal); raises via local Z
    const armGroup = new THREE.Group();
    armGroup.position.set(pivotX, elev + 1.05, pivotZ);
    // Map local −X onto −normal so the boom crosses the cart path
    armGroup.rotation.y = -(site.angle + Math.PI / 2);
    const armLen = half * 2 + 1.6;
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(armLen, 0.18, 0.28),
      armMat
    );
    arm.position.set(-armLen / 2, 0, 0);
    arm.castShadow = true;
    armGroup.add(arm);
    // White reflective stripes
    for (let i = 0; i < 5; i++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(armLen * 0.08, 0.2, 0.3),
        stripe
      );
      band.position.set(-armLen * (0.15 + i * 0.16), 0, 0);
      armGroup.add(band);
    }
    // Tip light
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      mat("#ff4444", 0.3, 0.7)
    );
    tip.position.set(-armLen + 0.1, 0, 0);
    armGroup.add(tip);
    g.add(armGroup);
    this.gateArms.push({ arm: armGroup, site });

    // Ground stripe under the gate
    const stripeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(half * 2 + 1, 0.05, 0.9),
      mat("#3a3e48", 0.8, 0.1)
    );
    stripeMesh.position.set(site.x, elev + 0.1, site.y);
    stripeMesh.rotation.y = -site.angle;
    g.add(stripeMesh);

    this.scene.add(g);
  }

  /** Animate community gate arms from each gate's waved-open amount. */
  updateGates() {
    for (const { arm, site } of this.gateArms) {
      const open = site.open ?? 0;
      // Arm extends along local −X. Positive Z would lower the tip; negative raises it.
      // 0 = horizontal (blocking), −90° = vertical up (clear to drive under).
      arm.rotation.z = -open * (Math.PI / 2);
    }
  }

  /** Tall checkered-flag start/finish arch + ground grid + START sign */
  private addStartFinishGate(samples: RoadSample[]) {
    if (!samples.length) return;
    const half = ROAD_HALF_WIDTH;
    // Place gate at sample 0; carts spawn a bit past it
    const s0 = samples[0];
    const nx = Math.cos(s0.angle + Math.PI / 2);
    const ny = Math.sin(s0.angle + Math.PI / 2);
    const fx = Math.cos(s0.angle);
    const fy = Math.sin(s0.angle);

    const gate = new THREE.Group();
    const postH = 8.2;
    const postMat = mat("#e8b84a", 0.35, 0.55);
    const postDark = mat("#1c2430", 0.5, 0.35);
    const postGeo = new THREE.BoxGeometry(0.7, postH, 0.7);

    for (const side of [-1, 1] as const) {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(
        s0.x + nx * (half + 1.1) * side,
        postH / 2,
        s0.y + ny * (half + 1.1) * side
      );
      post.castShadow = true;
      gate.add(post);
      // Base footing
      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.35, 1.4),
        postDark
      );
      foot.position.set(
        s0.x + nx * (half + 1.1) * side,
        0.18,
        s0.y + ny * (half + 1.1) * side
      );
      gate.add(foot);
    }

    // Overhead crossbar
    const barW = half * 2 + 3.2;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(barW, 0.55, 0.55), postMat);
    bar.position.set(s0.x, postH - 0.4, s0.y);
    bar.rotation.y = -s0.angle;
    bar.castShadow = true;
    gate.add(bar);

    // Checkered flag banner hanging under the bar
    const cols = 14;
    const rows = 3;
    const tileW = barW / cols;
    const tileH = 1.05;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const black = (row + col) % 2 === 0;
        const tile = new THREE.Mesh(
          new THREE.BoxGeometry(tileW * 0.98, tileH * 0.95, 0.12),
          mat(black ? "#111318" : "#f6f6f2", 0.55, 0.15)
        );
        const along = (col - (cols - 1) / 2) * tileW;
        tile.position.set(
          s0.x + nx * along,
          postH - 1.15 - row * tileH,
          s0.y + ny * along
        );
        tile.rotation.y = -s0.angle;
        gate.add(tile);
      }
    }

    // "START" plate above the checkered banner
    const startPlate = new THREE.Mesh(
      new THREE.BoxGeometry(barW * 0.55, 1.15, 0.2),
      mat("#e85d4c", 0.45, 0.35)
    );
    startPlate.position.set(s0.x - fx * 0.15, postH + 0.55, s0.y - fy * 0.15);
    startPlate.rotation.y = -s0.angle;
    gate.add(startPlate);
    const startSprite = makeTextSprite("START / FINISH", "#ffffff", "#e85d4c");
    startSprite.position.set(s0.x, postH + 0.55, s0.y);
    startSprite.scale.set(12, 2.4, 1);
    gate.add(startSprite);

    // Wide checkered ground stripe across the road
    const stripeDepth = 2.4;
    const stripeCols = 12;
    const cellW = (half * 2) / stripeCols;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < stripeCols; col++) {
        const black = (row + col) % 2 === 0;
        const cell = new THREE.Mesh(
          new THREE.BoxGeometry(cellW * 0.96, 0.06, stripeDepth / 3 - 0.05),
          mat(black ? "#1a1e28" : "#f2f2ee", 0.7, 0.1)
        );
        const along = (col - (stripeCols - 1) / 2) * cellW;
        const ahead = (row - 1) * (stripeDepth / 3);
        cell.position.set(
          s0.x + nx * along + fx * ahead,
          0.13,
          s0.y + ny * along + fy * ahead
        );
        cell.rotation.y = -s0.angle;
        gate.add(cell);
      }
    }

    // Side flag poles with small checkered flags (extra start energy)
    for (const side of [-1, 1] as const) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 6.5, 8),
        mat("#c0c4cc", 0.45, 0.5)
      );
      const px = s0.x + nx * (half + 3.2) * side - fx * 2;
      const pz = s0.y + ny * (half + 3.2) * side - fy * 2;
      pole.position.set(px, 3.25, pz);
      gate.add(pole);
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          const black = (r + c) % 2 === 0;
          const flag = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.45, 0.06),
            mat(black ? "#111" : "#fff", 0.6, 0.1)
          );
          flag.position.set(
            px + fx * (0.4 + c * 0.55),
            5.8 - r * 0.45,
            pz + fy * (0.4 + c * 0.55)
          );
          gate.add(flag);
        }
      }
    }

    this.scene.add(gate);
  }

  private addSidewalks(samples: RoadSample[]) {
    const inner = ROAD_HALF_WIDTH + CURB_WIDTH;
    const outer = inner + SIDEWALK_WIDTH;
    const yAt = (s: RoadSample) => 0.06 + (s.elev ?? 0);
    // Sidewalks stick out past the asphalt — need a wider gap than the lane markings
    const extra = ROAD_HALF_WIDTH + CURB_WIDTH + SIDEWALK_WIDTH + 2.2;
    for (const seg of markingSegments(samples, extra)) {
      this.finalizePathMesh(
        new THREE.Mesh(
          ribbonGeometry(offsetLine(seg, -outer, yAt), offsetLine(seg, -inner, yAt)),
          this.materials.sidewalk,
        ),
      );
      this.finalizePathMesh(
        new THREE.Mesh(
          ribbonGeometry(offsetLine(seg, inner, yAt), offsetLine(seg, outer, yAt)),
          this.materials.sidewalk,
        ),
      );
    }
  }

  /**
   * Villages connectivity overpasses — matched to real multi-modal bridges:
   * cream masonry towers, dark red lattice truss, "The Villages" script,
   * multi-lane highway underneath (see reference photo).
   * Local frame: +Z = cart-path direction, +X = across (highway runs under along X).
   */
  private addBridges(_samples: RoadSample[]) {
    if (!TRACK_BRIDGES.length) return;
    void _samples;
    // Reference palette: cream towers, rust-red truss, warm night lighting
    const towerCream = "#e8dcc4";
    const towerTrim = "#d4c4a0";
    const trussRed = "#6b2e28";
    const trussDark = "#4a201c";

    for (const br of TRACK_BRIDGES) {
      const g = new THREE.Group();
      g.position.set(br.x, 0, br.y);
      g.rotation.y = -br.angle;

      // Cart path on a modest hill. ONE overhead assembly (girders + truss) sits
      // entirely ABOVE the road — you drive under the whole bridge, with clear air.
      const peak = br.peakElev || BRIDGE_PEAK_ELEV;
      const roadSurfaceY = peak + 0.08;
      const headroom = 8.5; // free space: road surface → bottom of girder/truss assembly
      const girderH = 1.1;
      // Bottom of the combined overpass (girders are the bottom chord of the truss)
      const overpassBottomY = roadSurfaceY + headroom;
      const pathHalf = ROAD_HALF_WIDTH;
      const steel = mat("#5c4838", 0.55, 0.35);
      const railMat = mat("#6b2e28", 0.5, 0.28);
      const rust = mat(trussRed, 0.48, 0.32);
      const rustDark = mat(trussDark, 0.52, 0.28);
      const deckMat = mat("#d2cdc2", 0.88, 0.05);

      // Local +X = along the cart path (drive UNDER). Local +Z = left/right on screen.
      const halfLen = 110;
      const deckThick = 14;
      const halfThick = deckThick / 2;
      const deckY = overpassBottomY + girderH + 0.2;
      const groundY = 1.15;
      const gateZ = pathHalf + 5.4;
      const archH = 7.2;
      const chordY = deckY + 0.55;
      const centerHalf = gateZ + 7;

      addOverpassHighway(g, {
        halfLen,
        centerHalf,
        deckY,
        groundY,
        thickX: deckThick,
        girderH,
        steel,
        railMat,
        deckMat,
        asphalt: this.materials.asphalt,
        sidewalk: this.materials.sidewalk,
        towerCream,
      });

      const towerW = 5.4;
      const towerH = deckY + archH + 2.4;
      for (const side of [-1, 1] as const) {
        const tz = side * gateZ;
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(towerW * 0.82, towerH, towerW * 0.82),
          mat(towerCream, 0.9, 0.08),
        );
        body.position.set(0, towerH / 2, tz);
        body.castShadow = true;
        g.add(body);
        const plinth = new THREE.Mesh(
          new THREE.BoxGeometry(towerW, 1.2, towerW),
          mat(towerTrim, 0.88, 0.1),
        );
        plinth.position.set(0, 0.6, tz);
        g.add(plinth);
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(towerW * 0.95, 0.7, towerW * 0.95),
          mat(towerCream, 0.82, 0.12),
        );
        cap.position.set(0, towerH + 0.3, tz);
        g.add(cap);
        const urn = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.75, 1.1, 10),
          mat(towerTrim, 0.7, 0.15),
        );
        urn.position.set(0, towerH + 1.15, tz);
        g.add(urn);
      }

      for (const face of [-1, 1] as const) {
        addArchedTrussAlongZ(
          g,
          -gateZ + towerW * 0.35,
          gateZ - towerW * 0.35,
          face * (halfThick + 0.05),
          chordY,
          archH,
          rust,
          rustDark,
        );
      }

      for (const end of [-1, 1] as const) {
        const script = makeVillagesScriptSign();
        script.position.set(end * (halfThick + 0.35), chordY + archH * 0.38, 0);
        script.rotation.y = end < 0 ? -Math.PI / 2 : Math.PI / 2;
        g.add(script);
      }

      // Light the passage under the overpass (between road and girders)
      const underLamp = new THREE.PointLight("#fff0d0", 0.9, 40, 2);
      underLamp.position.set(0, roadSurfaceY + headroom * 0.45, 0);
      g.add(underLamp);

      this.scene.add(g);
    }
  }

  private addDecor(decor: DecorBlob[]) {
    const dummy = new THREE.Object3D();
    const houses: { x: number; z: number; yaw: number }[] = [];
    const palms: { x: number; z: number }[] = [];
    const shrubs: { x: number; z: number; s: number }[] = [];
    const hedges: { x: number; z: number; yaw: number; len: number }[] = [];
    const drives: { x: number; z: number; yaw: number }[] = [];

    for (const d of decor) {
      if (d.kind === "pond") {
        if (!clearOfRoad(d.x, d.y, d.r + ROAD_CLEAR_PROP)) continue;
        const water = new THREE.Mesh(
          new THREE.CircleGeometry(d.r, 28),
          this.materials.water
        );
        water.rotation.x = -Math.PI / 2;
        water.position.set(d.x, 0.06, d.y);
        this.scene.add(water);
        const rim = new THREE.Mesh(
          new THREE.RingGeometry(d.r * 0.9, d.r * 1.12, 28),
          this.materials.sand
        );
        rim.rotation.x = -Math.PI / 2;
        rim.position.set(d.x, 0.07, d.y);
        this.scene.add(rim);
        for (let i = 0; i < 5; i++) {
          const pad = new THREE.Mesh(
            new THREE.CircleGeometry(0.9 + (i % 2) * 0.4, 8),
            this.materials.palmFrond
          );
          pad.rotation.x = -Math.PI / 2;
          pad.position.set(
            d.x + Math.cos(i * 1.7) * d.r * 0.4,
            0.09,
            d.y + Math.sin(i * 1.7) * d.r * 0.4
          );
          this.scene.add(pad);
        }
      } else if (d.kind === "golf") {
        if (!clearOfRoad(d.x, d.y, d.r * 0.5 + ROAD_CLEAR_PROP)) continue;
        const fairway = new THREE.Mesh(
          new THREE.CircleGeometry(d.r, 24),
          this.materials.fairway
        );
        fairway.rotation.x = -Math.PI / 2;
        fairway.position.set(d.x, 0.05, d.y);
        fairway.scale.set(1, 0.6, 1);
        this.scene.add(fairway);
        // bunkers
        for (let b = 0; b < 3; b++) {
          const bunker = new THREE.Mesh(
            new THREE.CircleGeometry(d.r * 0.12, 12),
            this.materials.sand
          );
          bunker.rotation.x = -Math.PI / 2;
          bunker.position.set(
            d.x + Math.cos(b * 2.1) * d.r * 0.45,
            0.06,
            d.y + Math.sin(b * 2.1) * d.r * 0.35
          );
          this.scene.add(bunker);
        }
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 4, 6),
          mat("#ffffff", 0.4, 0.5)
        );
        pole.position.set(d.x - d.r * 0.25, 2, d.y);
        this.scene.add(pole);
        const flag = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 0.8, 0.08),
          mat(theme.sunset, 0.5, 0.4)
        );
        flag.position.set(d.x - d.r * 0.25 + 0.7, 3.5, d.y);
        this.scene.add(flag);
      } else if (d.kind === "parking") {
        if (!clearOfRoad(d.x, d.y, ROAD_CLEAR_PROP + 4)) continue;
        const lot = new THREE.Mesh(
          new THREE.BoxGeometry(d.r * 2.2, 0.08, d.r * 1.4),
          this.materials.parking
        );
        lot.position.set(d.x, 0.05, d.y);
        this.scene.add(lot);
        // stall lines
        for (let i = -3; i <= 3; i++) {
          const line = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.04, d.r * 1.1),
            this.materials.line
          );
          line.position.set(d.x + i * (d.r * 0.28), 0.1, d.y);
          this.scene.add(line);
        }
      } else if (d.kind === "plaza") {
        if (!clearOfRoad(d.x, d.y, ROAD_HALF_WIDTH + 1)) continue;
        const plaza = new THREE.Mesh(
          new THREE.CylinderGeometry(d.r, d.r, 0.12, 28),
          this.materials.plaza
        );
        plaza.position.set(d.x, 0.06, d.y);
        this.scene.add(plaza);
      } else if (d.kind === "houses") {
        if (!clearOfRoad(d.x, d.y, ROAD_CLEAR_BUILDING)) continue;
        // Face house toward nearest road for Villages curb appeal
        let yaw = 0;
        let best = Infinity;
        for (let i = 0; i < TRACK_WAYPOINTS.length; i += 2) {
          const p = TRACK_WAYPOINTS[i];
          const dd = (p.x - d.x) ** 2 + (p.y - d.y) ** 2;
          if (dd < best) {
            best = dd;
            yaw = Math.atan2(p.y - d.y, p.x - d.x);
          }
        }
        houses.push({ x: d.x, z: d.y, yaw });
        // Driveway toward road
        const dx = d.x + Math.cos(yaw) * 6;
        const dz = d.y + Math.sin(yaw) * 6;
        if (clearOfRoad(dx, dz, ROAD_CLEAR_PROP)) {
          drives.push({ x: dx, z: dz, yaw });
        }
        // Hedge along sides
        hedges.push({
          x: d.x + Math.cos(yaw + Math.PI / 2) * 5,
          z: d.y + Math.sin(yaw + Math.PI / 2) * 5,
          yaw: yaw + Math.PI / 2,
          len: 8,
        });
        // Front shrubs
        for (let s = -1; s <= 1; s++) {
          shrubs.push({
            x: d.x + Math.cos(yaw) * 4.5 + Math.cos(yaw + Math.PI / 2) * s * 2.2,
            z: d.y + Math.sin(yaw) * 4.5 + Math.sin(yaw + Math.PI / 2) * s * 2.2,
            s: 0.7 + Math.abs(s) * 0.2,
          });
        }
      } else if (d.kind === "palm-grove") {
        for (let i = 0; i < 4; i++) {
          const px = d.x + Math.cos(i * 1.4) * d.r * 0.45;
          const pz = d.y + Math.sin(i * 1.4) * d.r * 0.4;
          if (clearOfRoad(px, pz, ROAD_CLEAR_TREE)) palms.push({ x: px, z: pz });
        }
      }
    }

    // Detailed Florida villas: body, pitched roof slabs, trim, porch, chimney
    const maxH = Math.min(houses.length, 1400);
    const stuccoTones = [
      this.materials.stucco,
      mat("#f5efe3", 0.88, 0.18),
      mat("#efe4d2", 0.88, 0.18),
      mat("#e8ddd0", 0.88, 0.18),
      mat("#f0e8da", 0.88, 0.18),
    ];
    const bodyMeshes = stuccoTones.map(
      (m) => new THREE.InstancedMesh(this.houseGeo, m, Math.ceil(maxH / stuccoTones.length) + 8)
    );
    const bodyCounts = bodyMeshes.map(() => 0);
    const roofs = new THREE.InstancedMesh(this.houseGeo, this.materials.roof, maxH);
    const roofAlt = new THREE.InstancedMesh(
      this.houseGeo,
      this.materials.roofBlue,
      Math.floor(maxH / 2)
    );
    const roofGreen = new THREE.InstancedMesh(
      this.houseGeo,
      this.materials.roofGreen,
      Math.floor(maxH / 3)
    );
    // Second roof plane for pitched look
    const roofPitch = new THREE.InstancedMesh(this.houseGeo, this.materials.roof, maxH);
    const garages = new THREE.InstancedMesh(this.houseGeo, this.materials.stucco, maxH);
    const windows = new THREE.InstancedMesh(this.houseGeo, this.materials.window, maxH * 4);
    const frames = new THREE.InstancedMesh(this.houseGeo, mat("#ffffff", 0.7, 0.2), maxH * 4);
    const doors = new THREE.InstancedMesh(this.houseGeo, this.materials.door, maxH);
    const porches = new THREE.InstancedMesh(this.houseGeo, mat("#e8e0d0", 0.85, 0.2), maxH);
    const chimneys = new THREE.InstancedMesh(this.houseGeo, mat("#b07060", 0.85, 0.2), maxH);
    let bi = 0;
    let ri = 0;
    let rai = 0;
    let rgi = 0;
    let rpi = 0;
    let gi = 0;
    let wi = 0;
    let fi = 0;
    let di = 0;
    let pi = 0;
    let ci = 0;

    for (let hi = 0; hi < houses.length && bi < maxH; hi++) {
      const h = houses[hi];
      if (!clearOfRoad(h.x, h.z, ROAD_CLEAR_BUILDING)) continue;

      const bw = 5.8 + (hi % 5) * 0.45;
      const bd = 4.4 + (hi % 4) * 0.35;
      const bh = 2.9 + (hi % 3) * 0.3;
      const yaw = h.yaw + Math.PI;

      const tone = hi % bodyMeshes.length;
      if (bodyCounts[tone] < bodyMeshes[tone].count) {
        dummy.position.set(h.x, bh / 2, h.z);
        dummy.scale.set(bw, bh, bd);
        dummy.rotation.set(0, -yaw, 0);
        dummy.updateMatrix();
        bodyMeshes[tone].setMatrixAt(bodyCounts[tone]++, dummy.matrix);
      }

      // Main roof mass + slightly offset second slab = pitched cartoon roof
      dummy.position.set(h.x, bh + 0.95, h.z);
      dummy.scale.set(bw * 1.18, 1.35, bd * 1.18);
      dummy.rotation.set(0, -yaw, 0);
      dummy.updateMatrix();
      const roofPick = hi % 5;
      if (roofPick === 0 && rai < roofAlt.count) roofAlt.setMatrixAt(rai++, dummy.matrix);
      else if (roofPick === 1 && rgi < roofGreen.count)
        roofGreen.setMatrixAt(rgi++, dummy.matrix);
      else if (ri < roofs.count) roofs.setMatrixAt(ri++, dummy.matrix);

      if (rpi < roofPitch.count) {
        dummy.position.set(
          h.x + Math.cos(yaw) * 0.15,
          bh + 1.55,
          h.z + Math.sin(yaw) * 0.15
        );
        dummy.scale.set(bw * 0.95, 0.55, bd * 0.95);
        dummy.updateMatrix();
        roofPitch.setMatrixAt(rpi++, dummy.matrix);
      }

      // Porch slab
      if (pi < porches.count) {
        dummy.position.set(
          h.x + Math.cos(yaw) * (bd * 0.55 + 0.6),
          0.12,
          h.z + Math.sin(yaw) * (bd * 0.55 + 0.6)
        );
        dummy.scale.set(bw * 0.7, 0.2, 1.6);
        dummy.rotation.set(0, -yaw, 0);
        dummy.updateMatrix();
        porches.setMatrixAt(pi++, dummy.matrix);
      }

      // Chimney
      if (ci < chimneys.count && hi % 3 !== 0) {
        dummy.position.set(
          h.x + Math.cos(yaw + Math.PI / 2) * (bw * 0.28),
          bh + 2.0,
          h.z + Math.sin(yaw + Math.PI / 2) * (bw * 0.28)
        );
        dummy.scale.set(0.7, 1.6, 0.7);
        dummy.rotation.set(0, -yaw, 0);
        dummy.updateMatrix();
        chimneys.setMatrixAt(ci++, dummy.matrix);
      }

      // garage wing
      const gx = h.x + Math.cos(yaw + Math.PI / 2) * (bw * 0.58);
      const gz = h.z + Math.sin(yaw + Math.PI / 2) * (bw * 0.58);
      if (clearOfRoad(gx, gz, ROAD_CLEAR_BUILDING) && gi < garages.count) {
        dummy.position.set(gx, 1.25, gz);
        dummy.scale.set(3.4, 2.5, 3.8);
        dummy.rotation.set(0, -yaw, 0);
        dummy.updateMatrix();
        garages.setMatrixAt(gi++, dummy.matrix);
        // garage door panel
        if (di < doors.count) {
          dummy.position.set(
            gx + Math.cos(yaw) * 1.95,
            1.1,
            gz + Math.sin(yaw) * 1.95
          );
          dummy.scale.set(2.4, 2.0, 0.12);
          dummy.updateMatrix();
          doors.setMatrixAt(di++, dummy.matrix);
        }
      }

      // front door
      if (di < doors.count) {
        dummy.position.set(
          h.x + Math.cos(yaw) * (bd * 0.52),
          1.05,
          h.z + Math.sin(yaw) * (bd * 0.52)
        );
        dummy.scale.set(0.95, 2.0, 0.14);
        dummy.rotation.set(0, -yaw, 0);
        dummy.updateMatrix();
        doors.setMatrixAt(di++, dummy.matrix);
      }

      // Windows with white frames (front + sides)
      const winSlots: [number, number, number][] = [
        [0.52, 1.55, -1.55],
        [0.52, 1.55, 1.55],
        [0.52, 2.35, -1.55],
        [0.52, 2.35, 1.55],
        [0.0, 1.7, bd * 0.52], // side
        [0.0, 1.7, -bd * 0.52],
      ];
      for (const [fwd, elev, sideOff] of winSlots) {
        if (wi >= windows.count) break;
        const wx =
          h.x +
          Math.cos(yaw) * (bd * fwd) +
          Math.cos(yaw + Math.PI / 2) * sideOff * (fwd === 0 ? 0 : 1);
        const wz =
          h.z +
          Math.sin(yaw) * (bd * fwd) +
          Math.sin(yaw + Math.PI / 2) * sideOff * (fwd === 0 ? 0 : 1);
        // Fix side window positions
        let px = h.x + Math.cos(yaw) * (bd * (fwd === 0 ? 0 : fwd));
        let pz = h.z + Math.sin(yaw) * (bd * (fwd === 0 ? 0 : fwd));
        if (fwd === 0) {
          px = h.x + Math.cos(yaw + Math.PI / 2) * sideOff;
          pz = h.z + Math.sin(yaw + Math.PI / 2) * sideOff;
        } else {
          px =
            h.x +
            Math.cos(yaw) * (bd * fwd) +
            Math.cos(yaw + Math.PI / 2) * sideOff;
          pz =
            h.z +
            Math.sin(yaw) * (bd * fwd) +
            Math.sin(yaw + Math.PI / 2) * sideOff;
        }
        void wx;
        void wz;
        dummy.position.set(px, elev, pz);
        dummy.scale.set(fwd === 0 ? 0.12 : 1.05, 0.95, fwd === 0 ? 1.05 : 0.12);
        dummy.rotation.set(0, -yaw, 0);
        dummy.updateMatrix();
        windows.setMatrixAt(wi++, dummy.matrix);
        if (fi < frames.count) {
          dummy.position.set(px, elev, pz);
          dummy.scale.set(
            fwd === 0 ? 0.16 : 1.2,
            1.1,
            fwd === 0 ? 1.2 : 0.16
          );
          dummy.updateMatrix();
          frames.setMatrixAt(fi++, dummy.matrix);
        }
      }

      bi++;
    }
    for (const m of bodyMeshes) {
      m.castShadow = true;
      m.receiveShadow = true;
      this.scene.add(m);
    }
    roofs.castShadow = true;
    roofPitch.castShadow = true;
    this.scene.add(roofs);
    this.scene.add(roofAlt);
    this.scene.add(roofGreen);
    this.scene.add(roofPitch);
    this.scene.add(garages);
    this.scene.add(windows);
    this.scene.add(frames);
    this.scene.add(doors);
    this.scene.add(porches);
    this.scene.add(chimneys);

    // Driveways
    const driveMesh = new THREE.InstancedMesh(
      this.houseGeo,
      this.materials.driveway,
      Math.min(drives.length, 800)
    );
    for (let i = 0; i < drives.length && i < driveMesh.count; i++) {
      const d = drives[i];
      dummy.position.set(d.x, 0.04, d.z);
      dummy.scale.set(2.4, 0.08, 7);
      dummy.rotation.set(0, -d.yaw, 0);
      dummy.updateMatrix();
      driveMesh.setMatrixAt(i, dummy.matrix);
    }
    this.scene.add(driveMesh);

    // Hedges
    const hedgeMesh = new THREE.InstancedMesh(
      this.houseGeo,
      this.materials.hedge,
      Math.min(hedges.length, 900)
    );
    for (let i = 0; i < hedges.length && i < hedgeMesh.count; i++) {
      const h = hedges[i];
      if (!clearOfRoad(h.x, h.z, ROAD_CLEAR_PROP)) continue;
      dummy.position.set(h.x, 0.55, h.z);
      dummy.scale.set(h.len, 1.1, 0.55);
      dummy.rotation.set(0, -h.yaw, 0);
      dummy.updateMatrix();
      hedgeMesh.setMatrixAt(i, dummy.matrix);
    }
    this.scene.add(hedgeMesh);

    // Shrubs
    const shrubGeo = new THREE.SphereGeometry(1, 8, 6);
    const shrubMesh = new THREE.InstancedMesh(
      shrubGeo,
      this.materials.shrub,
      Math.min(shrubs.length + 200, 1200)
    );
    let si = 0;
    for (const s of shrubs) {
      if (si >= shrubMesh.count) break;
      if (!clearOfRoad(s.x, s.z, ROAD_CLEAR_PROP)) continue;
      dummy.position.set(s.x, 0.45 * s.s, s.z);
      dummy.scale.set(s.s, s.s * 0.85, s.s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      shrubMesh.setMatrixAt(si++, dummy.matrix);
    }

    // Roadside palms — ONLY outside sidewalk clear zone
    for (let i = 0; i < TRACK_WAYPOINTS.length; i += 2) {
      const p = TRACK_WAYPOINTS[i];
      const n = TRACK_WAYPOINTS[(i + 1) % TRACK_WAYPOINTS.length];
      const ang = Math.atan2(n.y - p.y, n.x - p.x) + Math.PI / 2;
      for (const side of [-1, 1] as const) {
        const px = p.x + Math.cos(ang) * (ROAD_CLEAR_TREE + 1.5) * side;
        const pz = p.y + Math.sin(ang) * (ROAD_CLEAR_TREE + 1.5) * side;
        if (clearOfRoad(px, pz, ROAD_CLEAR_TREE)) {
          palms.push({ x: px, z: pz });
          // under-plant shrubs
          if (si < shrubMesh.count) {
            dummy.position.set(px + side * 1.2, 0.35, pz);
            dummy.scale.set(0.8, 0.6, 0.8);
            dummy.updateMatrix();
            shrubMesh.setMatrixAt(si++, dummy.matrix);
          }
        }
      }
    }
    this.scene.add(shrubMesh);

    const palmCount = Math.min(palms.length, 700);
    const trunks = new THREE.InstancedMesh(
      this.palmTrunkGeo,
      this.materials.palmBark,
      palmCount
    );
    const leaves = new THREE.InstancedMesh(
      this.palmLeafGeo,
      this.materials.palmFrond,
      palmCount * 6
    );
    const leafLite = new THREE.InstancedMesh(
      this.palmLeafGeo,
      this.materials.palmFrondLite,
      palmCount * 3
    );
    let pCount = 0;
    let li = 0;
    let lli = 0;
    for (let i = 0; i < palms.length && pCount < palmCount; i++) {
      const p = palms[i];
      if (!clearOfRoad(p.x, p.z, ROAD_CLEAR_TREE)) continue;
      const h = 5.0 + (i % 6) * 0.65;
      // slight trunk lean
      const lean = ((i % 5) - 2) * 0.04;
      dummy.position.set(p.x, h / 2, p.z);
      dummy.scale.set(1, h, 1);
      dummy.rotation.set(lean, (i * 0.7) % Math.PI, -lean * 0.5);
      dummy.updateMatrix();
      trunks.setMatrixAt(pCount, dummy.matrix);
      for (let k = 0; k < 6 && li < leaves.count; k++) {
        const a = (k / 6) * Math.PI * 2 + i * 0.2;
        dummy.position.set(
          p.x + Math.cos(a) * 0.35,
          h + 0.2,
          p.z + Math.sin(a) * 0.35
        );
        dummy.scale.set(1.25, 1.15, 1.25);
        dummy.rotation.set(0.75, a, 0.2);
        dummy.updateMatrix();
        leaves.setMatrixAt(li++, dummy.matrix);
      }
      // secondary lighter fronds for depth
      for (let k = 0; k < 3 && lli < leafLite.count; k++) {
        const a = (k / 3) * Math.PI * 2 + 0.4;
        dummy.position.set(
          p.x + Math.cos(a) * 0.2,
          h + 0.45,
          p.z + Math.sin(a) * 0.2
        );
        dummy.scale.set(0.95, 0.9, 0.95);
        dummy.rotation.set(0.95, a, 0);
        dummy.updateMatrix();
        leafLite.setMatrixAt(lli++, dummy.matrix);
      }
      pCount++;
    }
    trunks.castShadow = true;
    leaves.castShadow = true;
    this.scene.add(trunks);
    this.scene.add(leaves);
    this.scene.add(leafLite);
  }

  private addLandmarks(areaId?: AreaId) {
    const area = getDriveArea(areaId ?? this.activeAreaId);
    const at = this.areaTheme;
    const focusIds = new Set([
      area.squareLandmarkId,
      ...area.recCenterIds,
    ]);

    for (const lm of LANDMARKS) {
      // Only build the active area's square + its rec centers (themed neighborhood)
      if (!focusIds.has(lm.id) && lm.kind === "town-square") continue;
      if (lm.kind === "rec-center" && !focusIds.has(lm.id)) continue;
      if (lm.kind === "flavor") continue;

      const g = new THREE.Group();
      g.position.set(lm.x, 0, lm.y);

      let roadAwayX = 0;
      let roadAwayZ = 1;
      {
        let best = Infinity;
        for (let i = 0; i < TRACK_WAYPOINTS.length; i += 2) {
          const p = TRACK_WAYPOINTS[i];
          const d = (p.x - lm.x) ** 2 + (p.y - lm.y) ** 2;
          if (d < best) {
            best = d;
            const len = Math.hypot(lm.x - p.x, lm.y - p.y) || 1;
            roadAwayX = (lm.x - p.x) / len;
            roadAwayZ = (lm.y - p.y) / len;
          }
        }
      }

      if (lm.kind === "town-square") {
        const colors = at.stucco;
        const style = at.landmarkStyle;
        // Ring of themed shops — proportions shift by square architecture
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const rad = style === "western" ? 30 : 28;
          const lx = Math.cos(a) * rad;
          const lz = Math.sin(a) * rad;
          const wx = lm.x + lx;
          const wz = lm.y + lz;
          if (!clearOfRoad(wx, wz, ROAD_CLEAR_BUILDING)) continue;

          // Western false-fronts are taller/skinnier; coastal shops wider; SW adobe blocky
          let bw = 7 + (i % 3);
          let bh = 6.4 + (i % 2) * 1.4;
          let bd = 5.5;
          if (style === "western") {
            bw = 5.5 + (i % 2);
            bh = 7.5 + (i % 3) * 1.2;
            bd = 4.8;
          } else if (style === "lighthouse") {
            bw = 7.5 + (i % 2);
            bh = 5.8 + (i % 3) * 0.8;
            bd = 5.2;
          } else if (style === "midcentury") {
            bw = 8 + (i % 2) * 1.5;
            bh = 5.5 + (i % 2);
            bd = 6;
          } else if (style === "modern") {
            bw = 7.5 + (i % 3) * 0.8;
            bh = 5.2 + (i % 2) * 1.6;
            bd = 5.8;
          }

          const building = new THREE.Mesh(
            this.houseGeo,
            mat(colors[i % colors.length], 0.88, 0.18)
          );
          building.position.set(lx, bh / 2, lz);
          building.scale.set(bw, bh, bd);
          building.castShadow = true;
          g.add(building);

          // Roof style by theme
          if (style === "southwest") {
            // Terra-cotta hip-ish roof
            const roof = new THREE.Mesh(this.houseGeo, this.materials.roof);
            roof.position.set(lx, bh + 0.9, lz);
            roof.scale.set(bw + 1.2, 1.6, bd + 1);
            g.add(roof);
          } else if (style === "western") {
            // False-front parapet + lean-to roof
            const front = new THREE.Mesh(
              this.houseGeo,
              mat(at.roofAlt, 0.75, 0.15)
            );
            front.position.set(lx * 0.96, bh + 0.6, lz * 0.96);
            front.scale.set(bw + 0.4, 2.2, 0.4);
            g.add(front);
            const lean = new THREE.Mesh(this.houseGeo, this.materials.roof);
            lean.position.set(lx, bh + 0.4, lz);
            lean.scale.set(bw + 0.6, 0.5, bd + 0.4);
            g.add(lean);
          } else if (style === "lighthouse") {
            // Coastal gable / pastel roof mix
            const roof = new THREE.Mesh(
              this.houseGeo,
              i % 2 === 0 ? this.materials.roof : this.materials.roofBlue
            );
            roof.position.set(lx, bh + 0.85, lz);
            roof.scale.set(bw + 1, 1.5, bd + 0.8);
            g.add(roof);
          } else if (style === "midcentury") {
            // Flat slab roof with accent edge
            const roof = new THREE.Mesh(this.houseGeo, this.materials.roof);
            roof.position.set(lx, bh + 0.35, lz);
            roof.scale.set(bw + 1.4, 0.45, bd + 1.2);
            g.add(roof);
            const edge = new THREE.Mesh(
              this.houseGeo,
              mat(at.roofAlt, 0.5, 0.25)
            );
            edge.position.set(lx * 0.97, bh + 0.55, lz * 0.97);
            edge.scale.set(bw + 1.5, 0.25, 0.35);
            g.add(edge);
          } else {
            // Modern low green/blue roofs
            const roof = new THREE.Mesh(
              this.houseGeo,
              i % 2 === 0 ? this.materials.roofGreen : this.materials.roof
            );
            roof.position.set(lx, bh + 0.55, lz);
            roof.scale.set(bw + 1.1, 0.7, bd + 0.9);
            g.add(roof);
          }

          const awning = new THREE.Mesh(
            this.houseGeo,
            mat(i % 2 === 0 ? at.accent : at.roofAlt, 0.55, 0.18)
          );
          awning.position.set(lx * 0.9, 2.2, lz * 0.9);
          awning.scale.set(Math.min(bw - 0.5, 6.2), 0.22, 1.35);
          g.add(awning);
          const win = new THREE.Mesh(this.houseGeo, this.materials.window);
          win.position.set(lx * 0.86, 1.7, lz * 0.86);
          win.scale.set(Math.min(bw - 1.5, 4.2), 1.5, 0.18);
          g.add(win);
        }

        // Themed centerpiece by square style
        addSquareCenterpiece(g, at);

        const stageX = roadAwayX * 30;
        const stageZ = roadAwayZ * 30;
        if (clearOfRoad(lm.x + stageX, lm.y + stageZ, ROAD_CLEAR_BUILDING)) {
          const stage = new THREE.Mesh(
            new THREE.BoxGeometry(16, 1.4, 9),
            mat(at.roof, 0.7, 0.25)
          );
          stage.position.set(stageX, 0.7, stageZ);
          g.add(stage);
          const canopy = new THREE.Mesh(
            new THREE.BoxGeometry(18, 0.3, 10),
            mat(at.plaza, 0.6, 0.2)
          );
          canopy.position.set(stageX, 4.2, stageZ);
          g.add(canopy);
        }
        const signX = roadAwayX * 18 + roadAwayZ * 10;
        const signZ = roadAwayZ * 18 - roadAwayX * 10;
        if (clearOfRoad(lm.x + signX, lm.y + signZ, ROAD_CLEAR_PROP)) {
          const sign = this.makeSign(lm.shortName, at.accent);
          sign.position.set(signX, 0, signZ);
          g.add(sign);
        }
      } else if (lm.kind === "rec-center") {
        const ox = roadAwayX * 8;
        const oz = roadAwayZ * 8;
        const main = new THREE.Mesh(this.houseGeo, mat("#e8f4ec", 0.9, 0.25));
        main.position.set(ox, 3.5, oz);
        main.scale.set(18, 7, 12);
        main.castShadow = true;
        if (clearOfRoad(lm.x + ox, lm.y + oz, ROAD_CLEAR_BUILDING)) {
          g.add(main);
          const roof = new THREE.Mesh(this.houseGeo, this.materials.roofGreen);
          roof.position.set(ox, 7.5, oz);
          roof.scale.set(20, 1.5, 14);
          g.add(roof);
          // entrance canopy
          const entry = new THREE.Mesh(this.houseGeo, mat("#cfe8d8", 0.7, 0.2));
          entry.position.set(ox + roadAwayX * 8, 2.2, oz + roadAwayZ * 8);
          entry.scale.set(6, 0.4, 4);
          g.add(entry);
        }
        const poolX = ox + roadAwayZ * 14;
        const poolZ = oz - roadAwayX * 14;
        if (clearOfRoad(lm.x + poolX, lm.y + poolZ, ROAD_CLEAR_PROP + 4)) {
          const pool = new THREE.Mesh(
            new THREE.BoxGeometry(10, 0.4, 6),
            this.materials.water
          );
          pool.position.set(poolX, 0.2, poolZ);
          g.add(pool);
          const deck = new THREE.Mesh(
            new THREE.BoxGeometry(14, 0.12, 10),
            this.materials.sand
          );
          deck.position.set(poolX, 0.08, poolZ);
          g.add(deck);
        }
        const sign = this.makeSign(lm.shortName, this.areaTheme.accent);
        sign.position.set(ox + roadAwayX * 14, 0, oz + roadAwayZ * 14);
        if (clearOfRoad(lm.x + sign.position.x, lm.y + sign.position.z, ROAD_CLEAR_PROP)) {
          g.add(sign);
        }
      } else {
        if (clearOfRoad(lm.x, lm.y, ROAD_CLEAR_PROP)) {
          g.add(this.makeSign(lm.shortName, "#ffffff"));
        }
      }

      this.scene.add(g);
    }
  }

  private makeSign(text: string, color: string): THREE.Group {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 4, 6),
      mat("#666", 0.5, 0.4)
    );
    pole.position.y = 2;
    g.add(pole);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max(6, text.length * 0.55), 1.4, 0.2),
      mat(color, 0.5, 0.4)
    );
    board.position.y = 4.2;
    g.add(board);

    // Canvas text sprite
    const sprite = makeTextSprite(text, "#1c2430", color);
    sprite.position.set(0, 4.2, 0.2);
    sprite.scale.set(8, 2.2, 1);
    g.add(sprite);
    return g;
  }

  private addStreetFurniture(samples: RoadSample[]) {
    const lampGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.8, 6);
    const armGeo = new THREE.BoxGeometry(0.08, 0.08, 0.9);
    const bulbGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const count = Math.min(Math.floor(samples.length / 3), 280);
    const poles = new THREE.InstancedMesh(lampGeo, mat("#4a4a52", 0.5, 0.4), count);
    const arms = new THREE.InstancedMesh(armGeo, mat("#4a4a52", 0.5, 0.4), count);
    const bulbs = new THREE.InstancedMesh(bulbGeo, this.materials.lamp, count);
    const dummy = new THREE.Object3D();
    let i = 0;
    // Lamps sit past sidewalk — never on asphalt
    const lampOffset = ROAD_CLEAR_PROP + 0.8;
    for (let s = 0; s < samples.length && i < count; s += 3) {
      const sample = samples[s];
      const nx = Math.cos(sample.angle + Math.PI / 2);
      const ny = Math.sin(sample.angle + Math.PI / 2);
      const side = s % 6 < 3 ? 1 : -1;
      const x = sample.x + nx * lampOffset * side;
      const z = sample.y + ny * lampOffset * side;
      if (!clearOfRoad(x, z, ROAD_CLEAR_PROP)) continue;

      dummy.position.set(x, 1.9, z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      poles.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x + nx * side * 0.35, 3.7, z + ny * side * 0.35);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, -sample.angle, 0);
      dummy.updateMatrix();
      arms.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x + nx * side * 0.7, 3.55, z + ny * side * 0.7);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bulbs.setMatrixAt(i, dummy.matrix);
      i++;
    }
    this.scene.add(poles);
    this.scene.add(arms);
    this.scene.add(bulbs);

    // Fire hydrants
    const hydGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.7, 8);
    const hyds = new THREE.InstancedMesh(hydGeo, mat(theme.sunset, 0.55, 0.3), 60);
    let hi = 0;
    for (let s = 4; s < samples.length && hi < 60; s += 11) {
      const sample = samples[s];
      const nx = Math.cos(sample.angle + Math.PI / 2);
      const ny = Math.sin(sample.angle + Math.PI / 2);
      const x = sample.x + nx * (ROAD_CLEAR_PROP + 0.5);
      const z = sample.y + ny * (ROAD_CLEAR_PROP + 0.5);
      if (!clearOfRoad(x, z, ROAD_CLEAR_PROP)) continue;
      dummy.position.set(x, 0.35, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      hyds.setMatrixAt(hi++, dummy.matrix);
    }
    this.scene.add(hyds);
  }

  /** Extra Florida curb-appeal detail — beds, fences, planters, posts */
  private addRoadsideDetail(samples: RoadSample[]) {
    const dummy = new THREE.Object3D();
    const flowerMats = [
      mat("#e85d4c", 0.7, 0.15),
      mat("#e8b84a", 0.7, 0.15),
      mat("#f0f0f8", 0.7, 0.1),
      mat("#c45c9a", 0.7, 0.15),
      mat("#3aa6c9", 0.7, 0.15),
    ];
    const bedGeo = new THREE.BoxGeometry(1, 0.25, 2.2);
    const bloomGeo = new THREE.SphereGeometry(0.22, 8, 6);
    const beds = new THREE.InstancedMesh(bedGeo, mat("#5a4030", 0.9, 0.15), 160);
    const blooms = flowerMats.map(
      (m) => new THREE.InstancedMesh(bloomGeo, m, 200)
    );
    const bloomCount = blooms.map(() => 0);
    let bi = 0;

    for (let s = 1; s < samples.length && bi < beds.count; s += 4) {
      const sample = samples[s];
      const nx = Math.cos(sample.angle + Math.PI / 2);
      const ny = Math.sin(sample.angle + Math.PI / 2);
      const side = s % 8 < 4 ? 1 : -1;
      const x = sample.x + nx * (ROAD_CLEAR_PROP + 2.8) * side;
      const z = sample.y + ny * (ROAD_CLEAR_PROP + 2.8) * side;
      if (!clearOfRoad(x, z, ROAD_CLEAR_PROP + 1) || onRoundabout(x, z, ROAD_HALF_WIDTH + 6)) continue;
      dummy.position.set(x, 0.14, z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, -sample.angle, 0);
      dummy.updateMatrix();
      beds.setMatrixAt(bi++, dummy.matrix);
      for (let f = 0; f < 5; f++) {
        const fi = (s + f) % blooms.length;
        if (bloomCount[fi] >= blooms[fi].count) continue;
        dummy.position.set(
          x + Math.cos(sample.angle) * (f - 2) * 0.35 + nx * side * 0.15,
          0.38,
          z + Math.sin(sample.angle) * (f - 2) * 0.35 + ny * side * 0.15
        );
        dummy.scale.set(0.7 + (f % 3) * 0.15, 0.7, 0.7);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        blooms[fi].setMatrixAt(bloomCount[fi]++, dummy.matrix);
      }
    }
    this.scene.add(beds);
    for (const b of blooms) this.scene.add(b);

    // Street-name style signs at intervals
    const signPole = new THREE.CylinderGeometry(0.06, 0.07, 3.2, 6);
    const signBlade = new THREE.BoxGeometry(1.8, 0.35, 0.08);
    const poles = new THREE.InstancedMesh(signPole, mat("#6a6a72", 0.5, 0.4), 40);
    const blades = new THREE.InstancedMesh(signBlade, mat("#1f6b4a", 0.5, 0.25), 40);
    let si = 0;
    for (let s = 0; s < samples.length && si < 40; s += Math.floor(samples.length / 40)) {
      const sample = samples[s];
      const nx = Math.cos(sample.angle + Math.PI / 2);
      const ny = Math.sin(sample.angle + Math.PI / 2);
      const x = sample.x + nx * (ROAD_CLEAR_PROP + 1.5);
      const z = sample.y + ny * (ROAD_CLEAR_PROP + 1.5);
      if (!clearOfRoad(x, z, ROAD_CLEAR_PROP)) continue;
      dummy.position.set(x, 1.6, z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      poles.setMatrixAt(si, dummy.matrix);
      dummy.position.set(x, 3.0, z);
      dummy.rotation.set(0, -sample.angle, 0);
      dummy.updateMatrix();
      blades.setMatrixAt(si, dummy.matrix);
      si++;
    }
    this.scene.add(poles);
    this.scene.add(blades);
  }

  private addSkyDecor() {
    // Multi-blob cartoon clouds (more volume)
    const cloudGeo = new THREE.SphereGeometry(1, 12, 10);
    const clouds = new THREE.InstancedMesh(cloudGeo, this.materials.cloud, 120);
    const dummy = new THREE.Object3D();
    const rng = mulberry32(99);
    let ci = 0;
    for (let i = 0; i < 36 && ci < 120; i++) {
      const cx = WORLD.minX + rng() * WORLD.width;
      const cy = 48 + rng() * 40;
      const cz = WORLD.minY + rng() * WORLD.height;
      const base = 7 + rng() * 10;
      for (let k = 0; k < 3 && ci < 120; k++) {
        dummy.position.set(
          cx + (k - 1) * base * 0.55,
          cy + (k === 1 ? base * 0.15 : 0),
          cz + (rng() - 0.5) * base * 0.3
        );
        const s = base * (0.7 + rng() * 0.5);
        dummy.scale.set(s * 1.5, s * 0.65, s * 1.1);
        dummy.updateMatrix();
        clouds.setMatrixAt(ci++, dummy.matrix);
      }
    }
    this.scene.add(clouds);

    // Distant soft hills / berms for horizon interest
    const hillGeo = new THREE.SphereGeometry(1, 16, 10);
    const hills = new THREE.InstancedMesh(hillGeo, mat("#5a9a62", 0.95, 0.08), 24);
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const rad = Math.max(WORLD.width, WORLD.height) * 0.48;
      const cx = (WORLD.minX + WORLD.maxX) / 2 + Math.cos(ang) * rad;
      const cz = (WORLD.minY + WORLD.maxY) / 2 + Math.sin(ang) * rad;
      dummy.position.set(cx, -8, cz);
      dummy.scale.set(40 + (i % 5) * 8, 18 + (i % 3) * 4, 40 + (i % 4) * 6);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      hills.setMatrixAt(i, dummy.matrix);
    }
    this.scene.add(hills);
  }

  ensureRacers(racers: Racer[], playerDonationTier?: DonationTierUsd | null) {
    for (const r of racers) {
      if (!this.racerMeshes.has(r.id)) {
        const mesh = buildTexturedCart(
          r.cart,
          r.driver,
          r.isPlayer,
          this.materials,
          r.isPlayer ? r.name : undefined,
          r.isPlayer ? playerDonationTier ?? null : null
        );
        this.scene.add(mesh);
        this.racerMeshes.set(r.id, mesh);
      }
    }
  }

  syncProjectiles(projectiles: Projectile[]) {
    const live = new Set<number>();
    for (const p of projectiles) {
      live.add(p.id);
      let mesh = this.projectileMeshes.get(p.id);
      if (!mesh) {
        mesh = buildProjectileMesh(p.kind);
        this.scene.add(mesh);
        this.projectileMeshes.set(p.id, mesh);
      }
      const bob =
        p.kind === "fireball"
          ? 1.1 + Math.sin(this.clock * 18) * 0.08
          : p.kind === "bolt"
            ? 1.05 + Math.sin(this.clock * 20 + p.id) * 0.07
            : 0.85 + Math.sin(this.clock * 10 + p.id) * 0.05;
      mesh.position.set(p.x, bob, p.y);
      mesh.rotation.y = Math.atan2(p.vy, p.vx);
      if (p.kind === "bolt") {
        mesh.rotation.x = 0;
        mesh.rotation.z = Math.sin(this.clock * 28 + p.id) * 0.12;
        const pulse = 1 + Math.sin(this.clock * 26 + p.id) * 0.08;
        mesh.scale.setScalar(pulse);
      } else {
        mesh.rotation.x = p.spin * 0.35;
        mesh.rotation.z = p.spin * 0.2;
        if (p.kind === "fireball") {
          const pulse = 1 + Math.sin(this.clock * 22 + p.id) * 0.18;
          mesh.scale.setScalar(pulse);
        }
      }
    }
    for (const [id, mesh] of this.projectileMeshes) {
      if (!live.has(id)) {
        this.scene.remove(mesh);
        this.projectileMeshes.delete(id);
      }
    }
  }

  syncAmmoPickups(pickups: AmmoPickup[]) {
    const live = new Set<number>();
    for (const pad of pickups) {
      live.add(pad.id);
      let g = this.pickupMeshes.get(pad.id);
      if (!g) {
        g = buildAmmoPadMesh(pad.kind);
        this.scene.add(g);
        this.pickupMeshes.set(pad.id, g);
      }
      g.visible = pad.active;
      if (!pad.active) continue;
      const bob = 0.35 + Math.sin(pad.phase) * 0.12;
      g.position.set(pad.x, bob, pad.y);
      g.rotation.y = pad.phase * 0.6;
    }
    for (const [id, mesh] of this.pickupMeshes) {
      if (!live.has(id)) {
        this.scene.remove(mesh);
        this.pickupMeshes.delete(id);
      }
    }
  }

  syncSolids(solids: SolidObstacle[]) {
    // Props (old orange cone markers) are no longer spawned or drawn.
    // Keep cleanup for any leftover markers if a solid is destroyed mid-race.
    for (const s of solids) {
      if (s.kind === "landmark" || s.kind === "gate" || s.kind === "island") continue;
      if (s.destroyed) {
        const marker = this.solidMarkers.get(s.id);
        if (marker) {
          this.scene.remove(marker);
          this.solidMarkers.delete(s.id);
        }
      }
    }
  }

  /** Called when solids destroyed — remove any house-proxy meshes we track */
  markSolidDestroyed(id: number) {
    const m = this.solidMarkers.get(id);
    if (m) {
      this.scene.remove(m);
      this.solidMarkers.delete(id);
    }
  }

  syncHazards(hazards: HazardInstance[]) {
    const live = new Set<number>();
    for (const h of hazards) {
      if (!h.active) continue;
      live.add(h.id);
      let entry = this.hazardMeshes.get(h.id);
      // Rebuild if art finished loading after a procedural fallback was placed
      if (entry && !entry.isSprite && hasHazardSprite(h.type)) {
        this.scene.remove(entry.root);
        this.hazardMeshes.delete(h.id);
        entry = undefined;
      }
      if (!entry) {
        const built = buildHazardMesh(h);
        entry = {
          id: h.id,
          root: built.root,
          isSprite: built.isSprite,
          sprite: built.sprite,
          baseScaleX: built.sprite ? Math.abs(built.sprite.scale.x) : 1,
          baseScaleY: built.sprite ? built.sprite.scale.y : 1,
        };
        this.scene.add(entry.root);
        this.hazardMeshes.set(h.id, entry);
      }
      const bob =
        h.type === "golf-ball"
          ? Math.abs(Math.sin(this.clock * 8 + h.phase)) * 0.28
          : h.type === "turtle"
            ? Math.sin(this.clock * 2 + h.phase) * 0.04
            : h.type === "lightning"
              ? Math.sin(this.clock * 6 + h.phase) * 0.08
              : 0;
      const he = this.elevAt(h.x, h.y, this.lastSamples);
      entry.root.position.set(h.x, bob + he, h.y);
      if (h.type === "golf-ball" && !entry.isSprite) {
        entry.root.rotation.x = this.clock * 9 + h.phase;
        entry.root.rotation.z = this.clock * 6;
      } else if (h.type === "sinkhole") {
        // Stay planted on the road — no travel yaw
        entry.root.rotation.y = 0;
      } else if (!entry.isSprite) {
        entry.root.rotation.y = -h.angle + Math.PI / 2;
      } else if (entry.sprite && entry.baseScaleX) {
        // Face always points the way the hazard is moving (no moonwalking)
        updateHazardFaceSign(h, this.camera);
        const artRight = HAZARD_ART_FACES_RIGHT[h.type] ? 1 : -1;
        const flip = h.faceSign * artRight;
        const pulse =
          h.type === "lightning"
            ? 0.94 + Math.sin(this.clock * 18 + h.phase) * 0.08
            : 1;
        entry.sprite.scale.x = entry.baseScaleX * flip * pulse;
        entry.sprite.scale.y = (entry.baseScaleY ?? entry.baseScaleX) * pulse;
      }
    }
    for (const [id, entry] of this.hazardMeshes) {
      if (!live.has(id)) {
        this.scene.remove(entry.root);
        this.hazardMeshes.delete(id);
      }
    }
  }

  /** Road elevation under a world x/z (for carts + camera on overpasses) */
  private elevAt(x: number, z: number, samples?: RoadSample[]): number {
    const list = samples ?? [];
    if (!list.length) {
      // Fall back: nearest TRACK_WAYPOINTS elev
      let best = 0;
      let bestD = Infinity;
      for (const p of TRACK_WAYPOINTS) {
        const d = (p.x - x) ** 2 + (p.y - z) ** 2;
        if (d < bestD) {
          bestD = d;
          best = p.elev ?? 0;
        }
      }
      return best;
    }
    let best = 0;
    let bestD = Infinity;
    const step = Math.max(1, Math.floor(list.length / 300));
    for (let i = 0; i < list.length; i += step) {
      const s = list[i];
      const d = (s.x - x) ** 2 + (s.y - z) ** 2;
      if (d < bestD) {
        bestD = d;
        best = s.elev ?? 0;
      }
    }
    return best;
  }

  private lastSamples: RoadSample[] = [];

  updateRacers(racers: Racer[], samples?: RoadSample[]) {
    if (samples) this.lastSamples = samples;
    for (const r of racers) {
      const mesh = this.racerMeshes.get(r.id);
      if (!mesh) continue;
      const elev = this.elevAt(r.x, r.y, this.lastSamples);
      // Local +Z is cart forward → map race angle (0 = +X east) onto Yaw
      const sink = r.trapTimer > 0 ? 0.58 : 0;
      mesh.position.set(r.x, 0.15 + elev - sink, r.y);
      mesh.rotation.y = -r.angle + Math.PI / 2;
      const arm = mesh.getObjectByName("gate-pass-arm");
      if (arm) {
        if (r.waveTimer > 0) {
          const wiggle = Math.sin(r.waveTimer * 22) * 0.55;
          arm.rotation.z = -0.15 + wiggle;
          arm.rotation.x = -1.05;
          arm.rotation.y = 0.35;
        } else {
          arm.rotation.z = 0.85;
          arm.rotation.x = 0.15;
          arm.rotation.y = 0;
        }
      }
    }
  }

  /**
   * Chase cam — raised so the player sees the road ahead, not the cart roof/interior.
   * Snaps instantly on race start so we never show empty world-origin frames.
   * Follows overpass elevation so bridges don't put the cam underground.
   */
  updateCamera(player: Racer, dt: number) {
    const speed01 = Math.min(1, Math.abs(player.speed) / 36);
    const elev = this.elevAt(player.x, player.y, this.lastSamples);
    // Higher + farther back so more of the cart path is in frame (less horizon void)
    const dist = 11 + speed01 * 3.5;
    const height = 6.2 + speed01 * 1.2 + elev;
    const lookDist = 32 + speed01 * 8;
    const lookHeight = 1.1 + speed01 * 0.3 + elev;

    const behindX = player.x - Math.cos(player.angle) * dist;
    const behindZ = player.y - Math.sin(player.angle) * dist;
    this.tmp.set(behindX, height, behindZ);

    this.lookAhead.set(
      player.x + Math.cos(player.angle) * lookDist,
      lookHeight,
      player.y + Math.sin(player.angle) * lookDist
    );

    if (this.cameraNeedsSnap) {
      this.camPos.copy(this.tmp);
      this.camTarget.copy(this.lookAhead);
      this.cameraNeedsSnap = false;
    } else {
      const smooth = 1 - Math.pow(0.0002, dt);
      this.camPos.lerp(this.tmp, smooth);
      this.camTarget.lerp(this.lookAhead, Math.min(1, smooth * 1.25));
    }

    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camTarget);
  }

  render(dt: number) {
    this.clock += dt;
    this.renderer.render(this.scene, this.camera);
  }

  resize(w: number, h: number) {
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  dispose() {
    this.renderer.dispose();
  }

  /** Soft menu backdrop without a full world */
  renderMenuBackdrop(time: number) {
    this.scene.background = new THREE.Color().setHSL(0.35 + Math.sin(time * 0.0002) * 0.02, 0.45, 0.35);
    this.camera.position.set(0, 40, 80);
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }
}

function mat(color: string, rough: number, metal: number) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: metal,
  });
}

/**
 * Plaza centerpiece by Town Square theme:
 * SW fountain · Sumter lighthouse · Brownwood windmill · Eastport pavilion · Sawgrass grove disk
 */
function addSquareCenterpiece(g: THREE.Group, at: AreaTheme) {
  const style = at.landmarkStyle;
  // Shared plaza paving disk under every centerpiece
  const paving = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 0.18, 28),
    mat(at.plaza, 0.85, 0.08)
  );
  paving.position.y = 0.09;
  paving.receiveShadow = true;
  g.add(paving);

  if (style === "lighthouse") {
    // Sumter Landing — coastal lighthouse + short pier stub
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 1.2, 12),
      mat("#d8e4ec", 0.75, 0.15)
    );
    base.position.y = 0.6;
    g.add(base);
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.85, 14, 14),
      mat("#f4f8fc", 0.65, 0.18)
    );
    tower.position.y = 8;
    tower.castShadow = true;
    g.add(tower);
    // Red/white coastal bands
    for (const y of [4.5, 9.5, 13]) {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 1.1, 14),
        mat(y === 9.5 ? at.accent : "#c45c48", 0.5, 0.25)
      );
      band.position.y = y;
      g.add(band);
    }
    const lantern = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 1.55, 2.2, 10),
      mat("#e8b84a", 0.35, 0.45)
    );
    lantern.position.y = 16;
    g.add(lantern);
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 12, 12),
      new THREE.MeshStandardMaterial({
        color: "#fff8c0",
        emissive: "#ffe080",
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.5,
      })
    );
    lamp.position.y = 17.6;
    g.add(lamp);
    // Mini boardwalk stub toward water vibe
    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.35, 10),
      mat("#8b6a4a", 0.8, 0.1)
    );
    pier.position.set(0, 0.25, 12);
    g.add(pier);
  } else if (style === "western") {
    // Brownwood — ranch windmill + water tower + hitching rail
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.38, 13, 8),
      mat("#6b5344", 0.8, 0.15)
    );
    pole.position.y = 6.5;
    pole.castShadow = true;
    g.add(pole);
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 5.2, 0.9),
        mat("#c4a574", 0.75, 0.12)
      );
      blade.position.set(Math.cos(ang) * 2.6, 13, Math.sin(ang) * 2.6);
      blade.rotation.z = ang;
      g.add(blade);
    }
    // Legs for water tower
    for (const [x, z] of [
      [-2.2, -2.2],
      [2.2, -2.2],
      [-2.2, 2.2],
      [2.2, 2.2],
    ]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 7, 6),
        mat("#5a4030", 0.85, 0.15)
      );
      leg.position.set(9 + x, 3.5, z);
      g.add(leg);
    }
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.6, 3.2, 14),
      mat("#8b7355", 0.7, 0.22)
    );
    tank.position.set(9, 8.5, 0);
    tank.castShadow = true;
    g.add(tank);
    const tankRoof = new THREE.Mesh(
      new THREE.ConeGeometry(3, 1.4, 10),
      mat(at.roof, 0.7, 0.2)
    );
    tankRoof.position.set(9, 10.8, 0);
    g.add(tankRoof);
    // Hitching rail
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.15, 0.15),
      mat("#4a3428", 0.85, 0.1)
    );
    rail.position.set(-6, 1.1, 6);
    g.add(rail);
  } else if (style === "southwest") {
    // Spanish Springs — multi-tier plaza fountain + adobe urns
    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 5.8, 1.1, 20),
      mat(at.plaza, 0.75, 0.15)
    );
    basin.position.y = 0.55;
    basin.castShadow = true;
    g.add(basin);
    const pool = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.2, 0.55, 20),
      mat(at.water, 0.12, 0.55)
    );
    pool.position.y = 1.15;
    g.add(pool);
    const mid = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.6, 1.4, 14),
      mat(at.stucco[1] ?? at.stucco[0], 0.8, 0.12)
    );
    mid.position.y = 1.9;
    g.add(mid);
    const spout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.45, 2.8, 8),
      mat(at.accent, 0.45, 0.35)
    );
    spout.position.y = 3.6;
    g.add(spout);
    const jet = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 10, 10),
      mat(at.water, 0.2, 0.4)
    );
    jet.position.y = 5.2;
    g.add(jet);
    // Adobe planters around fountain
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const urn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.7, 1.1, 8),
        mat(at.roof, 0.7, 0.15)
      );
      urn.position.set(Math.cos(a) * 8, 0.55, Math.sin(a) * 8);
      g.add(urn);
      const plant = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 8, 8),
        mat(at.grassDeep, 0.9, 0.05)
      );
      plant.position.set(Math.cos(a) * 8, 1.35, Math.sin(a) * 8);
      g.add(plant);
    }
  } else if (style === "midcentury") {
    // Eastport — mid-century pavilion + geometric fountain
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.35, 14),
      mat(at.plaza, 0.7, 0.15)
    );
    base.position.y = 0.18;
    g.add(base);
    for (const [x, z] of [
      [-5, -5],
      [5, -5],
      [-5, 5],
      [5, 5],
    ]) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.38, 7, 10),
        mat(at.stucco[0], 0.75, 0.18)
      );
      col.position.set(x, 3.6, z);
      col.castShadow = true;
      g.add(col);
    }
    // Butterfly / butterfly-roof mid-century slab
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.28, 16),
      mat(at.roof, 0.55, 0.28)
    );
    roof.position.y = 7.2;
    roof.rotation.x = 0.06;
    g.add(roof);
    const accentBar = new THREE.Mesh(
      new THREE.BoxGeometry(16.2, 0.35, 0.6),
      mat(at.roofAlt, 0.5, 0.25)
    );
    accentBar.position.set(0, 7.35, 0);
    g.add(accentBar);
    // Geometric fountain in center
    const fount = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.9, 4),
      mat(at.accent, 0.45, 0.3)
    );
    fount.position.y = 0.55;
    g.add(fount);
    const water = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.25, 3.2),
      mat(at.water, 0.15, 0.5)
    );
    water.position.y = 1.05;
    g.add(water);
  } else {
    // Sawgrass Grove — orange-grove canopy disk + Boxcar Stage energy
    const disk = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 11, 0.22, 28),
      mat(at.plaza, 0.7, 0.15)
    );
    disk.position.y = 0.12;
    g.add(disk);
    // Canopy poles + citrus-colored spheres (grove vibe)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const px = Math.cos(a) * 7.5;
      const pz = Math.sin(a) * 7.5;
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 5.5, 6),
        mat("#5a7060", 0.75, 0.15)
      );
      pole.position.set(px, 2.75, pz);
      g.add(pole);
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(1.4, 10, 10),
        mat(i % 2 === 0 ? at.accent : at.grass, 0.55, 0.1)
      );
      canopy.position.set(px, 5.6, pz);
      canopy.scale.y = 0.55;
      g.add(canopy);
    }
    // Abstract modern sculpture / stage marker
    const sculpture = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.45, 10, 28),
      mat(at.accent, 0.35, 0.45)
    );
    sculpture.position.y = 3.8;
    sculpture.rotation.x = Math.PI / 2.4;
    g.add(sculpture);
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.5, 4),
      mat(at.roof, 0.7, 0.2)
    );
    stage.position.set(0, 0.35, 10);
    g.add(stage);
  }
}

function buildProjectileMesh(kind: Projectile["kind"]): THREE.Group {
  const g = new THREE.Group();
  if (kind === "golf-ball") {
    // Dimpled white Titleist-style ball
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 24, 20),
      new THREE.MeshStandardMaterial({
        color: "#f7f7f2",
        roughness: 0.45,
        metalness: 0.08,
      })
    );
    ball.castShadow = true;
    g.add(ball);
    // Dimple suggestion — dark micro-spheres
    for (let i = 0; i < 18; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 18);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.36;
      const d = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 6, 6),
        mat("#d8d8d4", 0.6, 0.05)
      );
      d.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      g.add(d);
    }
    // Soft shadow under ball in flight
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 12, 10),
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.15,
      })
    );
    g.add(glow);
  } else if (kind === "fireball") {
    // Layered fire: dark core → orange → yellow → translucent aura
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 14),
      new THREE.MeshStandardMaterial({
        color: "#1a0800",
        roughness: 0.9,
        metalness: 0.1,
        emissive: "#ff2200",
        emissiveIntensity: 0.8,
      })
    );
    core.castShadow = true;
    g.add(core);
    const mid = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 14, 12),
      new THREE.MeshStandardMaterial({
        color: "#ff5510",
        roughness: 0.5,
        metalness: 0.15,
        emissive: "#ff4400",
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.92,
      })
    );
    g.add(mid);
    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(0.58, 12, 10),
      new THREE.MeshStandardMaterial({
        color: "#ffcc33",
        roughness: 0.35,
        metalness: 0.1,
        emissive: "#ffaa00",
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.45,
      })
    );
    g.add(outer);
    // Flame licks (cones trailing back — local -Z)
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const lick = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.55, 6),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? "#ff6622" : "#ffdd44",
          roughness: 0.4,
          emissive: "#ff6600",
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.75,
        })
      );
      lick.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.15, -0.45);
      lick.rotation.x = Math.PI / 2;
      g.add(lick);
    }
  } else if (kind === "bolt") {
    const boltMat = new THREE.MeshStandardMaterial({
      color: "#f4fbff",
      roughness: 0.12,
      metalness: 0.25,
      emissive: "#7ecbff",
      emissiveIntensity: 1.55,
    });
    const glowMat = new THREE.MeshStandardMaterial({
      color: "#4aa8ff",
      roughness: 0.35,
      metalness: 0.1,
      emissive: "#2a7dff",
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    // Zigzag bolt along local +X so rotation.y = atan2(vy, vx) points it downrange
    const segs: { x: number; y: number; len: number; ang: number }[] = [
      { x: -0.85, y: 0.22, len: 0.62, ang: -0.72 },
      { x: -0.38, y: -0.08, len: 0.7, ang: 0.78 },
      { x: 0.12, y: 0.18, len: 0.62, ang: -0.7 },
      { x: 0.58, y: -0.1, len: 0.68, ang: 0.74 },
      { x: 0.98, y: 0.12, len: 0.42, ang: -0.55 },
    ];
    for (const s of segs) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(s.len, 0.14, 0.1), boltMat);
      bar.position.set(s.x, s.y, 0);
      bar.rotation.z = s.ang;
      bar.castShadow = true;
      g.add(bar);
      const halo = new THREE.Mesh(new THREE.BoxGeometry(s.len + 0.12, 0.28, 0.04), glowMat);
      halo.position.set(s.x, s.y, 0);
      halo.rotation.z = s.ang;
      g.add(halo);
    }
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 8), boltMat);
    tip.rotation.z = -Math.PI / 2;
    tip.position.set(1.28, 0.02, 0);
    g.add(tip);
  } else {
    // Natural bath loofah — tan porous sponge + darker pores + twine
    const spongeMat = new THREE.MeshStandardMaterial({
      color: "#e0b85a",
      roughness: 0.95,
      metalness: 0.02,
    });
    const poreMat = mat("#c49a40", 0.98, 0.02);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), spongeMat);
    body.scale.set(1.15, 0.85, 1.0);
    body.castShadow = true;
    g.add(body);
    // Porous surface bumps
    for (let i = 0; i < 22; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 22);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.38;
      const pore = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), poreMat);
      pore.position.set(
        r * Math.sin(phi) * Math.cos(theta) * 1.15,
        r * Math.sin(phi) * Math.sin(theta) * 0.85,
        r * Math.cos(phi)
      );
      g.add(pore);
    }
    // Twine / string loop
    const twine = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.035, 6, 14),
      mat("#8b6914", 0.85, 0.1)
    );
    twine.position.set(0.35, 0.15, 0);
    twine.rotation.y = Math.PI / 2;
    g.add(twine);
    // Fiber strands
    for (let i = 0; i < 6; i++) {
      const fiber = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, 0.35, 4),
        mat("#d4a84a", 0.9, 0.05)
      );
      fiber.position.set((i - 2.5) * 0.08, 0.25, 0.2);
      fiber.rotation.z = (i - 2.5) * 0.15;
      fiber.rotation.x = 0.4;
      g.add(fiber);
    }
  }
  return g;
}

function buildAmmoPadMesh(kind: Projectile["kind"]): THREE.Group {
  const g = new THREE.Group();
  const color =
    kind === "fireball" ? "#e85d4c" : kind === "loofah" ? "#e8b84a" : "#3aa6c9";
  // Glowing road pad
  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.5, 0.12, 20),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.35,
      emissive: color,
      emissiveIntensity: 0.35,
    })
  );
  pad.receiveShadow = true;
  g.add(pad);
  // Inner ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.08, 8, 24),
    new THREE.MeshStandardMaterial({
      color: "#fff8ee",
      roughness: 0.3,
      metalness: 0.4,
      emissive: "#ffffff",
      emissiveIntensity: 0.2,
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.1;
  g.add(ring);
  // Floating icon of ammo type
  const icon = buildProjectileMesh(kind);
  icon.scale.setScalar(0.85);
  icon.position.y = 0.85;
  g.add(icon);
  // Label sprite
  const label = makeTextSprite(
    `${projectileEmoji(kind)} ${projectileLabel(kind)}`,
    "#1c2430",
    "rgba(255,248,238,0.9)"
  );
  label.position.set(0, 1.6, 0);
  label.scale.set(3.2, 0.9, 1);
  g.add(label);
  return g;
}

function offsetLine(
  samples: RoadSample[],
  dist: number,
  yOf: (s: RoadSample) => number,
): THREE.Vector3[] {
  return samples.map((s) => {
    const nx = Math.cos(s.angle + Math.PI / 2);
    const ny = Math.sin(s.angle + Math.PI / 2);
    return new THREE.Vector3(s.x + nx * dist, yOf(s), s.y + ny * dist);
  });
}

/** Path stretches that are not on a roundabout — used so edge lines don't chord the circle. */
function markingSegments(samples: RoadSample[], extra: number): RoadSample[][] {
  const segs: RoadSample[][] = [];
  let cur: RoadSample[] = [];
  const blocked = (s: RoadSample) => onRoundabout(s.x, s.y, extra);
  for (const s of samples) {
    if (blocked(s)) {
      if (cur.length >= 2) segs.push(cur);
      cur = [];
    } else {
      cur.push(s);
    }
  }
  if (cur.length >= 2) segs.push(cur);
  if (
    segs.length >= 2 &&
    samples.length >= 2 &&
    !blocked(samples[0]) &&
    !blocked(samples[samples.length - 1]) &&
    segs[0][0] === samples[0] &&
    segs[segs.length - 1][segs[segs.length - 1].length - 1] === samples[samples.length - 1]
  ) {
    const last = segs.pop()!;
    segs[0] = last.concat(segs[0]);
  }
  return segs;
}

function ribbonGeometry(left: THREE.Vector3[], right: THREE.Vector3[]) {
  const n = Math.min(left.length, right.length);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < n; i++) {
    const l = left[i];
    const r = right[i];
    positions.push(l.x, l.y, l.z, r.x, r.y, r.z);
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, i * 0.1, 1, i * 0.1);
    if (i < n - 1) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  return geo;
}

/** Bounds of the active cart-path loop, with pad for ground / fog. */
function computeTrackBounds(samples: RoadSample[], pad: number) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const s of samples) {
    minX = Math.min(minX, s.x);
    maxX = Math.max(maxX, s.x);
    minY = Math.min(minY, s.y);
    maxY = Math.max(maxY, s.y);
  }
  if (!Number.isFinite(minX)) {
    return { minX: -200, maxX: 200, minY: -200, maxY: 200, cx: 0, cz: 0 };
  }
  return {
    minX: minX - pad,
    maxX: maxX + pad,
    minY: minY - pad,
    maxY: maxY + pad,
    cx: (minX + maxX) / 2,
    cz: (minY + maxY) / 2,
  };
}


function buildGolfBallHazard(): THREE.Group {
  const g = new THREE.Group();
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 20),
    new THREE.MeshStandardMaterial({
      color: "#f4f4ef",
      roughness: 0.42,
      metalness: 0.08,
    }),
  );
  ball.castShadow = true;
  ball.position.y = 0.58;
  g.add(ball);
  for (let i = 0; i < 22; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / 22);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 0.53;
    const d = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 6, 6),
      mat("#cfcfc8", 0.65, 0.04),
    );
    d.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      0.58 + r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    );
    g.add(d);
  }
  return g;
}

function buildPalmFrondHazard(): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const frond = new THREE.Group();
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.055, 2.6, 6),
      mat("#6b4a28", 0.88, 0.04),
    );
    stem.rotation.z = Math.PI / 2;
    stem.position.y = 0.07;
    frond.add(stem);
    for (let k = 0; k < 9; k++) {
      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.025, 0.15),
        mat(k % 2 ? "#2a6a38" : "#3d8f4a", 0.72, 0.04),
      );
      const t = (k / 8) * 2.2 - 1.1;
      leaf.position.set(t, 0.09, k % 2 ? 0.24 : -0.24);
      leaf.rotation.y = k % 2 ? 0.45 : -0.45;
      leaf.rotation.z = t * 0.08;
      frond.add(leaf);
    }
    frond.rotation.y = i * 2.15 + 0.25;
    frond.position.set((i - 1) * 0.22, i * 0.02, (i - 1) * 0.12);
    g.add(frond);
  }
  return g;
}

function buildSinkholeHazard(): THREE.Group {
  const g = new THREE.Group();

  // Deep cavity the chase cam can see into — not a flat disc on asphalt
  const pit = new THREE.Mesh(
    new THREE.ConeGeometry(2.2, 1.45, 20, 1, true),
    new THREE.MeshStandardMaterial({
      color: "#060504",
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
  );
  pit.position.y = -0.58;
  g.add(pit);
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 12),
    new THREE.MeshStandardMaterial({ color: "#030201", roughness: 1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.25;
  g.add(floor);

  // Raised broken-asphalt collar
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(2.28, 0.32, 8, 24),
    mat("#6e6a60", 0.95, 0.02),
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.18;
  collar.castShadow = true;
  g.add(collar);

  // High-contrast caution paint so it reads from down the path
  const yellow = new THREE.Mesh(
    new THREE.RingGeometry(2.05, 2.65, 32),
    new THREE.MeshStandardMaterial({
      color: "#f5c518",
      roughness: 0.5,
      metalness: 0.04,
      emissive: "#c49208",
      emissiveIntensity: 0.45,
    }),
  );
  yellow.rotation.x = -Math.PI / 2;
  yellow.position.y = 0.1;
  g.add(yellow);
  const orange = new THREE.Mesh(
    new THREE.RingGeometry(2.65, 3.05, 32),
    new THREE.MeshStandardMaterial({
      color: "#e85d14",
      roughness: 0.48,
      metalness: 0.04,
      emissive: "#9a2e00",
      emissiveIntensity: 0.32,
    }),
  );
  orange.rotation.x = -Math.PI / 2;
  orange.position.y = 0.09;
  g.add(orange);

  // Jagged slabs of asphalt kicked up around the hole
  for (let i = 0; i < 8; i++) {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.14, 0.42),
      mat(i % 2 ? "#5f5b52" : "#4c4840", 0.92, 0.04),
    );
    const a = (i / 8) * Math.PI * 2 + 0.18;
    slab.position.set(Math.cos(a) * 2.2, 0.26, Math.sin(a) * 2.2);
    slab.rotation.y = a;
    slab.rotation.z = 0.38 + (i % 3) * 0.1;
    slab.castShadow = true;
    g.add(slab);
  }

  // Orange traffic cones — silhouette above the pavement
  const coneMat = new THREE.MeshStandardMaterial({
    color: "#f25c12",
    roughness: 0.42,
    emissive: "#7a2200",
    emissiveIntensity: 0.22,
  });
  const stripeMat = new THREE.MeshStandardMaterial({
    color: "#fff8ee",
    roughness: 0.38,
  });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.55;
    const cx = Math.cos(a) * 2.85;
    const cz = Math.sin(a) * 2.85;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.82, 8), coneMat);
    cone.position.set(cx, 0.48, cz);
    cone.castShadow = true;
    g.add(cone);
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.09, 8), stripeMat);
    stripe.position.set(cx, 0.36, cz);
    g.add(stripe);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.42), coneMat);
    base.position.set(cx, 0.07, cz);
    g.add(base);
  }

  return g;
}

function buildHazardMesh(
  h: HazardInstance
): { root: THREE.Group; isSprite: boolean; sprite?: THREE.Sprite } {
  if (h.type === "golf-ball") {
    return { root: buildGolfBallHazard(), isSprite: false };
  }
  if (h.type === "palm-frond") {
    return { root: buildPalmFrondHazard(), isSprite: false };
  }
  if (h.type === "sinkhole") {
    return { root: buildSinkholeHazard(), isSprite: false };
  }

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
    return { root: g, isSprite: true, sprite };
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

/**
 * Keep hazard art facing the direction of travel on screen.
 *
 * Side-view art is drawn facing texture-right (snout/nose/head to the right).
 * When the hazard moves toward camera-right, leave it unflipped; when it moves
 * toward camera-left, mirror it. Hysteresis stops flicker when motion is mostly
 * toward/away from the camera (turtles/cops along the road).
 *
 * faceSign: +1 = move appears camera-right on screen, −1 = camera-left.
 */
const _hazCamRight = new THREE.Vector3();
const _hazCamVel = new THREE.Vector3();
const _hazInvCam = new THREE.Quaternion();

function updateHazardFaceSign(h: HazardInstance, camera: THREE.Camera) {
  const spd = Math.hypot(h.vx, h.vy);
  // World velocity on the ground plane (game x/y → Three x/z)
  const wx = spd > 0.12 ? h.vx : Math.cos(h.angle);
  const wz = spd > 0.12 ? h.vy : Math.sin(h.angle);

  // Velocity in camera space: +X = toward the right edge of the screen
  _hazInvCam.copy(camera.quaternion).invert();
  _hazCamVel.set(wx, 0, wz).applyQuaternion(_hazInvCam);

  // Also use camera-right · world-vel as a backup signal
  _hazCamRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
  _hazCamRight.y = 0;
  if (_hazCamRight.lengthSq() > 1e-6) _hazCamRight.normalize();
  const alongRight = wx * _hazCamRight.x + wz * _hazCamRight.z;

  // Prefer camera-local X (true screen left/right); fall back to alongRight
  const screenX =
    Math.abs(_hazCamVel.x) > 0.08 ? _hazCamVel.x : alongRight;

  // Hysteresis: only flip when clearly going the other way
  const dead = 0.18;
  if (screenX > dead) h.faceSign = 1;
  else if (screenX < -dead) h.faceSign = -1;
  // else keep previous faceSign
}

type DeckMats = {
  thickX: number;
  girderH: number;
  steel: THREE.MeshStandardMaterial;
  railMat: THREE.MeshStandardMaterial;
  deckMat: THREE.MeshStandardMaterial;
  asphalt: THREE.MeshStandardMaterial;
  sidewalk: THREE.MeshStandardMaterial;
};

/** Smoothstep so ramps meet the flat span with zero slope (no kink / gap). */
function overpassEase(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function overpassStations(
  halfLen: number,
  centerHalf: number,
  deckY: number,
  groundY: number,
): { z: number; y: number }[] {
  const rampSegs = 12;
  const rampLen = halfLen - centerHalf;
  const stations: { z: number; y: number }[] = [];
  for (let i = 0; i <= rampSegs; i++) {
    const t = i / rampSegs;
    stations.push({
      z: -halfLen + t * rampLen,
      y: groundY + (deckY - groundY) * overpassEase(t),
    });
  }
  stations.push({ z: centerHalf, y: deckY });
  for (let i = 1; i <= rampSegs; i++) {
    const t = i / rampSegs;
    stations.push({
      z: centerHalf + t * rampLen,
      y: groundY + (deckY - groundY) * overpassEase(1 - t),
    });
  }
  return stations;
}

/** Constant-width box strip whose centerline follows stations in Z/Y. */
function addProfileBoxStrip(
  parent: THREE.Group,
  stations: { z: number; y: number }[],
  halfW: number,
  halfH: number,
  material: THREE.Material,
  xMid = 0,
): void {
  if (stations.length < 2) return;
  const pos: number[] = [];
  const idx: number[] = [];
  for (const s of stations) {
    const yT = s.y + halfH;
    const yB = s.y - halfH;
    pos.push(xMid - halfW, yT, s.z);
    pos.push(xMid + halfW, yT, s.z);
    pos.push(xMid + halfW, yB, s.z);
    pos.push(xMid - halfW, yB, s.z);
  }
  for (let i = 0; i < stations.length - 1; i++) {
    const a = i * 4;
    const b = a + 4;
    idx.push(a, b, b + 1, a, b + 1, a + 1);
    idx.push(a + 3, a + 2, b + 2, a + 3, b + 2, b + 3);
    idx.push(a + 1, b + 1, b + 2, a + 1, b + 2, a + 2);
    idx.push(a, a + 3, b + 3, a, b + 3, b);
  }
  idx.push(0, 1, 2, 0, 2, 3);
  const last = (stations.length - 1) * 4;
  idx.push(last, last + 3, last + 2, last, last + 2, last + 1);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}

/**
 * One continuous overpass: flat over the cart path, then eases down and
 * runs off both sides of the screen. No separate ramp boxes — those left
 * a wedge of sky at each join.
 */
function addOverpassHighway(
  parent: THREE.Group,
  opts: DeckMats & {
    halfLen: number;
    centerHalf: number;
    deckY: number;
    groundY: number;
    towerCream: string;
  },
) {
  const stations = overpassStations(
    opts.halfLen,
    opts.centerHalf,
    opts.deckY,
    opts.groundY,
  );
  const deckHalfH = 0.21;
  addProfileBoxStrip(parent, stations, opts.thickX * 0.5, deckHalfH, opts.deckMat);
  addProfileBoxStrip(
    parent,
    stations.map((s) => ({ z: s.z, y: s.y + 0.24 })),
    3.8,
    0.04,
    opts.asphalt,
  );
  for (const side of [-1, 1] as const) {
    addProfileBoxStrip(
      parent,
      stations.map((s) => ({ z: s.z, y: s.y + 0.26 })),
      1.6,
      0.05,
      opts.sidewalk,
      side * 6.2,
    );
    const railX = side * (opts.thickX * 0.5 - 0.16);
    addProfileBoxStrip(
      parent,
      stations.map((s) => ({ z: s.z, y: s.y + 1.18 })),
      0.06,
      0.06,
      opts.railMat,
      railX,
    );
    addProfileBoxStrip(
      parent,
      stations.map((s) => ({ z: s.z, y: s.y + 0.72 })),
      0.04,
      0.04,
      opts.railMat,
      railX,
    );
    for (let i = 0; i < stations.length; i += 2) {
      const s = stations[i];
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.18, 0.12), opts.railMat);
      post.position.set(railX, s.y + 0.78, s.z);
      parent.add(post);
    }
    addProfileBoxStrip(
      parent,
      stations.map((s) => ({
        z: s.z,
        y: s.y - deckHalfH - opts.girderH * 0.5 - 0.08,
      })),
      0.42,
      opts.girderH * 0.5,
      opts.steel,
      side * (opts.thickX * 0.5 - 1.2),
    );
  }

  for (let i = 2; i < stations.length - 2; i += 3) {
    const s = stations[i];
    if (Math.abs(s.z) < opts.centerHalf - 0.5) continue;
    const h = Math.max(1.2, s.y + 0.2);
    for (const side of [-1, 1] as const) {
      const pier = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, h, 2.8),
        mat(opts.towerCream, 0.9, 0.08),
      );
      pier.position.set(side * (opts.thickX * 0.5 - 1.4), h / 2, s.z);
      pier.castShadow = true;
      parent.add(pier);
    }
  }
}

/** Rust-red bowstring arch in the YZ plane (spans left–right across the cart path). */
function addArchedTrussAlongZ(
  parent: THREE.Group,
  z0: number,
  z1: number,
  x: number,
  yBase: number,
  archH: number,
  rust: THREE.MeshStandardMaterial,
  rustDark: THREE.MeshStandardMaterial,
) {
  const span = z1 - z0;
  const segs = 12;
  const pts: { z: number; y: number }[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    pts.push({
      z: z0 + t * span,
      y: yBase + 4 * archH * t * (1 - t),
    });
  }
  for (let i = 0; i < segs; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dz = b.z - a.z;
    const dy = b.y - a.y;
    const len = Math.hypot(dz, dy);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, len), rust);
    beam.position.set(x, (a.y + b.y) / 2, (a.z + b.z) / 2);
    beam.rotation.x = -Math.atan2(dy, dz);
    beam.castShadow = true;
    parent.add(beam);
  }
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, span), rust);
  bottom.position.set(x, yBase, (z0 + z1) / 2);
  bottom.castShadow = true;
  parent.add(bottom);
  for (let i = 1; i < segs; i++) {
    const h = pts[i].y - yBase;
    const v = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, Math.max(0.2, h), 0.16),
      i % 2 === 0 ? rust : rustDark,
    );
    v.position.set(x, yBase + h / 2, pts[i].z);
    parent.add(v);
  }
  for (let i = 0; i < segs; i++) {
    const a = { z: pts[i].z, y: yBase };
    const b = pts[i + 1];
    const dz = b.z - a.z;
    const dy = b.y - a.y;
    const len = Math.hypot(dz, dy);
    const diag = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, len), rustDark);
    diag.position.set(x, (a.y + b.y) / 2, (a.z + b.z) / 2);
    diag.rotation.x = -Math.atan2(dy, dz);
    parent.add(diag);
  }
}

/** Teal script lettering from the real Villages overpass — always bright, no plaque. */
function makeVillagesScriptSign(): THREE.Mesh {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 2048, 512);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "italic 800 248px Georgia, 'Palatino Linotype', 'Times New Roman', serif";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  ctx.strokeStyle = "#0f3d38";
  ctx.lineWidth = 16;
  ctx.strokeText("The Villages", 1024, 268);
  ctx.fillStyle = "#2ea892";
  ctx.fillText("The Villages", 1024, 268);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(24, 6),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthTest: true,
      side: THREE.DoubleSide,
    }),
  );
}

function wrapPlaqueLines(text: string): string[] {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) return [text];
  if (text.length <= 14) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

/** Cream village plaque — MeshBasic so the name stays readable in shadow. */
function makeGatePlaqueMesh(text: string): THREE.Mesh {
  const lines = wrapPlaqueLines(text);
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f7f1e6";
  ctx.fillRect(0, 0, 1024, 320);
  ctx.strokeStyle = "#8a7048";
  ctx.lineWidth = 16;
  ctx.strokeRect(10, 10, 1004, 300);
  ctx.fillStyle = "#1c2430";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = lines.length > 1 ? 78 : 92;
  const fits = () => Math.max(...lines.map((line) => ctx.measureText(line).width)) <= 900;
  ctx.font = `800 ${size}px "DM Sans", system-ui, sans-serif`;
  while (size > 40 && !fits()) {
    size -= 4;
    ctx.font = `800 ${size}px "DM Sans", system-ui, sans-serif`;
  }
  const lineH = size + 10;
  const startY = 160 - ((lines.length - 1) * lineH) / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 512, startY + i * lineH);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const h = lines.length > 1 ? 1.05 : 0.86;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(3.35, h),
    new THREE.MeshBasicMaterial({
      map: tex,
      toneMapped: false,
      depthTest: true,
    }),
  );
}

function makeTextSprite(text: string, fg: string, bg: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 128);
  if (bg !== "transparent") {
    ctx.fillStyle = bg;
    roundRect(ctx, 8, 16, 496, 96, 24);
    ctx.fill();
  }
  ctx.fillStyle = fg;
  ctx.font = "bold 48px DM Sans, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const matSprite = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: true,
  });
  return new THREE.Sprite(matSprite);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Overhead track map — you + rivals + town squares */
export function drawMiniMap(
  ctx: CanvasRenderingContext2D,
  racers: Racer[],
  samples: RoadSample[],
  hazards: HazardInstance[]
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Soft vignette background
  const bg = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
  bg.addColorStop(0, "#1a5a3c");
  bg.addColorStop(1, "#0c2e20");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Zoom the mini-map to the active loop (not the whole Villages) so the path is clear
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < samples.length; i += 3) {
    const s = samples[i];
    minX = Math.min(minX, s.x);
    maxX = Math.max(maxX, s.x);
    minY = Math.min(minY, s.y);
    maxY = Math.max(maxY, s.y);
  }
  if (!Number.isFinite(minX)) {
    minX = WORLD.minX;
    maxX = WORLD.maxX;
    minY = WORLD.minY;
    maxY = WORLD.maxY;
  }
  const pad = 28;
  minX -= pad;
  maxX += pad;
  minY -= pad;
  maxY += pad;
  const worldW = Math.max(40, maxX - minX);
  const worldH = Math.max(40, maxY - minY);
  const scale = Math.min(w / worldW, h / worldH) * 0.92;
  const ox = (w - worldW * scale) / 2;
  const oy = (h - worldH * scale) / 2;
  const toX = (x: number) => ox + (x - minX) * scale;
  const toY = (y: number) => h - (oy + (y - minY) * scale);

  // Grass wash
  ctx.fillStyle = "rgba(61, 155, 95, 0.35)";
  ctx.fillRect(0, 0, w, h);

  // Track ribbon — thick asphalt + yellow center for readability
  ctx.strokeStyle = "rgba(70, 76, 88, 0.98)";
  ctx.lineWidth = 9;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i < samples.length; i += 2) {
    const s = samples[i];
    if (i === 0) ctx.moveTo(toX(s.x), toY(s.y));
    else ctx.lineTo(toX(s.x), toY(s.y));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "rgba(245, 208, 64, 0.9)";
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Start marker
  if (samples[0]) {
    const s0 = samples[0];
    ctx.fillStyle = "#e85d4c";
    ctx.beginPath();
    ctx.arc(toX(s0.x), toY(s0.y), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("S", toX(s0.x), toY(s0.y) + 3);
  }

  // Town squares near this loop
  for (const lm of LANDMARKS) {
    if (lm.kind !== "town-square") continue;
    if (lm.x < minX - 40 || lm.x > maxX + 40 || lm.y < minY - 40 || lm.y > maxY + 40) continue;
    ctx.fillStyle = theme.gold;
    ctx.beginPath();
    ctx.arc(toX(lm.x), toY(lm.y), 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 7px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(lm.shortName.slice(0, 10), toX(lm.x), toY(lm.y) - 6);
  }

  // Hazards (tiny)
  for (const hz of hazards) {
    if (!hz.active) continue;
    ctx.fillStyle = "rgba(232, 93, 76, 0.85)";
    ctx.beginPath();
    ctx.arc(toX(hz.x), toY(hz.y), 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Racers — AI first so player draws on top
  const sorted = [...racers].sort((a, b) => (a.isPlayer ? 1 : 0) - (b.isPlayer ? 1 : 0));
  for (const r of sorted) {
    const px = toX(r.x);
    const py = toY(r.y);
    if (r.isPlayer) {
      // Heading wedge
      ctx.save();
      ctx.translate(px, py);
      // screen Y is flipped vs world north; angle 0 = +X east
      ctx.rotate(-r.angle);
      ctx.fillStyle = theme.gold;
      ctx.beginPath();
      ctx.moveTo(7, 0);
      ctx.lineTo(-5, 4.5);
      ctx.lineTo(-5, -4.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#1c2430";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("YOU", px, py + 12);
    } else {
      ctx.fillStyle = r.cart.color;
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
