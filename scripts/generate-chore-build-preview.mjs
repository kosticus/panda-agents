#!/usr/bin/env node
// Generates building/repairing animation preview: 2 frames side by side at 8× scale.
// Frame 1: panda standing upright, holding wide plank across belly.
// Frame 2: panda crouched (drops 3 rows), plank placed on wall.
// Motion signal: panda drops vertically + plank moves from belly to wall.

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
  T: [200, 160, 96],      // plank wood (golden-amber)
  D: [160, 120, 64],      // dark wood grain (golden-amber)
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

// === BUILD FRAME 1: Standing, holding plank across belly ===
// Layout: 2 empty + 6 ears + 6 face + 3 band + 8 body + 3 legs + 2 wall + 2 empty = 32
const build1 = n([
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD — canonical — 6 rows
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE — canonical — 6 rows
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // DN_BAND — canonical — 3 rows
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY — plank across belly, full width — 8 rows
  "KKKKKWWWWWWKKKKK",  // body top
  "KKKKWWWGGWWWKKKK",  // belly
  "KKTTTTDDDDTTTTKK",  // plank held by paws (K at edges)
  "KKTTTTDDDDTTTTKK",  // plank
  "KKKKWWWGGWWWKKKK",  // belly below plank
  "KKKKKWWWWWWKKKKK",  // body base
  ".KKKKKWWWWKKKKK.",
  "..KKKKWWWWKKKK..",
  // DN_LEGS_IDLE — canonical — 3 rows
  "...KKKK..KKKK..",
  "...KKKK..KKKK..",
  "..KKKKK..KKKKK.",
  // Wall — 2 rows
  "..TTTTDDDDTTTT..",
  "..TDTTTTTTTTTD..",
]);

// === BUILD FRAME 2: Crouched, plank placed on wall ===
// Layout: 5 empty + 6 ears + 6 face + 3 band + 5 body + 2 legs + 3 wall + 2 empty = 32
const build2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD — canonical — 6 rows
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE — canonical — 6 rows
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // DN_BAND — canonical — 3 rows
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY — crouched, compressed to 5 rows — no plank
  "KKKKKWWWWWWKKKKK",  // body top
  "KKKKWWWGGWWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  "KKKKWWWGGWWWKKKK",  // narrows
  "KKKKKWWWWWWKKKKK",  // base
  // DN_LEGS — crouched, 2 rows
  "...KKKK..KKKK..",
  "..KKKKK..KKKKK.",
  // Wall — 3 rows (plank placed on top)
  "..TTTTDDDDTTTT..",  // freshly placed plank
  "..TTTTDDDDTTTT..",
  "..TDTTTTTTTTTD..",
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
console.log("Frame 1 (left): standing, holding wide plank across belly");
console.log("Frame 2 (right): crouched (dropped 3 rows), plank placed on wall");
