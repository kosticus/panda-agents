#!/usr/bin/env node
// Generates needs-attention (waving paw + blinking !) preview: 2 frames at 8× scale.
// v9: HORIZONTAL wave motion (side-to-side paw shift), NOT vertical.
// Frame 1: red ! visible, arm extended OUT (rightward) — paw at cols 26-31
// Frame 2: ! gone, arm pulled IN (leftward) — paw at cols 22-27
// Arm spans rows 26-32. Paw shifts 4 cols, forearm 2 cols, shoulder fixed.
// Body anatomy matches canonical BASE_32 template.

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

// === WAVE FRAME 1: ! visible, arm OUT (paw extended rightward) ===
// Arm at rows 23-32, adjacent to face. Paw tip 4K at cols 27-30 (eye level).
// Widens to forearm 5K (cols 26-30), tapers to shoulder 4K (cols 25-28).
// Wave = arm angle changes between frames (steeper OUT, more vertical IN).
const wave1 = n([
  // --- Red ! exclamation (rows 1-8) ---
  "..............RRRR..............",  //  1  ! shaft
  "..............RRRR..............",  //  2
  "..............RRRR..............",  //  3
  "..............RRRR..............",  //  4
  "................................",  //  5  gap
  "................................",  //  6
  "..............RRRR..............",  //  7  ! dot
  "..............RRRR..............",  //  8
  // --- Ears (rows 9-13, BASE_32) ---
  "......KKKK............KKKK......",  //  9
  ".....KKKKKK..........KKKKKK.....",  // 10
  "....KKKKKKKK........KKKKKKKK....",  // 11
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 12
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 13
  // --- Forehead (rows 14-16, BASE_32) ---
  "....KKKKKKKKWWWWWWWWKKKKKKKK....",  // 14
  "....KKKKKKWWWWWWWWWWWWKKKKKK....",  // 15
  ".....KKWWWWWWWWWWWWWWWWWWKK.....",  // 16
  // --- Head (rows 17-20, BASE_32) ---
  "....WWWWWWWWWWWWWWWWWWWWWWWW....",  // 17
  "...WWWWWWWWWWWWWWWWWWWWWWWWWW...",  // 18
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 19
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 20
  // --- Eye patches (rows 21-22, BASE_32 — no arm) ---
  "..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..",  // 21
  "..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..",  // 22
  // --- Eyes + paw tip OUT (rows 23-24, 4K at cols 27-30) ---
  "..WWWWKKKKEEKKWWWWKKEEKKWWWKKKK.",  // 23  3W gap eye-to-arm
  "..WWWWKKKKEEKKWWWWKKEEKKWWWKKKK.",  // 24
  // --- Lower patches + arm OUT (rows 25-26, 5K at cols 26-30) ---
  "..WWWWWWKKKKKKWWWWKKKKKKWWKKKKK.",  // 25  2W gap patch-to-arm
  "..WWWWWWWKKKKKWWWWKKKKKWWWKKKKK.",  // 26  3W gap patch-to-arm
  // --- Nose + forearm OUT (rows 27-28, 5K at cols 26-30) ---
  "...WWWWWWWWWWWKKKKWWWWWWWWKKKKK.",  // 27  8W gap nose-to-arm
  "....WWWWWWWWWWKKKKWWWWWWWWKKKKK.",  // 28
  // --- Chin + upper arm OUT (rows 29-30, 5K at cols 25-29) ---
  "....WWWWWWWWWWWWWWWWWWWWWKKKKK..",  // 29
  ".....WWWWWWWWWWWWWWWWWWWWKKKKK..",  // 30
  // --- Shoulder (rows 31-32, 4K at cols 25-28, FIXED both frames) ---
  "......WWWWWWWWWWWWWWWWWWWKKKK...",  // 31
  "......WWWWWWWWWWWWWWWWWWWKKKK...",  // 32
  // --- Band (rows 33-38, right side extends to col 28 for shoulder) ---
  "....KKKKKKKKKKKKKKKKKKKKKKKKK...",  // 33  25K (cols 4-28)
  "...KKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 34  26K (cols 3-28)
  "..KKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 35  27K (cols 2-28)
  ".KKKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 36  28K (cols 1-28)
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 37  29K (cols 0-28)
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 38  29K
  // --- Body (rows 39-46, right arm raised — no right K) ---
  "KKKKKKKKKWWWWWWWWWWWWWWWWWWW....",  // 39  9K+19W
  "KKKKKKKKWWWWWWWWWWWWWWWWWWWW....",  // 40  8K+20W
  "KKKKKKKKWWWWWWGGGGWWWWWWWWWW....",  // 41
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 42
  "KKKKKKKKWWWWGGGGGGGGWWWWWWWW....",  // 43
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 44
  "KKKKKKKWWWWWWWGGGGWWWWWWWWWW....",  // 45
  "KKKKKKWWWWWWWWWWWWWWWWWWWWWW....",  // 46  6K+22W
  // --- Hips (rows 47-50, BASE_32) ---
  "..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..",  // 47
  "...KKKKKKKKKWWWWWWWWKKKKKKKKK...",  // 48
  "....KKKKKKKKWWWWWWWWKKKKKKKK....",  // 49
  ".....KKKKKKKWWWWWWWWKKKKKKK.....",  // 50
  // --- Legs (rows 51-56, BASE_32) ---
  "......KKKKKKKK....KKKKKKKK......",  // 51
  "......KKKKKKKK....KKKKKKKK......",  // 52
  "......KKKKKKKK....KKKKKKKK......",  // 53
  ".....KKKKKKKKK....KKKKKKKKK.....",  // 54
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 55
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 56
  // --- Padding ---
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
]);

