import { BRAND } from "../theme";
import { sfx } from "./sfx";
import { assetUrl } from "./assetUrl";
import { DRIVE_AREAS, type AreaId } from "./data/areas";
import { isNativeShell } from "./nativeShell";
import { isTiltPreferred } from "./tilt";
import {
  getControlSettings,
  resetControlSettings,
  sensToSlider,
  setControlSettings,
  sliderFeelLabel,
  sliderToSens,
  SENS_SLIDER_MAX,
  SENS_SLIDER_MIN,
} from "./settings";
import { CARTS, type CartId } from "./data/carts";
import {
  DIFFICULTIES,
  type DifficultyId,
} from "./data/difficulty";
import { DRIVERS, driverEmoji, type DriverId } from "./data/drivers";
import {
  DONATION_PRESETS,
  donationApiReady,
  flagNameForTier,
  getHighestDonationTier,
  startDonationCheckout,
  type DonationTierUsd,
} from "./donations";
import {
  isHighScore,
  leaderboardTitle,
  loadLeaderboard,
  submitScore,
  type LeaderboardEntry,
} from "./leaderboard";
import type { RaceResult } from "./race";

export type Screen =
  | "menu"
  | "area"
  | "select"
  | "how"
  | "race"
  | "results"
  | "donate"
  | "settings";

export type SelectState = {
  playerName: string;
  cartId: CartId;
  driverId: DriverId;
  areaId: AreaId;
  difficultyId: DifficultyId;
};

function loadSavedDifficultyId(): DifficultyId {
  const raw = localStorage.getItem("vgch-difficulty-id");
  if (raw && DIFFICULTIES.some((d) => d.id === raw)) return raw as DifficultyId;
  return "happy-hour";
}

export type UIHandlers = {
  onStartSelect: () => void;
  onShowHow: () => void;
  onShowSettings: () => void;
  onShowLeaderboard: () => void;
  onShowDonate: () => void;
  onBackMenu: () => void;
  onRace: (state: SelectState) => void;
  onPlayAgain: () => void;
  onStopRace: () => void;
  onTouch: (key: "throttle" | "brake" | "left" | "right" | "fire" | "gate", down: boolean) => void;
  onRecenterTilt: () => void;
};

function loadSavedAreaId(): AreaId {
  const raw = localStorage.getItem("vgch-area-id");
  // Legacy id from before the Eastwood → Eastport rename
  if (raw === "eastwood") {
    localStorage.setItem("vgch-area-id", "eastport");
    return "eastport";
  }
  if (raw && DRIVE_AREAS.some((a) => a.id === raw)) return raw as AreaId;
  return "spanish-springs";
}

export class UI {
  root: HTMLElement;
  select: SelectState = {
    playerName: localStorage.getItem("vgch-player-name") || "",
    cartId: "yamaha",
    driverId: "alligator",
    areaId: loadSavedAreaId(),
    difficultyId: loadSavedDifficultyId(),
  };
  private handlers: UIHandlers;

  constructor(root: HTMLElement, handlers: UIHandlers) {
    this.root = root;
    this.handlers = handlers;
  }

  clear() {
    this.root.innerHTML = "";
  }

