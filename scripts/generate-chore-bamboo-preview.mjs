#!/usr/bin/env node
// Generates bamboo harvesting animation preview: 2 frames side by side at 8× scale.
// Frame 1: body leans forward 3px, arms reach DOWN to grip bamboo stalk at ground. Stalk planted with dirt/roots.
// Frame 2: body leans back 3px, stalk pulled UP to head height — dramatic vertical shift. Roots dangle in air.
// Key visual: stalk touches ground in frame 1, held high with clear air gap in frame 2.
// Bamboo stalk is 3px wide (NVN colors), lean-based motion with feet anchored.

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

// === BAMBOO FRAME 1: Body leans forward 3px (shifted left), arms extend DOWN to grip stalk at ground ===
// Stalk (NVN, 3px wide) runs from paw level all the way to ground — clearly planted.
// 3 pad + 5 ears + 6 face + 2 band + 7 body + 3 legs + 5 ground + 1 pad = 32
const bamboo1 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Ears shifted 3px LEFT (lean forward) — 5 rows
  "KKKK..KKKK......",       // row 3: ear tops (16)
  "KKKKK..KKKKK....",       // row 4: ear widens (16)
  "KKKKK..KKKKK....",       // row 5: ear holds (16)
  ".KKWWWWWWKK.....",       // row 6: ear base (16)
  "WWWWWWWWWWWWW...",       // row 7: head (16)
  // Face shifted 3px LEFT — 6 rows
  "WWWWWWWWWWWWWW..",       // row 8: head widest (16)
  "WWWKKKWWKKKWWW..",       // row 9: eye patches (16)
  "WWKKEKWWKEKWWW..",       // row 10: eyes with glint (16)
  "WWWKKKWWKKKWWW..",       // row 11: eye patches (16)
  ".WWWWWKKWWWWW...",       // row 12: nose (16)
  ".WWWWWWWWWWWW...",       // row 13: lower face (16)
  // Band shifted left — 2 rows
  "KKKKKKKKKKKKKK..",       // row 14: band (16)
  "KKKKKKKKKKKKKKKK",       // row 15: band wide (16)
  // Body leaned forward, arms reaching DOWN toward stalk — 7 rows
  "KKKKKWWWWWWKKK..",       // row 16: body top (16)
  "KKKKWWWGGWWWKK..",       // row 17: belly (16)
  "KKKKWWGGGGWWKK..",       // row 18: belly wide (16)
  ".KKKWWWGGWWWKK..",       // row 19: body narrows (16)
  "..KKWWWWWWWKKK..",       // row 20: body base (16)
  "...KKWWWWWKKK...",       // row 21: body lower (16)
  "....KKWWWKKNVN..",       // row 22: paws grip stalk top (16)
  // Legs + stalk planted in ground — 3 rows
  "...KKKK..KKNVN..",       // row 23: legs, stalk continues (16)
  "...KKKK..KKNVN..",       // row 24: legs, stalk continues (16)
  "..KKKKK..KKNVN..",       // row 25: feet, stalk at ground (16)
  // Stalk rooted in ground with dirt — 5 rows
  ".........DRNVNRD",       // row 26: dirt around stalk base (16)
  ".........DDNVNDD",       // row 27: roots in dirt (16)
  "........DDDRDDD.",       // row 28: deeper roots (16)
  "........DDDDDDD.",       // row 29: ground (16)
  EMPTY,                     // row 30: pad
]);

// === BAMBOO FRAME 2: Body leans back 3px (shifted right), stalk pulled UP to head height ===
// Stalk (NVN, 3px wide) on right side cols 13-15, held high. Bottom at row 20, legs have no stalk.
// Clear air gap between stalk bottom (row 20) and ground (row 25). Roots dangle at stalk bottom.
// 3 pad + 5 ears + 6 face + 2 band + 6 body + 3 legs + 2 ground + 5 pad = 32
const bamboo2 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Ears shifted 3px RIGHT (lean back) — 5 rows; stalk top + leaf
  "...KKKK..KKKKLNV",       // row 3: ears, leaf+stalk top cols 13-15
  "...KKKKK..KKKNVN",       // row 4: ear widens, stalk NVN cols 13-15
  "...KKKKK..KKKNVN",       // row 5: ear holds, stalk continues
  "....KKWWWWWWKNVN",       // row 6: ear base, stalk
  "...WWWWWWWWWWNVN",       // row 7: head, stalk
  // Face shifted 3px RIGHT — 6 rows; stalk continues
  "..WWWWWWWWWWWWVN",       // row 8: head widest, stalk
  "..WWWKKKWWKKKWVN",       // row 9: eye patches, stalk
  "..WWKKEKWWKEKWVN",       // row 10: eyes with glint, stalk
  "..WWWKKKWWKKKWVN",       // row 11: eye patches, stalk
  "...WWWWWKKWWWNVN",       // row 12: nose, stalk
  "...WWWWWWWWWWNVN",       // row 13: lower face, stalk
  // Band shifted right — 2 rows; stalk continues
  "..KKKKKKKKKKKNVN",       // row 14: band, stalk
  "..KKKKKKKKKKKNVN",       // row 15: band wide, stalk
  // Body leaned back, paws grip stalk at right — 6 rows
  "..KKKWWWWWWKKNVN",       // row 16: body top, stalk
  "..KKWWWGGWWKKNVN",       // row 17: belly, paw grips stalk
  "..KKWWGGGGWKKNVN",       // row 18: belly wide, paw grips
  "...KKWWWGGWKKNVN",       // row 19: body narrows, paw grips
  "....KWWWWWWKKRDR",       // row 20: body base, roots dangle below stalk
  ".....KWWWWKK..R.",       // row 21: body lower, root tip in air
  // Legs — NO stalk, clear air gap — 3 rows
  "...KKKK..KKKK...",      // row 22: legs (16)
  "...KKKK..KKKK...",      // row 23: legs (16)
  "..KKKKK..KKKKK..",      // row 24: feet (16)
  // Ground — disturbed dirt where stalk was uprooted — 2 rows
  ".......DDDDDDD..",      // row 25: disturbed ground (16)
  "........DDDDD...",      // row 26: hole where stalk was (16)
  EMPTY,                     // row 27: pad
  EMPTY,                     // row 28: pad
  EMPTY,                     // row 29: pad
  EMPTY,                     // row 30: pad
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
console.log("Frame 1 (left): lean forward 3px — arms reach down, stalk planted in ground with dirt/roots");
console.log("Frame 2 (right): lean back 3px — stalk pulled up to head height, roots in air, ground hole visible");
