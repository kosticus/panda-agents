#!/usr/bin/env node
// Generates all 70 panda variant sprite sheets (char_0.png through char_69.png).
// Each sheet: 112×96 PNG (7 frames × 3 directions, 16×32 per frame).
// Variants: 2 fur × 7 head accessories × 5 band/neck = 70 combinations.

import { PNG } from "pngjs";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================================
// COLOR PALETTE
// ============================================================
const C = {
  ".": null,
  K: [30, 30, 30],        // black fur
  W: [245, 245, 245],     // white fur
  G: [215, 215, 215],     // gray belly
  E: [255, 255, 255],     // eye glint
  B: [140, 190, 100],     // bamboo green
  L: [100, 160, 80],      // leaf green
  D: [90, 50, 20],        // dark brown fur (brown variant)
  N: [240, 225, 200],     // cream fur (brown variant)
  H: [220, 200, 170],     // warm cream belly (brown variant)
  U: [80, 130, 200],      // blue (scarf/bow)
  V: [80, 160, 90],       // green scarf
  P: [150, 90, 170],      // purple (scarf/bow)
  Y: [220, 180, 60],      // gold (scarf/bow)
  R: [220, 60, 80],       // red bow
  I: [230, 150, 160],     // pink bow
  Z: [130, 180, 240],     // sleep z (light blue)
};

// ============================================================
// CONSTANTS
// ============================================================
const FRAME_W = 16;
const FRAME_H = 32;
const COLS = 7;
const ROWS = 3;
const IMG_W = FRAME_W * COLS;
const IMG_H = FRAME_H * ROWS;
const EMPTY = "................";
const MAX_ACC_ROWS = 4; // sprout is tallest accessory

// ============================================================
// HELPERS
// ============================================================
function n(frame) {
  return frame.map(row => {
    if (row.length === FRAME_W) return row;
    if (row.length < FRAME_W) return row + ".".repeat(FRAME_W - row.length);
    return row.slice(0, FRAME_W);
  });
}

function recolor(frame, mapping) {
  return frame.map(row =>
    row.split("").map(ch => mapping[ch] || ch).join("")
  );
}

function pad32(rows) {
  const r = [...rows];
  while (r.length < FRAME_H) r.push(EMPTY);
  return n(r);
}

// ============================================================
// DOWN-FACING BASE COMPONENTS
// ============================================================
const DN_EARS_HEAD = [
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW..",
];

const DN_FACE = [
  ".WWWKKKWWKKKWWW.",
  ".WWKKEKWWKEKWWW.",
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW...",
  "..WWWWWWWWWWWW...",
  "...WWWWWWWWWW....",
];

const DN_FACE_SLEEP = [
  ".WWWKKKWWKKKWWW.",
  ".WWKKKKWWKKKKWW.",  // eyes solid black (no glint)
  ".WWWKKKWWKKKWWW.",
  "..WWWWWKKWWWWW...",
  "..WWWWWWWWWWWW...",
  "...WWWWWWWWWW....",
];

const DN_BAND = [
  "..KKKKKKKKKKKK...",
  ".KKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK.",
];

const DN_BODY = [
  "KKKKKWWWWWWKKKKK.",
  "KKKKWWWGGWWWKKKK.",
  "KKKKWWGGGGWWKKKK.",
  "KKKKWWGGGGWWKKKK.",
  "KKKKWWWGGWWWKKKK.",
  "KKKKKWWWWWWKKKKK.",
  ".KKKKKWWWWKKKKK..",
  "..KKKKWWWWKKKK...",
];

const DN_LEGS_IDLE = [
  "...KKKK..KKKK....",
  "...KKKK..KKKK....",
  "..KKKKK..KKKKK...",
];

const DN_WALK1_LEGS = [
  "..KKKK...WKKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..........KKKK...",
];

const DN_WALK3_LEGS = [
  "..KKKKW...KKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..KKKK............",
];

const DN_TYPE1_BODY = [
  "KKKKWWWGGWWWKKKK.",
  "KKKBWWGGGGWWBKKK.",
  "KKKBWWGGGGWWBKKK.",
  "KKK.BWWGGWWB.KKK.",
  "....BWWWWWWB.....",
  "...WWWWWWWWWW....",
  "...KKKKWWKKKK....",
  "...KKKK..KKKK....",
  "..KKKKK..KKKKK...",
];

// Type2: same body as type1 (static seated pose)
const DN_TYPE2_BODY = DN_TYPE1_BODY;

