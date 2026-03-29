#!/usr/bin/env node
// Generates carrying animation preview: 2 frames side by side at 8× scale.
// Walk cycle with a bundle held in front of body at belly level.
// Frame 1: body shifted 1px RIGHT (weight right), right foot forward (DN_WALK3_LEGS)
// Frame 2: body shifted 1px LEFT (weight left), left foot forward (DN_WALK1_LEGS)
// Uses canonical DN_BODY proportions with bundle overlaid at belly rows.
// Matches cooking script approach: entire canonical panda shifted left/right per frame.

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
  T: [160, 110, 60],      // bundle/crate (tan wood)
  X: [120, 80, 40],       // bundle straps / dark wood
  R: [200, 170, 110],     // bundle highlight
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

// === CARRY FRAME 1: Body shifted 1px RIGHT, right foot forward (DN_WALK3_LEGS) ===
// Bundle held at belly level. Whole silhouette shifted right.
// Layout: 4 empty + 6 ears + 6 face + 3 band + 8 body (bundle overlay) + 4 walk legs + 1 empty = 32
const carry1 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px RIGHT — 6 rows
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  "..KKKKK..KKKKK..",
  "...KKWWWWWWKK...",
  "...WWWWWWWWWWWW.",
  "..WWWWWWWWWWWWWW",
  // DN_FACE shifted right — 6 rows
  "..WWWKKKWWKKKWWW",
  "..WWKKEKWWKEKWWW",
  "..WWWKKKWWKKKWWW",
  "...WWWWWKKWWWWW.",
  "...WWWWWWWWWWWW.",
  "....WWWWWWWWWW..",
  // DN_BAND shifted right — 3 rows
  "...KKKKKKKKKKKK.",
  "..KKKKKKKKKKKKKK",
  ".KKKKKKKKKKKKKKK",
  // Body shifted right, bundle at belly center — 8 rows
  ".KKKKKWWWWWWKKKK",
  ".KKKKWWWGGWWKKKK",
  ".KKKKKKGGGKKKKK.",  // belly narrows — arms closing in
  ".KKKKKTTTTTKKKK.",  // bundle top — arms wrap around
  ".KKKKKXXRXXKKKK.",  // bundle face — arms grip
  ".KKKKKTTTTTKKKK.",  // bundle bottom
  "..KKKKWWWWWKKK..",
  "...KKKWWWWWKKK..",
  // DN_WALK3_LEGS shifted right (4 rows): right foot forward
  "...KKKKW...KKKK.",
  "...KKKK....KKKK.",
  "...KKKKK..KKKKK.",
  "...KKKK.........",
]);

// === CARRY FRAME 2: Body shifted 1px LEFT, left foot forward (DN_WALK1_LEGS) ===
// Bundle same position at belly. Whole silhouette shifted left.
const carry2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px LEFT — 6 rows
  ".KKKK..KKKK.....",
  "KKKKK..KKKKK....",
  "KKKKK..KKKKK....",
  ".KKWWWWWWKK.....",
  ".WWWWWWWWWWWWW..",
  "WWWWWWWWWWWWWW..",
  // DN_FACE shifted left — 6 rows
  "WWWKKKWWKKKWWW..",
  "WWKKEKWWKEKWWW..",
  "WWWKKKWWKKKWWW..",
  ".WWWWWKKWWWWW...",
  ".WWWWWWWWWWWW...",
  "..WWWWWWWWWW....",
  // DN_BAND shifted left — 3 rows
  ".KKKKKKKKKKKK...",
  "KKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKK.",
  // Body shifted left, bundle at belly center — 8 rows
  "KKKKKWWWWWWKKKK.",
  "KKKKWWWGGWWWKKK.",
  "KKKKKKGGGKKKKK..",  // belly narrows — arms closing in
  "KKKKKTTTTTKKKK..",  // bundle top — arms wrap around
  "KKKKKXXRXXKKKK..",  // bundle face — arms grip
  "KKKKKTTTTTKKKK..",  // bundle bottom
  ".KKKKKWWWWWKKK..",
  "..KKKKWWWWKKK...",
  // DN_WALK1_LEGS shifted left (4 rows): left foot forward
  ".KKKK...WKKKK...",
  ".KKKK....KKKK...",
  ".KKKKK..KKKKK...",
  ".........KKKK...",
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [carry1, carry2];

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
const outPath = join(outDir, "panda_carry_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): body shifted right, right foot forward (WALK3 legs), bundle at belly");
console.log("Frame 2 (right): body shifted left, left foot forward (WALK1 legs), bundle at belly");
