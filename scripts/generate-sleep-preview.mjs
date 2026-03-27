#!/usr/bin/env node
// Generates sleeping animation preview: 2 frames side by side at 8× scale.
// Frame 1: sitting slump, head up (light nod)
// Frame 2: sitting slump, head down (deep nod)
// Both front-facing. Zzz overlay is a separate client-side concern.

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
  Z: [130, 180, 240],     // zzz (light blue)
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

// === SLEEP FRAME 1: Sitting slump, head slightly forward ===
// Based on the sitting/typing pose but:
// - No bamboo (paws resting on lap/ground)
// - Eyes closed (no glint, eye patches become solid dark)
// - Head shifted down 1 row vs normal sitting (slight droop)
// - Body hunched (slightly compressed)

const sleep1 = n([
  "............ZZZ.",  // big z: top bar
  "..............Z.",  // big z: right
  ".............Z..",  // big z: center
  "............ZZZ.",  // big z: bottom bar
  // Ears + head (normal position)
  "..KKKK..KKKK....",  // ear top
  ".KKKKK..KKKKK...",  // ear widens
  ".KKKKK..KKKKK...",  // ear holds
  "..KKWWWWWWKK....",  // ear base into head
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW..",  // head widest
  // Face — eyes CLOSED (solid dark patches, no glint)
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKKKKWKKKKWW.",  // eyes shut
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  "...WWWWWWWWWW...",  // chin
  // Band
  "..KKKKKKKKKKKK..",  // band 1
  ".KKKKKKKKKKKKKKK",  // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  // Hunched body, paws resting on lap
  "KKKKWWWGGWWWKKKK",  // body
  "KKKKWWGGGGWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  ".KKKWWWGGWWWKKK.",  // body narrows
  "..KKWWWWWWWWKK..",  // lap/paws
  "..WWWWWWWWWWWW..",  // base
  // Legs tucked
  "...KKKK..KKKK...",  // legs
  "...KKKK..KKKK...",  // legs
  "..KKKKK..KKKKK..",  // feet
]);

// === SLEEP FRAME 2: Deep nod — head drops 2 rows, ears flatten, body tilts forward ===

const sleep2 = n([
  "...........ZZZ..",  // big z: top bar (shifted left from frame 1)
  ".............Z..",  // big z: right
  "............Z...",  // big z: center
  "...........ZZZ..",  // big z: bottom bar
  // Ears flattened (head drooping forward)
  "..KKKK..KKKK....",  // ear top
  "..KKWWWWWWKK....",  // ears compressed — skip straight to base
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW..",  // head widest
  // Face — eyes closed, lower on frame
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKKKKWKKKKWW.",  // eyes shut
  "..WWWWWKKWWWWW..",  // nose (chin row removed — head compressed)
  "..WWWWWWWWWWWW..",  // lower face
  // Band (shifted down with head)
  "..KKKKKKKKKKKK..",  // band 1
  ".KKKKKKKKKKKKKKK",  // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  // Body tilts forward slightly (paws further out)
  "KKKKWWWGGWWWKKKK",  // body
  "KKKWWWGGGGWWWKKK",  // belly (wider — leaning)
  "KKKWWWGGGGWWWKKK",  // belly
  ".KKWWWWGGWWWWKK.",  // body leans forward
  "..KWWWWWWWWWWK..",  // paws out further
  "..WWWWWWWWWWWW..",  // base
  // Legs same
  "...KKKK..KKKK...",  // legs
  "...KKKK..KKKK...",  // legs
  "..KKKKK..KKKKK..",  // feet
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [sleep1, sleep2];

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
const outPath = join(outDir, "panda_sleep_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): head up, light slump — eyes closed, paws resting");
console.log("Frame 2 (right): head down, deeper nod — ears compress, head drops 1 row");
