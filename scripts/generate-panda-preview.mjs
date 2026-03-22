#!/usr/bin/env node
// Generates a proof-of-concept panda sprite sheet for pixel-agents.
// Output: a single 112x96 PNG with 7 frames × 3 directions.
// Frame size: 16 wide × 32 tall.

import { PNG } from "pngjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Color palette ---
const C = {
  ".": null,                    // transparent
  K: [30, 30, 30],              // black fur
  W: [245, 245, 245],           // white fur
  G: [215, 215, 215],           // gray belly shading
  E: [255, 255, 255],           // eye glint (white dot in dark patch)
  B: [140, 190, 100],           // bamboo green
  L: [100, 160, 80],            // bamboo leaf green
};

// --- Helpers ---
const FRAME_W = 16;
const FRAME_H = 32;
const EMPTY = "................";

// Pad/trim every row to exactly 16 chars
function n(frame) {
  return frame.map(row => {
    if (row.length === FRAME_W) return row;
    if (row.length < FRAME_W) return row + ".".repeat(FRAME_W - row.length);
    return row.slice(0, FRAME_W);
  });
}

// =====================
// DOWN-FACING FRAMES
// Ears: half-moon (4 rows, crescent shape, lower on head)
// Black band: 3 rows thick
// =====================

// Shared ear+head top for down-facing (ears overlap head)
// ear shape: rounder, more elongated half-moons (5 rows)
const DN_EARS_HEAD = [
  "..KKKK..KKKK....", // ear top (round)
  ".KKKKK..KKKKK...", // ear widens
  ".KKKKK..KKKKK...", // ear holds width
  "..KKWWWWWWKK....", // ear base curves into head
  "..WWWWWWWWWWWW..", // head
  ".WWWWWWWWWWWWWW..", // head widest
];

const DN_FACE = [
  ".WWWKKKWWKKKWWW.", // eye patches
  ".WWKKEKWWKEKWWW.", // eyes with glint
  ".WWWKKKWWKKKWWW.", // eye patches
  "..WWWWWKKWWWWW...", // nose (black)
  "..WWWWWWWWWWWW...", // lower face
  "...WWWWWWWWWW....", // chin
];

const DN_BAND = [
  "..KKKKKKKKKKKK...", // BLACK BAND 1
  ".KKKKKKKKKKKKKKK.", // BLACK BAND 2
  "KKKKKKKKKKKKKKKK.", // BLACK BAND 3
];

const DN_BODY = [
  "KKKKKWWWWWWKKKKK.", // body
  "KKKKWWWGGWWWKKKK.", // belly
  "KKKKWWGGGGWWKKKK.", // belly center
  "KKKKWWGGGGWWKKKK.", // belly center
  "KKKKWWWGGWWWKKKK.", // belly
  "KKKKKWWWWWWKKKKK.", // body
  ".KKKKKWWWWKKKKK..", // hips
  "..KKKKWWWWKKKK...", // upper legs
];

const DN_LEGS_IDLE = [
  "...KKKK..KKKK....", // legs
  "...KKKK..KKKK....", // legs
  "..KKKKK..KKKKK...", // feet
];

