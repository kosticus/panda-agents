#!/usr/bin/env node
// Generates hut design preview: small round bamboo hut with thatch roof
// and arched doorway showing panda inside.
// Small hut: 48×48 native (3×3 tiles), 8× scale on grass background.
//
// Tweak colors in C, shape params in sections 1–5. Run: ./scripts/preview.sh hut

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// === Palette ===
const C = {
  ".": null,
  // Thatch roof (golden-yellow straw — distinct from brown walls below)
  T: [185, 155, 52],     // thatch base (saturated golden)
  t: [158, 130, 40],     // thatch dark (shadow/edge)
  U: [205, 178, 75],     // thatch highlight (bright straw)
  u: [130, 108, 35],     // eave underside shadow
  // Bamboo walls (processed/dried — woody brown, distinct from golden thatch above)
  b: [140, 112, 68],     // dried bamboo base (brown, not tan)
  h: [162, 138, 92],     // dried bamboo highlight
  j: [108, 82, 48],      // dried bamboo joint/dark
  // Interior (warm brown — light enough for black ears to read against)
  D: [85, 75, 58],       // interior back wall
  d: [95, 85, 65],       // interior floor (slightly lighter)
  // Panda inside (sleep frame 1, dimmed for interior shadow)
  k: [35, 35, 35],       // panda black (slight dim from original 30)
  w: [225, 225, 220],    // panda white (slight dim from original 245)
  y: [195, 195, 190],    // panda gray belly (slight dim from original 215)
  // Foundation
  s: [140, 120, 85],     // stone base
  S: [125, 105, 72],     // stone dark
};

const GRASS = [100, 145, 62];

// === Grid ===
const GW = 48, GH = 48;
const grid = Array.from({ length: GH }, () => Array(GW).fill("."));

function set(x, y, ch) {
  if (x >= 0 && x < GW && y >= 0 && y < GH) grid[y][x] = ch;
}
function hline(y, x1, x2, ch) {
  for (let x = x1; x <= x2; x++) set(x, y, ch);
}

// ──────────────────────────────────────
// 1. THATCH DOME ROOF (rows 0–20)
// ──────────────────────────────────────
// Elliptical dome: starts narrow at peak, widens via sqrt curve.
// MAX_RW = widest roof row, MIN_RW = peak width.
const ROOF_H = 21, MAX_RW = 44, MIN_RW = 6;

for (let r = 0; r < ROOF_H; r++) {
  const frac = r / (ROOF_H - 1); // 0 at peak → 1 at base
  const w = Math.round(MIN_RW + (MAX_RW - MIN_RW) * Math.sqrt(frac));
  const x1 = Math.floor((GW - w) / 2);
  const x2 = x1 + w - 1;

  // Base thatch fill
  hline(r, x1, x2, "T");

  // Dark edges (2px border)
  set(x1, r, "t"); if (w > 2) set(x1 + 1, r, "t");
  set(x2, r, "t"); if (w > 2) set(x2 - 1, r, "t");

  // Scattered straw highlights (staggered every other row)
  const off = (r % 2) * 2;
  for (let x = x1 + 3 + off; x < x2 - 2; x += 5) set(x, r, "U");

  // Horizontal thatch layer lines every 5 rows (mimics layered straw)
  if (r > 0 && r % 5 === 0) {
    for (let x = x1 + 2; x <= x2 - 2; x++) {
      if ((x + r) % 3 !== 0) set(x, r, "t");
    }
  }
}

// ──────────────────────────────────────
// 2. EAVE SHADOW (row 21)
// ──────────────────────────────────────
// Dark line under roof overhang — signals where roof ends and walls begin.
hline(21, 2, 45, "u");

// ──────────────────────────────────────
// 3. BAMBOO WALLS + DOORWAY (rows 22–43)
// ──────────────────────────────────────
// Walls are narrower than roof → overhang reads as eave.
// Bamboo texture: vertical stalks (h every 4px), horizontal joints (j every 7 rows).
const WL = 6, WR = 41;   // wall left/right edges (36px wide)
const WT = 22, WB = 43;  // wall top/bottom

// Doorway: arched opening, 16px wide at full (fits sleeping panda sprite).
const DL = 16, DR = 31;  // door full-width left/right
const ARCH_TOP = 22;      // arch peak starts here
const DOOR_FULL = 26;     // full-width opening from here down

