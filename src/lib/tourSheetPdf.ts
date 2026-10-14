"use client";

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type SheetStop = {
  order: number;
  latitude: number;
  longitude: number;
  address: string;
  note: string;
};

type LatLng = { latitude: number; longitude: number };
type Row =
  | { kind: "head"; num: string; text: string }
  | { kind: "cont"; text: string; indent: number }
  | { kind: "plain"; text: string };

const TILE = 256;
const MAP_X = 46;
const MAP_Y = 108;
const MAP_W = 520;
const MAP_H = 318;
const CANVAS_W = MAP_W * 2;
const CANVAS_H = MAP_H * 2;
const LINE_TOP = 116;
const LINE_STEP = 18;
const LINES_PER_PAGE = 32;
const TEXT_X = 52;
const TEXT_MAX = 508;
const INK = rgb(0.09, 0.2, 0.14);
const CREAM = rgb(0.98, 0.96, 0.92);
const PAGE_H = 792;

function winAnsi(text: string) {
  return String(text || "")
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x20-\x7E\u00B0]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const clean = winAnsi(text);
  if (!clean) return [];
  const words = clean.split(" ");
  const lines: string[] = [];
  let line = "";
  const pushWord = (word: string) => {
    if (font.widthOfTextAtSize(word, size) <= max) {
      line = word;
      return;
    }
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
  };
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= max) line = test;
    else {
      if (line) lines.push(line);
      pushWord(word);
    }
  }
  if (line) lines.push(line);
  return lines;
}

function sameHouseText(address: string, note: string) {
  const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const house = norm(address);
  const extra = norm(note);
  if (!extra) return true;
  return house.includes(extra);
}

function worldPoint(lat: number, lng: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const rad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(Math.PI / 4 + rad / 2)) / Math.PI) / 2) * scale;
  return { x, y };
}

function viewFor(points: LatLng[]) {
  const padX = 72;
  const padY = 72;
  for (let zoom = 16; zoom >= 10; zoom -= 1) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const point of points) {
      const spot = worldPoint(point.latitude, point.longitude, zoom);
      minX = Math.min(minX, spot.x);
      maxX = Math.max(maxX, spot.x);
      minY = Math.min(minY, spot.y);
      maxY = Math.max(maxY, spot.y);
    }
    const spanX = Math.max(64, maxX - minX);
    const spanY = Math.max(64, maxY - minY);
    if (spanX + padX * 2 <= CANVAS_W && spanY + padY * 2 <= CANVAS_H) {
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      return { zoom, originX: cx - CANVAS_W / 2, originY: cy - CANVAS_H / 2 };
    }
  }
  const zoom = 10;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    const spot = worldPoint(point.latitude, point.longitude, zoom);
    minX = Math.min(minX, spot.x);
    maxX = Math.max(maxX, spot.x);
    minY = Math.min(minY, spot.y);
    maxY = Math.max(maxY, spot.y);
  }
  return {
    zoom,
    originX: (minX + maxX) / 2 - CANVAS_W / 2,
    originY: (minY + maxY) / 2 - CANVAS_H / 2,
  };
}

async function loadTile(z: number, x: number, y: number): Promise<ImageBitmap | null> {
  try {
    const res = await fetch(`/api/light-tour/map-tile?z=${z}&x=${x}&y=${y}`, { credentials: "same-origin" });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.size) return null;
    return await createImageBitmap(blob);
  } catch {
    return null;
  }
}

