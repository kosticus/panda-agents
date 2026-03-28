#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Frame 1: rod cast — panda upright, right arm raised, rod angled up and out to the right
// Frame 2: waiting — panda seated/low, rod horizontal, line in water with bobber
// The HEIGHT change (standing vs sitting low) is the primary motion signal.

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
  F: [120, 80, 50],       // fishing rod (wood brown)
  L: [200, 200, 210],     // fishing line (light gray)
  U: [60, 130, 200],      // water blue
  B: [230, 80, 60],       // bobber red
  P: [180, 140, 60],      // pond edge / sandy bank
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

// === FISH FRAME 1: Standing, rod cast upward — arm raised, rod angles up-right ===
// Right arm extends up with rod going diagonally. Body tall, full height.
const fish1 = n([
  // Rod tip high above head (diagonal, right side)
  "..............F.",  // rod tip
  ".............FF.",  // rod shaft
  "............FF..",  // rod continues
  "...........FF...",  // rod near hand
  // Head — normal centered position
  "..KKKK..KKKK....",  // ear top
  ".KKKKK..KKKKK...",  // ear widens
  ".KKKKK..KKKKK...",  // ear holds
  "..KKWWWWWWKK....",  // ear base
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face — right arm raised above, rod in paw
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  "...WWWWWWWWWW...",  // chin
  // Band
  "..KKKKKKKKKKKK..",  // band 1
  ".KKKKKKKKKKKKK..",  // band 2 (arm on right, missing K far right)
  "KKKKKKKKKKKKK...",  // band 3
  // Body — right arm raised (no K on right edge — arm is up)
  "KKKKWWWGGWWWWW..",  // body
  "KKKKWWGGGGWWWW..",  // belly
  ".KKKWWGGGGWWW...",  // belly narrows
  "..KKWWWGGWWW....",  // body narrows
  "..WWWWWWWWWW....",  // hips
  // Legs — standing
  "...KKKK..KKKK...",  // legs
  "...KKKK..KKKK...",  // legs
  "..KKKKK..KKKKK..",  // feet
  // Water bank below
  "...PPPPPPPPPP...",  // sandy bank
  "..UUUUUUUUUUUU..",  // water surface
]);

// === FISH FRAME 2: Seated/low, rod horizontal, bobber in water, waiting ===
// Panda is LOW (seated). Rod extends flat to the right. Bobber bobs in water.
const fish2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head low (seated — head starts later in frame)
  "..KKKK..KKKK....",  // ear top
  "..KKWWWWWWKK....",  // ears compressed (seated slouch)
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  // Band (no chin — seated/slouched forward)
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body — wide, seated, right arm extends holding rod horizontal
  "KKKWWWGGGGWWWKKK",  // body wide (seated)
  "KKWWWWGGGGWWWWKK",  // belly spreads
  ".KWWWWGGWWWWKFFF",  // body, right arm to rod
  "..KWWWWWWWWKFFF.",  // lower body, rod extends right
  // Legs folded low (seated)
  "..KKKKKKKKKKKK..",  // thick leg block (folded)
  "..KKKKKKKKKKKK..",  // feet/seat
  "...PPPPPPPPPP...",  // sandy bank
  "..UUUUUBUUUUUU..",  // water + bobber (B at col 6)
  "..UUUUUUUUUUUU..",  // water depth
  "..UUUUUUUUUUUU..",  // water depth
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [fish1, fish2];

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
const outPath = join(outDir, "panda_fish_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): standing — rod cast upward, right arm raised, full height");
console.log("Frame 2 (right): seated low — rod horizontal, bobber in water, waiting");
