/** Client-safe badge shape (no Node/fs). */

export type BadgeMetal = "bronze" | "silver" | "gold" | "pink";

export type BadgeDef = {
  id: string;
  label: string;
  title: string;
  image: string;
  /** Optional category for styling (e.g. golf skill badges) */
  kind?: "donation" | "tier" | "golf";
  /** Golf metal tier for CSS accent rings */
  metal?: BadgeMetal;
  /** Optional emoji overlay (e.g. ⛳ on pink ace) */
  emoji?: string;
};
