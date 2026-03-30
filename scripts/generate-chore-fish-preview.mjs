#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Standing panda (canonical SWEEP_2 body), rod centered at col 7 (ear gap).
// Frame 1: neutral stance, rod straight through body, calm bobber.
// Frame 2: panda leans LEFT 2px (head through belly), rod shifts with body,
//          feet anchored, smooth transition, bobber dips with splash.

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
  B: [230, 80, 60],       // bobber red
  D: [160, 208, 240],     // splash (light blue-white)
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

// === FISH FRAME 1: Canonical SWEEP_2 body (unshifted), rod at col 7, calm bobber ===
const fish1 = n([
  ".......F........",       // row 0:  rod tip at col 7
  ".......F........",       // row 1:  rod shaft
  ".......F........",       // row 2:  rod shaft
  "...KKKKF.KKKK...",       // row 3:  ears — rod in ear gap
  "..KKKKKF.KKKKK..",       // row 4:  ears widen
  "..KKKKKF.KKKKK..",       // row 5:  ears full
  "...KKWWFWWWKK...",       // row 6:  ear-to-head
  "...WWWWFWWWWWWW.",       // row 7:  head
  "..WWWWWFWWWWWWWW",       // row 8:  head widest
  "..WWWKKFWWKKKWWW",       // row 9:  eye patches
  "..WWKKEFWWKEKWWW",       // row 10: eyes with glint
  "..WWWKKFWWKKKWWW",       // row 11: eye patches lower
  "...WWWWFKKWWWWW.",       // row 12: nose
  "...WWWWFWWWWWWW.",       // row 13: lower face
  "....WWWFWWWWWW..",       // row 14: chin
  "..KKKKWFWKKKKKKK",       // row 15: band — W paws grip rod
  ".KKKKKWFWKKKKKKK",       // row 16: band wide — W paws grip rod
  ".KKKKKWFWWWWKKKK",       // row 17: body top
  ".KKKKWWFGGWWWKKK",       // row 18: belly
  ".KKKKWWFGGGWWKKK",       // row 19: belly wide
  ".KKKKWWFGGGWWKKK",       // row 20: belly wide
  ".KKKKWWFGGWWWKKK",       // row 21: belly narrowing
  "..KKKWWFWWWWKKK.",       // row 22: body to legs
  "...KKKKFWWWKK...",       // row 23: upper legs
  "..KKKK.FKKKK....",       // row 24: legs — rod in gap
  "..KKKK.FKKKK....",       // row 25: legs
  ".KKKKK.FKKKKK...",       // row 26: feet
  ".......F........",       // row 27: rod extends to water
  ".......BB.......",       // row 28: bobber top (cols 7-8)
  "......BBB.......",       // row 29: bobber body (cols 6-8)
]);

// === FISH FRAME 2: Panda leans LEFT 2px, rod shifts to col 5, feet anchored ===
const fish2 = n([
  ".....F..........",       // row 0:  rod tip at col 5 (shifted left 2)
  ".....F..........",       // row 1:  rod shaft
  ".....F..........",       // row 2:  rod shaft
  ".KKKKF.KKKK.....",       // row 3:  ears shifted 2px left
  "KKKKKF.KKKKK....",       // row 4:  ears widen shifted
  "KKKKKF.KKKKK....",       // row 5:  ears full shifted
  ".KKWWFWWWKK.....",       // row 6:  ear-to-head shifted
  ".WWWWFWWWWWWW...",       // row 7:  head shifted
  "WWWWWFWWWWWWWW..",       // row 8:  head widest shifted
  "WWWKKFWWKKKWWW..",       // row 9:  eye patches shifted
  "WWKKEFWWKEKWWW..",       // row 10: eyes shifted
  "WWWKKFWWKKKWWW..",       // row 11: eye patches lower shifted
  ".WWWWFKKWWWWW...",       // row 12: nose shifted
  ".WWWWFWWWWWWW...",       // row 13: lower face shifted
  "..WWWFWWWWWW....",       // row 14: chin shifted
  "KKKKWFWKKKKKKK..",       // row 15: band shifted + grip
  "KKKKWFWKKKKKKK..",       // row 16: band wide shifted + grip
  "KKKKWFWWWWKKKK..",       // row 17: body top shifted
  "KKKWWFGGWWWKKK..",       // row 18: belly shifted
  "KKKWWFGGGWWKKK..",       // row 19: belly wide shifted
  "KKKWWFGGGWWKKK..",       // row 20: belly wide shifted
  "KKKWWFGGWWWKKK..",       // row 21: belly narrowing shifted
  ".KKKWWFWWWWKKK..",       // row 22: transition — shift 1px
  "...KKKKFWWWKK...",       // row 23: anchored
  "..KKKK.FKKKK....",       // row 24: legs anchored
  "..KKKK.FKKKK....",       // row 25: legs anchored
  ".KKKKK.FKKKKK...",       // row 26: feet anchored
  ".......F........",       // row 27: rod to water
  "......DDD.......",       // row 28: splash (cols 6-8)
  ".....DBBBD......",       // row 29: bobber dipped + splash
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
console.log("Frame 1 (left): canonical SWEEP_2 body, rod at col 7, calm bobber, transparent water");
console.log("Frame 2 (right): panda leans left 2px, rod shifts to col 5, feet anchored, bobber dips with splash");
