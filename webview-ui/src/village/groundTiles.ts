/**
 * Village ground tile pixel data.
 *
 * 9 tile patterns (3 grass, 3 path, 3 bamboo) converted from
 * scripts/generate-ground-preview.mjs character grids.
 * Pre-colored hex values — no runtime colorization needed.
 */

import type { SpriteData } from './types.js'
import { TileType } from './types.js'
import { tileMap, VILLAGE_COLS, VILLAGE_ROWS } from './tileMap.js'

// --- Palette: character → CSS hex color (r2 — from generate-ground-preview.mjs) ---
const P: Record<string, string> = {
  // Bamboo (lightened stalks for contrast against dark fill)
  b: '#6E8255', h: '#96AC80', j: '#415037',
  l: '#5F9B2D', f: '#879878', e: '#9BAA8C',
  // Grass (slightly darker, r2)
  g: '#64913E', d: '#487330', t: '#82A555', m: '#558234',
  // Path (warm sandy — unchanged from r1)
  s: '#C3AF8C', k: '#AA9678', w: '#D7C3A5', p: '#9B8C78',
  // Gathering (packed earth / sun-baked clay)
  c: '#A57844', v: '#87663A', x: '#B4915F', y: '#735834',
  // Water (cool blues — pond/stream)
  W: '#4678AA', L: '#5A91C3', D: '#325F8C', R: '#6EA5D2', S: '#3C6C9B',
  // Garden (warm brown soil + green sprouts)
  B: '#8C6941', K: '#735532', H: '#A58255', P: '#64A050', Q: '#4B823C',
  // Woodcutting (trampled mud + sawdust)
  E: '#786946', F: '#B49B6E', J: '#645032', M: '#877D55',
  // Cooking (ashy packed earth + charcoal — cool gray, distinct from warm gathering clay)
  A: '#7D766C', I: '#645C52', N: '#9B968C', O: '#373028',
  // Stump landmark (distinct from woodcutting base)
  r: '#4A2E14', u: '#D4A858', z: '#8C5E28',
  // Fire landmark (warm flame colors)
  a: '#CC3C10', q: '#E87828', n: '#F0C030',
}

/** Convert a 16-row character grid into SpriteData (16×16 hex array). */
function toSprite(rows: readonly string[]): SpriteData {
  return rows.map((row) =>
    Array.from(row, (ch) => P[ch] ?? ''),
  )
}

// =====================
// GRASS TILES
// =====================

const grass1 = toSprite([
  'ggggtgggggdggggg',
  'gdgggggdgggggggt',
  'ggggggggggggtggg',
  'ggtggdggggggggdg',
  'gggggggggdgggggg',
  'gggdggggggggtggg',
  'gggggggtgggggggd',
  'ggtggggggggggggg',
  'gggggdggggggtggg',
  'ggggggggdggggggg',
  'gdgggtggggggdggg',
  'gggggggggdgggggg',
  'gggdgggggggggggt',
  'ggggggggggggtggg',
  'gtgggdggggggggdg',
  'ggggggtggdgggggg',
])

const grass2 = toSprite([
  'ggtgggggdgggtggg',
  'gttggdggggggdggg',
  'gtgggggggtggggdg',
  'ggdgggggtttggggg',
  'ggggggtgggtggggg',
  'gdgggtggggdggggg',
  'ggggggdggggggtgg',
  'ggtgggggggdggggg',
  'gggdggtggggtgggg',
  'gggggddgggggggdg',
  'gtgggdggggdggggg',
  'gggggggggddggggt',
  'gdgggtggggggdggg',
  'ggggggdggggtgggg',
  'ggdgggggggggtggg',
  'ggtggdggggggdggg',
])

const grass3 = toSprite([
  'gdgmgggdggmggdgg',
  'gmggdggmgggdgggg',
  'ggggdggdggggggmg',
  'gdgmggggggdmgggg',
  'gggdggmgggggggdg',
  'gmgggdgggmdggggg',
  'gggdggmggggggdgm',
  'gdggggggdggmgggg',
  'gggmgdggggdgggdg',
  'ggggggmggggggmgg',
  'gmgdgggggdgmgggg',
  'gggggmgdggggdggg',
  'gdggggmgggmdgggg',
  'gggdggggdggggmgg',
  'gmgggdgggggdgggg',
  'gggmggggmdggggdg',
])

