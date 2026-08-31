import { TiltController } from "./tilt";

export type InputState = {
  throttle: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
  gate: boolean;
  pause: boolean;
};

export class Input {
  state: InputState = {
    throttle: false,
    brake: false,
    left: false,
    right: false,
    fire: false,
    gate: false,
    pause: false,
  };

  /** When false (menus/name field), keyboard is ignored so typing works. */
  enabled = false;

  readonly tilt = new TiltController();

  private pausePressed = false;
  private firePressed = false;
  private gatePressed = false;

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  destroy() {
    this.tilt.stop();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  /** Analog steer −1…+1. Keyboard full-lock wins over tilt. */
  get steerAxis(): number {
    if (this.state.left && !this.state.right) return -1;
    if (this.state.right && !this.state.left) return 1;
    if (this.state.left && this.state.right) return 0;
    return this.tilt.steer;
  }

  /** Analog gas 0…1. Keyboard W/↑ is full throttle. */
  get throttleAmount(): number {
    if (this.state.throttle) return 1;
    return this.tilt.throttle;
  }

  /** Analog brake 0…1. Keyboard S/↓ is full brake. */
  get brakeAmount(): number {
    if (this.state.brake) return 1;
    return this.tilt.brake;
  }

  update(dt: number) {
    this.tilt.update(dt);
  }

  async startTilt(): Promise<boolean> {
    return this.tilt.start();
  }

  stopTilt() {
    this.tilt.stop();
  }

  recenterTilt() {
    this.tilt.recenter();
  }

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (target.isContentEditable) return true;
    // Also ignore if focus is inside a form field
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      const a = active.tagName;
      if (a === "INPUT" || a === "TEXTAREA" || a === "SELECT" || active.isContentEditable) {
        return true;
      }
    }
    return false;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled || this.isTypingTarget(e.target)) return;
    if (e.repeat) return;
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.state.throttle = true;
        e.preventDefault();
        break;
      case "ArrowDown":
      case "KeyS":
        this.state.brake = true;
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "KeyA":
        this.state.left = true;
        e.preventDefault();
        break;
      case "ArrowRight":
      case "KeyD":
        this.state.right = true;
        e.preventDefault();
        break;
      case "Space":
      case "KeyE":
      case "KeyF":
        this.state.fire = true;
        this.firePressed = true;
        e.preventDefault();
        break;
      case "KeyG":
        this.state.gate = true;
        this.gatePressed = true;
        e.preventDefault();
        break;
      case "Escape":
      case "KeyP":
        this.pausePressed = true;
        e.preventDefault();
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    // Always clear keys on keyup so stuck keys don't remain after leaving a race
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.state.throttle = false;
        break;
      case "ArrowDown":
      case "KeyS":
        this.state.brake = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.state.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        this.state.right = false;
        break;
      case "Space":
      case "KeyE":
      case "KeyF":
        this.state.fire = false;
        break;
      case "KeyG":
        this.state.gate = false;
        break;
    }
  };

  set(partial: Partial<InputState>) {
    if (partial.fire === true) this.firePressed = true;
    if (partial.gate === true) this.gatePressed = true;
    Object.assign(this.state, partial);
  }

  /** One-shot fire edge */
  consumeFire(): boolean {
    if (!this.enabled) return false;
    if (this.firePressed) {
      this.firePressed = false;
      return true;
    }
    return false;
  }

  consumePause(): boolean {
    if (this.pausePressed) {
      this.pausePressed = false;
      return true;
    }
    return false;
  }

  /** One-shot gate-pass wave */
  consumeGatePass(): boolean {
    if (!this.enabled) return false;
    if (this.gatePressed) {
      this.gatePressed = false;
      return true;
    }
    return false;
  }

  reset() {
    this.state = {
      throttle: false,
      brake: false,
      left: false,
      right: false,
      fire: false,
      gate: false,
      pause: false,
    };
    this.pausePressed = false;
    this.firePressed = false;
    this.gatePressed = false;
  }
}
