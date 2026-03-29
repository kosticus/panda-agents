#!/usr/bin/env node
// Generates chopping landmark preview: three 16×16 tiles at 8× scale.
// Left: NEW chopping station (stump with wood chips on woodcutting earth).
// Center: NEW log pile (stacked cut rounds on woodcutting earth).
// Right: EXISTING wood2 tile (abstract stump oval) for comparison.

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const C = {
  ".": null,
  // Woodcutting zone earth (matches groundTiles.ts woodcutting palette)
  e: [120, 105, 70],     // #786946 trampled mud base
  f: [180, 155, 110],    // #B49B6E sawdust light
  j: [100, 80, 50],      // #645032 dark mud
  m: [135, 125, 85],     // #877D55 sawdust medium
  g: [100, 145, 62],     // #64913E grass green (scattered remnant)
  // Stump — bark ring (dark, rough outer edge)
  b: [90, 65, 35],       // bark dark (between J and D)
  k: [115, 80, 45],      // bark mid (warm dark brown)
  // Stump — cut face (lighter interior, visible grain)
  c: [170, 140, 90],     // cut face light (between F and T)
  r: [145, 110, 65],     // cut face mid / ring lines
  d: [120, 90, 50],      // heartwood / grain dark
  // Wood chips / splinters
  w: [160, 130, 80],     // wood chip light
  s: [130, 100, 60],     // wood chip dark / shaving
};

// Existing wood2 palette (groundTiles.ts uppercase keys)
const C2 = {
  E: [120, 105, 70],
  F: [180, 155, 110],
  J: [100, 80, 50],
  M: [135, 125, 85],
  g: [100, 145, 62],
};

const TILE = 16;

// === NEW: Chopping station ===
// Stump centered ~8px wide (cols 4-11), rows 3-10.
// Cut face visible from above: bark ring (b/k), cut rings (c/r), heartwood (d).
// Wood chips (w/s) scattered around base.
const choppingStation = [
  'eefeejeegeefjege',  //  0: earth
  'egeeeefeeeejeeee',  //  1: earth with sawdust
  'eejfeweeeseeegfe',  //  2: earth, chip at col 6, shaving at col 9
  'eeeeebbbbbbeeeje',  //  3: bark ring top (cols 5-10)
  'efeebbcrrcbbeeee',  //  4: bark + outer cut ring
  'eeeebccrrcckefee',  //  5: cut face with rings
  'egeebcrddrcbeeee',  //  6: heartwood center (d at cols 7-8)
  'eeejbcrddrcbseee',  //  7: heartwood center, chip nearby
  'eeeebccrrcckeeee',  //  8: cut face with rings
  'efeebbcrrcbbegee',  //  9: bark + outer cut ring
  'eeeewbbbbbbfeeee',  // 10: bark ring bottom, chip at col 4
  'ejeeseefeeewejee',  // 11: earth, chips at cols 4, 11
  'eeeeejeefeeesege',  // 12: earth
  'egeefeeeeejfeeee',  // 13: earth
  'eeeeeeemeeeeefee',  // 14: earth
  'eefegeeeeeejeege',  // 15: earth
];

// === NEW: Log pile ===
// 3 log cross-sections tumbled/stacked. Two on bottom, one on top.
// Each log: bark ring (b/k) around cut face (c/r/d).
// Bottom-left log: rows 7-12, cols 1-7
// Bottom-right log: rows 7-12, cols 9-15
// Top log: rows 2-7, cols 4-11 (resting on the two below)
const logPile = [
  'eefeejeegeefjege',  //  0: earth
  'egeeeefeeeejeeee',  //  1: earth
  'eejfbbbbbbeeegfe',  //  2: top log bark top (cols 4-9)
  'eeebbcrrcbbeeeje',  //  3: top log cut face
  'efeebcrddcbkefee',  //  4: top log heartwood
  'eeeebcrddcbkeeee',  //  5: top log heartwood
  'egeebbcrrcbbeeee',  //  6: top log bottom row
  'ebbbbbbbbbbbbbbe',  //  7: bottom logs bark top + top log base merging
  'bcrrcbbejbbcrrcb',  //  8: bottom-left + right log cut faces
  'bcrddbeeeebbdrcb',  //  9: heartwood of both
  'bcrddbefeebkdrcb',  // 10: heartwood of both
  'bcrrckeeeebbrrck',  // 11: cut rings
  'ebbbbbeejebbbbbe',  // 12: bottom logs bark bottom
  'egeefeeeeejfeeee',  // 13: earth
  'eeeeseemeeweefee',  // 14: earth, chips
  'eefegeeeeeejeege',  // 15: earth
];

// === EXISTING: wood2 from groundTiles.ts (for comparison) ===
const wood2_existing = [
  'EEgEEFEEgEEEJEgE',
  'EgEEEEJEEEFEEEEE',
  'EEEFEEEEEJEEEgEE',
  'gEEEEEEFEEEEEEJE',
  'EEJEEgJJJJFEEEEE',
  'EEEEFJFFFFJEgEEE',
  'EgEEEJFJJFJEEFEE',
  'EEEEJJFFFJJEEEgE',
  'EFEEEJJJJJEFEgEE',
  'EEEgEEJEEEEEEJEE',
  'EEEEEEEEFEgEEEEE',
  'EJEEFEgEEEEEEFEE',
  'EEEEEEEEEJEEEEgE',
  'EgEEJEEFEEEEJEEE',
  'EEFEEEEEEgEEEEFE',
  'EEEEgEJEEEEFEEEE',
];

// === Render: 3 tiles side by side (new station | new log pile | existing wood2) ===
const COLS = 3;
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

// Left: new chopping station
drawTile(choppingStation, C, 0);

// Center: new log pile
drawTile(logPile, C, TILE + GAP);

// Right: existing wood2
drawTile(wood2_existing, C2, TILE * 2 + GAP * 2);

const outDir = join(__dirname, '..', 'webview-ui', 'public', 'assets', 'characters');
const outPath = join(outDir, 'landmark_chopping_preview_8x.png');
writeFileSync(outPath, PNG.sync.write(png));
console.log(`Wrote ${outPath}`);
console.log('Left: NEW chopping station (stump with visible cut face + wood chips)');
console.log('Center: NEW log pile (3 stacked cut rounds)');
console.log('Right: EXISTING wood2 tile (abstract stump oval)');
console.log('');
console.log('Chopping station structure:');
console.log('  Bark ring: b/k (dark brown) at cols 5-10, rows 3-10');
console.log('  Cut face: c/r (warm tan) visible grain rings');
console.log('  Heartwood: d (medium brown) center at rows 6-7');
console.log('  Wood chips: w/s scattered around base');
console.log('');
console.log('Stump palette bridges zone earth (E/F/J) and animation (T/D):');
console.log('  bark b=[90,65,35] k=[115,80,45] — near zone J=[100,80,50]');
console.log('  face c=[170,140,90] r=[145,110,65] — between zone F and anim T');
console.log('  heart d=[120,90,50] — between zone J and anim T');
