#!/usr/bin/env node
// Generates chopping wood animation preview: 2 frames side by side at 8× scale.
// Frame 1: axe raised — panda leans back slightly, axe handle in accessory rows above head.
// Frame 2: axe down — panda leans forward, arms bring axe to stump level.
// Both frames same height (3 empty rows at top each). Motion = lean + arm position.
// Feet in same position both frames.

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

// === CHOP FRAME 1: Axe raised, panda leans back slightly (head 1px right) ===
// 3 empty + 2 axe/arm rows + 6 ears + 6 face + 3 band + 6 body + 3 legs + 2 stump + 1 empty = 32
const chop1 = n([
  // 3 empty rows at top
  EMPTY,
  EMPTY,
  EMPTY,
  // Axe raised above head — arms (KK) visible connecting to body through ear gap
  "......KKAAAAKKK.",  // arms up gripping axe blade (AAAA)
  "......KKHH.KK...",  // arms hold handle (HH), merge toward ears
  // DN_EARS_HEAD shifted 1px RIGHT (lean back) — 6 rows
  "...KKKK..KKKK...",  // ear top
  "..KKKKK..KKKKK..",  // ear widens
  "..KKKKK..KKKKK..",  // ear holds
  "...KKWWWWWWKK...",  // ear base
  "...WWWWWWWWWWWW.",  // head
  "..WWWWWWWWWWWWWW",  // head widest
  // DN_FACE shifted 1px right (lean back) — 6 rows
  "..WWWKKKWWKKKWWW",  // eye patches
  "..WWKKEKWWKEKWWW",  // eyes with glint
  "..WWWKKKWWKKKWWW",  // eye patches
  "...WWWWWKKWWWWW.",  // nose
  "...WWWWWWWWWWWW.",  // lower face
  "....WWWWWWWWWW..",  // chin
  // DN_BAND shifted right — 3 rows
  "...KKKKKKKKKKKK.",
  "..KKKKKKKKKKKKKK",
  ".KKKKKKKKKKKKKKK",
  // DN_BODY shifted right, arms raised (slimmer sides) — 6 rows
  "..KKKKWWWWWWKKKK",  // body top
  "..KKKWWWGGWWWKKK",  // belly
  "..KKKWWGGGGWWKKK",  // belly
  "..KKKWWGGGGWWKKK",  // belly
  "..KKKKWWWGGWWKKK",  // body narrows
  "...KKKWWWWWWKKK.",  // body base
  // DN_LEGS_IDLE (same both frames) — 3 legs
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Stump at ground level — 2 rows
  ".....TTDDTT.....",
  EMPTY,
]);

// === CHOP FRAME 2: Axe down at stump, panda leans forward (head 1px left) ===
// 3 empty + 2 empty (no axe above) + 6 ears + 6 face + 3 band + 6 body+handle + 3 legs + 2 stump + 1 empty = 32
const chop2 = n([
  // 3 empty rows at top
  EMPTY,
  EMPTY,
  EMPTY,
  // Extra empty rows (axe is now down, not above head)
  EMPTY,
  EMPTY,
  // DN_EARS_HEAD shifted 1px LEFT (lean forward), full 6 ear rows
  ".KKKK..KKKK.....",  // ear top (shifted left)
  "KKKKK..KKKKK....",  // ear widens
  "KKKKK..KKKKK....",  // ear holds
  ".KKWWWWWWKK.....",  // ear base
  ".WWWWWWWWWWWWW..",  // head
  "WWWWWWWWWWWWWW..",  // head widest
  // DN_FACE shifted 1px left (lean forward) — 6 rows
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
  // Body shifted left, arms extend right with handle to stump — 6 rows
  "KKKKKWWWWWWKKKK.",  // body top
  "KKKKWWWGGWWWKKKK",  // belly, arm starts going right
  "KKKKWWGGGGWWKKKK",  // belly, arm extends
  ".KKKWWWGGWWWKKMM",  // body narrows, arms hold handle (MM)
  "..KKWWWWWWWKKMM.",  // body base, handle continues down
  "...KKWWWWWKKAAA.",  // body lower, axe blade (AAA) at stump
  // DN_LEGS_IDLE (same both frames) — 3 legs
  "...KKKK..KKKK...",
  "...KKKK..KKKK...",
  "..KKKKK..KKKKK..",
  // Stump at ground level — 2 rows
  ".....TTDDTT.....",
  EMPTY,
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
console.log("Frame 1 (left): axe raised — leans back (head right), paw grips handle above head");
console.log("Frame 2 (right): axe down — leans forward (head left), arms down at stump with axe");
