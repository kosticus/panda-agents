import type { SpriteData, Structure } from './types.js'

// --- Palette (hex) ---
const T  = '#B99B5A' // thatch base
const Td = '#A5874B' // thatch dark / edge
const Th = '#CDB273' // thatch highlight
const Te = '#917841' // eave underside shadow
const b  = '#788A69' // bamboo stalk
const bh = '#9BAC8C' // bamboo highlight
const bj = '#5A694E' // bamboo joint / dark
const D  = '#554B3A' // interior back wall
const d  = '#5F5541' // interior floor
const S  = '#8C7855' // stone light
const Sd = '#7D6948' // stone dark
const _  = ''        // transparent

// --- Geometry constants (from generate-hut-preview.mjs) ---
const GW = 48
const GH = 48
const ROOF_H = 21
const MAX_RW = 44
const MIN_RW = 6
const WL = 6
const WR = 41
const WT = 22
const WB = 43
const DL = 16
const DR = 31
const DOOR_FULL = 26

/** True when (x, r) is inside the doorway opening (arch + full rect). */
function inDoorway(x: number, r: number): boolean {
  if (x < DL || x > DR) return false
  if (r >= DOOR_FULL) return true
  if (r >= WT) {
    const inset = DOOR_FULL - r // 4 → 3 → 2 → 1
    return x >= DL + inset && x <= DR - inset
  }
  return false
}

// ---------------------------------------------------------------------------
// Build back layer: only doorway interior pixels, everything else transparent
// ---------------------------------------------------------------------------
function buildBackSprite(): SpriteData {
  const sprite: SpriteData = Array.from({ length: GH }, () => Array<string>(GW).fill(_))

  for (let r = WT; r <= WB; r++) {
    for (let x = DL; x <= DR; x++) {
      if (!inDoorway(x, r)) continue
      // Floor rows 41-43 get lighter interior color
      sprite[r][x] = r >= WB - 2 ? d : D
    }
  }

  return sprite
}

// ---------------------------------------------------------------------------
// Build front layer: roof, walls, foundation — transparent where doorway is
// ---------------------------------------------------------------------------
function buildFrontSprite(): SpriteData {
  const sprite: SpriteData = Array.from({ length: GH }, () => Array<string>(GW).fill(_))

  // 1. Thatch dome roof (rows 0-20)
  for (let r = 0; r < ROOF_H; r++) {
    const frac = r / (ROOF_H - 1) // 0 at peak, 1 at base
    const w = Math.round(MIN_RW + (MAX_RW - MIN_RW) * Math.sqrt(frac))
    const x1 = Math.floor((GW - w) / 2)
    const x2 = x1 + w - 1

    // Base thatch fill
    for (let x = x1; x <= x2; x++) sprite[r][x] = T

    // Dark edges (2px border)
    sprite[r][x1] = Td
    if (w > 2) sprite[r][x1 + 1] = Td
    sprite[r][x2] = Td
    if (w > 2) sprite[r][x2 - 1] = Td

    // Scattered straw highlights (staggered every other row)
    const off = (r % 2) * 2
    for (let x = x1 + 3 + off; x < x2 - 2; x += 5) sprite[r][x] = Th

    // Horizontal thatch layer lines every 5 rows
    if (r > 0 && r % 5 === 0) {
      for (let x = x1 + 2; x <= x2 - 2; x++) {
        if ((x + r) % 3 !== 0) sprite[r][x] = Td
      }
    }
  }

  // 2. Eave shadow (row 21)
  for (let x = 2; x <= 45; x++) sprite[21][x] = Te

  // 3. Bamboo walls + doorway frame (rows 22-43)
  for (let r = WT; r <= WB; r++) {
    for (let x = WL; x <= WR; x++) {
      if (inDoorway(x, r)) {
        // Doorway opening — transparent so character shows through
        sprite[r][x] = _
        continue
      }

      // Bamboo wall texture
      const rx = x - WL
      const ry = r - WT
      if (ry % 7 === 0) {
        sprite[r][x] = bj       // joint row
      } else if (rx % 4 === 0) {
        sprite[r][x] = bh       // highlight stalk
      } else {
        sprite[r][x] = b        // base bamboo
      }
    }

    // Door frame: dark bamboo border around opening
    if (r >= WT) {
      const inset = r < DOOR_FULL ? (DOOR_FULL - r) : 0
      const fl = DL + inset - 1
      const fr = DR - inset + 1
      if (fl >= WL) sprite[r][fl] = bj
      if (fr <= WR) sprite[r][fr] = bj
    }
  }

  // 4. Stone foundation (rows 44-47)
  for (let r = 44; r < GH; r++) {
    const color = r % 2 === 0 ? S : Sd
    for (let x = WL - 1; x <= WR + 1; x++) sprite[r][x] = color
  }

  return sprite
}

// Pre-compute the sprites once at module load
const backSprite: SpriteData = buildBackSprite()
const frontSprite: SpriteData = buildFrontSprite()

export function createSmallHut(id: string, col: number, row: number): Structure {
  return {
    id,
    type: 'small_hut',
    col,
    row,
    backSprite,
    frontSprite,
    widthTiles: 3,
    heightTiles: 3,
  }
}
