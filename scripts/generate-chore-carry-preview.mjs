#!/usr/bin/env node
// Generates carrying animation preview: 2 frames side by side at 8× scale.
// Walk cycle with a bundle/box held in front of body.
// Frame 1: left foot forward — body weight shifts slightly right, bundle at chest
// Frame 2: right foot forward — body weight shifts slightly left, bundle at chest
// The leg/foot alternation is the primary motion signal (walking variant, not stationary).

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
  T: [160, 110, 60],      // bundle/crate (tan wood)
  X: [120, 80, 40],       // bundle straps / dark wood
  R: [200, 170, 110],     // bundle highlight
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

// === CARRY FRAME 1: Left foot forward, weight slightly right ===
// Body shifted 1px right from neutral. Bundle held at chest level, both arms under it.
const carry1 = n([
  // Head shifted 1px right (like cook2 — weight shift rightward)
  "...KKKK..KKKK...",  // ear top (shifted right)
  "..KKKKK..KKKKK..",  // ear widens
  "..KKKKK..KKKKK..",  // ear holds
  "...KKWWWWWWKK...",  // ear base
  "...WWWWWWWWWWWW.",  // head
  "..WWWWWWWWWWWWWW",  // head widest
  // Face shifted right
  "..WWWKKKWWKKKWWW",  // eye patches
  "..WWKKEKWWKEKWWW",  // eyes with glint
  "..WWWKKKWWKKKWWW",  // eye patches
  "...WWWWWKKWWWWW.",  // nose
  "...WWWWWWWWWWWW.",  // lower face
  "....WWWWWWWWWW..",  // chin
  // Band shifted right
  "...KKKKKKKKKKKK.",  // band 1
  ".KKKKKKKKKKKKKKK",  // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  // Body — both arms come FORWARD under bundle (arms wrap around, not to sides)
  ".KKKWWWGGWWWKKK.",  // body, arms gone inward (holding bundle)
  "..KWWWGGGGWWWK..",  // belly, arms under bundle
  // Bundle held at belly level, both arms wrapped underneath
  "..KXTTTRTTTXK..",  // arms under bundle (K = paws, T = bundle bottom)
  "..XTTTRRRTTTTX.",  // bundle body main
  "..XTTTRRRTTTX..",  // bundle body lower
  // Legs — left foot stepped FORWARD (left foot at cols 2-5, right foot back cols 10-14)
  "...KKKK...KKKK.",  // legs
  "..KKKKK....KKKK",  // left leg forward (shifted left), right leg back
  ".KKKKKK....KKKK",  // left foot lands (col 1-6), right foot lifts
]);

// === CARRY FRAME 2: Right foot forward, weight slightly left ===
// Body shifted 1px left from neutral. Bundle same position at chest.
const carry2 = n([
  // Head shifted 1px left (weight shift leftward)
  ".KKKK..KKKK.....",  // ear top (shifted left)
  "KKKKK..KKKKK....",  // ear widens
  "KKKKK..KKKKK....",  // ear holds
  ".KKWWWWWWKK.....",  // ear base
  ".WWWWWWWWWWWWWW.",  // head
  "WWWWWWWWWWWWWW..",  // head widest
  // Face shifted left
  "WWWKKKWWKKKWWWW.",  // eye patches
  "WWKKEKWWKEKWWWW.",  // eyes with glint
  "WWWKKKWWKKKWWWW.",  // eye patches
  ".WWWWWKKWWWWWW..",  // nose
  ".WWWWWWWWWWWWW..",  // lower face
  "..WWWWWWWWWWWW..",  // chin
  // Band shifted left
  ".KKKKKKKKKKKK...",  // band 1
  "KKKKKKKKKKKKKKKK",  // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  // Body — arms holding bundle from below
  "KKKWWWGGWWWKKKK.",  // body
  ".KWWWGGGGWWWK...",  // belly, arms under bundle
  // Bundle held at belly level
  ".KXTTTRTTTXK...",  // arms under bundle
  ".XTTTRRRTTTTX..",  // bundle body main
  ".XTTTRRRTTTX...",  // bundle body lower
  // Legs — right foot stepped FORWARD (right foot at cols 10-14, left foot back at cols 2-6)
  "...KKKK...KKKK.",  // legs
  "..KKKK....KKKKK",  // right leg forward (shifted right), left leg back
  "..KKKK....KKKKKK", // right foot lands (col 10-15), left foot lifts
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [carry1, carry2];

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
const outPath = join(outDir, "panda_carry_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): left foot forward — body shifted right, bundle at chest, walk step 1");
console.log("Frame 2 (right): right foot forward — body shifted left, bundle at chest, walk step 2");
