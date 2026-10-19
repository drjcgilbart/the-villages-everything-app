import { isNativeAppShell } from "@/lib/nativeAppShell";

export type DevicePoint = { latitude: number; longitude: number };

type NativeLocationDetail = {
  requestId?: string;
  watch?: boolean;
  ok?: boolean;
  code?: number;
  latitude?: number;
  longitude?: number;
  /** Meters, 68% radius. App builds before this field send none. */
  accuracy?: number;
  /** Degrees from north, clockwise. App builds before this field send none. */
  heading?: number | null;
  /** Meters per second. App builds before this field send none. */
  speed?: number | null;
};

export type DeviceMotion = { heading: number | null; speed: number | null };

type ShellWindow = Window & {
  __TVEA_NATIVE_LOCATION__?: boolean;
  ReactNativeWebView?: { postMessage: (data: string) => void };
};

/** 1 permission denied, 2 unavailable, 3 timeout. A missing code stays 0. */
export function geoErrorCode(err: unknown): number {
  if (!err || typeof err !== "object") return 0;
  const code = Number((err as { code?: unknown }).code);
  if (code === 1 || code === 2 || code === 3) return code;
  const name = String((err as { name?: unknown }).name || "");
  if (name === "NotAllowedError" || name === "PermissionDeniedError") return 1;
  return 0;
}

export type GeoPermission = "granted" | "denied" | "prompt" | "unknown";

let permissionCache: GeoPermission = "unknown";

export function cachedGeoPermission(): GeoPermission {
  return permissionCache;
}

/** Chrome's site setting. Granted here can still fail when Windows location is off. */
export async function readGeoPermission(): Promise<GeoPermission> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) return permissionCache;
  try {
    const status = await navigator.permissions.query({ name: "geolocation" as PermissionName });
    if (status.state === "granted" || status.state === "denied" || status.state === "prompt") {
      permissionCache = status.state;
    }
  } catch {
    /* Some browsers reject this permission name. */
  }
  return permissionCache;
}

/** A desktop browser, not the phone app and not a phone. */
export function isDesktopBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  if (isNativeAppShell()) return false;
  return !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function fail(code: number, message: string): Error {
  return Object.assign(new Error(message), { code });
}

function finitePoint(latitude: unknown, longitude: unknown): DevicePoint | null {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { latitude: lat, longitude: lng };
}

/**
 * Approximate first. A precise-only fix fails on many Android phones when
 * location is allowed but Precise is off.
 */
function readFix(timeout: number, accurate: boolean): Promise<DevicePoint> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(fail(2, "This browser does not share location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point = finitePoint(pos.coords.latitude, pos.coords.longitude);
        if (!point) {
          reject(fail(2, "Location did not come through."));
          return;
        }
        resolve(point);
      },
      (err) => reject(err),
      {
        enableHighAccuracy: accurate,
        timeout,
        maximumAge: accurate ? 0 : 15000,
      },
    );
  });
}

/**
 * A phone tries a rough fix, then a precise one.
 * A desktop stays on a network fix. High accuracy there often returns
 * "denied" even after Chrome is set to Allow, because Windows location is off.
 */
export async function readWebLocation(accept?: (point: DevicePoint) => boolean): Promise<DevicePoint> {
  const permission = await readGeoPermission();
  const desktop = isDesktopBrowser();
  try {
    const rough = await readFix(desktop ? 20000 : 12000, false);
    if (!accept || accept(rough)) return rough;
  } catch (err) {
    if (desktop) {
      if (geoErrorCode(err) === 1 && permission !== "granted") throw err;
      throw fail(2, "This computer did not share a location.");
    }
    if (geoErrorCode(err) === 1 && permission !== "granted") throw err;
  }
  if (desktop) throw fail(2, "This computer did not share a location.");
  return readFix(15000, true);
}

/** True only in an app build that answers tvea-location. Older installs leave this unset. */
export function nativeLocationReady(): boolean {
  if (typeof window === "undefined") return false;
  const shell = window as ShellWindow;
  if (shell.__TVEA_NATIVE_LOCATION__) return true;
  // Android WebView can drop the flag the app injects as the page starts.
  return Boolean(shell.ReactNativeWebView) && isNativeAppShell() && /Android/i.test(navigator.userAgent);
}

function postToApp(type: string, requestId: string) {
  const shell = window as ShellWindow;
  shell.ReactNativeWebView?.postMessage(JSON.stringify({ type, requestId }));
}

