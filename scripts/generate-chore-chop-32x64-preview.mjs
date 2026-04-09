#!/usr/bin/env node
// Generates chop animation preview: 2 frames side by side at 8× scale.
// 32×64 scaled version — pixel-doubled and refined from 16×32 originals.
// Frame 1 (left): wind-up — axe overhead, arms cover face, bare belly
// Frame 2 (right): chopping down — canonical body, axe handle through belly/legs to stump
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
  T: [145, 110, 65],      // cut face rings
  D: [90, 65, 35],        // bark / dark grain
  R: [170, 140, 90],      // cut face light interior
  A: [160, 160, 170],     // axe head (steel)
  H: [120, 80, 50],       // axe handle
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

// === CHOP FRAME 1: Wind-up — axe overhead, arms cover face ===
// HH at cols 15-16 from blade through arms; stops at shoulder close.
// Below shoulders: ears with white gap, then arm K mass covers face
// (nose bridge + eye glints peek through). No handle below shoulders.
const chop1 = n([
  // --- Axe blade overhead (4 rows — asymmetric wedge, blade left of handle) ---
  '........AAAAAAAHH...............',
  '..........AAAAAHH...............',
  '............AAAHH...............',
  '.............AAHH...............',
  // --- Handle gap (2 rows) ---
  '...............HH...............',
  '...............HH...............',
  // --- Arms grip handle, widen to ears (6 rows — HH visible throughout) ---
  '..........KKKK.HH.KKKK..........',
  '.........KKKKKKHHKKKKKK.........',
  '........KKKKKKKHHKKKKKKK........',
  '.......KKKKKKKKHHKKKKKKKK.......',
  '......KKKKKKKKKHHKKKKKKKKK......',
  '.....KKKKKKKKKKHHKKKKKKKKKK.....',
  // --- Ears (4 rows — W-filled gap, no handle) ---
  '....KKKKKKKKKKWWWWKKKKKKKKKK....',
  '...KKKKKKKKKKWWWWWWKKKKKKKKKK...',
  '...KKKKKKKKKKWWWWWWKKKKKKKKKK...',
  '...KKKKKKKKKKWWWWWWKKKKKKKKKK...',
  // --- Transition: ear gap contracts to nose bridge (1 row) ---
  '..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..',
  // --- Face: arm K mass + nose bridge (3 rows) ---
  '..KKKKKKKKKKKKWWWWKKKKKKKKKKKK..',
  '..KKKKKKKKKKKKWWWWKKKKKKKKKKKK..',
  '..KKKKKKKKEEKKWWWWKKEEKKKKKKKK..',
  // --- Eyes peek through arm K (1 row) ---
  '..KKKKKKKKEEKKWWWWKKEEKKKKKKKK..',
  // --- Below eyes: left window opens (1 row) ---
  '..KKKKKKKKKKKKWWWWKKKKKKKKKKKK..',
  // --- Muzzle: arm K tapers, cheeks open (5 rows) ---
  '..KKKKKWWWWWWWKKKKWWWWWWWKKKKK..',
  '..KKKKKWWWWWWWKKKKWWWWWWWKKKKK..',
  // --- Jaw (4 rows — 5K per side, consistent arm K) ---
  '..KKKKKWWWWWWWWWWWWWWWWWWKKKKK..',
  '..KKKKKWWWWWWWWWWWWWWWWWWKKKKK..',
  '..KKKKKWWWWWWWWWWWWWWWWWWKKKKK..',
  '..KKKKKWWWWWWWWWWWWWWWWWWKKKKK..',
  // --- Band (6 rows) ---
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',
  '.....KKKKKKKKKKKKKKKKKKKKKK.....',
  '......KKKKKKKKKKKKKKKKKKKK......',
  // --- Body (12 rows — bare belly, widens to pear-shape hips) ---
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWGGGGWWWWWWWW......',
  '......WWWWWWWGGGGGGWWWWWWW......',
  '......WWWWWWGGGGGGGGWWWWWW......',
  '......WWWWWWWGGGGGGWWWWWWW......',
  '......WWWWWWWWGGGGWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  '......WWWWWWWWWWWWWWWWWWWW......',
  // --- Legs (6 rows — standard stance, feet planted same as frame 2) ---
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '......KKKKKKKK....KKKKKKKK......',
  '.....KKKKKKKKK....KKKKKKKKK.....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  '....KKKKKKKKKK....KKKKKKKKKK....',
  // --- Stump (3 rows — taller, R-dominant wood vs dig's dirt) ---
  '......DDRRRRRRRRRRRRRRRRDD......',
  '......DDRRRRTTTTTTTTRRRRDD......',
  '......DDDDDDDDDDDDDDDDDDDD......',
  // --- Padding (9 rows) ---
  E,E,E,E,E,E,E,E,E,
]);

