Fonts for the custom name badge preview and print renderer (src/lib/shop/badge-render.tsx).
Static TrueType instances from Google Fonts, all under the SIL Open Font License 1.1:
Fraunces, DM Sans, Lilita One, Pacifico, Playfair Display SC, Great Vibes.
Their GSUB (substitution) tables were removed with fontTools so the renderer (Satori) can read them and the
browser preview shapes text exactly like the print file; glyphs and kerning are unchanged.
They ship with the serverless functions via outputFileTracingIncludes in next.config.ts.
