#!/usr/bin/env node
// Generates dig animation preview: 2 frames side by side at 8× scale.
// Frame 1: standing upright, shovel raised to right side
// Frame 2: bent forward, shovel blade in ground with displaced earth
// Matches choreSprites.ts DIG_1/DIG_2 exactly.

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const C = {
  ".": null,
  K: [30, 30, 30],        // black fur
  W: [245, 245, 245],     // white fur
  G: [215, 215, 215],     // gray belly
  E: [255, 255, 255],     // eye glint
  A: [160, 160, 170],     // shovel blade (steel gray)
  H: [120, 80, 50],       // shovel handle (wood)
  D: [140, 105, 65],      // displaced earth (warm brown)
  B: [115, 85, 50],       // displaced earth (dark brown)
};

const FRAME_W = 16;
const FRAME_H = 32;
const EMPTY = "................";

function n(frame) {
  while (frame.length < FRAME_H) frame.push(EMPTY);
  return frame.map(row => {
    if (row.length < FRAME_W) return row + ".".repeat(FRAME_W - row.length);
    if (row.length > FRAME_W) return row.slice(0, FRAME_W);
    return row;
  });
}

// === DIG FRAME 1: Standing upright (centered), shovel raised to right side ===
const dig1 = n([
  "..........AAA...",
  "..........AAAH..",
  "...........HH...",
  "...........HH...",
  "..KKKK..KKKKH...",
  ".KKKKK..KKKKKH..",
  ".KKKKK..KKKKKH..",
  "..KKWWWWWWKKKH..",
  "..WWWWWWWWWWKH..",
  ".WWWWWWWWWWWWKW.",
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  "KKKKKWWWWWWKKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKWWGGGGWWKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKKWWWWWWKKKKK",
  ".KKKKKWWWWKKKKK.",
  "..KKKK..KKKK....",
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
]);

// === DIG FRAME 2: Bent forward, shovel blade in ground, earth displaced ===
const dig2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  "KKKKKHWWWWWKKKKK",
  "KKKKHWWGGWWWKKKK",
  "KKKHWWGGGGWWKKKK",
  "KKKKKWWGGWWWKKKK",
  "KKKKKWWWWWWKKKKK",
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  "..B..DAAD..B....",
  "..BD.AAAA.DB....",
  "...BDDDDDDB.....",
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [dig1, dig2];

const png = new PNG({ width: IMG_W, height: IMG_H });
for (let i = 0; i < png.data.length; i += 4) {
  png.data[i] = 0; png.data[i+1] = 0; png.data[i+2] = 0; png.data[i+3] = 0;
}

for (let col = 0; col < COLS; col++) {
  const frame = frames[col];
  const ox = col * FRAME_W;
  for (let y = 0; y < FRAME_H; y++) {
    const line = frame[y] || "";
    for (let x = 0; x < FRAME_W; x++) {
      const ch = line[x] || ".";
      const color = C[ch];
      if (!color) continue;
      const idx = (y * IMG_W + (ox + x)) * 4;
      png.data[idx] = color[0];
      png.data[idx+1] = color[1];
      png.data[idx+2] = color[2];
      png.data[idx+3] = 255;
    }
  }
}

// Scale 8×
const SCALE = 8;
const bigW = IMG_W * SCALE;
const bigH = IMG_H * SCALE;
const big = new PNG({ width: bigW, height: bigH });
for (let i = 0; i < big.data.length; i += 4) {
  big.data[i] = 200; big.data[i+1] = 200; big.data[i+2] = 200; big.data[i+3] = 255;
}

for (let y = 0; y < IMG_H; y++) {
  for (let x = 0; x < IMG_W; x++) {
    const si = (y * IMG_W + x) * 4;
    if (png.data[si+3] === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const di = ((y*SCALE+sy)*bigW + (x*SCALE+sx)) * 4;
        big.data[di] = png.data[si];
        big.data[di+1] = png.data[si+1];
        big.data[di+2] = png.data[si+2];
        big.data[di+3] = 255;
      }
    }
  }
}

const outDir = join(__dirname, "..", "webview-ui", "public", "assets", "characters");
const outPath = join(outDir, "panda_dig_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): standing upright, shovel raised to right side");
console.log("Frame 2 (right): bent forward, shovel blade in ground, earth displaced");
