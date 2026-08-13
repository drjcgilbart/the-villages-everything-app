import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sizes = [16, 24, 32, 48, 64, 128, 256];
const src = path.resolve("public/graphics/mascot-logo.jpg");
const dest = path.resolve("public/graphics/mascot-logo.ico");

const images = [];
for (const size of sizes) {
  const png = await sharp(src)
    .resize(size, size, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .png()
    .toBuffer();
  images.push({ size, png });
}

const headerSize = 6;
const entrySize = 16;
const dataStart = headerSize + entrySize * images.length;
const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);

const entries = [];
let offset = dataStart;
for (const image of images) {
  const entry = Buffer.alloc(entrySize);
  entry.writeUInt8(image.size === 256 ? 0 : image.size, 0);
  entry.writeUInt8(image.size === 256 ? 0 : image.size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.png.length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += image.png.length;
}

const ico = Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
await writeFile(dest, ico);
console.log(`Wrote ${dest} (${ico.length} bytes, ${sizes.join("/")}px)`);

for (const size of [180, 192, 512]) {
  const pngPath = path.resolve(`public/graphics/mascot-${size}.png`);
  await sharp(src)
    .resize(size, size, { fit: "cover", position: "centre" })
    .png()
    .toFile(pngPath);
  console.log(`Wrote ${pngPath}`);
}
