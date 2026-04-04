import type { SpriteData, Structure } from './types.js'

// --- Palette (hex, r2) ---
const T  = '#B99B34' // thatch base (saturated gold)
const Td = '#9E8228' // thatch dark / edge
const Th = '#CDB24B' // thatch highlight
const Te = '#826C23' // eave underside shadow
const b  = '#8C7044' // bamboo wall base (processed brown)
const bh = '#A28A5C' // bamboo wall highlight
const bj = '#6C5230' // bamboo wall joint / dark
const D  = '#554B3A' // interior back wall
const d  = '#5F5541' // interior floor
const S  = '#8C7855' // stone light
const Sd = '#7D6948' // stone dark
const Rb = '#785F32' // ridge beam (darker wood, longhouse only)
const _  = ''        // transparent

// --- Geometry constants shared across all sizes ---
const GH = 96
const ROOF_H = 42
const MIN_RW = 12
const WT = 43
const WB = 86

/**
 * Compute doorway boundaries for a given hut width and doorway count.
 * Each doorway is 32px wide. Doorways are evenly distributed within the wall area.
 * Returns array of { dl, dr } (left/right x coords for each doorway).
 */
function computeDoorways(
  gw: number,
  wl: number,
  wr: number,
  count: number,
): Array<{ dl: number; dr: number }> {
  const wallWidth = wr - wl + 1
  const doorWidth = 32 // each doorway span in pixels
  // Total width consumed by all doorways
  const totalDoorWidth = count * doorWidth
  // Remaining wall space for dividers and margins
  const remaining = wallWidth - totalDoorWidth
  // Gaps: one before first, one between each pair, one after last = count + 1
  const gapCount = count + 1
  const gap = Math.floor(remaining / gapCount)

  const doors: Array<{ dl: number; dr: number }> = []
  for (let i = 0; i < count; i++) {
    const dl = wl + gap * (i + 1) + doorWidth * i
    const dr = dl + doorWidth - 1
    doors.push({ dl, dr })
  }
  return doors
}

/** True when (x, r) is inside any doorway opening (arch + full rect). */
function inAnyDoorway(
  x: number,
  r: number,
  doors: Array<{ dl: number; dr: number }>,
  doorFull: number,
): boolean {
  for (const { dl, dr } of doors) {
    if (x < dl || x > dr) continue
    if (r >= doorFull) return true
    if (r >= WT) {
      const inset = doorFull - r
      if (x >= dl + inset && x <= dr - inset) return true
    }
  }
  return false
}

// ---------------------------------------------------------------------------
// Parameterized sprite builders
// ---------------------------------------------------------------------------

function buildBackSprite(
  gw: number,
  doors: Array<{ dl: number; dr: number }>,
  doorFull: number,
): SpriteData {
  const sprite: SpriteData = Array.from({ length: GH }, () => Array<string>(gw).fill(_))

  for (let r = WT; r <= WB; r++) {
    for (const { dl, dr } of doors) {
      for (let x = dl; x <= dr; x++) {
        if (!inAnyDoorway(x, r, [{ dl, dr }], doorFull)) continue
        sprite[r][x] = r >= WB - 2 ? d : D
      }
    }
  }

  return sprite
}

