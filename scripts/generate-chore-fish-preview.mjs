#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Standing panda facing viewer, rod held with visible paw grip at band area.
// Frame 1: relaxed standing, rod at col 7, W paw pads flanking rod, bobber floating.
// Frame 2: lean-back tug — upper body+rod shift right 2px, legs anchored, rod bends, bobber dips with splash.

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
  U: [60, 130, 200],      // water blue
  B: [230, 80, 60],       // bobber red
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

// === FISH FRAME 1: Relaxed standing, rod at col 7, visible paw grip, bobber floating ===
// Rod at col 7 throughout — passes between ears, in front of face/body, between legs.
// W paw pads flank rod at band area (rows 15-17) for visible grip.
// 3 rod + 3 ears + 1 ear-head + 2 head + 3 face + 1 nose + 1 lower face + 1 chin
//   + 3 grip/body-top + 3 belly + 1 narrowing + 2 legs + 6 water = 30 (+2 pad from n())
const fish1 = n([
  // Rod above head
  ".......F........",        // row 0: rod tip at col 7
  ".......F........",        // row 1: rod shaft
  ".......F........",        // row 2: rod shaft
  // Ears — 3 rows, rod passes through ear gap at col 7
  "..KKKK.FKKKK....",       // row 3: ear tops, rod in gap
  ".KKKKK.FKKKKK...",       // row 4: ears widen
  ".KKKKK.FKKKKK...",       // row 5: ears full
  // Ear-to-head transition
  "..KKWWWFWWKK....",       // row 6: ear base merging to head
  // Head — 2 rows
  "..WWWWWFWWWWWW..",       // row 7: head
  ".WWWWWWFWWWWWWW.",       // row 8: head widest
  // Face — 3 rows (eye patches + eyes)
  ".WWWKKKFWKKKWWW.",       // row 9: eye patches
  ".WWKKEKFWKEKWWW.",       // row 10: eyes with glint
  ".WWWKKKFWKKKWWW.",       // row 11: eye patches
  // Nose, lower face, chin
  "..WWWWWFKWWWWW..",       // row 12: nose (K at col 8)
  "..WWWWWFWWWWWW..",       // row 13: lower face
  "...WWWWFWWWWW...",       // row 14: chin
  // Paw grip + body top — W pads visible flanking rod
  "..KKKWWFWWKKKK..",       // row 15: paw grip upper (W pads at cols 5-6, 8-9)
  ".KKKKWWFWWKKKKK.",       // row 16: paw grip lower
  "KKKKKWWFWWKKKKKK",       // row 17: body top, grip continues
  // Belly — 3 rows
  "KKKKWWWFGWWWKKKK",       // row 18: belly
  "KKKKWWGFGGWWKKKK",       // row 19: belly wide
  "KKKKWWWFGWWWKKKK",       // row 20: belly lower
  // Body narrowing + legs
  ".KKKKKWFWWKKKK..",       // row 21: body narrowing
  "...KKKKF.KKKK...",       // row 22: legs (rod between legs)
  "..KKKKKF.KKKKK..",       // row 23: feet
  // Water with floating bobber — calm
  "UUUUUUUFUUUUUUUU",       // row 24: water surface, rod entering
  "UUUUUUUFUUUUUUUU",       // row 25: water, rod continues
  "UUUUUUUBUUUUUUUU",       // row 26: bobber top (B at col 7)
  "UUUUUUBBBUUUUUUU",       // row 27: bobber body (B at cols 6-8)
  "UUUUUUUUUUUUUUUU",       // row 28: water
  "UUUUUUUUUUUUUUUU",       // row 29: water bottom
]);

// === FISH FRAME 2: Lean-back tug — body+rod shift right 2px, legs anchored, rod bends ===
// Upper body (rows 0-21) shifts right 2px: rod moves from col 7 to col 9.
// Legs (rows 22-23) stay anchored at original position — rod at col 7 creates visible bend.
// Paw grip (W pads) shifts with body. Bobber dips with D splash ring.
const fish2 = n([
  // Rod above head — shifted right 2px
  ".........F......",        // row 0: rod tip at col 9
  ".........F......",        // row 1: rod shaft
  ".........F......",        // row 2: rod shaft
  // Ears — shifted right 2px
  "....KKKK.FKKKK..",       // row 3: ear tops
  "...KKKKK.FKKKKK.",       // row 4: ears widen
  "...KKKKK.FKKKKK.",       // row 5: ears full
  // Head — shifted right 2px
  "....KKWWWFWWKK..",       // row 6: ear base
  "....WWWWWFWWWWWW",       // row 7: head (right edge clipped)
  "...WWWWWWFWWWWWW",       // row 8: head widest (right edge clipped)
  // Face — shifted right 2px
  "...WWWKKKFWKKKWW",       // row 9: eye patches
  "...WWKKEKFWKEKWW",       // row 10: eyes
  "...WWWKKKFWKKKWW",       // row 11: eye patches
  // Nose, lower face, chin — shifted right 2px
  "....WWWWWFKWWWWW",       // row 12: nose
  "....WWWWWFWWWWWW",       // row 13: lower face
  ".....WWWWFWWWWW.",       // row 14: chin
  // Paw grip — shifted right 2px, W pads still visible
  "....KKKWWFWWKKKK",       // row 15: paw grip upper
  "...KKKKWWFWWKKKK",       // row 16: paw grip lower
  "..KKKKKWWFWWKKKK",       // row 17: body top, grip continues
  // Belly — shifted right 2px
  "..KKKKWWWFGWWWKK",       // row 18: belly
  "..KKKKWWGFGGWWKK",       // row 19: belly wide
  "..KKKKWWWFGWWWKK",       // row 20: belly lower
  // Body narrowing — shifted, rod at col 9
  "...KKKKKWFWWKKKK",       // row 21: body narrowing (rod at col 9)
  // Legs — ANCHORED at frame 1 position (rod at col 7 = visible rod bend)
  "...KKKKF.KKKK...",       // row 22: legs (rod at col 7)
  "..KKKKKF.KKKKK..",       // row 23: feet (rod at col 7)
  // Water with splash — bobber dipped
  "UUUUUUUFUUUUUUUU",       // row 24: water surface, line at col 7
  "UUUUUUUFUUUUUUUU",       // row 25: water
  "UUUUUUDDDUUUUUUU",       // row 26: splash ring top (D at cols 6-8)
  "UUUUUDBBBDUUUUUU",       // row 27: bobber dipped + splash (D@5, B@6-8, D@9)
  "UUUUUUDDDUUUUUUU",       // row 28: splash ring bottom (D at cols 6-8)
  "UUUUUUUUUUUUUUUU",       // row 29: deep water
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
console.log("Frame 1 (left): relaxed standing, rod col 7, visible paw grip, bobber floating");
console.log("Frame 2 (right): lean-back tug, body+rod shifted right 2px, legs anchored, bobber dipped");
