import { getCart, type CartDef, type CartId, CARTS } from "./data/carts";
import {
  getDriver,
  randomDriverExcluding,
  type DriverDef,
  type DriverId,
} from "./data/drivers";
import { HAZARD_DEFS, type HazardInstance, type HazardType } from "./data/hazards";
import { LANDMARKS, WORLD } from "./data/landmarks";
import type { AreaId } from "./data/areas";
import { getDriveArea } from "./data/areas";
import {
  getDifficulty,
  type DifficultyDef,
  type DifficultyId,
} from "./data/difficulty";
import {
  LAPS_TO_WIN,
  ROAD_CLEAR_BUILDING,
  ROAD_HALF_WIDTH,
  TRACK_GATES,
  TRACK_ROUNDABOUTS,
  GATE_HOLD_SEC,
  GATE_LOWER_SEC,
  GATE_OPEN_BLOCK,
  GATE_RAISE_SEC,
  GATE_WAVE_RANGE,
  buildDecor,
  buildRoadSamples,
  gateOpenAmount,
  generateAndActivateTrack,
  nearestRoadPoint,
  nearestRoadPointContinuous,
  startPose,
  trackLength,
  type DecorBlob,
  type RoadSample,
} from "./data/track";
import type { Input } from "./input";
import { getControlSettings } from "./settings";
import { sfx } from "./sfx";

export type ProjectileKind = "golf-ball" | "fireball" | "loofah" | "bolt";

export type Projectile = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  kind: ProjectileKind;
  ownerId: string;
  radius: number;
  spin: number;
};

export type AmmoPickup = {
  id: number;
  x: number;
  y: number;
  kind: ProjectileKind;
  active: boolean;
  /** Bob phase for animation */
  phase: number;
  /** Seconds until pad returns after pickup (0 = ready) */
  respawnIn: number;
};

export type SolidObstacle = {
  id: number;
  x: number;
  y: number;
  radius: number;
  kind: "house" | "landmark" | "prop" | "gate" | "island";
  destroyed: boolean;
  /** Links gate solids to TRACK_GATES index for open/close updates */
  gateIndex?: number;
};

export const MAX_AMMO = 8;
export const AMMO_PICKUP_AMOUNT = 3;

export type Racer = {
  id: string;
  name: string;
  isPlayer: boolean;
  cart: CartDef;
  driver: DriverDef;
  x: number;
  y: number;
  angle: number;
  speed: number;
  steerVel: number;
  lapProgress: number;
  lap: number;
  place: number;
  finished: boolean;
  finishTime: number;
  roadIndex: number;
  effectTimer: number;
  effectSpeedMul: number;
  score: number;
  hazardsHit: number;
  hazardsDodged: number;
  checkpoints: Set<string>;
  aiTargetIndex: number;
  aiSkill: number;
  fireCooldown: number;
  /** Shots remaining (cart-specific ammo type) */
  ammo: number;
  inWater: boolean;
  offRoad: boolean;
  /** >0 while spinning out from a projectile hit */
  spinOutTimer: number;
  /** Angular velocity (rad/s) during spin-out */
  spinVel: number;
  /** Seconds left in the gate-pass wave animation */
  waveTimer: number;
  /** Seconds left stuck in a sinkhole (no drive) */
  trapTimer: number;
  /** Sinkhole id just escaped — ignore until the cart drives clear */
  trapIgnoreId: number;
};

export type RaceConfig = {
  playerName: string;
  cartId: CartId;
  driverId: DriverId;
  areaId: AreaId;
  difficultyId: DifficultyId;
};

export type RaceEvent = {
  kind: "banner" | "toast" | "checkpoint" | "finish" | "hazard-warn";
  text: string;
  sub?: string;
  ttl: number;
};

export type RaceResult = {
  racers: Racer[];
  player: Racer;
  timeSec: number;
  score: number;
  areaName: string;
};

export function projectileForCart(cartId: CartId): ProjectileKind {
  if (cartId === "hotrod") return "fireball";
  if (cartId === "evolution") return "loofah";
  if (cartId === "cybertruck") return "bolt";
  return "golf-ball";
}

export function projectileLabel(kind: ProjectileKind): string {
  if (kind === "fireball") return "Fireball";
  if (kind === "loofah") return "Loofah";
  if (kind === "bolt") return "Lightning";
  return "Golf ball";
}

export function projectileEmoji(kind: ProjectileKind): string {
  if (kind === "fireball") return "🔥";
  if (kind === "loofah") return "🧽";
  if (kind === "bolt") return "⚡";
  return "⛳";
}

export class Race {
  samples: RoadSample[];
  decor: DecorBlob[];
  solids: SolidObstacle[] = [];
  ponds: { x: number; y: number; r: number }[] = [];
  ammoPickups: AmmoPickup[] = [];
  totalLen: number;
  racers: Racer[] = [];
  hazards: HazardInstance[] = [];
  projectiles: Projectile[] = [];
  events: RaceEvent[] = [];
  time = 0;
  countdown = 3.6;
  running = false;
  finished = false;
  hazardId = 1;
  solidId = 1;
  projId = 1;
  pickupId = 1;
  spawnTimer = 0;
  nearbyLandmark: string | null = null;
  upcomingHazard: string | null = null;
  /** For UI: which ammo the player shoots */
  playerAmmo: ProjectileKind;
  areaId: AreaId;
  areaName: string;
  difficulty: DifficultyDef;
  justWentGreen = false;
  private gateHintCool = 0;
  /** Seconds the player has been driving against traffic */
  private wrongWaySec = 0;
  /** True after ~5s of wrong-way driving — HUD flashes WRONG WAY */
  wrongWayAlert = false;

  constructor(private config: RaceConfig) {
    // Fresh random loop inside the chosen themed Town Square area
    const seed = (Date.now() ^ (Math.random() * 0x7fffffff)) >>> 0;
    this.areaId = config.areaId;
    this.difficulty = getDifficulty(config.difficultyId);
    const area = getDriveArea(config.areaId);
    this.areaName = area.shortName;
    generateAndActivateTrack(config.areaId, seed);
    this.samples = buildRoadSamples(5);
    this.decor = buildDecor(seed ^ 0x9e3779b9);
    this.totalLen = trackLength(this.samples);
    this.playerAmmo = projectileForCart(config.cartId);
    this.ponds = this.decor
      .filter((d) => d.kind === "pond")
      .map((d) => ({ x: d.x, y: d.y, r: d.r }));
    this.buildSolids();
    this.spawnAmmoPickups();
    this.spawnRacers();
    // More obstacles at start
    for (let i = 0; i < 6; i++) {
      this.spawnHazardAhead(70 + i * 55, i % 2 === 0);
    }
    this.spawnTimer = 2.2;
  }

  private spawnAmmoPickups() {
    const kinds: ProjectileKind[] = ["golf-ball", "fireball", "loofah", "bolt"];
    // Place pickups along the track — each kind gets its own pads
    let ki = 0;
    for (let i = 12; i < this.samples.length; i += 28) {
      const s = this.samples[i];
      const nx = Math.cos(s.angle + Math.PI / 2);
      const ny = Math.sin(s.angle + Math.PI / 2);
      const side = (Math.floor(i / 28) % 2 === 0 ? 1 : -1) * 2.2;
      const kind = kinds[ki % kinds.length];
      ki++;
      this.ammoPickups.push({
        id: this.pickupId++,
        x: s.x + nx * side,
        y: s.y + ny * side,
        kind,
        active: true,
        phase: Math.random() * Math.PI * 2,
        respawnIn: 0,
      });
    }
  }