function buildFrontSprite(
  gw: number,
  wl: number,
  wr: number,
  doors: Array<{ dl: number; dr: number }>,
  doorFull: number,
): SpriteData {
  const sprite: SpriteData = Array.from({ length: GH }, () => Array<string>(gw).fill(_))
  const maxRw = gw - 8 // roof width proportional to hut width

  // 1. Thatch dome roof (rows 0-20)
  for (let r = 0; r < ROOF_H; r++) {
    const frac = r / (ROOF_H - 1)
    const w = Math.round(MIN_RW + (maxRw - MIN_RW) * Math.sqrt(frac))
    const x1 = Math.floor((gw - w) / 2)
    const x2 = x1 + w - 1

    for (let x = x1; x <= x2; x++) sprite[r][x] = T

    sprite[r][x1] = Td
    if (w > 2) sprite[r][x1 + 1] = Td
    sprite[r][x2] = Td
    if (w > 2) sprite[r][x2 - 1] = Td

    const off = (r % 2) * 2
    for (let x = x1 + 3 + off; x < x2 - 2; x += 5) sprite[r][x] = Th

    if (r > 0 && r % 5 === 0) {
      for (let x = x1 + 2; x <= x2 - 2; x++) {
        if ((x + r) % 3 !== 0) sprite[r][x] = Td
      }
    }
  }

  // 2. Eave shadow (row 42) — spans full width with small margin
  for (let x = 4; x <= gw - 5; x++) sprite[42][x] = Te

  // 3. Bamboo walls + doorway frames (rows 44-86)
  for (let r = WT; r <= WB; r++) {
    for (let x = wl; x <= wr; x++) {
      if (inAnyDoorway(x, r, doors, doorFull)) {
        sprite[r][x] = _
        continue
      }

      const rx = x - wl
      const ry = r - WT
      if (ry % 7 === 0) {
        sprite[r][x] = bj
      } else if (rx % 4 === 0) {
        sprite[r][x] = bh
      } else {
        sprite[r][x] = b
      }
    }

    // Door frames for each doorway
    if (r >= WT) {
      for (const { dl, dr } of doors) {
        const inset = r < doorFull ? (doorFull - r) : 0
        const fl = dl + inset - 1
        const fr = dr - inset + 1
        if (fl >= wl) sprite[r][fl] = bj
        if (fr <= wr) sprite[r][fr] = bj
      }
    }
  }

  // 4. Stone foundation (rows 87-95)
  for (let r = 87; r < GH; r++) {
    const color = r % 2 === 0 ? S : Sd
    for (let x = wl - 1; x <= wr + 1; x++) sprite[r][x] = color
  }

  return sprite
}

// ---------------------------------------------------------------------------
// Large hut front sprite — ridge beam / longhouse roof
// ---------------------------------------------------------------------------

const RIDGE_W = 48    // flat ridge width at peak
const RIDGE_ROWS = 10 // rows of flat ridge (0-9)

function buildLargeFrontSprite(
  gw: number,
  wl: number,
  wr: number,
  doors: Array<{ dl: number; dr: number }>,
  doorFull: number,
): SpriteData {
  const sprite: SpriteData = Array.from({ length: GH }, () => Array<string>(gw).fill(_))
  const maxRw = gw - 8

  // 1. Ridge beam roof (rows 0-20) — flat ridge then linear slopes
  for (let r = 0; r < ROOF_H; r++) {
    let w: number
    if (r < RIDGE_ROWS) {
      w = RIDGE_W
    } else {
      const slopeFrac = (r - RIDGE_ROWS) / (ROOF_H - 1 - RIDGE_ROWS)
      w = Math.round(RIDGE_W + (maxRw - RIDGE_W) * slopeFrac)
    }
    const x1 = Math.floor((gw - w) / 2)
    const x2 = x1 + w - 1

    for (let x = x1; x <= x2; x++) sprite[r][x] = T

    // Dark edges
    sprite[r][x1] = Td
    if (w > 2) sprite[r][x1 + 1] = Td
    sprite[r][x2] = Td
    if (w > 2) sprite[r][x2 - 1] = Td

    if (r < RIDGE_ROWS) {
      // Ridge beam borders
      if (r === 0 || r === RIDGE_ROWS - 1) {
        for (let x = x1 + 2; x <= x2 - 2; x++) sprite[r][x] = Rb
      }
      // Highlights on ridge body
      const off = (r % 2) * 2
      for (let x = x1 + 3 + off; x < x2 - 2; x += 4) sprite[r][x] = Th
    } else {
      // Slope highlights
      const off = (r % 2) * 2
      for (let x = x1 + 3 + off; x < x2 - 2; x += 5) sprite[r][x] = Th
      // Tighter thatch lines on slope (every 4 rows)
      if (r > RIDGE_ROWS && (r - RIDGE_ROWS) % 4 === 0) {
        for (let x = x1 + 2; x <= x2 - 2; x++) {
          if ((x + r) % 3 !== 0) sprite[r][x] = Td
        }
      }
    }
  }

  // 2. Eave shadow
  for (let x = 4; x <= gw - 5; x++) sprite[42][x] = Te

  // 3. Bamboo walls + doorway frames (same as dome huts)
  for (let r = WT; r <= WB; r++) {
    for (let x = wl; x <= wr; x++) {
      if (inAnyDoorway(x, r, doors, doorFull)) {
        sprite[r][x] = _
        continue
      }

      const rx = x - wl
      const ry = r - WT
      if (ry % 7 === 0) {
        sprite[r][x] = bj
      } else if (rx % 4 === 0) {
        sprite[r][x] = bh
      } else {
        sprite[r][x] = b
      }
    }

    if (r >= WT) {
      for (const { dl, dr } of doors) {
        const inset = r < doorFull ? (doorFull - r) : 0
        const fl = dl + inset - 1
        const fr = dr - inset + 1
        if (fl >= wl) sprite[r][fl] = bj
        if (fr <= wr) sprite[r][fr] = bj
      }
    }
  }

  // 4. Stone foundation (rows 87-95)
  for (let r = 87; r < GH; r++) {
    const color = r % 2 === 0 ? S : Sd
    for (let x = wl - 1; x <= wr + 1; x++) sprite[r][x] = color
  }

  return sprite
}

