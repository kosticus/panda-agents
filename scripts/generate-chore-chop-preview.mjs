#!/usr/bin/env node
// Generates chopping wood animation preview: 2 frames side by side at 8× scale.
// Frame 1: axe raised — panda leans back slightly, axe handle in accessory rows above head.
// Frame 2: axe down — panda leans forward, arms bring axe to stump level.
// Both frames same height (3 empty rows at top each). Motion = lean + arm position.
// Feet in same position both frames.

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
  T: [140, 95, 55],       // wood / stump brown
  D: [100, 70, 40],       // dark wood grain
  A: [160, 160, 170],     // axe head (steel)
  H: [120, 80, 50],       // axe handle
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

// === CHOP FRAME 1: Axe raised above head, thin arms (arms are up) ===
const chop1 = n([
  // Axe head centered above + handle
  "....AAHHAA......",  // axe head (blade around handle)
  "....AAHHAA......",  // axe head continues
  "......HH........",  // handle
  "......HH........",  // handle toward ears
  // DN_EARS_HEAD centered — 6 rows
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE centered — 6 rows
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // Band (narrower, arms raised) — 3 rows
  "...KKKKKKKKKK...",
  "..KKKKKKKKKKKK..",
  "..KKKKKKKKKKKK..",
  // Body with thin arms (arms are up) — 6 rows
  "...KKWWWWWWKK...",
  "...KKWWGGWWKK...",
  "...KKWGGGGWKK...",
  "...KKWWGGWWKK...",
  "...KKKWWWWKKK...",
  "....KKWWWWKK....",
  // DN_LEGS_IDLE — 3 rows
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Stump — 2 rows
  ".....TTDDTT.....",
  ".....TTDDTT.....",
]);

// === CHOP FRAME 2: Axe down at stump, handle through legs ===
const chop2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD centered — 6 rows
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE centered — 6 rows
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // DN_BAND centered — 3 rows
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body canonical (full arms, axe below) — 6 rows
  "KKKKKWWWWWWKKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKWWGGGGWWKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKKWWWWWWKKKKK",
  "..KKKKWWWWKKKK..",
  // Legs with handle between — 3 rows
  "...KKKKHHKKKK...",
  "...KKKKHHKKKK...",
  "..KKKKKHHKKKKK..",
  // Axe embedded in stump — 2 rows
  ".....AAHAA......",
  ".....TTDDTT.....",
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [chop1, chop2];

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
const outPath = join(outDir, "panda_chop_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): axe raised — leans back (head right), paw grips handle above head");
console.log("Frame 2 (right): axe down — leans forward (head left), arms down at stump with axe");
