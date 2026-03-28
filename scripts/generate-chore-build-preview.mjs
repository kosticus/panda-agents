#!/usr/bin/env node
// Generates building/repairing animation preview: 2 frames side by side at 8× scale.
// Frame 1: mallet raised — arms up holding mallet overhead, body tall, wide stance
// Frame 2: mallet down — body hunched/compressed, mallet strikes sawhorse, arms pushing down
// Uses the same vertical motion profile as chopping: HEIGHT change is the primary motion signal.

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
  M: [140, 100, 60],      // mallet handle (wood)
  X: [160, 160, 170],     // mallet head (steel gray)
  T: [120, 80, 50],       // sawhorse wood
  D: [90, 60, 35],        // dark wood grain
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

// === BUILD FRAME 1: Mallet raised, arms up — body tall, wide stance ===
// Both arms form a V above head holding mallet. Same profile as chop raised.
const build1 = n([
  // Mallet head above arms
  "....XXXXX.......",  // mallet head (5px wide)
  ".....MMM........",  // handle (3px wide)
  "....KKKKK.......",  // paws gripping — wide block (5px)
  "...KKK.KKK......",  // forearms spread (3px each)
  "..KKK...KKK.....",  // arms widen (3px each, clear gap)
  ".KKKK....KKKK...",  // arms merge into ears (4px gap)
  "KKKKK....KKKKK..",  // ears/arms at widest
  ".KKWWWWWWWWKK...",  // ear base into head
  ".WWWWWWWWWWWWW..",  // head
  "WWWWWWWWWWWWWWW.",  // head widest
  // Face
  "WWWKKKWWWKKKWWW.",  // eye patches
  "WWKKEKWWWKEKWWW.",  // eyes with glint
  "WWWKKKWWWKKKWWW.",  // eye patches
  ".WWWWWKKWWWWWW..",  // nose
  ".WWWWWWWWWWWWW..",  // lower face
  "..WWWWWWWWWWWW..",  // chin
  // Band — narrow (arms are raised)
  "...KKKKKKKKKK...",
  "..KKKKKKKKKKKK..",
  "..KKKKKKKKKKKK..",
  // Body — no black on sides (arms are up)
  "..WWWWWGGWWWWW..",  // body (white fur)
  "..WWWWGGGGWWWW..",  // belly
  "...WWWGGWWWWW...",  // body narrows
  "...WWWWWWWWWW...",  // hips
  // Legs — wide stance
  ".KKKK....KKKK..",  // legs spread
  "KKKKK....KKKKK.",  // feet wide
  // Sawhorse in front
  "....TTDDDDTT....",  // sawhorse top beam
  "....TDDDDDDT....",  // sawhorse body
]);

// === BUILD FRAME 2: Mallet swung down, body hunched over sawhorse ===
// Same compressed silhouette as chop-down: panda short, mallet strikes sawhorse.
const build2 = n([
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
  // Body hunched, arms pushing down on mallet
  "KKKKWWWGGWWWKKKK",  // body
  "KKKWWWGGGGWWWKKK",  // belly wide (hunched)
  ".KKWWWWGGWWWWKK.",  // body leans forward
  "..KWWWWWWWWWWK..",  // arms pushing down
  // Mallet + sawhorse in front of legs
  "..KK.XXXXX..KK..",  // paws flanking mallet head on sawhorse
  ".KKKKXMMMMXKKKK.",  // legs behind, mallet handle visible
  ".KKKKTTDDTTKKKK.",  // legs + sawhorse body
  "..KKKKTTTTKKKK..",  // feet + sawhorse base
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [build1, build2];

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
const outPath = join(outDir, "panda_build_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): mallet raised — arms in V above head, body tall, wide stance");
console.log("Frame 2 (right): mallet down — body hunched over sawhorse, compressed height");
