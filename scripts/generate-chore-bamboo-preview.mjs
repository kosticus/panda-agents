#!/usr/bin/env node
// Generates bamboo harvesting animation preview: 2 frames side by side at 8× scale.
// Frame 1: body leans forward, arms reach down to grip bamboo stalk at ground. Stalk at right side.
// Frame 2: body leans back, stalk pulled up ~4 rows. Air gap between stalk bottom and ground.
// Bamboo stalk is 2px wide (NV) with J-color node. Paw (K) grips at single contact point.

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

// === BAMBOO FRAME 1: Body leans forward (shifted left), stalk planted at right side ===
// Stalk (NV, 2px) at cols 14-15 consistently. Arm dissolves where stalk appears.
// 3 pad + 5 ears + 6 face + 2 band + 5 body + 1 hips + 3 legs + 2 ground + 5 pad = 32
const bamboo1 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Ears shifted left — 5 rows
  ".KKKK..KKKK.....",       // row 3: ear tops
  "KKKKK..KKKKK....",       // row 4: ear widens
  "KKKKK..KKKKK....",       // row 5: ear holds
  ".KKWWWWWWKK.....",       // row 6: ear base
  ".WWWWWWWWWWWW...",       // row 7: head
  // Face shifted left — 6 rows
  "WWWWWWWWWWWWWW..",       // row 8: head widest
  "WWWKKKWWKKKWWW..",       // row 9: eye patches
  "WWKKEKWWKEKWWW..",       // row 10: eyes with glint
  "WWWKKKWWKKKWWW..",       // row 11: eye patches
  ".WWWWWKKWWWWW...",       // row 12: nose
  ".WWWWWWWWWWWW...",       // row 13: lower face
  // Band — 2 rows
  "KKKKKKKKKKKKKK..",       // row 14: band
  "KKKKKKKKKKKKKKK.",       // row 15: band wide
  // Body leaned forward — 5 rows
  "KKKKKWWWWWWKKKK.",       // row 16: body top
  "KKKKWWWGGWWWKKK.",       // row 17: belly
  "KKKKWWGGGGWWK.NV",       // row 18: belly, arm thins to K(12), stalk appears
  ".KKKWWWGGWWWW.NV",       // row 19: narrows, arm dissolved into body W
  "..KKWWWGGWWWW.NV",       // row 20: body base
  // Hips + legs — 4 rows
  "...WWWWWWWWWW.NV",       // row 21: hips (pure W like attention panda)
  "...KKKK..KKKK.NV",       // row 22: legs + stalk
  "...KKKK..KKKK.JV",       // row 23: legs + J node
  "..KKKKK..KKKKKNV",       // row 24: feet + stalk
  // Ground — 2 rows
  "..............NV",       // row 25: stalk at ground level
  ".............DDD",       // row 26: dirt at stalk base
]);

// === BAMBOO FRAME 2: Body leans back (shifted right), stalk pulled UP 4 rows ===
// Stalk (NV, 2px) at cols 14-15, from band (row 14) to hips (row 21) = 8 rows (same as frame 1).
// Air gap: rows 22-24 (legs/feet) have no stalk. Disturbed dirt at ground.
const bamboo2 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Ears shifted right — 5 rows
  "...KKKK..KKKK...",       // row 3: ear tops
  "..KKKKK..KKKKK..",       // row 4: ear widens
  "..KKKKK..KKKKK..",       // row 5: ear holds
  "...KKWWWWWWKK...",       // row 6: ear base
  "...WWWWWWWWWWWW.",       // row 7: head
  // Face shifted right — 6 rows
  "..WWWWWWWWWWWWWW",       // row 8: head widest
  "..WWWKKKWWKKKWWW",       // row 9: eye patches
  "..WWKKEKWWKEKWWW",       // row 10: eyes with glint
  "..WWWKKKWWKKKWWW",       // row 11: eye patches
  "...WWWWWKKWWWWW.",       // row 12: nose
  "...WWWWWWWWWWWW.",       // row 13: lower face
  // Band — stalk peeks out at right edge — 2 rows
  "..KKKKKKKKKKKKNV",       // row 14: band, stalk NV(14-15)
  ".KKKKKKKKKKKKKNV",       // row 15: band wide, stalk
  // Body shifted right, stalk alongside — 5 rows
  "..KKKKKWWWWWWWNV",       // row 16: body top, W extends to 13, NV(14-15)
  "..KKKKWWWGGWWWJV",       // row 17: belly, J node JV(14-15)
  "..KKKKWWGGGGWWNV",       // row 18: belly wide
  "...KKKWWWGGWWWNV",       // row 19: narrows
  "....KKWWWGGWWWNV",       // row 20: body base
  // Hips + stalk bottom — 1 row
  "...WWWWWWWWWW.NV",       // row 21: hips (pure W), stalk bottom
  // Legs — no stalk, air gap — 3 rows
  "...KKKK..KKKK...",       // row 22: legs
  "...KKKK..KKKK...",       // row 23: legs
  "..KKKKK..KKKKK..",       // row 24: feet
  // Ground — disturbed dirt
  ".............DDD",       // row 25: dirt where stalk was
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
console.log("Frame 1 (left): lean forward — stalk planted in ground, NV at cols 14-15");
console.log("Frame 2 (right): lean back — stalk pulled up 4 rows, same length, air gap to ground");
