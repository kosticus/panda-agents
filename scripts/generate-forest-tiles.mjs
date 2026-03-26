#!/usr/bin/env node
/**
 * Generate bamboo forest floor and wall tile PNGs.
 *
 * floors.png: 112×16 (7 tiles of 16×16) — grayscale patterns colored at runtime
 * walls.png:  64×128 (4×4 grid of 16×32 auto-tile sprites)
 *
 * Also updates the persisted layout colors to forest theme.
 */

import { PNG } from "pngjs";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const TILE = 16;
const WALL_H = 32;

// ── Helpers ─────────────────────────────────────────────────────────────

function makeFloorPattern(fn) {
  const data = [];
  for (let y = 0; y < TILE; y++) {
    const row = [];
    for (let x = 0; x < TILE; x++) {
      row.push(fn(x, y));
    }
    data.push(row);
  }
  return data;
}

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 16) / 32768;
  };
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ── Floor patterns (7 × 16×16, grayscale) ──────────────────────────────

// Pattern 1: Grass — scattered light/dark tufts
const grass1 = makeFloorPattern((x, y) => {
  const r = seededRand(x * 17 + y * 131);
  const v = r();
  if (v < 0.08) return 95;
  if (v < 0.2) return 115;
  if (v < 0.35) return 130;
  return 120;
});

// Pattern 2: Bamboo plank flooring — horizontal slats with grain
const bambooFloor = makeFloorPattern((x, y) => {
  // Plank boundaries every 4 pixels with offset
  const plankH = 4;
  const plankIdx = Math.floor(y / plankH);
  const inPlank = y % plankH;
  const r = seededRand(plankIdx * 71 + x * 13);

  // Seam between planks
  if (inPlank === 0) return 95;

  // Base brightness per plank (alternating light/dark for variety)
  const base = (plankIdx % 3 === 0) ? 155 : (plankIdx % 3 === 1) ? 145 : 150;

  // Wood grain — subtle horizontal streaks
  const grain = seededRand(x * 7 + y * 3 + plankIdx * 31);
  const g = grain();
  if (g < 0.06) return base - 20; // dark knot
  if (g < 0.15) return base - 10; // dark grain line
  if (g < 0.3) return base + 5;   // light grain
  return base;
});

// Pattern 3: Dirt/packed earth
const dirt = makeFloorPattern((x, y) => {
  const r = seededRand(x * 23 + y * 71 + 13);
  const v = r();
  if (v < 0.1) return 85;
  if (v < 0.25) return 100;
  if (v < 0.4) return 115;
  return 105;
});

// Pattern 4: Stone stepping path
const stone = makeFloorPattern((x, y) => {
  const shifted = (Math.floor(y / 4) % 2 === 1) ? (x + 2) % TILE : x;
  const sgx = shifted % 5;
  const gy = y % 4;
  if (sgx === 0 || gy === 0) return 90;
  const r = seededRand(Math.floor(shifted / 5) * 7 + Math.floor(y / 4) * 13);
  return 120 + Math.floor(r() * 25);
});

// Pattern 5: Bamboo plank (vertical) — parquet-style variation
const bambooFloorV = makeFloorPattern((x, y) => {
  const plankW = 3;
  const plankIdx = Math.floor(x / plankW);
  const inPlank = x % plankW;

  // Seam between planks
  if (inPlank === 0) return 90;

  // Alternating brightness per plank
  const base = (plankIdx % 4 === 0) ? 160 : (plankIdx % 4 === 1) ? 148 : (plankIdx % 4 === 2) ? 155 : 142;

  // Vertical grain
  const grain = seededRand(y * 11 + x * 5 + plankIdx * 23);
  const g = grain();
  if (g < 0.05) return base - 18;
  if (g < 0.12) return base - 8;
  if (g < 0.25) return base + 6;
  return base;
});

// Pattern 6: Dense forest floor — dark leaf litter
const dense = makeFloorPattern((x, y) => {
  const r = seededRand(x * 53 + y * 37 + 23);
  const v = r();
  if (v < 0.05) return 75;
  if (v < 0.12) return 85;
  if (v < 0.25) return 105;
  if (v < 0.4) return 95;
  return 90;
});

