/**
 * Town-square race music — real-instrument / live-band tracks (not game synth).
 * One looping theme per Drive Area. Files live in public/assets/music/.
 *
 * Licensing notes: Wikimedia Commons / public-domain / free-use band recordings.
 * See public/assets/music/CREDITS.json for sources.
 */

import { assetUrl } from "./assetUrl";
import type { AreaId } from "./data/areas";

export type MusicTrack = {
  areaId: AreaId;
  /** Relative URL under public/ */
  src: string;
  title: string;
  artist: string;
  /** Short flavor line for HUD / menu */
  vibe: string;
};

/**
 * Prefer .mp3 when present; fall back to .ogg/.oga (all playable in modern browsers).
 * Paths are tried in order until one loads.
 */
export const AREA_MUSIC: Record<AreaId, MusicTrack> = {
  "spanish-springs": {
    areaId: "spanish-springs",
    src: assetUrl("assets/music/spanish-springs-full.mp3"),
    title: "Flamenco Melody",
    artist: "JCZA",
    vibe: "Spanish guitar · plaza nights",
  },
  "lake-sumter": {
    areaId: "lake-sumter",
    src: assetUrl("assets/music/lake-sumter-full.mp3"),
    title: "Dimensions in Blue",
    artist: "USAF Band of the West · Dimensions in Blue",
    vibe: "Lakeside big-band jazz",
  },
  brownwood: {
    areaId: "brownwood",
    src: assetUrl("assets/music/brownwood-full.mp3"),
    title: "The Great One Step",
    artist: "Victor Dance Orchestra (public domain)",
    vibe: "Old-time dance · paddock energy",
  },
  eastport: {
    areaId: "eastport",
    src: assetUrl("assets/music/eastport-full.mp3"),
    title: "BugaBlue",
    artist: "US Army Blues",
    vibe: "Mid-century blues · pavilion cool",
  },
  "sawgrass-grove": {
    areaId: "sawgrass-grove",
    src: assetUrl("assets/music/sawgrass-grove-full.mp3"),
    title: "Bossa Nova Groove",
    artist: "Play-along bossa (Wikimedia Commons)",
    vibe: "Citrus grove · easy bossa",
  },
};

const VOLUME = 0.52;

class RaceMusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentArea: AreaId | null = null;
  private unlocked = false;
  private muted = false;
  private preferredOn = true;
  private ctx: AudioContext | null = null;

  constructor() {
    this.muted = false;
    this.preferredOn = true;
    try {
      localStorage.removeItem("vgch-music-muted");
      localStorage.removeItem("vgch-music-off");
    } catch {
      /* ignore */
    }
  }

  isMuted() {
    return this.muted || !this.preferredOn;
  }

  /** Call from a user gesture (menu button / race start) so autoplay is allowed. */
  unlock() {
    this.unlocked = true;
    this.resumeContext();
    this.tryPlay();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.preferredOn = !muted;
    try {
      localStorage.setItem("vgch-music-muted", muted ? "1" : "0");
      localStorage.setItem("vgch-music-off", muted ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (this.audio) {
      this.audio.muted = muted;
      if (!muted && this.unlocked) this.tryPlay();
      else this.audio.pause();
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.isMuted());
    return this.isMuted();
  }

  getTrack(areaId: AreaId): MusicTrack {
    return AREA_MUSIC[areaId] ?? AREA_MUSIC["spanish-springs"];
  }

  playForArea(areaId: AreaId) {
    this.prepareForRace(areaId);
    this.startNow();
    return this.getTrack(areaId);
  }

  /**
   * Load on the Race tap (keeps the Android gesture) but stay silent
   * until startNow() when the countdown hits GO.
   */
  prepareForRace(areaId: AreaId) {
    this.unlocked = true;
    this.resumeContext();
    const track = this.getTrack(areaId);
    if (this.currentArea === areaId && this.audio) {
      this.audio.volume = 0;
      this.tryPlay();
      return;
    }
    this.stop();
    this.currentArea = areaId;
    this.audio = this.makePlayer(track.src);
    this.audio.volume = 0;
    this.tryPlay();
  }

  startNow() {
    if (!this.audio) return;
    this.audio.volume = VOLUME;
    this.tryPlay();
  }

  private makePlayer(src: string): HTMLAudioElement {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = VOLUME;
    audio.muted = this.muted || !this.preferredOn;
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    audio.style.display = "none";
    document.body.appendChild(audio);
    audio.addEventListener("canplay", () => this.tryPlay());
    audio.addEventListener("canplaythrough", () => this.tryPlay());
    audio.addEventListener("error", () => {
      console.warn("[music] failed to load", src, audio.error);
    });
    audio.src = src;
    audio.load();
    return audio;
  }

  private resumeContext() {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!this.ctx) this.ctx = new AC();
      if (this.ctx.state === "suspended") void this.ctx.resume();
    } catch {
      /* ignore */
    }
  }

  private tryPlay() {
    if (!this.audio || !this.preferredOn || this.muted) return;
    const play = this.audio.play();
    if (play) {
      play.catch((err) => {
        console.warn("[music] play blocked", err);
        window.setTimeout(() => {
          if (this.audio && this.unlocked && !this.muted) {
            void this.audio.play().catch(() => {});
          }
        }, 250);
      });
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
      this.audio.remove();
      this.audio = null;
    }
    this.currentArea = null;
  }
}

export const raceMusic = new RaceMusicPlayer();