// =====================
// PATH TILES
// =====================

const path1 = toSprite([
  'wswwwwwkwwwswwww',
  'wwswwswwwwwswwpw',
  'wwwswpwwwswwwwsw',
  'swwwwwwswkwwwwww',
  'wpwwswwwwwswwwkw',
  'wwswwkwwwswwwsww',
  'swwpwswwwwwkwwww',
  'wwwwswwwswwwwpww',
  'wkwwwwpwwswwswww',
  'swwwswwwwwwkwwpw',
  'wwpwwwwwswwwswww',
  'wwswwkwwwwpwwwsw',
  'wpwwwwswwwwwkwww',
  'swwpwwwwwwswwwww',
  'wwwwswwkwwwwwsww',
  'wkwwwwwwswwwwwpw',
])

// =====================
// BAMBOO TILES
// =====================

// Stalks at cols 2-5 (bhhb), 8-10 (bhb), 12-15 (bhhb). Left margin jitter.
// Fill uses d/m only (dark canopy floor) for contrast against lightened stalks.
const bamboo1 = toSprite([
  'dmbhhbdmbhbdbhhb',
  'mdbhhbmdbhbmbhhb',
  'dmbhhbdmjhjdbhhb',
  'dlbhhbdmbhbdbhhb',
  'dmjhhjdmbhbmbhhb',
  'ddbhhbmdbhbmbhhb',
  'ldbhhbmdbhbdjhhj',
  'dmbhhbdmbhbmbhhb',
  'mdbhhbdmbhbdbhhb',
  'mdbhhbddjhjdbhhb',
  'dmbhhbmdbhbmbhhb',
  'dljhhjmdbhbmbhhb',
  'mdbhhbddbhbdbhhb',
  'dmbhhbdmbhbdjhhj',
  'ldbhhbmdbhbdbhhb',
  'mdbhhbmdbhbdbhhb',
])

// Stalks at cols 0-3 (bhhb), 5-7 (bhb), 10-13 (bhhb). Right margin jitter.
// Fill uses d/m only (dark canopy floor) for contrast against lightened stalks.
const bamboo2 = toSprite([
  'bhhbdbhbdmbhhbdm',
  'bhhbmbhbdmjhhjdm',
  'bhhbdbhbmdbhhbdd',
  'bhhbdjhjmdbhhbdl',
  'bhhbmbhbdmbhhbdm',
  'jhhjdbhbmmbhhbdd',
  'bhhbdbhbddbhhbdm',
  'bhhbmbhbdmbhhbld',
  'bhhbmbhbdmjhhjdm',
  'bhhbdbhbddbhhbmm',
  'bhhbmjhjdmbhhbdd',
  'bhhbdbhbmmbhhbdl',
  'jhhjdbhbddbhhbmd',
  'bhhbmbhbdmbhhbdm',
  'bhhbmbhbdmbhhbdl',
  'bhhbdbhbddbhhbmm',
])

// Stalks at cols 1-3 (bhb), 6-9 (bhhb), 12-14 (bhb). Both margins jitter.
// Fill uses d/m only (dark canopy floor) for contrast against lightened stalks.
const bamboo3 = toSprite([
  'dbhbdmbhhbddbhbm',
  'mbhbddbhhbdmjhjd',
  'dbhbmdbhhbdmbhbl',
  'djhjdmbhhbddbhbm',
  'lbhbdmbhhbdmbhbd',
  'mbhbddbhhbdmbhbd',
  'mbhbddjhhjddbhbd',
  'dbhbmdbhhbdmbhbd',
  'dbhbmdbhhbddjhjl',
  'dbhbdmbhhbddbhbm',
  'djhjdmbhhbmdbhbd',
  'mbhbddbhhbddbhbl',
  'lbhbdmbhhbddbhbm',
  'dbhbdmjhhjdmbhbd',
  'mbhbmdbhhbdmbhbd',
  'dbhbdmbhhbddbhbm',
])

// =====================
// GATHERING TILES
// =====================

