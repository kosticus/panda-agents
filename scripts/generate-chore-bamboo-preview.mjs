#!/usr/bin/env node
// Generates bamboo harvesting animation preview: 2 frames side by side at 8× scale.
// Frame 1: Crouched low, both hands gripping stalk at ground level, stalk still planted.
//          Compressed head (hunched/crouched). Bamboo shoot visible in ground.
// Frame 2: Standing tall (full/near-full height), stalk uprooted and lifted. Arms hold
//          the pulled shoot. Roots/dirt visible at base.
// Motion signal: VERTICAL (crouched gripping → standing with uprooted shoot)

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

// === BAMBOO FRAME 1: Crouched, gripping stalk at ground level. Compressed head. ===
// Panda is LOW. Both arms reach down, gripping bamboo stalk. Stalk still in ground.
// 5 empty rows + 2-row compressed ears + 5 face rows + body/legs squished down low
const bamboo1 = n([
  // 5 empty rows (crouched — head pushed down)
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head — compressed for crouched pose (2-row ears only, no widen rows)
  "..KKKK..KKKK....",  // ear tops
  "..KKWWWWWWKK....",  // ears compressed directly to head
  "..WWWWWWWWWWWW..",  // head wide
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face — compressed (no separate chin row)
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose/lower face
  // Band
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body — crouched wide, arms reach down to grip stalk
  "KKKKKWWWWWWKKKKK",  // body (crouched, spread)
  "KKKKWWWGGWWWKKKK",  // belly
  "KNNKWWGGGGWWKNNN",  // arms down gripping stalk (N = bamboo, K = paws gripping)
  "KNNKWWWGGWWWKNNK",  // lower grip, stalk between hands
  // Stalk at ground level with legs squished in crouched position
  "KKNNKKKKKKKKNNKK",  // paws fully gripping stalk at ground, legs behind
  "..NNKKKKKKKKNNN.",  // stalk base, folded legs
  "..NJNKKKKKKNVNN.",  // bamboo node at ground, legs/feet
  // Ground + stalk still planted
  "...NVN...........",  // bamboo emerging from ground
  "...NJN...........",  // bamboo root node
  "...DDD...........",  // dirt/ground
]);

// === BAMBOO FRAME 2: Standing tall, stalk uprooted and lifted! Roots visible. ===
// Full canonical height. Arms hold the pulled bamboo shoot up. Roots hang from base.
// Layout: 4 empty (acc header) + 6 ears + 6 face + 3 band + 8 body + 3 legs = 30
const bamboo2 = n([
  // Bamboo shoot held high — tip extends into acc header rows
  "........NVN.....",  // bamboo tip above head
  ".......JNVNL....",  // bamboo with leaf
  "........NVN.....",  // bamboo shaft
  "........NJN.....",  // bamboo node
  // DN_EARS_HEAD (6 rows) — full canonical, centered
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE (6 rows) — full canonical
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // DN_BAND (3 rows)
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY (8 rows) — arms raised holding uprooted stalk
  "KKKKKWWWWWWKKKKK",  // body (canonical row 1)
  "KKKNWWWGGWWWNKKK",  // belly — arms come in holding stalk (N = stalk)
  "KKKNWWGGGGWWWNKK",  // belly, stalk gripped by both arms
  "KKKNWWGGGGWWWNKK",  // belly
  "KKKKNWWWGGWWWNKK",  // body narrows, stalk held
  "KKKKKWWNNNWWKKKK",  // body base, stalk at belly level
  ".KKKKKNVNVWKKKK.",  // body narrows, stalk held out
  "..KKKKNRRNKKKK..",  // body bottom — roots (R) dangling from stalk base
  // DN_LEGS_IDLE (3 rows)
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
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
console.log("Frame 1 (left): crouched low — both hands gripping stalk at ground, stalk planted");
console.log("Frame 2 (right): standing tall — stalk uprooted and lifted, roots dangling");
