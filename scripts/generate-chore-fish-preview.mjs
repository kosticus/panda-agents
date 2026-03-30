#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Standing panda facing viewer, rod held off-center at col 4 (left side).
// Frame 1: relaxed standing, left arm grips rod, bobber floating on transparent water.
// Frame 2: rod tip bows 1px left, bobber dips with splash ring, body identical.

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
  U: [70, 120, 170],      // water blue (unused in frames, kept for palette compat)
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

// === FISH FRAME 1: Relaxed standing, rod at col 4, asymmetric left-arm grip, bobber floating ===
// Rod at col 4 throughout — left arm extends from body to grip it.
// Transparent water rows (. background) let ground tiles show through.
// Only B (bobber) and D (splash) rendered on transparent water area.
const fish1 = n([
  // Rod above head
  "....F...........",        // row 0: rod tip at col 4
  "....F...........",        // row 1: rod shaft
  "....F...........",        // row 2: rod shaft
  // Ears — left ear wraps around rod at col 4
  "....FKK..KKKK...",       // row 3: left ear split by rod, right ear normal
  "..KKFKK..KKKKK..",       // row 4: left ear around rod, ears widen
  "..KKFKK..KKKKK..",       // row 5: ears full
  // Ear-to-head transition
  "....FKWWWWWWKK..",       // row 6: ear base merging to head
  // Head
  "....FWWWWWWWWWW.",       // row 7: head
  "....FWWWWWWWWWWW",       // row 8: head widest
  // Face — eye patches + eyes
  "....FWWKKKWKKKWW",       // row 9: eye patches
  "....FWKKEKWKEKWW",       // row 10: eyes with glint
  "....FWWKKKWKKKWW",       // row 11: eye patches lower
  // Nose, lower face, chin
  "....FWWWWKKWWWWW",       // row 12: nose
  "....FWWWWWWWWWW.",       // row 13: lower face
  "....FWWWWWWWWW..",       // row 14: chin
  // Band — left arm extends to rod (grip area)
  ".KKKFKKKKKKKKKK.",       // row 15: band — arm reaches rod
  "KKKKFKKKKKKKKKKK",       // row 16: band wide — grip continues
  ".KKKFKKKKKKKKK..",       // row 17: grip — paw at rod, body right
  // Belly — arm at rod, body with G
  "..KKFWWWGGWWKKK.",       // row 18: belly top
  "..KKFWWGGGWWKKKK",       // row 19: belly
  "..KKFWWGGGWWKKKK",       // row 20: belly widest
  // Body narrowing + legs
  "...KFKWWWWWKKKK.",       // row 21: body narrowing
  "...KFKK..KKKK...",       // row 22: legs
  "..KKFKK..KKKKK..",       // row 23: feet
  // Water area — transparent with bobber
  "....F...........",       // row 24: rod extends into water
  "....F...........",       // row 25: rod continues
  "....B...........",       // row 26: bobber top (B at col 4)
  "...BBB..........",       // row 27: bobber body (B at cols 3-5)
  "................",       // row 28: transparent
  "................",       // row 29: transparent
]);

// === FISH FRAME 2: Rod tip bows 1px left, bobber dips with splash, body identical ===
// Row 0: rod tip shifts to col 3 (bow from fish tug). Rows 1-2 stay at col 4.
// Body rows 3-23 are IDENTICAL to frame 1 (no body shift).
// Bobber dips 1 row with D splash ring around it.
const fish2 = n([
  // Rod tip bowed left
  "...F............",        // row 0: tip at col 3 (bowed 1px left)
  "....F...........",        // row 1: rod back to col 4
  "....F...........",        // row 2: rod shaft
  // Ears — identical to frame 1
  "....FKK..KKKK...",       // row 3: left ear split by rod
  "..KKFKK..KKKKK..",       // row 4: left ear around rod, ears widen
  "..KKFKK..KKKKK..",       // row 5: ears full
  // Head — identical
  "....FKWWWWWWKK..",       // row 6: ear base
  "....FWWWWWWWWWW.",       // row 7: head
  "....FWWWWWWWWWWW",       // row 8: head widest
  // Face — identical
  "....FWWKKKWKKKWW",       // row 9: eye patches
  "....FWKKEKWKEKWW",       // row 10: eyes
  "....FWWKKKWKKKWW",       // row 11: eye patches lower
  // Nose, lower face, chin — identical
  "....FWWWWKKWWWWW",       // row 12: nose
  "....FWWWWWWWWWW.",       // row 13: lower face
  "....FWWWWWWWWW..",       // row 14: chin
  // Band — identical
  ".KKKFKKKKKKKKKK.",       // row 15: band
  "KKKKFKKKKKKKKKKK",       // row 16: band wide
  ".KKKFKKKKKKKKK..",       // row 17: grip
  // Belly — identical
  "..KKFWWWGGWWKKK.",       // row 18: belly top
  "..KKFWWGGGWWKKKK",       // row 19: belly
  "..KKFWWGGGWWKKKK",       // row 20: belly widest
  // Body narrowing + legs — identical
  "...KFKWWWWWKKKK.",       // row 21: body narrowing
  "...KFKK..KKKK...",       // row 22: legs
  "..KKFKK..KKKKK..",       // row 23: feet
  // Water area — bobber dipped with splash
  "....F...........",       // row 24: rod extends down
  "....F...........",       // row 25: rod continues
  "...DDD..........",       // row 26: splash ring top
  "..DBBBD.........",       // row 27: bobber dipped + splash flanks
  "...DDD..........",       // row 28: splash ring bottom
  "................",       // row 29: transparent
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
console.log("Frame 1 (left): relaxed standing, rod col 4, left arm grips rod, bobber floating, transparent water");
console.log("Frame 2 (right): rod tip bows 1px left, bobber dips with splash, body identical, transparent water");
