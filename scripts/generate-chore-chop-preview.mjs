#!/usr/bin/env node
// Generates chopping wood animation preview: 2 frames side by side at 8× scale.
// Frame 1: wind-up — widened shoulders (power stance), body shifted up 1px, axe above head.
// Frame 2: chop down — canonical body, axe handle visible through belly to stump.
// Motion = shoulder width change + vertical shift + handle path.

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

// === CHOP FRAME 1: Wind-up — /\ arms overhead, body shifted up ===
const chop1 = n([
  // Axe head
  "...AAAHHA.......",  // blade fans left
  "....AAHHA.......",  // taper
  "......HH........",  // handle
  "......HH........",  // handle
  // Ears — handle passes through gap
  "..KKKKHHKKKK....",
  ".KKKKKHHKKKKK...",
  ".KKKKKHHKKKKK...",
  // Head — arms branch from handle in /\ shape (4px at top, taper to 3px)
  "..KKKKKKKKKK....",  // hands grip handle wide (cols 4-9)
  "..KKKKWWKKKKWW..",  // arms 4px: L=2-5, R=8-11
  ".KKKKWWWWKKKKWW.",  // arms 4px: L=1-4, R=9-12
  // Face — /\ arms continue outward, eyes peek through
  "KKKKKKKWWKKKKKW.",  // arms 4px: L=0-3, R=10-13
  "KKKKKEKWWKEKKKW.",  // arms: L=0-2, R=11-13, eyes visible
  "KKKWKKKWWKKKKKK.",  // arms: L=0-2, R=12-14
  "KKKWWWWKKWWWWKKK",  // arms: L=0-2, R=13-15
  "KKKWWWWWWWWWWKKK",  // arms at edges
  "KKKWWWWWWWWWWKKK",  // arms at edges, chin
  // Band — arms meet body at shoulders
  "KKKKKKKKKKKKKKKK",  // arms + body merge at shoulders
  ".KKKKKKKKKKKKKKK",  // transition
  "..KKKKKKKKKKKK..",  // body width
  // Body (arms are overhead — bare belly exposed)
  "...WWWWWWWWWW...",  // white belly, no arms
  "...WWWWGGWWWW...",  // belly
  "...WWWGGGGWWW...",  // belly center
  "...WWWWGGWWWW...",  // mirror
  "...WWWWWWWWWW...",  // mirror
  "....WWWWWWWW....",  // taper
  // Legs (2 rows, shifted up)
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Gap — panda lifted for wind-up
  EMPTY,
  // Stump
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
  // Body canonical with handle through belly (cols 7-8) — 6 rows
  "KKKKKWWHHWWKKKKK",  // handle visible through white belly
  "KKKKWWWHHWWWKKKK",  // handle through gray/white
  "KKKKWWGHHGWWKKKK",  // handle through gray belly
  "KKKKWWWHHWWWKKKK",  // mirror
  "KKKKKWWHHWWKKKKK",  // mirror
  "..KKKKWHHWKKKK..",  // handle continues to legs
  // Legs with handle between — 3 rows
  "...KKKKHHKKKK...",
  "...KKKKHHKKKK...",
  "..KKKKKHHKKKKK..",
  // Axe embedded in stump — 2 rows
  "....AAAHHA......",  // blade fans left in stump
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
console.log("Frame 1 (left): wind-up — widened shoulders, body shifted up, axe above head");
console.log("Frame 2 (right): chop down — canonical body, handle visible through belly to stump");
