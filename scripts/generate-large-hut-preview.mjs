#!/usr/bin/env node
// Generates large hut design preview: 96×48 native (6×3 tiles), 3 doorways.
// Ridge beam / longhouse roof — distinct angular silhouette vs dome huts.
// 8× scale on grass background.
//
// Run: ./scripts/preview.sh large-hut

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// === Palette (identical to small hut) ===
const C = {
  ".": null,
  T: [185, 155, 52],     // thatch base
  t: [158, 130, 40],     // thatch dark
  U: [205, 178, 75],     // thatch highlight
  u: [130, 108, 35],     // eave underside shadow
  R: [120, 95, 50],      // ridge beam (darker wood)
  b: [140, 112, 68],     // bamboo wall base
  h: [162, 138, 92],     // bamboo wall highlight
  j: [108, 82, 48],      // bamboo wall joint/dark
  D: [85, 75, 58],       // interior back wall
  d: [95, 85, 65],       // interior floor
  k: [35, 35, 35],       // panda black (dimmed)
  w: [225, 225, 220],    // panda white (dimmed)
  y: [195, 195, 190],    // panda gray belly (dimmed)
  s: [140, 120, 85],     // stone base
  S: [125, 105, 72],     // stone dark
};

const GRASS = [100, 145, 62];

// === Grid ===
const GW = 96, GH = 48;
const grid = Array.from({ length: GH }, () => Array(GW).fill("."));

function set(x, y, ch) {
  if (x >= 0 && x < GW && y >= 0 && y < GH) grid[y][x] = ch;
}
function hline(y, x1, x2, ch) {
  for (let x = x1; x <= x2; x++) set(x, y, ch);
}

// ──────────────────────────────────────
// Geometry
// ──────────────────────────────────────
const ROOF_H = 21;
const WL = 6, WR = 89;      // wall left/right edges
const WT = 22, WB = 43;     // wall top/bottom
const DOOR_FULL = 26;       // full-width opening from here down

// Ridge beam roof geometry
const RIDGE_W = 24;          // flat ridge width at peak
const RIDGE_ROWS = 5;        // rows of flat ridge (0-4)
const MAX_RW = 92;           // widest roof row (at base, row 20)

// Compute 3 doorway positions evenly within wall area
const DOOR_W = 16;
const wallWidth = WR - WL + 1;
const totalDoorW = 3 * DOOR_W;
const gap = Math.floor((wallWidth - totalDoorW) / 4);
const doors = [];
for (let i = 0; i < 3; i++) {
  const dl = WL + gap * (i + 1) + DOOR_W * i;
  doors.push({ dl, dr: dl + DOOR_W - 1 });
}

function inAnyDoorway(x, r) {
  for (const { dl, dr } of doors) {
    if (x < dl || x > dr) continue;
    if (r >= DOOR_FULL) return true;
    if (r >= WT) {
      const inset = DOOR_FULL - r;
      if (x >= dl + inset && x <= dr - inset) return true;
    }
  }
  return false;
}

// ──────────────────────────────────────
// 1. RIDGE BEAM ROOF (rows 0–20)
// ──────────────────────────────────────
// Flat ridge at top (rows 0-4), then straight angular slopes to full width.
// Distinct from the dome's sqrt curve — reads as a longhouse.
for (let r = 0; r < ROOF_H; r++) {
  let w;
  if (r < RIDGE_ROWS) {
    // Flat ridge section — constant width
    w = RIDGE_W;
  } else {
    // Linear slope from ridge width to max width
    const slopeFrac = (r - RIDGE_ROWS) / (ROOF_H - 1 - RIDGE_ROWS);
    w = Math.round(RIDGE_W + (MAX_RW - RIDGE_W) * slopeFrac);
  }
  const x1 = Math.floor((GW - w) / 2);
  const x2 = x1 + w - 1;

  // Base thatch fill
  hline(r, x1, x2, "T");

  // Dark edges (2px border)
  set(x1, r, "t"); if (w > 2) set(x1 + 1, r, "t");
  set(x2, r, "t"); if (w > 2) set(x2 - 1, r, "t");

  // Ridge beam detail — visible wood beam across top rows
  if (r < RIDGE_ROWS) {
    // Top and bottom border of ridge use beam color
    if (r === 0 || r === RIDGE_ROWS - 1) {
      hline(r, x1 + 2, x2 - 2, "R");
    }
    // Straw highlights on ridge body
    const off = (r % 2) * 2;
    for (let x = x1 + 3 + off; x < x2 - 2; x += 4) set(x, r, "U");
  } else {
    // Scattered straw highlights on slope (staggered every other row)
    const off = (r % 2) * 2;
    for (let x = x1 + 3 + off; x < x2 - 2; x += 5) set(x, r, "U");

    // Horizontal thatch layer lines every 4 rows on slope (tighter than dome)
    if (r > RIDGE_ROWS && (r - RIDGE_ROWS) % 4 === 0) {
      for (let x = x1 + 2; x <= x2 - 2; x++) {
        if ((x + r) % 3 !== 0) set(x, r, "t");
      }
    }
  }
}

