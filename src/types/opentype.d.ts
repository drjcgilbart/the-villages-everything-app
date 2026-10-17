// Minimal types for opentype.js (used server-side to measure badge text for auto-shrink).
declare module "opentype.js" {
  export interface Glyph {
    advanceWidth?: number;
  }
  export interface Font {
    unitsPerEm: number;
    charToGlyph(char: string): Glyph;
    getKerningValue(left: Glyph, right: Glyph): number;
  }
  export function parse(buffer: ArrayBuffer): Font;
}