// Interior — solid packed earth with scattered texture
const gather1 = toSprite([
  'ccxccvcccxcccvcc',
  'cvccccxccccxcccc',
  'cccvcccccvcccxcc',
  'cxccccvcccccccvc',
  'ccccxccccxcccccc',
  'cvcccccxcccvccxc',
  'ccccvccccccccccv',
  'cxccccccvcccxccc',
  'cccxcvcccccccccx',
  'cvccccccxcvccccv',
  'ccccxcccccccxccc',
  'cxcccvcccxcccccc',
  'ccvccccxcccvcccx',
  'cccccxcccccccvcc',
  'cvcccccvcxcccccc',
  'ccxcccccccvcxccc',
])

// =====================
// WATER TILES
// =====================

// Plain pond surface with subtle ripple pattern
const water1 = toSprite([
  'WWWLWWWWSWWWWLWW',
  'WWWWWWLWWWWWWWWW',
  'WSWWWWWWWWLWWWWW',
  'WWWWLWWWWWWWWSWW',
  'WWWWWWWSWWWWWWWL',
  'WLWWWWWWWWWWLWWW',
  'WWWWWWLWWSWWWWWW',
  'WWWSWWWWWWWWWWLW',
  'WWWWWWWWLWWWWWWW',
  'WLWWWSWWWWWWSWWW',
  'WWWWWWWWWLWWWWWW',
  'WWWWLWWWWWWWWWLW',
  'WSWWWWWWWWLWWWWW',
  'WWWWWWLWWWWWWSWW',
  'WWLWWWWWSWWWWWWW',
  'WWWWSWWWWWWLWWWW',
])

// =====================
// GARDEN TILES
// =====================

// Tilled soil with crop rows
const garden1 = toSprite([
  'BKBBHBBKBBHBBKBB',
  'KPQKKKPQKKKPQKKK',
  'BKBBHBBKBBHBBKBB',
  'KKKPQKKKKKPQKKKK',
  'BHBBKBBHBBKBBHBB',
  'KPQKKKPQKKKPQKKK',
  'BKBBHBBKBBHBBKBB',
  'KKKPQKKKKKPQKKKK',
  'BHBBKBBHBBKBBHBB',
  'KPQKKKPQKKKPQKKK',
  'BKBBHBBKBBHBBKBB',
  'KKKPQKKKKKPQKKKK',
  'BHBBKBBHBBKBBHBB',
  'KPQKKKPQKKKPQKKK',
  'BKBBHBBKBBHBBKBB',
  'KKKPQKKKKKPQKKKK',
])

// =====================
// WOODCUTTING TILES
// =====================

// Trampled grass with sawdust patches
const wood1 = toSprite([
  'EEgEEFEEgEEEJEgE',
  'EgEEEEJEEEFEEEEE',
  'EEEFEEEEEJEEEgEE',
  'gEEEEEEFEEEEEEJE',
  'EEJEEgEEEEFEEEEE',
  'EEEEFEEJEEEEgEEE',
  'EgEEEEEEEEJEEFEE',
  'EEEEJEFEEEEEEEgE',
  'EFEEEEEEgEEFEEEE',
  'EEEgEEJEEEEEEJEE',
  'EEEEEEEEFEgEEEEE',
  'EJEEFEgEEEEEEFEE',
  'EEEEEEEEEJEEEEgE',
  'EgEEJEEFEEEEJEEE',
  'EEFEEEEEEgEEEEFE',
  'EEEEgEJEEEEFEEEE',
])

// With stump landmark — contrasting bark (r), heartwood (u), rings (z)
const wood2 = toSprite([
  'EEgEEFEEgEEEJEgE',
  'EgEEEEJEEEFEEEEE',
  'EEEFEEEEEJEEEgEE',
  'gEEEEEEFEEEEEEJE',
  'EEJEEgrrrrFEEEEE',
  'EEEEFruuuurEgEEE',
  'EgEEEruzzurEEFEE',
  'EEEErruuurrEEEgE',
  'EFEEErrrrrrFEgEE',
  'EEEgEEJEEEEEEJEE',
  'EEEEEEEEFEgEEEEE',
  'EJEEFEgEEEEEEFEE',
  'EEEEEEEEEJEEEEgE',
  'EgEEJEEFEEEEJEEE',
  'EEFEEEEEEgEEEEFE',
  'EEEEgEJEEEEFEEEE',
])

// =====================
// COOKING TILES
// =====================