// ──────────────────────────────────────
// 2. EAVE SHADOW (row 21)
// ──────────────────────────────────────
hline(21, 2, GW - 3, "u");

// ──────────────────────────────────────
// 3. BAMBOO WALLS + DOORWAYS (rows 22–43)
// ──────────────────────────────────────
for (let r = WT; r <= WB; r++) {
  for (let x = WL; x <= WR; x++) {
    if (inAnyDoorway(x, r)) {
      set(x, r, "D");
    } else {
      const rx = x - WL, ry = r - WT;
      if (ry % 7 === 0) set(x, r, "j");
      else if (rx % 4 === 0) set(x, r, "h");
      else set(x, r, "b");
    }
  }

  // Door frames
  if (r >= WT) {
    for (const { dl, dr } of doors) {
      const inset = r < DOOR_FULL ? (DOOR_FULL - r) : 0;
      const fl = dl + inset - 1, fr = dr - inset + 1;
      if (fl >= WL) set(fl, r, "j");
      if (fr <= WR) set(fr, r, "j");
    }
  }
}

// Door floors
for (let r = WB - 2; r <= WB; r++) {
  for (const { dl, dr } of doors) {
    hline(r, dl, dr, "d");
  }
}

// ──────────────────────────────────────
// 4. SLEEPING PANDAS IN DOORWAYS
// ──────────────────────────────────────
const SLEEP_ROWS = [
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  ".WWWKKKWWKKKWWW.",
  ".WWKKKKKWKKKKWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW..",
  "..WWWWWWWWWWWW..",
  "...WWWWWWWWWW...",
  "..KKKKKKKKKKKK..",
  ".KKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK",
  "KKKKWWWGGWWWKKKK",
  "KKKKWWGGGGWWKKKK",
  "KKKKWWGGGGWWKKKK",
  ".KKKWWWGGWWWKKK.",
  "..KKWWWWWWWWKK..",
];
const PANDA_MAP = { K: "k", W: "w", G: "y" };
const PANDA_Y = 25;

for (const { dl, dr } of doors) {
  for (let pr = 0; pr < SLEEP_ROWS.length; pr++) {
    const gr = PANDA_Y + pr;
    if (gr > WB) break;
    const row = SLEEP_ROWS[pr];
    for (let px = 0; px < 16; px++) {
      const ch = row[px];
      if (!ch || ch === "." || !PANDA_MAP[ch]) continue;
      const gx = dl + px;
      const inset = gr < DOOR_FULL ? Math.max(DOOR_FULL - gr, 0) : 0;
      if (gx >= dl + inset && gx <= dr - inset) {
        set(gx, gr, PANDA_MAP[ch]);
      }
    }
  }
}

// ──────────────────────────────────────
// 5. STONE FOUNDATION (rows 44–47)
// ──────────────────────────────────────
for (let r = 44; r < GH; r++) {
  hline(r, WL - 1, WR + 1, r % 2 === 0 ? "s" : "S");
}

// ══════════════════════════════════════
// RENDER
// ══════════════════════════════════════
const nat = new PNG({ width: GW, height: GH });
for (let i = 0; i < nat.data.length; i += 4) {
  nat.data[i] = nat.data[i + 1] = nat.data[i + 2] = 0;
  nat.data[i + 3] = 0;
}
for (let y = 0; y < GH; y++) {
  for (let x = 0; x < GW; x++) {
    const ch = grid[y][x];
    const color = C[ch];
    if (!color) continue;
    const i = (y * GW + x) * 4;
    nat.data[i] = color[0]; nat.data[i + 1] = color[1];
    nat.data[i + 2] = color[2]; nat.data[i + 3] = 255;
  }
}

const SCALE = 8;
const bW = GW * SCALE, bH = GH * SCALE;
const big = new PNG({ width: bW, height: bH });
for (let i = 0; i < big.data.length; i += 4) {
  big.data[i] = GRASS[0]; big.data[i + 1] = GRASS[1];
  big.data[i + 2] = GRASS[2]; big.data[i + 3] = 255;
}
for (let y = 0; y < GH; y++) {
  for (let x = 0; x < GW; x++) {
    const si = (y * GW + x) * 4;
    if (nat.data[si + 3] === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const di = ((y * SCALE + sy) * bW + (x * SCALE + sx)) * 4;
        big.data[di] = nat.data[si]; big.data[di + 1] = nat.data[si + 1];
        big.data[di + 2] = nat.data[si + 2]; big.data[di + 3] = 255;
      }
    }
  }
}

const outDir = join(__dirname, "..", "webview-ui", "public", "assets");
const outPath = join(outDir, "large_hut_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Large hut: 96×48 native (6×3 tiles), 3 doorways");
console.log("Ridge beam longhouse roof, bamboo walls, 3 arched doorways with pandas");
