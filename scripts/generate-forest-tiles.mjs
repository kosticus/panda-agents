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

// Pattern 3: Dirt/packed earth — very smooth with gentle variation
const dirt = makeFloorPattern((x, y) => {
  // Broad gradient using large blocks (5×5) for nearly flat appearance
  const bx = Math.floor(x / 5), by = Math.floor(y / 5);
  const r1 = seededRand(bx * 41 + by * 67 + 11);
  const base = 108 + Math.floor(r1() * 6) - 3; // 105–111, very tight range
  // Rare subtle speck
  const r2 = seededRand(x * 23 + y * 71 + 13);
  const v = r2();
  if (v < 0.02) return base - 5;
  if (v < 0.04) return base + 4;
  return base;
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

      // Bamboo nodes — subtle dark ring
      const nodeY = (y + (stalk.nodeOff || 0)) % nodeSpacing;
      if (nodeY === 0 && y > topY + 2 && y < botY - 2) {
        val = clamp(val - 25, 60, 255); // gentle node line
      } else if ((nodeY === 1 || nodeY === nodeSpacing - 1) && y > topY + 2 && y < botY - 2) {
        val = clamp(val - 10, 60, 255); // slight surround
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
  const numStalks = 2 + Math.floor(r() * 2); // 2-3 stalks (fewer but thicker)

  const margin = (hasW ? 0 : 2);
  const endMargin = (hasE ? W : W - 2);

  // Place stalks with variant-dependent x-offset to prevent alignment across tiles
  // Each variant shifts stalks by a different amount so vertically-adjacent tiles don't line up
  const xBias = (variant * 4) % W;
  const usedX = [];
  for (let i = 0; i < numStalks; i++) {
    let cx;
    let attempts = 0;
    do {
      cx = margin + ((Math.floor(r() * (endMargin - margin)) + xBias) % (endMargin - margin));
      attempts++;
    } while (attempts < 15 && usedX.some(ux => Math.abs(ux - cx) < 4));
    usedX.push(cx);

    // Thicker stalks — minimum width 3
    const widthRoll = r();
    let w;
    if (widthRoll < 0.5) w = 3;
    else if (widthRoll < 0.8) w = 4;
    else w = 5;

    // Lean slightly to break vertical alignment across tiles
    const lean = Math.floor(r() * 5) - 2; // -2 to +2

    stalks.push({
      cx,
      w,
      nodeOff: Math.floor(r() * 7),
      nodeSpacing: 4 + Math.floor(r() * 4),
      lean,
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
        data[y][x] = 75 + Math.floor(bgR() * 15);
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

/** Construction bamboo — even spacing, uniform width, no leaves, tightly packed */
function makeConstructionWallSprite(mask, variant = 0) {
  const hasN = !!(mask & 1);
  const hasE = !!(mask & 2);
  const hasS = !!(mask & 4);
  const hasW = !!(mask & 8);

  const W = TILE;
  const H = WALL_H;
  const data = [];
  for (let y = 0; y < H; y++) data.push(new Array(W).fill(0));

  const r = seededRand(mask * 37 + 113 + variant * 4951);

  // Even, tightly-packed stalks — 3-4 across the tile, width 3-4
  const numStalks = 3 + Math.floor(r() * 2);
  const spacing = W / (numStalks + 1);
  const stalkWidth = 3 + (variant % 2); // alternating 3 and 4 px

  // Variant-dependent offset so hut walls don't create continuous lines
  const cxBias = (variant * 3) % Math.floor(spacing);
  const stalks = [];
  for (let i = 0; i < numStalks; i++) {
    const cx = Math.round(spacing * (i + 1) + cxBias) % W;
    stalks.push({
      cx: clamp(cx, 1, W - 2),
      w: stalkWidth,
      nodeOff: Math.floor(r() * 3) + i * 2, // staggered nodes for visual interest
      nodeSpacing: 5 + Math.floor(r() * 2),  // consistent spacing
      lean: 0, // perfectly vertical
    });
  }

  // Draw stalks (no lean, uniform)
  for (let si = 0; si < stalks.length; si++) {
    const stalk = stalks[si];
    const topY = hasN ? 0 : 0;  // flush to top for construction
    const botY = hasS ? H - 1 : H - 1;  // flush to bottom
    drawStalk(data, stalk, topY, botY, W, H, si, r);
  }

  // Horizontal bamboo ties — more regular, 2-3 evenly spaced
  const tieCount = 2 + Math.floor(r() * 2);
  const tieSpacing = Math.floor(H / (tieCount + 1));
  for (let t = 0; t < tieCount; t++) {
    const tieY = tieSpacing * (t + 1);
    if (tieY >= 0 && tieY < H) {
      for (let x = 0; x < W; x++) {
        // Subtle tie line — only slightly darker than stalks
        data[tieY][x] = Math.max(data[tieY][x], 110 + Math.floor(r() * 10));
      }
    }
  }

  // Fill ALL remaining gaps — a construction wall should be solid, no transparency
  const bgR = seededRand(mask * 83 + 29 + variant * 2347);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[y][x] === 0) {
        // Mid-tone fill simulating bamboo behind the front stalks
        data[y][x] = 90 + Math.floor(bgR() * 20);
      }
    }
  }

  return data;
}

// Variants 0-3: wild forest bamboo (random stalks, leaves, irregular)
// Variants 4-7: construction bamboo (even spacing, uniform width, no leaves, tight)
const FOREST_VARIANTS = 4;
const CONSTRUCTION_VARIANTS = 4;
const WALL_VARIANTS = FOREST_VARIANTS + CONSTRUCTION_VARIANTS;
const wallSprites = [];

// Forest variants
for (let variant = 0; variant < FOREST_VARIANTS; variant++) {
  for (let mask = 0; mask < 16; mask++) {
    wallSprites.push(makeWallSprite(mask, variant));
  }
}

// Construction variants — regular, evenly-spaced bamboo for huts
for (let variant = 0; variant < CONSTRUCTION_VARIANTS; variant++) {
  for (let mask = 0; mask < 16; mask++) {
    wallSprites.push(makeConstructionWallSprite(mask, variant));
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

// ── Village layout generation ────────────────────────────────────────────

function generateVillageLayout() {
  const cols = 45;
  const rows = 30;

  // 0=wall(forest), 1=grass, 2=bamboo plank, 3=dirt path
  const tiles = new Array(cols * rows).fill(0);

  const set = (c, r, v) => {
    if (c >= 0 && c < cols && r >= 0 && r < rows) tiles[r * cols + c] = v;
  };
  const get = (c, r) => (c >= 0 && c < cols && r >= 0 && r < rows) ? tiles[r * cols + c] : 0;

  // Step 1: Carve a large organic clearing (grass)
  const cx = 22, cy = 15;
  const noiseR = seededRand(777);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = (c - cx) / 19;
      const dy = (r - cy) / 12;
      const dist = dx * dx + dy * dy;
      const noise = noiseR() * 0.25 - 0.125;
      if (dist < 0.85 + noise) {
        set(c, r, 1); // grass
      }
    }
  }

  // Keep a 1-tile forest border on all edges
  for (let c = 0; c < cols; c++) { set(c, 0, 0); set(c, rows - 1, 0); }
  for (let r = 0; r < rows; r++) { set(0, r, 0); set(cols - 1, r, 0); }

  // Step 2: Place huts — wall border with plank interior (shelter only, no furniture)
  const huts = [
    { x: 5,  y: 3,  door: 'south' },  // NW
    { x: 33, y: 4,  door: 'south' },  // NE
    { x: 7,  y: 21, door: 'north' },  // SW
    { x: 34, y: 22, door: 'north' },  // SE
  ];

  for (const hut of huts) {
    for (let dr = 0; dr < 5; dr++) {
      for (let dc = 0; dc < 5; dc++) {
        const c = hut.x + dc, r = hut.y + dr;
        if (dr === 0 || dr === 4 || dc === 0 || dc === 4) {
          set(c, r, 0); // wall
        } else {
          set(c, r, 2); // plank floor
        }
      }
    }
    if (hut.door === 'south') {
      set(hut.x + 2, hut.y + 4, 2);
      set(hut.x + 2, hut.y + 5, 1); // grass below door
    } else {
      set(hut.x + 2, hut.y, 2);
      set(hut.x + 2, hut.y - 1, 1); // grass above door
    }
  }

  // Step 3: Central workspace hub — large dirt area with workstations
  // Hub: cols 14-30, rows 11-18 (17×8)
  for (let r = 11; r <= 18; r++) {
    for (let c = 14; c <= 30; c++) {
      set(c, r, 3); // dirt
    }
  }

  // Step 4: Paths from huts to hub — 2-wide dirt
  function drawPathH(r, c1, c2) {
    const lo = Math.min(c1, c2), hi = Math.max(c1, c2);
    for (let c = lo; c <= hi; c++) {
      if (get(c, r) === 1) set(c, r, 3);
      if (get(c, r + 1) === 1) set(c, r + 1, 3);
    }
  }
  function drawPathV(c, r1, r2) {
    const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
    for (let r = lo; r <= hi; r++) {
      if (get(c, r) === 1) set(c, r, 3);
      if (get(c + 1, r) === 1) set(c + 1, r, 3);
    }
  }

  // NW hut (5,3) south door at col 7, row 7
  drawPathV(7, 8, 11);
  drawPathH(11, 7, 14);

  // NE hut (33,4) south door at col 35, row 8
  drawPathV(35, 9, 11);
  drawPathH(11, 30, 35);

  // SW hut (7,21) north door at col 9, row 21
  drawPathV(9, 18, 20);
  drawPathH(18, 9, 14);

  // SE hut (34,22) north door at col 36, row 22
  drawPathV(36, 18, 21);
  drawPathH(18, 30, 36);

  // Step 5: Furniture — workstations in hub, pandas face inward
  const furniture = [];

  // Top row: desks at row 11, chairs at row 13 (face UP toward desk)
  furniture.push({ uid: "hub-desk-1",  type: "desk",  col: 16, row: 11 });
  furniture.push({ uid: "hub-chair-1", type: "chair", col: 17, row: 13 });

  furniture.push({ uid: "hub-desk-2",  type: "desk",  col: 24, row: 11 });
  furniture.push({ uid: "hub-chair-2", type: "chair", col: 25, row: 13 });

  // Bottom row: desks at row 17, chairs at row 16 (face DOWN toward desk)
  furniture.push({ uid: "hub-desk-3",  type: "desk",  col: 16, row: 17 });
  furniture.push({ uid: "hub-chair-3", type: "chair", col: 17, row: 16 });

  furniture.push({ uid: "hub-desk-4",  type: "desk",  col: 24, row: 17 });
  furniture.push({ uid: "hub-chair-4", type: "chair", col: 25, row: 16 });

  // Left side: desk at col 14, chair faces LEFT
  furniture.push({ uid: "hub-desk-5",  type: "desk",  col: 14, row: 14 });
  furniture.push({ uid: "hub-chair-5", type: "chair", col: 16, row: 14 });

  // Right side: desk at col 29, chair faces RIGHT
  furniture.push({ uid: "hub-desk-6",  type: "desk",  col: 29, row: 14 });
  furniture.push({ uid: "hub-chair-6", type: "chair", col: 28, row: 15 });

  // Decorations — center of hub
  furniture.push({ uid: "hub-plant-1", type: "plant", col: 22, row: 14 });
  furniture.push({ uid: "hub-plant-2", type: "plant", col: 21, row: 15 });
  furniture.push({ uid: "hub-cooler",  type: "cooler", col: 22, row: 15 });

  // Hut lamps — minimal interior decoration
  furniture.push({ uid: "hut1-lamp", type: "lamp", col: 7, row: 4 });
  furniture.push({ uid: "hut2-lamp", type: "lamp", col: 35, row: 5 });
  furniture.push({ uid: "hut3-lamp", type: "lamp", col: 9, row: 22 });
  furniture.push({ uid: "hut4-lamp", type: "lamp", col: 36, row: 23 });

  // Step 5: Track which wall tiles belong to huts (for brown colorization)
  const hutWalls = new Set();
  for (const hut of huts) {
    for (let dr = 0; dr < 5; dr++) {
      for (let dc = 0; dc < 5; dc++) {
        const c = hut.x + dc, r = hut.y + dr;
        if (dr === 0 || dr === 4 || dc === 0 || dc === 4) {
          hutWalls.add(r * cols + c);
        }
      }
    }
  }

  // Step 6: Generate colors per tile
  const wallRand = seededRand(42);
  const tileColors = [];

  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    if (t === 0 && hutWalls.has(i)) {
      // Hut walls — warm golden-brown processed bamboo
      const hueJ = Math.floor(wallRand() * 8) - 4;
      const satJ = Math.floor(wallRand() * 6) - 3;
      tileColors.push({ h: 38 + hueJ, s: 40 + satJ, b: 12, c: 0 });
    } else if (t === 0) {
      // Forest walls — green living bamboo
      const hueJ = Math.floor(wallRand() * 20) - 10;
      const satJ = Math.floor(wallRand() * 10) - 5;
      tileColors.push({ h: 115 + hueJ, s: 35 + satJ, b: 3, c: 0 });
    } else if (t === 1) {
      tileColors.push({ h: 110, s: 30, b: 8, c: 0 });     // grass green
    } else if (t === 2) {
      tileColors.push({ h: 35, s: 35, b: 15, c: 0 });      // bamboo plank brown
    } else if (t === 3) {
      tileColors.push({ h: 38, s: 18, b: 20, c: 0 });      // dirt path (light sandy tan)
    } else {
      tileColors.push(null);
    }
  }

  return { version: 1, cols, rows, tiles, tileColors, furniture };
}

function writeVillageLayout() {
  const persistDir = join(homedir(), ".pixel-agents");
  const layoutPath = join(persistDir, "layout.json");
  const seatsPath = join(persistDir, "agent-seats.json");

  const layout = generateVillageLayout();
  writeFileSync(layoutPath, JSON.stringify(layout, null, 2));
  console.log(`Wrote village layout to ${layoutPath} (${layout.cols}×${layout.rows}, ${layout.furniture.length} furniture)`);

  // Clear stale seat assignments — old UIDs won't match new layout
  if (existsSync(seatsPath)) {
    writeFileSync(seatsPath, "{}");
    console.log("Cleared stale agent-seats.json");
  }
}

// ── Main ────────────────────────────────────────────────────────────────

const assetsDir = join(new URL(".", import.meta.url).pathname, "..", "webview-ui", "public", "assets");

const floorsBuf = createFloorsPNG(floorPatterns);
writeFileSync(join(assetsDir, "floors.png"), floorsBuf);
console.log(`Created floors.png (${floorsBuf.length} bytes)`);

const wallsBuf = createWallsPNG(wallSprites);
writeFileSync(join(assetsDir, "walls.png"), wallsBuf);
console.log(`Created walls.png (${wallsBuf.length} bytes)`);

writeVillageLayout();

console.log("Done! Restart server to see changes.");