// Packed earth with soot
const cook1 = toSprite([
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAAAAAAAANA',
  'AIAAAAAANAAAOAAA',
  'AAAANAAAAAAAIAAA',
  'AAOAAAAAIAAAAAAN',
  'AAAAAANAAAAAAAOA',
  'AAIAAAAAAOAAAAAA',
  'AAAAAAOAAAAAIANA',
  'ANAAAAAAAIAAAAAA',
  'AAAOAAIAAAAAANAA',
  'AAAAAAAANAAAOAAA',
  'AIAAANAAAAAAIAAA',
  'AAAAAAAAOAAAAAAA',
  'AAANAAAAAAIAAANA',
])

// Fire pit variants — same 3/4 stone pit, different flame shapes
// Variant 1: flame leans right
const cook2 = toSprite([
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAAnAAAAANA',
  'AIAAAAAqnqAAOAAA',
  'AAAANAqnaqAAIAAA',
  'AAOAAOqaaqOAAAAN',
  'AAAAAOOaaOOAAAOA',
  'AAIAAOOOOOOAAAAA',
  'AAAAAAOOOOOAIANA',
  'ANAAAAAAAIAAAAAA',
  'AAAOAAIAAAAAANAA',
  'AAAAAAAANAAAOAAA',
  'AIAAANAAAAAAIAAA',
  'AAAAAAAAOAAAAAAA',
  'AAANAAAAAAIAAANA',
])

// Variant 2: flame leans left
const cook3 = toSprite([
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAnAAAAAANA',
  'AIAAAqnqAAAAOAAA',
  'AAAANaqnqAAAIAAA',
  'AAOAAOqaaqOAAAAN',
  'AAAAAOOaaOOAAAOA',
  'AAIAAOOOOOOAAAAA',
  'AAAAAAOOOOOAIANA',
  'ANAAAAAAAIAAAAAA',
  'AAAOAAIAAAAAANAA',
  'AAAAAAAANAAAOAAA',
  'AIAAANAAAAAAIAAA',
  'AAAAAAAAOAAAAAAA',
  'AAANAAAAAAIAAANA',
])

// Variant 3: tall narrow centered flame
const cook4 = toSprite([
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAnAAAAAANA',
  'AIAAAAAnqAAAOAAA',
  'AAAANAqnqAAAIAAA',
  'AAOAAOqaaqOAAAAN',
  'AAAAAOOaaOOAAAOA',
  'AAIAAOOOOOOAAAAA',
  'AAAAAAOOOOOAIANA',
  'ANAAAAAAAIAAAAAA',
  'AAAOAAIAAAAAANAA',
  'AAAAAAAANAAAOAAA',
  'AIAAANAAAAAAIAAA',
  'AAAAAAAAOAAAAAAA',
  'AAANAAAAAAIAAANA',
])

// =====================
// Variant lookup tables
// =====================

const grassVariants: readonly SpriteData[] = [grass1, grass2, grass3]
const pathVariants: readonly SpriteData[] = [path1]
const bambooVariants: readonly SpriteData[] = [bamboo1, bamboo2, bamboo3]
const cookLandmarks: readonly SpriteData[] = [cook2, cook3, cook4]

/** Deterministic variant index from grid position. */
function variantIndex(col: number, row: number): number {
  return ((col * 7 + row * 13) % 3 + 3) % 3
}

/**
 * Returns true if any 4-connected neighbor differs from `type`.
 * Out-of-bounds neighbors are treated as "different" (i.e. edges of the map
 * count as zone boundaries).
 */
function isZoneEdge(type: TileType, col: number, row: number): boolean {
  for (const [dc, dr] of [[0, -1], [0, 1], [-1, 0], [1, 0]] as const) {
    const nc = col + dc
    const nr = row + dr
    if (nc < 0 || nc >= VILLAGE_COLS || nr < 0 || nr >= VILLAGE_ROWS) return true
    if (tileMap[nr][nc] !== type) return true
  }
  return false
}

/**
 * Deterministic boolean for landmark placement within a zone.
 * Returns true for ~1 in 7 interior tiles, spread via coprime hash.
 */
function isLandmarkSpot(col: number, row: number): boolean {
  return ((col * 11 + row * 17) % 4) === 0
}

// =====================
// Edge compositing infrastructure
// =====================

const EDGE_N = 1
const EDGE_S = 2
const EDGE_E = 4
const EDGE_W = 8

