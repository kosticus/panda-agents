#!/usr/bin/env node
// Generates a ground palette preview for the panda village reskin.
// Output: tile sheet with grass, path, and bamboo variants at 8× scale.
// Tile size: 16×16. Grid: 3 columns × 4 rows (3 tile groups + composed sample).

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Unified ground palette ---
// Designed as a set: bamboo first (muted), grass contrasts bamboo, paths sandy.
// Panda sprite bamboo is [140,190,100] / [100,160,80] — terrain bamboo is
// deliberately more muted so hand-held bamboo pops against the background.
const C = {
  ".": null, // transparent (won't appear — all tiles are filled)

  // Bamboo (desaturated gray-green — same hue family as grass but much less saturated)
  b: [120, 138, 105],  // stalk outer (muted gray-green)
  h: [155, 172, 140],  // stalk highlight (lighter gray-green)
  j: [90, 105, 78],    // node / joint (dark muted)
  l: [100, 140, 85],   // leaf (more saturated — leaves are lush)
  f: [148, 162, 138],  // faded background stalk
  e: [165, 178, 155],  // faded stalk highlight

  // Grass (warmer yellow-greens, contrast bamboo's cool sage)
  g: [110, 155, 70],   // base grass
  d: [80, 125, 55],    // dark grass
  t: [140, 175, 95],   // light grass / tip
  m: [95, 140, 60],    // mid grass

  // Path (warm sandy)
  s: [195, 175, 140],  // base sand
  k: [170, 150, 120],  // dark sand / edge
  w: [215, 195, 165],  // light sand / center
  p: [155, 140, 120],  // pebble / stone
};

const TILE = 16;

// Pad/trim rows to exactly 16 chars
function tile(rows) {
  if (rows.length !== TILE) {
    throw new Error(`Tile has ${rows.length} rows, expected ${TILE}`);
  }
  return rows.map((row) => {
    if (row.length < TILE) return row + "g".repeat(TILE - row.length);
    if (row.length > TILE) return row.slice(0, TILE);
    return row;
  });
}

// =====================
// GRASS TILES
// =====================

// Grass 1 — Plain: subtle texture, mostly base with sparse light/dark
const grass1 = tile([
  "ggggtgggggdggggg",
  "gdgggggdgggggggt",
  "ggggggggggggtggg",
  "ggtggdggggggggdg",
  "gggggggggdgggggg",
  "gggdggggggggtggg",
  "gggggggtgggggggd",
  "ggtggggggggggggg",
  "gggggdggggggtggg",
  "ggggggggdggggggg",
  "gdgggtggggggdggg",
  "gggggggggdgggggg",
  "gggdgggggggggggt",
  "ggggggggggggtggg",
  "gtgggdggggggggdg",
  "ggggggtggdgggggg",
]);

// Grass 2 — Tufty: more visible clusters of light/dark
const grass2 = tile([
  "ggtgggggdgggtggg",
  "gttggdggggggdggg",
  "gtgggggggtggggdg",
  "ggdgggggtttggggg",
  "ggggggtgggtggggg",
  "gdgggtggggdggggg",
  "ggggggdggggggtgg",
  "ggtgggggggdggggg",
  "gggdggtggggtgggg",
  "gggggddgggggggdg",
  "gtgggdggggdggggg",
  "gggggggggddggggt",
  "gdgggtggggggdggg",
  "ggggggdggggtgggg",
  "ggdgggggggggtggg",
  "ggtggdggggggdggg",
]);

// Grass 3 — Dark/shaded: more mid and dark tones (under bamboo canopy)
const grass3 = tile([
  "gdgmgggdggmggdgg",
  "gmggdggmgggdgggg",
  "ggggdggdggggggmg",
  "gdgmggggggdmgggg",
  "gggdggmgggggggdg",
  "gmgggdgggmdggggg",
  "gggdggmggggggdgm",
  "gdggggggdggmgggg",
  "gggmgdggggdgggdg",
  "ggggggmggggggmgg",
  "gmgdgggggdgmgggg",
  "gggggmgdggggdggg",
  "gdggggmgggmdgggg",
  "gggdggggdggggmgg",
  "gmgggdgggggdgggg",
  "gggmggggmdggggdg",
]);

// =====================
// PATH TILES
// =====================

