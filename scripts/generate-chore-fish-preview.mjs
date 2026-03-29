#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Both frames seated. Motion: rod angle change + body lean + bobber splash.
// Frame 1: rod angled forward (tip col 13, base col 14), body centered, bobber floating.
// Frame 2: rod straight up (col 15), body leans back 3px, bobber splashing.
// 5-row ears (drop 1 from canonical) for seated posture.

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
  D: [100, 170, 220],     // splash (light blue)
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

// === FISH FRAME 1: Seated, rod angled forward, bobber floating, calm water ===
// Rod: tip at col 13 (rows 3-6), transitions to col 14 (rows 7-18), grip FF at cols 14-15.
// Body centered (canonical position). 5-row compressed ears.
// 3 pad + 3 rod + 5 ears + 6 face + 2 band + 4 body + 2 legs + 1 bank + 4 water = 30 (+2 pad from n())
const fish1 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Rod above head — angled forward, tip at col 13
  ".............F..",         // row 3: rod tip at col 13
  ".............F..",         // row 4: rod shaft at col 13
  ".............F..",         // row 5: rod at col 13
  // Ears — 5 rows (compressed), rod transitions from col 13 to col 14
  "..KKKK..KKKK.F..",        // row 6: ear tops, rod col 13
  ".KKKKK..KKKKK.F.",        // row 7: ear widens, rod col 14
  "..KKWWWWWWKK..F.",        // row 8: ear base, rod col 14
  "..WWWWWWWWWWWWF.",        // row 9: head, rod col 14 (overwrites W)
  ".WWWWWWWWWWWWWF.",        // row 10: head widest, rod col 13 (overwrites W)
  // Face — 6 rows, rod at col 14
  ".WWWKKKWWKKKWWF.",        // row 11: eye patches, rod col 14 (overwrites W)
  ".WWKKEKWWKEKWWF.",        // row 12: eyes with glint, rod col 14
  ".WWWKKKWWKKKWWF.",        // row 13: eye patches, rod col 14
  "..WWWWWKKWWWWWF.",        // row 14: nose, rod col 14
  "..WWWWWWWWWWWWF.",        // row 15: lower face, rod col 14
  "...WWWWWWWWWW.F.",        // row 16: chin, rod col 14
  // Band — 2 rows, rod at col 14
  "..KKKKKKKKKKKKF.",        // row 17: band, rod col 14
  ".KKKKKKKKKKKKKFK",        // row 18: band wide, rod col 14
  // Body — seated, paw grips rod at cols 14-15
  "KKKKKWWWWWWKKKFF",        // row 19: body top, grip FF cols 14-15
  "KKKKWWWGGWWWKKFF",        // row 20: belly, grip FF
  "KKKKWWGGGGWWKKFF",        // row 21: belly wide, grip FF
  ".KKKWWWGGWWWKK..",        // row 22: lower body
  // Legs folded/tucked (seated)
  "..KKKKKKKKKKKK..",        // row 23: leg block
  "..KKKKKKKKKKKK..",        // row 24: feet on bank
  // Sandy bank
  "...PPPPPPPPPP...",        // row 25: sandy bank
  // Water with floating bobber — calm
  "UUUUUUUUUUUUUUUU",       // row 26: water surface
  "UUUUUUUUUBBBUUUU",       // row 27: bobber floating (3px at cols 9-11)
  "UUUUUUUUUUUUUUUU",       // row 28: water depth
  "UUUUUUUUUUUUUUUU",       // row 29: water bottom
]);

// === FISH FRAME 2: Seated, rod straight up (bite!), body leaned back 3px, bobber splashing ===
// Rod: straight up at col 15 from tip to grip. Body shifted 3px right (lean back).
// Legs and bank anchored (same position as frame 1). Bobber submerged with splash.
// 3 pad + 3 rod + 5 ears + 6 face + 2 band + 4 body + 2 legs + 1 bank + 4 water = 30 (+2 pad from n())
const fish2 = n([
  EMPTY,                     // row 0: pad
  EMPTY,                     // row 1: pad
  EMPTY,                     // row 2: pad
  // Rod above head — straight up at col 15
  "...............F",        // row 3: rod tip at col 15
  "...............F",        // row 4: rod shaft at col 15
  "...............F",        // row 5: rod continues at col 15
  // Ears — 5 rows (compressed), shifted 3px right, rod at col 15
  ".....KKKK..KKKKF",       // row 6: ear tops shifted 3R, rod overwrites col 15
  "....KKKKK..KKKKF",       // row 7: ear widens shifted 3R, rod overwrites col 15
  ".....KKWWWWWWKKF",       // row 8: ear base shifted 3R, rod at col 15
  ".....WWWWWWWWWWF",       // row 9: head shifted 3R, rod at col 15
  "....WWWWWWWWWWWF",       // row 10: head widest shifted 3R, rod at col 15
  // Face — 6 rows, shifted 3px right, rod at col 15
  "....WWWKKKWWKKKF",       // row 11: eye patches shifted 3R, rod col 15
  "....WWKKEKWWKEKF",       // row 12: eyes shifted 3R, rod col 15
  "....WWWKKKWWKKKF",       // row 13: eye patches shifted 3R, rod col 15
  ".....WWWWWKKWWWF",       // row 14: nose shifted 3R, rod col 15
  ".....WWWWWWWWWWF",       // row 15: lower face shifted 3R, rod col 15
  "......WWWWWWWWWF",       // row 16: chin shifted 3R, rod col 15
  // Band — 2 rows, shifted 3px right, rod at col 15
  ".....KKKKKKKKKKF",       // row 17: band shifted 3R, rod col 15
  "....KKKKKKKKKKKF",       // row 18: band wide shifted 3R, rod col 15
  // Body — shifted 3px right, paw grips rod at cols 14-15
  "...KKKKKWWWWWWFF",       // row 19: body shifted 3R, grip FF
  "...KKKKWWWGGWWFF",       // row 20: belly shifted 3R, grip FF
  "...KKKKWWGGGGWFF",       // row 21: belly wide shifted 3R, grip FF
  "....KKKWWWGGWWWK",       // row 22: lower body shifted 3R
  // Legs folded/tucked (same position as frame 1 — anchored)
  "..KKKKKKKKKKKK..",       // row 23: leg block (anchored)
  "..KKKKKKKKKKKK..",       // row 24: feet on bank (anchored)
  // Sandy bank
  "...PPPPPPPPPP...",       // row 25: sandy bank (same position)
  // Water with splash — bobber submerged
  "UUUUUUUUUDDUUUUU",      // row 26: water surface, splash DD at cols 9-10
  "UUUUUUUUDBBBDUUU",      // row 27: bobber submerged (3px) + splash at cols 8,12
  "UUUUUUUUUDDUUUUU",      // row 28: splash below at cols 9-10
  "UUUUUUUUUUUUUUUU",      // row 29: water bottom
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
console.log("Frame 1 (left): rod angled forward (tip col 13), body centered, bobber floating");
console.log("Frame 2 (right): rod straight up (col 15), body leaned back 3px, bobber splash");
