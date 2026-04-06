#!/usr/bin/env node
// Generates dig animation preview: 2 frames side by side at 8× scale.
// 32×64 scaled version — pixel-doubled and refined from 16×32 originals.
// Frame 1 (left): standing upright, shovel handle runs from body through legs to blade in ground
// Frame 2 (right): standing upright, shovel raised overhead with blade at top
// Body anatomy matches the canonical BASE_32 template.

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

// === DIG FRAME 1: Standing upright, shovel handle through body to blade in ground ===
// HH at cols 15-16 runs from upper body through leg gap to blade/earth at bottom.
const dig1 = n([
  E,E,E,E,E,E,
  // --- Ears (5 rows — BASE_32 anatomy) ---
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
  // --- Body (12 rows — HH enters at shoulder) ---
  'KKKKKKKKKWWWWWWHHWWWWWWKKKKKKKKK',
  'KKKKKKKKWWWWWWWHHWWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWWGHHGWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGHHGGWWWWWKKKKKKKK',
  'KKKKKKKKWWWWGGGHHGGGWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGHHGGWWWWWKKKKKKKK',
  'KKKKKKKWWWWWWWGHHGWWWWWWWKKKKKKK',
  'KKKKKKWWWWWWWWWHHWWWWWWWWWKKKKKK',
  '..KKKKKKKKKKWWWHHWWWKKKKKKKK....',
  '...KKKKKKKKKWWWHHWWWKKKKKKK.....',
  '....KKKKKKKKWWWHHWWWKKKKKKKK....',
  '.....KKKKKKKWWWHHWWWKKKKKKK.....',
  // --- Legs (6 rows — HH through center gap) ---
  '......KKKKKKKK.HH.KKKKKKKK......',
  '......KKKKKKKK.HH.KKKKKKKK......',
  '......KKKKKKKK.HH.KKKKKKKK......',
  '.....KKKKKKKKK.HH.KKKKKKKKK.....',
  '....KKKKKKKKKK.HH.KKKKKKKKKK....',
  '....KKKKKKKKKK.HH.KKKKKKKKKK....',
  // --- Blade + earth (2 rows) ---
  '........BBBAAAAHHAAAABBB........',
  '........BBBDDDDDDDDDDBBB........',
  // --- Padding (8 rows) ---
  E,E,E,E,E,E,E,E,
]);

// === DIG FRAME 2: Standing upright, shovel raised overhead ===
// Blade (A) at top, HH at cols 15-16 through head/face/band/upper body.
// Ears compressed (4 rows), band compressed (5 rows) to fit blade above.
const dig2 = n([
  // --- Blade overhead (6 rows — tapered) ---
  '..............AAAA..............',
  '............AAAAAAAA............',
  '..........AAAAAAAAAAAA..........',
  '..........AAAAAAAAAAAA..........',
  '........AAAAAAAAAAAAAAAA........',
  '........AAAAAAAAAAAAAAAA........',
  // --- Handle gap (2 rows) ---
  '...............HH...............',
  '...............HH...............',
  // --- Ears (4 rows — compressed, grow inward to meet handle) ---
  '.....KKKKKKKK..HH..KKKKKKKK.....',
  '....KKKKKKKKKK.HH.KKKKKKKKKK....',
  '...KKKKKKKKKKKKHHKKKKKKKKKKKK...',
  '...KKKKKKKKKKKKHHKKKKKKKKKKKK...',
  // --- Forehead (3 rows — HH through center) ---
  '....KKKKKKKKWWWHHWWWKKKKKKKK....',
  '....KKKKKKWWWWWHHWWWWWKKKKKK....',
  '.....KKWWWWWWWWHHWWWWWWWWKK.....',
  // --- Head (4 rows — HH through white) ---
  '....WWWWWWWWWWWHHWWWWWWWWWWW....',
  '...WWWWWWWWWWWWHHWWWWWWWWWWWW...',
  '..WWWWWWWWWWWWWHHWWWWWWWWWWWWW..',
  '..WWWWWWWWWWWWWHHWWWWWWWWWWWWW..',
  // --- Face: eye patches (6 rows — HH splits nose bridge) ---
  '..WWWWWWWKKKKKWHHWKKKKKWWWWWWW..',
  '..WWWWWWKKKKKKWHHWKKKKKKWWWWWW..',
  '..WWWWKKKKEEKKWHHWKKEEKKWWWWWW..',
  '..WWWWKKKKEEKKWHHWKKEEKKWWWWWW..',
  '..WWWWWWKKKKKKWHHWKKKKKKWWWWWW..',
  '..WWWWWWWKKKKKWHHWKKKKKWWWWWWW..',
  // --- Muzzle / Jaw (6 rows — HH through nose/center) ---
  '...WWWWWWWWWWWKHHKWWWWWWWWWWW...',
  '....WWWWWWWWWWKHHKWWWWWWWWWW....',
  '....WWWWWWWWWWWHHWWWWWWWWWWW....',
  '.....WWWWWWWWWWHHWWWWWWWWWW.....',
  '......WWWWWWWWWHHWWWWWWWWW......',
  '......WWWWWWWWWHHWWWWWWWWW......',
  // --- Band (5 rows — compressed, HH through center) ---
  '...KKKKKKKKKKKKHHKKKKKKKKKKKK...',
  '..KKKKKKKKKKKKKHHKKKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKHHKKKKKKKKKKKKKK.',
  'KKKKKKKKKKKKKKKHHKKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKHHKKKKKKKKKKKKKKK',
  // --- Body (12 rows — HH through shoulder/chest, stops at belly) ---
  'KKKKKKKKKWWWWWWHHWWWWWWKKKKKKKKK',
  'KKKKKKKKWWWWWWWHHWWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWWGHHGWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGHHGGWWWWWKKKKKKKK',
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',
  'KKKKKKKWWWWWWWGGGGWWWWWWWKKKKKKK',
  'KKKKKKWWWWWWWWWWWWWWWWWWWWKKKKKK',
  '..KKKKKKKKKKWWWWWWWWKKKKKKKK....',
  '...KKKKKKKKKWWWWWWWWKKKKKKK.....',
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',
  '.....KKKKKKKWWWWWWWWKKKKKKK.....',
  // --- Legs (6 rows — standard stance) ---
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '.....KKKKKKKKK....KKKKKKKKK.....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  // --- Padding (10 rows) ---
  E,E,E,E,E,E,E,E,E,E,
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
const outPath = join(outDir, "panda_dig_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): standing upright, shovel handle through body to blade in ground");
console.log("Frame 2 (right): standing upright, shovel raised overhead");