// === WAVE FRAME 2: no !, arm IN (paw pulled leftward toward face) ===
// Same arm rows (23-32). Paw shifts 3 LEFT, forearm 2, upper arm 1, shoulder fixed.
// Arm angle changes from steep-outward to near-vertical — reads as wave.
const wave2 = n([
  // --- No ! (blinked off) ---
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  // --- Ears (rows 9-13, BASE_32) ---
  "......KKKK............KKKK......",  //  9
  ".....KKKKKK..........KKKKKK.....",  // 10
  "....KKKKKKKK........KKKKKKKK....",  // 11
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 12
  "...KKKKKKKKKK......KKKKKKKKKK...",  // 13
  // --- Forehead (rows 14-16) ---
  "....KKKKKKKKWWWWWWWWKKKKKKKK....",  // 14
  "....KKKKKKWWWWWWWWWWWWKKKKKK....",  // 15
  ".....KKWWWWWWWWWWWWWWWWWWKK.....",  // 16
  // --- Head (rows 17-20) ---
  "....WWWWWWWWWWWWWWWWWWWWWWWW....",  // 17
  "...WWWWWWWWWWWWWWWWWWWWWWWWWW...",  // 18
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 19
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",  // 20
  // --- Eye patches (rows 21-22, BASE_32 — no arm) ---
  "..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..",  // 21
  "..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..",  // 22
  // --- Eyes + paw tip IN (rows 23-24, 4K at cols 24-27) ---
  "..WWWWKKKKEEKKWWWWKKEEKKKKKK....",  // 23  adjacent to eye
  "..WWWWKKKKEEKKWWWWKKEEKKKKKK....",  // 24
  // --- Lower patches + arm IN (rows 25-26, 5K at cols 24-28) ---
  "..WWWWWWKKKKKKWWWWKKKKKKKKKKK...",  // 25  patch merges with arm
  "..WWWWWWWKKKKKWWWWKKKKKWKKKKK...",  // 26  1W gap patch-to-arm
  // --- Nose + forearm IN (rows 27-28, 5K at cols 24-28) ---
  "...WWWWWWWWWWWKKKKWWWWWWKKKKK...",  // 27  6W gap nose-to-arm
  "....WWWWWWWWWWKKKKWWWWWWKKKKK...",  // 28
  // --- Chin + upper arm IN (rows 29-30, 5K at cols 24-28) ---
  "....WWWWWWWWWWWWWWWWWWWWKKKKK...",  // 29
  ".....WWWWWWWWWWWWWWWWWWWKKKKK...",  // 30
  // --- Shoulder (rows 31-32, 4K at cols 25-28, same as frame 1) ---
  "......WWWWWWWWWWWWWWWWWWWKKKK...",  // 31
  "......WWWWWWWWWWWWWWWWWWWKKKK...",  // 32
  // --- Band + body + hips + legs (identical to frame 1) ---
  "....KKKKKKKKKKKKKKKKKKKKKKKKK...",  // 33
  "...KKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 34
  "..KKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 35
  ".KKKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 36
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 37
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKKK...",  // 38
  "KKKKKKKKKWWWWWWWWWWWWWWWWWWW....",  // 39
  "KKKKKKKKWWWWWWWWWWWWWWWWWWWW....",  // 40
  "KKKKKKKKWWWWWWGGGGWWWWWWWWWW....",  // 41
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 42
  "KKKKKKKKWWWWGGGGGGGGWWWWWWWW....",  // 43
  "KKKKKKKKWWWWWGGGGGGWWWWWWWWW....",  // 44
  "KKKKKKKWWWWWWWGGGGWWWWWWWWWW....",  // 45
  "KKKKKKWWWWWWWWWWWWWWWWWWWWWW....",  // 46
  "..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..",  // 47
  "...KKKKKKKKKWWWWWWWWKKKKKKKKK...",  // 48
  "....KKKKKKKKWWWWWWWWKKKKKKKK....",  // 49
  ".....KKKKKKKWWWWWWWWKKKKKKK.....",  // 50
  "......KKKKKKKK....KKKKKKKK......",  // 51
  "......KKKKKKKK....KKKKKKKK......",  // 52
  "......KKKKKKKK....KKKKKKKK......",  // 53
  ".....KKKKKKKKK....KKKKKKKKK.....",  // 54
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 55
  "....KKKKKKKKKK....KKKKKKKKKK....",  // 56
  // --- Padding ---
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
console.log("v10: arm adjacent to face, diagonal pivot wave");
console.log("Frame 1 (left): red ! + arm OUT — paw tip at cols 27-30, shoulder at 25-28");
console.log("Frame 2 (right): no ! + arm IN — paw tip at cols 24-27, shoulder at 25-28");
console.log("Arm rows 23-32. Paw shifts 3, forearm 2, upper arm 1, shoulder fixed");
