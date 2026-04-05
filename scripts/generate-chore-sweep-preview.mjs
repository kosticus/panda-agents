#!/usr/bin/env node
// Generates sweeping/cleaning animation preview: 2 frames side by side at 8× scale.
// 32×64 scaled version — pixel-doubled and refined from 16×32 originals.
// Frame 1: broom sweeps LEFT — panda leans left, broom angled left low
// Frame 2: broom sweeps RIGHT — panda leans right, broom angled right low
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
  H: [150, 48, 32],       // broom handle (reddish wood)
  R: [240, 208, 96],      // broom bristles (straw)
  S: [220, 188, 72],      // broom bristle tips
  D: [120, 100, 60],      // dirt/dust being swept
};

const FRAME_W = 32;
const FRAME_H = 64;
const E = '................................';

function n(frame) {
  while (frame.length < FRAME_H) frame.push(E);
  return frame.map(row => {
    if (row.length < FRAME_W) return row + ".".repeat(FRAME_W - row.length);
    if (row.length > FRAME_W) return row.slice(0, FRAME_W);
    return row;
  });
}

// === SWEEP FRAME 1: Body leans LEFT (~2px), broom sweeps left along ground ===
// Ears/head/face use BASE_32 anatomy shifted 2px left.
// Broom handle (HH) runs down left edge; bristles (RRRRRRRR) at bottom-left.
const sweep1 = n([
  E,E,E,E,E,E,
  // --- Ears (5 rows — shifted 2px left) ---
  '....KKKK............KKKK........',
  '...KKKKKK..........KKKKKK.......',
  '..KKKKKKKK........KKKKKKKK......',
  '.KKKKKKKKKK......KKKKKKKKKK.....',
  '.KKKKKKKKKK......KKKKKKKKKK.....',
  // --- Forehead (3 rows) ---
  '..KKKKKKKKWWWWWWWWKKKKKKKK......',
  '..KKKKKKWWWWWWWWWWWWKKKKKK......',
  '...KKWWWWWWWWWWWWWWWWWWKK.......',
  // --- Head (4 rows) ---
  '..WWWWWWWWWWWWWWWWWWWWWWWW......',
  '.WWWWWWWWWWWWWWWWWWWWWWWWWW.....',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW....',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW....',
  // --- Face: eye patches (6 rows) ---
  'WWWWWWWKKKKKWWWWKKKKKWWWWWWW....',
  'WWWWWWKKKKKKWWWWKKKKKKWWWWWW....',
  'WWWWKKKKEEKKWWWWKKEEKKWWWWWW....',
  'WWWWKKKKEEKKWWWWKKEEKKWWWWWW....',
  'WWWWWWKKKKKKWWWWKKKKKKWWWWWW....',
  'WWWWWWWKKKKKWWWWKKKKKWWWWWWW....',
  // --- Muzzle / Jaw (6 rows) ---
  '.WWWWWWWWWWWKKKKWWWWWWWWWWW.....',
  '..WWWWWWWWWWKKKKWWWWWWWWWW......',
  '..WWWWWWWWWWWWWWWWWWWWWWWW......',
  '...WWWWWWWWWWWWWWWWWWWWWW.......',
  '....WWWWWWWWWWWWWWWWWWWW........',
  '....WWWWWWWWWWWWWWWWWWWW........',
  // --- Band (6 rows) ---
  '..KKKKKKKKKKKKKKKKKKKKKKKK......',
  '.KKKKKKKKKKKKKKKKKKKKKKKKKK.....',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKK....',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKK...',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  // --- Body (12 rows — broom enters left) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKK..',
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKK..',
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKK..',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKK..',
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKK..',
  'HHKKKKKKWWWWWGGGGGGWWWWWKKKKKK..',
  'KHKKKKKKWWWWWWWGGGGWWWWWWKKKKK..',
  'HHKKKKKWWWWWWWWWWWWWWWWWWKKKK...',
  'HH..KKKKKKKKWWWWWWWWKKKKKKKK....',
  'HH...KKKKKKKWWWWWWWWKKKKKKK.....',
  'HH....KKKKKKWWWWWWWWKKKKKK......',
  'HH.....KKKKKWWWWWWWWKKKKK.......',
  // --- Legs (6 rows) ---
  'HH....KKKKKKKK....KKKKKKKK......',
  'HH....KKKKKKKK....KKKKKKKK......',
  'RH....KKKKKKKK....KKKKKKKK......',
  'RH...KKKKKKKKK....KKKKKKKKK.....',
  'RR..KKKKKKKKKK....KKKKKKKKKK....',
  'RR..KKKKKKKKKK....KKKKKKKKKK....',
  // --- Broom bristles (4 rows) ---
  'RRRRRRRR........................',
  'RRRRRRRR........................',
  'SSSSSSSS........................',
  'SSSSSSSS........................',
  E,E,E,E,E,E,
]);

