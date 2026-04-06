#!/usr/bin/env node
// Generates needs-attention (waving paw + blinking !) preview: 2 frames at 8× scale.
// Frame 1: red ! visible, right paw raised high (head level)
// Frame 2: ! gone, right paw pulled inward (side-to-side wave)
// Body anatomy matches canonical BASE_32 template. Arm extends to the right.

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

const FRAME_W = 32;
const FRAME_H = 64;
const EMPTY = "................................";

function n(frame) {
  while (frame.length < FRAME_H) frame.push(EMPTY);
  return frame.map(row => {
    if (row.length < FRAME_W) return row + ".".repeat(FRAME_W - row.length);
    if (row.length > FRAME_W) return row.slice(0, FRAME_W);
    return row;
  });
}

// === WAVE FRAME 1: ! visible, paw raised to head level ===
// Red ! above head. Right arm extends outward with paw at face level.
// Body/head anatomy matches canonical BASE_32 template.
const wave1 = n([
  // --- Red ! exclamation (rows 1-8) ---
  "............RRRR................",  //  1  ! shaft
  "............RRRR................",  //  2  ! shaft
  "............RRRR................",  //  3  ! shaft
  "............RRRR................",  //  4  ! shaft
  "................................",  //  5  gap
  "................................",  //  6  gap
  "............RRRR................",  //  7  ! dot
  "............RRRR................",  //  8  ! dot
  // --- Ears (5 rows — BASE_32 anatomy) ---
  "......KKKK............KKKK......",  //  9  4px dome tip
  ".....KKKKKK..........KKKKKK.....",  // 10  6px
  "....KKKKKKKK........KKKKKKKK....",  // 11  8px
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 12  10px (max)
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 13  10px
  // --- Forehead (3 rows — BASE_32) ---
  "....KKKKKKKKWWWWWWWWKKKKKKKK....",  // 14  ear-head bridge
  "....KKKKKKWWWWWWWWWWWWKKKKKK....",  // 15  20px
  ".....KKWWWWWWWWWWWWWWWWWWKK.....",  // 16  22px
  // --- Head (4 rows — BASE_32) ---
  "....WWWWWWWWWWWWWWWWWWWWWWWW....",  // 17  24px
  "...WWWWWWWWWWWWWWWWWWWWWWWWWW...",  // 18  26px
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 19  28px
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 20  28px
  // --- Face: eye patches top (2 rows — BASE_32) ---
  "..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..",  // 21  rounded top (5K)
  "..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..",  // 22  full patch (6K)
  // --- Eyes + paw tip (rows 23-24) ---
  "..WWWWKKKKEEKKWWWWKKEEKKWWWW....",  // 23  eyes — light right trim
  "..WWWWKKKKEEKKWWWWKKEEKKWW..KKKK",  // 24  eyes + paw tip 4K (28-31)
  // --- Eye patches bottom + big rounded paw (2 rows) ---
  "..WWWWWWKKKKKKWWWWKKKKKKW.KKKKKK",  // 25  patch(6K) + paw 6K (26-31)
  "..WWWWWWWKKKKKWWWWKKKKK.KKKKKKKK",  // 26  patch(5K) + paw 8K (24-31)
  // --- Muzzle + paw tapering to thick forearm (6 rows) ---
  "...WWWWWWWWWWWKKKKWWWWW.KKKKKKKK",  // 27  nose + paw 8K (24-31)
  "....WWWWWWWWWWKKKKWWWWWW.KKKKKKK",  // 28  nose + paw 7K (25-31)
  "....WWWWWWWWWWWWWWWWWWWWW.KKKKKK",  // 29  face + forearm 6K (26-31)
  ".....WWWWWWWWWWWWWWWWWWWW.KKKKKK",  // 30  face + forearm 6K (26-31)
  "......WWWWWWWWWWWWWWWWWWW.KKKKKK",  // 31  chin + forearm 6K (26-31)
  "......WWWWWWWWWWWWWWWWWWW.KKKKKK",  // 32  chin + forearm 6K (26-31)
  // --- Band (6 rows — right side open, arm is away) ---
  "....KKKKKKKKKKKKKKKKKKKKKKKK....",  // 33  24K
  "...KKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 34  26K
  "..KKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 35  28K (right 2 less)
  ".KKKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 36  27K (right open)
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 37  28K (right open)
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 38  28K (right open)
  // --- Body (12 rows — right arm absent, no K on right) ---
  "KKKKKKKKKWWWWWWWWWWWWWWWWWWW....",  // 39  shoulder (9K + W to right)
  "KKKKKKKKWWWWWWWWWWWWWWWWWWWW....",  // 40  shoulder (8K + W to right)
  "KKKKKKKKWWWWWWGGGGWWWWWWWWWW....",  // 41  chest
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 42  belly gradient
  "KKKKKKKKWWWWGGGGGGGGWWWWWWWW....",  // 43  belly max
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 44  belly taper
  "KKKKKKKWWWWWWWGGGGWWWWWWWWWW....",  // 45  arm taper
  "KKKKKKWWWWWWWWWWWWWWWWWWWWWW....",  // 46  wrist — white break
  "..KKKKKKKKKKWWWWWWWWKKKKKK......",  // 47  hips
  "...KKKKKKKKKWWWWWWWWKKKKK.......",  // 48  hips taper
  "....KKKKKKKKWWWWWWWWKKKK........",  // 49  taper
  ".....KKKKKKKWWWWWWWWKKK.........",  // 50  taper
  // --- Legs (6 rows) ---
  "......KKKKKKKK....KKKKKKKK......",  // 51  8px per leg
  "......KKKKKKKK....KKKKKKKK......",  // 52  8px
  "......KKKKKKKK....KKKKKKKK......",  // 53  8px
  ".....KKKKKKKKK....KKKKKKKKK.....",  // 54  9px smooth step
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 55  10px feet
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 56  10px feet
  // --- Padding (8 rows) ---
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
]);