// Pattern 7: Light meadow grass
const meadow = makeFloorPattern((x, y) => {
  const r = seededRand(x * 31 + y * 97 + 7);
  const v = r();
  if (v < 0.06) return 105;
  if (v < 0.15) return 125;
  if (v < 0.3) return 140;
  return 135;
});

const floorPatterns = [grass1, bambooFloor, dirt, stone, bambooFloorV, dense, meadow];

// ── Wall sprites (16 × 16×32 auto-tiles, bamboo stalks) ────────────────

// Each auto-tile mask gets a unique stalk configuration seeded by the mask value.
// Stalks vary in: count (2-5), width (1-5px), position, height offset,
// node spacing, lean angle, and leaf density.

function drawStalk(data, stalk, topY, botY, W, H, si, r) {
  const halfW = Math.floor(stalk.w / 2);
  const nodeSpacing = stalk.nodeSpacing || (5 + si * 2) % 4 + 5;
  const lean = stalk.lean || 0; // px shift over full height

  for (let y = topY; y <= botY; y++) {
    const progress = (y - topY) / (botY - topY || 1);
    const leanOff = Math.round(lean * progress);

    for (let dx = -halfW; dx <= halfW; dx++) {
      const px = stalk.cx + dx + leanOff;
      if (px < 0 || px >= W) continue;

      const edgeDist = Math.abs(dx);
      let val;

      // Cylindrical shading scaled to width
      if (stalk.w >= 5) {
        if (edgeDist === 0) val = 180;
        else if (edgeDist === 1) val = 155;
        else if (edgeDist === 2) val = 125;
        else val = 100;
      } else if (stalk.w >= 4) {
        if (edgeDist === 0) val = 170;
        else if (edgeDist === 1) val = 140;
        else val = 105;
      } else if (stalk.w >= 3) {
        if (edgeDist === 0) val = 160;
        else val = 118;
      } else if (stalk.w >= 2) {
        val = edgeDist === 0 ? 150 : 112;
      } else {
        val = 135; // single-pixel stalk
      }

      // Bamboo nodes — very dark ring (reads as brown segment against green)
      const nodeY = (y + (stalk.nodeOff || 0)) % nodeSpacing;
      if (nodeY === 0 && y > topY + 2 && y < botY - 2) {
        val = clamp(val - 55, 40, 255); // much darker node line
      } else if ((nodeY === 1 || nodeY === nodeSpacing - 1) && y > topY + 2 && y < botY - 2) {
        val = clamp(val - 20, 40, 255); // darker surround
      }

      // Subtle grain
      const grain = seededRand(px * 3 + y * 7 + si * 31 + (stalk.cx * 11));
      val = clamp(val + Math.floor(grain() * 10) - 5, 50, 255);

      data[y][px] = val;
    }
  }

  // Stalk cap if exposed top
  if (topY > 0) {
    const capW = Math.max(1, halfW - 1);
    for (let dx = -capW; dx <= capW; dx++) {
      const px = stalk.cx + dx;
      if (px >= 0 && px < W) data[topY - 1][px] = 95;
    }
    if (stalk.cx >= 0 && stalk.cx < W && topY >= 2) {
      data[topY - 2][stalk.cx] = 80;
    }
  }
}

function addLeaves(data, stalk, topY, botY, W, H, si, r) {
  const halfW = Math.floor(stalk.w / 2);

  // 3-6 leaf sprigs per stalk at various heights, alternating sides
  const leafCount = 3 + Math.floor(r() * 4);
  for (let lc = 0; lc < leafCount; lc++) {
    const dir = ((si + lc) % 2 === 0) ? 1 : -1;
    const range = botY - topY;
    const baseY = topY + Math.floor(r() * range * 0.8);
    const reach = 3 + Math.floor(r() * 4); // 3-6 pixels long

    // Each leaf is a thin diagonal line — 1px wide, angling outward and down
    for (let i = 0; i < reach; i++) {
      const lx = stalk.cx + dir * (halfW + 1 + i);
      // Diagonal: each pixel steps 1 right and ~0.7 down (drooping frond)
      const ly = baseY + Math.floor(i * 0.7);
      if (lx >= 0 && lx < W && ly >= 0 && ly < H && data[ly][lx] === 0) {
        // Bright at base, fading toward tip
        const fade = 1 - (i / reach) * 0.3;
        data[ly][lx] = Math.floor((140 + r() * 20) * fade);
      }
    }
  }
}

