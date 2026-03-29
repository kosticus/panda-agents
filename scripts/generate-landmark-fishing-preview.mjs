#!/usr/bin/env node
// Generates fishing landmark preview: two 16x16 tiles at 8x scale.
// Left: NEW fishing shoreline (grass-to-sandy-bank-to-water transition).
// Right: EXISTING water2 tile (grass-bordered oval pond) for comparison.

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const C = {
  ".": null,
  // Grass palette (matches groundTiles.ts)
  g: [100, 145, 62],     // #64913E grass base
  d: [72, 115, 48],      // #487330 dark grass
  t: [130, 165, 85],     // #82A555 light grass
  m: [85, 130, 52],      // #558234 medium grass
  // Sandy bank / shoreline
  s: [180, 140, 60],     // warm tan (matches animation P color)
  a: [160, 125, 55],     // darker sand
  n: [195, 160, 85],     // light sand / dry
  // Pebbles / earth accents
  p: [110, 85, 50],      // pebble dark
  e: [140, 110, 65],     // pebble mid / earth
  // Reed / grass-in-sand accents
  r: [80, 120, 45],      // reed green (darker than grass base)
  // Water palette (matches groundTiles.ts)
  W: [70, 120, 170],     // #4678AA water base
  L: [90, 145, 195],     // #5A91C3 water light / ripple
  D: [50, 95, 140],      // #325F8C water dark / depth
  S: [60, 108, 155],     // #3C6C9B water shadow
};

// Existing water2 palette (groundTiles.ts — shares grass + water keys)
const C2 = {
  g: [100, 145, 62],
  d: [72, 115, 48],
  t: [130, 165, 85],
  W: [70, 120, 170],
  L: [90, 145, 195],
  D: [50, 95, 140],
  S: [60, 108, 155],
};

const TILE = 16;

// === NEW: Fishing shoreline tile ===
// South-facing: grass top, sandy bank middle, water bottom.
// Irregular transition — grass fingers into sand, water laps into bank.
const fishingShoreline = [
  'ggtgdgggtgggdgtg',  //  0: grass, natural scatter
  'gdggggtggdgggggm',  //  1: grass
  'gggdggggggtgdggg',  //  2: grass
  'gmgggtgggggggtgg',  //  3: grass
  'ggtggdgggtgdgggg',  //  4: grass
  'ggggmggtggggdgtg',  //  5: grass
  'gdgtgggggmgggggg',  //  6: grass, last pure grass row
  'gssgdgsssasggrsg',  //  7: sand appears — irregular edge, grass remnants, reed
  'ssanssepsnssasss',  //  8: sandy bank — pebbles, some texture
  'asspsssnrassness',  //  9: sand with pebble cluster, reed accent
  'DsaDWSsaDWssDsaD',  // 10: waterline — sand+water interleave
  'DWWDWWWDWWWDWWWs',  // 11: mostly water, last sand bit
  'WWSWWWLWWSWWWWLW',  // 12: water with ripples
  'WWWWLWWWWWWWSWWW',  // 13: water
  'WLWWWWSWWWLWWWWW',  // 14: water
  'WWWSWWWWLWWWWWLW',  // 15: water
];

// === EXISTING: water2 from groundTiles.ts (for comparison) ===
const water2_existing = [
  'ggggddgtggdggggg',
  'gdggggddgggggtgg',
  'gggdgDDDDDDggggg',
  'ggggDDWWWWDDdggg',
  'gdgDWWWWWWWDgggg',
  'gggDWWLWWWWDgtgg',
  'gggDWWWWLWWDgggg',
  'ggDWWWWWWWLDgggg',
  'ggDWWSWWWWWDggdg',
  'ggDWWWWWLWWDgggg',
  'gggDWWWWWWDdgggg',
  'gggDDWWWWDDggggg',
  'gdgggDDDDDgggtgg',
  'gggtggggggdggggg',
  'gggggdggggggggdg',
  'ggdgggggtggggggg',
];

// === Render: 2 tiles side by side (new shoreline | existing water2) ===
const COLS = 2;
const SCALE = 8;
const GAP = 2;  // 2px gap between tiles at 1x
const srcW = TILE * COLS + GAP * (COLS - 1);
const srcH = TILE;
const W = srcW * SCALE;
const H = srcH * SCALE;

const png = new PNG({ width: W, height: H });

// Fill background with light gray
for (let idx = 0; idx < png.data.length; idx += 4) {
  png.data[idx] = 200; png.data[idx + 1] = 200; png.data[idx + 2] = 200; png.data[idx + 3] = 255;
}

function drawTile(tileData, palette, offsetX) {
  for (let y = 0; y < TILE; y++) {
    const row = tileData[y] || '';
    for (let x = 0; x < TILE; x++) {
      const ch = row[x] || '.';
      const color = palette[ch];
      if (!color) continue;
      for (let sy = 0; sy < SCALE; sy++) {
        for (let sx = 0; sx < SCALE; sx++) {
          const px = (offsetX + x) * SCALE + sx;
          const py = y * SCALE + sy;
          const di = (py * W + px) * 4;
          png.data[di] = color[0];
          png.data[di + 1] = color[1];
          png.data[di + 2] = color[2];
          png.data[di + 3] = 255;
        }
      }
    }
  }
}

// Left: new fishing shoreline
drawTile(fishingShoreline, C, 0);

// Right: existing water2
drawTile(water2_existing, C2, TILE + GAP);

const outDir = join(__dirname, '..', 'webview-ui', 'public', 'assets', 'characters');
const outPath = join(outDir, 'landmark_fishing_preview_8x.png');
writeFileSync(outPath, PNG.sync.write(png));
console.log(`Wrote ${outPath}`);
console.log('Left: NEW fishing shoreline (grass → sandy bank → water)');
console.log('Right: EXISTING water2 tile (grass-bordered oval pond)');
console.log('');
console.log('Shoreline structure:');
console.log('  Rows 0-6: grass fill (g/d/t/m) — natural variation');
console.log('  Rows 7-9: sandy bank (s/a/n) with pebbles (p/e) and reeds (r)');
console.log('  Row 10: waterline — sand and water interleaved');
console.log('  Rows 11-15: water fill (W/L/D/S) — ripple variation');
console.log('');
console.log('Bank palette bridges grass zone and water zone:');
console.log('  sand s=[180,140,60] a=[160,125,55] n=[195,160,85]');
console.log('  pebbles p=[110,85,50] e=[140,110,65]');
console.log('  reeds r=[80,120,45] — darker green in sand');