const downIdle = n([
  ...DN_EARS_HEAD, ...DN_FACE, ...DN_BAND, ...DN_BODY, ...DN_LEGS_IDLE,
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

const downWalk1 = n([
  ...DN_EARS_HEAD, ...DN_FACE, ...DN_BAND, ...DN_BODY,
  "..KKKK...WKKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..........KKKK...",
  EMPTY, EMPTY, EMPTY,
]);

const downWalk2 = downIdle;

const downWalk3 = n([
  ...DN_EARS_HEAD, ...DN_FACE, ...DN_BAND, ...DN_BODY,
  "..KKKKW...KKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..KKKK............",
  EMPTY, EMPTY, EMPTY,
]);

// Sitting/eating: hunched, paws together with bamboo
const downType1 = n([
  EMPTY,
  ...DN_EARS_HEAD, ...DN_FACE,
  ...DN_BAND,
  "KKKKWWWGGWWWKKKK.", // body
  "KKKBWWGGGGWWBKKK.", // bamboo
  "KKKBWWGGGGWWBKKK.",
  "KKK.BWWGGWWB.KKK.",
  "....BWWWWWWB.....",
  "...WWWWWWWWWW....",
  "...KKKKWWKKKK....",
  "...KKKK..KKKK....",
  "..KKKKK..KKKKK...",
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

const downType2 = n([
  EMPTY,
  ...DN_EARS_HEAD, ...DN_FACE,
  ...DN_BAND,
  "KKKKWWWGGWWWKKKK.",
  "KKK.BWGGGGWB.KKK.",
  "KKK.BWGGGGWB.KKK.",
  "KKK..BWGGWB..KKK.",
  ".....BWWWWB......",
  "...WWWWWWWWWW....",
  "...KKKKWWKKKK....",
  "...KKKK..KKKK....",
  "..KKKKK..KKKKK...",
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

// Reading: holding bamboo leaf
const downRead1 = n([
  ...DN_EARS_HEAD, ...DN_FACE,
  "LLKKKKKKKKKKKK...", // band + leaf
  "LKKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK.",
  ...DN_BODY, ...DN_LEGS_IDLE,
  EMPTY, EMPTY, EMPTY,
]);

const downRead2 = n([
  ...DN_EARS_HEAD, ...DN_FACE,
  ".LKKKKKKKKKKKK...", // band + leaf (shifted)
  "LLKKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK.",
  ...DN_BODY, ...DN_LEGS_IDLE,
  EMPTY, EMPTY, EMPTY,
]);

// =====================
// UP-FACING FRAMES (back view — heavy black band)
// Same half-moon ears, but solid black (no inner detail from behind)
// =====================

const UP_EARS_HEAD = [
  "..KKKK..KKKK....", // ear top (round)
  ".KKKKK..KKKKK...", // ear widens
  ".KKKKK..KKKKK...", // ear holds width
  "..KKWWWWWWKK....", // ear base curves into head
  "..WWWWWWWWWWWW..", // head
  ".WWWWWWWWWWWWWW..", // head widest
];

const UP_BACK_HEAD = [
  ".WWWWWWWWWWWWWW..", // back of head (no face features)
  ".WWWWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW..",
  "..WWWWWWWWWWWW...",
  "...WWWWWWWWWW....",
];

const UP_BAND = [
  "..KKKKKKKKKKKK...", // band 1
  ".KKKKKKKKKKKKKKK.", // band 2
  "KKKKKKKKKKKKKKKK.", // band 3
];

const UP_BODY = [
  "KKKKKKWWWWKKKKK..", // body (more black from behind)
  "KKKKKWWWWWWKKKK..",
  "KKKKWWWWWWWWKKKK.",
  "KKKKWWWWWWWWKKKK.",
  "KKKKWWWWWWWWKKKK.",
  "KKKKKWWWWWWKKKKK.",
  "KKKKKKWWWWKKKKK..",
  "..KKKKWWWWKKKK...",
];

const UP_LEGS_IDLE = [
  "...KKKK..KKKK....",
  "...KKKK..KKKK....",
  "..KKKKK..KKKKK...",
];

const upIdle = n([
  ...UP_EARS_HEAD, ...UP_BACK_HEAD, ...UP_BAND, ...UP_BODY, ...UP_LEGS_IDLE,
  EMPTY, EMPTY, EMPTY,
]);

const upWalk1 = n([
  ...UP_EARS_HEAD, ...UP_BACK_HEAD, ...UP_BAND, ...UP_BODY,
  "..KKKK...WKKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..........KKKK...",
  EMPTY, EMPTY,
]);

const upWalk2 = upIdle;

const upWalk3 = n([
  ...UP_EARS_HEAD, ...UP_BACK_HEAD, ...UP_BAND, ...UP_BODY,
  "..KKKKW...KKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..KKKK............",
  EMPTY, EMPTY,
]);

// Up-facing sitting (back view)
const upType1 = n([
  EMPTY,
  ...UP_EARS_HEAD, ...UP_BACK_HEAD, ...UP_BAND,
  "KKKKKKWWWWKKKKK..",
  "KKKKKWWWWWWKKKK..",
  "KKKKWWWWWWWWKKKK.",
  "KKKKWWWWWWWWKKKK.",
  "KKKKKWWWWWWKKKKK.",
  "..KKKKWWWWKKKK...",
  "...KKKK..KKKK....",
  "...KKKK..KKKK....",
  "..KKKKK..KKKKK...",
  EMPTY, EMPTY, EMPTY,
]);

const upType2 = upType1;

const upRead1 = n([
  ...UP_EARS_HEAD, ...UP_BACK_HEAD,
  "..KKKKKKKKKKKK...", // band 1
  "LLKKKKKKKKKKKKKKK", // band 2 + leaf
  "LKKKKKKKKKKKKKKK.", // band 3 + leaf
  ...UP_BODY, ...UP_LEGS_IDLE,
  EMPTY, EMPTY,
]);

const upRead2 = upRead1;

// =====================
// RIGHT-FACING FRAMES (proper side profile)
// Taller half-moon ear, narrower profile body
// =====================

const RT_EAR_HEAD = [
  "....KKKK........", // ear tip (4px, cols 4-7)
  "...KKKKKK.......", // ear widens (6px, cols 3-8)
  "...KKKKKK.......", // ear holds (6px, cols 3-8)
  "..WKKKKWWWWW....", // ear base merges into head (4K cols 3-6), head cols 2-11, rounded top-right
  "..WWWWWWWWWWW...", // head (11px)
  "..WWWWWWWWWWW...", // head (11px)
];

const RT_FACE = [
  "..WWWWKKKKKWW...", // big eye patch top (5px K)
  "..WWWWKKEKKWW...", // eye glint inside patch
  "..WWWWKKKKKWW...", // big eye patch bottom (5px K)
  "..WWWWWWWWWWW...", // head below eye (11px)
  "...WWWWWWWWWK...", // muzzle + nose at front (K at col 12)
  "....WWWWWWWW....", // chin (8px)
];

const RT_BAND = [
  "....KKKKKKKK....", // band 1
  "...KKKKKKKKK....", // band 2
  "..KKKKKKKKKK....", // band 3
];

const RT_BODY = [
  "..KKKWWWWWK.....", // black back (left), belly (right)
  ".KKKKWWGGWWK....", // back wider, belly with gray
  ".KKKKWGGGGWK....", // back, belly widest
  ".KKKKWGGGGWK....", // back, belly
  ".KKKKWWGGWWK....", // back, belly curves
  "..KKKWWWWWK.....", // lower body
  "...KKKKKKKK.....", // hips
];

const RT_LEGS_IDLE = [
  ".....KKKKKK.....", // single leg (centered under body)
  ".....KKKKKK.....",
  ".....KKKKKKK....", // foot (toes point right/forward)
];

const rightIdle = n([
  EMPTY,
  ...RT_EAR_HEAD, ...RT_FACE, ...RT_BAND, ...RT_BODY, ...RT_LEGS_IDLE,
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

const rightWalk1 = n([
  EMPTY,
  ...RT_EAR_HEAD, ...RT_FACE, ...RT_BAND, ...RT_BODY,
  "......KKKKKK....", // leg forward (right)
  "......KKKKKK....",
  "......KKKKKKK...", // foot (toes right)
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

const rightWalk2 = rightIdle;

const rightWalk3 = n([
  EMPTY,
  ...RT_EAR_HEAD, ...RT_FACE, ...RT_BAND, ...RT_BODY,
  "....KKKKKK......", // leg back (left)
  "....KKKKKK......",
  "....KKKKKKK.....", // foot (toes right)
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

// Sitting/eating from side
const rightType1 = n([
  EMPTY, EMPTY, EMPTY,
  ...RT_EAR_HEAD, ...RT_FACE,
  ...RT_BAND,
  "..KKKWWGGWWK....", // back left, belly right
  "..KKBWGGGGWBK...", // bamboo
  "..KKBWGGGGWBK...",
  "..KK.BWGGWB.K...",
  "....BWWWWB......",
  "...WWWWWWWW.....",
  ".....KKKKKK.....", // single leg
  ".....KKKKKK.....",
  ".....KKKKKKK....", // foot (toes right)
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

const rightType2 = n([
  EMPTY, EMPTY, EMPTY,
  ...RT_EAR_HEAD, ...RT_FACE,
  ...RT_BAND,
  "..KKKWWGGWWK....",
  "..KK.BWGGGGWB.K.",
  "..KK.BWGGGGWB.K.",
  "..KK..BWGGWB..K.",
  "......BWWWB.....",
  "...WWWWWWWW.....",
  ".....KKKKKK.....", // single leg
  ".....KKKKKK.....",
  ".....KKKKKKK....", // foot (toes right)
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

// Reading from side (holding leaf)
const rightRead1 = n([
  EMPTY,
  ...RT_EAR_HEAD, ...RT_FACE,
  "....KKKKKKK..LL.", // band 1 + leaf (right side)
  "...KKKKKKKKKLL..", // band 2 + leaf
  "..KKKKKKKKKKL...", // band 3 + leaf
  ...RT_BODY, ...RT_LEGS_IDLE,
  EMPTY, EMPTY, EMPTY, EMPTY,
]);

const rightRead2 = rightRead1;

// =====================
// Assemble sprite sheet
// =====================

const COLS = 7;
const ROWS = 3;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H * ROWS;

const rows = [
  [downWalk1, downWalk2, downWalk3, downType1, downType2, downRead1, downRead2],
  [upWalk1, upWalk2, upWalk3, upType1, upType2, upRead1, upRead2],
  [rightWalk1, rightWalk2, rightWalk3, rightType1, rightType2, rightRead1, rightRead2],
];

const png = new PNG({ width: IMG_W, height: IMG_H });

for (let i = 0; i < png.data.length; i += 4) {
  png.data[i] = 0;
  png.data[i + 1] = 0;
  png.data[i + 2] = 0;
  png.data[i + 3] = 0;
}

for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const frame = rows[row][col];
    const offsetX = col * FRAME_W;
    const offsetY = row * FRAME_H;

    for (let y = 0; y < FRAME_H; y++) {
      const line = frame[y] || "";
      for (let x = 0; x < FRAME_W; x++) {
        const ch = line[x] || ".";
        const color = C[ch];
        if (!color) continue;

        const idx = ((offsetY + y) * IMG_W + (offsetX + x)) * 4;
        png.data[idx] = color[0];
        png.data[idx + 1] = color[1];
        png.data[idx + 2] = color[2];
        png.data[idx + 3] = 255;
      }
    }
  }
}

const outDir = join(__dirname, "..", "webview-ui", "public", "assets", "characters");
const outPath = join(outDir, "panda_preview.png");
writeFileSync(outPath, PNG.sync.write(png));
console.log(`Wrote ${outPath}`);

const SCALE = 8;
const bigPng = new PNG({ width: IMG_W * SCALE, height: IMG_H * SCALE });
for (let i = 0; i < bigPng.data.length; i += 4) {
  bigPng.data[i] = 200;
  bigPng.data[i + 1] = 200;
  bigPng.data[i + 2] = 200;
  bigPng.data[i + 3] = 255;
}

for (let y = 0; y < IMG_H; y++) {
  for (let x = 0; x < IMG_W; x++) {
    const srcIdx = (y * IMG_W + x) * 4;
    const a = png.data[srcIdx + 3];
    if (a === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const dstIdx = (((y * SCALE + sy) * IMG_W * SCALE) + (x * SCALE + sx)) * 4;
        bigPng.data[dstIdx] = png.data[srcIdx];
        bigPng.data[dstIdx + 1] = png.data[srcIdx + 1];
        bigPng.data[dstIdx + 2] = png.data[srcIdx + 2];
        bigPng.data[dstIdx + 3] = 255;
      }
    }
  }
}

const bigPath = join(outDir, "panda_preview_8x.png");
writeFileSync(bigPath, PNG.sync.write(bigPng));
console.log(`Wrote ${bigPath} (8x scaled for preview)`);

// === VARIANT COMPARISON ===

// Recolor helper: swap characters in a frame
function recolor(frame, mapping) {
  return frame.map(row =>
    row.split("").map(ch => mapping[ch] || ch).join("")
  );
}

// Brown panda colors (Qinling subspecies — more saturated brown)
C.D = [90, 50, 20];     // rich dark brown (replaces black)
C.N = [240, 225, 200];  // warm cream (replaces white)
C.H = [220, 200, 170];  // tan belly (replaces gray)

// Accessory colors
C.U = [80, 130, 200];   // blue scarf
C.I = [230, 150, 160];  // pink inner ear

// Variant 2: Brown Panda — same shape, rich brown/cream palette
const brownMap = { K: "D", W: "N", G: "H" };
const v2Idle = n(recolor(downIdle, brownMap));

// More accessory colors
C.V = [80, 160, 90];    // green scarf
C.P = [150, 90, 170];   // purple scarf
C.Y = [220, 180, 60];   // gold/yellow scarf

// Scarf band components (3 rows each)
const BLUE_SCARF = [
  "..UUUUUUUUUUUU...",
  ".UUUUUUUUUUUUUU..",
  "UUUUUUUUUUUUUUUU.",
];
const GREEN_SCARF = [
  "..VVVVVVVVVVVV...",
  ".VVVVVVVVVVVVVV..",
  "VVVVVVVVVVVVVVVV.",
];
const PURPLE_SCARF = [
  "..PPPPPPPPPPPP...",
  ".PPPPPPPPPPPPPP..",
  "PPPPPPPPPPPPPPPP.",
];
const GOLD_SCARF = [
  "..YYYYYYYYYYYY...",
  ".YYYYYYYYYYYYYY..",
  "YYYYYYYYYYYYYYYY.",
];

// Bow color
C.R = [220, 60, 80];    // red bow

// Helper to build a front idle frame
function buildFrontIdle(parts) {
  const allRows = parts.flat();
  // Pad to 32 rows
  while (allRows.length < FRAME_H) allRows.push(EMPTY);
  return n(allRows);
}

// Brown recolor helpers
const bEars = n(recolor(DN_EARS_HEAD, brownMap));
const bFace = n(recolor(DN_FACE, brownMap));
const bBand = n(recolor(DN_BAND, brownMap));
const bBody = n(recolor(DN_BODY, brownMap));
const bLegs = n(recolor(DN_LEGS_IDLE, brownMap));

// --- Sprout accessory (centered between ears at cols 6-7) ---
const SPROUT = [
  "........LL......",  // leaf tip
  ".......LLL......",  // leaf widens
  "......BLLL......",  // stem + leaf wide
  "......B.........",  // stem
];

// Ears with sprout — sits directly above the ear gap
const SPROUT_EARS_HEAD = [...SPROUT, ...DN_EARS_HEAD];
const BROWN_SPROUT_EARS_HEAD = [...SPROUT, ...bEars];

// --- Bow between ears (two-loop shape above head) ---
const BOW = [
  ".....RR.RR......",  // two loops with gap
  "......RRR.......",  // center knot
];
const BOW_EARS_HEAD = [...BOW, ...DN_EARS_HEAD];
const BROWN_BOW_EARS_HEAD = [...BOW, ...bEars];

// Build the 8 comparison variants (4x2 grid)
// Top row: classic base | sprout | bow | blue scarf
// Bottom row: brown base | brown+green scarf | brown+sprout | brown+bow
const classicBase = buildFrontIdle([DN_EARS_HEAD, DN_FACE, DN_BAND, DN_BODY, DN_LEGS_IDLE]);
const classicSprout = buildFrontIdle([SPROUT_EARS_HEAD, DN_FACE, DN_BAND, DN_BODY, DN_LEGS_IDLE]);
const classicBow = buildFrontIdle([BOW_EARS_HEAD, DN_FACE, DN_BAND, DN_BODY, DN_LEGS_IDLE]);
const classicBlue = buildFrontIdle([DN_EARS_HEAD, DN_FACE, BLUE_SCARF, DN_BODY, DN_LEGS_IDLE]);

const brownBase = n(recolor(downIdle, brownMap));
const brownGreen = buildFrontIdle([bEars, bFace, GREEN_SCARF, bBody, bLegs]);
const brownSprout = buildFrontIdle([BROWN_SPROUT_EARS_HEAD, bFace, bBand, bBody, bLegs]);
const brownBow = buildFrontIdle([BROWN_BOW_EARS_HEAD, bFace, bBand, bBody, bLegs]);

// Render comparison: 4x2 grid (classic row, brown row)
const variantGrid = [
  [classicBase, classicSprout, classicBow, classicBlue],
  [brownBase, brownGreen, brownSprout, brownBow],
];
const COMP_COLS = 4;
const COMP_ROWS = 2;
const COMP_W = FRAME_W * COMP_COLS;
const COMP_H = FRAME_H * COMP_ROWS;

const compPng = new PNG({ width: COMP_W, height: COMP_H });
for (let i = 0; i < compPng.data.length; i += 4) {
  compPng.data[i] = 0;
  compPng.data[i + 1] = 0;
  compPng.data[i + 2] = 0;
  compPng.data[i + 3] = 0;
}

for (let row = 0; row < COMP_ROWS; row++) {
  for (let col = 0; col < COMP_COLS; col++) {
    const frame = variantGrid[row][col];
    const offsetX = col * FRAME_W;
    const offsetY = row * FRAME_H;
    for (let y = 0; y < FRAME_H; y++) {
      const line = frame[y] || "";
      for (let x = 0; x < FRAME_W; x++) {
        const ch = line[x] || ".";
        const color = C[ch];
        if (!color) continue;
        const idx = ((offsetY + y) * COMP_W + (offsetX + x)) * 4;
        compPng.data[idx] = color[0];
        compPng.data[idx + 1] = color[1];
        compPng.data[idx + 2] = color[2];
        compPng.data[idx + 3] = 255;
      }
    }
  }
}

// Scale up
const compBig = new PNG({ width: COMP_W * SCALE, height: COMP_H * SCALE });
for (let i = 0; i < compBig.data.length; i += 4) {
  compBig.data[i] = 200;
  compBig.data[i + 1] = 200;
  compBig.data[i + 2] = 200;
  compBig.data[i + 3] = 255;
}
for (let y = 0; y < COMP_H; y++) {
  for (let x = 0; x < COMP_W; x++) {
    const srcIdx = (y * COMP_W + x) * 4;
    if (compPng.data[srcIdx + 3] === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const dstIdx = ((y * SCALE + sy) * COMP_W * SCALE + (x * SCALE + sx)) * 4;
        compBig.data[dstIdx] = compPng.data[srcIdx];
        compBig.data[dstIdx + 1] = compPng.data[srcIdx + 1];
        compBig.data[dstIdx + 2] = compPng.data[srcIdx + 2];
        compBig.data[dstIdx + 3] = 255;
      }
    }
  }
}

const compPath = join(outDir, "panda_variants_8x.png");
writeFileSync(compPath, PNG.sync.write(compBig));
console.log(`Wrote ${compPath} (variant comparison, 8x)`);

// === MULTI-VIEW VARIANT COMPARISON ===
// Shows key variants from front, back, and side to confirm they read well from all angles.
// Sprout/bow side+back views don't exist yet — only showing fur recolor and scarf variants.

// Build idle frame helpers for back and side views
function buildBackIdle(parts) {
  const allRows = parts.flat();
  while (allRows.length < FRAME_H) allRows.push(EMPTY);
  return n(allRows);
}

function buildSideIdle(parts) {
  const allRows = [EMPTY, ...parts.flat()];
  while (allRows.length < FRAME_H) allRows.push(EMPTY);
  return n(allRows);
}

// Side scarf variants (recolor band K → scarf color)
const RT_BLUE_SCARF = RT_BAND.map(row => row.split("").map(ch => ch === "K" ? "U" : ch).join(""));
const RT_GREEN_SCARF = RT_BAND.map(row => row.split("").map(ch => ch === "K" ? "V" : ch).join(""));
const RT_PURPLE_SCARF = RT_BAND.map(row => row.split("").map(ch => ch === "K" ? "P" : ch).join(""));
const RT_GOLD_SCARF = RT_BAND.map(row => row.split("").map(ch => ch === "K" ? "Y" : ch).join(""));

// Back scarf variants
const UP_BLUE_SCARF = UP_BAND.map(row => row.split("").map(ch => ch === "K" ? "U" : ch).join(""));
const UP_GREEN_SCARF = UP_BAND.map(row => row.split("").map(ch => ch === "K" ? "V" : ch).join(""));
const UP_PURPLE_SCARF = UP_BAND.map(row => row.split("").map(ch => ch === "K" ? "P" : ch).join(""));
const UP_GOLD_SCARF = UP_BAND.map(row => row.split("").map(ch => ch === "K" ? "Y" : ch).join(""));

// Brown recolor helpers for back and side
const bUpEars = recolor(UP_EARS_HEAD, brownMap);
const bUpBackHead = recolor(UP_BACK_HEAD, brownMap);
const bUpBand = recolor(UP_BAND, brownMap);
const bUpBody = recolor(UP_BODY, brownMap);
const bUpLegs = recolor(UP_LEGS_IDLE, brownMap);

const bRtEars = recolor(RT_EAR_HEAD, brownMap);
const bRtFace = recolor(RT_FACE, brownMap);
const bRtBand = recolor(RT_BAND, brownMap);
const bRtBody = recolor(RT_BODY, brownMap);
const bRtLegs = recolor(RT_LEGS_IDLE, brownMap);

// Grid: 4 variants × 3 directions (front, back, side)
// Row 1: classic base
// Row 2: classic + blue scarf
// Row 3: brown base
// Row 4: brown + green scarf
const multiViewGrid = [
  [
    buildFrontIdle([DN_EARS_HEAD, DN_FACE, DN_BAND, DN_BODY, DN_LEGS_IDLE]),
    buildBackIdle([UP_EARS_HEAD, UP_BACK_HEAD, UP_BAND, UP_BODY, UP_LEGS_IDLE]),
    buildSideIdle([RT_EAR_HEAD, RT_FACE, RT_BAND, RT_BODY, RT_LEGS_IDLE]),
  ],
  [
    buildFrontIdle([DN_EARS_HEAD, DN_FACE, BLUE_SCARF, DN_BODY, DN_LEGS_IDLE]),
    buildBackIdle([UP_EARS_HEAD, UP_BACK_HEAD, UP_BLUE_SCARF, UP_BODY, UP_LEGS_IDLE]),
    buildSideIdle([RT_EAR_HEAD, RT_FACE, RT_BLUE_SCARF, RT_BODY, RT_LEGS_IDLE]),
  ],
  [
    buildFrontIdle([bEars, bFace, bBand, bBody, bLegs]),
    buildBackIdle([bUpEars, bUpBackHead, bUpBand, bUpBody, bUpLegs]),
    buildSideIdle([bRtEars, bRtFace, bRtBand, bRtBody, bRtLegs]),
  ],
  [
    buildFrontIdle([bEars, bFace, GREEN_SCARF, bBody, bLegs]),
    buildBackIdle([bUpEars, bUpBackHead, UP_GREEN_SCARF, bUpBody, bUpLegs]),
    buildSideIdle([bRtEars, bRtFace, RT_GREEN_SCARF, bRtBody, bRtLegs]),
  ],
];

const MV_COLS = 3;
const MV_ROWS = 4;
const MV_W = FRAME_W * MV_COLS;
const MV_H = FRAME_H * MV_ROWS;

const mvPng = new PNG({ width: MV_W, height: MV_H });
for (let i = 0; i < mvPng.data.length; i += 4) {
  mvPng.data[i] = 0;
  mvPng.data[i + 1] = 0;
  mvPng.data[i + 2] = 0;
  mvPng.data[i + 3] = 0;
}

for (let row = 0; row < MV_ROWS; row++) {
  for (let col = 0; col < MV_COLS; col++) {
    const frame = multiViewGrid[row][col];
    const offsetX = col * FRAME_W;
    const offsetY = row * FRAME_H;
    for (let y = 0; y < FRAME_H; y++) {
      const line = frame[y] || "";
      for (let x = 0; x < FRAME_W; x++) {
        const ch = line[x] || ".";
        const color = C[ch];
        if (!color) continue;
        const idx = ((offsetY + y) * MV_W + (offsetX + x)) * 4;
        mvPng.data[idx] = color[0];
        mvPng.data[idx + 1] = color[1];
        mvPng.data[idx + 2] = color[2];
        mvPng.data[idx + 3] = 255;
      }
    }
  }
}

// Scale up
const mvBig = new PNG({ width: MV_W * SCALE, height: MV_H * SCALE });
for (let i = 0; i < mvBig.data.length; i += 4) {
  mvBig.data[i] = 200;
  mvBig.data[i + 1] = 200;
  mvBig.data[i + 2] = 200;
  mvBig.data[i + 3] = 255;
}
for (let y = 0; y < MV_H; y++) {
  for (let x = 0; x < MV_W; x++) {
    const srcIdx = (y * MV_W + x) * 4;
    if (mvPng.data[srcIdx + 3] === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const dstIdx = ((y * SCALE + sy) * MV_W * SCALE + (x * SCALE + sx)) * 4;
        mvBig.data[dstIdx] = mvPng.data[srcIdx];
        mvBig.data[dstIdx + 1] = mvPng.data[srcIdx + 1];
        mvBig.data[dstIdx + 2] = mvPng.data[srcIdx + 2];
        mvBig.data[dstIdx + 3] = 255;
      }
    }
  }
}

const mvPath = join(outDir, "panda_multiview_8x.png");
writeFileSync(mvPath, PNG.sync.write(mvBig));
console.log(`Wrote ${mvPath} (multi-view comparison, 8x)`);

// === ACCESSORY MULTI-VIEW COMPARISON ===
// Sprout and bow from front, back, side — to iterate on side+back designs.

// --- Side sprout (right-facing) ---
// From the side, the leaf is seen edge-on — much thinner profile.
// Stem visible, leaf as a small vertical shape rather than wide spread.
const RT_SPROUT = [
  "......L.........",  // leaf tip (1px, angled)
  "......LL........",  // leaf body (2px, slight spread)
  "......BL........",  // stem + leaf base
  "......B.........",  // stem
];

// --- Back sprout (up-facing) ---
// Mirror of front: stem at col 7, leaf curves left (since viewer sees the back).
const UP_SPROUT = [
  "....LL..........",  // leaf tip curves left (cols 4-5)
  "....LLL.........",  // leaf widens (cols 4-6)
  "....LLLB........",  // leaf + stem (cols 4-7)
  ".......B........",  // stem (col 7)
];

// --- Side bow (right-facing) ---
// From the side, only one loop visible + knot. Compressed shape on top of head.
const RT_BOW = [
  "........RR......",  // one visible loop (cols 8-9)
  ".......RR.......",  // knot area (cols 7-8)
];

// --- Back bow (up-facing) ---
// Two loops visible between ears, same as front.
const UP_BOW = [
  ".....RR.RR......",  // two loops with gap
  "......RRR.......",  // center knot
];

// Compose accessory + ears for side and back
const RT_SPROUT_EARS_HEAD = [...RT_SPROUT, ...RT_EAR_HEAD];
const UP_SPROUT_EARS_HEAD = [...UP_SPROUT, ...UP_EARS_HEAD];
const RT_BOW_EARS_HEAD = [...RT_BOW, ...RT_EAR_HEAD];
const UP_BOW_EARS_HEAD = [...UP_BOW, ...UP_EARS_HEAD];

// Build a generic idle frame (just flatten + pad to 32)
function buildIdle(parts) {
  const allRows = parts.flat();
  while (allRows.length < FRAME_H) allRows.push(EMPTY);
  return n(allRows);
}

// Grid: 2 rows (sprout, bow) × 3 cols (front, back, side)
const accGrid = [
  [
    buildIdle([SPROUT_EARS_HEAD, DN_FACE, DN_BAND, DN_BODY, DN_LEGS_IDLE]),
    buildIdle([UP_SPROUT_EARS_HEAD, UP_BACK_HEAD, UP_BAND, UP_BODY, UP_LEGS_IDLE]),
    buildIdle([RT_SPROUT_EARS_HEAD, RT_FACE, RT_BAND, RT_BODY, RT_LEGS_IDLE]),
  ],
  [
    buildIdle([BOW_EARS_HEAD, DN_FACE, DN_BAND, DN_BODY, DN_LEGS_IDLE]),
    buildIdle([UP_BOW_EARS_HEAD, UP_BACK_HEAD, UP_BAND, UP_BODY, UP_LEGS_IDLE]),
    buildIdle([RT_BOW_EARS_HEAD, RT_FACE, RT_BAND, RT_BODY, RT_LEGS_IDLE]),
  ],
];

const ACC_COLS = 3;
const ACC_ROWS = 2;
const ACC_W = FRAME_W * ACC_COLS;
const ACC_H = FRAME_H * ACC_ROWS;

const accPng = new PNG({ width: ACC_W, height: ACC_H });
for (let i = 0; i < accPng.data.length; i += 4) {
  accPng.data[i] = 0; accPng.data[i + 1] = 0;
  accPng.data[i + 2] = 0; accPng.data[i + 3] = 0;
}

for (let row = 0; row < ACC_ROWS; row++) {
  for (let col = 0; col < ACC_COLS; col++) {
    const frame = accGrid[row][col];
    const offsetX = col * FRAME_W;
    const offsetY = row * FRAME_H;
    for (let y = 0; y < FRAME_H; y++) {
      const line = frame[y] || "";
      for (let x = 0; x < FRAME_W; x++) {
        const ch = line[x] || ".";
        const color = C[ch];
        if (!color) continue;
        const idx = ((offsetY + y) * ACC_W + (offsetX + x)) * 4;
        accPng.data[idx] = color[0];
        accPng.data[idx + 1] = color[1];
        accPng.data[idx + 2] = color[2];
        accPng.data[idx + 3] = 255;
      }
    }
  }
}

const accBig = new PNG({ width: ACC_W * SCALE, height: ACC_H * SCALE });
for (let i = 0; i < accBig.data.length; i += 4) {
  accBig.data[i] = 200; accBig.data[i + 1] = 200;
  accBig.data[i + 2] = 200; accBig.data[i + 3] = 255;
}
for (let y = 0; y < ACC_H; y++) {
  for (let x = 0; x < ACC_W; x++) {
    const srcIdx = (y * ACC_W + x) * 4;
    if (accPng.data[srcIdx + 3] === 0) continue;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        const dstIdx = ((y * SCALE + sy) * ACC_W * SCALE + (x * SCALE + sx)) * 4;
        accBig.data[dstIdx] = accPng.data[srcIdx];
        accBig.data[dstIdx + 1] = accPng.data[srcIdx + 1];
        accBig.data[dstIdx + 2] = accPng.data[srcIdx + 2];
        accBig.data[dstIdx + 3] = 255;
      }
    }
  }
}

const accPath = join(outDir, "panda_accessories_8x.png");
writeFileSync(accPath, PNG.sync.write(accBig));
console.log(`Wrote ${accPath} (accessory multi-view, 8x)`);
