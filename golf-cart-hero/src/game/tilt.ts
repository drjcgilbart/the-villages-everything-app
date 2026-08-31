import { isNativeShell } from "./nativeShell";
import { getControlSettings } from "./settings";

type ScreenAngle = 0 | 90 | 180 | 270;

const STEER_DEAD = 2;
const STEER_FULL = 13;
const PITCH_DEAD = 2;
const PITCH_FULL_GAS = 10;
const PITCH_FULL_BRAKE = 9;
const SMOOTH = 26;
const CALIB_SECONDS = 0.7;

function screenAngle(): ScreenAngle {
  const o = window.screen?.orientation?.angle;
  if (typeof o === "number") {
    const n = ((Math.round(o / 90) * 90) % 360 + 360) % 360;
    if (n === 90 || n === 180 || n === 270) return n;
    return 0;
  }
  const w = window.orientation;
  if (w === 90) return 90;
  if (w === -90 || w === 270) return 270;
  if (w === 180) return 180;
  return window.innerWidth > window.innerHeight ? 90 : 0;
}

/** Roll: −left / +right. Pitch: device beta-style, ~90 when held upright. */
function remapOrientation(beta: number, gamma: number, angle: ScreenAngle): {
  roll: number;
  pitch: number;
} {
  switch (angle) {
    case 90:
      return { roll: beta, pitch: -gamma };
    case 180:
      return { roll: -gamma, pitch: -beta };
    case 270:
      return { roll: -beta, pitch: gamma };
    default:
      return { roll: gamma, pitch: beta };
  }
}

function remapMotion(ax: number, ay: number, az: number, angle: ScreenAngle): {
  roll: number;
  pitch: number;
} {
  let x = ax;
  let y = ay;
  const z = az;
  if (angle === 90) {
    x = ay;
    y = -ax;
  } else if (angle === 180) {
    x = -ax;
    y = -ay;
  } else if (angle === 270) {
    x = -ay;
    y = ax;
  }
  const roll = (Math.atan2(x, Math.hypot(y, z)) * 180) / Math.PI;
  const pitch = (Math.atan2(y, Math.hypot(x, z)) * 180) / Math.PI;
  return { roll, pitch };
}

function shape(value: number, dead: number, full: number): number {
  const a = Math.abs(value);
  if (a <= dead) return 0;
  const t = Math.min(1, (a - dead) / Math.max(1, full - dead));
  // Slightly aggressive near center so a small tilt still bites.
  const curved = Math.pow(t, 0.72);
  return Math.sign(value) * curved;
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent || "");
}

/** Phones / Play app: use tilt. Desktops keep WASD only. */
export function isTiltPreferred(): boolean {
  if (typeof window === "undefined") return false;
  if (isNativeShell() || isAndroid()) return true;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  return (coarse || noHover) && window.innerWidth < 1100;
}

export class TiltController {
  steer = 0;
  throttle = 0;
  brake = 0;
  available = false;
  listening = false;

  private rawRoll = 0;
  private rawPitch = 90;
  private smoothRoll = 0;
  private smoothPitch = 90;
  private restRoll = 0;
  private restPitch = 70;
  private hasSample = false;
  private calibrating = true;
  private calibT = 0;
  private calibRoll = 0;
  private calibPitch = 0;
  private calibN = 0;
  private gotOrientation = false;

  private unsubs: Array<() => void> = [];

  get ready(): boolean {
    return this.hasSample;
  }

  async start(): Promise<boolean> {
    this.stop();
    this.listening = true;
    this.calibrating = true;
    this.calibT = 0;
    this.calibN = 0;
    this.calibRoll = 0;
    this.calibPitch = 0;
    this.hasSample = false;
    this.gotOrientation = false;
    this.steer = 0;
    this.throttle = 0;
    this.brake = 0;

    const granted = await this.requestPermission();
    if (!granted) {
      this.listening = false;
      return false;
    }

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      this.gotOrientation = true;
      const mapped = remapOrientation(e.beta, e.gamma, screenAngle());
      this.pushSample(mapped.roll, mapped.pitch);
    };