/**
 * Create a dome-roofed hut structure with the given dimensions and doorway count.
 * Doorway offsets are pixel x-positions (dl) relative to the sprite's left edge.
 */
function createHut(
  id: string,
  col: number,
  row: number,
  type: string,
  gw: number,
  widthTiles: number,
  doorCount: number,
): Structure {
  const wl = 12
  const wr = gw - 13
  const doorFull = 52

  const doors = computeDoorways(gw, wl, wr, doorCount)
  const back = buildBackSprite(gw, doors, doorFull)
  const front = buildFrontSprite(gw, wl, wr, doors, doorFull)

  return {
    id,
    type,
    col,
    row,
    backSprite: back,
    frontSprite: front,
    widthTiles,
    heightTiles: 3,
    doorways: doors.map(({ dl }) => dl),
  }
}

// Pre-compute the small hut sprites once at module load (preserves existing perf)
const smallDoors = computeDoorways(96, 12, 83, 1)
const smallBack = buildBackSprite(96, smallDoors, 52)
const smallFront = buildFrontSprite(96, 12, 83, smallDoors, 52)

export function createSmallHut(id: string, col: number, row: number): Structure {
  return {
    id,
    type: 'small_hut',
    col,
    row,
    backSprite: smallBack,
    frontSprite: smallFront,
    widthTiles: 3,
    heightTiles: 3,
    doorways: smallDoors.map(({ dl }) => dl),
  }
}

export function createMediumHut(id: string, col: number, row: number): Structure {
  return createHut(id, col, row, 'medium_hut', 160, 5, 2)
}

export function createLargeHut(id: string, col: number, row: number): Structure {
  const gw = 192
  const widthTiles = 6
  const doorCount = 3
  const wl = 12
  const wr = gw - 13
  const doorFull = 52

  const doors = computeDoorways(gw, wl, wr, doorCount)
  const back = buildBackSprite(gw, doors, doorFull)
  const front = buildLargeFrontSprite(gw, wl, wr, doors, doorFull)

  return {
    id,
    type: 'large_hut',
    col,
    row,
    backSprite: back,
    frontSprite: front,
    widthTiles,
    heightTiles: 3,
    doorways: doors.map(({ dl }) => dl),
  }
}
