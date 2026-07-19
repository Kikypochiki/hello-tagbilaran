import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const imageDirectory = path.resolve("public/images/places");
const files = await readdir(imageDirectory);
let beforeBytes = 0;
let afterBytes = 0;
let optimized = 0;

for (const filename of files) {
  if (!/\.jpe?g$/i.test(filename)) continue;
  const target = path.join(imageDirectory, filename);
  const before = await stat(target);
  beforeBytes += before.size;

  if (before.size < 350_000) {
    afterBytes += before.size;
    continue;
  }

  const input = await readFile(target);
  const output = await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toBuffer();

  await writeFile(target, output);
  afterBytes += output.length;
  optimized += 1;
}

console.log(
  `Optimized ${optimized} images: ${(beforeBytes / 1_048_576).toFixed(2)} MB → ${(afterBytes / 1_048_576).toFixed(2)} MB.`,
);
