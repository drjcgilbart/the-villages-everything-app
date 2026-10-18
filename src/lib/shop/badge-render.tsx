// Server-side print renderer for custom name badges. Satori + Resvg via next/og, so it runs in a Vercel
// Node function with no browser. Fonts and art plates are read from public/shop/badges/ and are traced into the
// functions by outputFileTracingIncludes in next.config.ts.
import fs from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import { parse, type Font } from "opentype.js";
import {
  BADGE_BLEED,
  BADGE_FONTS,
  BADGE_PRINT,
  BADGE_TRIM,
  fitSize,
  slotText,
  type BadgeFontKey,
  type BadgeText,
  type BadgeTheme,
  type TextSlot,
} from "./badges";

const ROOT = () => path.join(process.cwd(), "public", "shop", "badges");

type Loaded = { data: Buffer; font: Font };
const fontCache = new Map<BadgeFontKey, Promise<Loaded>>();
function loadFont(key: BadgeFontKey) {
  let p = fontCache.get(key);
  if (!p) {
    p = fs.readFile(/*turbopackIgnore: true*/ path.join(ROOT(), "fonts", BADGE_FONTS[key].file)).then((data) => ({
      data,
      font: parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer),
    }));
    fontCache.set(key, p);
  }
  return p;
}

const plateCache = new Map<string, Promise<string>>();
function loadPlate(id: string) {
  let p = plateCache.get(id);
  if (!p) {
    p = fs.readFile(/*turbopackIgnore: true*/ path.join(ROOT(), "plates-3x2", `${id}.png`)).then((b) => `data:image/png;base64,${b.toString("base64")}`);
    plateCache.set(id, p);
  }
  return p;
}

/** Advance width with pair kerning, glyph by glyph (no GSUB shaping, which opentype.js only partly supports). */
function advance(font: Font, text: string, size: number) {
  const scale = size / font.unitsPerEm;
  let w = 0;
  let prev: ReturnType<Font["charToGlyph"]> | null = null;
  for (const ch of Array.from(text)) {
    const g = font.charToGlyph(ch);
    if (prev) w += font.getKerningValue(prev, g);
    w += g.advanceWidth ?? 0;
    prev = g;
  }
  return w * scale;
}

async function slotFit(slot: TextSlot, value: string) {
  const text = slotText(slot, value);
  const { font } = await loadFont(slot.font);
  const size = fitSize(slot, text, (t, s) => advance(font, t, s));
  return { text, size };
}

/** Font sizes the renderer will use (same numbers the live preview computes in the browser). */
export async function badgeLayout(theme: BadgeTheme, text: BadgeText) {
  const name = await slotFit(theme.name, text.name);
  const village = theme.village && text.village ? await slotFit(theme.village, text.village) : null;
  return { name, village };
}

function TextBox({ slot, text, size, offset }: { slot: TextSlot; text: string; size: number; offset: number }) {
  const f = BADGE_FONTS[slot.font];
  return (
    <div
      style={{
        position: "absolute",
        left: slot.left + offset,
        top: slot.top + offset,
        width: slot.width,
        height: slot.height,
        display: "flex",
        alignItems: "center",
        justifyContent: slot.align === "center" ? "center" : "flex-start",
      }}
    >
      <div
        style={{
          fontFamily: f.family,
          fontWeight: f.weight,
          fontSize: size,
          lineHeight: slot.lineHeight,
          color: slot.color,
          whiteSpace: "nowrap",
          // Satori chokes on undefined style values, so only set these when the theme uses them.
          ...(slot.letterSpacing ? { letterSpacing: `${slot.letterSpacing}em` } : {}),
          ...(slot.shadow ? { textShadow: slot.shadow } : {}),
        }}
      >
        {text}
      </div>
    </div>
  );
}

// PNG pHYs chunk so print software reads 300 dpi (11811 px per metre).
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf: Buffer) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export function withDpi(png: Buffer, dpi = 300): Buffer {
  const ppm = Math.round(dpi / 0.0254);
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data[8] = 1;
  const type = Buffer.from("pHYs");
  const chunk = Buffer.alloc(12 + 9);
  chunk.writeUInt32BE(9, 0);
  type.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([type, data])), 17);
  // Rebuild the chunk list: drop any existing pHYs (Resvg writes 72 dpi) and put ours right after IHDR.
  const parts: Buffer[] = [png.subarray(0, 8)];
  let pos = 8;
  while (pos + 12 <= png.length) {
    const len = png.readUInt32BE(pos);
    const kind = png.toString("latin1", pos + 4, pos + 8);
    const end = pos + 12 + len;
    if (kind !== "pHYs") parts.push(png.subarray(pos, end));
    if (kind === "IHDR") parts.push(chunk);
    pos = end;
  }
  return Buffer.concat(parts);
}

/**
 * Render the print PNG. bleed=true: 976 x 676 (3.25" x 2.25", 1/8" bleed each side, trim marked by the layout);
 * bleed=false: the 900 x 600 trim only (3" x 2" at 300 dpi). Text must already be validated.
 */
export async function renderBadgePng(theme: BadgeTheme, text: BadgeText, opts: { bleed?: boolean } = {}): Promise<Buffer> {
  const bleed = opts.bleed !== false;
  const W = bleed ? BADGE_PRINT.w : BADGE_TRIM.w;
  const H = bleed ? BADGE_PRINT.h : BADGE_TRIM.h;
  const off = bleed ? BADGE_BLEED : 0;
  const [layout, plate] = await Promise.all([badgeLayout(theme, text), loadPlate(theme.id)]);
  const keys = [...new Set([theme.name.font, ...(theme.village ? [theme.village.font] : [])])];
  const fonts = await Promise.all(keys.map(async (k) => ({ name: BADGE_FONTS[k].family, data: (await loadFont(k)).data, weight: BADGE_FONTS[k].weight, style: "normal" as const })));
  const res = new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={plate} width={BADGE_PRINT.w} height={BADGE_PRINT.h} style={{ position: "absolute", left: off - BADGE_BLEED, top: off - BADGE_BLEED }} />
        {layout.village && theme.village ? <TextBox slot={theme.village} text={layout.village.text} size={layout.village.size} offset={off} /> : null}
        <TextBox slot={theme.name} text={layout.name.text} size={layout.name.size} offset={off} />
      </div>
    ),
    { width: W, height: H, fonts }
  );
  return withDpi(Buffer.from(await res.arrayBuffer()));
}

/** Ready-made badge art, byte for byte as supplied (already print-ready at 300 dpi). */
export async function readReadyBadge(file: string): Promise<Buffer> {
  return fs.readFile(/*turbopackIgnore: true*/ path.join(process.cwd(), "public", file.replace(/^\//, "")));
}