function makeWallSprite(mask, variant = 0) {
  const hasN = !!(mask & 1);
  const hasE = !!(mask & 2);
  const hasS = !!(mask & 4);
  const hasW = !!(mask & 8);

  const W = TILE;
  const H = WALL_H;
  const data = [];
  for (let y = 0; y < H; y++) data.push(new Array(W).fill(0));

  // Different seed per variant so each variant has unique stalk arrangement
  const r = seededRand(mask * 53 + 17 + variant * 7919);

  // Generate stalk positions — random placement, not evenly distributed
  const stalks = [];
  const numStalks = 2 + Math.floor(r() * 3); // 2-4 stalks

  const margin = (hasW ? 0 : 1);
  const endMargin = (hasE ? W : W - 1);

  // Place stalks at fully random x positions (with minimum spacing)
  const usedX = [];
  for (let i = 0; i < numStalks; i++) {
    let cx;
    let attempts = 0;
    do {
      cx = margin + Math.floor(r() * (endMargin - margin));
      attempts++;
    } while (attempts < 10 && usedX.some(ux => Math.abs(ux - cx) < 3));
    usedX.push(cx);

    // Mix of widths — mostly thin
    const widthRoll = r();
    let w;
    if (widthRoll < 0.35) w = 1;
    else if (widthRoll < 0.65) w = 2;
    else if (widthRoll < 0.85) w = 3;
    else w = 4;

    const lean = Math.floor(r() * 3) - 1;

    stalks.push({
      cx,
      w,
      nodeOff: Math.floor(r() * 7),
      nodeSpacing: 4 + Math.floor(r() * 4),
      lean: (hasN && hasS) ? 0 : lean,
    });
  }

  // Draw stalks
  for (let si = 0; si < stalks.length; si++) {
    const stalk = stalks[si];
    const topY = hasN ? 0 : 1 + Math.floor(r() * 3);
    const botY = hasS ? H - 1 : H - 2 - Math.floor(r() * 3);
    drawStalk(data, stalk, topY, botY, W, H, si, r);

    // Leaves along the stalk — more on exposed tops, fewer on interior stalks
    addLeaves(data, stalk, topY, botY, W, H, si, r);
  }

  // Horizontal bamboo ties between stalks on continuous walls
  if (hasE || hasW) {
    const tieCount = 1 + Math.floor(r() * 2);
    for (let t = 0; t < tieCount; t++) {
      const tieY = 8 + Math.floor(r() * (H - 16));
      for (let x = 0; x < W; x++) {
        if (data[tieY][x] === 0) {
          data[tieY][x] = 85 + Math.floor(r() * 15);
        }
      }
    }
  }

  // Sparse background shadow (just enough to avoid fully transparent gaps)
  const bgR = seededRand(mask * 71 + 41 + variant * 3571);
  for (let y = 2; y < H - 2; y++) {
    for (let x = 0; x < W; x++) {
      if (data[y][x] === 0 && bgR() < 0.12) {
        data[y][x] = 50 + Math.floor(bgR() * 15);
      }
    }
  }

  // Ground shadow
  if (!hasS) {
    for (let x = 0; x < W; x++) {
      for (let dy = 1; dy <= 2; dy++) {
        if (H - dy >= 0 && data[H - dy][x] > 0 && H - dy + 1 < H && data[H - dy + 1][x] === 0) {
          data[H - dy + 1][x] = 45;
        }
      }
    }
  }

  return data;
}

const WALL_VARIANTS = 4;
const wallSprites = [];
for (let variant = 0; variant < WALL_VARIANTS; variant++) {
  for (let mask = 0; mask < 16; mask++) {
    wallSprites.push(makeWallSprite(mask, variant));
  }
}

// ── PNG generation ──────────────────────────────────────────────────────

function createFloorsPNG(patterns) {
  const w = patterns.length * TILE;
  const h = TILE;
  const png = new PNG({ width: w, height: h });

  for (let i = 0; i < patterns.length; i++) {
    const pat = patterns[i];
    for (let y = 0; y < TILE; y++) {
      for (let x = 0; x < TILE; x++) {
        const idx = ((y * w) + (i * TILE + x)) * 4;
        const v = pat[y][x];
        png.data[idx] = v;
        png.data[idx + 1] = v;
        png.data[idx + 2] = v;
        png.data[idx + 3] = 255;
      }
    }
  }
  return PNG.sync.write(png);
}

