#!/usr/bin/env node
// Generates bamboo harvesting animation preview: 2 frames side by side at 8× scale.
// Frame 1: reach high — arms up gripping bamboo stalk near top, body tall, pulling
// Frame 2: crouch down — bamboo pulled/cut, body hunched, stalk now at waist level
// Shares vertical motion profile with chopping: HEIGHT change is the primary signal.

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
  N: [80, 160, 60],       // bamboo green (dark)
  V: [120, 190, 80],      // bamboo green (light)
  J: [60, 120, 40],       // bamboo node (darkest)
  L: [160, 210, 100],     // bamboo leaf
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

// === BAMBOO FRAME 1: Reaching up — arms raised, gripping bamboo stalk high ===
// Bamboo stalk runs vertically on the right. Arms form V above head gripping it.
const bamboo1 = n([
  // Bamboo stalk above frame + paw gripping high
  "............NVN.",  // bamboo stalk top (3px wide)
  "....KKKKK...NVN.",  // paws gripping — wide block (5px)
  "...KKK.KKK..NVN.",  // forearms spread, bamboo to right
  "..KKK...KKK.NVN.",  // arms widen, bamboo right
  ".KKKK....KKKNVN.",  // arms merge into ears, bamboo right
  "KKKKK....KKKKVN.",  // ears at widest, bamboo
  ".KKWWWWWWWWKKVN.",  // ear base into head, bamboo
  ".WWWWWWWWWWWWVN.",  // head, bamboo
  "WWWWWWWWWWWWWWN.",  // head widest, bamboo
  // Face
  "WWWKKKWWWKKKWWN.",  // eye patches
  "WWKKEKWWWKEKWWN.",  // eyes with glint
  "WWWKKKWWWKKKWWN.",  // eye patches
  ".WWWWWKKWWWWWWN.",  // nose
  ".WWWWWWWWWWWWWN.",  // lower face
  "..WWWWWWWWWWWWN.",  // chin
  // Band
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKK..",  // band (arm on right, missing K far right)
  "KKKKKKKKKKKKK...",  // band 3
  // Body — right arm raised, no K on right edge
  "KKKKWWWGGWWWWW..",  // body
  "KKKKWWGGGGWWWW..",  // belly
  ".KKKWWGGGGWWW...",  // belly narrows
  "..KKWWWGGWWW....",  // body narrows
  "..WWWWWWWWWW....",  // hips
  // Legs — wide stance
  "...KKKK..KKKK...",  // legs
  "...KKKK..KKKK...",  // legs
  "..KKKKK..KKKKK..",  // feet
  // Ground level bamboo stalk base
  "...........NJN..",  // bamboo node at ground
  "...........NVN..",  // bamboo base
]);

// === BAMBOO FRAME 2: Hunched, stalk pulled down to waist level ===
// Body compressed, bamboo stalk now at mid-height, leaves swept sideways.
const bamboo2 = n([
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head dropped lower
  "..KKKK..KKKK....",  // ear top
  "..KKWWWWWWKK....",  // ears compressed
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  // Band (no chin)
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body hunched, arms pulling down gripping stalk
  "KKKKWWWGGWWWKKKK",  // body
  "KKKWWWGGGGWWWKKK",  // belly wide (hunched)
  ".KKWWWWGGWWWWKK.",  // arms reaching sideways for stalk
  "..KWWWWWWWWWWK..",  // lower body gripping
  // Stalk now at leg level, bent sideways, leaves fanning out
  "..KK.NJN....KK..",  // paws gripping bent stalk section
  ".KKKKNVNLLL.KKK.",  // legs behind stalk, leaves right
  ".KKKKNNNNLL.KKKK",  // stalk + leaves spread
  "..KKKKNNN.KKKK..",  // feet + stalk base
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [bamboo1, bamboo2];

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
const outPath = join(outDir, "panda_bamboo_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): reaching high — arms in V gripping bamboo stalk above head, tall posture");
console.log("Frame 2 (right): hunched/pulling — stalk pulled down to waist, body compressed");
