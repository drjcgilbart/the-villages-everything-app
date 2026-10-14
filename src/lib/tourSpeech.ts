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
const kept: SpeechSynthesisUtterance[] = [];

function shell(): SpeechWindow | null {
  if (typeof window === "undefined") return null;
  return window as SpeechWindow;
}

function nativeSpeechReady() {
  const w = shell();
  return !!w?.__TVEA_NATIVE_SPEECH__ && !!w.ReactNativeWebView;
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

function postNative(type: "tvea-speak" | "tvea-speak-stop", text: string, token: number) {
  shell()?.ReactNativeWebView?.postMessage(JSON.stringify({ type, text, token }));
}

function ensureNativeListener() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("tvea-native-speech-done", (event) => {
    const token = Number((event as CustomEvent<{ token?: number }>).detail?.token);
    if (token !== speechToken) return;
    nativeBusy = false;
    if (!nativePending) return;
    const next = nativePending;
    nativePending = "";
    nativeBusy = true;
    speechToken += 1;
    postNative("tvea-speak", next, speechToken);
  });
}

function speakNative(text: string) {
  ensureNativeListener();
  nativeBusy = true;
  speechToken += 1;
  postNative("tvea-speak", text, speechToken);
}

function stopNative() {
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
  line.onend = () => {
    const index = kept.indexOf(line);
    if (index >= 0) kept.splice(index, 1);
    if (!pending) return;
    const next = pending;
    pending = "";
    utter(next);
  };
  line.onerror = () => {
    const index = kept.indexOf(line);
    if (index >= 0) kept.splice(index, 1);
  };
  synth.speak(line);
  synth.resume();
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
  if (synth.speaking || synth.pending) {
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
  synth.cancel();
  utter(line);
}

export function stopTourSpeech() {
  pending = "";
  if (nativeSpeechReady()) {
    stopNative();
    return;
  }
  voices()?.cancel();
}
