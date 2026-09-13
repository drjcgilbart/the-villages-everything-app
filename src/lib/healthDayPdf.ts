"use client";

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { DayRecap, DaySnapshot } from "./healthDayRecap";
import { prettyDate } from "./healthDayRecap";

const PAGE = { w: 612, h: 792 };
const MARGIN = 54;
const PALM = rgb(31 / 255, 107 / 255, 74 / 255);
const INK = rgb(0.16, 0.18, 0.2);
const MUTED = rgb(0.38, 0.4, 0.44);
const CREAM = rgb(0.98, 0.96, 0.92);
const GOLD = rgb(0.72, 0.55, 0.2);

type Img = { bytes: Uint8Array; caption: string; kind: "photo" | "video" };

function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const words = clean.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= max) {
      line = test;
      continue;
    }
    if (line) lines.push(line);
    if (font.widthOfTextAtSize(word, size) <= max) {
      line = word;
    } else {
      let chunk = "";
      for (const ch of word) {
        const next = chunk + ch;
        if (font.widthOfTextAtSize(next, size) <= max) chunk = next;
        else {
          if (chunk) lines.push(chunk);
          chunk = ch;
        }
      }
      line = chunk;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildHealthDayPdf(
  recap: Pick<
    DayRecap,
    "title" | "headline" | "article" | "highlights" | "improve" | "bestMoment" | "closer"
  >,
  snap: DaySnapshot,
  images: Img[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${recap.title} — ${snap.date}`);
  pdf.setAuthor("The Villages Everything App");
  pdf.setSubject("Private My Space daily health recap");
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE.w, PAGE.h]);
  let y = PAGE.h - MARGIN;

  const newPage = () => {
    page = pdf.addPage([PAGE.w, PAGE.h]);
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE.w,
      height: PAGE.h,
      color: CREAM,
    });
    y = PAGE.h - MARGIN;
    footer(page, sans);
  };

  const ensure = (need: number) => {
    if (y - need < MARGIN + 28) newPage();
  };

  const heading = (text: string) => {
    ensure(28);
    y -= 6;
    page.drawText(text.toUpperCase(), {
      x: MARGIN,
      y,
      size: 9,
      font: sansBold,
      color: PALM,
    });
    y -= 16;
  };

  const width = PAGE.w - MARGIN * 2;

  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE.w,
    height: PAGE.h,
    color: CREAM,
  });
  footer(page, sans);

  page.drawRectangle({ x: 0, y: PAGE.h - 18, width: PAGE.w, height: 18, color: PALM });
  y = PAGE.h - 36;
  draw(page, sansBold, 9, PALM, "THE VILLAGES EVERYTHING APP  ·  MY SPACE  ·  MY DAY", MARGIN, y);
  y -= 22;
  for (const line of wrap(recap.title || "My day", serifBold, 22, width)) {
    ensure(26);
    draw(page, serifBold, 22, INK, line, MARGIN, y);
    y -= 26;
  }
  y -= 4;
  draw(page, sans, 11, MUTED, prettyDate(snap.date), MARGIN, y);
  y -= 16;
  if (recap.headline) {
    for (const line of wrap(recap.headline, serif, 12, width)) {
      ensure(16);
      draw(page, serif, 12, GOLD, line, MARGIN, y);
      y -= 16;
    }
  }
  y -= 8;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE.w - MARGIN, y },
    thickness: 0.8,
    color: rgb(0.78, 0.72, 0.6),
  });
  y -= 20;

  heading("The story of the day");
  for (const para of recap.article.split(/\n+/).map((p) => p.trim()).filter(Boolean)) {
    for (const line of wrap(para, serif, 11.5, width)) {
      ensure(16);
      draw(page, serif, 11.5, INK, line, MARGIN, y);
      y -= 16;
    }
    y -= 8;
  }

  if (recap.bestMoment) {
    heading("Best moment");
    for (const line of wrap(recap.bestMoment, serif, 12, width)) {
      ensure(16);
      draw(page, serif, 12, PALM, line, MARGIN, y);
      y -= 16;
    }
    y -= 8;
  }

  if (recap.highlights.length) {
    heading("What went well");
    for (const h of recap.highlights) {
      for (const line of wrap(`•  ${h}`, serif, 11, width)) {
        ensure(15);
        draw(page, serif, 11, INK, line, MARGIN, y);
        y -= 15;
      }
      y -= 4;
    }
  }

  if (recap.improve.length) {
    heading("Grow from here");
    for (const h of recap.improve) {
      for (const line of wrap(`•  ${h}`, serif, 11, width)) {
        ensure(15);
        draw(page, serif, 11, INK, line, MARGIN, y);
        y -= 15;
      }
      y -= 4;
    }
  }

  heading("The day's log");
  const logLines = logSummary(snap);
  for (const line of logLines) {
    for (const w of wrap(line, sans, 9.5, width)) {
      ensure(13);
      draw(page, sans, 9.5, MUTED, w, MARGIN, y);
      y -= 13;
    }
    y -= 3;
  }

  if (images.length) {
    heading("Photos from the day");
    for (const img of images.slice(0, 6)) {
      try {
        const embedded = await embedImage(pdf, img.bytes);
        if (!embedded) continue;
        const maxW = width;
        const maxH = 220;
        const scale = Math.min(maxW / embedded.width, maxH / embedded.height, 1);
        const w = embedded.width * scale;
        const h = embedded.height * scale;
        ensure(h + 28);
        page.drawImage(embedded, { x: MARGIN, y: y - h, width: w, height: h });
        y -= h + 12;
        if (img.caption) {
          draw(page, sans, 8, MUTED, img.caption.slice(0, 90), MARGIN, y);
          y -= 14;
        }
      } catch {
        /* skip a bad photo */
      }
    }
  }

  if (recap.closer) {
    y -= 8;
    ensure(40);
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE.w - MARGIN, y },
      thickness: 0.8,
      color: rgb(0.78, 0.72, 0.6),
    });
    y -= 20;
    for (const line of wrap(recap.closer, serif, 12, width)) {
      ensure(16);
      draw(page, serif, 12, PALM, line, MARGIN, y);
      y -= 16;
    }
  }

  y -= 18;
  for (const line of wrap(
    "Private recap for this membership. Not medical advice. Not affiliated with The Villages operators.",
    sans,
    8,
    width
  )) {
    ensure(12);
    draw(page, sans, 8, MUTED, line, MARGIN, y);
    y -= 12;
  }

  return pdf.save();
}

function footer(page: PDFPage, font: PDFFont) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE.w, height: 22, color: PALM });
  page.drawText("thevillageseverythingapp.com  ·  My Space Health", {
    x: MARGIN,
    y: 8,
    size: 8,
    font,
    color: rgb(1, 1, 1),
  });
}

function draw(
  page: PDFPage,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
  text: string,
  x: number,
  y: number,
  maxWidth?: number
) {
  const lines = maxWidth ? wrap(text, font, size, maxWidth) : [text];
  page.drawText(lines[0] || "", { x, y, size, font, color });
}

async function embedImage(pdf: PDFDocument, bytes: Uint8Array) {
  try {
    return await pdf.embedJpg(bytes);
  } catch {
    try {
      return await pdf.embedPng(bytes);
    } catch {
      return null;
    }
  }
}

function logSummary(snap: DaySnapshot): string[] {
  const lines: string[] = [];
  if (snap.weight != null) lines.push(`Weight: ${snap.weight} lbs`);
  if (snap.medsTaken.length) {
    lines.push(
      `Meds taken: ${snap.medsTaken.map((m) => `${m.name}${m.time ? ` at ${m.time}` : ""}`).join("; ")}`
    );
  }
  if (snap.meals.length) {
    lines.push(
      `Meals: ${snap.meals.map((m) => `${m.type} — ${m.title}`).join("; ")}`
    );
  }
  if (snap.exercises.length) {
    lines.push(
      `Exercise: ${snap.exercises.map((e) => `${e.activity}${e.durationMin ? ` ${e.durationMin} min` : ""}`).join("; ")}`
    );
  }
  for (const g of snap.gyms) {
    lines.push(
      `Gym: ${g.gymName}${g.durationMin ? ` · ${g.durationMin} min` : ""}${g.lifts.length ? ` · ${g.lifts.slice(0, 6).join(" · ")}` : ""}`
    );
  }
  if (snap.sleep) {
    lines.push(
      `Sleep: ${snap.sleep.hours ?? "—"} h · ${snap.sleep.quality}${snap.sleep.bedtime ? ` · bed ${snap.sleep.bedtime}` : ""}`
    );
  }
  if (snap.habits) {
    const h = snap.habits;
    lines.push(
      `Habits: water ${h.waterOz} oz · steps ${h.steps} · protein ${h.proteinG} g${h.walked ? " · walked" : ""}`
    );
  }
  if (snap.journals.length) {
    lines.push(
      `Journal: ${snap.journals.map((j) => j.title || j.mood || "entry").join("; ")}`
    );
  }
  if (snap.photos.length) {
    lines.push(`Progress photos noted: ${snap.photos.map((p) => p.caption).join("; ")}`);
  }
  if (!lines.length) lines.push("A quiet log — rest is still part of the story.");
  return lines;
}
