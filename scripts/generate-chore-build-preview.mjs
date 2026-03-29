#!/usr/bin/env node
// Generates building/repairing animation preview: 3 frames side by side at 8× scale.
// Frame 1: mallet raised — held above head, arm bridges header to ear, body canonical.
// Frame 2: mid-swing — mallet at chest/shoulder height on right side, body canonical.
// Frame 3: impact — body leans forward, mallet strikes wall at bottom.
// Motion signal: 3-frame swing arc (raised → mid → impact).
// All frames same height (32 rows). Feet same position. Low wall at bottom.

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

// === BUILD FRAME 1: Mallet raised above head. Arm in header rows only, bridges to ear. ===
// Layout: 4 header + 6 ears + 6 face + 3 band + 8 body + 3 legs + 2 wall = 32
const build1 = n([
  // Mallet raised above head — arm (KK/KKK) bridges from handle down to right ear (cols 8-11)
  "..........XXXXX.",  // row 0: mallet head (5px steel gray)
  "...........MM...",  // row 1: handle below head
  "..........KKK...",  // row 2: paw gripping handle
  ".........KKK....",  // row 3: arm base, cols 9-11 → meets right ear below
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
  // DN_BODY — canonical — 8 rows
  "KKKKKWWWWWWKKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKWWGGGGWWKKKK",
  "KKKKWWGGGGWWKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKKWWWWWWKKKKK",
  ".KKKKKWWWWKKKKK.",
  "..KKKKWWWWKKKK..",
  // DN_LEGS_IDLE — canonical — 3 rows
  "...KKKK..KKKK..",
  "...KKKK..KKKK..",
  "..KKKKK..KKKKK.",
  // Wall/structure at bottom — 2 rows
  "....TTDTTDTTDT..",
  "....TDTTDTTDTT..",
]);

// === BUILD FRAME 2: Mid-swing. Mallet at chest height, right side. Body canonical. ===
// Layout: 4 empty + 6 ears + 6 face + 3 band + 8 body + 3 legs + 2 wall = 32
const build2 = n([
  // 4 empty header rows (mallet is at body level, not above head)
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
  // DN_BODY — modified: mallet at chest/shoulder height on right side — 8 rows
  "KKKKKWWWWWWKKKKK",  // body top (canonical)
  "KKKKWWWGGWWWKKKK",  // belly (canonical)
  "KKKKWWGGGGWWKKMM",  // arm extends right, holding handle
  "KKKKWWGGGGWWKKXX",  // mallet head at end of arm
  "KKKKWWWGGWWWKKKK",  // body narrows (canonical)
  "KKKKKWWWWWWKKKKK",  // body base (canonical)
  ".KKKKKWWWWKKKKK.",  // canonical
  "..KKKKWWWWKKKK..",  // canonical
  // DN_LEGS_IDLE — canonical — 3 rows
  "...KKKK..KKKK..",
  "...KKKK..KKKK..",
  "..KKKKK..KKKKK.",
  // Wall/structure at bottom — 2 rows
  "....TTDTTDTTDT..",
  "....TDTTDTTDTT..",
]);

// === BUILD FRAME 3: Impact. Body leans forward, mallet strikes wall. ===
// Layout: 4 empty + 5 ears + 6 face + 3 band + 8 body + 3 legs + 2 wall + 1 empty = 32
const build3 = n([
  // 4 empty rows (mallet is down at wall level)
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px left (lean forward), drop 1 ear row — 5 rows
  ".KKKK..KKKK.....",
  "KKKKK..KKKKK....",
  ".KKWWWWWWKK.....",
  ".WWWWWWWWWWWWW..",
  "WWWWWWWWWWWWWW..",
  // DN_FACE shifted left (lean forward) — 6 rows
  "WWWKKKWWKKKWWW..",
  "WWKKEKWWKEKWWW..",
  "WWWKKKWWKKKWWW..",
  ".WWWWWKKWWWWW...",
  ".WWWWWWWWWWWW...",
  "..WWWWWWWWWW....",
  // DN_BAND shifted left — 3 rows
  ".KKKKKKKKKKKK...",
  "KKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY shifted left — arm extends down to mallet at wall — 8 rows
  "KKKKKWWWWWWKKKK.",
  "KKKKWWWGGWWWKKK.",
  "KKKKWWGGGGWWKKK.",
  "KKKKWWGGGGWWKKK.",
  "KKKKKWWWGGWWWKK.",
  ".KKKKWWWWWWWKKKK",
  "..KKKWWWWWWKKMMM",
  "...KKWWWWWWKKXXX",
  // DN_LEGS_IDLE — 3 rows
  "...KKKK..KKKK..",
  "...KKKK..KKKK..",
  "..KKKKK..KKKKK.",
  // Wall/structure at bottom — 2 rows
  "....TTDTTDTTDT..",
  "....TDTTDTTDTT..",
]);

// === Render: 3 frames side by side ===
const COLS = 3;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [build1, build2, build3];

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
console.log("Frame 1 (left): mallet raised — held above head, arm bridges header to ear, body canonical");
console.log("Frame 2 (center): mid-swing — mallet at chest height on right side, body canonical");
console.log("Frame 3 (right): impact — body leans forward, mallet strikes wall at bottom");