  private buildSolids() {
    /**
     * Keep solid radii modest and well off the asphalt.
     * Huge landmark colliders were flinging the player (felt like a “reset”).
     */
    for (const d of this.decor) {
      if (d.kind === "houses") {
        // Only houses clearly off the road
        const near = nearestRoadPoint(this.samples, d.x, d.y);
        if (near.distToRoad < ROAD_HALF_WIDTH + 8) continue;
        this.solids.push({
          id: this.solidId++,
          x: d.x,
          y: d.y,
          radius: Math.max(2.4, Math.min(3.8, d.r * 0.22)),
          kind: "house",
          destroyed: false,
        });
      } else if (d.kind === "palm-grove") {
        const near = nearestRoadPoint(this.samples, d.x, d.y);
        if (near.distToRoad < ROAD_HALF_WIDTH + 5) continue;
        this.solids.push({
          id: this.solidId++,
          x: d.x,
          y: d.y,
          radius: 1.6,
          kind: "prop",
          destroyed: false,
        });
      }
    }
    // Landmarks: small cores only, never covering the road
    for (const lm of LANDMARKS) {
      const near = nearestRoadPoint(this.samples, lm.x, lm.y);
      if (near.distToRoad < ROAD_HALF_WIDTH + 6) continue;
      const r = lm.kind === "town-square" ? 5.5 : lm.kind === "rec-center" ? 4.5 : 2.5;
      this.solids.push({
        id: this.solidId++,
        x: lm.x,
        y: lm.y,
        radius: r,
        kind: "landmark",
        destroyed: false,
      });
    }
    // Roundabout landscaped islands — block cutting the circle
    for (const r of TRACK_ROUNDABOUTS) {
      this.solids.push({
        id: this.solidId++,
        x: r.x,
        y: r.y,
        radius: Math.max(3.5, r.islandRadius * 0.92),
        kind: "island",
        destroyed: false,
      });
    }

    // Community gate arms — start closed (blocking) until they raise
    for (let gi = 0; gi < TRACK_GATES.length; gi++) {
      const g = TRACK_GATES[gi];
      this.solids.push({
        id: this.solidId++,
        x: g.x,
        y: g.y,
        radius: ROAD_HALF_WIDTH * 0.92,
        kind: "gate",
        destroyed: false,
        gateIndex: gi,
      });
    }
  }

  private spawnRacers() {
    const playerCart = getCart(this.config.cartId);
    const playerDriver = getDriver(this.config.driverId);
    const usedDrivers: DriverId[] = [playerDriver.id];
    const displayName =
      (this.config.playerName || "").trim().slice(0, 20) || "Racer";

    const startIdx = Math.min(5, Math.max(0, this.samples.length - 1));
    const startProg =
      this.totalLen > 0
        ? Math.min(0.2, this.samples[startIdx].dist / this.totalLen)
        : 0;
    const playerPose = startPose(this.samples, 1);
    this.racers.push({
      id: "player",
      name: displayName,
      isPlayer: true,
      cart: playerCart,
      driver: playerDriver,
      x: playerPose.x,
      y: playerPose.y,
      angle: playerPose.angle,
      speed: 0,
      steerVel: 0,
      lapProgress: startProg,
      lap: 0,
      place: 1,
      finished: false,
      finishTime: 0,
      roadIndex: startIdx,
      effectTimer: 0,
      effectSpeedMul: 1,
      score: 0,
      hazardsHit: 0,
      hazardsDodged: 0,
      checkpoints: new Set(),
      aiTargetIndex: 0,
      aiSkill: 1,
      fireCooldown: 0,
      ammo: MAX_AMMO,
      inWater: false,
      offRoad: false,
      spinOutTimer: 0,
      spinVel: 0,
      waveTimer: 0,
      trapTimer: 0,
      trapIgnoreId: 0,
    });

    // 4 rivals scaled by selected Villages difficulty
    const diff = this.difficulty;
    for (let i = 0; i < 4; i++) {
      const cart = CARTS[i % CARTS.length];
      const driver = randomDriverExcluding(usedDrivers);
      usedDrivers.push(driver.id);
      const pose = startPose(this.samples, i === 0 ? 0 : i + 1);
      const skillSpan = diff.aiSkillMax - diff.aiSkillMin;
      this.racers.push({
        id: `ai-${i}`,
        name: driver.name,
        isPlayer: false,
        cart,
        driver,
        x: pose.x,
        y: pose.y,
        angle: pose.angle,
        speed: 0,
        steerVel: 0,
        lapProgress: startProg,
        lap: 0,
        place: i + 2,
        finished: false,
        finishTime: 0,
        roadIndex: startIdx,
        effectTimer: 0,
        effectSpeedMul: 1,
        score: 0,
        hazardsHit: 0,
        hazardsDodged: 0,
        checkpoints: new Set(),
        aiTargetIndex: 4 + i * 3,
        aiSkill: diff.aiSkillMin + Math.random() * skillSpan,
        fireCooldown: 1 + Math.random() * 2,
        ammo: MAX_AMMO,
        inWater: false,
        offRoad: false,
        spinOutTimer: 0,
        spinVel: 0,
        waveTimer: 0,
        trapTimer: 0,
        trapIgnoreId: 0,
      });
    }
  }

  update(dt: number, input: Input) {
    for (const e of this.events) e.ttl -= dt;
    this.events = this.events.filter((e) => e.ttl > 0);

    if (this.finished) return;

    if (this.countdown > 0) {
      const prev = Math.ceil(this.countdown);
      this.countdown -= dt;
      const next = Math.ceil(this.countdown);
      if (next !== prev && next > 0) {
        this.pushEvent("banner", String(next), undefined, 0.9);
        sfx.countdown(next);
      }
      if (this.countdown <= 0) {
        this.running = true;
        this.justWentGreen = true;
        sfx.go();
        this.pushEvent(
          "banner",
          "GO!",
          `${this.areaName} · ${projectileLabel(this.playerAmmo)}s · Space`,
          1.8
        );
      }
      this.updateNearbyLandmark();
      this.updateHazardWarn();
      return;
    }

    this.time += dt;
    this.updateCommunityGates(dt);
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnHazardAhead(80 + Math.random() * 120, Math.random() > 0.4);
      // Occasional second hazard — but less often so circles stay readable
      if (Math.random() < 0.28) {
        this.spawnHazardAhead(140 + Math.random() * 80, false);
      }
      this.spawnTimer = 2.8 + Math.random() * 2.6;
    }

    this.updateHazards(dt);
    this.updateProjectiles(dt);
    this.updateAmmoPickups(dt);