// === CHOP FRAME 2: Chopping down — canonical body, handle through belly/legs to stump ===
// Standard BASE_32 head/face at top, HH at cols 15-16 through body,
// arms converge to grip handle (dig pattern), axe blade embedded in stump.
const chop2 = n([
  // --- Padding (4 rows) ---
  E,E,E,E,
  // --- Ears (5 rows — BASE_32 anatomy) ---
  '......KKKK............KKKK......',  //  5  4px dome tip
  '.....KKKKKK..........KKKKKK.....',  //  6  6px
  '....KKKKKKKK........KKKKKKKK....',  //  7  8px
  '...KKKKKKKKKK......KKKKKKKKKK...',  //  8  10px (max)
  '...KKKKKKKKKK......KKKKKKKKKK...',  //  9  10px
  // --- Forehead (3 rows — BASE_32) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',  // 10  ear-head bridge
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',  // 11
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',  // 12
  // --- Head (4 rows — BASE_32) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 13  24px
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',  // 14  26px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 15  28px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 16  28px
  // --- Face: eye patches (6 rows — BASE_32) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 17  rounded top (5K)
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 18  full patch (6K)
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 19  eyes + glint
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 20  eyes + glint
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 21  full patch (6K)
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 22  rounded bottom (5K)
  // --- Muzzle / Jaw (6 rows — BASE_32) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',  // 23  26px
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',  // 24  24px
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 25  24px
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',  // 26  22px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 27  20px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 28  20px
  // --- Band (6 rows — BASE_32) ---
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',  // 29  24K
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',  // 30  26K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',  // 31  28K
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',  // 32  30K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 33  32K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 34  32K
  // --- Body (12 rows — arms converge to grip HH, dig pattern) ---
  'KKKKKKKKKWWWWWWHHWWWWWWKKKKKKKKK',  // 35  shoulder (9K+6W+HH+6W+9K)
  'KKKKKKKKWWWWWWWHHWWWWWWWKKKKKKKK',  // 36  shoulder (8K+7W+HH+7W+8K)
  'KKKKKKKKKWWWWWGHHGWWWWWKKKKKKKKK',  // 37  arms angle in (9K+5W+G)
  'KKKKKKKKKKWWWGGHHGGWWWKKKKKKKKKK',  // 38  converging (10K+4W+G)
  'KKKKKKKKKKKWGGGHHGGGWKKKKKKKKKKK',  // 39  arms close (11K+3W+G)
  'KKKKKKKKKKKKWGGHHGGWKKKKKKKKKKKK',  // 40  grip: paw pads at handle
  'KKKKKKKKKKKKWWGHHGWWKKKKKKKKKKKK',  // 41  grip continues
  'KKKKKKKKKKKWWWWHHWWWWKKKKKKKKKKK',  // 42  wrist release (11K+4W)
  '..KKKKKKKKKKWWWHHWWWKKKKKKKK....',  // 43  hips
  '...KKKKKKKKKWWWHHWWWKKKKKKK.....',  // 44  taper
  '....KKKKKKKKWWWHHWWWKKKKKKKK....',  // 45  taper
  '.....KKKKKKKWWWHHWWWKKKKKKK.....',  // 46  taper
  // --- Legs (6 rows — HH through center gap) ---
  '......KKKKKKKK.HH.KKKKKKKK......',  // 47  8px per leg
  '......KKKKKKKK.HH.KKKKKKKK......',  // 48  8px
  '......KKKKKKKK.HH.KKKKKKKK......',  // 49  8px
  '.....KKKKKKKKK.HH.KKKKKKKKK.....',  // 50  9px smooth step
  '....KKKKKKKKKK.HH.KKKKKKKKKK....',  // 51  10px feet
  '....KKKKKKKKKK.HH.KKKKKKKKKK....',  // 52  10px feet
  // --- Axe blade in stump + stump (3 rows — matches frame 1 stump) ---
  '......DDAAAAAAAAHHRRRRRRDD......',  // 53  blade into cut face, wood on right
  '......DDRRRRTTTTTTTTRRRRDD......',  // 54  visible ring
  '......DDDDDDDDDDDDDDDDDDDD......',  // 55  bark base
  // --- Padding (9 rows) ---
  E,E,E,E,E,E,E,E,E,
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [chop1, chop2];

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
const outPath = join(outDir, "panda_chop_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): wind-up — axe overhead, arms cover face, bare belly");
console.log("Frame 2 (right): chopping down — canonical body, handle through belly/legs to stump");
