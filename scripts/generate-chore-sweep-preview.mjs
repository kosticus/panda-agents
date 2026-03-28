#!/usr/bin/env node
// Generates sweeping/cleaning animation preview: 2 frames side by side at 8× scale.
// Frame 1: broom sweeps LEFT — panda bent forward/left, broom angled left low
// Frame 2: broom sweeps RIGHT — panda bent forward/right, broom angled right low
// Shares bending motion profile with watering: body tilts side-to-side while bent.

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
  H: [140, 100, 55],      // broom handle (wood brown)
  R: [200, 160, 80],      // broom bristles (straw)
  S: [180, 140, 60],      // broom bristle tips
  D: [120, 100, 60],      // dirt/dust being swept
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

// === SWEEP FRAME 1: Body leans LEFT, broom sweeps left along ground ===
// Whole body tilted left. Left arm reaches down-left with broom. Low posture.
const sweep1 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head lower, shifted slightly left (bent forward posture)
  ".KKKK..KKKK.....",  // ear top (shifted left)
  ".KKWWWWWWKK.....",  // ears compressed (bent)
  ".WWWWWWWWWWWWW..",  // head
  "WWWWWWWWWWWWWWW.",  // head widest
  "WWWKKKWWKKKWWWW.",  // eye patches (shifted left)
  "WWKKEKWWKEKWWWW.",  // eyes with glint
  ".WWWWWKKWWWWWW..",  // nose
  ".WWWWWWWWWWWWW..",  // lower face
  // Band (no chin — bent forward)
  ".KKKKKKKKKKKK...",
  "KKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK",
  // Body bent left, left arm extends down-left with broom
  "KKKWWWGGGGWWWKKK",  // body wide (bent)
  "KKWWWWGGGGWWWWKK",  // belly spreads
  "KWWWWWGGWWWWKK..",  // body tilts left, right arm in
  "H.KWWWWWWWWKK...",  // broom handle starts left, body continues
  "HH.WWWWWWWWW....",  // broom handle, lower body/hips
  // Legs + broom reaching ground
  "HHH..KKKKKKKK..",  // broom shaft, legs
  "RRRH..KKKKKKK..",  // bristle base + legs
  "RRRR.KKKKKKKK..",  // bristles spread left
  "SSSS...........",  // bristle tips on ground
  "DDDDD..........",  // dirt/dust cloud
]);

// === SWEEP FRAME 2: Body leans RIGHT, broom sweeps right along ground ===
// Whole body tilted right. Right arm reaches down-right with broom. Low posture.
const sweep2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head lower, shifted slightly right (bent forward posture)
  "....KKKK..KKKK..",  // ear top (shifted right)
  "....KKWWWWWWKK..",  // ears compressed (bent)
  "...WWWWWWWWWWWWW",  // head
  "..WWWWWWWWWWWWWW",  // head widest
  "..WWWKKKWWKKKWWW",  // eye patches (shifted right)
  "..WWKKEKWWKEKWWW",  // eyes with glint
  "...WWWWWKKWWWWW.",  // nose
  "...WWWWWWWWWWWW.",  // lower face
  // Band (no chin — bent forward)
  "...KKKKKKKKKKKK.",
  ".KKKKKKKKKKKKKKK",  // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  // Body bent right, right arm extends down-right with broom
  "KKKWWWGGGGWWWKKK",  // body wide (bent)
  "KKWWWWGGGGWWWWKK",  // belly spreads
  "..KKWWWWGGWWWWWK",  // body tilts right, left arm in
  "...KKK.WWWWWWWKH",  // body continues, broom handle right
  "....WWWWWWWWW.HH",  // hips, broom handle
  // Legs + broom reaching ground
  "..KKKKKKKK..HHH.",  // legs, broom shaft right
  "..KKKKKKK..RRRH.",  // legs, bristle base
  "..KKKKKKKK.RRRR.",  // legs, bristles spread right
  "..........SSSSS.",  // bristle tips on ground
  "...........DDDDD",  // dirt/dust cloud
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [sweep1, sweep2];

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
const outPath = join(outDir, "panda_sweep_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): lean left — whole body tilted, broom sweeps left along ground");
console.log("Frame 2 (right): lean right — whole body tilted, broom sweeps right along ground");
