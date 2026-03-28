#!/usr/bin/env node
// Generates bamboo harvesting animation preview: 2 frames side by side at 8× scale.
// Frame 1: body leans forward, arms extend down to grip bamboo stalk at ground. Stalk planted.
// Frame 2: body leans back pulling, stalk rising (at waist level), roots at base.
// Both frames similar height (~30 rows). Lean-based motion, feet same position.
// Bamboo stalk is 3-4px wide (N/V colors), clearly visible both frames.

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

// === BAMBOO FRAME 1: Body leans forward (shifted 1px left), arms extend down to grip stalk ===
// 3 empty + 5 ears (drop 1 for lean) + 6 face + 3 band + 8 body + 3 legs + 2 ground + 2 empty = 32
const bamboo1 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px LEFT (lean forward), drop 1 ear row — 5 rows
  ".KKKK..KKKK.....",  // ear top (shifted left)
  "KKKKK..KKKKK....",  // ear widens
  ".KKWWWWWWKK.....",  // ear base (skip one ear-hold row)
  ".WWWWWWWWWWWWW..",  // head
  "WWWWWWWWWWWWWW..",  // head widest
  // DN_FACE shifted left (lean forward) — 6 rows
  "WWWKKKWWKKKWWW..",  // eye patches
  "WWKKEKWWKEKWWW..",  // eyes with glint
  "WWWKKKWWKKKWWW..",  // eye patches
  ".WWWWWKKWWWWW...",  // nose
  ".WWWWWWWWWWWW...",  // lower face
  "..WWWWWWWWWW....",  // chin
  // DN_BAND shifted left — 3 rows
  ".KKKKKKKKKKKK...",
  "KKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK",
  // Body leaned forward, arms reaching down to grip stalk — 8 rows
  // Stalk (NVN = 3px wide) at right side, panda reaches toward it
  "KKKKKWWWWWWKKKK.",  // body top
  "KKKKWWWGGWWWKKK.",  // belly
  "KKKKWWGGGGWWKKNV",  // belly, right arm descends toward stalk
  "KKKKWWGGGGWWKNVN",  // belly, arm at stalk
  ".KKKWWWGGWWWKNVN",  // body narrows, paw (K) gripping stalk
  "..KKWWWWWWWKKNVN",  // body base, arm at stalk
  "...KKWWWWWKKKNVN",  // body lower, paw gripping stalk
  "....KKWWWWKKKNVN",  // body bottom, both paws at stalk
  // DN_LEGS_IDLE (same both frames) — 3 rows
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Ground + stalk still planted — 2 rows
  "............JNJN",  // bamboo stalk node at ground
  "....DDDDDDDDDDD.",  // dirt around stalk base
]);

// === BAMBOO FRAME 2: Body leans back (shifted 1px right), stalk rising at waist level ===
// 3 empty + 6 ears (full for lean back) + 6 face + 3 band + 8 body + 3 legs + 1 ground + 2 empty = 32
const bamboo2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px RIGHT (lean back) — full 6 rows
  "...KKKK..KKKK...",  // ear top
  "..KKKKK..KKKKK..",  // ear widens
  "..KKKKK..KKKKK..",  // ear holds
  "...KKWWWWWWKK...",  // ear base
  "...WWWWWWWWWWWW.",  // head
  "..WWWWWWWWWWWWWW",  // head widest
  // DN_FACE shifted right (lean back) — 6 rows
  "..WWWKKKWWKKKWWW",  // eye patches
  "..WWKKEKWWKEKWWW",  // eyes with glint
  "..WWWKKKWWKKKWWW",  // eye patches
  "...WWWWWKKWWWWW.",  // nose
  "...WWWWWWWWWWWW.",  // lower face
  "....WWWWWWWWWW..",  // chin
  // DN_BAND shifted right — 3 rows
  "...KKKKKKKKKKKK.",
  "..KKKKKKKKKKKKKK",
  ".KKKKKKKKKKKKKKKK",
  // Body leaned back, arms hold stalk pulled up to waist/chest level — 8 rows
  // Stalk now at chest/waist level, partially uprooted
  "NVN.KKKKKWWWWWWKK",  // stalk at chest height, body shifted right
  "NVN.KKKKWWWGGWWKK",  // stalk, belly
  "NVNKKKKWWGGGGWWKK",  // stalk held, paws (K) gripping, belly
  "NVNKKKKWWGGGGWWKK",  // stalk at belly, arms gripping
  "NVN.KKKKWWWGGWWWK",  // stalk at waist, body narrows
  ".R..KKKKKWWWWWWKK",  // root (R) dangling from stalk base
  ".R...KKKKWWWWKKKK",  // roots visible
  "......KKKWWWWKKK.",  // body bottom
  // DN_LEGS_IDLE (same both frames) — 3 rows
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Ground (stalk uprooted — hole visible) — 1 row
  "....DDDDDDDDDDD.",  // dirt + hole where stalk was
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
console.log("Frame 1 (left): lean forward — arms extend down gripping stalk at ground, stalk planted");
console.log("Frame 2 (right): lean back pulling — stalk uprooted to waist level, roots dangling");
