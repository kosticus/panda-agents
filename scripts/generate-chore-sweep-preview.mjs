#!/usr/bin/env node
// Generates sweeping/cleaning animation preview: 2 frames side by side at 8× scale.
// Frame 1: broom sweeps LEFT — panda leans left, broom angled left low
// Frame 2: broom sweeps RIGHT — panda leans right, broom angled right low
// Head uses FULL 6-row canonical ears/head shifted left/right (like cooking does).
// Bent posture comes from body/legs area, not from compressing the head.

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
  H: [150, 48, 32],       // broom handle (reddish wood)
  R: [240, 208, 96],      // broom bristles (straw)
  S: [220, 188, 72],      // broom bristle tips
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
// Full 6-row ears/head shifted 1px LEFT. Body tilts left.
// Layout: 3 empty + 6 ears + 6 face + 2 band + 7 body + 3 legs + 2 ground = 29 + 3 pad = 32
const sweep1 = n([
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
  // DN_BAND shifted left — 2 rows
  "KKKKKKKKKKKKKK..",
  "KKKKKKKKKKKKKKK.",
  // Body shifted left, left arm holds broom — 7 rows
  "KKKKKWWWWWWKKKK.",
  "KKKKWWWGGWWWKKK.",
  "KKKKWWGGGGWWKKK.",
  "KKKKWWGGGGWWKKK.",
  "KKKKWWWGGWWWKKK.",
  "HKKKWWWWWWWKKK..",
  "HH.KKWWWWKKKK..",
  // Legs + broom shaft — 3 rows
  "HH.KKKK..KKKK..",
  "RH.KKKK..KKKK..",
  "R.KKKKK..KKKKK..",
  // Broom on ground — 2 rows
  "RRRR............",
  "SSSS............",
]);

// === SWEEP FRAME 2: Body leans RIGHT, broom sweeps right along ground ===
// Full 6-row ears/head shifted 1px RIGHT. Body tilts right.
const sweep2 = n([
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
  // DN_BAND shifted right — 2 rows
  "..KKKKKKKKKKKKKK",
  ".KKKKKKKKKKKKKKK",
  // Body shifted right, right arm holds broom — 7 rows
  ".KKKKKWWWWWWKKKK",
  ".KKKKWWWGGWWWKKK",
  ".KKKKWWGGGGWWKKK",
  ".KKKKWWGGGGWWKKK",
  ".KKKKWWWGGWWWKKK",
  "..KKKWWWWWWWKKKH",
  "...KKKKWWWWKK.HH",
  // Legs + broom shaft — 3 rows
  "..KKKK..KKKK..HH",
  "..KKKK..KKKK..HR",
  ".KKKKK..KKKKK.RR",
  // Broom on ground — 2 rows
  "............RRRR",
  "............SSSS",
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
console.log("Frame 1 (left): lean left — full canonical head shifted left, broom sweeps left along ground");
console.log("Frame 2 (right): lean right — full canonical head shifted right, broom sweeps right along ground");
