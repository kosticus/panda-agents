#!/usr/bin/env node
// Generates watering/tending crops animation preview: 2 frames side by side at 8× scale.
// 32×64 scaled version — pixel-doubled and refined from 16×32 originals.
// Frame 1 (left): standing upright — full canonical pose, can at hip with spout visible, dry crops.
// Frame 2 (right): bent forward — head 4 rows lower, can tilted, water stream to crops.
// Feet same vertical position in both frames. Head height difference sells the bend.
// Watering can has shaped profile (Q color) with spout. Water stream (D) in bent frame only.
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
  N: [100, 160, 80],      // plant green (darker)
  L: [140, 190, 100],     // plant green (lighter / sprout)
  B: [160, 120, 70],      // soil/dirt brown
  Q: [80, 130, 180],      // watering can (blue-gray)
  D: [100, 170, 220],     // water drops
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

// === WATER FRAME 1: Standing upright, can at right hip (not pouring) ===
// Body anatomy matches canonical BASE_32 template.
// Watering can (Q) on RIGHT side at hip level, tapered shape.
// Bottom 6 rows: dry crops (N/L) over soil (B).
const water1 = n([
  E,E,E,E,E,E,
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
  // --- Body (12 rows — can at right hip) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKQQ',
  'KKKKKKKWWWWWWWGGGGWWWWWWKKK.QQQQ',
  'KKKKKKWWWWWWWWWWWWWWWWWKK.QQQQQQ',
  '..KKKKKKKKKKWWWWWWWWKKKK.QQQQQQ.',
  '...KKKKKKKKKWWWWWWWWKKKK.QQQQQQ.',
  '....KKKKKKKKWWWWWWWWKKKKK..QQQQ.',
  '.....KKKKKKKWWWWWWWWKKKKK.......',
  // --- Legs (6 rows) ---
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '.....KKKKKKKKK....KKKKKKKKK.....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  // --- Crops: dry (6 rows) ---
  '..LL.NN.LL.NN.LL.NN.LL.NN.LL..',
  '..NL.LN.NL.LN.NL.LN.NL.LN.NL.',
  '..L..NL..L.NL..L..NL..L..NL...',
  '..N..LN..N.LN..N..LN..N..LN...',
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
  // --- Padding (4 rows) ---
  E,E,E,E,
]);

// === WATER FRAME 2: Bent forward (~4 rows drop), can tilted, water pouring ===
// Body drops 4 rows from frame 1. Ears compress, band compresses slightly.
// Arm extends right with tilted can. Water (D) cascades from spout.
const water2 = n([
  E,E,E,E,E,E,E,E,E,E,
  // --- Ears (4 rows — compressed, drop 1 hold row) ---
  '......KKKK............KKKK......',
  '.....KKKKKK..........KKKKKK.....',
  '....KKKKKKKK........KKKKKKKK....',
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
  // --- Band (5 rows — compressed: drop top row) ---
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  // --- Body (10 rows — arm extends, can tilted, water pours) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',
  'KKKKKKKWWWWWWGGGGWWWWWKK.QQQQQD.',
  'KKKKKKWWWWWWWWWWWWWWWWK.QQQQQ.D.',
  '..KKKKKKKKKWWWWWWWWKKKKK..QQQ.DD',
  '...KKKKKKKKWWWWWWWWKKKK.....DDD.',
  '....KKKKKKKWWWWWWWWKKKKK....DD..',
  // --- Legs (4 rows — slightly compressed from 6) ---
  '.....KKKKKKKK....KKKKKKKK.D.D..',
  '.....KKKKKKKK....KKKKKKKKD..D..',
  '....KKKKKKKKK....KKKKKKKKK.DD..',
  '....KKKKKKKKKK..KKKKKKKKKK.D...',
  // --- Crops with water splash (6 rows) ---
  'LL.NNDLL.DNNDDL.DNDLLD.DDDD.D..',
  'NL.LNDNL..LNDNL.DLNDNLD.DD.D..',
  'L..NL.DL..NLDNL..DNLD.DD.......',
  'N..LN..N..LNDDL..LN.D.N........',
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
  // --- Padding (6 rows) ---
  E,E,E,E,E,E,
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [water1, water2];

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
const outPath = join(outDir, "panda_water_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): standing upright — can at hip with spout, dry crops");
console.log("Frame 2 (right): bent forward — head 4 rows lower, can tilted, water stream to crops");
