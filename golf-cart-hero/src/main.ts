import "./style.css";
import { loadAssets, type AssetLibrary } from "./game/assets/loader";
import {
  confirmDonationSession,
  getHighestDonationTier,
} from "./game/donations";
import { Input } from "./game/input";
import { isTiltPreferred } from "./game/tilt";
import { raceMusic } from "./game/music";
import { sfx } from "./game/sfx";
import { MAX_AMMO, Race, projectileEmoji } from "./game/race";
import { LAPS_TO_WIN } from "./game/data/track";
import { UI, type SelectState } from "./game/ui";
import { World3D, drawMiniMap } from "./game/world3d";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const uiRoot = document.getElementById("ui") as HTMLElement;

const input = new Input();
let assets: AssetLibrary | null = null;
let world = new World3D(canvas);

let race: Race | null = null;
let screen: "menu" | "area" | "select" | "how" | "settings" | "race" | "results" | "loading" =
  "loading";
let lastSelect: SelectState | null = null;
let resultsSubmitted = false;
let lastTs = 0;
let worldBuilt = false;

const ui = new UI(uiRoot, {
  onStartSelect: () => {
    screen = "area";
    ui.showAreaSelect();
  },
  onShowHow: () => {
    screen = "how";
    ui.showHow();
  },
  onShowSettings: () => {
    screen = "menu";
    ui.showSettings();
  },
  onShowLeaderboard: () => {},
  onShowDonate: () => {
    screen = "menu";
    ui.showDonate();
  },
  onBackMenu: () => {
    leaveRaceToMenu();
  },
  onRace: (state) => startRace(state),
  onPlayAgain: () => {
    if (lastSelect) startRace(lastSelect);
    else {
      input.enabled = false;
      input.reset();
      screen = "area";
      ui.showAreaSelect();
    }
  },
  onStopRace: () => {
    if (screen === "race" && race && !race.finished) {
      race.stopEarly();
    }
  },
  onTouch: (key, down) => {
    if (key === "throttle") input.set({ throttle: down });
    if (key === "brake") input.set({ brake: down });
    if (key === "left") input.set({ left: down });
    if (key === "right") input.set({ right: down });
    if (key === "fire") input.set({ fire: down });
    if (key === "gate") input.set({ gate: down });
  },
  onRecenterTilt: () => input.recenterTilt(),
});

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  world.resize(w, h);
}

function startRace(state: SelectState) {
  lastSelect = state;
  resultsSubmitted = false;
  // Arm audio on this tap (silent) so Android still allows play at GO.
  raceMusic.prepareForRace(state.areaId);
  sfx.unlock();
  input.reset();
  input.enabled = true;
  if (isTiltPreferred()) {
    void input.startTilt().then((ok) => {
      if (screen !== "race") return;
      if (!ok) {
        ui.setDrivePadMode("buttons");
        return;
      }
      window.setTimeout(() => {
        if (screen === "race" && !input.tilt.ready) ui.setDrivePadMode("buttons");
      }, 1600);
    });
  } else {
    input.stopTilt();
  }
  // Ensure art materials are applied before building the world
  if (assets) {
    world.setMaterials(assets.materials);
  }
  race = new Race({
    playerName: state.playerName,
    cartId: state.cartId,
    driverId: state.driverId,
    areaId: state.areaId,
    difficultyId: state.difficultyId,
  });
  // Build the full loop world, then snap camera onto the track before first paint
  world.buildWorld(race.samples, race.decor, race.areaId);
  world.ensureRacers(race.racers, getHighestDonationTier());
  world.snapCameraToPlayer(race.getPlayer());
  // One warm-up frame so the full path is on the GPU before controls start
  world.render(0);
  worldBuilt = true;
  screen = "race";
  ui.showRaceHud();
  lastTs = performance.now();
}

function leaveRaceToMenu() {
  input.enabled = false;
  input.stopTilt();
  input.reset();
  raceMusic.stop();
  race = null;
  worldBuilt = false;
  screen = "menu";
  ui.showMenu();
}