// Path 1 — Center: broad sandy areas with subtle grain, not checkerboard
const path1 = tile([
  "sswwwwwssswwwwss",
  "wwwwwswwwwwswwww",
  "wwwswwwwwwwwwwsw",
  "swwwwwwswwwwwwww",
  "wwwwwwwwwwswwwww",
  "wwswwwwwwwwwwsww",
  "swwwwswwwwwwwwww",
  "wwwwwwwwswwwwwww",
  "wwwwwwwwwwwwswww",
  "swwwswwwwwwwwwww",
  "wwwwwwwwswwwswww",
  "wwswwwwwwwwwwwsw",
  "wwwwwwswwwwwwwww",
  "swwwwwwwwwswwwww",
  "wwwwswwwwwwwwsww",
  "wwwwwwwwswwwwwww",
]);

// Path 2 — Pebbled: sandy base with scattered stones
const path2 = tile([
  "sssswsssssswssss",
  "sssssssspssssssw",
  "sspsssssssssspss",
  "sssssswssssssssw",
  "sssssssssspssssw",
  "swsspssssssssssw",
  "ssssssssssspssss",
  "sspsssswssssssps",
  "sssssssssssswsss",
  "sssssspssssssssw",
  "spsssssssspssssw",
  "sssswssssssssssw",
  "sssssssspssssssw",
  "sspsssssssswspss",
  "sssssswsssssssss",
  "swsssssssspssssw",
]);

// Path 3 — Edge transition: grass→path with ragged organic boundary
const path3 = tile([
  "gggggdgksswwwwss",
  "ggtggggksswwswww",
  "ggggggdgsswwwwww",
  "gdgggggkswwwwsww",
  "gggggdggsswwwwww",
  "ggtgggggksswwwww",
  "gggggdgggsswwsww",
  "ggdggggkswwwwwww",
  "gggggggksswwwwww",
  "gtggggdgsswwswww",
  "ggggggggksswwwww",
  "ggdgggdggsswwwww",
  "ggggggggkswwswww",
  "gdggggdgsswwwwww",
  "gggggggkswwwwsww",
  "ggtgggggsswwwwww",
]);

// =====================
// BAMBOO TILES
// Vertical stalks on grass, seen from game's pseudo-side perspective.
// Stalk: 3px wide (b-h-b), node: 5px wide (j-b-h-b-j)
// =====================

// Bamboo 1 — Single stalk, two nodes (4px wide: b-hh-b, node 6px: j-bhhb-j)
const bamboo1 = tile([
  "ggggggbhhbgggggg",
  "ggtgggbhhbggggdg",
  "ggggggbhhbgggggg",
  "ggggggjhhjgggggg",
  "gdgggjbhhbjggggg",
  "ggggggbhhbgggtgg",
  "ggggggbhhbgggggg",
  "ggtgggbhhbggdggg",
  "ggggggbhhbgggggg",
  "ggggggbhhbgggggg",
  "ggdgggbhhbgggggg",
  "ggggggjhhjgggggg",
  "gggggjbhhbjggtgg",
  "ggggggbhhbgggggg",
  "ggtgggbhhbggdggg",
  "ggggggbhhbgggggg",
]);

// Bamboo 2 — Two stalks: foreground (full), background (faded, offset)
const bamboo2 = tile([
  "gfeegggggbhhbggg",
  "gfeeggtggbhhbgdg",
  "gfeegggggjhhjggg",
  "gfeeggjbhhbjgggg",
  "gfeegdggbhhbgggg",
  "gfeeggggbhhbgggg",
  "gfeeggggbhhbgggg",
  "gfeegtggbhhbgdgg",
  "gfeeggggjhhjgggg",
  "gfeegjbhhbjggggg",
  "gfeegdggbhhbgggg",
  "gfeeggggbhhbgggg",
  "gfeeggggbhhbggtg",
  "gfeeggggjhhjgggg",
  "gfeegjbhhbjggggg",
  "gfeegdggbhhbgggg",
]);

// Bamboo 3 — Stalk with leaf accents
const bamboo3 = tile([
  "ggggggbhhbgggggg",
  "ggggggbhhbllggdg",
  "gggtggbhhblllggg",
  "ggggggbhhbgggggg",
  "ggggggbhhbgggggg",
  "ggggggjhhjgggggg",
  "gdgggjbhhbjggggg",
  "ggggggbhhbgggggg",
  "ggllggbhhbggtggg",
  "glllggbhhbgggggg",
  "ggggggjhhjgggggg",
  "gggggjbhhbjggggg",
  "ggggggbhhbggggdg",
  "ggggggbhhbllgggg",
  "ggtgggbhhblllggg",
  "ggggggbhhbgggggg",
]);

