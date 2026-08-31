/**
 * Cartoon race SFX via Web Audio (no extra files).
 * Follows the music mute flag so one control quiets the whole game.
 */
import { raceMusic } from "./music";

type Wave = OscillatorType;

class RaceSfx {
  private ctx: AudioContext | null = null;
  private lastAt: Record<string, number> = {};

  unlock() {
    this.ensure();
  }

  countdown(n: number) {
    const freq = n >= 3 ? 392 : n === 2 ? 440 : 494;
    this.beep(freq, 0.11, "square", 0.09);
  }

  go() {
    this.beep(523, 0.1, "square", 0.1);
    this.beep(784, 0.22, "triangle", 0.12, 0.09);
  }

  fire(kind: "golf-ball" | "fireball" | "loofah" | "bolt") {
    if (kind === "fireball") {
      this.sweep(220, 90, 0.22, "sawtooth", 0.07);
      this.noise(0.08, 0.04);
    } else if (kind === "loofah") {
      this.beep(180, 0.14, "triangle", 0.08);
      this.beep(140, 0.16, "sine", 0.05, 0.04);
    } else if (kind === "bolt") {
      this.beep(1240, 0.05, "square", 0.06);
      this.sweep(980, 220, 0.16, "sawtooth", 0.05);
      this.noise(0.05, 0.03);
    } else {
      this.beep(880, 0.06, "square", 0.07);
      this.sweep(720, 280, 0.12, "triangle", 0.05);
    }
  }

  empty() {
    this.beep(160, 0.07, "square", 0.04);
  }

  pickup() {
    this.beep(523, 0.07, "triangle", 0.08);
    this.beep(659, 0.07, "triangle", 0.08, 0.06);
    this.beep(784, 0.12, "triangle", 0.09, 0.12);
  }

  gatePass() {
    this.beep(698, 0.08, "sine", 0.08);
    this.beep(880, 0.16, "sine", 0.09, 0.07);
  }

  gateMiss() {
    this.beep(196, 0.12, "square", 0.05);
  }

  gateThud() {
    if (!this.gap("gate-thud", 0.35)) return;
    this.beep(70, 0.12, "sine", 0.12);
    this.noise(0.05, 0.05);
  }

  hazard() {
    this.sweep(240, 80, 0.22, "sawtooth", 0.08);
    this.noise(0.1, 0.06);
  }

  tagged() {
    this.sweep(620, 180, 0.18, "square", 0.07);
  }

  spinOut() {
    this.sweep(340, 90, 0.32, "sawtooth", 0.08);
  }

  bump() {
    if (!this.gap("bump", 0.4)) return;
    this.beep(110, 0.08, "triangle", 0.08);
    this.noise(0.04, 0.04);
  }

  smash() {
    this.noise(0.12, 0.07);
    this.beep(140, 0.1, "square", 0.05);
  }

  lap() {
    this.beep(659, 0.08, "triangle", 0.08);
    this.beep(880, 0.14, "triangle", 0.09, 0.07);
  }

  checkpoint() {
    this.beep(784, 0.08, "sine", 0.07);
    this.beep(988, 0.14, "sine", 0.08, 0.08);
  }

  finish() {
    this.beep(523, 0.1, "triangle", 0.1);
    this.beep(659, 0.1, "triangle", 0.1, 0.1);
    this.beep(784, 0.12, "triangle", 0.1, 0.2);
    this.beep(1046, 0.28, "triangle", 0.11, 0.32);
  }

  private gap(key: string, minSec: number) {
    const now = performance.now() / 1000;
    if ((this.lastAt[key] ?? 0) + minSec > now) return false;
    this.lastAt[key] = now;
    return true;
  }

  private ensure(): AudioContext | null {
    if (raceMusic.isMuted()) return null;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      if (!this.ctx) this.ctx = new AC();
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private beep(freq: number, dur: number, type: Wave, gain: number, delay = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private sweep(from: number, to: number, dur: number, type: Wave, gain: number) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, gain: number) {
    const ctx = this.ensure();
    if (!ctx) return;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    src.buffer = buf;
    const t0 = ctx.currentTime;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }
}

export const sfx = new RaceSfx();
