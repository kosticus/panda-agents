#!/usr/bin/env node
// Generates a village layout schematic for the panda village.
// Each pixel = 1 tile (16×16 in-game). Scaled up 12× for readability.
// Color-coded zones with labeled legend.

import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Layout dimensions ---
// Wider than tall — village sprawl, not a grid.
// Bamboo perimeter is 2-3 tiles thick.
const W = 30;
const H = 23;

// --- Zone colors (schematic, not final in-game palette) ---
const Z = {
  B: [95, 130, 90],    // bamboo perimeter (dark green)
  G: [130, 175, 85],   // grass / open ground
  P: [195, 175, 140],  // path (sandy — matches ground palette)
  W: [100, 150, 200],  // water / pond
  C: [200, 110, 70],   // cooking area (warm/fire)
  X: [160, 120, 80],   // woodcutting area (brown/timber)
  F: [120, 180, 120],  // garden/farm area (bright green)
  A: [180, 165, 140],  // gathering/common area (neutral)
  H: [170, 140, 110],  // hut marker (wood tone)
};

// Build the map row by row.
// Legend:
//   B = bamboo perimeter
//   G = grass (open)
//   P = path
//   W = water/pond
//   C = cooking zone
//   X = woodcutting zone
//   F = garden/farm zone
//   A = gathering/common area
//   H = hut location
//
// Layout concept:
//   - Bamboo perimeter 2-3 tiles thick wraps everything
//   - Central gathering area with paths radiating out
//   - Pond on one side, garden adjacent to pond (watering access)
//   - Cooking area near gathering (communal)
//   - Woodcutting at edge (noisy, needs space)
//   - Huts scattered throughout, near paths

// Load map from external file for easy editing
const mapFile = join(__dirname, "village-layout.txt");
const rawMap = readFileSync(mapFile, "utf-8")
  .split("\n")
  .filter((line) => line.length > 0 && !line.startsWith("#"));

// Auto-pad short rows with B, trim long rows
const map = rawMap.map((row, i) => {
  if (row.length < W) return row + "B".repeat(W - row.length);
  if (row.length > W) return row.slice(0, W);
  return row;
});

// Validate dimensions and characters
if (map.length !== H) {
  throw new Error(`Map has ${map.length} rows, expected ${H}`);
}
const validChars = new Set(Object.keys(Z).concat(["."]));
for (let y = 0; y < H; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (!validChars.has(map[y][x])) {
      console.warn(`Unknown char '${map[y][x]}' at (${x}, ${y})`);
    }
  }
}

// Create native-scale PNG
const png = new PNG({ width: W, height: H });
// Fill transparent
for (let i = 0; i < png.data.length; i += 4) {
  png.data[i] = 0;
  png.data[i + 1] = 0;
  png.data[i + 2] = 0;
  png.data[i + 3] = 0;
}

for (let y = 0; y < H; y++) {
  const row = map[y];
  for (let x = 0; x < W; x++) {
    const ch = row[x];
    if (!ch || ch === ".") continue;
    const color = Z[ch];
    if (!color) {
      console.warn(`Unknown zone char '${ch}' at (${x}, ${y})`);
      continue;
    }
    const idx = (y * W + x) * 4;
    png.data[idx] = color[0];
    png.data[idx + 1] = color[1];
    png.data[idx + 2] = color[2];
    png.data[idx + 3] = 255;
  }
}

// Scale up for readability
const SCALE = 12;
const LEGEND_H = 120; // extra space below for legend
const bigW = W * SCALE;
const bigH = H * SCALE + LEGEND_H;

const big = new PNG({ width: bigW, height: bigH });
// Dark background
for (let i = 0; i < big.data.length; i += 4) {
  big.data[i] = 40;
  big.data[i + 1] = 40;
  big.data[i + 2] = 40;
  big.data[i + 3] = 255;
}

// Render scaled tiles with 1px grid lines
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const srcIdx = (y * W + x) * 4;
    if (png.data[srcIdx + 3] === 0) continue;

    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        // 1px grid line on right and bottom edges
        const isGrid = sx === SCALE - 1 || sy === SCALE - 1;
        const dstIdx = ((y * SCALE + sy) * bigW + (x * SCALE + sx)) * 4;
        if (isGrid) {
          // Darken grid lines slightly
          big.data[dstIdx] = Math.floor(png.data[srcIdx] * 0.7);
          big.data[dstIdx + 1] = Math.floor(png.data[srcIdx + 1] * 0.7);
          big.data[dstIdx + 2] = Math.floor(png.data[srcIdx + 2] * 0.7);
        } else {
          big.data[dstIdx] = png.data[srcIdx];
          big.data[dstIdx + 1] = png.data[srcIdx + 1];
          big.data[dstIdx + 2] = png.data[srcIdx + 2];
        }
        big.data[dstIdx + 3] = 255;
      }
    }
  }
}

// Draw legend swatches (simple colored rectangles)
const legendY = H * SCALE + 10;
const swatchSize = 10;
const legendItems = [
  { label: "Bamboo perimeter", color: Z.B },
  { label: "Grass (open)", color: Z.G },
  { label: "Path", color: Z.P },
  { label: "Water/pond", color: Z.W },
  { label: "Cooking", color: Z.C },
  { label: "Woodcutting", color: Z.X },
  { label: "Garden/farm", color: Z.F },
  { label: "Gathering", color: Z.A },
  { label: "Hut", color: Z.H },
];

// Draw legend swatches in two rows
const colWidth = Math.floor(bigW / 5);
for (let i = 0; i < legendItems.length; i++) {
  const col = i % 5;
  const row = Math.floor(i / 5);
  const lx = col * colWidth + 10;
  const ly = legendY + row * (swatchSize + 8);
  const color = legendItems[i].color;

  for (let sy = 0; sy < swatchSize; sy++) {
    for (let sx = 0; sx < swatchSize; sx++) {
      const dstIdx = ((ly + sy) * bigW + (lx + sx)) * 4;
      big.data[dstIdx] = color[0];
      big.data[dstIdx + 1] = color[1];
      big.data[dstIdx + 2] = color[2];
      big.data[dstIdx + 3] = 255;
    }
  }
}

const outDir = join(__dirname, "..", "webview-ui", "public", "assets");
const outPath = join(outDir, "village_layout_preview.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath} (${bigW}×${bigH})`);
console.log();
console.log("Village layout: 30×22 tiles (480×352 px in-game at 16px/tile)");
console.log();
console.log("Zones:");
console.log("  Bamboo perimeter — 2-3 tiles thick, wraps everything. Harvesting happens here.");
console.log("  Woodcutting — upper left. Chopping + building/repair cluster together.");
console.log("  Garden/farm — upper right, near pond for watering access.");
console.log("  Gathering — center. Common area, paths radiate outward.");
console.log("  Cooking — left of center, near gathering (communal meals).");
console.log("  Pond — right of center. Fishing here, adjacent to garden.");
console.log("  Huts — scattered near paths. Sweeping happens near these.");
console.log("  Paths — organic sandy routes connecting zones. Carrying along these.");
