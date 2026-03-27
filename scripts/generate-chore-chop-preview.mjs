#!/usr/bin/env node
// Generates chopping wood animation preview: 2 frames side by side at 8× scale.
// Frame 1: axe raised — handle runs through ear gap, paws grip at ear level, body tall, wide stance
// Frame 2: axe down — body hunched/compressed over stump, axe embedded
// Front-facing. The overall HEIGHT difference between frames is the primary motion signal.

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

// === CHOP FRAME 1: Axe raised, thick arms visible above head ===
// Arms are 3px wide each, forming a clear V above the head.
// Paw block is 5px wide gripping handle. Body tall, slim, wide stance.
const chop1 = n([
  // Axe + thick arm assembly above head
  ".....AAAAA......",  // axe blade (5px wide)
  "......HHH.......",  // handle (3px wide)
  ".....KKKKK......",  // paws gripping — wide block (5px)
  "....KKK.KKK.....",  // forearms spread (3px each)
  "...KKK...KKK....",  // arms widen (3px each, clear gap)
  "..KKKK....KKKK..",  // arms merge into ears (4px gap)
  ".KKKKK....KKKKK.",  // ears/arms at widest
  "..KKWWWWWWWWKK..",  // ear base into head
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  "...WWWWWWWWWW...",  // chin
  // Band — narrow (arms are raised, not wrapping the sides)
  "....KKKKKKKK....",
  "...KKKKKKKKKK...",
  "...KKKKKKKKKK...",
  // Body — NO black on sides (arms are up, only white fur + gray belly visible)
  "...WWWWGGWWWW...",  // body (white fur, no K edges)
  "...WWWGGGGWWW...",  // belly
  "....WWWGGWWW....",  // body narrows
  "....WWWWWWWW....",  // hips
  // Legs — wide stance
  "..KKKK....KKKK.",  // legs spread
  ".KKKKK....KKKKK",  // feet wide
  // Stump in front (at ground level)
  ".....TTDDTT.....",  // stump top
  ".....TTTTTT.....",  // stump body
]);

// === CHOP FRAME 2: Axe swung down into stump IN FRONT of body ===
// Panda hunched, much shorter. Stump+axe at waist level overlapping the legs.
const chop2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head dropped lower, ears compressed
  "..KKKK..KKKK....",  // ear top
  "..KKWWWWWWKK....",  // ears compressed
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  // Band (no chin — compressed)
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body hunched, arms reaching forward/down
  "KKKKWWWGGWWWKKKK",  // body
  "KKKWWWGGGGWWWKKK",  // belly wide (hunched)
  ".KKWWWWGGWWWWKK.",  // body leans forward
  "..KWWWWWWWWWWK..",  // arms reaching down to stump
  // Stump + axe in front of legs (overlaps — between panda and viewer)
  "..KK.AAAAAA.KK..",  // paws flanking axe blade in stump
  ".KKKKAATTAAKKKK.",  // legs behind stump, axe embedded
  ".KKKKTTDDTTKKKK.",  // legs + stump body
  "..KKKKTTTTKKKK..",  // feet + stump base
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
console.log("Frame 1 (left): axe raised — handle through ear gap, paws grip at head, tall stance");
console.log("Frame 2 (right): axe down — hunched over stump, compressed, axe embedded");
