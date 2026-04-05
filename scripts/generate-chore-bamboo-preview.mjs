#!/usr/bin/env node
// Generates bamboo harvesting animation preview: 2 frames side by side at 8× scale.
// 32×64 scaled version — pixel-doubled and refined from 16×32 originals.
// Frame 1 (left): body leans left, arms reach right to grip bamboo stalk. Stalk planted in ground.
// Frame 2 (right): body leans right, stalk pulled up ~8 rows. Air gap between stalk bottom and ground.
// Bamboo stalk is 4px wide (NNNV) with J-color node. Body anatomy matches canonical BASE_32 template.

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
  N: [124, 200, 32],      // bamboo green (bright lime)
  V: [160, 224, 64],      // bamboo green (bright yellow-green)
  J: [90, 160, 16],       // bamboo node (lime-dark)
  D: [160, 90, 48],       // dirt (warm red-brown)
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

// === BAMBOO FRAME 1: Body leans LEFT (~2px), stalk planted at right side ===
// Stalk (NNNV, 4px) at cols 28-31. Body anatomy matches BASE_32 shifted 2px left.
// Ground at rows 55-56 (dirt D).
const bamboo1 = n([
  E,E,E,E,E,E,
  // --- Ears (5 rows — shifted 2px left) ---
  '....KKKK............KKKK........',
  '...KKKKKK..........KKKKKK.......',
  '..KKKKKKKK........KKKKKKKK......',
  '.KKKKKKKKKK......KKKKKKKKKK.....',
  '.KKKKKKKKKK......KKKKKKKKKK.....',
  // --- Forehead (3 rows — shifted 2px left) ---
  '..KKKKKKKKWWWWWWWWKKKKKKKK......',
  '..KKKKKKWWWWWWWWWWWWKKKKKK......',
  '...KKWWWWWWWWWWWWWWWWWWKK.......',
  // --- Head (4 rows — shifted 2px left) ---
  '..WWWWWWWWWWWWWWWWWWWWWWWW......',
  '.WWWWWWWWWWWWWWWWWWWWWWWWWW.....',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW....',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW....',
  // --- Face: eye patches (6 rows — shifted 2px left) ---
  'WWWWWWWKKKKKWWWWKKKKKWWWWWWW....',
  'WWWWWWKKKKKKWWWWKKKKKKWWWWWW....',
  'WWWWKKKKEEKKWWWWKKEEKKWWWWWW....',
  'WWWWKKKKEEKKWWWWKKEEKKWWWWWW....',
  'WWWWWWKKKKKKWWWWKKKKKKWWWWWW....',
  'WWWWWWWKKKKKWWWWKKKKKWWWWWWW....',
  // --- Muzzle / Jaw (6 rows — shifted 2px left) ---
  '.WWWWWWWWWWWKKKKWWWWWWWWWWW.....',
  '..WWWWWWWWWWKKKKWWWWWWWWWW......',
  '..WWWWWWWWWWWWWWWWWWWWWWWW......',
  '...WWWWWWWWWWWWWWWWWWWWWW.......',
  '....WWWWWWWWWWWWWWWWWWWW........',
  '....WWWWWWWWWWWWWWWWWWWW........',
  // --- Band (6 rows — transition from shifted head to centered body) ---
  '..KKKKKKKKKKKKKKKKKKKKKKKK......',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKK....',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  // --- Body upper (4 rows — centered like BASE_32, no stalk) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',
  'KKKKKKKKWWWWGGGGGGGGWWWWKKK.NNNV',
  'KKKKKKKKWWWWWGGGGGGWWWWWKKK.NNNV',
  'KKKKKKKWWWWWWWGGGGWWWWWWWKK.NNNV',
  'KKKKKKWWWWWWWWWWWWWWWWWWWWK.NNNV',
  // --- Hips/taper (4 rows — centered, stalk alongside) ---
  '..KKKKKKKKKKWWWWWWWWKKKKKKK.NNNV',
  '...KKKKKKKKKWWWWWWWWKKKKKKK.NNNV',
  '....KKKKKKKKWWWWWWWWKKKKKKK.NNNV',
  '.....KKKKKKKWWWWWWWWKKKKKKK.NNNV',
  // --- Legs (6 rows — centered, stalk alongside) ---
  '......KKKKKKKK....KKKKKKKK..NNNV',
  '......KKKKKKKK....KKKKKKKK..NNNV',
  '......KKKKKKKK....KKKKKKKK..JNNV',
  '.....KKKKKKKKK....KKKKKKKKK.NNNV',
  '....KKKKKKKKKK....KKKKKKKKKKNNNV',
  '....KKKKKKKKKK....KKKKKKKKKKNNNV',
  // --- Ground (2 rows — stalk planted in dirt) ---
  '............................NNNV',
  '..........................DDDDDD',
  // --- Padding (8 rows) ---
  E,E,E,E,E,E,E,E,
]);

