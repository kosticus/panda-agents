#!/usr/bin/env node
// Generates zone palette preview for the four undefined zone types.
// Output: 4 columns × 2 rows at 8× scale. Each column is a zone type.
// Row 0: zone ground tile. Row 1: zone ground with a simple landmark/element.
// Tile size: 16×16.
//
// Zones: Water, Garden/Farm, Woodcutting, Cooking
//
// These sit alongside the established ground palette (grass, path, bamboo).
// The palettes here are first-pass proposals — iterate by editing the C values.

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const C = {
  ".": null,

  // === Existing palette (for context/transitions) ===
  g: [110, 155, 70],   // grass base
  d: [80, 125, 55],    // grass dark
  t: [140, 175, 95],   // grass light

  // === WATER ===
  // Cool blues — pond/stream. Should contrast the warm grass and sandy path.
  W: [70, 120, 170],   // water base (mid blue)
  L: [90, 145, 195],   // water light (surface highlight / ripple)
  D: [50, 95, 140],    // water dark (depth)
  R: [110, 165, 210],  // water ripple (bright highlight)
  S: [60, 108, 155],   // water shadow (under-surface)

  // === GARDEN / FARM ===
  // Warm brown soil with green crop sprouts. Tilled rows readable at 16px.
  B: [140, 105, 65],   // soil base (warm brown)
  K: [115, 85, 50],    // soil dark (furrow)
  H: [165, 130, 85],   // soil light (dry top)
  P: [100, 160, 80],   // crop green (sprout — brighter than grass)
  Q: [75, 130, 60],    // crop dark green (leaf shadow)

  // === WOODCUTTING ===
  // Muddy trampled ground — grass is mostly gone. Bare earth + sawdust.
  E: [120, 105, 70],   // trampled mud base (brown, not green)
  F: [180, 155, 110],  // sawdust / fresh wood chip (light tan, prominent)
  J: [100, 80, 50],    // bark bits / dark earth
  M: [135, 125, 85],   // dry packed dirt

  // === COOKING ===
  // Packed earth around fire pit. Darker, drier ground than regular grass.
  // Warmth from fire influence — slightly orange-shifted earth.
  A: [145, 120, 85],   // packed earth base
  I: [125, 100, 70],   // packed earth dark
  N: [165, 140, 105],  // packed earth light / ash
  O: [110, 90, 60],    // char / soot patches
};

const TILE = 16;

function tile(rows) {
  if (rows.length !== TILE) {
    throw new Error(`Tile has ${rows.length} rows, expected ${TILE}`);
  }
  return rows.map((row) => {
    if (row.length < TILE) return row + ".".repeat(TILE - row.length);
    if (row.length > TILE) return row.slice(0, TILE);
    return row;
  });
}

// =====================
// WATER TILES
// =====================

// Water — plain pond surface with subtle ripple pattern
const water1 = tile([
  "WWWLWWWWSWWWWLWW",
  "WWWWWWLWWWWWWWWW",
  "WSWWWWWWWWLWWWWW",
  "WWWWLWWWWWWWWSWW",
  "WWWWWWWSWWWWWWWL",
  "WLWWWWWWWWWWLWWW",
  "WWWWWWLWWSWWWWWW",
  "WWWSWWWWWWWWWWLW",
  "WWWWWWWWLWWWWWWW",
  "WLWWWSWWWWWWSWWW",
  "WWWWWWWWWLWWWWWW",
  "WWWWLWWWWWWWWWLW",
  "WSWWWWWWWWLWWWWW",
  "WWWWWWLWWWWWWSWW",
  "WWLWWWWWSWWWWWWW",
  "WWWWSWWWWWWLWWWW",
]);

// Water — with edge (grass to water transition)
const water2 = tile([
  "ggggddgtggdggggg",
  "gdggggddgggggtgg",
  "gggdgDDDDDDggggg",
  "ggggDDWWWWDDdggg",
  "gdgDWWWWWWWDgggg",
  "gggDWWLWWWWDgtgg",
  "gggDWWWWLWWDgggg",
  "ggDWWWWWWWLDgggg",
  "ggDWWSWWWWWDggdg",
  "ggDWWWWWLWWDgggg",
  "gggDWWWWWWDdgggg",
  "gggDDWWWWDDggggg",
  "gdgggDDDDDgggtgg",
  "gggtggggggdggggg",
  "gggggdggggggggdg",
  "ggdgggggtggggggg",
]);