// =====================
// COMPOSED SAMPLE ROW
// Shows bamboo → grass → path adjacency for palette harmony check
// =====================
const sampleBamboo = bamboo2;
const sampleGrass = grass1;
const samplePath = path1;

// =====================
// Render tile sheet
// =====================
const GRID_COLS = 3;
const GRID_ROWS = 4; // 3 tile groups + 1 composed row
const IMG_W = TILE * GRID_COLS;
const IMG_H = TILE * GRID_ROWS;

const grid = [
  [grass1, grass2, grass3],
  [path1, path2, path3],
  [bamboo1, bamboo2, bamboo3],
  [sampleBamboo, sampleGrass, samplePath],
];

// Create native-scale PNG
const png = new PNG({ width: IMG_W, height: IMG_H });
// Fill with magenta to catch missing pixels
for (let i = 0; i < png.data.length; i += 4) {
  png.data[i] = 255;
  png.data[i + 1] = 0;
  png.data[i + 2] = 255;
  png.data[i + 3] = 255;
}

for (let row = 0; row < GRID_ROWS; row++) {
  for (let col = 0; col < GRID_COLS; col++) {
    const tileData = grid[row][col];
    const ox = col * TILE;
    const oy = row * TILE;

    for (let y = 0; y < TILE; y++) {
      const line = tileData[y] || "";
      for (let x = 0; x < TILE; x++) {
        const ch = line[x] || ".";
        const color = C[ch];
        if (!color) continue;

        const idx = ((oy + y) * IMG_W + (ox + x)) * 4;
        png.data[idx] = color[0];
        png.data[idx + 1] = color[1];
        png.data[idx + 2] = color[2];
        png.data[idx + 3] = 255;
      }
    }
  }
}

// Save native scale
const outDir = join(__dirname, "..", "webview-ui", "public", "assets");
const nativePath = join(outDir, "ground_tiles_preview.png");
writeFileSync(nativePath, PNG.sync.write(png));
console.log(`Wrote ${nativePath} (native 48×64)`);

// Scale up 8× with light gray background (same as panda previews)
const SCALE = 8;

// Add 1-tile gap between rows and label area
const GAP = 2; // 2px native gap between groups = 16px at 8x
const SCALED_W = IMG_W * SCALE;
const SCALED_H = IMG_H * SCALE;

const big = new PNG({ width: SCALED_W, height: SCALED_H });
// Light gray background
for (let i = 0; i < big.data.length; i += 4) {
  big.data[i] = 200;
  big.data[i + 1] = 200;
  big.data[i + 2] = 200;
  big.data[i + 3] = 255;
}

for (let y = 0; y < IMG_H; y++) {
  for (let x = 0; x < IMG_W; x++) {
    const srcIdx = (y * IMG_W + x) * 4;
    const a = png.data[srcIdx + 3];
    if (a === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const dstIdx =
          ((y * SCALE + sy) * SCALED_W + (x * SCALE + sx)) * 4;
        big.data[dstIdx] = png.data[srcIdx];
        big.data[dstIdx + 1] = png.data[srcIdx + 1];
        big.data[dstIdx + 2] = png.data[srcIdx + 2];
        big.data[dstIdx + 3] = 255;
      }
    }
  }
}

const bigPath = join(outDir, "ground_palette_preview_8x.png");
writeFileSync(bigPath, PNG.sync.write(big));
console.log(`Wrote ${bigPath} (8× scaled, 384×512)`);
console.log();
console.log("Tile grid layout:");
console.log("  Row 0: Grass  — plain, tufty, dark/shaded");
console.log("  Row 1: Path   — center, pebbled, grass→path edge");
console.log("  Row 2: Bamboo — single stalk, two stalks (faded bg), stalk + leaves");
console.log("  Row 3: Sample — bamboo|grass|path side by side (palette check)");
console.log();
console.log("Palette summary:");
console.log("  Bamboo: muted sage [95,120,85] / [120,145,105] — cool green");
console.log("  Grass:  warm green [110,155,70] / [140,175,95] — yellow-green");
console.log("  Path:   sandy      [195,175,140] / [215,195,165] — warm tan");