    for (const r of this.racers) {
      if (r.finished) continue;
      if (r.fireCooldown > 0) r.fireCooldown -= dt;
      if (r.waveTimer > 0) r.waveTimer -= dt;
      this.updateTerrainFlags(r);
      if (r.isPlayer) {
        this.drivePlayer(r, dt, input);
        if (input.consumeGatePass() || (input.state.gate && r.waveTimer <= 0)) {
          this.playerWaveGatePass(r);
        }
        if (input.consumeFire() || (input.state.fire && r.fireCooldown <= 0)) {
          this.tryFire(r);
        }
      } else {
        this.driveAI(r, dt);
        if (r.fireCooldown <= 0 && r.ammo > 0 && Math.random() < 0.01) this.tryFire(r);
      }
      this.applyMotion(r, dt);
      this.resolveSolidCollisions(r);
      this.collectAmmo(r);
    }

    this.resolveCartCollisions();

    for (const r of this.racers) {
      if (r.finished) continue;
      this.updateProgress(r, dt);
      this.checkCheckpoints(r);
      this.checkHazardHits(r);
    }

    this.updatePlaces();
    this.checkRaceOver();
    this.updateNearbyLandmark();
    this.updateHazardWarn();
  }

  stopEarly() {
    if (this.finished) return;
    const player = this.getPlayer();
    if (!player.finished) {
      player.finished = true;
      player.finishTime = this.time;
      player.speed = 0;
    }
    this.finished = true;
    this.running = false;
    this.finalizeScores();
    player.score = Math.round(Math.max(0, player.score * 0.85));
    this.pushEvent("banner", "Race stopped", "Saved to results", 2);
  }

  private updateCommunityGates(dt: number) {
    for (const g of TRACK_GATES) {
      if (g.hold > 0) {
        g.hold -= dt;
        g.open = Math.min(1, (g.open ?? 0) + dt / GATE_RAISE_SEC);
      } else {
        g.open = Math.max(0, (g.open ?? 0) - dt / GATE_LOWER_SEC);
      }
    }
    if (this.gateHintCool > 0) this.gateHintCool -= dt;
    const player = this.getPlayer();
    if (player && !player.finished) this.maybeHintGatePass(player);
  }

  private nearestWaveableGate(r: Racer): { site: (typeof TRACK_GATES)[number]; dist: number } | null {
    let best: { site: (typeof TRACK_GATES)[number]; dist: number } | null = null;
    const fx = Math.cos(r.angle);
    const fy = Math.sin(r.angle);
    for (const g of TRACK_GATES) {
      const dx = g.x - r.x;
      const dy = g.y - r.y;
      const dist = Math.hypot(dx, dy);
      if (dist > GATE_WAVE_RANGE + 4) continue;
      const ahead = dx * fx + dy * fy;
      if (ahead < -3) continue;
      if (!best || dist < best.dist) best = { site: g, dist };
    }
    return best;
  }

  private playerWaveGatePass(r: Racer) {
    r.waveTimer = 1.15;
    const near = this.nearestWaveableGate(r);
    if (!near || near.dist > GATE_WAVE_RANGE) {
      sfx.gateMiss();
      this.pushEvent("toast", "Too far from the post", "Get next to the gate and wave", 1.5);
      return;
    }
    near.site.hold = GATE_HOLD_SEC;
    sfx.gatePass();
    this.pushEvent("toast", "Gate pass!", near.site.label, 1.3);
  }

  private maybeHintGatePass(r: Racer) {
    if (this.gateHintCool > 0 || r.waveTimer > 0) return;
    const near = this.nearestWaveableGate(r);
    if (!near || near.dist > GATE_WAVE_RANGE || gateOpenAmount(near.site) >= GATE_OPEN_BLOCK) {
      return;
    }
    this.gateHintCool = 3.2;
    this.pushEvent("toast", "Wave your gate pass", "G or the Pass button", 1.8);
  }

  private updateTerrainFlags(r: Racer) {
    const near = nearestRoadPoint(this.samples, r.x, r.y);
    r.offRoad = near.distToRoad >= ROAD_HALF_WIDTH + 1.2;
    r.inWater = false;
    for (const p of this.ponds) {
      if (Math.hypot(r.x - p.x, r.y - p.y) < p.r * 0.92) {
        r.inWater = true;
        break;
      }
    }
  }

  private tryFire(r: Racer) {
    if (r.fireCooldown > 0 || r.finished || r.trapTimer > 0) return;
    if (r.ammo <= 0) {
      if (r.isPlayer) {
        sfx.empty();
        this.pushEvent(
          "toast",
          "Out of ammo!",
          r.cart.id === "cybertruck" ? "Drive through a lightning storm" : "Drive over a recharge pad",
          1.4
        );
      }
      r.fireCooldown = 0.4;
      return;
    }
    const kind = projectileForCart(r.cart.id);
    // Fast enough to catch carts / hazards ahead at race pace
    const speed = kind === "fireball" ? 92 : kind === "bolt" ? 96 : kind === "loofah" ? 78 : 88;
    const muzzle = r.cart.id === "cybertruck" ? 3.15 : 2.6;
    this.projectiles.push({
      id: this.projId++,
      x: r.x + Math.cos(r.angle) * muzzle,
      y: r.y + Math.sin(r.angle) * muzzle,
      vx: Math.cos(r.angle) * speed,
      vy: Math.sin(r.angle) * speed,
      life: 2.2,
      kind,
      ownerId: r.id,
      radius: kind === "loofah" ? 1.15 : kind === "fireball" ? 1.05 : kind === "bolt" ? 1.25 : 0.75,
      spin: kind === "bolt" ? 0 : (Math.random() - 0.5) * 14,
    });
    r.ammo -= 1;
    r.fireCooldown = kind === "fireball" ? 0.55 : kind === "loofah" ? 0.7 : kind === "bolt" ? 0.52 : 0.48;
    if (r.isPlayer) sfx.fire(kind);
  }

  private updateAmmoPickups(dt: number) {
    for (const pad of this.ammoPickups) {
      pad.phase += dt * 3;
      if (!pad.active && pad.respawnIn > 0) {
        pad.respawnIn -= dt;
        if (pad.respawnIn <= 0) {
          pad.active = true;
          pad.respawnIn = 0;
        }
      }
    }
  }

  private collectAmmo(r: Racer) {
    const want = projectileForCart(r.cart.id);
    for (const pad of this.ammoPickups) {
      if (!pad.active || pad.kind !== want) continue;
      if (Math.hypot(pad.x - r.x, pad.y - r.y) < 2.8) {
        if (r.ammo >= MAX_AMMO) continue;
        const before = r.ammo;
        r.ammo = Math.min(MAX_AMMO, r.ammo + AMMO_PICKUP_AMOUNT);
        pad.active = false;
        pad.respawnIn = 12;
        if (r.isPlayer) {
          sfx.pickup();
          this.pushEvent(
            "toast",
            `${projectileEmoji(want)} Ammo recharged!`,
            `${before} → ${r.ammo} ${projectileLabel(want)}s`,
            1.5
          );
        }
      }
    }
  }

  private updateProjectiles(dt: number) {
    for (const p of this.projectiles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.spin += dt * (p.kind === "golf-ball" ? 18 : p.kind === "loofah" ? 10 : 6);

      // Hit hazards
      for (const h of this.hazards) {
        if (!h.active) continue;
        if (Math.hypot(h.x - p.x, h.y - p.y) < p.radius + HAZARD_DEFS[h.type].radius) {
          h.active = false;
          p.life = 0;
          const owner = this.racers.find((r) => r.id === p.ownerId);
          if (owner?.isPlayer) {
            owner.score += 90;
            owner.hazardsDodged += 1;
            sfx.tagged();
            this.pushEvent(
              "toast",
              `${projectileLabel(p.kind)} hit!`,
              `+90 · ${HAZARD_DEFS[h.type].name} cleared`,
              1.4
            );
          }
          break;
        }
      }
      if (p.life <= 0) continue;

      // Obliterate solid obstacles (houses / props — not landmarks, gates, or islands)
      for (const s of this.solids) {
        if (s.destroyed || s.kind === "landmark" || s.kind === "gate" || s.kind === "island") {
          continue;
        }
        if (Math.hypot(s.x - p.x, s.y - p.y) < p.radius + s.radius) {
          s.destroyed = true;
          p.life = 0;
          const owner = this.racers.find((r) => r.id === p.ownerId);
          if (owner?.isPlayer) {
            owner.score += 60;
            sfx.smash();
            this.pushEvent("toast", "Obstacle obliterated!", `+60 · ${projectileLabel(p.kind)}`, 1.3);
          }
          break;
        }
      }
      if (p.life <= 0) continue;

      // Soft hit on other racers — spin-out!
      for (const r of this.racers) {
        if (r.id === p.ownerId || r.finished) continue;
        if (Math.hypot(r.x - p.x, r.y - p.y) < p.radius + 1.5) {
          this.applySpinOut(r, p.kind);
          p.life = 0;
          const owner = this.racers.find((o) => o.id === p.ownerId);
          if (owner?.isPlayer) {
            owner.score += 40;
            sfx.tagged();
            this.pushEvent("toast", "Rival tagged!", `+40 · ${projectileLabel(p.kind)}`, 1.2);
          } else if (r.isPlayer) {
            sfx.spinOut();
            this.pushEvent("toast", "Spin out!", `${projectileLabel(p.kind)} from a rival`, 1.4);
          }
          break;
        }
      }
    }
    this.projectiles = this.projectiles.filter((p) => p.life > 0);
  }

  private resolveSolidCollisions(r: Racer) {
    const cartR = 1.35;
    const road = nearestRoadPoint(this.samples, r.x, r.y);
    const onRoad = road.distToRoad < ROAD_HALF_WIDTH + 1.2;

    for (const s of this.solids) {
      if (s.destroyed) continue;
      // Community gate arm: only blocks while lowered
      if (s.kind === "gate") {
        if (s.gateIndex == null) continue;
        const g = TRACK_GATES[s.gateIndex];
        if (!g || gateOpenAmount(g) >= GATE_OPEN_BLOCK) continue;
      }
      // Gates + roundabout islands always collide (they're on the road itself)
      // Props always collide; houses/landmarks only when off asphalt
      if (onRoad && s.kind !== "prop" && s.kind !== "gate" && s.kind !== "island") {
        continue;
      }

      const dx = r.x - s.x;
      const dy = r.y - s.y;
      const dist = Math.hypot(dx, dy);
      const min = s.radius + cartR;
      if (dist >= min || dist < 1e-5) continue;

      const overlap = min - dist;

      // Closed community gate: dead stop, keep facing the arm (no bounce / spin).
      if (s.kind === "gate") {
        const traveling = r.speed < -0.05 ? -1 : 1;
        const back = Math.min(overlap, 1.35);
        r.x -= Math.cos(r.angle) * traveling * back;
        r.y -= Math.sin(r.angle) * traveling * back;
        r.speed = 0;
        r.steerVel = 0;
        if (r.isPlayer) sfx.gateThud();
        continue;
      }

      const nx = dx / dist;
      const ny = dy / dist;
      const push = Math.min(overlap, 1.8);
      r.x += nx * push;
      r.y += ny * push;

      const vx = Math.cos(r.angle) * r.speed;
      const vy = Math.sin(r.angle) * r.speed;
      const into = vx * nx + vy * ny;
      if (into < 0) {
        const tvx = vx - into * nx;
        const tvy = vy - into * ny;
        const signed = r.speed < 0 ? -1 : 1;
        const mag = Math.hypot(tvx, tvy) * 0.55;
        if (mag < 0.8) {
          r.speed = 0;
        } else {
          r.speed = mag * signed;
          if (signed > 0 && mag > 1.5) r.angle = Math.atan2(tvy, tvx);
        }
      }
    }
  }

  private resolveCartCollisions() {
    for (let i = 0; i < this.racers.length; i++) {
      for (let j = i + 1; j < this.racers.length; j++) {
        const a = this.racers[i];
        const b = this.racers[j];
        const radius =
          a.cart.id === "cybertruck" || b.cart.id === "cybertruck" ? 1.85 : 1.55;
        const minDist = radius * 2;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= minDist || dist < 1e-4) continue;

        const nx = dx / dist;
        const ny = dy / dist;
        const overlap = minDist - dist;

        a.x -= nx * overlap * 0.52;
        a.y -= ny * overlap * 0.52;
        b.x += nx * overlap * 0.52;
        b.y += ny * overlap * 0.52;

        const avx = Math.cos(a.angle) * a.speed;
        const avy = Math.sin(a.angle) * a.speed;
        const bvx = Math.cos(b.angle) * b.speed;
        const bvy = Math.sin(b.angle) * b.speed;
        const relN = (avx - bvx) * nx + (avy - bvy) * ny;
        if (relN >= 0) continue;

        const restitution = 0.42;
        const impulse = (-(1 + restitution) * relN) / 2;
        let naVx = avx + impulse * nx;
        let naVy = avy + impulse * ny;
        let nbVx = bvx - impulse * nx;
        let nbVy = bvy - impulse * ny;

        const tx = -ny;
        const ty = nx;
        const scrape = Math.min(6, Math.abs(relN) * 0.15);
        naVx += tx * scrape * (a.isPlayer ? 0.7 : 1);
        naVy += ty * scrape * (a.isPlayer ? 0.7 : 1);
        nbVx -= tx * scrape * (b.isPlayer ? 0.7 : 1);
        nbVy -= ty * scrape * (b.isPlayer ? 0.7 : 1);

        const aMag = Math.min(a.cart.topSpeed, Math.hypot(naVx, naVy) * 0.88);
        const bMag = Math.min(b.cart.topSpeed, Math.hypot(nbVx, nbVy) * 0.88);
        // Preserve reverse when player was reversing into the pack
        a.speed = a.speed < 0 ? -Math.min(aMag, a.cart.topSpeed * 0.42) : aMag;
        b.speed = b.speed < 0 ? -Math.min(bMag, b.cart.topSpeed * 0.42) : bMag;

        if (a.speed > 1.2) a.angle = Math.atan2(naVy, naVx);
        if (b.speed > 1.2) b.angle = Math.atan2(nbVy, nbVx);

        if (Math.abs(relN) > 8) {
          a.effectTimer = Math.max(a.effectTimer, 0.35);
          a.effectSpeedMul = Math.min(a.effectSpeedMul, 0.55);
          b.effectTimer = Math.max(b.effectTimer, 0.35);
          b.effectSpeedMul = Math.min(b.effectSpeedMul, 0.55);
          if (a.isPlayer || b.isPlayer) {
            sfx.bump();
            this.pushEvent("toast", "Cart bump!", "Watch the pack", 1.2);
          }
        }
      }
    }
  }

  private pushEvent(kind: RaceEvent["kind"], text: string, sub?: string, ttl = 1.5) {
    this.events.push({ kind, text, sub, ttl });
  }

  /** Knock a cart into a brief spin-out (projectile hit). */
  private applySpinOut(r: Racer, kind: ProjectileKind) {
    const duration = kind === "fireball" ? 1.55 : kind === "bolt" ? 1.45 : kind === "loofah" ? 1.35 : 1.2;
    const spinMag = kind === "fireball" ? 11 : kind === "bolt" ? 10 : kind === "loofah" ? 9 : 8;
    r.spinOutTimer = Math.max(r.spinOutTimer, duration);
    r.spinVel = (Math.random() > 0.5 ? 1 : -1) * (spinMag + Math.random() * 4);
    r.speed *= 0.28;
    r.effectTimer = Math.max(r.effectTimer, duration);
    r.effectSpeedMul = Math.min(r.effectSpeedMul, 0.28);
    r.steerVel = 0;
  }

  /** Sinkhole: no drive until the timer runs out. */
  private tickTrap(r: Racer, dt: number): boolean {
    if (r.trapTimer <= 0) return false;
    r.trapTimer = Math.max(0, r.trapTimer - dt);
    r.speed = 0;
    r.steerVel = 0;
    if (r.trapTimer <= 0) {
      r.effectSpeedMul = 1;
      r.effectTimer = 0;
      // Nudge out so the cart doesn't sit on the lip
      r.speed = Math.max(r.speed, 10);
    }
    return true;
  }

  /** Tick spin-out rotation + recovery for any racer. */
  private updateSpinOut(r: Racer, dt: number) {
    if (r.spinOutTimer <= 0) {
      r.spinVel *= Math.exp(-8 * dt);
      if (Math.abs(r.spinVel) < 0.05) r.spinVel = 0;
      return;
    }
    r.spinOutTimer -= dt;
    // Fast yaw spin that eases off toward the end
    const t = Math.max(0, r.spinOutTimer);
    const ease = Math.min(1, t / 0.45); // full spin early, taper as timer ends
    r.angle += r.spinVel * ease * dt;
    r.spinVel *= Math.exp(-1.1 * dt);
    // Bleed speed while spinning
    r.speed *= Math.exp(-1.4 * dt);
    if (r.spinOutTimer <= 0) {
      r.spinOutTimer = 0;
      r.spinVel *= 0.2;
      r.effectSpeedMul = Math.max(r.effectSpeedMul, 0.55);
    }
  }

  private drivePlayer(r: Racer, dt: number, input: Input) {
    if (this.tickTrap(r, dt)) return;
    this.updateSpinOut(r, dt);

    const cart = r.cart;
    const feel = getControlSettings();
    let top = cart.topSpeed * r.effectSpeedMul * r.driver.luck;
    let accel = cart.accel * (0.62 + feel.driveSens * 0.38);
    // Reverse stays slower than forward, but must still be usable to unstick.
    let reverseTop = top * 0.62;

    // Terrain: off-path is slow; water is crawl
    if (r.inWater) {
      top *= 0.18;
      reverseTop *= 0.18;
      accel *= 0.2;
    } else if (r.offRoad) {
      top *= cart.offRoadGrip;
      reverseTop *= cart.offRoadGrip;
      accel *= 0.42;
    }

    if (r.effectTimer > 0) {
      r.effectTimer -= dt;
      if (r.effectTimer <= 0) r.effectSpeedMul = 1;
    }

    // During spin-out: almost no control — just watch the cart rotate
    const spinning = r.spinOutTimer > 0.05;
    const control = spinning ? 0.12 : 1;

    const braking = input.brakeAmount;
    const gas = input.throttleAmount;

    if (braking > 0.04 && braking >= gas) {
      const b = braking;
      if (r.speed > 0.35) {
        r.speed -= accel * 2.6 * dt * b;
      } else if (!spinning) {
        r.speed -= accel * 2.5 * dt * b;
      }
    } else if (gas > 0.04) {
      if (r.speed < 0) r.speed += cart.accel * 3.2 * dt * control * gas;
      else r.speed += accel * dt * control * gas;
    } else {
      if (r.speed > 0) r.speed -= cart.accel * 1.35 * dt;
      else if (r.speed < 0) r.speed += cart.accel * 1.5 * dt;
      if (Math.abs(r.speed) < 0.15) r.speed = 0;
    }

    r.speed = Math.max(-reverseTop, Math.min(top, r.speed));

    const reversing = r.speed < -0.12;
    const absSpeed = Math.abs(r.speed);
    const speed01 = Math.min(1, absSpeed / Math.max(1, top));
    const keyboardSteer = input.state.left !== input.state.right;
    const keySteerMul = 0.62 + feel.steerSens * 0.38;
    const maxSteer = keyboardSteer
      ? cart.handling * (reversing ? 1.55 : 0.55 + speed01 * 0.7) * control * keySteerMul
      : reversing
        ? cart.handling * 1.85 * control
        : cart.handling * (0.28 + speed01 * 0.5) * control;
    const axis = input.steerAxis;
    let target = 0;
    if (!spinning) {
      target = axis * maxSteer;
      if (reversing) target = -target;
    }
    const steerResponse = keyboardSteer
      ? (reversing ? 12 : 9.4) * keySteerMul
      : reversing
        ? 10.5
        : Math.abs(axis) > 0.04
          ? 6.4
          : 8.2;
    r.steerVel += (target - r.steerVel) * Math.min(1, steerResponse * dt);
    const clamp = cart.handling * (keyboardSteer ? (reversing ? 1.85 : 1.28) : reversing ? 2.05 : 0.85);
    r.steerVel = Math.max(-clamp, Math.min(clamp, r.steerVel));
    if (!spinning) r.angle += r.steerVel * dt;
  }

  private driveAI(r: Racer, dt: number) {
    if (this.tickTrap(r, dt)) return;
    this.updateSpinOut(r, dt);
    if (r.effectTimer > 0) {
      r.effectTimer -= dt;
      if (r.effectTimer <= 0 && r.spinOutTimer <= 0) r.effectSpeedMul = 1;
    }

    // While spinning, don't steer toward the path — just skid
    if (r.spinOutTimer > 0.08) return;

    const diffDef = this.difficulty;
    const player = this.getPlayer();
    const playerProg = player.lap + player.lapProgress;
    const myProg = r.lap + r.lapProgress;
    const behind = playerProg - myProg;
    const rubberBase = diffDef.rubberBand;
    const rubber =
      behind > 0.08
        ? 1 + 0.08 * rubberBase + Math.min(0.2 * rubberBase, behind * 0.4 * rubberBase)
        : behind < -0.14
          ? 0.9
          : 1;

    // Road holding: stay on the continuous path (not global nearest — folds/roundabouts)
    const near = nearestRoadPointContinuous(
      this.samples,
      r.x,
      r.y,
      r.roadIndex,
      0.16
    );
    r.roadIndex = near.index;
    const onRoad = near.distToRoad < ROAD_HALF_WIDTH + 0.8;
    r.offRoad = !onRoad && !r.inWater;

    // Look ahead farther at higher skill; also peek for corners
    const lookSpan = diffDef.lookAheadMax - diffDef.lookAheadMin;
    const look =
      diffDef.lookAheadMin +
      Math.floor(lookSpan * Math.min(1, Math.max(0, r.aiSkill - 0.7) / 0.5));
    const targetIdx = (near.index + look) % this.samples.length;
    const t = this.samples[targetIdx];

    // Stable lane preference per AI (tighter lanes on harder difficulties)
    const laneSeed = r.id.charCodeAt(r.id.length - 1) % 5;
    const laneAmp = (1.15 - diffDef.roadGrip * 0.35) * 1.6;
    let lane = (laneSeed - 2) * (laneAmp / 2);

    // If off the path, aim hard at road center (strength from difficulty)
    if (near.distToRoad > ROAD_HALF_WIDTH * 0.55) {
      lane = 0;
    }

    const nx = Math.cos(t.angle + Math.PI / 2);
    const ny = Math.sin(t.angle + Math.PI / 2);
    let tx = t.x + nx * lane;
    let ty = t.y + ny * lane;

    // Blend in "snap back to road" when drifting wide
    if (near.distToRoad > 1.2) {
      const snap = Math.min(1, diffDef.roadGrip * (0.45 + near.distToRoad * 0.08));
      tx = tx * (1 - snap) + near.sample.x * snap;
      ty = ty * (1 - snap) + near.sample.y * snap;
    }

    const desired = Math.atan2(ty - r.y, tx - r.x);
    let angDiff = desired - r.angle;
    while (angDiff > Math.PI) angDiff -= Math.PI * 2;
    while (angDiff < -Math.PI) angDiff += Math.PI * 2;

    // Stronger steering when off-road so they rejoin the cart path
    const steerMul = onRoad ? 1 : 1.35 + diffDef.roadGrip * 0.5;
    const turn = r.cart.handling * r.aiSkill * (0.9 + diffDef.roadGrip * 0.35) * steerMul;
    r.angle += Math.max(-turn * dt, Math.min(turn * dt, angDiff));

    // Corner awareness: slow for upcoming heading change
    let cornerFactor = 1;
    const probe = Math.max(6, Math.floor(look * 0.55));
    const a0 = this.samples[near.index];
    const a1 = this.samples[(near.index + probe) % this.samples.length];
    let hDiff = a1.angle - a0.angle;
    while (hDiff > Math.PI) hDiff -= Math.PI * 2;
    while (hDiff < -Math.PI) hDiff += Math.PI * 2;
    const cornerSharp = Math.min(1, Math.abs(hDiff) / 0.9);
    cornerFactor = 1 - cornerSharp * (0.18 + diffDef.cornerCare * 0.42);

    let top = r.cart.topSpeed * 0.97 * r.aiSkill * r.effectSpeedMul * rubber * cornerFactor;
    if (r.inWater) top *= 0.18;
    else if (r.offRoad) top *= r.cart.offRoadGrip * (0.55 + diffDef.roadGrip * 0.35);
    let targetSpeed = top;

    // Hazard avoidance — better on higher difficulty
    const hazRange = 14 + diffDef.roadGrip * 10;
    for (const h of this.hazards) {
      if (!h.active) continue;
      if (h.type === "lightning" && r.cart.id === "cybertruck") continue;
      const d = Math.hypot(h.x - r.x, h.y - r.y);
      if (d < hazRange) {
        targetSpeed *= d < 7 ? 0.55 : 0.8;
        const away = Math.atan2(r.y - h.y, r.x - h.x);
        let ad = away - r.angle;
        while (ad > Math.PI) ad -= Math.PI * 2;
        while (ad < -Math.PI) ad += Math.PI * 2;
        const avoid = 1.6 + diffDef.roadGrip * 1.4;
        r.angle += Math.max(-avoid * dt, Math.min(avoid * dt, ad * (0.4 + diffDef.roadGrip * 0.35)));
      }
    }

    const closedAhead = this.nearestWaveableGate(r);
    if (closedAhead && gateOpenAmount(closedAhead.site) < GATE_OPEN_BLOCK) {
      if (closedAhead.dist < GATE_WAVE_RANGE + 2) {
        r.waveTimer = Math.max(r.waveTimer, 0.9);
        closedAhead.site.hold = GATE_HOLD_SEC;
      }
      if (closedAhead.dist < 11 && gateOpenAmount(closedAhead.site) < GATE_OPEN_BLOCK) {
        targetSpeed *= 0.12;
      }
    }

    for (const s of this.solids) {
      if (s.destroyed) continue;
      if (s.kind === "gate") continue;
      const d = Math.hypot(s.x - r.x, s.y - r.y);
      if (d < s.radius + 6) {
        const away = Math.atan2(r.y - s.y, r.x - s.x);
        let ad = away - r.angle;
        while (ad > Math.PI) ad -= Math.PI * 2;
        while (ad < -Math.PI) ad += Math.PI * 2;
        r.angle += Math.max(-2.2 * dt, Math.min(2.2 * dt, ad * 0.45));
        if (d < s.radius + 3) targetSpeed *= 0.5;
      }
    }

    const pd = Math.hypot(player.x - r.x, player.y - r.y);
    if (pd < 12 && myProg > playerProg - 0.02 && diffDef.roadGrip > 0.7) {
      targetSpeed = Math.max(targetSpeed, Math.abs(player.speed) * 1.04);
    }

    if (r.speed < targetSpeed) r.speed += r.cart.accel * r.aiSkill * 1.2 * dt;
    else r.speed -= r.cart.accel * 0.5 * dt;
    r.speed = Math.max(0, Math.min(top * 1.02, r.speed));
  }

  private applyMotion(r: Racer, dt: number) {
    if (r.trapTimer > 0) {
      r.speed = 0;
      return;
    }
    r.x += Math.cos(r.angle) * r.speed * dt;
    r.y += Math.sin(r.angle) * r.speed * dt;
    r.x = Math.max(WORLD_SOFT.minX, Math.min(WORLD_SOFT.maxX, r.x));
    r.y = Math.max(WORLD_SOFT.minY, Math.min(WORLD_SOFT.maxY, r.y));
  }

  private updateProgress(r: Racer, dt: number) {
    const n = this.samples.length;
    if (!n || this.totalLen <= 1) return;

    // Continuity-aware projection so folds/roundabouts don't scramble progress
    const near = nearestRoadPointContinuous(
      this.samples,
      r.x,
      r.y,
      r.roadIndex,
      0.16
    );
    const prevIndex = r.roadIndex;
    const prevProg = r.lapProgress;

    r.roadIndex = near.index;
    // Normalize by full loop length (includes close of last→first segment)
    r.lapProgress = Math.min(0.9999, Math.max(0, near.sample.dist / this.totalLen));

    /**
     * Lap complete when progress wraps past the start/finish:
     * large negative jump in 0–1 progress (e.g. 0.92 → 0.04).
     * Continuous roadIndex keeps this from firing on random nearest-point snaps.
     */
    const delta = r.lapProgress - prevProg;
    const indexWrapped =
      prevIndex > n * 0.7 &&
      near.index < n * 0.3 &&
      // forward wrap distance is short
      (near.index + n - prevIndex) % n < n * 0.35;

    const progressWrapped = delta < -0.45;
    // Ignore tiny reverse scrapes near the line; require actual motion
    const moving = Math.abs(r.speed) > 0.4;

    if (moving && (progressWrapped || indexWrapped)) {
      // Cooldown via progress: only count if we were actually late in the lap
      if (prevProg > 0.55) {
        r.lap += 1;
        if (r.isPlayer && r.lap < LAPS_TO_WIN) {
          sfx.lap();
          this.pushEvent(
            "banner",
            `Lap ${r.lap + 1}`,
            `${r.lap} of ${LAPS_TO_WIN} complete`,
            1.4
          );
        }
        if (r.lap >= LAPS_TO_WIN && !r.finished) {
          r.finished = true;
          r.finishTime = this.time;
          r.speed *= 0.25;
          if (r.isPlayer) {
            sfx.finish();
            this.pushEvent("banner", "Finished!", "Pull into the lanai", 2);
          }
        }
      }
    }

    if (r.isPlayer && this.running) {
      r.score += Math.max(0, r.speed) * 1.8 * dt;
      this.updateWrongWay(r, dt, prevProg);
    }
  }

  private updateWrongWay(r: Racer, dt: number, prevProg: number) {
    if (!this.running || r.finished || r.trapTimer > 0) {
      this.wrongWaySec = Math.max(0, this.wrongWaySec - dt * 3);
      if (this.wrongWaySec < 1) this.wrongWayAlert = false;
      return;
    }
    const s = this.samples[r.roadIndex];
    if (!s) return;

    const near = nearestRoadPoint(this.samples, r.x, r.y);
    if (near.distToRoad > ROAD_HALF_WIDTH * 2.4) {
      this.wrongWaySec = Math.max(0, this.wrongWaySec - dt * 2);
      if (this.wrongWaySec < 1) this.wrongWayAlert = false;
      return;
    }

    let ad = r.angle - s.angle;
    while (ad > Math.PI) ad -= Math.PI * 2;
    while (ad < -Math.PI) ad += Math.PI * 2;
    const facingWrong = Math.abs(ad) > 1.85;

    let dProg = r.lapProgress - prevProg;
    if (dProg > 0.5) dProg -= 1;
    if (dProg < -0.5) dProg += 1;
    const moving = Math.abs(r.speed) > 1.4;
    const backingOnTrack = moving && dProg < -0.0007;
    const wrong = moving && (facingWrong || backingOnTrack);

    if (wrong) {
      this.wrongWaySec += dt;
      if (this.wrongWaySec >= 5) this.wrongWayAlert = true;
    } else {
      this.wrongWaySec = Math.max(0, this.wrongWaySec - dt * 2.4);
      if (this.wrongWaySec < 1.1) this.wrongWayAlert = false;
    }
  }

  private checkCheckpoints(r: Racer) {
    for (const lm of LANDMARKS) {
      if (lm.kind !== "town-square" && lm.kind !== "rec-center") continue;
      if (r.checkpoints.has(lm.id)) continue;
      if (Math.hypot(lm.x - r.x, lm.y - r.y) < 35) {
        r.checkpoints.add(lm.id);
        if (r.isPlayer) {
          const bonus = lm.kind === "town-square" ? 250 : 150;
          r.score += bonus;
          sfx.checkpoint();
          this.pushEvent(
            "checkpoint",
            lm.shortName,
            `+${bonus} · ${lm.kind === "town-square" ? "Town Square" : "Rec Center"}`,
            2
          );
        }
      }
    }
  }

  /**
   * True when a world point sits on/near a roundabout ring or its island.
   * Circles are already tight — keep them nearly hazard-free for playability.
   */
  private nearRoundabout(x: number, y: number, pad = 14): boolean {
    for (const r of TRACK_ROUNDABOUTS) {
      const d = Math.hypot(x - r.x, y - r.y);
      // Outer road edge + padding: cover the ring, island, and approach mouths
      if (d < r.radius + ROAD_HALF_WIDTH + pad) return true;
    }
    return false;
  }

  private spawnHazardAhead(distanceAlong: number, forceOnCenter: boolean) {
    const player = this.getPlayer();
    const spacing = this.totalLen / this.samples.length;
    const stepsAhead = Math.max(8, Math.floor(distanceAlong / Math.max(1, spacing)));
    let idx = (player.roadIndex + stepsAhead) % this.samples.length;
    let s = this.samples[idx];

    // Skip / push past roundabouts — don't dump turtles & golf balls into the circle
    if (this.nearRoundabout(s.x, s.y, 16)) {
      // Walk forward along the track until we're clear of the circle
      let found = false;
      for (let step = 4; step < 48; step += 3) {
        const j = (idx + step) % this.samples.length;
        const cand = this.samples[j];
        if (!this.nearRoundabout(cand.x, cand.y, 14)) {
          idx = j;
          s = cand;
          found = true;
          break;
        }
      }
      // Still inside a circle cluster? Just don't spawn here.
      if (!found) return;
    }

    const types: HazardType[] = [
      "golf-ball",
      "turtle",
      "alligator",
      "lightning",
      "wanderer",
      "cop",
      "porch-police",
      "palm-frond",
      "sinkhole",
    ];
    const weights = [1.3, 1.4, 1.2, 0.9, 1.1, 0.85, 1.2, 1.25, 0.7];
    let total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    let type: HazardType = "turtle";
    for (let i = 0; i < types.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        type = types[i];
        break;
      }
    }

    const nx = Math.cos(s.angle + Math.PI / 2);
    const ny = Math.sin(s.angle + Math.PI / 2);
    const lane = forceOnCenter
      ? (Math.random() - 0.5) * 2.5
      : (Math.random() - 0.5) * (ROAD_HALF_WIDTH * 1.3);

    let x = s.x + nx * lane;
    let y = s.y + ny * lane;

    // Final safety: never place a hazard on a roundabout island/ring
    if (this.nearRoundabout(x, y, 12)) return;
    let vx = 0;
    let vy = 0;
    let angle = s.angle;

    if (type === "golf-ball") {
      // Start off one shoulder and fly across toward the other
      const side = Math.random() > 0.5 ? 1 : -1;
      x = s.x + nx * ROAD_HALF_WIDTH * 1.8 * side;
      y = s.y + ny * ROAD_HALF_WIDTH * 1.8 * side;
      vx = -nx * side * (14 + Math.random() * 12);
      vy = -ny * side * (14 + Math.random() * 12);
      angle = Math.atan2(vy, vx);
    } else if (type === "alligator") {
      // Crawl from one shoulder toward the opposite — always face travel direction
      const side = Math.random() > 0.5 ? 1 : -1;
      const crossSpeed = 3.6 + Math.random() * 2.2;
      x = s.x + nx * (ROAD_HALF_WIDTH + 6) * side;
      y = s.y + ny * (ROAD_HALF_WIDTH + 6) * side;
      vx = -nx * side * crossSpeed;
      vy = -ny * side * crossSpeed;
      angle = Math.atan2(vy, vx);
    } else if (type === "wanderer" || type === "porch-police") {
      // Pedestrians cross from a chosen side toward the other
      const side = Math.random() > 0.5 ? 1 : -1;
      const walk = 2.0 + Math.random() * 1.4;
      x = s.x + nx * (ROAD_HALF_WIDTH + 3.5) * side;
      y = s.y + ny * (ROAD_HALF_WIDTH + 3.5) * side;
      vx = -nx * side * walk;
      vy = -ny * side * walk;
      angle = Math.atan2(vy, vx);
    } else if (type === "turtle") {
      // Turtle creeps roughly along the road, facing forward
      const crawl = 1.2 + Math.random() * 1.0;
      const along = Math.random() > 0.5 ? 1 : -1;
      vx = Math.cos(s.angle) * crawl * along;
      vy = Math.sin(s.angle) * crawl * along;
      angle = Math.atan2(vy, vx);
    } else if (type === "cop") {
      // Cart cop faces oncoming traffic along the path
      angle = s.angle + Math.PI;
      const patrol = 2.5 + Math.random() * 2;
      vx = Math.cos(angle) * patrol;
      vy = Math.sin(angle) * patrol;
    } else if (type === "palm-frond" || type === "sinkhole") {
      // Storm debris and holes sit still on the pavement
      vx = 0;
      vy = 0;
      angle = s.angle + (Math.random() - 0.5) * 0.8;
      if (type === "sinkhole") {
        x = s.x + nx * (Math.random() - 0.5) * 3.2;
        y = s.y + ny * (Math.random() - 0.5) * 3.2;
      }
    }

    this.hazards.push({
      id: this.hazardId++,
      type,
      x,
      y,
      vx,
      vy,
      life: type === "lightning" ? 7 : type === "sinkhole" ? 22 : 18,
      maxLife: type === "lightning" ? 7 : type === "sinkhole" ? 22 : 18,
      active: true,
      angle,
      phase: Math.random() * Math.PI * 2,
      // Start unflipped; world3d sets faceSign from camera-relative travel each frame
      faceSign: 1,
    });

    const active = this.hazards.filter((h) => h.active);
    if (active.length > 12) {
      active.sort((a, b) => a.id - b.id);
      for (let i = 0; i < active.length - 12; i++) active[i].active = false;
    }
  }

  private updateHazards(dt: number) {
    for (const h of this.hazards) {
      if (!h.active) continue;
      h.life -= dt;
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      // Always face the direction of travel (stops moonwalking across the path)
      const spd = Math.hypot(h.vx, h.vy);
      if (spd > 0.15) {
        h.angle = Math.atan2(h.vy, h.vx);
      }
      // Quiet the circles: despawn anything that drifts onto a roundabout
      if (this.nearRoundabout(h.x, h.y, 10)) {
        h.active = false;
        continue;
      }
      if (h.life <= 0) h.active = false;
    }
    this.hazards = this.hazards.filter((h) => h.active);
  }

  private checkHazardHits(r: Racer) {
    if (r.trapTimer > 0) return;
    if (r.trapIgnoreId && !this.hazards.some((h) => h.active && h.id === r.trapIgnoreId)) {
      r.trapIgnoreId = 0;
    }
    for (const h of this.hazards) {
      if (!h.active) continue;
      const def = HAZARD_DEFS[h.type];
      const d = Math.hypot(h.x - r.x, h.y - r.y);
      if (h.type === "sinkhole" && r.trapIgnoreId === h.id) {
        // Free once they've driven well clear; next lap can fall in again
        if (d > def.radius + 6) r.trapIgnoreId = 0;
        continue;
      }
      if (d < def.radius + 1.4) {
        // Cybertruck harvests Florida lightning as bolt ammo — everyone else gets fried
        if (h.type === "lightning" && r.cart.id === "cybertruck") {
          h.active = false;
          const before = r.ammo;
          r.ammo = Math.min(MAX_AMMO, r.ammo + 4);
          if (r.isPlayer) {
            sfx.pickup();
            const gained = r.ammo - before;
            this.pushEvent(
              "toast",
              gained > 0 ? "Lightning absorbed!" : "Storm cells full",
              gained > 0 ? `+${gained} lightning bolts` : "Bolts already charged",
              1.8
            );
          }
          continue;
        }
        r.effectTimer = def.duration;
        r.effectSpeedMul = def.speedMul;
        r.speed *= def.speedMul;
        r.hazardsHit += 1;
        if (h.type === "sinkhole") {
          r.trapTimer = def.duration;
          r.trapIgnoreId = h.id;
          r.speed = 0;
          r.steerVel = 0;
          r.x = r.x * 0.35 + h.x * 0.65;
          r.y = r.y * 0.35 + h.y * 0.65;
        } else {
          h.active = false;
        }
        if (r.isPlayer) {
          r.score = Math.max(0, r.score - def.scorePenalty);
          sfx.hazard();
          this.pushEvent("toast", def.message, `−${def.scorePenalty} pts`, 2.4);
        }
      }
    }
  }

  private updatePlaces() {
    const rankKey = (r: Racer) => {
      if (r.finished) return 1000 + (1000 - r.finishTime);
      return r.lap + r.lapProgress;
    };
    const sorted = [...this.racers].sort((a, b) => rankKey(b) - rankKey(a));
    sorted.forEach((r, i) => {
      r.place = i + 1;
    });
  }

  private checkRaceOver() {
    const player = this.getPlayer();
    if (!player.finished) return;
    const allDone = this.racers.every((r) => r.finished);
    const since = this.time - player.finishTime;
    if (allDone || since > 8) {
      this.finished = true;
      this.running = false;
      this.finalizeScores();
    }
  }

  private finalizeScores() {
    for (const r of this.racers) {
      const placeBonus =
        r.place === 1 ? 1000 : r.place === 2 ? 700 : r.place === 3 ? 450 : 250;
      const timeBonus = r.finished ? Math.max(0, 500 - r.finishTime * 1.5) : 0;
      if (r.isPlayer) {
        r.score += placeBonus + timeBonus + r.checkpoints.size * 20;
        r.score = Math.round(r.score);
      } else {
        r.score = Math.round(placeBonus + r.lap * 200 + r.checkpoints.size * 50);
      }
    }
  }

  private updateNearbyLandmark() {
    const player = this.getPlayer();
    let best: string | null = null;
    let bestD = 50;
    for (const lm of LANDMARKS) {
      const d = Math.hypot(lm.x - player.x, lm.y - player.y);
      if (d < bestD) {
        bestD = d;
        best = lm.shortName;
      }
    }
    this.nearbyLandmark = best;
  }

  private updateHazardWarn() {
    const player = this.getPlayer();
    let best: HazardInstance | null = null;
    let bestD = 45;
    for (const h of this.hazards) {
      if (!h.active) continue;
      const toH = Math.atan2(h.y - player.y, h.x - player.x);
      let diff = toH - player.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) > 1.1) continue;
      const d = Math.hypot(h.x - player.x, h.y - player.y);
      if (d < bestD) {
        bestD = d;
        best = h;
      }
    }
    this.upcomingHazard = best ? "Watch the path!" : null;
  }

  getPlayer(): Racer {
    return this.racers.find((r) => r.isPlayer)!;
  }

  getResult(): RaceResult {
    const player = this.getPlayer();
    return {
      racers: [...this.racers].sort((a, b) => a.place - b.place),
      player,
      timeSec: player.finishTime || this.time,
      score: player.score,
      areaName: this.areaName,
    };
  }
}

const WORLD_SOFT = {
  minX: WORLD.minX + 20,
  maxX: WORLD.maxX - 20,
  minY: WORLD.minY + 20,
  maxY: WORLD.maxY - 20,
};

// silence unused import if tree-shaken later
void ROAD_CLEAR_BUILDING;