// =====================
// GARDEN / FARM TILES
// =====================

// Garden — tilled soil with crop rows
const garden1 = tile([
  "BKBBHBBKBBHBBKBB",
  "KPQKKKPQKKKPQKKK",
  "BKBBHBBKBBHBBKBB",
  "KKKPQKKKKKPQKKKK",
  "BHBBKBBHBBKBBHBB",
  "KPQKKKPQKKKPQKKK",
  "BKBBHBBKBBHBBKBB",
  "KKKPQKKKKKPQKKKK",
  "BHBBKBBHBBKBBHBB",
  "KPQKKKPQKKKPQKKK",
  "BKBBHBBKBBHBBKBB",
  "KKKPQKKKKKPQKKKK",
  "BHBBKBBHBBKBBHBB",
  "KPQKKKPQKKKPQKKK",
  "BKBBHBBKBBHBBKBB",
  "KKKPQKKKKKPQKKKK",
]);

// Garden — edge transition (grass to tilled soil)
const garden2 = tile([
  "gggtggggdggtgggg",
  "gdggggtggggggdgg",
  "gggggdggggggtggg",
  "gdgggggKBBKgggdg",
  "gggggKBBHBBKgggg",
  "ggdgKBHBBHBBKggg",
  "ggggKBPQBBPQKggg",
  "gggKBBHBBHBBKggg",
  "gggKBPQBBPQBKgdg",
  "ggdKBBHBBHBBKggg",
  "gggKBPQBBPQBKggg",
  "ggggKBBBBBBKgggg",
  "gdgggKKKKKKggdgg",
  "ggggtgggggggtggg",
  "ggdgggggdgggggdg",
  "gggggtgggggtgggg",
]);

// =====================
// WOODCUTTING TILES
// =====================

// Woodcutting — trampled grass with sawdust patches
const wood1 = tile([
  "EEgEEFEEgEEEJEgE",
  "EgEEEEJEEEFEEEEE",
  "EEEFEEEEEJEEEgEE",
  "gEEEEEEFEEEEEEJE",
  "EEJEEgEEEEFEEEEE",
  "EEEEFEEJEEEEgEEE",
  "EgEEEEEEEEJEEFEE",
  "EEEEJEFEEEEEEEgE",
  "EFEEEEEEgEEFEEEE",
  "EEEgEEJEEEEEEJEE",
  "EEEEEEEEFEgEEEEE",
  "EJEEFEgEEEEEEFEE",
  "EEEEEEEEEJEEEEgE",
  "EgEEJEEFEEEEJEEE",
  "EEFEEEEEEgEEEEFE",
  "EEEEgEJEEEEFEEEE",
]);

// Woodcutting — with stump landmark
const wood2 = tile([
  "EEgEEFEEgEEEJEgE",
  "EgEEEEJEEEFEEEEE",
  "EEEFEEEEEJEEEgEE",
  "gEEEEEEFEEEEEEJE",
  "EEJEEgJJJJFEEEEE",
  "EEEEFJFFFFJEgEEE",
  "EgEEEJFJJFJEEFEE",
  "EEEEJJFFFJJEEEgE",
  "EFEEEJJJJJEFEgEE",
  "EEEgEEJEEEEEEJEE",
  "EEEEEEEEFEgEEEEE",
  "EJEEFEgEEEEEEFEE",
  "EEEEEEEEEJEEEEgE",
  "EgEEJEEFEEEEJEEE",
  "EEFEEEEEEgEEEEFE",
  "EEEEgEJEEEEFEEEE",
]);

// =====================
// COOKING TILES
// =====================

