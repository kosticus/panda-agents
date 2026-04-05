#!/usr/bin/env node
// Generates building/repairing animation preview: 2 frames side by side at 8× scale.
// 32×64 scaled version — pixel-doubled and refined from 16×32 originals.
// Frame 1: panda standing upright, holding wide plank across belly.
// Frame 2: panda crouched (drops 6 rows), plank placed on wall.
// Body anatomy matches the canonical BASE_32 template (generate-base-panda-32-preview.mjs).

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
  T: [200, 160, 96],      // plank wood (golden-amber)
  D: [160, 120, 64],      // dark wood grain (golden-amber)
};

const FRAME_W = 32;
const FRAME_H = 64;
const EMPTY = '................................';

function n(frame) {
  while (frame.length < FRAME_H) frame.push(EMPTY);
  return frame.map(row => {
    if (row.length < FRAME_W) return row + ".".repeat(FRAME_W - row.length);
    if (row.length > FRAME_W) return row.slice(0, FRAME_W);
    return row;
  });
}

// === BUILD FRAME 1: Standing, holding plank across belly ===
// Uses BASE_32 anatomy centered. Plank (T/D) across belly rows 41-44.
const build1 = n([
  // --- Padding (8 rows) ---
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  // --- Ears (5 rows — round dome) ---
  '......KKKK............KKKK......',
  '.....KKKKKK..........KKKKKK.....',
  '....KKKKKKKK........KKKKKKKK....',
  '...KKKKKKKKKK......KKKKKKKKKK...',
  '...KKKKKKKKKK......KKKKKKKKKK...',
  // --- Forehead (3 rows) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',
  // --- Head (4 rows) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',
  // --- Face: eye patches (6 rows) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',
  // --- Muzzle / Jaw (6 rows) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  // --- Band (6 rows) ---
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  // --- Body (12 rows — plank across belly) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',
  'KKKKTTTTTTTTDDDDDDDDTTTTTTTTKKKK',
  'KKKKTTTTTTTTDDDDDDDDTTTTTTTTKKKK',
  'KKKKTTTTTTTTDDDDDDDDTTTTTTTTKKKK',
  'KKKKTTTTTTTTDDDDDDDDTTTTTTTTKKKK',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',
  'KKKKKKKWWWWWWWGGGGWWWWWWWKKKKKKK',
  'KKKKKKWWWWWWWWWWWWWWWWWWWWKKKKKK',
  '..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..',
  '...KKKKKKKKKWWWWWWWWKKKKKKKKK...',
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',
  // --- Legs (6 rows) ---
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '.....KKKKKKKKK....KKKKKKKKK.....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  // --- Wall (4 rows) ---
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',
]);

// === BUILD FRAME 2: Crouched, plank placed on wall ===
// Body drops ~6 rows, body compressed. Wall gains plank on top.
const build2 = n([
  // --- Padding (14 rows) ---
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  // --- Ears (5 rows — round dome) ---
  '......KKKK............KKKK......',
  '.....KKKKKK..........KKKKKK.....',
  '....KKKKKKKK........KKKKKKKK....',
  '...KKKKKKKKKK......KKKKKKKKKK...',
  '...KKKKKKKKKK......KKKKKKKKKK...',
  // --- Forehead (3 rows) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',
  // --- Head (4 rows) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',
  // --- Face: eye patches (6 rows) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',
  // --- Muzzle / Jaw (6 rows) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  // --- Band (6 rows) ---
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  // --- Body (8 rows — compressed, no plank) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',
  '..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..',
  // --- Legs (4 rows — crouched) ---
  '......KKKKKKKK....KKKKKKKK......',
  '.....KKKKKKKKK....KKKKKKKKK.....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  // --- Wall (6 rows — plank placed on top) ---
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [build1, build2];

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
const outPath = join(outDir, "panda_build_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): standing, holding wide plank across belly (32×64)");
console.log("Frame 2 (right): crouched (dropped 6 rows), plank placed on wall (32×64)");
