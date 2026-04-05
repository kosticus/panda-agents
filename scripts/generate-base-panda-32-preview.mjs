#!/usr/bin/env node
// Generates the canonical 32×64 base panda template at 8× scale.
// Hand-refined from pixel-doubled 16×32 source (generate-panda-sheets.mjs).
//
// Refinements from mechanical doubling:
//   - Ears: 5-row dome (4→6→8→10→10) — round, symmetric, centered
//   - Head: smooth oval progression (20→22→24→26→28)
//   - Eye patches: rounded top/bottom corners (5K vs 6K)
//   - Jaw: gradual taper (26→24→24→22→20→20)
//   - Band: smooth progression (24→26→28→30→32→32)
//   - Belly: smooth G gradient (4G→6G→8G→6G→4G)
//   - Arms: 8K sides, wrist taper 7K→6K at row 45–46 (white break), compact torso
//   - Body taper: smooth narrowing (30→28→26→24→22)
//   - Feet: smooth widening (8→8→8→9→10→10)

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
};

const FRAME_W = 32;
const FRAME_H = 64;
const E = '................................';

// ---------------------------------------------------------------------------
// Canonical 32×64 down-facing idle panda — hand-refined
// ---------------------------------------------------------------------------
// Rows marked [R] differ from mechanical pixel-doubling.
// Ears centered on cols ~7.5 and ~23.5 (symmetric about body center 15.5).
const BASE_32 = [
  // --- Padding (8 rows: accessory header space) ---
  E,                                                //  1
  E,                                                //  2
  E,                                                //  3
  E,                                                //  4
  E,                                                //  5
  E,                                                //  6
  E,                                                //  7
  E,                                                //  8

  // --- Ears (5 rows — round dome: 4→6→8→10→10px per ear, centered) ---
  '......KKKK............KKKK......',               //  9 [R] 4px dome tip
  '.....KKKKKK..........KKKKKK.....',               // 10 [R] 6px
  '....KKKKKKKK........KKKKKKKK....',               // 11 [R] 8px
  '...KKKKKKKKKK......KKKKKKKKKK...',               // 12 [R] 10px (max)
  '...KKKKKKKKKK......KKKKKKKKKK...',               // 13     10px

  // --- Forehead (3 rows — centered, smooth ear-to-head transition) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',               // 14 [R] ear-head bridge (8K+8W+8K)
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',               // 15 [R] 20px (4K+12W+4K)
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',               // 16 [R] 22px (2K+18W+2K)

  // --- Head (4 rows — smooth oval, centered) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',               // 17 [R] 24px
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',               // 18 [R] 26px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',               // 19     28px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',               // 20     28px

  // --- Face: eye patches (6 rows — rounded corners) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',               // 21 [R] rounded top (5K)
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',               // 22     full patch (6K)
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',               // 23     eyes + glint
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',               // 24     eyes + glint
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',               // 25     full patch (6K)
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',               // 26 [R] rounded bottom (5K)

  // --- Muzzle / Chin / Jaw (6 rows) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',               // 27 [R] 26px (nose K)
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',               // 28     24px (nose K)
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',               // 29     24px
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',               // 30 [R] 22px
  '......WWWWWWWWWWWWWWWWWWWW......',               // 31     20px
  '......WWWWWWWWWWWWWWWWWWWW......',               // 32     20px

  // --- Band (6 rows — smooth: 24→26→28→30→32→32) ---
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',               // 33     24K
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',               // 34 [R] 26K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',               // 35 [R] 28K
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',               // 36 [R] 30K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',               // 37     32K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',               // 38     32K

  // --- Body (12 rows — compact arms + wrist detail) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',               // 39 [R] shoulder (9K+14W+9K)
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',               // 40 [R] shoulder (8K+16W+8K)
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',               // 41     chest (8K+6W+4G+6W+8K)
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',               // 42 [R] gradient (8K+5W+6G+5W+8K)
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',               // 43     belly (8K+4W+8G+4W+8K)
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',               // 44     belly taper (8K+5W+6G+5W+8K)
  'KKKKKKKWWWWWWWGGGGWWWWWWWKKKKKKK',               // 45 [R] arm taper (7K+7W+4G+7W+7K)
  'KKKKKKWWWWWWWWWWWWWWWWWWWWKKKKKK',               // 46 [R] wrist — white break (6K+20W+6K)
  '..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..',               // 47 [R] hips (10K+8W+10K, 28px)
  '...KKKKKKKKKWWWWWWWWKKKKKKKKK...',               // 48 [R] taper (9K+8W+9K, 26px)
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',               // 49     taper (8K+8W+8K, 24px)
  '.....KKKKKKKWWWWWWWWKKKKKKK.....',               // 50 [R] taper (7K+8W+7K, 22px)

  // --- Legs / Feet (6 rows) ---
  '......KKKKKKKK....KKKKKKKK......',               // 51     8px per leg
  '......KKKKKKKK....KKKKKKKK......',               // 52     8px
  '......KKKKKKKK....KKKKKKKK......',               // 53     8px
  '.....KKKKKKKKK....KKKKKKKKK.....',               // 54 [R] 9px smooth step
  '....KKKKKKKKKK....KKKKKKKKKK....',               // 55     10px feet
  '....KKKKKKKKKK....KKKKKKKKKK....',               // 56     10px feet

  // --- Padding (8 rows) ---
  E,                                                // 57
  E,                                                // 58
  E,                                                // 59
  E,                                                // 60
  E,                                                // 61
  E,                                                // 62
  E,                                                // 63
  E,                                                // 64
];

// --- Render 1× PNG ---
const png = new PNG({ width: FRAME_W, height: FRAME_H });
for (let i = 0; i < png.data.length; i += 4) {
  png.data[i] = 0; png.data[i+1] = 0; png.data[i+2] = 0; png.data[i+3] = 0;
}

for (let y = 0; y < FRAME_H; y++) {
  const line = BASE_32[y] || "";
  for (let x = 0; x < FRAME_W; x++) {
    const ch = line[x] || ".";
    const color = C[ch];
    if (!color) continue;
    const idx = (y * FRAME_W + x) * 4;
    png.data[idx] = color[0];
    png.data[idx+1] = color[1];
    png.data[idx+2] = color[2];
    png.data[idx+3] = 255;
  }
}

// --- Scale 8× ---
const SCALE = 8;
const bigW = FRAME_W * SCALE;
const bigH = FRAME_H * SCALE;
const big = new PNG({ width: bigW, height: bigH });
for (let i = 0; i < big.data.length; i += 4) {
  big.data[i] = 200; big.data[i+1] = 200; big.data[i+2] = 200; big.data[i+3] = 255;
}

for (let y = 0; y < FRAME_H; y++) {
  for (let x = 0; x < FRAME_W; x++) {
    const si = (y * FRAME_W + x) * 4;
    if (png.data[si+3] === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const di = ((y * SCALE + sy) * bigW + (x * SCALE + sx)) * 4;
        big.data[di] = png.data[si];
        big.data[di+1] = png.data[si+1];
        big.data[di+2] = png.data[si+2];
        big.data[di+3] = 255;
      }
    }
  }
}

const outDir = join(__dirname, "..", "webview-ui", "public", "assets", "characters");
const outPath = join(outDir, "panda_base_32x64_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Canonical 32×64 base panda (hand-refined from pixel-doubled 16×32)");

// Print grid for reference
console.log("\n32×64 character grid:");
BASE_32.forEach((row, i) => console.log(`${String(i + 1).padStart(2)}: ${row}`));