// === BAMBOO FRAME 2: Body leans RIGHT (~2px), stalk pulled UP ~8 rows ===
// Stalk (NNNV, 4px) from band (row 32) through row 46. Air gap from 47 to ground.
// Ground at rows 55-56 (same as frame 1). Disturbed dirt where stalk was pulled.
const bamboo2 = n([
  E,E,E,E,E,E,
  // --- Ears (5 rows — shifted 2px right) ---
  '........KKKK............KKKK....',
  '.......KKKKKK..........KKKKKK...',
  '......KKKKKKKK........KKKKKKKK..',
  '.....KKKKKKKKKK......KKKKKKKKKK.',
  '.....KKKKKKKKKK......KKKKKKKKKK.',
  // --- Forehead (3 rows — shifted 2px right) ---
  '......KKKKKKKKWWWWWWWWKKKKKKKK..',
  '......KKKKKKWWWWWWWWWWWWKKKKKK..',
  '.......KKWWWWWWWWWWWWWWWWWWKK...',
  // --- Head (4 rows — shifted 2px right) ---
  '......WWWWWWWWWWWWWWWWWWWWWWWW..',
  '.....WWWWWWWWWWWWWWWWWWWWWWWWWW.',
  '....WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  '....WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  // --- Face: eye patches (6 rows — shifted 2px right) ---
  '....WWWWWWWKKKKKWWWWKKKKKWWWWWWW',
  '....WWWWWWKKKKKKWWWWKKKKKKWWWWWW',
  '....WWWWKKKKEEKKWWWWKKEEKKWWWWWW',
  '....WWWWKKKKEEKKWWWWKKEEKKWWWWWW',
  '....WWWWWWKKKKKKWWWWKKKKKKWWWWWW',
  '....WWWWWWWKKKKKWWWWKKKKKWWWWWWW',
  // --- Muzzle / Jaw (6 rows — shifted 2px right) ---
  '.....WWWWWWWWWWWKKKKWWWWWWWWWWW.',
  '......WWWWWWWWWWKKKKWWWWWWWWWW..',
  '......WWWWWWWWWWWWWWWWWWWWWWWW..',
  '.......WWWWWWWWWWWWWWWWWWWWWW...',
  '........WWWWWWWWWWWWWWWWWWWW....',
  '........WWWWWWWWWWWWWWWWWWWW....',
  // --- Band (6 rows — shifted right like head, stalk alongside) ---
  '......KKKKKKKKKKKKKKKKKKKKKKKK..',
  '.....KKKKKKKKKKKKKKKKKKKKKKKNNNV',
  '....KKKKKKKKKKKKKKKKKKKKKKKKNNNV',
  '...KKKKKKKKKKKKKKKKKKKKKKKKKJNNV',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKNNNV',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKNNNV',
  // --- Body upper (8 rows — shifted 2px right, arm tapers toward stalk) ---
  '..KKKKKKKWWWWWWWWWWWWWWWWKKKNNNV',
  '..KKKKKKWWWWWWWWWWWWWWWWWKKKNNNV',
  '..KKKKKKWWWWWWGGGGWWWWWWWKKKNNNV',
  '..KKKKKKWWWWWGGGGGGWWWWWWWKKJNNV',
  '..KKKKKKWWWWGGGGGGGGWWWWWWKKNNNV',
  '..KKKKKKWWWWWGGGGGGWWWWWWWKKNNNV',
  '..KKKKKWWWWWWWGGGGWWWWWWWWK.NNNV',
  '..KKKKWWWWWWWWWWWWWWWWWWWWW.NNNV',
  '..KKKKKKKKKKWWWWWWWWKKKKKKK.NNNV',
  '...KKKKKKKKKWWWWWWWWKKKKKKK.NNNV',
  // --- Body taper (2 rows — centered, no stalk, air gap) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',
  '.....KKKKKKKWWWWWWWWKKKKKKK.....',
  // --- Legs (6 rows — centered, no stalk) ---
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '.....KKKKKKKKK....KKKKKKKKK.....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  // --- Ground (2 rows — disturbed dirt where stalk was) ---
  '..........................DDDDDD',
  '..........................DDDDDD',
  // --- Padding (8 rows) ---
  E,E,E,E,E,E,E,E,
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [bamboo1, bamboo2];

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
const outPath = join(outDir, "panda_bamboo_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): lean left — stalk planted in ground, NNNV at cols 28-31");
console.log("Frame 2 (right): lean right — stalk pulled up ~8 rows, air gap to ground");
