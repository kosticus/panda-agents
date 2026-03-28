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

  // Bamboo (darkened gray-green — wider contrast range for stalk detail)
  b: [95, 115, 80],    // stalk outer (darker gray-green)
  h: [130, 150, 115],  // stalk highlight (less washed)
  j: [65, 80, 55],     // node / joint (much darker — detail anchor)
  l: [95, 155, 45],    // leaf (vivid green — must pop against d/m fill)
  f: [120, 138, 110],  // faded background stalk
  e: [140, 155, 128],  // faded stalk highlight

  // Grass (slightly darker yellow-greens)
  g: [100, 145, 62],   // base grass
  d: [72, 115, 48],    // dark grass
  t: [130, 165, 85],   // light grass / tip
  m: [85, 130, 52],    // mid grass

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
// Three stalks per tile: 2 thick (4px bhhb) + 1 medium (3px bhb).
// Dark grass fill (d/m) between stalks for canopy shade.
// Height variation: some stalks are partial (start/stop mid-tile).
// A at cols 0–3, B at cols 6–8, C at cols 10–13. Fill at 4–5, 9, 14–15.
// =====================

// Bamboo 1 — Dense grove: all three stalks full height, leaves alternating sides
const bamboo1 = tile([
  "bhhbdmbhbdbhhbdm",
  "bhhbmdbhbmbhhbll",
  "bhhbllbhbdbhhbdd",
  "jhhjdmbhbdbhhbdm",
  "bhhbmdbhbmbhhbll",
  "bhhbllbhbdbhhbdd",
  "bhhbdmbhbmbhhbdm",
  "bhhbmdjhjdbhhbmd",
  "bhhbddbhbdbhhbll",
  "bhhbllbhbmbhhbdm",
  "bhhbmdbhbdbhhbll",
  "bhhbddbhbdjhhjdd",
  "bhhbllbhbmbhhbdm",
  "bhhbmdbhbdbhhbll",
  "bhhbllbhbdbhhbdd",
  "bhhbdmbhbmbhhbdm",
]);

// Bamboo 2 — Height variation: thin stalk B only rows 4–11, faded bg (fe), leaves in gaps
const bamboo2 = tile([
  "bhhbdfelldbhhbll",
  "bhhbmfemdmbhhbmd",
  "bhhbdfelldbhhbdd",
  "bhhbmfelldbhhbll",
  "bhhbdfebhmbhhbll",
  "jhhjmfebhdbhhbmd",
  "bhhbdfebhmbhhbll",
  "bhhbmfejhdbhhbmd",
  "bhhbdfebhdjhhjdd",
  "bhhbmfebhmbhhbll",
  "bhhbdfebhdbhhbmd",
  "bhhbmfebhmbhhbll",
  "bhhbdfelldbhhbll",
  "jhhjmfedmmbhhbmd",
  "bhhbdfelldbhhbdd",
  "bhhbmfedmdbhhbll",
]);

// Bamboo 3 — Height variation: stalk A only rows 5–15, heavy leaf canopy
const bamboo3 = tile([
  "llddllbhbdbhhbll",
  "ldldldbhbmbhhbll",
  "llldllbhbdbhhbdd",
  "llllldbhbmbhhbll",
  "dlllddbhbdbhhbll",
  "bhhbllbhbmbhhbll",
  "bhhbddbhbdbhhbdd",
  "bhhblljhjmbhhbll",
  "bhhbddbhbdbhhbll",
  "bhhbllbhbmbhhbll",
  "jhhjddbhbdbhhbdd",
  "bhhbllbhbmjhhjll",
  "bhhbllbhbdbhhbll",
  "bhhbddbhbmbhhbdd",
  "bhhbllbhbdbhhbll",
  "bhhbddbhbmbhhbll",
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
console.log("  Row 2: Bamboo — 3 stalks dense, 3 stalks (B partial + faded), 3 stalks (A partial + leaves)");
console.log("  Row 3: Sample — bamboo|grass|path side by side (palette check)");
console.log();
console.log("Palette summary:");
console.log("  Bamboo: dark sage [65,80,55] / [130,150,115] — gray-green");
console.log("  Grass:  warm green [100,145,62] / [130,165,85] — yellow-green");
console.log("  Path:   sandy      [195,175,140] / [215,195,165] — warm tan");
