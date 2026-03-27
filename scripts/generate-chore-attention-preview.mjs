#!/usr/bin/env node
// Generates needs-attention (waving paw + blinking !) preview: 2 frames at 8× scale.
// Frame 1: red ! visible, right paw raised high (head level)
// Frame 2: ! gone, right paw dropped to waist
// Body stays centered. Arm extends to the right with clear gap from body.

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
  R: [230, 50, 50],       // red ! mark
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

// === WAVE FRAME 1: ! visible, paw raised to head level ===
// ! on the left above head. Arm on the right, thick, separated from body.
const wave1 = n([
  // Red ! (slightly left of center)
  "......RR........",  // ! top
  "......RR........",  // ! shaft
  "......RR........",  // ! shaft
  "................",  // gap
  "......RR........",  // ! dot
  // Head (normal centered position)
  "..KKKK..KKKK....",  // ear top
  ".KKKKK..KKKKK...",  // ear widens
  ".KKKKK..KKKKK...",  // ear holds
  "..KKWWWWWWKK....",  // ear base
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face — paw raised to face level on right
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWW..",  // eyes (right side cut short for arm)
  ".WWWKKKWWKKKW.KK",  // eye patches + arm (KK at cols 14-15)
  "..WWWWWKKWWWW.KK",  // nose + arm
  "..WWWWWWWWWWWKKK",  // lower face + paw (KKK thick)
  "...WWWWWWWWW.KKK",  // chin + paw waving (KKK)
  // Band — right side thin (arm has left the body)
  "..KKKKKKKKKKKK..",  // band 1
  ".KKKKKKKKKKKKK..",  // band 2 (no K at far right)
  "KKKKKKKKKKKKKK..",  // band 3
  // Body — no K on right side (arm is out waving)
  "KKKKWWWGGWWWWW..",  // body (white to right edge)
  "KKKKWWGGGGWWWW..",  // belly
  ".KKKWWGGGGWWW...",  // belly narrows
  "..KKWWWGGWWW....",  // body narrows
  "..WWWWWWWWWW....",  // hips
  // Legs
  "...KKKK..KKKK...",  // legs
  "...KKKK..KKKK...",  // legs
  "..KKKKK..KKKKK..",  // feet
]);

// === WAVE FRAME 2: no !, paw pulled inward (same height, side-to-side wave) ===
// ! gone (blink). Paw stays at head level but swings closer to body.
const wave2 = n([
  // No ! (blinked off)
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  // Head (normal)
  "..KKKK..KKKK....",  // ear top
  ".KKKKK..KKKKK...",  // ear widens
  ".KKKKK..KKKKK...",  // ear holds
  "..KKWWWWWWKK....",  // ear base
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face — paw at same height but pulled in (cols 12-14 instead of 14-15)
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWW..",  // eyes (right trimmed for arm)
  ".WWWKKKWWKKKKK..",  // eye patches + arm pulled in (KK at cols 12-13)
  "..WWWWWKKWWWKK..",  // nose + arm
  "..WWWWWWWWWKKK..",  // lower face + paw in (KKK at cols 11-13)
  "...WWWWWWWW.KKK.",  // chin + paw
  // Band
  "..KKKKKKKKKKKK..",  // band 1
  ".KKKKKKKKKKKKK..",  // band 2
  "KKKKKKKKKKKKKK..",  // band 3
  // Body — no K on right (arm is still raised, just closer)
  "KKKKWWWGGWWWWW..",  // body
  "KKKKWWGGGGWWWW..",  // belly
  ".KKKWWGGGGWWW...",  // belly narrows
  "..KKWWWGGWWW....",  // body narrows
  "..WWWWWWWWWW....",  // hips
  // Legs
  "...KKKK..KKKK...",  // legs
  "...KKKK..KKKK...",  // legs
  "..KKKKK..KKKKK..",  // feet
]);

// === Render: 2 frames side by side ===
const COLS = 2;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H;
const frames = [wave1, wave2];

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
const outPath = join(outDir, "panda_attention_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): red ! visible + paw raised to head level (right side)");
console.log("Frame 2 (right): ! gone (blink) + paw dropped to waist (right side)");