function frame(ts: number) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
  lastTs = ts;

  if (screen === "race" && race) {
    input.update(dt);
    race.update(dt, input);
    if (race.justWentGreen) {
      race.justWentGreen = false;
      raceMusic.startNow();
    }

    world.ensureRacers(race.racers, getHighestDonationTier());
    world.updateRacers(race.racers, race.samples);
    world.syncHazards(race.hazards);
    world.syncProjectiles(race.projectiles);
    world.syncSolids(race.solids);
    world.syncAmmoPickups(race.ammoPickups);
    world.updateGates();
    world.updateCamera(race.getPlayer(), dt);
    world.render(dt);

    const player = race.getPlayer();
    const bannerEv = race.events.find((e) => e.kind === "banner");
    const toastEv = race.events.find((e) => e.kind === "toast" || e.kind === "checkpoint");

    const toastText = toastEv
      ? toastEv.sub
        ? `${toastEv.text} — ${toastEv.sub}`
        : toastEv.text
      : race.upcomingHazard
        ? race.upcomingHazard
        : null;

    ui.updateHud({
      place: player.place,
      lap: player.lap,
      laps: LAPS_TO_WIN,
      score: player.score,
      time: race.time,
      playerName: player.name,
      areaName: race.areaName,
      ammoLabel: `${projectileEmoji(race.playerAmmo)} ${player.ammo}/${MAX_AMMO}`,
      banner: bannerEv?.text ?? null,
      toast: toastText,
      landmark: toastEv || race.upcomingHazard ? null : race.nearbyLandmark,
      wrongWay: race.wrongWayAlert,
    });

    const mini = ui.getMiniMapCanvas();
    if (mini) {
      const mctx = mini.getContext("2d");
      if (mctx) drawMiniMap(mctx, race.racers, race.samples, race.hazards);
    }

    if (race.finished && screen === "race") {
      input.enabled = false;
      input.stopTilt();
      input.reset();
      raceMusic.stop();
      screen = "results";
      ui.showResults(race.getResult(), resultsSubmitted);
    }
  } else if (screen !== "loading") {
    // Menus: never capture gameplay keys (name field needs free typing)
    if (input.enabled) {
      input.enabled = false;
      input.reset();
    }
    if (!worldBuilt) {
      world.renderMenuBackdrop(ts);
    } else {
      world.render(dt);
    }
  } else {
    world.renderMenuBackdrop(ts);
  }
}

// Boot: load art pack, then open menu
uiRoot.innerHTML = `
  <div class="screen">
    <p class="brand-kicker">Art pack loading</p>
    <h1>The Villages Golf Cart Hero</h1>
    <p class="tagline">Loading photoreal texture packs for carts, houses, palms &amp; terrain…</p>
    <div class="panel tight" style="text-align:center">
      <p style="margin:0;color:var(--muted)">This only happens once at startup.</p>
    </div>
  </div>
`;

resize();
window.addEventListener("resize", resize);
requestAnimationFrame(frame);

async function handleDonateReturn(): Promise<string | null> {
  const params = new URLSearchParams(window.location.search);
  const donate = params.get("donate");
  const sessionId = params.get("session_id");

  // Clean URL so refresh doesn't re-confirm forever
  if (donate || sessionId) {
    const clean = window.location.pathname || "/";
    window.history.replaceState({}, "", clean);
  }

  if (donate === "canceled") {
    return "Checkout canceled — no charge. You can tip anytime from the menu.";
  }
  if (donate === "success" && sessionId) {
    const result = await confirmDonationSession(sessionId);
    if (result.ok) {
      return (
        result.message ||
        (result.tier
          ? `Thanks! $${result.amountUsd} tip recorded — ${result.tier === 5 ? "Gold" : result.tier === 3 ? "Blue" : "Red"} flag unlocked.`
          : "Thanks for the tip!")
      );
    }
    return result.error || "Could not verify tip. If you were charged, the flag may still unlock after refresh.";
  }
  return null;
}

loadAssets()
  .then(async (lib) => {
    assets = lib;
    world.setMaterials(lib.materials);
    const loaded = Object.keys(lib.textures).length;
    console.info(`[assets] Loaded ${loaded} textures`);
    const banner = await handleDonateReturn();
    screen = "menu";
    ui.showMenu({ donateBanner: banner });
  })
  .catch(async (err) => {
    console.error("[assets] Load failed, using solid materials", err);
    const banner = await handleDonateReturn();
    screen = "menu";
    ui.showMenu({ donateBanner: banner });
  });

window.addEventListener(
  "keydown",
  (e) => {
    if (screen !== "race") return;
    const t = e.target;
    if (t instanceof HTMLElement) {
      const tag = t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable) {
        return;
      }
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "g", "G"].includes(e.key)) {
      e.preventDefault();
    }
  },
  { passive: false }
);
