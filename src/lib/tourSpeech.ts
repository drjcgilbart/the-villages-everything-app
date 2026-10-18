/** Spoken turns for the Holiday Lights tour. The phone app speaks with its own voice. The browser keeps each line alive so Android does not drop it. */

type SpeechWindow = Window & {
  __TVEA_NATIVE_SPEECH__?: boolean;
  ReactNativeWebView?: { postMessage: (data: string) => void };
};

let pending = "";
let nativePending = "";
let nativeBusy = false;
let speechToken = 0;
let listening = false;
let nativeWatchdog: number | undefined;
let browserWatchdog: number | undefined;
const kept: SpeechSynthesisUtterance[] = [];

function shell(): SpeechWindow | null {
  if (typeof window === "undefined") return null;
  return window as SpeechWindow;
}

/**
 * The Android app speaks for the page. Its flag is injected as the page starts,
 * and Android WebView can drop that early script, so the app's user agent and
 * message bridge also count. The Android WebView has no working browser voice.
 * iOS keeps the browser voice, which WKWebView supports.
 */
function nativeSpeechReady() {
  const w = shell();
  if (!w?.ReactNativeWebView) return false;
  if (w.__TVEA_NATIVE_SPEECH__) return true;
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  return /VillagesEverythingApp/i.test(ua) && /Android/i.test(ua);
}

function voices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  return window.speechSynthesis;
}

function englishVoice(synth: SpeechSynthesis) {
  const list = synth.getVoices?.() || [];
  return (
    list.find((voice) => voice.lang === "en-US" && voice.localService) ||
    list.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ||
    null
  );
}

/** About how long a line takes to say, with room to spare. */
function lineMs(text: string) {
  return Math.min(30000, 4000 + text.length * 110);
}

function postNative(type: "tvea-speak" | "tvea-speak-stop", text: string, token: number) {
  shell()?.ReactNativeWebView?.postMessage(JSON.stringify({ type, text, token }));
}

function nativeFinished(token: number) {
  if (token !== speechToken) return;
  window.clearTimeout(nativeWatchdog);
  nativeBusy = false;
  if (!nativePending) return;
  const next = nativePending;
  nativePending = "";
  speakNative(next);
}

function ensureNativeListener() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("tvea-native-speech-done", (event) => {
    nativeFinished(Number((event as CustomEvent<{ token?: number }>).detail?.token));
  });
}

function speakNative(text: string) {
  ensureNativeListener();
  nativeBusy = true;
  speechToken += 1;
  const token = speechToken;
  postNative("tvea-speak", text, token);
  // If the app never reports the line done, do not hold every later turn back.
  window.clearTimeout(nativeWatchdog);
  nativeWatchdog = window.setTimeout(() => nativeFinished(token), lineMs(text));
}

function stopNative() {
  window.clearTimeout(nativeWatchdog);
  speechToken += 1;
  nativePending = "";
  nativeBusy = false;
  postNative("tvea-speak-stop", "", speechToken);
}

function utter(text: string) {
  const synth = voices();
  if (!synth) return;
  const line = new SpeechSynthesisUtterance(text);
  line.lang = "en-US";
  line.rate = 0.96;
  const voice = englishVoice(synth);
  if (voice) line.voice = voice;
  kept.push(line);
  const finish = () => {
    window.clearTimeout(browserWatchdog);
    const index = kept.indexOf(line);
    if (index < 0) return;
    kept.splice(index, 1);
    if (!pending) return;
    const next = pending;
    pending = "";
    utter(next);
  };
  line.onend = finish;
  line.onerror = finish;
  synth.speak(line);
  synth.resume();
  // Chrome on Android can leave "speaking" stuck with no end event, which
  // silenced every later turn. Move on after a generous wait.
  window.clearTimeout(browserWatchdog);
  browserWatchdog = window.setTimeout(() => {
    if (kept.indexOf(line) < 0) return;
    kept.splice(kept.indexOf(line), 1);
    if (!pending) return;
    const next = pending;
    pending = "";
    synth.cancel();
    utter(next);
  }, lineMs(text));
}

export function canSpeakTour() {
  return nativeSpeechReady() || !!voices();
}

export function speakTour(text: string) {
  const line = text.trim();
  if (!line) return;
  if (nativeSpeechReady()) {
    ensureNativeListener();
    if (nativeBusy) {
      nativePending = line;
      return;
    }
    nativePending = "";
    speakNative(line);
    return;
  }
  const synth = voices();
  if (!synth) return;
  if (kept.length && (synth.speaking || synth.pending)) {
    pending = line;
    return;
  }
  pending = "";
  utter(line);
}

/** Cancel anything already talking and speak this line now. Use this from a tap. */
export function speakTourNow(text: string) {
  const line = text.trim();
  if (!line) return;
  if (nativeSpeechReady()) {
    nativePending = "";
    speakNative(line);
    return;
  }
  const synth = voices();
  if (!synth) return;
  pending = "";
  kept.length = 0;
  synth.cancel();
  utter(line);
}

export function stopTourSpeech() {
  pending = "";
  if (nativeSpeechReady()) {
    stopNative();
    return;
  }
  window.clearTimeout(browserWatchdog);
  kept.length = 0;
  voices()?.cancel();
}
