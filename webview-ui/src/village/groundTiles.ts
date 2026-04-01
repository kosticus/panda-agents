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
  'sswwwwwssswwwwss',
  'wwwwwswwwwwswwww',
  'wwwswwwwwwwwwwsw',
  'swwwwwwswwwwwwww',
  'wwwwwwwwwwswwwww',
  'wwswwwwwwwwwwsww',
  'swwwwswwwwwwwwww',
  'wwwwwwwwswwwwwww',
  'wwwwwwwwwwwwswww',
  'swwwswwwwwwwwwww',
  'wwwwwwwwswwwswww',
  'wwswwwwwwwwwwwsw',
  'wwwwwwswwwwwwwww',
  'swwwwwwwwwswwwww',
  'wwwwswwwwwwwwsww',
  'wwwwwwwwswwwwwww',
])

const path2 = toSprite([
  'sssswsssssswssss',
  'sssssssspssssssw',
  'sspsssssssssspss',
  'sssssswssssssssw',
  'sssssssssspssssw',
  'swsspssssssssssw',
  'ssssssssssspssss',
  'sspsssswssssssps',
  'sssssssssssswsss',
  'sssssspssssssssw',
  'spsssssssspssssw',
  'sssswssssssssssw',
  'sssssssspssssssw',
  'sspsssssssswspss',
  'sssssswsssssssss',
  'swsssssssspssssw',
])

const path3 = toSprite([
  'gggggdgksswwwwss',
  'ggtggggksswwswww',
  'ggggggdgsswwwwww',
  'gdgggggkswwwwsww',
  'gggggdggsswwwwww',
  'ggtgggggksswwwww',
  'gggggdgggsswwsww',
  'ggdggggkswwwwwww',
  'gggggggksswwwwww',
  'gtggggdgsswwswww',
  'ggggggggksswwwww',
  'ggdgggdggsswwwww',
  'ggggggggkswwswww',
  'gdggggdgsswwwwww',
  'gggggggkswwwwsww',
  'ggtgggggsswwwwww',
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

// Edge — grass border transitioning to packed earth center
const gather2 = toSprite([
  'gggtggdggggtgggg',
  'gdggggggdgggggdg',
  'ggggdgggggdggggg',
  'ggdggcccccccggdg',
  'ggggcccxcccccggg',
  'gdgccxcccvccccgg',
  'gggccccvcccxccgg',
  'ggccvccccxccccgg',
  'ggcccxcccccvccgd',
  'ggccccccxcccccgg',
  'gdgcccvcccxcccgg',
  'ggggccccccccgggg',
  'gggdgccccccdgggg',
  'ggggggdggggggtgg',
  'gdggtggggdgggggg',
  'ggggggggtgggggdg',
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

// Edge — grass border transitioning to pond center
const water2 = toSprite([
  'ggggddgtggdggggg',
  'gdggggddgggggtgg',
  'gggdgDDDDDDggggg',
  'ggggDDWWWWDDdggg',
  'gdgDWWWWWWWDgggg',
  'gggDWWLWWWWDgtgg',
  'gggDWWWWLWWDgggg',
  'ggDWWWWWWWLDgggg',
  'ggDWWSWWWWWDggdg',
  'ggDWWWWWLWWDgggg',
  'gggDWWWWWWDdgggg',
  'gggDDWWWWDDggggg',
  'gdgggDDDDDgggtgg',
  'gggtggggggdggggg',
  'gggggdggggggggdg',
  'ggdgggggtggggggg',
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

// Edge — grass border transitioning to tilled soil
const garden2 = toSprite([
  'gggtggggdggtgggg',
  'gdggggtggggggdgg',
  'gggggdggggggtggg',
  'gdgggggKBBKgggdg',
  'gggggKBBHBBKgggg',
  'ggdgKBHBBHBBKggg',
  'ggggKBPQBBPQKggg',
  'gggKBBHBBHBBKggg',
  'gggKBPQBBPQBKgdg',
  'ggdKBBHBBHBBKggg',
  'gggKBPQBBPQBKggg',
  'ggggKBBBBBBKgggg',
  'gdgggKKKKKKggdgg',
  'ggggtgggggggtggg',
  'ggdgggggdgggggdg',
  'gggggtgggggtgggg',
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

// With stump landmark
const wood2 = toSprite([
  'EEgEEFEEgEEEJEgE',
  'EgEEEEJEEEFEEEEE',
  'EEEFEEEEEJEEEgEE',
  'gEEEEEEFEEEEEEJE',
  'EEJEEgJJJJFEEEEE',
  'EEEEFJFFFFJEgEEE',
  'EgEEEJFJJFJEEFEE',
  'EEEEJJFFFJJEEEgE',
  'EFEEEJJJJJEFEgEE',
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

// With fire pit landmark
const cook2 = toSprite([
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
])

// =====================
// Variant lookup tables
// =====================

const grassVariants: readonly SpriteData[] = [grass1, grass2, grass3]
const pathVariants: readonly SpriteData[] = [path1, path2, path3]
const bambooVariants: readonly SpriteData[] = [bamboo1, bamboo2, bamboo3]

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
  return ((col * 11 + row * 17) % 7) === 0
}

/**
 * Return the ground SpriteData for a tile at the given grid position.
 *
 * GRASS / PATH / BAMBOO pick a deterministic variant based on (col, row).
 * GATHERING / WATER / GARDEN use edge-aware selection: *2 variant at zone
 * boundaries, *1 (solid interior) elsewhere.
 * WOODCUTTING / COOKING use landmark hashing to place wood2/cook2 at
 * deterministic interior positions; edges get the base variant.
 * GROUNDSKEEPING falls through to grass1.
 */
export function getGroundSprite(
  tileType: TileType,
  col: number,
  row: number,
): SpriteData {
  const idx = variantIndex(col, row)

  if (tileType === TileType.GRASS) return grassVariants[idx]
  if (tileType === TileType.PATH) return pathVariants[idx]
  if (tileType === TileType.BAMBOO) return bambooVariants[idx]

  // Edge-aware zone tiles: *2 at boundaries, *1 in interior
  if (tileType === TileType.GATHERING) return isZoneEdge(tileType, col, row) ? gather2 : gather1
  if (tileType === TileType.WATER) return isZoneEdge(tileType, col, row) ? water2 : water1
  if (tileType === TileType.GARDEN) return isZoneEdge(tileType, col, row) ? garden2 : garden1

  // Landmark tiles: *2 at deterministic interior spots, *1 elsewhere
  if (tileType === TileType.WOODCUTTING) return !isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row) ? wood2 : wood1
  if (tileType === TileType.COOKING) return !isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row) ? cook2 : cook1

  // Fallback: GROUNDSKEEPING, void, or unknown
  return grass1
}