/** Returns NSEW bitmask of edges where neighbors differ from `type`. */
function getEdgeFlags(type: TileType, col: number, row: number): number {
  let flags = 0
  if (row <= 0 || tileMap[row - 1][col] !== type) flags |= EDGE_N
  if (row >= VILLAGE_ROWS - 1 || tileMap[row + 1][col] !== type) flags |= EDGE_S
  if (col >= VILLAGE_COLS - 1 || tileMap[row][col + 1] !== type) flags |= EDGE_E
  if (col <= 0 || tileMap[row][col - 1] !== type) flags |= EDGE_W
  return flags
}

/** Look up the tile type of a neighbor at offset (dc, dr). Out-of-bounds → VOID. */
function getNeighborType(col: number, row: number, dc: number, dr: number): TileType {
  const nc = col + dc
  const nr = row + dr
  if (nc < 0 || nc >= VILLAGE_COLS || nr < 0 || nr >= VILLAGE_ROWS) return TileType.VOID
  return tileMap[nr][nc]
}

/** Representative palette colors per tile type for edge dithering. */
const BLEND_PALETTE: Record<number, readonly string[]> = {
  [TileType.GRASS]: ['#64913E', '#487330', '#82A555', '#558234'],
  [TileType.PATH]: ['#C3AF8C', '#AA9678', '#D7C3A5'],
  [TileType.BAMBOO]: ['#6E8255', '#96AC80', '#415037'],
  [TileType.GATHERING]: ['#A57844', '#87663A', '#B4915F'],
  [TileType.WATER]: ['#4678AA', '#5A91C3', '#325F8C'],
  [TileType.GARDEN]: ['#8C6941', '#735532', '#A58255'],
  [TileType.WOODCUTTING]: ['#786946', '#B49B6E', '#645032'],
  [TileType.COOKING]: ['#7D766C', '#645C52', '#9B968C'],
  [TileType.GROUNDSKEEPING]: ['#64913E', '#487330', '#82A555'],
}

/** Override palettes for specific zone→neighbor transitions. */
const SPECIAL_PALETTE: Record<string, readonly string[]> = {
  [`${TileType.GARDEN}-${TileType.WATER}`]: ['#4A3A24', '#3D3020', '#5C4A32', '#4A3D28'],
}

/** Density multiplier for edge blending (default 1.0). <1 = subtler, >1 = denser. */
const BLEND_DENSITY: Record<string, number> = {
  [`${TileType.COOKING}-${TileType.GATHERING}`]: 0.55,
  [`${TileType.GATHERING}-${TileType.COOKING}`]: 0.55,
  [`${TileType.GARDEN}-${TileType.WATER}`]: 2.0,
}

/**
 * Clone a base sprite and dither neighbor-colored pixels into its edges.
 * 3-pixel graduated transition: depth 0 = 75%, depth 1 = 50%, depth 2 = 25%.
 */
