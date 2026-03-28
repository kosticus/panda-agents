#!/usr/bin/env node
// Generates fishing chore animation preview: 2 frames side by side at 8× scale.
// Both frames seated. Motion: rod angle change + body lean + bobber splash.
// Frame 1: rod angled up at ~45°, body centered, bobber floating (2-3px).
// Frame 2: rod pulled sharply down/back (bite!), body leans back 2px, bobber splashing.
// 5-row ears (drop 1 from canonical) for seated posture.

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

// === FISH FRAME 1: Seated, rod angled up-right ~45°, body centered, bobber floating ===
// Rod extends clearly above head at diagonal. Bobber is 2-3px wide. Water fills 4 rows.
// Layout: 4 rod rows + 5 ears (drop 1) + 6 face + 3 band + 4 body+rod + 2 seated legs + 1 bank + 4 water + 3 empty = 32
const fish1 = n([
  // Rod tip angled up-right — 4 rows (thick 2px rod handle)
  "..............FF",  // rod tip far up-right (2px wide)
  ".............FF.",  // rod shaft
  "............FF..",  // rod continues
  "...........FF...",  // rod base near grip
  // Head — 5-row ears for seated posture (drop 1 ear-hold row)
  "..KKKK..KKKK....",  // ear tops
  ".KKKKK..KKKKK...",  // ear widens
  ".KKKKK..KKKKK...",  // ear holds (keep 1 hold row)
  "..WWWWWWWWWWWW..",  // head wide
  ".WWWWWWWWWWWWWW.",  // head widest
  // Face — 6 rows
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKEKWWKEKWWW.",  // eyes with glint
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  "...WWWWWWWWWW...",  // chin
  // Band — 3 rows
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  // Body — seated, right arm holds rod extending right — 4 rows
  "KKKKKWWWWWWKKKKK",  // body wide (seated spread)
  "KKKKWWWGGWWWKKKK",  // belly
  "KKKKWWGGGGWWKKFF",  // belly, right paw at rod grip (FF = thick rod)
  "KKKKWWWGGWWWKFF.",  // lower body, rod base extends right
  // Legs folded/tucked (seated) — 2 rows
  "..KKKKKKKKKKKK..",  // thick leg block folded
  "..KKKKKKKKKKKK..",  // feet/seat on bank
  // Sandy bank + water (4 rows) with 2-3px bobber floating
  "...PPPPPPPPPP...",  // sandy bank
  "..UUUUUUUUUUUU..",  // water surface
  "..UUUUUUUUBBUUU.",  // water — 2px bobber (BB)
  "..UUUUUUUUUUUU..",  // water depth
]);

// === FISH FRAME 2: Seated, rod pulled sharply back (bite!), body leans back 2px, bobber splashing ===
// Body shifted 2px right (lean back). Rod now angled more steeply / pulled back.
// Bobber submerged with splash pixels around it.
const fish2 = n([
  // Rod tip — pulled back, angled more steeply (being pulled by fish)
  "...............F",  // rod tip (right edge)
  "..............FF",  // rod shaft
  ".............FF.",  // rod continues
  "............FF..",  // rod base near grip
  // Head — same 5-row ears, shifted 2px right (lean back)
  "....KKKK..KKKK..",  // ear tops (shifted 2px right)
  "...KKKKK..KKKKK.",  // ear widens
  "...KKKKK..KKKKK.",  // ear holds
  "....WWWWWWWWWWWW",  // head wide
  "...WWWWWWWWWWWWW",  // head widest
  // Face shifted 2px right (lean back) — 6 rows
  "...WWWKKKWWKKKWW",  // eye patches
  "...WWKKEKWWKEKWW",  // eyes with glint
  "...WWWKKKWWKKKWW",  // eye patches
  "....WWWWWKKWWWWW",  // nose
  "....WWWWWWWWWWWW",  // lower face
  ".....WWWWWWWWWW.",  // chin
  // Band shifted right — 3 rows
  "....KKKKKKKKKKKK",
  "...KKKKKKKKKKKKK",
  "..KKKKKKKKKKKKKK",
  // Body leaned back (shifted 2px right), arm grips rod tightly — 4 rows
  "..KKKKKWWWWWWKKK",  // body (shifted right)
  "..KKKKWWWGGWWWKK",  // belly
  "..KKKKWWGGGGWKFF",  // belly, right paw grips rod tightly
  "..KKKKWWWGGWWKFF",  // lower body, rod base pulled back
  // Legs folded/tucked (still seated, same position as frame 1) — 2 rows
  "..KKKKKKKKKKKK..",  // thick leg block (same position)
  "..KKKKKKKKKKKK..",  // feet on bank
  // Sandy bank + water with splash around submerged bobber — 4 rows
  "...PPPPPPPPPP...",  // sandy bank
  "..UUUUUUUUDUUU..",  // water surface — splash (D) at surface
  "..UUUUUUUDBBUUU.",  // water — bobber partially submerged, splash beside
  "..UUUUUUUDDUUUU.",  // water depth — more splash pixels below
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
console.log("Frame 1 (left): seated, thick rod up-right ~45°, 2px bobber floating in 4-row water");
console.log("Frame 2 (right): seated, rod pulled back (bite!), body leans back 2px, bobber splash");
