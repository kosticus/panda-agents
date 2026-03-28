#!/usr/bin/env node
// Generates building/repairing animation preview: 2 frames side by side at 8× scale.
// Frame 1: arm back/up — mallet held above/behind head in accessory rows. Body centered/back.
// Frame 2: arm forward/down — body leans forward, mallet at wall/structure level.
// Motion signal: VERTICAL arm movement (arm up -> arm down) + forward lean.
// Both frames same height (~30 rows). Feet same position. Low wall at bottom.

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
  T: [120, 80, 50],       // wall plank wood
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

// === BUILD FRAME 1: Arm pulled back/up, mallet above head in accessory rows. Body centered. ===
// Layout: 1 mallet head + 3 handle/arm rows + 6 ears + 6 face + 3 band + 7 body + 3 legs + 2 wall + 1 empty = 32
const build1 = n([
  // Mallet in accessory header — held up above/behind head (right side)
  "..........XXXXX.",  // mallet head (5px wide steel)
  "..........MMM...",  // handle top
  "..........MM....",  // handle mid
  "..........KK....",  // paw gripping handle (arm raised right)
  // DN_EARS_HEAD — full canonical, centered — 6 rows
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE — full canonical — 6 rows
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // DN_BAND — 3 rows
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY — canonical, right arm pulled up/back — 7 rows
  "KKKKKWWWWWWKKKKK",  // body top
  "KKKKWWWGGWWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  "KKKKKWWWGGWWWKKK",  // body narrows
  ".KKKKWWWWWWWKKKK",  // body base
  "..KKKWWWWWWKKK..",  // body bottom
  // DN_LEGS_IDLE (same both frames) — 3 rows
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Wall/structure at bottom being built — 2 rows
  "....TTDTTDTTDT..",  // low wall planks top
  "....TDTTDTTDTT..",  // low wall planks bottom
]);

// === BUILD FRAME 2: Arm forward/down, mallet strikes wall. Body leans forward. ===
// Layout: 4 empty + 5 ears (drop 1 for lean) + 6 face + 3 band + 8 body+mallet + 3 legs + 2 wall + 1 empty = 32
const build2 = n([
  // 4 empty rows (mallet is down, not in acc header)
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px LEFT (lean forward), drop 1 ear row — 5 rows
  ".KKKK..KKKK.....",  // ear top
  "KKKKK..KKKKK....",  // ear widens
  ".KKWWWWWWKK.....",  // ear base (skip one ear-hold row)
  ".WWWWWWWWWWWWW..",  // head
  "WWWWWWWWWWWWWW..",  // head widest
  // DN_FACE shifted left (lean forward) — 6 rows
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
  // DN_BODY shifted left — right arm extends forward/down, mallet at wall level — 8 rows
  "KKKKKWWWWWWKKKK.",  // body top
  "KKKKWWWGGWWWKKK.",  // belly
  "KKKKWWGGGGWWKKK.",  // belly, arm comes forward
  "KKKKWWGGGGWWKKK.",  // belly, arm going down
  "KKKKKWWWGGWWWKK.",  // body narrows, arm at mid level
  ".KKKKWWWWWWWKKKK",  // body base, arm reaching down
  "..KKKWWWWWWKKMMM",  // arm extends down, mallet handle (MMM)
  "...KKWWWWWWKKXXX",  // mallet head (XXX) at wall level
  // DN_LEGS_IDLE (same both frames) — 3 rows
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Wall/structure at bottom — 2 rows
  "....TTDTTDTTDT..",  // low wall planks top
  "....TDTTDTTDTT..",  // low wall planks bottom
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
console.log("Frame 1 (left): arm back/up — mallet above head in accessory rows, body upright");
console.log("Frame 2 (right): arm forward/down — body leans forward, mallet strikes wall at bottom");
