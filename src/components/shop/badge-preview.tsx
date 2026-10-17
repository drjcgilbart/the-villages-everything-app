"use client";
import { useEffect, useMemo, useState } from "react";
import { BADGE_FONTS, BADGE_TRIM, badgePlate, fitSize, slotText, type BadgeFontKey, type BadgeText, type BadgeTheme, type TextSlot } from "@/lib/shop/badges";
import "./badges.css";

let ctx: CanvasRenderingContext2D | null = null;
function measure(key: BadgeFontKey) {
  const f = BADGE_FONTS[key];
  return (text: string, size: number) => {
    if (!ctx) ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return 0;
    ctx.font = `${f.weight} ${size}px "${f.family}"`;
    return ctx.measureText(text).width;
  };
}

const loaded = new Set<BadgeFontKey>();
/** True once this theme's fonts are loaded, so the auto-shrink measures the real glyphs. */
function useThemeFonts(theme: BadgeTheme) {
  const keys = useMemo(() => [theme.name.font, ...(theme.village ? [theme.village.font] : [])], [theme]);
  const [, bump] = useState(0);
  const ready = keys.every((k) => loaded.has(k));
  useEffect(() => {
    if (ready || typeof document === "undefined" || !document.fonts) return;
    let live = true;
    Promise.all(keys.map((k) => document.fonts.load(`${BADGE_FONTS[k].weight} 100px "${BADGE_FONTS[k].family}"`)))
      .then(() => keys.forEach((k) => loaded.add(k)))
      .catch(() => undefined)
      .finally(() => live && bump((n) => n + 1));
    return () => {
      live = false;
    };
  }, [keys, ready]);
  return ready;
}

const cq = (px: number) => `${(px / BADGE_TRIM.w) * 100}cqw`;
const shadowCq = (s?: string) => s?.replace(/(-?\d+(?:\.\d+)?)px/g, (_, n) => cq(Number(n)));

function Slot({ slot, value, fontsReady }: { slot: TextSlot; value: string; fontsReady: boolean }) {
  const text = slotText(slot, value);
  const size = fontsReady ? fitSize(slot, text, measure(slot.font)) : slot.size;
  const f = BADGE_FONTS[slot.font];
  return (
    <div
      className="badge-slot"
      style={{
        left: `${(slot.left / BADGE_TRIM.w) * 100}%`,
        top: `${(slot.top / BADGE_TRIM.h) * 100}%`,
        width: `${(slot.width / BADGE_TRIM.w) * 100}%`,
        height: `${(slot.height / BADGE_TRIM.h) * 100}%`,
        justifyContent: slot.align === "center" ? "center" : "flex-start",
      }}
    >
      <span
        style={{
          fontFamily: `"${f.family}"`,
          fontWeight: f.weight,
          fontSize: cq(size),
          lineHeight: slot.lineHeight,
          color: slot.color,
          letterSpacing: slot.letterSpacing ? `${slot.letterSpacing}em` : undefined,
          textShadow: shadowCq(slot.shadow),
        }}
      >
        {text}
      </span>
    </div>
  );
}

/** Live badge preview: the print plate plus the buyer's text, laid out with the print renderer's numbers. */
export function BadgePreview({ theme, text, label }: { theme: BadgeTheme; text: BadgeText; label?: string }) {
  const fontsReady = useThemeFonts(theme);
  const village = theme.usesVillage ? text.village ?? "" : "";
  return (
    <div className="badge-prev">
      <div
        className="badge-face"
        role={label === "" ? undefined : "img"}
        aria-hidden={label === "" ? true : undefined}
        aria-label={label === "" ? undefined : label ?? `${theme.label} badge preview: ${text.name}${village ? `, Village of ${village}` : ""}`}
        style={{ backgroundImage: `url(${badgePlate(theme.id)})` }}
      >
        {theme.village && village ? <Slot slot={theme.village} value={village} fontsReady={fontsReady} /> : null}
        {text.name ? <Slot slot={theme.name} value={text.name} fontsReady={fontsReady} /> : null}
      </div>
    </div>
  );
}