    const onMotion = (e: DeviceMotionEvent) => {
      if (this.gotOrientation) return;
      const g = e.accelerationIncludingGravity;
      if (!g || g.x == null || g.y == null || g.z == null) return;
      const mapped = remapMotion(g.x, g.y, g.z, screenAngle());
      this.pushSample(mapped.roll, mapped.pitch);
    };

    window.addEventListener("deviceorientation", onOrient, true);
    window.addEventListener("deviceorientationabsolute", onOrient as EventListener, true);
    window.addEventListener("devicemotion", onMotion, true);
    this.unsubs.push(() => {
      window.removeEventListener("deviceorientation", onOrient, true);
      window.removeEventListener("deviceorientationabsolute", onOrient as EventListener, true);
      window.removeEventListener("devicemotion", onMotion, true);
    });

    const onRotate = () => this.recenter();
    window.addEventListener("orientationchange", onRotate);
    const so = window.screen?.orientation;
    so?.addEventListener?.("change", onRotate);
    this.unsubs.push(() => {
      window.removeEventListener("orientationchange", onRotate);
      so?.removeEventListener?.("change", onRotate);
    });

    this.available = true;
    return true;
  }

  stop() {
    this.listening = false;
    this.steer = 0;
    this.throttle = 0;
    this.brake = 0;
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }

  recenter() {
    this.calibrating = true;
    this.calibT = 0;
    this.calibN = 0;
    this.calibRoll = 0;
    this.calibPitch = 0;
    this.steer = 0;
    this.throttle = 0;
    this.brake = 0;
    if (this.hasSample) {
      this.restRoll = this.smoothRoll;
      this.restPitch = this.smoothPitch;
    }
  }

  update(dt: number) {
    if (!this.listening || !this.hasSample) {
      this.steer = 0;
      this.throttle = 0;
      this.brake = 0;
      return;
    }

    const k = 1 - Math.exp(-SMOOTH * dt);
    this.smoothRoll += (this.rawRoll - this.smoothRoll) * k;
    this.smoothPitch += (this.rawPitch - this.smoothPitch) * k;

    if (this.calibrating) {
      this.calibT += dt;
      this.calibRoll += this.smoothRoll;
      this.calibPitch += this.smoothPitch;
      this.calibN += 1;
      if (this.calibT >= CALIB_SECONDS && this.calibN > 4) {
        this.restRoll = this.calibRoll / this.calibN;
        this.restPitch = this.calibPitch / this.calibN;
        this.calibrating = false;
      } else {
        this.steer = 0;
        this.throttle = 0;
        this.brake = 0;
        return;
      }
    }

    const roll = this.smoothRoll - this.restRoll;
    const pitch = this.smoothPitch - this.restPitch;

    const { steerSens, driveSens } = getControlSettings();
    const steerFull = STEER_FULL / steerSens;
    const steerDead = Math.max(0.55, STEER_DEAD / Math.sqrt(steerSens));
    const gasFull = PITCH_FULL_GAS / driveSens;
    const brakeFull = PITCH_FULL_BRAKE / driveSens;
    const pitchDead = Math.max(0.55, PITCH_DEAD / Math.sqrt(driveSens));

    this.steer = shape(roll, steerDead, steerFull);

    // Tip the top of the phone away from you (pitch decreases from rest) = gas.
    // Tip the top toward you (pitch increases) = brake.
    const gas = shape(-pitch, pitchDead, gasFull);
    const brake = shape(pitch, pitchDead, brakeFull);
    this.throttle = Math.max(0, gas);
    this.brake = Math.max(0, brake);
  }

  private pushSample(roll: number, pitch: number) {
    if (!Number.isFinite(roll) || !Number.isFinite(pitch)) return;
    this.rawRoll = roll;
    this.rawPitch = pitch;
    if (!this.hasSample) {
      this.smoothRoll = roll;
      this.smoothPitch = pitch;
      this.hasSample = true;
    }
  }

  private async requestPermission(): Promise<boolean> {
    try {
      const Orient = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof Orient.requestPermission === "function") {
        const state = await Orient.requestPermission();
        if (state !== "granted") return false;
      }
      const Motion = DeviceMotionEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof Motion.requestPermission === "function") {
        try {
          await Motion.requestPermission();
        } catch {
          /* orientation alone is enough */
        }
      }
      return true;
    } catch {
      return false;
    }
  }
}
