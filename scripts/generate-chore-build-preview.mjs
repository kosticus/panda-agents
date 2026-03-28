#!/usr/bin/env node
// Generates building/repairing animation preview: 2 frames side by side at 8× scale.
// Frame 1: Standing, arm/mallet pulled back LEFT (away from wall). Wall planks on right.
//          Full canonical height. Body centered/neutral.
// Frame 2: Arm/mallet strikes wall. Body leans toward wall (right). Horizontal arm swing.
// Motion signal: HORIZONTAL arm movement (distinct from chop's vertical motion).

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

// === BUILD FRAME 1: Standing, mallet pulled back LEFT, arm cocked. Wall on right. ===
// Full canonical height. Left arm pulled back (holding mallet). Wall planks on far right.
// Layout: 4 empty (acc header) + 6 ears + 6 face + 3 band + 8 body + 3 legs = 30 rows
const build1 = n([
  // 4-row acc header (empty — no overhead prop in this frame)
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD (6 rows) — full canonical, centered
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  // DN_FACE (6 rows) — full canonical
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  // DN_BAND (3 rows)
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY (8 rows) — left arm extended left (mallet pulled back), wall plank on right
  "XXKKKWWWWWWKKKT.",  // mallet head left (XX), body, wall plank (T) right
  "MXKKWWWGGWWWKKT.",  // handle+mallet, body belly, wall
  "MMKKKWWGGGGWWKT.",  // handle continues, belly, wall
  "MKKKKWWGGGGWWKT.",  // handle at grip, belly, wall
  ".KKKKKWWWGGWKKT.",  // body narrows, wall
  ".KKKKKWWWWWWKKT.",  // body base, wall
  "..KKKKKWWWWKKKKT",  // body narrows, wall
  "...KKKKWWWWKKKT.",  // body bottom, wall
  // DN_LEGS_IDLE (3 rows)
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
]);

// === BUILD FRAME 2: Body leans toward wall (right), mallet strikes wall. ===
// Body shifted 1px right (lean toward wall). Arm now extended RIGHT, mallet hits wall.
// Layout: 4 empty + 6 ears + 6 face + 3 band + 8 body + 3 legs = 30 rows
const build2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px right (lean toward wall)
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  "..KKKKK..KKKKK..",
  "...KKWWWWWWKK...",
  "...WWWWWWWWWWWW.",
  "..WWWWWWWWWWWWWW",
  // DN_FACE shifted 1px right
  "..WWWKKKWWKKKWWW",
  "..WWKKEKWWKEKWWW",
  "..WWWKKKWWKKKWWW",
  "...WWWWWKKWWWWW.",
  "...WWWWWWWWWWWW.",
  "....WWWWWWWWWW..",
  // DN_BAND shifted right
  "...KKKKKKKKKKKK.",
  "..KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // DN_BODY (8 rows) — right arm now extends RIGHT, mallet head hits wall planks
  ".KKKKWWWWWWKXXTT",  // body shifted right, arm extends, mallet (XX) hits wall (TT)
  ".KKKWWWGGWWKXTT.",  // belly, arm at wall
  ".KKKWWGGGGWWKXT.",  // belly, mallet strikes
  ".KKKWWGGGGWWKXT.",  // belly, impact
  "..KKWWWGGWWWKTT.",  // body narrows, wall
  "..KKWWWWWWWKKTT.",  // body base, wall
  "...KKKWWWWKKKKT.",  // body narrows, wall
  "...KKKKWWWWKKKT.",  // body bottom, wall
  // Legs — weight shifted right (lean toward wall)
  "....KKKK..KKKK..",
  "....KKKK..KKKK..",
  "...KKKKK..KKKKK.",
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
console.log("Frame 1 (left): standing full height — mallet pulled back left, wall planks on right");
console.log("Frame 2 (right): body leans right — mallet strikes wall, horizontal arm swing");