function createWallsPNG(sprites) {
  const cols = 4;
  const rows = Math.ceil(sprites.length / cols);
  const w = cols * TILE;
  const h = rows * WALL_H;
  const png = new PNG({ width: w, height: h });

  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 0;
    png.data[i + 1] = 0;
    png.data[i + 2] = 0;
    png.data[i + 3] = 0;
  }

  for (let si = 0; si < sprites.length; si++) {
    const sprite = sprites[si];
    const col = si % cols;
    const row = Math.floor(si / cols);
    const ox = col * TILE;
    const oy = row * WALL_H;

    for (let y = 0; y < WALL_H; y++) {
      for (let x = 0; x < TILE; x++) {
        const v = sprite[y][x];
        if (v === 0) continue;
        const idx = ((oy + y) * w + (ox + x)) * 4;
        png.data[idx] = v;
        png.data[idx + 1] = v;
        png.data[idx + 2] = v;
        png.data[idx + 3] = 255;
      }
    }
  }
  return PNG.sync.write(png);
}

// ── Update persisted layout colors ──────────────────────────────────────

function updateLayoutColors() {
  const layoutPath = join(homedir(), ".pixel-agents", "layout.json");
  if (!existsSync(layoutPath)) {
    console.log("No persisted layout found, skipping color update");
    return;
  }

  const layout = JSON.parse(readFileSync(layoutPath, "utf-8"));

  // Forest color palette for each floor type
  const forestColors = {
    1: { h: 110, s: 30, b: 8, c: 0 },    // FLOOR_1: grass green
    2: { h: 35, s: 35, b: 15, c: 0 },     // FLOOR_2: bamboo plank (warm light brown)
    3: { h: 30, s: 25, b: 0, c: 0 },      // FLOOR_3: packed dirt (dark brown)
    4: { h: 40, s: 12, b: 15, c: 0 },     // FLOOR_4: stone path (gray-tan)
    5: { h: 30, s: 30, b: 18, c: 0 },     // FLOOR_5: bamboo plank vertical (light brown)
    6: { h: 120, s: 35, b: 0, c: 0 },     // FLOOR_6: dark forest floor (deep green)
    7: { h: 95, s: 25, b: 12, c: 0 },     // FLOOR_7: meadow (light green)
  };

  // Wall color — bamboo green with per-tile hue variation for variety
  const wallRand = seededRand(42);

  const { tiles } = layout;
  const newColors = [];

  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    if (t === 0) {
      // Green bamboo with slight per-tile variation so adjacent walls differ
      const hueJitter = Math.floor(wallRand() * 20) - 10; // ±10
      const satJitter = Math.floor(wallRand() * 10) - 5;  // ±5
      newColors.push({ h: 115 + hueJitter, s: 35 + satJitter, b: 3, c: 0 });
    } else if (t >= 1 && t <= 7) {
      // Force all floor tiles to bamboo plank pattern + brown color
      tiles[i] = 2; // horizontal bamboo plank pattern
      newColors.push({ h: 35, s: 35, b: 15, c: 0 });
    } else {
      newColors.push(null);
    }
  }

  layout.tileColors = newColors;
  writeFileSync(layoutPath, JSON.stringify(layout, null, 2));
  console.log(`Updated ${layoutPath} with forest colors`);
}

// ── Main ────────────────────────────────────────────────────────────────

const assetsDir = join(new URL(".", import.meta.url).pathname, "..", "webview-ui", "public", "assets");

const floorsBuf = createFloorsPNG(floorPatterns);
writeFileSync(join(assetsDir, "floors.png"), floorsBuf);
console.log(`Created floors.png (${floorsBuf.length} bytes)`);

const wallsBuf = createWallsPNG(wallSprites);
writeFileSync(join(assetsDir, "walls.png"), wallsBuf);
console.log(`Created walls.png (${wallsBuf.length} bytes)`);

updateLayoutColors();

console.log("Done! Restart server to see changes.");