// Sleeping: overlay a "Z" onto the normal standing idle frame
// stampZ(frame, row, col) stamps a 4-row pixel-art "Z" starting at (row, col)
// The Z shape:  ZZZ   (top bar)
//                Z    (diagonal upper)
//               Z     (diagonal lower)
//              ZZZ    (bottom bar)
function stampZ(frame, startRow, startCol) {
  const out = frame.map(r => r.split(""));
  const z = [
    [0, 0, "Z"], [0, 1, "Z"], [0, 2, "Z"],  // top bar
    [1, 1, "Z"], [1, 2, "Z"],                 // diagonal upper
    [2, 0, "Z"], [2, 1, "Z"],                 // diagonal lower
    [3, 0, "Z"], [3, 1, "Z"], [3, 2, "Z"],   // bottom bar
  ];
  for (const [dr, dc, ch] of z) {
    const r = startRow + dr;
    const c = startCol + dc;
    if (r < out.length && c < out[r].length) {
      out[r][c] = ch;
    }
  }
  return out.map(r => r.join(""));
}

const DN_READ_BAND_1 = [
  "LLKKKKKKKKKKKK...",
  "LKKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK.",
];

const DN_READ_BAND_2 = [
  ".LKKKKKKKKKKKK...",
  "LLKKKKKKKKKKKKKKK",
  "KKKKKKKKKKKKKKKK.",
];

// ============================================================
// UP-FACING BASE COMPONENTS
// ============================================================
const UP_EARS_HEAD = [
  "..KKKK..KKKK....",
  ".KKKKK..KKKKK...",
  ".KKKKK..KKKKK...",
  "..KKWWWWWWKK....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW..",
];

const UP_BACK_HEAD = [
  ".WWWWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW..",
  "..WWWWWWWWWWWW...",
  "...WWWWWWWWWW....",
];

const UP_BAND = [
  "..KKKKKKKKKKKK...",
  ".KKKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK.",
];