// === WAVE FRAME 2: no !, paw pulled inward (side-to-side wave) ===
// ! gone (blink). Paw stays at head level but swings closer to body.
const wave2 = n([
  // --- No ! (blinked off) — 8 rows padding ---
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  // --- Ears (5 rows — BASE_32 anatomy) ---
  "......KKKK............KKKK......",  //  9  4px dome tip
  ".....KKKKKK..........KKKKKK.....",  // 10  6px
  "....KKKKKKKK........KKKKKKKK....",  // 11  8px
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 12  10px (max)
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 13  10px
  // --- Forehead (3 rows — BASE_32) ---
  "....KKKKKKKKWWWWWWWWKKKKKKKK....",  // 14  ear-head bridge
  "....KKKKKKWWWWWWWWWWWWKKKKKK....",  // 15  20px
  ".....KKWWWWWWWWWWWWWWWWWWKK.....",  // 16  22px
  // --- Head (4 rows — BASE_32) ---
  "....WWWWWWWWWWWWWWWWWWWWWWWW....",  // 17  24px
  "...WWWWWWWWWWWWWWWWWWWWWWWWWW...",  // 18  26px
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 19  28px
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 20  28px
  // --- Face: eye patches top (2 rows — BASE_32) ---
  "..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..",  // 21  rounded top (5K)
  "..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..",  // 22  full patch (6K)
  // --- Eyes + paw tip pulled in (rows 23-24) ---
  "..WWWWKKKKEEKKWWWWKKEEKKWWWW....",  // 23  eyes — light right trim
  "..WWWWKKKKEEKKWWWWKKEEKKW.KKKK..",  // 24  eyes + paw tip 4K (26-29)
  // --- Eye patches bottom + big rounded paw pulled in (2 rows) ---
  "..WWWWWWKKKKKKWWWWKKKKK.KKKKKK..",  // 25  patch(5K) + paw 6K (24-29)
  "..WWWWWWWKKKKKWWWWKKKK.KKKKKKK..",  // 26  patch(4K) + paw 7K (23-29)
  // --- Muzzle + paw tapering to thick forearm — pulled in (6 rows) ---
  "...WWWWWWWWWWWKKKKWWWW.KKKKKKK..",  // 27  nose + paw 7K (23-29)
  "....WWWWWWWWWWKKKKWWWWW.KKKKKK..",  // 28  nose + paw 6K (24-29)
  "....WWWWWWWWWWWWWWWWWWWW.KKKKK..",  // 29  face + forearm 5K (25-29)
  ".....WWWWWWWWWWWWWWWWWWW.KKKKK..",  // 30  face + forearm 5K (25-29)
  "......WWWWWWWWWWWWWWWWWW.KKKKK..",  // 31  chin + forearm 5K (25-29)
  "......WWWWWWWWWWWWWWWWWW.KKKKK..",  // 32  chin + forearm 5K (25-29)
  // --- Band (6 rows — right side open) ---
  "....KKKKKKKKKKKKKKKKKKKKKKKK....",  // 33  24K
  "...KKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 34  26K
  "..KKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 35  28K (right 2 less)
  ".KKKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 36  27K (right open)
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 37  28K (right open)
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKK....",  // 38  28K (right open)
  // --- Body (12 rows — right arm absent) ---
  "KKKKKKKKKWWWWWWWWWWWWWWWWWWW....",  // 39  shoulder
  "KKKKKKKKWWWWWWWWWWWWWWWWWWWW....",  // 40  shoulder
  "KKKKKKKKWWWWWWGGGGWWWWWWWWWW....",  // 41  chest
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 42  belly gradient
  "KKKKKKKKWWWWGGGGGGGGWWWWWWWW....",  // 43  belly max
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 44  belly taper
  "KKKKKKKWWWWWWWGGGGWWWWWWWWWW....",  // 45  arm taper
  "KKKKKKWWWWWWWWWWWWWWWWWWWWWW....",  // 46  wrist — white break
  "..KKKKKKKKKKWWWWWWWWKKKKKK......",  // 47  hips
  "...KKKKKKKKKWWWWWWWWKKKKK.......",  // 48  hips taper
  "....KKKKKKKKWWWWWWWWKKKK........",  // 49  taper
  ".....KKKKKKKWWWWWWWWKKK.........",  // 50  taper
  // --- Legs (6 rows) ---
  "......KKKKKKKK....KKKKKKKK......",  // 51  8px per leg
  "......KKKKKKKK....KKKKKKKK......",  // 52  8px
  "......KKKKKKKK....KKKKKKKK......",  // 53  8px
  ".....KKKKKKKKK....KKKKKKKKK.....",  // 54  9px smooth step
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 55  10px feet
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 56  10px feet
  // --- Padding (8 rows) ---
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
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
const outPath = join(outDir, "panda_attention_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Frame 1 (left): red ! visible + paw raised to head level (right side)");
console.log("Frame 2 (right): ! gone (blink) + paw pulled inward (right side)");
