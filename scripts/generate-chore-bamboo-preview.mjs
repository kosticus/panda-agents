#!/usr/bin/env node
// Generates bamboo harvesting animation preview: 2 frames side by side at 8× scale.
// Frame 1: body leans forward 2px, arms reach DOWN to grip bamboo stalk at ground. Stalk planted with 1 row dirt.
// Frame 2: body leans back 2px, stalk pulled UP ~3-4 rows. Root dangles, small air gap above ground.
// Bamboo stalk is 2px wide (NV) with J-color segment nodes every 3-4 rows for bamboo look.

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
  N: [80, 160, 60],       // bamboo green (dark)
  V: [120, 190, 80],      // bamboo green (light)
  J: [60, 120, 40],       // bamboo node (darkest)
  L: [160, 210, 100],     // bamboo leaf
  R: [100, 70, 30],       // roots/dirt brown
  D: [140, 100, 50],      // dirt/earth
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

// === BAMBOO FRAME 1: Body leans forward 2px (shifted left), arms extend DOWN to grip stalk near ground ===
// Stalk is 2px wide (NV) with J-color nodes for bamboo segments. Small leaf at top.
// 3 pad + 5 ears + 6 face + 2 band + 7 body + 3 legs + 1 ground + 5 pad = 32
const bamboo1 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Ears shifted 2px LEFT (lean forward) — 5 rows
  ".KKKK..KKKK.....",       // row 3: ear tops
  "KKKKK..KKKKK....",       // row 4: ear widens
  "KKKKK..KKKKK....",       // row 5: ear holds
  ".KKWWWWWWKK.....",       // row 6: ear base
  ".WWWWWWWWWWWW...",       // row 7: head
  // Face shifted 2px LEFT — 6 rows
  "WWWWWWWWWWWWWW..",       // row 8: head widest
  "WWWKKKWWKKKWWW..",       // row 9: eye patches
  "WWKKEKWWKEKWWW..",       // row 10: eyes with glint
  "WWWKKKWWKKKWWW..",       // row 11: eye patches
  ".WWWWWKKWWWWW...",       // row 12: nose
  ".WWWWWWWWWWWW...",       // row 13: lower face
  // Band shifted 2px left — 2 rows
  "KKKKKKKKKKKKKK..",       // row 14: band
  "KKKKKKKKKKKKKKKK",       // row 15: band wide
  // Body leaned forward, arms reaching DOWN toward stalk — 7 rows
  "KKKKKWWWWWWKKK..",       // row 16: body top
  "KKKKWWWGGWWWKK..",       // row 17: belly
  "KKKKWWGGGGWWKK..",       // row 18: belly wide
  ".KKKWWWGGWWWKK..",       // row 19: body narrows
  "..KKWWWWWWWKK...",       // row 20: body base
  "...KKWWWWWKKL...",       // row 21: body lower, leaf at stalk top
  "....KKWWWKKNV...",       // row 22: paws grip stalk top (NV 2px)
  // Legs + stalk continues to ground — 3 rows
  "...KKKK..KKJV...",       // row 23: legs, stalk with J node
  "...KKKK..KKNV...",       // row 24: legs, stalk continues
  "..KKKKK..KKNV...",       // row 25: feet, stalk near ground
  // Ground — 1 row dirt at stalk base
  "..........DNVD..",       // row 26: dirt around stalk base
]);

// === BAMBOO FRAME 2: Body leans back 2px (shifted right), stalk pulled UP ~3-4 rows ===
// Stalk is 2px wide (NV) with J nodes. Pulled up so bottom is above knee level.
// Root (R) dangles at stalk bottom. Air gap between stalk and ground. 1 row disturbed dirt.
// 3 pad + 5 ears + 6 face + 2 band + 7 body + 3 legs + 1 ground + 5 pad = 32
const bamboo2 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Ears shifted 2px RIGHT (lean back) — 5 rows
  "...KKKK..KKKK...",       // row 3: ear tops
  "..KKKKK..KKKKK..",       // row 4: ear widens
  "..KKKKK..KKKKK..",       // row 5: ear holds
  "...KKWWWWWWKK...",       // row 6: ear base
  "...WWWWWWWWWWWW.",       // row 7: head
  // Face shifted 2px RIGHT — 6 rows
  "..WWWWWWWWWWWWWW",       // row 8: head widest
  "..WWWKKKWWKKKWWW",       // row 9: eye patches
  "..WWKKEKWWKEKWWW",       // row 10: eyes with glint
  "..WWWKKKWWKKKWWW",       // row 11: eye patches
  "...WWWWWKKWWWWW.",       // row 12: nose
  "...WWWWWWWWWWWW.",       // row 13: lower face
  // Band shifted 2px right — 2 rows
  "..KKKKKKKKKKKKKK",       // row 14: band
  "KKKKKKKKKKKKKKKK",       // row 15: band wide
  // Body leaned back, paws grip stalk pulled up — 7 rows
  "..KKKKKWWWWWWKKK",       // row 16: body top
  "..KKKKWWWGGWWWKK",       // row 17: belly
  "..KKKKWWGGGGWLNV",       // row 18: belly wide, leaf + stalk top (NV 14-15)
  "...KKKWWWGGWKKNV",       // row 19: body narrows, paw grips stalk
  "....KKWWWWWWKKJV",       // row 20: body base, J node (JV cols 14-15)
  ".....KWWWWWKK.NV",       // row 21: body lower, stalk (NV cols 14-15)
  "..............R.",       // row 22: root dangles below stalk (col 14)
  // Legs — NO stalk, air gap — 3 rows
  "...KKKK..KKKK...",       // row 23: legs
  "...KKKK..KKKK...",       // row 24: legs
  "..KKKKK..KKKKK..",       // row 25: feet
  // Ground — 1 row disturbed dirt where stalk was
  "...........DDD..",       // row 26: disturbed ground
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
const outPath = join(outDir, "panda_bamboo_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): lean forward 2px — arms reach down, 2px-wide bamboo stalk with J nodes planted in ground");
console.log("Frame 2 (right): lean back 2px — stalk pulled up ~3-4 rows, root dangles, disturbed dirt on ground");