// Cooking — packed earth with soot
const cook1 = tile([
  "AAIAAANAAIAANAAAA",
  "AAAAAIAAAAAAAAAIA",
  "ANAAAAAAOAAIAAAAA",
  "AAAAAIAAAAAAAANAA",
  "AIAAAAAANAAAOAAAA",
  "AAAANAAAAAAAIAAAA",
  "AAOAAAAAIAAAAAANA",
  "AAAAAANAAAAAAAOAA",
  "AAIAAAAAAOAAAAAAA",
  "AAAAAAOAAAAAIANAA",
  "ANAAAAAAAIAAAAAAA",
  "AAAOAAIAAAAAANAAA",
  "AAAAAAAANAAAOAAAA",
  "AIAAANAAAAAAIAAAA",
  "AAAAAAAAOAAAAAAAI",
  "AAANAAAAAAIAAANAA",
]);

// Cooking — with fire pit landmark
const cook2 = tile([
  "AAIAAANAAIAANAAAA",
  "AAAAAIAAAAAAAAAIA",
  "ANAAAAAAOAAIAAAAA",
  "AAAAAIAAAAAAAANAA",
  "AIAAAOOOOOAAOAAAA",
  "AAAAOOIIIOOAIAAAA",
  "AAOAOINNNIOAAAANA",
  "AAAAAOINNIOANAOAA",
  "AAIAAOINNIOOAAAAA",
  "AAAAAOOIIIOIANAA",
  "ANAAAOOOOOAAAAAA",
  "AAAOAAIAAAAAANAAA",
  "AAAAAAAANAAAOAAAA",
  "AIAAANAAAAAAIAAAA",
  "AAAAAAAAOAAAAAAAI",
  "AAANAAAAAAIAAANAA",
]);

// =====================
// RENDER
// =====================

const COLS = 4;
const ROWS = 2;
const IMG_W = TILE * COLS;
const IMG_H = TILE * ROWS;

const grid = [
  // Row 0: plain ground tiles
  [water1, garden1, wood1, cook1],
  // Row 1: with landmark / edge transition
  [water2, garden2, wood2, cook2],
];

const labels = ["Water", "Garden", "Woodcutting", "Cooking"];

const png = new PNG({ width: IMG_W, height: IMG_H });
// Fill with mid gray background
for (let i = 0; i < png.data.length; i += 4) {
  png.data[i] = 180; png.data[i+1] = 180; png.data[i+2] = 180; png.data[i+3] = 255;
}

for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const t = grid[row][col];
    const ox = col * TILE;
    const oy = row * TILE;
    for (let y = 0; y < TILE; y++) {
      const line = t[y] || "";
      for (let x = 0; x < TILE; x++) {
        const ch = line[x] || ".";
        const color = C[ch];
        if (!color) continue;
        const idx = ((oy + y) * IMG_W + (ox + x)) * 4;
        png.data[idx] = color[0];
        png.data[idx+1] = color[1];
        png.data[idx+2] = color[2];
        png.data[idx+3] = 255;
      }
    }
  }
}

// Scale 8×
const SCALE = 8;
const bigW = IMG_W * SCALE;
const bigH = IMG_H * SCALE;
const big = new PNG({ width: bigW, height: bigH });
for (let i = 0; i < big.data.length; i += 4) {
  big.data[i] = 180; big.data[i+1] = 180; big.data[i+2] = 180; big.data[i+3] = 255;
}

for (let y = 0; y < IMG_H; y++) {
  for (let x = 0; x < IMG_W; x++) {
    const si = (y * IMG_W + x) * 4;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const di = ((y*SCALE+sy)*bigW + (x*SCALE+sx)) * 4;
        big.data[di] = png.data[si];
        big.data[di+1] = png.data[si+1];
        big.data[di+2] = png.data[si+2];
        big.data[di+3] = png.data[si+3];
      }
    }
  }
}

const outDir = join(__dirname, "..", "webview-ui", "public", "assets");
const outPath = join(outDir, "zone_palette_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Layout: 4 columns (Water | Garden | Woodcutting | Cooking) × 2 rows");
console.log("Row 0: plain zone ground tiles");
console.log("Row 1: zone with landmark or grass edge transition");
console.log(`\nPalette values to edit in C object at top of script.`);
