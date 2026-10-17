// Server-side profanity check for badge text. Uses the maintained `obscenity` package (English dataset with its
// recommended transformers: leetspeak, repeated letters, spacing tricks), plus a few names it would otherwise
// block and a short list of joke names it misses.
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";

const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });

// Real first names and surnames the dataset flags. Matched as whole words.
const ALLOWED_WORDS = new Set(["dick", "dickie", "dicky", "cummings", "cumming", "analise", "annalise", "analisa", "raper", "dikshit"]);
// Spellings and slurs the dataset does not catch (whole words), and gag names (spaces and punctuation removed).
const EXTRA_WORDS = new Set(["phuck", "fuk", "fuker", "biatch", "kunt", "wetback", "spic", "chink", "tranny", "hitler"]);
const EXTRA_PHRASES = ["mikehunt", "hughjass", "bendover", "harryballs", "mikehawk", "amandahugginkiss"];

/** Join runs of single-letter words: "f u c k" -> "fuck", "s.h.i.t" -> "shit". Other words stay as they are. */
function joinSpacedLetters(words: string[]) {
  const out: string[] = [];
  let run = "";
  for (const w of words) {
    if (w.length === 1) {
      run += w;
      continue;
    }
    if (run) out.push(run);
    run = "";
    out.push(w);
  }
  if (run) out.push(run);
  return out;
}

export function isProfane(text: string): boolean {
  const words = text.toLowerCase().split(/[\s.'-]+/).filter(Boolean);
  const kept = words.filter((w) => !ALLOWED_WORDS.has(w));
  if (kept.length && matcher.hasMatch(kept.join(" "))) return true;
  const joined = joinSpacedLetters(kept);
  if (joined.length !== kept.length && matcher.hasMatch(joined.join(" "))) return true;
  if ([...words, ...joined].some((w) => EXTRA_WORDS.has(w))) return true;
  const squished = words.join("");
  return EXTRA_PHRASES.some((w) => squished.includes(w));
}

export const PROFANITY_MESSAGE = "Let\u2019s keep it friendly. That wording can\u2019t go on a badge. Please try a different name.";
