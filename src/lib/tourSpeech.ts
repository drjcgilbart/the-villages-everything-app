/** Spoken turns for the Holiday Lights tour. The first call has to happen inside the Start tap on iPhone. */

let pending = "";

function voices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  return window.speechSynthesis;
}

function utter(text: string) {
  const synth = voices();
  if (!synth) return;
  const line = new SpeechSynthesisUtterance(text);
  line.lang = "en-US";
  line.rate = 0.96;
  line.onend = () => {
    if (!pending) return;
    const next = pending;
    pending = "";
    utter(next);
  };
  synth.speak(line);
  synth.resume();
}

export function canSpeakTour() {
  return !!voices();
}

export function speakTour(text: string) {
  const synth = voices();
  if (!synth || !text.trim()) return;
  if (synth.speaking || synth.pending) {
    pending = text;
    return;
  }
  pending = "";
  utter(text);
}

/** Cancel anything already talking and speak this line now. Use this from a tap. */
export function speakTourNow(text: string) {
  const synth = voices();
  if (!synth || !text.trim()) return;
  pending = "";
  synth.cancel();
  utter(text);
}

export function stopTourSpeech() {
  pending = "";
  voices()?.cancel();
}
