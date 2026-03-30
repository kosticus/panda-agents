#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Standing panda (canonical SWEEP_2 body), rod at col 9 (through right ear/body).
// Frame 1: neutral stance, rod straight through body at col 9, calm bobber.
// Frame 2: panda leans LEFT 3px (head through belly), rod CURVES (col 3 tip → 5 ears → 6 body → 9 feet),
//          feet anchored, 3→2→1→0 transition, bobber dips with bigger splash.

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

// === FISH FRAME 1: Canonical SWEEP_2 body (unshifted), rod at col 9, calm bobber ===
const fish1 = n([
  ".........F......",       // row 0:  rod tip at col 9
  ".........F......",       // row 1:  rod shaft
  ".........F......",       // row 2:  rod shaft
  "...KKKK..FKKK...",       // row 3:  ears — rod through right ear
  "..KKKKK..FKKKK..",       // row 4:  ears widen
  "..KKKKK..FKKKK..",       // row 5:  ears full
  "...KKWWWWFWKK...",       // row 6:  ear-to-head
  "...WWWWWWFWWWWW.",       // row 7:  head
  "..WWWWWWWFWWWWWW",       // row 8:  head widest
  "..WWWKKKWFKKKWWW",       // row 9:  eye patches
  "..WWKKEKWFKEKWWW",       // row 10: eyes with glint
  "..WWWKKKWFKKKWWW",       // row 11: eye patches lower
  "...WWWWWKFWWWWW.",       // row 12: nose
  "...WWWWWWFWWWWW.",       // row 13: lower face
  "....WWWWWFWWWW..",       // row 14: chin
  "..KKKKKKWFWKKKKK",       // row 15: band — W paws grip rod
  ".KKKKKKKWFWKKKKK",       // row 16: band wide — W paws grip rod
  ".KKKKKWWWFWWKKKK",       // row 17: body top
  ".KKKKWWWGFWWWKKK",       // row 18: belly
  ".KKKKWWGGFGWWKKK",       // row 19: belly wide
  ".KKKKWWGGFGWWKKK",       // row 20: belly wide
  ".KKKKWWWGFWWWKKK",       // row 21: belly narrowing
  "..KKKWWWWFWWKKK.",       // row 22: body to legs
  "...KKKKWWFWKK...",       // row 23: upper legs
  "..KKKK..KFKK....",       // row 24: legs — rod through right leg
  "..KKKK..KFKK....",       // row 25: legs
  ".KKKKK..KFKKK...",       // row 26: feet
  ".........F......",       // row 27: rod extends to water
  ".........BB.....",       // row 28: bobber top (cols 9-10)
  "........BBB.....",       // row 29: bobber body (cols 8-10)
]);

// === FISH FRAME 2: Panda leans LEFT 3px, rod CURVES — tip col 3→4, ears col 5, body col 6, feet anchored col 9 ===
const fish2 = n([
  "...F............",       // row 0:  rod tip at col 3 (curved — most lean)
  "....F...........",       // row 1:  rod shaft at col 4 (curved)
  "....F...........",       // row 2:  rod shaft at col 4 (curved)
  "KKKK.F.KKK......",       // row 3:  ears shifted — rod at col 5 (curved)
  "KKKK.F.KKKK.....",       // row 4:  ears widen — rod at col 5 (curved)
  "KKKK.F.KKKK.....",       // row 5:  ears full — rod at col 5 (curved)
  "KKWWWWFWKK......",       // row 6:  ear-to-head shifted — rod at col 6
  "WWWWWWFWWWWW....",       // row 7:  head shifted — rod at col 6
  "WWWWWWFWWWWWW...",       // row 8:  head widest shifted — rod at col 6
  "WWKKKWFKKKWWW...",       // row 9:  eye patches shifted — rod at col 6
  "WKKEKWFKEKWWW...",       // row 10: eyes shifted — rod at col 6
  "WWKKKWFKKKWWW...",       // row 11: eye patches lower — rod at col 6
  "WWWWWKFWWWWW....",       // row 12: nose shifted — rod at col 6
  "WWWWWWFWWWWW....",       // row 13: lower face shifted — rod at col 6
  ".WWWWWFWWWW.....",       // row 14: chin shifted — rod at col 6
  "KKKKKWFWKKKKK...",       // row 15: band shifted + grip — rod at col 6
  "KKKKKWFWKKKKK...",       // row 16: band wide shifted + grip — rod at col 6
  "KKKWWWFWWKKKK...",       // row 17: body top shifted — rod at col 6
  "KKWWWGFWWWKKK...",       // row 18: belly shifted — rod at col 6
  "KKWWGGFGWWKKK...",       // row 19: belly wide shifted — rod at col 6
  "KKWWGGFGWWKKK...",       // row 20: belly wide shifted — rod at col 6
  "KKWWWGFWWWKKK...",       // row 21: belly narrowing — rod at col 6
  "KKKWWWWFWWKKK...",       // row 22: transition — rod at col 7
  "..KKKKWWFWKK....",       // row 23: transition — rod at col 8
  "..KKKK..KFKK....",       // row 24: legs anchored — rod at col 9
  "..KKKK..KFKK....",       // row 25: legs anchored — rod at col 9
  ".KKKKK..KFKKK...",       // row 26: feet anchored — rod at col 9
  ".........F......",       // row 27: rod into water at col 9
  ".......DDDDD....",       // row 28: splash wider (cols 7-11)
  "......DBBBBBD...",       // row 29: bobber dipped in splash (cols 6-12)
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
console.log("Frame 1 (left): canonical SWEEP_2 body, rod at col 9, calm bobber");
console.log("Frame 2 (right): panda leans left 3px, rod shifts to col 6, feet anchored, bigger splash");