  showMenu(opts?: { donateBanner?: string | null }) {
    this.clear();
    const lb = loadLeaderboard().slice(0, 5);
    const tier = getHighestDonationTier();
    const tierLine = tier
      ? `Your cart flies a <strong>${flagNameForTier(tier)}</strong> supporter flag (highest tip $${tier}).`
      : "Enjoying the chaos? Tip $1, $3, or $5 and earn a colored mascot flag on your cart.";
    const banner = opts?.donateBanner
      ? `<div class="donate-banner">${escapeHtml(opts.donateBanner)}</div>`
      : "";
    this.root.innerHTML = `
      <div class="screen panel-host">
        <p class="brand-kicker">From the makers of ${BRAND.sisterApp}</p>
        <div class="menu-title-row">
          <img
            class="menu-mascot"
            src="${assetUrl("assets/mascot-hero.png")}"
            alt="Golf Cart Hero mascot driving a cart"
            width="200"
            height="200"
          />
          <h1>${BRAND.name}</h1>
        </div>
        <p class="tagline">${BRAND.tagline}</p>
        ${banner}
        <div class="panel">
          <p style="margin:0;color:var(--muted);text-align:center">
            Choose one of <strong>five themed Town Square areas</strong>, pick a cart &amp; Florida critter,
            then race a fresh local loop. Dodge gators, golf balls, and the porch police.
          </p>
          <div class="btn-row">
            <button class="btn-primary" id="btn-play">Pick a Square</button>
            <button class="btn-secondary" id="btn-how">How to Play</button>
            <button class="btn-secondary" id="btn-settings">Settings</button>
            <button class="btn-gold" id="btn-lb">${leaderboardTitle()}</button>
            ${
              isNativeShell()
                ? ""
                : `<button class="btn-sunset" id="btn-donate">Tip the Dev ⛳</button>`
            }
          </div>
          <div class="help-keys">
            <span class="key"><kbd>W</kbd>/<kbd>↑</kbd> Gas</span>
            <span class="key"><kbd>S</kbd>/<kbd>↓</kbd> Brake / Reverse</span>
            <span class="key"><kbd>A</kbd>/<kbd>←</kbd> Left</span>
            <span class="key"><kbd>D</kbd>/<kbd>→</kbd> Right</span>
            <span class="key"><kbd>Space</kbd> Fire</span>
            <span class="key"><kbd>G</kbd> Gate pass</span>
          </div>
        </div>
        ${
          isNativeShell()
            ? ""
            : `<div class="panel tight donate-teaser" id="menu-donate">
          <div class="donate-teaser-row">
            <img class="donate-mascot-sm" src="${assetUrl("assets/mascot-logo.jpg")}" alt="Golf-ball mascot" width="72" height="72" />
            <div>
              <h2 style="font-size:1.05rem;margin:0">Buy me a cart-path coffee</h2>
              <p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.88rem">${tierLine}</p>
            </div>
          </div>
        </div>`
        }
        <div class="panel tight" id="menu-lb">
          <h2 style="font-size:1.15rem">🏆 ${leaderboardTitle()}</h2>
          <p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.88rem">${BRAND.leaderboardTag}</p>
          ${this.renderLeaderboardList(lb)}
        </div>
        <p class="footer-note">
          Fan-made whimsical racer · not affiliated with The Villages® ·
          <a href="${BRAND.sisterAppUrl}" target="_blank" rel="noopener noreferrer">${BRAND.sisterApp}</a>
          · <a href="${assetUrl("privacy.html")}">Privacy</a>
        </p>
      </div>
    `;
    this.root.querySelector("#btn-play")!.addEventListener("click", () => {
      sfx.unlock();
      this.handlers.onStartSelect();
    });
    this.root.querySelector("#btn-how")!.addEventListener("click", () => this.handlers.onShowHow());
    this.root.querySelector("#btn-settings")!.addEventListener("click", () => {
      this.handlers.onShowSettings();
    });
    this.root.querySelector("#btn-lb")!.addEventListener("click", () => {
      this.showFullLeaderboard();
    });
    this.root.querySelector("#btn-donate")?.addEventListener("click", () => {
      this.handlers.onShowDonate();
    });
    this.root.querySelector("#menu-donate")?.addEventListener("click", () => {
      this.handlers.onShowDonate();
    });
    this.scrollMenuToTop();
  }

  private scrollMenuToTop() {
    const screen = this.root.querySelector(".screen");
    if (screen instanceof HTMLElement) screen.scrollTop = 0;
  }