export function requestNativeLocation(timeoutMs = 20000): Promise<DevicePoint> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !nativeLocationReady()) {
      reject(fail(2, "Location did not come through."));
      return;
    }
    const requestId = `loc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const timer = window.setTimeout(() => {
      window.removeEventListener("tvea-native-location", onEvent);
      reject(fail(3, "Location did not come through."));
    }, timeoutMs);
    const onEvent = (event: Event) => {
      const detail = (event as CustomEvent<NativeLocationDetail>).detail;
      if (!detail || detail.watch || detail.requestId !== requestId) return;
      window.clearTimeout(timer);
      window.removeEventListener("tvea-native-location", onEvent);
      const point = finitePoint(detail.latitude, detail.longitude);
      if (detail.ok && point) {
        resolve(point);
        return;
      }
      reject(fail(detail.code === 1 ? 1 : 2, "Location did not come through."));
    };
    window.addEventListener("tvea-native-location", onEvent);
    postToApp("tvea-location", requestId);
  });
}

/**
 * Newer phone apps read the GPS chip directly. The page geolocation call stays
 * for the browser and for app installs from before that bridge existed.
 */
export async function readDeviceLocation(accept?: (point: DevicePoint) => boolean): Promise<DevicePoint> {
  if (nativeLocationReady()) {
    try {
      const native = await requestNativeLocation();
      if (!accept || accept(native)) return native;
    } catch (err) {
      if (geoErrorCode(err) === 1) throw err;
    }
  }
  return readWebLocation(accept);
}

/** Driving follow for a phone build that can watch the GPS chip. Returns a stop function. */
export function watchNativeLocation(
  onPoint: (point: DevicePoint, accuracy?: number, motion?: DeviceMotion) => void,
  onError?: (err: unknown) => void,
): () => void {
  if (typeof window === "undefined" || !nativeLocationReady()) return () => undefined;
  const requestId = `watch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const onEvent = (event: Event) => {
    const detail = (event as CustomEvent<NativeLocationDetail>).detail;
    if (!detail?.watch || detail.requestId !== requestId) return;
    const point = finitePoint(detail.latitude, detail.longitude);
    if (detail.ok && point) {
      const accuracy = Number(detail.accuracy);
      const heading = Number(detail.heading);
      const speed = Number(detail.speed);
      onPoint(point, Number.isFinite(accuracy) && accuracy >= 0 ? accuracy : undefined, {
        heading: Number.isFinite(heading) ? heading : null,
        speed: Number.isFinite(speed) ? speed : null,
      });
      return;
    }
    onError?.(fail(detail.code === 1 ? 1 : 2, "Location did not come through."));
  };
  window.addEventListener("tvea-native-location", onEvent);
  postToApp("tvea-location-watch", requestId);
  return () => {
    window.removeEventListener("tvea-native-location", onEvent);
    postToApp("tvea-location-watch-stop", requestId);
  };
}

export function locationBlockedText(orElse: string): string {
  if (typeof navigator !== "undefined" && isNativeAppShell()) {
    return `Location is blocked for the app. Open Settings, then Apps, The Villages Everything App, Permissions, Location, and choose Allow. On Android, turn Precise on too. ${orElse}`;
  }
  return `Location is blocked. Allow location for this site, then try again. ${orElse}`;
}

export function locationComputerText(orElse: string): string {
  return `This computer did not share a location. This browser already allows this site. Open Windows Settings, then Privacy & security, then Location. Turn Location on, and turn on Let desktop apps access your location. ${orElse}`;
}

/** Site Allow plus a failed fix is a computer problem, not a blocked website. */
export function locationFailureText(err: unknown, orElse: string): string {
  const code = geoErrorCode(err);
  const permission = cachedGeoPermission();
  if (code === 1 && permission !== "granted") return locationBlockedText(orElse);
  if (err instanceof Error && err.message === "This browser does not share location.") {
    return `This browser does not share location. ${orElse}`;
  }
  if (permission === "granted" && isDesktopBrowser()) return locationComputerText(orElse);
  if (permission === "granted") {
    return `Location is allowed for this site, but the phone did not share a position. Turn location on for the phone, then try again. ${orElse}`;
  }
  if (isDesktopBrowser()) return locationComputerText(orElse);
  return `Location did not come through. ${orElse}`;
}
