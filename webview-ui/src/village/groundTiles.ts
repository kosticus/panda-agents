/**
 * Village ground tile pixel data.
 *
 * 9 tile patterns (3 grass, 3 path, 3 bamboo) converted from
 * scripts/generate-ground-preview.mjs character grids.
 * Pre-colored hex values — no runtime colorization needed.
 */

import type { SpriteData } from './types.js'
import { TileType } from './types.js'

// --- Palette: character → CSS hex color (from generate-ground-preview.mjs) ---
const P: Record<string, string> = {
  // Bamboo (desaturated gray-green)
  b: '#788a69', h: '#9bac8c', j: '#5a694e',
  l: '#648c55', f: '#94a28a', e: '#a5b29b',
  // Grass (warm yellow-green)
  g: '#6e9b46', d: '#507d37', t: '#8caf5f', m: '#5f8c3c',
  // Path (warm sandy)
  s: '#c3af8c', k: '#aa9678', w: '#d7c3a5', p: '#9b8c78',
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

const bamboo1 = toSprite([
  'ggggggbhhbgggggg',
  'ggtgggbhhbggggdg',
  'ggggggbhhbgggggg',
  'ggggggjhhjgggggg',
  'gdgggjbhhbjggggg',
  'ggggggbhhbgggtgg',
  'ggggggbhhbgggggg',
  'ggtgggbhhbggdggg',
  'ggggggbhhbgggggg',
  'ggggggbhhbgggggg',
  'ggdgggbhhbgggggg',
  'ggggggjhhjgggggg',
  'gggggjbhhbjggtgg',
  'ggggggbhhbgggggg',
  'ggtgggbhhbggdggg',
  'ggggggbhhbgggggg',
])

const bamboo2 = toSprite([
  'gfeegggggbhhbggg',
  'gfeeggtggbhhbgdg',
  'gfeegggggjhhjggg',
  'gfeeggjbhhbjgggg',
  'gfeegdggbhhbgggg',
  'gfeeggggbhhbgggg',
  'gfeeggggbhhbgggg',
  'gfeegtggbhhbgdgg',
  'gfeeggggjhhjgggg',
  'gfeegjbhhbjggggg',
  'gfeegdggbhhbgggg',
  'gfeeggggbhhbgggg',
  'gfeeggggbhhbggtg',
  'gfeeggggjhhjgggg',
  'gfeegjbhhbjggggg',
  'gfeegdggbhhbgggg',
])

const bamboo3 = toSprite([
  'ggggggbhhbgggggg',
  'ggggggbhhbllggdg',
  'gggtggbhhblllggg',
  'ggggggbhhbgggggg',
  'ggggggbhhbgggggg',
  'ggggggjhhjgggggg',
  'gdgggjbhhbjggggg',
  'ggggggbhhbgggggg',
  'ggllggbhhbggtggg',
  'glllggbhhbgggggg',
  'ggggggjhhjgggggg',
  'gggggjbhhbjggggg',
  'ggggggbhhbggggdg',
  'ggggggbhhbllgggg',
  'ggtgggbhhblllggg',
  'ggggggbhhbgggggg',
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
 * Return the ground SpriteData for a tile at the given grid position.
 *
 * GRASS / PATH / BAMBOO pick a deterministic variant based on (col, row).
 * Other tile types (WATER, COOKING, etc.) fall back to grass1 for the POC.
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

  // Fallback for POC: water, cooking, woodcutting, garden, gathering, void
  return grass1
}