async function renderRouteMap(stops: SheetStop[], line: [number, number][]): Promise<Uint8Array> {
  const houses = stops
    .filter((stop) => Number.isFinite(stop.latitude) && Number.isFinite(stop.longitude))
    .sort((a, b) => a.order - b.order);
  const route: LatLng[] = [];
  for (const pair of line) {
    if (Number.isFinite(pair[0]) && Number.isFinite(pair[1])) {
      route.push({ latitude: pair[0], longitude: pair[1] });
    }
  }
  if (route.length < 2) {
    route.splice(0, route.length, ...houses);
  }
  const points = route.length ? route.concat(houses) : houses;
  if (!points.length) throw new Error("This route has no houses to print.");

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("The map did not draw.");
  const pen: CanvasRenderingContext2D = ctx;
  pen.fillStyle = "#fff8ee";
  pen.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const view = viewFor(points);
  const x0 = Math.floor(view.originX / TILE);
  const y0 = Math.floor(view.originY / TILE);
  const x1 = Math.floor((view.originX + CANVAS_W - 1) / TILE);
  const y1 = Math.floor((view.originY + CANVAS_H - 1) / TILE);
  const jobs: { x: number; y: number }[] = [];
  for (let x = x0; x <= x1; x += 1) {
    for (let y = y0; y <= y1; y += 1) jobs.push({ x, y });
  }

  let loaded = 0;
  let cursor = 0;
  async function worker() {
    while (cursor < jobs.length) {
      const job = jobs[cursor];
      cursor += 1;
      const bitmap = await loadTile(view.zoom, job.x, job.y);
      if (!bitmap) continue;
      pen.drawImage(bitmap, job.x * TILE - view.originX, job.y * TILE - view.originY, TILE, TILE);
      bitmap.close();
      loaded += 1;
    }
  }
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker()));

  const toCanvas = (point: LatLng) => {
    const spot = worldPoint(point.latitude, point.longitude, view.zoom);
    return { x: spot.x - view.originX, y: spot.y - view.originY };
  };

  if (route.length > 1) {
    const trace = () => {
      pen.beginPath();
      route.forEach((point, index) => {
        const spot = toCanvas(point);
        if (index === 0) pen.moveTo(spot.x, spot.y);
        else pen.lineTo(spot.x, spot.y);
      });
    };
    pen.lineJoin = "round";
    pen.lineCap = "round";
    trace();
    pen.strokeStyle = "#ffffff";
    pen.lineWidth = 18;
    pen.stroke();
    trace();
    pen.strokeStyle = "#0c4a6e";
    pen.lineWidth = 9;
    pen.stroke();
  }

  const markers: { x: number; y: number; label: string; lx: number; ly: number }[] = [];
  for (const stop of houses) {
    const spot = toCanvas(stop);
    const label = String(stop.order);
    const radius = label.length > 1 ? 30 : 28;
    let lx = spot.x;
    let ly = spot.y;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const crowded = markers.some((other) => {
        const dx = other.lx - lx;
        const dy = other.ly - ly;
        return dx * dx + dy * dy < (radius + 34) ** 2;
      });
      if (!crowded) break;
      const angle = -Math.PI / 2 + attempt * 0.75;
      const dist = radius + 28 + attempt * 8;
      lx = Math.min(CANVAS_W - radius - 8, Math.max(radius + 8, spot.x + Math.cos(angle) * dist));
      ly = Math.min(CANVAS_H - radius - 40, Math.max(radius + 8, spot.y + Math.sin(angle) * dist));
    }
    markers.push({ x: spot.x, y: spot.y, label, lx, ly });
  }
  pen.strokeStyle = "#0c4a6e";
  pen.lineWidth = 4;
  pen.lineCap = "round";
  for (const marker of markers) {
    if (Math.hypot(marker.lx - marker.x, marker.ly - marker.y) < 6) continue;
    pen.beginPath();
    pen.moveTo(marker.x, marker.y);
    pen.lineTo(marker.lx, marker.ly);
    pen.stroke();
    pen.beginPath();
    pen.arc(marker.x, marker.y, 6, 0, Math.PI * 2);
    pen.fillStyle = "#0c4a6e";
    pen.fill();
  }
  for (const marker of markers) {
    const radius = marker.label.length > 1 ? 30 : 28;
    pen.beginPath();
    pen.arc(marker.lx, marker.ly, radius, 0, Math.PI * 2);
    pen.fillStyle = "#fff8ee";
    pen.fill();
    pen.lineWidth = 5;
    pen.strokeStyle = "#0c4a6e";
    pen.stroke();
    pen.fillStyle = "#1c2430";
    pen.font = `700 ${marker.label.length > 1 ? 24 : 28}px Helvetica, Arial, sans-serif`;
    pen.textAlign = "center";
    pen.textBaseline = "middle";
    pen.fillText(marker.label, marker.lx, marker.ly + 1);
  }

  pen.font = "600 18px Helvetica, Arial, sans-serif";
  pen.textAlign = "left";
  pen.textBaseline = "middle";
  const credit = loaded ? "© OpenStreetMap" : "Map picture did not load. The line is the route.";
  const creditWidth = pen.measureText(credit).width;
  const boxW = creditWidth + 16;
  const boxH = 28;
  const boxX = CANVAS_W - boxW - 12;
  const boxY = CANVAS_H - boxH - 12;
  pen.fillStyle = "rgba(255, 248, 238, 0.92)";
  pen.fillRect(boxX, boxY, boxW, boxH);
  pen.fillStyle = "#1c2430";
  pen.fillText(credit, boxX + 8, boxY + boxH / 2 + 1);

  const png = await new Promise<Uint8Array>((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("The map did not draw."));
        return;
      }
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, "image/png");
  });
  return png;
}

