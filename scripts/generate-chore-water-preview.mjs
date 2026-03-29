#!/usr/bin/env node
// Generates watering/tending crops animation preview: 2 frames side by side at 8× scale.
// Frame 1: lean forward — head shifted slightly forward, arm extends with large can, water pours.
// Frame 2: standing upright — full canonical pose, can at hip, crops visible (no water).
// Both frames similar height (within 1 row). Feet same position in both frames.
// Watering can is large and clearly visible (Q color).

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

// === WATER FRAME 1: Lean forward, arm extends right with large can, water pours ===
// 3 empty + 6 ears + 6 face + 3 band + 6 body+can + 3 legs + 3 crops/water + 2 pad = 32
const water1 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px LEFT (lean forward), full 6 ear rows
  ".KKKK..KKKK.....",  // ear top (shifted left)
  "KKKKK..KKKKK....",  // ear widens
  "KKKKK..KKKKK....",  // ear holds
  ".KKWWWWWWKK.....",  // ear base
  ".WWWWWWWWWWWWW..",  // head
  "WWWWWWWWWWWWWW..",  // head widest
  // DN_FACE shifted 1px left (lean forward) — 6 rows
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
  // Body leaned forward, right arm extends with large can — 6 rows
  "KKKKKWWWWWWKKKK.",  // body top
  "KKKKWWWGGWWWKKKK",  // belly, arm starts right
  "KKKKWWGGGGWKKQQQ",  // belly, arm at can top (QQQ = 3px visible)
  ".KKKWWWGGWWKQQQQ",  // body narrows, can body (4px wide)
  "..KKWWWWWWWKQQQQ",  // body base, large can body
  "...KKWWWWWKKQQQQ",  // body bottom, can + spout
  // DN_LEGS_IDLE (same both frames) — 3 rows
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Water stream + crops — 3 rows
  "..LDNL.DL..DDDDD",  // water drops on crops + stream from spout
  "..LDNL.DL..DD.L.",  // water drops falling between crops
  "..BBBBBBBBBBBBBB",  // soil
]);

// === WATER FRAME 2: Standing upright, can at hip (not pouring) ===
// 3 empty + 6 ears + 6 face + 3 band + 6 body+can + 3 legs + 3 ground + 2 pad = 32
const water2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD centered — full 6 rows
  "..KKKK..KKKK....",  // ear top
  ".KKKKK..KKKKK...",  // ear widens
  ".KKKKK..KKKKK...",  // ear holds
  "..KKWWWWWWKK....",  // ear base
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // DN_FACE centered — 6 rows
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  "...WWWWWWWWWW...",  // chin
  // DN_BAND centered — 3 rows
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY upright, large can held at right hip — 6 rows (was 5)
  "KKKKKWWWWWWKKKKK",  // body top
  "KKKKWWWGGWWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  ".KKKWWWGGWWWKQQQ",  // body narrows, can top at hip (QQQ = 3px)
  "..KKWWWWWWWKQQQQ",  // body base, can body (4px)
  // DN_LEGS_IDLE (same both frames) — 3 rows
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Crops + soil (no water) — 3 rows
  "..L.NL..L...N.L.",
  "..L.NL..L..N..L.",
  "..BBBBBBBBBBBBBB",
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
const outPath = join(outDir, "panda_water_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): lean forward — arm extends with large can, thick water stream pours");
console.log("Frame 2 (right): standing upright — full canonical pose, large can at hip");
