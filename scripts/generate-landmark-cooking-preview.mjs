#!/usr/bin/env node
// Generates fire pit landmark preview: 16×16 cooking station tile at 8× scale.
// Stone ring with fire/embers on cooking zone earth.
// Intended to replace the current cook2 tile (abstract dark soot oval).

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const C = {
  ".": null,
  // Cooking zone earth (matches groundTiles.ts cooking palette)
  a: [125, 118, 108],   // #7D766C packed earth base
  i: [100, 92, 82],     // #645C52 dark packed earth
  n: [155, 150, 140],   // #9B968C ash / light earth
  o: [55, 48, 40],      // #373028 char / soot
  // Stone ring (warm gray — lighter than cooking earth, reads as stones)
  s: [145, 135, 120],   // stone light
  t: [110, 100, 85],    // stone shadow
  // Fire / embers
  e: [170, 70, 30],     // ember (dark red-orange)
  f: [210, 120, 40],    // fire orange
  y: [235, 195, 60],    // flame yellow (brightest)
};

// Existing cook2 palette (groundTiles.ts uppercase keys)
const C2 = {
  A: [125, 118, 108],
  I: [100, 92, 82],
  N: [155, 150, 140],
  O: [55, 48, 40],
};

const TILE = 16;

// === NEW: Fire pit landmark ===
// Stone ring (cols 3-12, rows 3-10), fire/embers inside.
// Ring: s/t (warm gray stones), Fire: e(ember) → f(orange) → y(yellow center).
const firepit = [
  'aainaaiaanaainaa',  // 0: earth
  'aaaaaioaaaiaaaai',  // 1: earth
  'anaaaaaiaaaaanaa',  // 2: earth
  'aaaiassssssaanaa',  // 3: stone ring top (s at cols 5-10)
  'aiaasteeeetsaaaa',  // 4: stones + embers (s:4,11  t:5,10  e:6-9)
  'aaosteffffetsaan',  // 5: fire (s:3,12  t:4,11  e:5,10  f:6-9)
  'aaosefyyyyfesaia',  // 6: fire center (s:3,12  e:4,11  f:5,10  y:6-9)
  'aaasefyyyyfesaoa',  // 7: fire center
  'aaisteffffetsaaa',  // 8: fire
  'aaansteeeetsanaa',  // 9: stones + embers
  'anaaassssssaaaaa',  // 10: stone ring bottom (s at cols 5-10)
  'aaaoaaiaaaaaanaa',  // 11: earth
  'aaaaaaaanaaaoaaa',  // 12: earth
  'aiaaanaaaaaaiaaa',  // 13: earth
  'aaaaaaaaoaaaaaaa',  // 14: earth
  'aaanaaaaaaiaaana',  // 15: earth
];

// === EXISTING: cook2 from groundTiles.ts (for comparison) ===
const cook2_existing = [
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAAAAAAAANA',
  'AIAAAOOOOOAAOAAA',
  'AAAAOOIIIOOAIAAA',
  'AAOAOINNNIOAAAAN',
  'AAAAAOINNIOANAOA',
  'AAIAAOINNIOOAAAA',
  'AAAAAOOIIIOIANAA',
  'ANAAAOOOOOAAAAAA',
  'AAAOAAIAAAAAANAA',
  'AAAAAAAANAAAOAAA',
  'AIAAANAAAAAAIAAA',
  'AAAAAAAAOAAAAAAA',
  'AAANAAAAAAIAAANA',
];

// === Render: 2 tiles side by side (new | existing) ===
const COLS = 2;
const SCALE = 8;
const GAP = 2;  // 2px gap between tiles at 1x
const srcW = TILE * COLS + GAP;
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

// Left panel: new fire pit
drawTile(firepit, C, 0);

// Right panel: existing cook2
drawTile(cook2_existing, C2, TILE + GAP);

const outDir = join(__dirname, '..', 'webview-ui', 'public', 'assets', 'characters');
const outPath = join(outDir, 'landmark_cooking_firepit_preview_8x.png');
writeFileSync(outPath, PNG.sync.write(png));
console.log(`Wrote ${outPath}`);
console.log('Left: NEW fire pit landmark (stone ring + fire/embers)');
console.log('Right: EXISTING cook2 tile (abstract soot oval)');
console.log('');
console.log('Fire pit structure:');
console.log('  Stone ring: s/t (warm gray) at cols 3-12, rows 3-10');
console.log('  Embers (e): dark red-orange border inside ring');
console.log('  Fire (f): orange layer');
console.log('  Flame (y): yellow center, 4×2px at rows 6-7');