  showDonate(opts?: { notice?: string | null }) {
    if (isNativeShell()) {
      this.handlers.onBackMenu();
      return;
    }
    this.clear();
    const tier = getHighestDonationTier();
    const statusLine = tier
      ? `Highest tip on this device: <strong>$${tier}</strong> · <span class="flag-pill flag-${tier}">${flagNameForTier(tier)} flag</span> unlocked`
      : "No tip yet — pick an amount below. Your highest tip keeps the matching flag forever on this browser.";
    const notice = opts?.notice
      ? `<div class="donate-banner">${escapeHtml(opts.notice)}</div>`
      : "";
    this.root.innerHTML = `
      <div class="screen">
        <p class="brand-kicker">Tip jar · Stripe secure checkout</p>
        <h1>Support Golf Cart Hero</h1>
        <p class="tagline">If you’re enjoying the ride, buy the golf-ball mascot a coffee. Tips use the same Stripe account as ${BRAND.sisterApp}.</p>
        ${notice}
        <div class="panel donate-panel">
          <div class="donate-hero">
            <img class="donate-mascot" src="${assetUrl("assets/mascot-logo.jpg")}" alt="Golf-ball mascot from The Villages Everything App" width="160" height="160" />
            <div>
              <p style="margin:0;color:var(--muted);line-height:1.45">
                After you tip, every future race shows a <strong>supporter flag</strong> on the cart you pick —
                colored for your <em>highest</em> donation:
              </p>
              <ul class="donate-flag-legend">
                <li><span class="flag-swatch red"></span> <strong>$1</strong> Red flag + mascot</li>
                <li><span class="flag-swatch blue"></span> <strong>$3</strong> Blue flag + mascot</li>
                <li><span class="flag-swatch gold"></span> <strong>$5</strong> Gold flag + mascot</li>
              </ul>
              <p class="donate-status">${statusLine}</p>
            </div>
          </div>
          <div class="donate-amounts" role="list" id="donate-amounts"></div>
          <p id="donate-error" class="donate-error" style="display:none"></p>
          <p class="donate-secure-note">Secure checkout powered by Stripe. You’ll return here after paying; the flag unlocks immediately on this device.</p>
          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back to Menu</button>
          </div>
        </div>
      </div>
    `;

    const amounts = this.root.querySelector("#donate-amounts")!;
    amounts.innerHTML = DONATION_PRESETS.map((p) => {
      const active = tier === p.amountUsd ? "is-highest" : "";
      return `
        <button type="button" class="donate-amount-card ${active}" data-amount="${p.amountUsd}" role="listitem">
          <img src="${assetUrl("assets/mascot-logo.jpg")}" alt="" class="donate-amount-mascot" width="48" height="48" />
          <strong>$${p.amountUsd}</strong>
          <span>${escapeHtml(p.label)}</span>
          <em>${escapeHtml(p.blurb)}</em>
          <span class="flag-pill flag-${p.amountUsd}">${p.flagName} flag</span>
        </button>`;
    }).join("");

    const errEl = this.root.querySelector("#donate-error") as HTMLElement;
    const setBusy = (busy: boolean) => {
      amounts.querySelectorAll("button").forEach((b) => {
        (b as HTMLButtonElement).disabled = busy;
      });
    };

    amounts.querySelectorAll("[data-amount]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const amount = Number((btn as HTMLElement).dataset.amount) as DonationTierUsd;
        errEl.style.display = "none";
        setBusy(true);
        (btn as HTMLElement).classList.add("checking-out");
        const ready = await donationApiReady();
        if (!ready) {
          errEl.textContent =
            "Stripe isn’t configured yet. Add STRIPE_SECRET_KEY to .env.local and restart npm run dev.";
          errEl.style.display = "block";
          setBusy(false);
          (btn as HTMLElement).classList.remove("checking-out");
          return;
        }
        const result = await startDonationCheckout(amount);
        if (result.url) {
          window.location.href = result.url;
          return;
        }
        errEl.textContent = result.error || "Checkout failed";
        errEl.style.display = "block";
        setBusy(false);
        (btn as HTMLElement).classList.remove("checking-out");
      });
    });

    this.root.querySelector("#btn-back")!.addEventListener("click", () => {
      this.handlers.onBackMenu();
    });
  }

  private showFullLeaderboard() {
    this.clear();
    const lb = loadLeaderboard();
    this.root.innerHTML = `
      <div class="screen">
        <p class="brand-kicker">High scores</p>
        <h1>🏆 ${leaderboardTitle()}</h1>
        <p class="tagline">${BRAND.leaderboardTag}</p>
        <div class="panel">
          ${this.renderLeaderboardList(lb)}
          <div class="btn-row">
            <button class="btn-primary" id="btn-back">Back</button>
          </div>
        </div>
      </div>
    `;
    this.root.querySelector("#btn-back")!.addEventListener("click", () => this.handlers.onBackMenu());
  }

  private renderLeaderboardList(lb: LeaderboardEntry[]): string {
    if (!lb.length) {
      return `<p class="empty-lb">No legends yet — finish a race to claim the first lanai seat.</p>`;
    }
    return `<ol class="leaderboard">${lb
      .map((e, i) => {
        const cart = CARTS.find((c) => c.id === e.cartId)?.shortName ?? e.cartId;
        const driver = DRIVERS.find((d) => d.id === e.driverId);
        const dem = driver ? driverEmoji(driver) : "🏎️";
        return `<li>
          <span class="rank">#${i + 1}</span>
          <div class="who">${escapeHtml(e.playerName)} ${dem}
            <span>${cart} · P${e.place} · ${formatTime(e.timeSec)}</span>
          </div>
          <span class="score">${e.score.toLocaleString()}</span>
        </li>`;
      })
      .join("")}</ol>`;
  }

  showHow() {
    this.clear();
    this.root.innerHTML = `
      <div class="screen">
        <p class="brand-kicker">Cart-path handbook</p>
        <h1>How to Play</h1>
        <div class="panel" style="max-width:640px">
          <p style="margin-top:0"><strong>Goal:</strong> Pick a themed Town Square area, then complete <strong>3 laps</strong> of a local cart-path loop around that square and nearby rec centers (map-placed). Fresh path every race.</p>
          <p><strong>Areas:</strong> Spanish Springs (southwest plaza) · Sumter Landing (lighthouse lakeside) · Brownwood Paddock Square (Old Florida ranch) · Eastport (mid-century charm) · Sawgrass Grove (orange-grove Market).</p>
          <p><strong>Rival skill:</strong> Lanai Learner (easy) · Happy Hour Hotshot (medium) · Turnpike Terror (hard). AI holds the cart path better as difficulty rises.</p>
          <p><strong>Camera:</strong> Mario Kart–style chase cam — behind your cart, looking down the road (not top-down).</p>
          <p><strong>Controls:</strong> WASD / arrows to drive. <strong>S / ↓</strong> brakes, then reverses. <strong>Space</strong> (or ●) to fire. <strong>G</strong> (or Pass) waves your HOA gate pass at a community gate — gates stay closed until you wave up close. On phones, tilt left/right to steer, tip the phone forward to go, and tip it back to brake. Tune how twitchy that feels in <strong>Settings</strong> — every phone and every driver is different.</p>
          <p><strong>Weapons by cart:</strong> Yamaha → golf balls · Hot Rod → fireballs · Evolution → loofahs. Limited ammo (8). Drive over matching <strong>recharge pads</strong> on the road for +3. Off-path is slow; ponds are crawl-speed.</p>
          <p><strong>Hazards</strong> appear on the road ahead — no name tags. Learn them by sight:</p>
          <ul style="color:var(--muted);line-height:1.5;margin:0;padding-left:1.2rem">
            <li>White dimpled golf ball zipping across</li>
            <li>Turtle with plated shell and little legs</li>
            <li>Green gator with snout, ridges, and tail</li>
            <li>Storm cloud with a thin blue-white lightning strike</li>
            <li>Tipsy villager (bright shirt, cup, leaning)</li>
            <li>White cart with red/blue light bar (cart cop)</li>
            <li>Older villager with cane, arm raised (“slow down!”)</li>
            <li>Palm fronds on the pavement (after a storm)</li>
            <li>Big yellow/orange pothole with cones — fall in and you’re stuck about 5 seconds</li>
          </ul>
          <p><strong>Score:</strong> Speed + landmark bonuses − hazard penalties + finish place. Top runs land on the <em>${leaderboardTitle()}</em> board.</p>
          ${
            isNativeShell()
              ? ""
              : `<p><strong>Tips:</strong> From the main menu, tip $1 / $3 / $5 via Stripe. Your highest tip paints a supporter flag on every cart you race — red, blue, or gold — with the golf-ball mascot logo.</p>`
          }
          <p><strong>Villages flavor:</strong> Every loop has several <strong>roundabouts</strong> and occasional <strong>community gates</strong>. Pull up to the post and wave your gate pass — they will not open by themselves.</p>
          <div class="btn-row">
            <button class="btn-primary" id="btn-back">Got it</button>
          </div>
        </div>
      </div>
    `;
    this.root.querySelector("#btn-back")!.addEventListener("click", () => this.handlers.onBackMenu());
  }

  showSettings() {
    this.clear();
    const s = getControlSettings();
    this.root.innerHTML = `
      <div class="screen">
        <p class="brand-kicker">Cart-path cockpit</p>
        <h1>Settings</h1>
        <p class="tagline">Every phone and every pair of hands is different. Set how strongly the cart answers left, right, gas, and brake.</p>
        <div class="panel settings-panel">
          ${this.renderSensitivitySliders(s)}
          <div class="btn-row">
            <button class="btn-secondary" id="btn-reset-feel" type="button">Reset to default</button>
            ${
              isTiltPreferred()
                ? `<button class="btn-secondary" id="btn-recenter-tilt" type="button">Recenter tilt</button>`
                : ""
            }
            <button class="btn-primary" id="btn-back">Done</button>
          </div>
        </div>
      </div>
    `;
    this.bindSensitivitySliders(this.root);
    this.root.querySelector("#btn-reset-feel")?.addEventListener("click", () => {
      resetControlSettings();
      this.showSettings();
    });
    this.root.querySelector("#btn-recenter-tilt")?.addEventListener("click", () => {
      this.handlers.onRecenterTilt();
    });
    this.root.querySelector("#btn-back")!.addEventListener("click", () => this.handlers.onBackMenu());
  }

  private renderSensitivitySliders(s: ReturnType<typeof getControlSettings>): string {
    const steer = sensToSlider(s.steerSens);
    const drive = sensToSlider(s.driveSens);
    return `
      <div class="feel-sliders">
        <label class="feel-row">
          <div class="feel-head">
            <span class="feel-title">Steering · left / right</span>
            <span class="feel-value" data-feel="steer">${sliderFeelLabel(steer)}</span>
          </div>
          <input
            class="feel-slider"
            id="feel-steer"
            type="range"
            min="${SENS_SLIDER_MIN}"
            max="${SENS_SLIDER_MAX}"
            step="1"
            value="${steer}"
            aria-label="Steering sensitivity"
          />
          <div class="feel-ends"><span>Gentle</span><span>Twitchy</span></div>
          <p class="feel-hint">Phones: how far you tilt to turn. Keyboard / on-screen arrows: how quickly the cart yaws.</p>
        </label>
        <label class="feel-row">
          <div class="feel-head">
            <span class="feel-title">Drive · forward / back</span>
            <span class="feel-value" data-feel="drive">${sliderFeelLabel(drive)}</span>
          </div>
          <input
            class="feel-slider"
            id="feel-drive"
            type="range"
            min="${SENS_SLIDER_MIN}"
            max="${SENS_SLIDER_MAX}"
            step="1"
            value="${drive}"
            aria-label="Gas and brake sensitivity"
          />
          <div class="feel-ends"><span>Gentle</span><span>Twitchy</span></div>
          <p class="feel-hint">Phones: how far you tip for gas or brake. Keyboard / buttons: how quickly you speed up or reverse.</p>
        </label>
      </div>
    `;
  }

  private bindSensitivitySliders(root: ParentNode) {
    const steer = root.querySelector("#feel-steer") as HTMLInputElement | null;
    const drive = root.querySelector("#feel-drive") as HTMLInputElement | null;
    const bind = (el: HTMLInputElement | null, key: "steerSens" | "driveSens", labelKey: string) => {
      if (!el) return;
      const apply = () => {
        const slider = Number(el.value);
        setControlSettings({ [key]: sliderToSens(slider) });
        const tag = root.querySelector(`[data-feel="${labelKey}"]`);
        if (tag) tag.textContent = sliderFeelLabel(slider);
      };
      el.addEventListener("input", apply);
      el.addEventListener("change", apply);
    };
    bind(steer, "steerSens", "steer");
    bind(drive, "driveSens", "drive");
  }

  /** Step 1: pick a themed Town Square drive area */
  showAreaSelect() {
    this.clear();
    const selected = this.select.areaId;
    this.root.innerHTML = `
      <div class="screen screen-areas">
        <p class="brand-kicker">Town Square · drive areas</p>
        <h1>Where to Race?</h1>
        <p class="tagline">Pick a Town Square. Each one has its own loop and soundtrack.</p>
        <div class="panel">
          <p class="section-label" style="margin-top:0">Choose a Town Square</p>
          <div class="choice-grid area-grid" id="areas"></div>
          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back</button>
            <button class="btn-primary" id="btn-continue">Choose Cart &amp; Driver</button>
          </div>
        </div>
      </div>
    `;

    const areasEl = this.root.querySelector("#areas")!;
    const blurbs: Record<string, string> = {
      "spanish-springs": "Original plaza",
      "lake-sumter": "Lake & lighthouse",
      brownwood: "Old Florida ranch",
      eastport: "East-side hub",
      "sawgrass-grove": "Grove & market",
    };
    areasEl.innerHTML = DRIVE_AREAS.map((a) => {
      return `
      <button type="button" class="choice-card area-card ${a.id === selected ? "selected" : ""}" data-area="${a.id}">
        <div class="area-banner" style="background:${a.cardGradient}">
          <span class="area-emoji">${a.emoji}</span>
        </div>
        <div class="title">${escapeHtml(a.shortName)}</div>
        <div class="area-theme-line">${escapeHtml(blurbs[a.id] ?? a.themeLine)}</div>
      </button>`;
    }).join("");

    areasEl.querySelectorAll("[data-area]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.select.areaId = (btn as HTMLElement).dataset.area as AreaId;
        localStorage.setItem("vgch-area-id", this.select.areaId);
        areasEl.querySelectorAll(".area-card").forEach((el) => el.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });

    this.root.querySelector("#btn-back")!.addEventListener("click", () => {
      this.handlers.onBackMenu();
    });
    this.root.querySelector("#btn-continue")!.addEventListener("click", () => {
      localStorage.setItem("vgch-area-id", this.select.areaId);
      this.showSelect();
    });
  }

  /** Step 2: name, cart, critter — then start race */
  showSelect() {
    this.clear();
    const area = DRIVE_AREAS.find((a) => a.id === this.select.areaId) ?? DRIVE_AREAS[0];
    this.root.innerHTML = `
      <div class="screen screen-garage">
        <p class="brand-kicker">Garage · critter paddock</p>
        <h1>Choose Your Ride</h1>
        <div class="panel garage-panel">
          <div class="area-picked">
            <span class="area-picked-emoji">${area.emoji}</span>
            <div>
              <strong>${escapeHtml(area.name)}</strong>
              <div class="sub" style="margin:0">${escapeHtml(area.themeLine)}</div>
            </div>
            <button type="button" class="btn-secondary btn-compact" id="btn-change-area">Change area</button>
          </div>

          <div class="name-block" id="name-block">
            <label class="section-label name-label" for="player-name">Your racer name (required)</label>
            <input
              class="name-input"
              id="player-name"
              type="text"
              maxlength="20"
              placeholder="Type your name — e.g. Lanai Larry"
              value="${escapeAttr(this.select.playerName)}"
              autocomplete="nickname"
              spellcheck="false"
            />
            <p id="name-hint" class="name-hint">This shows on the leaderboard, HUD, and above your cart. Every player should enter their own name.</p>
          </div>

          <p class="section-label">Rival pack skill</p>
          <div class="choice-grid area-grid" id="difficulties"></div>

          <p class="section-label">Vehicle</p>
          <div class="choice-grid" id="carts"></div>

          <p class="section-label">Driver (Florida critters)</p>
          <div class="choice-grid" id="drivers"></div>

          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back</button>
            <button class="btn-primary" id="btn-race">Hit the Cart Path</button>
          </div>
        </div>
      </div>
    `;

    const diffsEl = this.root.querySelector("#difficulties")!;
    diffsEl.innerHTML = DIFFICULTIES.map(
      (d) => `
      <button type="button" class="choice-card ${d.id === this.select.difficultyId ? "selected" : ""}" data-diff="${d.id}">
        <div class="area-banner" style="background:${d.cardGradient}">
          <span class="area-emoji">${d.emoji}</span>
        </div>
        <div class="title">${escapeHtml(d.name)}</div>
        <div class="sub">${escapeHtml(d.blurb)}</div>
      </button>`
    ).join("");

    const cartsEl = this.root.querySelector("#carts")!;
    cartsEl.innerHTML = CARTS.map(
      (c) => `
      <button type="button" class="choice-card cart-photo-card ${c.id === this.select.cartId ? "selected" : ""}" data-cart="${c.id}">
        <img class="cart-ref-thumb cart-photo-thumb" src="${assetUrl(`assets/carts/refs/${c.id}.jpg`)}" alt="${c.name}" width="200" height="140" />
        <div class="title">${c.emoji} ${c.name}</div>
        <div class="sub">${c.blurb}</div>
        <div class="stat-pills">
          <span class="pill fast">Top ${Math.round(c.topSpeed)}</span>
          <span class="pill accel">Accel ${Math.round(c.accel)}</span>
          <span class="pill handle">Handle ${c.handling.toFixed(1)}</span>
        </div>
      </button>`
    ).join("");

    const driversEl = this.root.querySelector("#drivers")!;
    driversEl.innerHTML = DRIVERS.map(
      (d) => `
      <button type="button" class="choice-card ${d.id === this.select.driverId ? "selected" : ""}" data-driver="${d.id}">
        <span class="emoji">${driverEmoji(d)}</span>
        <div class="title">${d.name}</div>
        <div class="sub">${d.species}. ${d.blurb}</div>
      </button>`
    ).join("");

    const nameInput = this.root.querySelector("#player-name") as HTMLInputElement;
    const saveName = () => {
      this.select.playerName = nameInput.value.slice(0, 20);
      localStorage.setItem("vgch-player-name", this.select.playerName.trim());
    };
    nameInput.addEventListener("input", saveName);
    nameInput.addEventListener("change", saveName);
    if (!this.select.playerName.trim()) {
      setTimeout(() => nameInput.focus(), 50);
    }

    diffsEl.querySelectorAll("[data-diff]").forEach((btn) => {
      btn.addEventListener("click", () => {
        saveName();
        this.select.difficultyId = (btn as HTMLElement).dataset.diff as DifficultyId;
        localStorage.setItem("vgch-difficulty-id", this.select.difficultyId);
        this.showSelect();
      });
    });
    cartsEl.querySelectorAll("[data-cart]").forEach((btn) => {
      btn.addEventListener("click", () => {
        saveName();
        this.select.cartId = (btn as HTMLElement).dataset.cart as CartId;
        this.showSelect();
      });
    });
    driversEl.querySelectorAll("[data-driver]").forEach((btn) => {
      btn.addEventListener("click", () => {
        saveName();
        this.select.driverId = (btn as HTMLElement).dataset.driver as DriverId;
        this.showSelect();
      });
    });

    this.root.querySelector("#btn-change-area")!.addEventListener("click", () => {
      saveName();
      this.showAreaSelect();
    });
    this.root.querySelector("#btn-back")!.addEventListener("click", () => {
      saveName();
      this.showAreaSelect();
    });
    this.root.querySelector("#btn-race")!.addEventListener("click", () => {
      saveName();
      const name = nameInput.value.trim().slice(0, 20);
      if (name.length < 2) {
        nameInput.focus();
        nameInput.style.borderColor = "var(--sunset)";
        const hint = this.root.querySelector("#name-hint") as HTMLElement | null;
        if (hint) {
          hint.textContent = "Please enter at least 2 characters for your racer name.";
          hint.style.color = "var(--sunset)";
        }
        return;
      }
      this.select.playerName = name;
      localStorage.setItem("vgch-player-name", name);
      localStorage.setItem("vgch-area-id", this.select.areaId);
      localStorage.setItem("vgch-difficulty-id", this.select.difficultyId);
      this.handlers.onRace({ ...this.select });
    });
  }

  showRaceHud() {
    this.clear();
    this.root.innerHTML = `
      <div class="screen hud">
        <div class="hud-race">
          <div class="hud-vitals">
            <div class="hud-chip"><span class="label">Place</span><span id="hud-place">1st</span></div>
            <div class="hud-chip"><span class="label">Lap</span><span id="hud-lap">1 / 3</span></div>
          </div>
          <div class="mini-map-wrap" title="Track overview">
            <div class="mini-map-label">Map</div>
            <canvas id="minimap" width="168" height="168"></canvas>
          </div>
        </div>
        <div class="hud-center">
          <div class="wrong-way" id="hud-wrong-way" hidden>WRONG WAY</div>
          <div class="banner" id="hud-banner" style="display:none"></div>
          <div class="banner sub" id="hud-toast" style="display:none"></div>
        </div>
        <button type="button" class="btn-stop-race" id="btn-stop-race" title="End race early">■ Stop</button>
        <button type="button" class="btn-hud-settings" id="btn-hud-settings" title="Control sensitivity">⚙</button>
        <div class="hud-settings" id="hud-settings" hidden>
          <div class="hud-settings-card">
            <div class="hud-settings-top">
              <strong>Control feel</strong>
              <button type="button" class="btn-secondary btn-compact" id="hud-settings-close">Close</button>
            </div>
            ${this.renderSensitivitySliders(getControlSettings())}
            <div class="hud-settings-actions">
              <button type="button" class="btn-secondary btn-compact" id="hud-settings-reset">Reset</button>
              ${
                isTiltPreferred()
                  ? `<button type="button" class="btn-secondary btn-compact" id="hud-settings-recenter">Recenter tilt</button>`
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="touch-controls" id="touch">
          <div class="touch-pad touch-drive">
            <button class="touch-btn" data-k="left">◀</button>
            <button class="touch-btn" data-k="right">▶</button>
          </div>
          <div class="touch-pad touch-actions">
            <button class="touch-btn touch-gate" data-k="gate" aria-label="Gate pass">
              <span class="touch-btn-k">G</span>
              <span class="touch-btn-sub">Pass</span>
            </button>
            <button class="touch-btn touch-fire" data-k="fire">●</button>
            <button class="touch-btn touch-drive" data-k="brake">⬇</button>
            <button class="touch-btn touch-drive" data-k="throttle">⬆</button>
          </div>
        </div>
        <div class="tilt-hint" id="tilt-hint" hidden>
          <span>Tilt to drive · tip forward to go · back to brake</span>
          <button type="button" class="tilt-recenter" id="tilt-recenter">Recenter</button>
        </div>
      </div>
    `;

    this.root.querySelector("#btn-stop-race")!.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handlers.onStopRace();
    });

    const hudSettings = this.root.querySelector("#hud-settings") as HTMLElement | null;
    this.root.querySelector("#btn-hud-settings")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hudSettings) return;
      hudSettings.hidden = !hudSettings.hidden;
    });
    this.root.querySelector("#hud-settings-close")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (hudSettings) hudSettings.hidden = true;
    });
    this.root.querySelector("#hud-settings-reset")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetControlSettings();
      const card = this.root.querySelector(".hud-settings-card");
      const slidersHost = card?.querySelector(".feel-sliders");
      if (slidersHost) {
        slidersHost.outerHTML = this.renderSensitivitySliders(getControlSettings());
        this.bindSensitivitySliders(this.root);
      }
    });
    this.root.querySelector("#hud-settings-recenter")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handlers.onRecenterTilt();
    });

    const touch = this.root.querySelector("#touch") as HTMLElement;
    const phone = matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;
    if (phone) {
      touch.classList.add("show");
      if (isTiltPreferred()) this.setDrivePadMode("tilt");
    }

    this.bindSensitivitySliders(this.root);

    this.root.querySelector("#tilt-recenter")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handlers.onRecenterTilt();
      const hint = this.root.querySelector("#tilt-hint") as HTMLElement | null;
      if (hint) {
        hint.classList.add("flash");
        window.setTimeout(() => hint.classList.remove("flash"), 700);
      }
    });

    const bind = (el: Element, key: "throttle" | "brake" | "left" | "right" | "fire" | "gate") => {
      const down = (e: Event) => {
        e.preventDefault();
        this.handlers.onTouch(key, true);
      };
      const up = (e: Event) => {
        e.preventDefault();
        this.handlers.onTouch(key, false);
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointerleave", up);
      el.addEventListener("pointercancel", up);
    };

    this.root.querySelectorAll("[data-k]").forEach((el) => {
      bind(el, (el as HTMLElement).dataset.k as "throttle" | "brake" | "left" | "right" | "fire" | "gate");
    });
  }

  /** Tilt mode hides drive buttons and keeps a fire button. Buttons is the fallback. */
  setDrivePadMode(mode: "tilt" | "buttons") {
    const hud = this.root.querySelector(".screen.hud") as HTMLElement | null;
    const touch = this.root.querySelector("#touch") as HTMLElement | null;
    const hint = this.root.querySelector("#tilt-hint") as HTMLElement | null;
    if (!touch) return;
    touch.classList.add("show");
    if (mode === "tilt") {
      hud?.classList.add("tilt-drive");
      touch.classList.add("tilt-mode");
      if (hint) hint.hidden = false;
    } else {
      hud?.classList.remove("tilt-drive");
      touch.classList.remove("tilt-mode");
      if (hint) hint.hidden = true;
    }
  }

  updateHud(opts: {
    place: number;
    lap: number;
    laps: number;
    score: number;
    time: number;
    playerName?: string;
    areaName?: string;
    ammoLabel?: string;
    banner?: string | null;
    toast?: string | null;
    landmark?: string | null;
    wrongWay?: boolean;
  }) {
    const place = this.root.querySelector("#hud-place");
    const lap = this.root.querySelector("#hud-lap");
    if (!place || !lap) return;
    place.textContent = ordinal(opts.place);
    // opts.lap = completed laps (0 at start). Display current lap number 1..laps.
    const currentLap = Math.min(opts.lap + 1, opts.laps);
    lap.textContent = `${currentLap} / ${opts.laps}`;

    const wrong = this.root.querySelector("#hud-wrong-way") as HTMLElement | null;
    if (wrong) wrong.hidden = !opts.wrongWay;

    const banner = this.root.querySelector("#hud-banner") as HTMLElement;
    const toast = this.root.querySelector("#hud-toast") as HTMLElement;
    if (opts.banner) {
      banner.style.display = "block";
      banner.textContent = opts.banner;
    } else {
      banner.style.display = "none";
    }
    if (opts.toast) {
      toast.style.display = "block";
      toast.textContent = opts.toast;
      toast.style.background = opts.toast.includes("path")
        ? "rgba(28,36,48,0.72)"
        : "rgba(232,93,76,0.85)";
    } else if (opts.landmark) {
      toast.style.display = "block";
      toast.textContent = `📍 ${opts.landmark}`;
      toast.style.background = "rgba(31,107,74,0.85)";
    } else {
      toast.style.display = "none";
      toast.style.background = "";
    }
  }

  getMiniMapCanvas(): HTMLCanvasElement | null {
    return this.root.querySelector("#minimap");
  }

  showResults(result: RaceResult, alreadySubmitted: boolean) {
    this.clear();
    const p = result.player;
    const high = isHighScore(result.score);
    const areaLabel = result.areaName ? ` · ${escapeHtml(result.areaName)}` : "";
    const rows = result.racers
      .map((r) => {
        const you = r.isPlayer ? " you" : "";
        return `<div class="result-row${you}">
          <strong>${ordinal(r.place)}</strong>
          <div>${escapeHtml(r.name)} ${driverEmoji(r.driver)}
            <div style="font-size:0.78rem;color:var(--muted)">${r.cart.shortName}${r.finished ? "" : " · DNF"}</div>
          </div>
          <strong>${r.isPlayer ? result.score.toLocaleString() : "—"}</strong>
        </div>`;
      })
      .join("");

    this.root.innerHTML = `
      <div class="screen">
        <p class="brand-kicker">${high ? "New lanai energy" : "Race complete"}${areaLabel}</p>
        <h1>${p.place === 1 ? "Village Champion!" : p.place === 2 ? "Silver Square!" : p.place === 3 ? "Bronze Cart Path!" : "Finished!"}</h1>
        <p class="tagline">Score <strong>${result.score.toLocaleString()}</strong> · ${formatTime(result.timeSec)} · ${p.hazardsHit} hazards hit · ${p.checkpoints.size} landmarks</p>
        <div class="panel">
          <h2 style="font-size:1.15rem;margin-bottom:0.25rem">Finishing order</h2>
          <div class="results-grid">${rows}</div>
          <div class="btn-row">
            ${
              !alreadySubmitted
                ? `<button class="btn-gold" id="btn-submit">Save to ${leaderboardTitle()}</button>`
                : `<button class="btn-gold" id="btn-submit" disabled>Saved ✓</button>`
            }
            <button class="btn-sunset" id="btn-share">Copy challenge</button>
            <button class="btn-primary" id="btn-again">Race Again</button>
            <button class="btn-secondary" id="btn-menu">Main Menu</button>
          </div>
        </div>
      </div>
    `;

    this.root.querySelector("#btn-again")!.addEventListener("click", () => this.handlers.onPlayAgain());
    this.root.querySelector("#btn-menu")!.addEventListener("click", () => this.handlers.onBackMenu());
    const share = this.root.querySelector("#btn-share") as HTMLButtonElement | null;
    share?.addEventListener("click", async () => {
      const line = challengeLine(result);
      const ok = await copyText(line);
      if (share) share.textContent = ok ? "Copied ✓" : "Copy failed";
      window.setTimeout(() => {
        if (share) share.textContent = "Copy challenge";
      }, 1800);
    });
    const submit = this.root.querySelector("#btn-submit") as HTMLButtonElement;
    if (!alreadySubmitted) {
      submit.addEventListener("click", () => {
        submitScore({
          playerName: p.name,
          score: result.score,
          place: p.place,
          timeSec: result.timeSec,
          cartId: p.cart.id,
          driverId: p.driver.id,
          laps: p.lap,
          hazardsHit: p.hazardsHit,
        });
        submit.disabled = true;
        submit.textContent = "Saved ✓";
      });
    }
  }
}

function challengeLine(result: RaceResult) {
  const place = ordinal(result.player.place);
  const area = result.areaName ? ` at ${result.areaName}` : "";
  return `I scored ${result.score.toLocaleString()} (${place})${area} on Golf Cart Hero (Lanai Legends) — beat me: ${BRAND.playUrl}`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

function ordinal(n: number) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function formatTime(sec: number) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  const frac = Math.floor((s % 1) * 10);
  return `${m}:${r.toString().padStart(2, "0")}.${frac}`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string) {
  return escapeHtml(s);
}
