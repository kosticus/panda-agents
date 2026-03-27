#!/usr/bin/env node
// Generates watering/tending crops animation preview: 2 frames side by side at 8× scale.
// Frame 1: deep crouch — panda low, bent forward, can pouring, water drops visible
// Frame 2: standing tall — upright, can at side, checking crops
// The HEIGHT difference between frames is the primary motion signal.

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

// === WATER FRAME 1: Deep crouch, bent forward, pouring ===
// Panda is LOW in the frame. Head forward/down, body compressed, knees bent.
// Can is large and clearly tilted with a visible water stream. Crops below.
const water1 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head lower in frame — bent forward, looking at crops
  "..KKKK..KKKK....",  // ear top
  "..KKWWWWWWKK....",  // ears compressed (bent posture)
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes (looking down)
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  // Band (no chin — compressed forward bend)
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body — hunched, arms reach right to hold tilted can
  "KKKWWWGGGGWWWKKK",  // body wide (bent over)
  "KKWWWWGGGGWWWWKK",  // belly spreads (crouching)
  ".KWWWWGGWWWWKK..",  // body tilts forward, right arm extends
  "..KWWWWWWWWKQQQQ",  // paw on can — can tilted (4px wide body)
  "..WWWWWWWW.QQQQQ",  // hips, can body large (5px)
  // Legs + water stream + crops
  "..KKKKK.KKKKDDDD",  // legs, water pouring from spout
  "..KKKKKKKKKK.DD.",  // feet, water stream continues
  "..L.NL..L..DDNL.",  // crops getting soaked (stream lands)
  "..BBBBBBBBBBBBBB",  // soil
]);

// === WATER FRAME 2: Standing tall, can at side, checking crops ===
// Panda is TALL in the frame — full height. Large can held at right hip.
const water2 = n([
  // Full height — ears at top of frame
  "..KKKK..KKKK....",  // ear top
  ".KKKKK..KKKKK...",  // ear widens
  ".KKKKK..KKKKK...",  // ear holds
  "..KKWWWWWWKK....",  // ear base
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  "...WWWWWWWWWW...",  // chin
  // Band
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body — upright, right arm holds can at hip
  "KKKKWWWGGWWWKKKK",  // body
  "KKKKWWGGGGWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  ".KKKWWWGGWWWKKK.",  // body narrows
  "..KKWWWWWWWWKK..",  // hips
  "..WWWWWWWWWWKK..",  // base, right arm at hip
  // Legs + can at side (upright, not pouring)
  "...KKKK..KKKKQQ.",  // legs, can top at hip level
  "...KKKK..KKKQQQ.",  // legs, can body (upright)
  "..KKKKK..KKQQQQQ",  // feet, can base (5px wide)
  // Crops (no water)
  "..L.NL..L...N.L.",  // crops (dry)
  "..BBBBBBBBBBBBBB",  // soil
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
console.log("Frame 1 (left): deep crouch — panda low/compressed, bent forward, can pouring with water drops");
console.log("Frame 2 (right): standing tall — full height, can at hip, checking crops");
