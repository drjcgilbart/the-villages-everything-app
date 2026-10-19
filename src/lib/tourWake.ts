type WakeLockSentinelLike = { release: () => Promise<void> };

type Shell = Window & {
  ReactNativeWebView?: { postMessage: (data: string) => void };
  __tveaWake?: WakeLockSentinelLike | null;
};

/** Keep the phone screen on during a Holiday Lights drive. Older app installs ignore the message. */
export function setTourScreenAwake(on: boolean) {
  if (typeof window === "undefined") return;
  const shell = window as Shell;
  shell.ReactNativeWebView?.postMessage(JSON.stringify({ type: "tvea-keep-awake", on }));
  if (!on) {
    shell.__tveaWake?.release().catch(() => undefined);
    shell.__tveaWake = null;
    return;
  }
  const locks = navigator.wakeLock;
  if (!locks) return;
  locks
    .request("screen")
    .then((sentinel) => {
      shell.__tveaWake?.release().catch(() => undefined);
      shell.__tveaWake = sentinel;
    })
    .catch(() => undefined);
}