function blendEdges(
  base: SpriteData,
  edges: number,
  col: number,
  row: number,
  tileType: TileType,
): SpriteData {
  const result = base.map((r) => [...r])

  // Each entry: [edgeFlag, dc, dr, axis]
  //   axis 0 = horizontal edge (N/S) → modifies rows
  //   axis 1 = vertical edge (E/W) → modifies cols
  const dirs: Array<[number, number, number, number]> = []
  if (edges & EDGE_N) dirs.push([EDGE_N, 0, -1, 0])
  if (edges & EDGE_S) dirs.push([EDGE_S, 0, 1, 0])
  if (edges & EDGE_E) dirs.push([EDGE_E, 1, 0, 1])
  if (edges & EDGE_W) dirs.push([EDGE_W, -1, 0, 1])

  for (const [_flag, dc, dr, axis] of dirs) {
    const neighborType = getNeighborType(col, row, dc, dr)
    const pairKey = `${tileType}-${neighborType}`
    const palette = SPECIAL_PALETTE[pairKey] ?? BLEND_PALETTE[neighborType]
    if (!palette) continue

    // Coarse clumping: divide edge into ~4px chunks, only blend in active chunks
    const hasSpecialPalette = pairKey in SPECIAL_PALETTE
    for (let chunk = 0; chunk < 4; chunk++) {
      let chunkHash = (col * 173 + row * 349 + chunk * 571 + dr * 37 + dc * 59) | 0
      chunkHash = Math.imul((chunkHash >> 16) ^ chunkHash, 0x2c1b3c6d)
      const skipChance = hasSpecialPalette ? 1 : 2 // ~20% vs ~40% of chunks stay clear
      if ((chunkHash & 0x7FFFFFFF) % 5 < skipChance) continue

      for (let depth = 0; depth < 3; depth++) {
        for (let i = chunk * 4; i < chunk * 4 + 4; i++) {
          let pixelRow: number
          let pixelCol: number
          if (axis === 0) {
            pixelCol = i
            if (dr === -1) pixelRow = depth          // N: rows 0,1,2
            else pixelRow = 15 - depth                // S: rows 15,14,13
          } else {
            pixelRow = i
            if (dc === 1) pixelCol = 15 - depth       // E: cols 15,14,13
            else pixelCol = depth                      // W: cols 0,1,2
          }

          if (!result[pixelRow][pixelCol]) continue

          let hash = (col * 374761393 + row * 668265263 + pixelRow * 2654435761 + pixelCol * 1103515245) | 0
          hash = Math.imul((hash >> 16) ^ hash, 0x45d9f3b)
          hash = ((hash >> 16) ^ hash) & 0x7FFFFFFF
          // Depth 0: ~38%, Depth 1: ~19%, Depth 2: ~6% (at default density)
          const density = BLEND_DENSITY[pairKey] ?? 1.0
          let replace = false
          if (depth === 0) replace = hash % 8 < Math.max(1, Math.round(3 * density))
          else if (depth === 1) replace = hash % 16 < Math.max(1, Math.round(3 * density))
          else replace = hash % 16 < Math.round(1 * density)

          if (replace) {
            result[pixelRow][pixelCol] = palette[hash % palette.length]
          }
        }
      }
    }
  }
  return result
}

/**
 * Select the base (unblended) sprite for a tile.
 * Extracted from the original getGroundSprite logic.
 */
function selectBaseSprite(tileType: TileType, col: number, row: number): SpriteData {
  const idx = variantIndex(col, row)

  if (tileType === TileType.GRASS) return grassVariants[idx]
  if (tileType === TileType.PATH) {
    const pathColors = [P.s, P.k, P.w, P.p]
    const base = path1.map((r) => [...r])
    // Per-tile pixel swaps to break tiling repetition
    let h = (col * 374761393 + row * 668265263) | 0
    for (let pr = 0; pr < 16; pr++) {
      for (let pc = 0; pc < 16; pc++) {
        if (!base[pr][pc]) continue
        h = Math.imul((h >> 16) ^ h, 0x45d9f3b)
        h = (h >> 16) ^ h
        // ~25% of pixels get a color swap
        if ((h & 0x7FFFFFFF) % 4 === 0) {
          base[pr][pc] = pathColors[(h >>> 2) & 3]
        }
      }
    }
    return base
  }
  if (tileType === TileType.BAMBOO) return bambooVariants[idx]

  // Zone fill tiles — solid interior
  if (tileType === TileType.GATHERING) return gather1
  if (tileType === TileType.WATER) return water1
  if (tileType === TileType.GARDEN) return garden1

  // Landmark tiles: *2 at deterministic interior spots, *1 elsewhere
  if (tileType === TileType.WOODCUTTING) return !isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row) ? wood2 : wood1
  if (tileType === TileType.COOKING) return !isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row) ? cookLandmarks[idx] : cook1

  // Fallback: GROUNDSKEEPING, void, or unknown
  return grass1
}

// =====================
// Sprite cache — pre-computed at module load
// =====================

const spriteCache: SpriteData[][] = []
for (let row = 0; row < VILLAGE_ROWS; row++) {
  spriteCache[row] = []
  for (let col = 0; col < VILLAGE_COLS; col++) {
    const tileType = tileMap[row][col]
    const base = selectBaseSprite(tileType, col, row)
    const edges = getEdgeFlags(tileType, col, row)
    spriteCache[row][col] = edges !== 0
      ? blendEdges(base, edges, col, row, tileType)
      : base
  }
}

/**
 * Return the ground SpriteData for a tile at the given grid position.
 * Cache lookup — sprites are pre-computed with edge blending at module load.
 */
export function getGroundSprite(
  _tileType: TileType,
  col: number,
  row: number,
): SpriteData {
  return spriteCache[row][col]
}