function rowsFor(stops: SheetStop[], font: PDFFont, bold: PDFFont): Row[] {
  const size = 11;
  const blocks: Row[][] = [];
  const ordered = [...stops].sort((a, b) => a.order - b.order);
  for (const stop of ordered) {
    const address = winAnsi(stop.address) || "Saved house";
    const num = `${stop.order}. `;
    const numW = bold.widthOfTextAtSize(num, size);
    const addressLines = wrap(address, font, size, Math.max(80, TEXT_MAX - numW));
    const block: Row[] = [{ kind: "head", num, text: addressLines[0] || "Saved house" }];
    for (const extra of addressLines.slice(1)) block.push({ kind: "cont", text: extra, indent: numW });
    const note = winAnsi(stop.note);
    if (!sameHouseText(address, note)) {
      for (const line of wrap(note, font, size, TEXT_MAX - 20)) {
        block.push({ kind: "cont", text: line, indent: 20 });
      }
    }
    blocks.push(block);
  }
  const total = blocks.reduce((sum, block) => sum + block.length, 0);
  const limit = total > LINES_PER_PAGE * 2 ? LINES_PER_PAGE * 2 - 1 : LINES_PER_PAGE * 2;
  const kept: Row[] = [];
  for (const block of blocks) {
    if (kept.length + block.length > limit) break;
    kept.push(...block);
  }
  if (kept.length < total) {
    kept.push({ kind: "plain", text: "And more houses are on the tour in the app." });
  }
  return kept;
}

function drawRows(pages: PDFPage[], rows: Row[], font: PDFFont, bold: PDFFont) {
  const size = 11;
  rows.forEach((row, index) => {
    const page = pages[Math.floor(index / LINES_PER_PAGE)];
    if (!page) return;
    const baseline = PAGE_H - (LINE_TOP + (index % LINES_PER_PAGE) * LINE_STEP);
    if (row.kind === "head") {
      page.drawText(row.num, { x: TEXT_X, y: baseline, size, font: bold, color: INK });
      const numW = bold.widthOfTextAtSize(row.num, size);
      page.drawText(row.text, { x: TEXT_X + numW, y: baseline, size, font, color: INK });
      return;
    }
    const x = row.kind === "cont" ? TEXT_X + row.indent : TEXT_X;
    page.drawText(row.text, { x, y: baseline, size, font, color: INK });
  });
}

function stampPageNumber(page: PDFPage, font: PDFFont, n: number) {
  const label = String(n);
  const size = 13;
  const width = font.widthOfTextAtSize(label, size);
  page.drawText(label, {
    x: 536 - width / 2,
    y: 55,
    size,
    font,
    color: CREAM,
  });
}

export async function buildTourSheetPdf(input: {
  stops: SheetStop[];
  line: [number, number][];
}): Promise<Uint8Array> {
  const stops = input.stops.filter((stop) => Number.isFinite(stop.latitude) && Number.isFinite(stop.longitude));
  if (!stops.length) throw new Error("Build a route before printing the sheet.");

  const [templateRes, mapPng] = await Promise.all([
    fetch("/print/spookiest-houses-template.pdf", { credentials: "same-origin" }),
    renderRouteMap(stops, input.line || []),
  ]);
  if (!templateRes.ok) throw new Error("The route sheet did not load.");

  const pdf = await PDFDocument.load(await templateRes.arrayBuffer());
  pdf.setTitle("Holiday Lights Tour");
  pdf.setAuthor("The Villages Everything App");
  pdf.setSubject("Map and houses for a Holiday Lights Tour route");
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const map = await pdf.embedPng(mapPng);
  const mapPage = pdf.getPage(0);
  mapPage.drawImage(map, { x: MAP_X, y: MAP_Y, width: MAP_W, height: MAP_H });

  const rows = rowsFor(stops, font, bold);
  const listPages = [pdf.getPage(1), pdf.getPage(2)].filter(Boolean);
  drawRows(listPages, rows, font, bold);

  const used = rows.length > LINES_PER_PAGE ? 3 : 2;
  while (pdf.getPageCount() > used) pdf.removePage(pdf.getPageCount() - 1);
  for (let i = 0; i < pdf.getPageCount(); i += 1) {
    stampPageNumber(pdf.getPage(i), bold, i + 1);
  }
  return pdf.save();
}