// === SWEEP FRAME 2: Body leans RIGHT (~2px), broom sweeps right along ground ===
// Mirror of frame 1. Broom handle (HH) on right edge; bristles at bottom-right.
const sweep2 = n([
  E,E,E,E,E,E,
  // --- Ears (5 rows — shifted 2px right) ---
  '........KKKK............KKKK....',
  '.......KKKKKK..........KKKKKK...',
  '......KKKKKKKK........KKKKKKKK..',
  '.....KKKKKKKKKK......KKKKKKKKKK.',
  '.....KKKKKKKKKK......KKKKKKKKKK.',
  // --- Forehead (3 rows) ---
  '......KKKKKKKKWWWWWWWWKKKKKKKK..',
  '......KKKKKKWWWWWWWWWWWWKKKKKK..',
  '.......KKWWWWWWWWWWWWWWWWWWKK...',
  // --- Head (4 rows) ---
  '......WWWWWWWWWWWWWWWWWWWWWWWW..',
  '.....WWWWWWWWWWWWWWWWWWWWWWWWWW.',
  '....WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  '....WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  // --- Face: eye patches (6 rows) ---
  '....WWWWWWWKKKKKWWWWKKKKKWWWWWWW',
  '....WWWWWWKKKKKKWWWWKKKKKKWWWWWW',
  '....WWWWKKKKEEKKWWWWKKEEKKWWWWWW',
  '....WWWWKKKKEEKKWWWWKKEEKKWWWWWW',
  '....WWWWWWKKKKKKWWWWKKKKKKWWWWWW',
  '....WWWWWWWKKKKKWWWWKKKKKWWWWWWW',
  // --- Muzzle / Jaw (6 rows) ---
  '.....WWWWWWWWWWWKKKKWWWWWWWWWWW.',
  '......WWWWWWWWWWKKKKWWWWWWWWWW..',
  '......WWWWWWWWWWWWWWWWWWWWWWWW..',
  '.......WWWWWWWWWWWWWWWWWWWWWW...',
  '........WWWWWWWWWWWWWWWWWWWW....',
  '........WWWWWWWWWWWWWWWWWWWW....',
  // --- Band (6 rows) ---
  '......KKKKKKKKKKKKKKKKKKKKKKKK..',
  '.....KKKKKKKKKKKKKKKKKKKKKKKKKK.',
  '....KKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '...KKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  // --- Body (12 rows — broom enters right) ---
  '..KKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',
  '..KKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',
  '..KKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',
  '..KKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',
  '..KKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',
  '..KKKKKKWWWWWGGGGGGWWWWWKKKKKKHH',
  '..KKKKKWWWWWWGGGGWWWWWWWKKKKKKHK',
  '...KKKKWWWWWWWWWWWWWWWWWWKKKKKHH',
  '....KKKKKKKKWWWWWWWWKKKKKKKK..HH',
  '.....KKKKKKKWWWWWWWWKKKKKKK...HH',
  '......KKKKKKWWWWWWWWKKKKKK....HH',
  '.......KKKKKWWWWWWWWKKKKK.....HH',
  // --- Legs (6 rows) ---
  '......KKKKKKKK....KKKKKKKK....HH',
  '......KKKKKKKK....KKKKKKKK....HH',
  '......KKKKKKKK....KKKKKKKK....HR',
  '.....KKKKKKKKK....KKKKKKKKK...HR',
  '....KKKKKKKKKK....KKKKKKKKKK..RR',
  '....KKKKKKKKKK....KKKKKKKKKK..RR',
  // --- Broom bristles (4 rows) ---
  '........................RRRRRRRR',
  '........................RRRRRRRR',
  '........................SSSSSSSS',
  '........................SSSSSSSS',
  E,E,E,E,E,E,
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [sweep1, sweep2];

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
const outPath = join(outDir, "panda_sweep_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): lean left — BASE_32 anatomy shifted left, broom sweeps left along ground");
console.log("Frame 2 (right): lean right — BASE_32 anatomy shifted right, broom sweeps right along ground");