const UP_BODY = [
  "KKKKKKWWWWKKKKK..",
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

const UP_WALK1_LEGS = [
  "..KKKK...WKKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..........KKKK...",
];

const UP_WALK3_LEGS = [
  "..KKKKW...KKKK...",
  "..KKKK....KKKK...",
  "..KKKKK..KKKKK...",
  "..KKKK............",
];

const UP_TYPE_BODY = [
  "KKKKKKWWWWKKKKK..",
  "KKKKKWWWWWWKKKK..",
  "KKKKWWWWWWWWKKKK.",
  "KKKKWWWWWWWWKKKK.",
  "KKKKKWWWWWWKKKKK.",
  "..KKKKWWWWKKKK...",
  "...KKKK..KKKK....",
  "...KKKK..KKKK....",
  "..KKKKK..KKKKK...",
];

const UP_READ_BAND = [
  "..KKKKKKKKKKKK...",
  "LLKKKKKKKKKKKKKKK",
  "LKKKKKKKKKKKKKKK.",
];

// ============================================================
// RIGHT-FACING BASE COMPONENTS
// ============================================================
const RT_EAR_HEAD = [
  "....KKKK........",
  "...KKKKKK.......",
  "...KKKKKK.......",
  "..WKKKKWWWWW....",
  "..WWWWWWWWWWW...",
  "..WWWWWWWWWWW...",
];

const RT_FACE = [
  "..WWWWKKKKKWW...",
  "..WWWWKKEKKWW...",
  "..WWWWKKKKKWW...",
  "..WWWWWWWWWWW...",
  "...WWWWWWWWWK...",
  "....WWWWWWWW....",
];

const RT_FACE_SLEEP = [
  "..WWWWKKKKKWW...",
  "..WWWWKKKKKWW...",  // eye solid black (no glint)
  "..WWWWKKKKKWW...",
  "..WWWWWWWWWWW...",
  "...WWWWWWWWWK...",
  "....WWWWWWWW....",
];

const RT_BAND = [
  "....KKKKKKKK....",
  "...KKKKKKKKK....",
  "..KKKKKKKKKK....",
];

const RT_BODY = [
  "..KKKWWWWWK.....",
  ".KKKKWWGGWWK....",
  ".KKKKWGGGGWK....",
  ".KKKKWGGGGWK....",
  ".KKKKWWGGWWK....",
  "..KKKWWWWWK.....",
  "...KKKKKKKK.....",
];

const RT_LEGS_IDLE = [
  ".....KKKKKK.....",
  ".....KKKKKK.....",
  ".....KKKKKKK....",
];

const RT_WALK1_LEGS = [
  "......KKKKKK....",
  "......KKKKKK....",
  "......KKKKKKK...",
];

const RT_WALK3_LEGS = [
  "....KKKKKK......",
  "....KKKKKK......",
  "....KKKKKKK.....",
];

const RT_TYPE1_BODY = [
  "..KKKWWGGWWK....",
  "..KKBWGGGGWBK...",
  "..KKBWGGGGWBK...",
  "..KK.BWGGWB.K...",
  "....BWWWWB......",
  "...WWWWWWWW.....",
  ".....KKKKKK.....",
  ".....KKKKKK.....",
  ".....KKKKKKK....",
];

// Type2: same body as type1 (static seated pose)
const RT_TYPE2_BODY = RT_TYPE1_BODY;

// Sleeping face for right-facing: eye closed
const RT_READ_BAND = [
  "....KKKKKKK..LL.",
  "...KKKKKKKKKLL..",
  "..KKKKKKKKKKL...",
];

// ============================================================
// ACCESSORY COMPONENTS
// ============================================================

// Front sprout (4 rows)
const DN_SPROUT = [
  "........LL......",
  ".......LLL......",
  "......BLLL......",
  "......B.........",
];

// Back sprout — leaf mirrored left (4 rows)
const UP_SPROUT = [
  "....LL..........",
  "....LLL.........",
  "....LLLB........",
  ".......B........",
];

// Side sprout — thin edge-on profile (4 rows)
const RT_SPROUT = [
  "......L.........",
  "......LL........",
  "......BL........",
  "......B.........",
];

// Front bow (2 rows) — uses placeholder X, replaced with bow color
const DN_BOW = [
  ".....XX.XX......",
  "......XXX.......",
];

// Back bow — same as front (2 rows)
const UP_BOW = [
  ".....XX.XX......",
  "......XXX.......",
];

// Side bow — one loop visible (2 rows)
const RT_BOW = [
  "........XX......",
  ".......XX.......",
];

// ============================================================
// WAITING POSE — raised paw (cols 12-13, right side of head)
// Paw rows merge into the 4-row accessory header space.
// ============================================================

// Front: paw raised to right, 2 rows at top of 4-row header
const DN_PAW = [
  "............KK..",  // paw
  "...........KK...",  // arm angled in
];
// Frame 2: paw shifted (waving)
const DN_PAW2 = [
  ".............KK.",  // paw shifted right
  "............KK..",  // arm
];

// Back: same paw position (seen from behind, same side)
const UP_PAW = DN_PAW;
const UP_PAW2 = DN_PAW2;

// Side (right-facing): paw extends upward to the right (front of the panda)
const RT_PAW = [
  "..........KK....",  // paw
  "..........KK....",  // arm
];
const RT_PAW2 = [
  "...........KK...",  // paw shifted right
  "..........KK....",  // arm
];

// ============================================================
// VARIANT DEFINITIONS
// ============================================================
const FUR_VARIANTS = [
  { name: "classic", map: null },
  { name: "brown", map: { K: "D", W: "N", G: "H" } },
];

const ACCESSORY_VARIANTS = [
  { name: "none", type: null, color: null },
  { name: "sprout", type: "sprout", color: null },
  { name: "bow_red", type: "bow", color: "R" },
  { name: "bow_blue", type: "bow", color: "U" },
  { name: "bow_pink", type: "bow", color: "I" },
  { name: "bow_purple", type: "bow", color: "P" },
  { name: "bow_gold", type: "bow", color: "Y" },
];

const BAND_VARIANTS = [
  { name: "black", char: null },
  { name: "blue_scarf", char: "U" },
  { name: "green_scarf", char: "V" },
  { name: "purple_scarf", char: "P" },
  { name: "gold_scarf", char: "Y" },
];

// ============================================================
// FRAME BUILDER
// ============================================================

function generateSheet({ furMap, accType, bowColor, bandChar }) {
  // Fur recolor helper
  const rc = (rows) => furMap ? recolor(rows, furMap) : rows;

  // Band recolor: replace K with scarf char, or apply fur recolor for default band
  const bandRc = (rows) => {
    if (bandChar) {
      return rows.map(r =>
        r.split("").map(ch => ch === "K" ? bandChar : ch).join("")
      );
    }
    return rc(rows);
  };

  // Build accessory header + ears for a direction
  // extraEmpty: additional EMPTY rows between accessory and ears (e.g. 1 for typing shift)
  function makeHeader(baseEars, sprout, bow, extraEmpty = 0) {
    let accRows = [];
    if (accType === "sprout") {
      accRows = sprout;
    } else if (accType === "bow") {
      accRows = bow.map(r =>
        r.split("").map(ch => ch === "X" ? bowColor : ch).join("")
      );
    }
    const accPad = MAX_ACC_ROWS - accRows.length;
    return [
      ...Array(accPad + extraEmpty).fill(EMPTY),
      ...accRows,
      ...rc(baseEars),
    ];
  }

  // Build waiting header: paw rows merged with accessory rows in 4-row space
  function makeWaitHeader(baseEars, sprout, bow, paw, extraEmpty = 0) {
    // Paw is 2 rows. Accessory is 0/2/4 rows. Merge into 4 rows.
    let accRows = [];
    if (accType === "sprout") {
      accRows = sprout;
    } else if (accType === "bow") {
      accRows = bow.map(r =>
        r.split("").map(ch => ch === "X" ? bowColor : ch).join("")
      );
    }
    // Merge paw pixels into the 4-row header
    // Paw occupies first 2 rows; accessory occupies last N rows
    // For 4-row accessory (sprout): merge paw into first 2 sprout rows
    // For 2-row accessory (bow): paw in rows 0-1, bow in rows 2-3
    // For no accessory: paw in rows 0-1, empty rows 2-3
    let header;
    if (accRows.length === 4) {
      // Merge paw into accessory rows (different columns, no overlap)
      header = accRows.map((accRow, i) => {
        if (i < paw.length) {
          // Overlay: for each col, use paw pixel if non-dot, else accessory pixel
          return accRow.split("").map((ch, col) => {
            const pawCh = paw[i][col] || ".";
            return pawCh !== "." ? pawCh : ch;
          }).join("");
        }
        return accRow;
      });
    } else if (accRows.length === 2) {
      header = [...paw, ...accRows];
    } else {
      header = [...paw, EMPTY, EMPTY];
    }
    return [
      ...Array(extraEmpty).fill(EMPTY),
      ...header,
      ...rc(baseEars),
    ];
  }

  // --- DOWN FRAMES ---
  const dnH = makeHeader(DN_EARS_HEAD, DN_SPROUT, DN_BOW);
  const dnHType = makeHeader(DN_EARS_HEAD, DN_SPROUT, DN_BOW, 1); // +1 EMPTY for seated shift
  const dnHWait1 = makeWaitHeader(DN_EARS_HEAD, DN_SPROUT, DN_BOW, DN_PAW);
  const dnHWait2 = makeWaitHeader(DN_EARS_HEAD, DN_SPROUT, DN_BOW, DN_PAW2);

  const downWalk1 = pad32([...dnH, ...rc(DN_FACE), ...bandRc(DN_BAND), ...rc(DN_BODY), ...rc(DN_WALK1_LEGS)]);
  const downWalk2 = pad32([...dnH, ...rc(DN_FACE), ...bandRc(DN_BAND), ...rc(DN_BODY), ...rc(DN_LEGS_IDLE)]);
  const downWalk3 = pad32([...dnH, ...rc(DN_FACE), ...bandRc(DN_BAND), ...rc(DN_BODY), ...rc(DN_WALK3_LEGS)]);
  const downType1 = pad32([...dnHType, ...rc(DN_FACE), ...bandRc(DN_BAND), ...rc(DN_TYPE1_BODY)]);
  const downType2 = downType1; // static seated pose
  // Sleeping: standing idle + floating "z" (two positions for bobbing)
  const dnSleep = pad32([...dnH, ...rc(DN_FACE_SLEEP), ...bandRc(DN_BAND), ...rc(DN_BODY), ...rc(DN_LEGS_IDLE)]);
  const downRead1 = stampZ(dnSleep, 1, 12);   // Z high
  const downRead2 = stampZ(dnSleep, 3, 12);   // Z low (bob down)

  // --- UP FRAMES ---
  const upH = makeHeader(UP_EARS_HEAD, UP_SPROUT, UP_BOW);
  const upHType = makeHeader(UP_EARS_HEAD, UP_SPROUT, UP_BOW, 1);
  const upHWait1 = makeWaitHeader(UP_EARS_HEAD, UP_SPROUT, UP_BOW, UP_PAW);
  const upHWait2 = makeWaitHeader(UP_EARS_HEAD, UP_SPROUT, UP_BOW, UP_PAW2);

  const upWalk1 = pad32([...upH, ...rc(UP_BACK_HEAD), ...bandRc(UP_BAND), ...rc(UP_BODY), ...rc(UP_WALK1_LEGS)]);
  const upWalk2 = pad32([...upH, ...rc(UP_BACK_HEAD), ...bandRc(UP_BAND), ...rc(UP_BODY), ...rc(UP_LEGS_IDLE)]);
  const upWalk3 = pad32([...upH, ...rc(UP_BACK_HEAD), ...bandRc(UP_BAND), ...rc(UP_BODY), ...rc(UP_WALK3_LEGS)]);
  const upType1 = pad32([...upHType, ...rc(UP_BACK_HEAD), ...bandRc(UP_BAND), ...rc(UP_TYPE_BODY)]);
  const upType2 = upType1; // static seated pose
  const upIdle = pad32([...upH, ...rc(UP_BACK_HEAD), ...bandRc(UP_BAND), ...rc(UP_BODY), ...rc(UP_LEGS_IDLE)]);
  const upRead1 = stampZ(upIdle, 1, 12);
  const upRead2 = stampZ(upIdle, 3, 12);

  // --- RIGHT FRAMES ---
  // Right-facing has 1 extra leading EMPTY (body is 1 row shorter than down)
  const rtH = makeHeader(RT_EAR_HEAD, RT_SPROUT, RT_BOW, 1);
  const rtHType = makeHeader(RT_EAR_HEAD, RT_SPROUT, RT_BOW, 3); // 3 extra for seated
  const rtHWait1 = makeWaitHeader(RT_EAR_HEAD, RT_SPROUT, RT_BOW, RT_PAW, 1);
  const rtHWait2 = makeWaitHeader(RT_EAR_HEAD, RT_SPROUT, RT_BOW, RT_PAW2, 1);

  const rightWalk1 = pad32([...rtH, ...rc(RT_FACE), ...bandRc(RT_BAND), ...rc(RT_BODY), ...rc(RT_WALK1_LEGS)]);
  const rightWalk2 = pad32([...rtH, ...rc(RT_FACE), ...bandRc(RT_BAND), ...rc(RT_BODY), ...rc(RT_LEGS_IDLE)]);
  const rightWalk3 = pad32([...rtH, ...rc(RT_FACE), ...bandRc(RT_BAND), ...rc(RT_BODY), ...rc(RT_WALK3_LEGS)]);
  const rightType1 = pad32([...rtHType, ...rc(RT_FACE), ...bandRc(RT_BAND), ...rc(RT_TYPE1_BODY)]);
  const rightType2 = rightType1; // static seated pose
  const rtSleep = pad32([...rtH, ...rc(RT_FACE_SLEEP), ...bandRc(RT_BAND), ...rc(RT_BODY), ...rc(RT_LEGS_IDLE)]);
  const rightRead1 = stampZ(rtSleep, 1, 12);
  const rightRead2 = stampZ(rtSleep, 3, 12);

  return [
    [downWalk1, downWalk2, downWalk3, downType1, downType2, downRead1, downRead2],
    [upWalk1, upWalk2, upWalk3, upType1, upType2, upRead1, upRead2],
    [rightWalk1, rightWalk2, rightWalk3, rightType1, rightType2, rightRead1, rightRead2],
  ];
}

// ============================================================
// PNG RENDERER
// ============================================================

function renderSheet(frameGrid) {
  const png = new PNG({ width: IMG_W, height: IMG_H });
  // Clear to transparent
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 0; png.data[i + 1] = 0;
    png.data[i + 2] = 0; png.data[i + 3] = 0;
  }

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const frame = frameGrid[row][col];
      const ox = col * FRAME_W;
      const oy = row * FRAME_H;
      for (let y = 0; y < FRAME_H; y++) {
        const line = frame[y] || "";
        for (let x = 0; x < FRAME_W; x++) {
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
  return PNG.sync.write(png);
}

// ============================================================
// GENERATE ALL VARIANTS
// ============================================================

const outDir = join(__dirname, "..", "webview-ui", "public", "assets", "characters");
const manifest = [];
let index = 0;

for (const fur of FUR_VARIANTS) {
  for (const acc of ACCESSORY_VARIANTS) {
    for (const band of BAND_VARIANTS) {
      const label = `${fur.name}_${acc.name}_${band.name}`;
      const sheet = generateSheet({
        furMap: fur.map,
        accType: acc.type,
        bowColor: acc.color,
        bandChar: band.char,
      });
      const pngData = renderSheet(sheet);
      const filename = `char_${index}.png`;
      writeFileSync(join(outDir, filename), pngData);

      manifest.push({ index, filename, fur: fur.name, accessory: acc.name, band: band.name });
      index++;
    }
  }
}

// Write manifest
writeFileSync(
  join(outDir, "panda_manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log(`Generated ${index} variant sprite sheets in ${outDir}`);
console.log(`Manifest: ${join(outDir, "panda_manifest.json")}`);
