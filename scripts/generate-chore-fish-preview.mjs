#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Frame 1: Seated, pole angled up-right, relaxed posture. Compressed head (hunched seated).
//          Bobber visible in water to the right.
// Frame 2: Seated, pole pulled back/down (a bite!), body leans back slightly, line taut.
// Motion signal: pole angle change + body lean back

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

// === FISH FRAME 1: Seated, pole angled up-right, relaxed. Compressed head (hunched seated). ===
// Rod tip goes up-right above head. Body seated low. Bobber in water to right.
const fish1 = n([
  // Rod tip up-right (4 rows above head for pole)
  "..............F.",  // rod tip far up-right
  ".............FF.",  // rod shaft angles down-left
  "............FF..",  // rod continues
  "...........FF...",  // rod base near paw
  // Head — compressed for seated/hunched (2-row ears only)
  "..KKKK..KKKK....",  // ear tops
  "..KKWWWWWWKK....",  // ears compressed into head (no separate ear-widen rows)
  "..WWWWWWWWWWWW..",  // head wide
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face (normal face, but no separate chin row — seated slouch)
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  // Band
  "..KKKKKKKKKKKK..",  // band 1
  ".KKKKKKKKKKKKKKK",  // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  // Body — wide/seated, right arm holds pole (extends right)
  "KKKKKWWWWWWKKKKK",  // body wide (seated spread)
  "KKKKWWWGGWWWKKKK",  // belly
  "KKKKWWGGGGWWKKKF",  // belly, right paw at pole grip
  "KKKKWWWGGWWWKFFF",  // lower body, rod extends right
  // Legs folded/tucked (seated on bank)
  "..KKKKKKKKKKKK..",  // thick leg block folded
  "..KKKKKKKKKKKK..",  // feet/seat on bank
  // Sandy bank + water with bobber
  "...PPPPPPPPPP...",  // sandy bank
  "..UUUUUUUUBUUU..",  // water + bobber (B at col 11 — far right where line ends)
  "..UUUUUUUUUUUU..",  // water depth
]);

// === FISH FRAME 2: Seated, pole pulled back/down (a bite!), body leans back. ===
// Pole now angled steeply down toward water (pulled by fish). Body leans back. Line taut.
const fish2 = n([
  // Rod tip now pulled down-right at steeper angle (bite pulls it)
  "...............F",  // rod tip (still upper right but angled steeper)
  "..............FF",  // rod shaft
  ".............FF.",  // rod continues
  "............FF..",  // rod base near grip, coming down more steeply
  // Head — same compressed (seated) but body leans back (head shifts right slightly)
  "...KKKK..KKKK..",  // ear tops (shifted 1px right — lean back)
  "...KKWWWWWWKK..",  // ears compressed
  "...WWWWWWWWWWWW.",  // head
  "..WWWWWWWWWWWWWW",  // head widest
  // Face (shifted right)
  "..WWWKKKWWKKKWWW",  // eye patches
  "..WWKKEKWWKEKWWW",  // eyes with glint
  "..WWWKKKWWKKKWWW",  // eye patches
  "...WWWWWKKWWWWW.",  // nose
  "...WWWWWWWWWWWW.",  // lower face
  // Band (shifted right — lean back)
  "...KKKKKKKKKKKK.",  // band 1
  "..KKKKKKKKKKKKKKK", // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  // Body — leaning back, right arm pulls rod back, pole angle changed
  ".KKKKWWWWWWKKKKK",  // body (leaned right/back)
  ".KKKWWWGGWWWKKKK",  // belly
  ".KKKWWGGGGWWKKKF",  // belly, right paw grips pole tightly
  ".KKKWWWGGWWWKFFF",  // lower body, rod angles back
  // Legs folded/tucked (still seated)
  "..KKKKKKKKKKKK..",  // thick leg block
  "..KKKKKKKKKKKK..",  // feet on bank
  // Sandy bank + taut line going right into water
  "...PPPPPPPPPP...",  // sandy bank
  "..UUUUUUUUUUUU..",  // water (bobber submerged — fish biting!)
  "..UUUUUUUUUUUU..",  // water depth
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
console.log("Frame 1 (left): seated, pole angled up-right, relaxed — bobber in water");
console.log("Frame 2 (right): seated, pole pulled back/down (a bite!), body leans back");
