#!/usr/bin/env node
// Generates cooking chore animation preview: 2 frames side by side at 8× scale.
// Frame 1: body rocks LEFT over pot, right arm extends to stir with spoon
// Frame 2: body rocks RIGHT over pot, left arm extends to stir with spoon
// Both frames same total height (32 rows). 2 empty rows at top to align with others.
// Motion: left/right sway + spoon angle change.

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
  R: [180, 60, 40],       // pot / clay
  O: [220, 140, 50],      // fire orange
  Y: [240, 200, 60],      // fire yellow
  S: [120, 120, 120],     // stone ring
  P: [100, 70, 40],       // spoon handle (dark wood)
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

// === COOK FRAME 1: Static body, spoon stirs LEFT side of pot ===
// 2 empty + 6 ears + 6 face + 3 band + 6 body + 3 legs + 4 pot + 2 pad = 32
// Body is centered and identical in both frames. Only pot row changes.
const cook1 = n([
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
  // Body — 6 rows (canonical, centered, identical both frames)
  "KKKKKWWWWWWKKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKWWGGGGWWKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKKWWWWWWKKKKK",
  "..KKKKWWWWKKKK..",
  // DN_LEGS_IDLE — 3 rows (identical both frames)
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Pot — spoon (PP) stirs LEFT side
  "...PPRRRRRR.....",  // spoon handle left, pot rim
  "....RRRRRRRR....",  // pot body
  "...SOOYYYOOS....",  // fire + stone ring
  "...SSSSSSSS.....",  // stone base
]);

// === COOK FRAME 2: Body centered (same as frame 1), spoon stirs RIGHT ===
const cook2 = n([
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD centered (identical to frame 1)
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE centered (identical to frame 1)
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // DN_BAND centered (identical to frame 1)
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body centered (identical to frame 1)
  "KKKKKWWWWWWKKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKWWGGGGWWKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKKWWWWWWKKKKK",
  "..KKKKWWWWKKKK..",
  // DN_LEGS_IDLE (identical to frame 1)
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Pot — spoon stirs RIGHT side
  ".....RRRRRRPP...",  // pot rim + spoon handle right
  "....RRRRRRRR....",  // pot body
  "...SOOYYYOOS....",  // fire + stone ring
  "...SSSSSSSS.....",  // stone base
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [cook1, cook2];

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
const outPath = join(outDir, "panda_cook_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): lean left — whole body shifted left, right arm stirs with spoon");
console.log("Frame 2 (right): lean right — whole body shifted right, left arm stirs with spoon");