for (let r = WT; r <= WB; r++) {
  for (let x = WL; x <= WR; x++) {
    const inDoorX = x >= DL && x <= DR;

    // Arch: rows 23–25, progressively wider (inset shrinks by 1 each row)
    let inArch = false;
    if (r >= ARCH_TOP && r < DOOR_FULL && inDoorX) {
      const inset = DOOR_FULL - r; // 3 → 2 → 1
      inArch = x >= DL + inset && x <= DR - inset;
    }

    if ((r >= DOOR_FULL && inDoorX) || inArch) {
      set(x, r, "D"); // dark interior
    } else {
      // Bamboo wall texture
      const rx = x - WL, ry = r - WT;
      if (ry % 7 === 0) set(x, r, "j");        // joint row
      else if (rx % 4 === 0) set(x, r, "h");    // highlight stalk
      else set(x, r, "b");                       // base bamboo
    }
  }

  // Door frame: dark bamboo border around opening
  if (r >= ARCH_TOP) {
    const inset = r < DOOR_FULL ? (DOOR_FULL - r) : 0;
    const fl = DL + inset - 1, fr = DR - inset + 1;
    if (fl >= WL) set(fl, r, "j");
    if (fr <= WR) set(fr, r, "j");
  }
}

// Door floor — slightly lighter to suggest depth
for (let r = WB - 2; r <= WB; r++) hline(r, DL, DR, "d");

// ──────────────────────────────────────
// 4. SLEEPING PANDA IN DOORWAY
// ──────────────────────────────────────
// Embeds sleep frame 1 (head-up slump) from generate-sleep-preview.mjs.
// Rows 4–23 of the sleep sprite (ears through lap — legs hidden inside).
// Colors mapped: K→k, W→w, G→y (dimmed for interior shadow).
const SLEEP_ROWS = [
  "..KKKK..KKKK....",  // ears
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",  // ear base
  "..WWWWWWWWWWWW..",  // head
  ".WWWWWWWWWWWWWW.",  // head widest
  ".WWWKKKWWKKKWWW.",  // eye patches
  ".WWKKKKKWKKKKWW.",  // eyes shut
  ".WWWKKKWWKKKWWW.",  // eye patches
  "..WWWWWKKWWWWW..",  // nose
  "..WWWWWWWWWWWW..",  // lower face
  "...WWWWWWWWWW...",  // chin
  "..KKKKKKKKKKKK..",  // band 1
  ".KKKKKKKKKKKKKKK",  // band 2
  "KKKKKKKKKKKKKKKK",  // band 3
  "KKKKWWWGGWWWKKKK",  // body
  "KKKKWWGGGGWWKKKK",  // belly
  "KKKKWWGGGGWWKKKK",  // belly
  ".KKKWWWGGWWWKKK.",  // body narrows
  "..KKWWWWWWWWKK..",  // lap/paws
];
const PANDA_MAP = { K: "k", W: "w", G: "y" };
const PANDA_Y = 25; // grid row where panda row 0 (ears) starts

for (let pr = 0; pr < SLEEP_ROWS.length; pr++) {
  const gr = PANDA_Y + pr;
  if (gr > WB) break;
  const row = SLEEP_ROWS[pr];
  for (let px = 0; px < 16; px++) {
    const ch = row[px];
    if (!ch || ch === "." || !PANDA_MAP[ch]) continue;
    const gx = DL + px; // panda left edge aligns with door left
    // Only draw within the doorway opening (respects arch clipping)
    const inset = gr < DOOR_FULL ? Math.max(DOOR_FULL - gr, 0) : 0;
    if (gx >= DL + inset && gx <= DR - inset) {
      set(gx, gr, PANDA_MAP[ch]);
    }
  }
}

// ──────────────────────────────────────
// 5. STONE FOUNDATION (rows 44–47)
// ──────────────────────────────────────
// Slightly wider than walls to ground the structure.
for (let r = 44; r < GH; r++) {
  hline(r, WL - 1, WR + 1, r % 2 === 0 ? "s" : "S");
}

// ══════════════════════════════════════
// RENDER
// ══════════════════════════════════════
// Native-resolution PNG
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

// 8× scale on grass background
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
const outPath = join(outDir, "hut_preview_8x.png");
writeFileSync(outPath, PNG.sync.write(big));
console.log(`Wrote ${outPath}`);
console.log("Small hut: 48×48 native (3×3 tiles)");
console.log("Thatch dome roof, bamboo walls, arched doorway with panda inside");
