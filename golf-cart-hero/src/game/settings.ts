/** Persisted control feel — phones and keyboards both read these. */

export type ControlSettings = {
  /** Left / right. 0.4–2.0, 1 = default. */
  steerSens: number;
  /** Forward / back (gas & brake). 0.4–2.0, 1 = default. */
  driveSens: number;
};

const STORAGE_KEY = "vgch-control-settings";
const MIN = 0.4;
const MAX = 2;

export const DEFAULT_CONTROL_SETTINGS: ControlSettings = {
  steerSens: 1,
  driveSens: 1,
};

/** Slider ticks 1–10. 5 maps to default 1.0. */
export const SENS_SLIDER_MIN = 1;
export const SENS_SLIDER_MAX = 10;
export const SENS_SLIDER_DEFAULT = 5;

let cached: ControlSettings = readStored();

function clampSens(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX, Math.max(MIN, n));
}

function clampSettings(s: ControlSettings): ControlSettings {
  return {
    steerSens: clampSens(s.steerSens),
    driveSens: clampSens(s.driveSens),
  };
}

function readStored(): ControlSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONTROL_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<ControlSettings>;
    return clampSettings({
      steerSens: parsed.steerSens ?? 1,
      driveSens: parsed.driveSens ?? 1,
    });
  } catch {
    return { ...DEFAULT_CONTROL_SETTINGS };
  }
}

export function getControlSettings(): ControlSettings {
  return cached;
}

export function setControlSettings(partial: Partial<ControlSettings>): ControlSettings {
  cached = clampSettings({ ...cached, ...partial });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    /* private mode / quota */
  }
  return cached;
}

export function resetControlSettings(): ControlSettings {
  cached = { ...DEFAULT_CONTROL_SETTINGS };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    /* ignore */
  }
  return cached;
}

/** 1 → 0.45, 5 → 1.0, 10 → 2.0 */
export function sliderToSens(slider: number): number {
  const s = Math.min(SENS_SLIDER_MAX, Math.max(SENS_SLIDER_MIN, Math.round(slider)));
  if (s <= SENS_SLIDER_DEFAULT) {
    return 0.45 + ((s - 1) * (1 - 0.45)) / (SENS_SLIDER_DEFAULT - 1);
  }
  return 1 + ((s - SENS_SLIDER_DEFAULT) * (2 - 1)) / (SENS_SLIDER_MAX - SENS_SLIDER_DEFAULT);
}

export function sensToSlider(sens: number): number {
  const v = clampSens(sens);
  if (v <= 1) {
    return Math.round(1 + ((v - 0.45) * (SENS_SLIDER_DEFAULT - 1)) / (1 - 0.45));
  }
  return Math.round(
    SENS_SLIDER_DEFAULT + ((v - 1) * (SENS_SLIDER_MAX - SENS_SLIDER_DEFAULT)) / (2 - 1),
  );
}

export function sliderFeelLabel(slider: number): string {
  if (slider <= 2) return "Gentle";
  if (slider <= 4) return "Soft";
  if (slider === 5) return "Default";
  if (slider <= 7) return "Snappy";
  return "Twitchy";
}
