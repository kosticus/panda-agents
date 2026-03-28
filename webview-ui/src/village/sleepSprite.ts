import type { SpriteData } from './types.js'

// --- Palette (hex) ---
const K = '#1e1e1e' // black fur
const W = '#f5f5f5' // white fur
const G = '#d7d7d7' // gray shadow
const Z = '#82b4f0' // Zzz blue
const _ = ''        // transparent

const PALETTE: Record<string, string> = { K, W, G, Z, '.': _ }

const FRAME_W = 16
const FRAME_H = 32

/**
 * Normalize a character grid: pad to FRAME_H rows, each row exactly FRAME_W chars.
 * Mirrors the n() helper in generate-sleep-preview.mjs.
 */
function normalize(rows: string[]): string[] {
  const out = [...rows]
  while (out.length < FRAME_H) out.push('.'.repeat(FRAME_W))
  return out.map(r => {
    if (r.length < FRAME_W) return r + '.'.repeat(FRAME_W - r.length)
    if (r.length > FRAME_W) return r.slice(0, FRAME_W)
    return r
  })
}

/** Convert a normalized character grid to SpriteData (rows × cols of hex strings). */
function toSprite(rows: string[]): SpriteData {
  return normalize(rows).map(row =>
    Array.from(row).map(ch => PALETTE[ch] ?? _),
  )
}

// ============================================================
// Frame 1: Sitting slump, head up, eyes closed, Zzz top-right
// Source: generate-sleep-preview.mjs lines 43–77
// ============================================================
const SLEEP_GRID_1: string[] = [
  '............ZZZ.',
  '..............Z.',
  '.............Z..',
  '............ZZZ.',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW..',
  '.WWWKKKWWKKKWWW.',
  '.WWKKKKKWKKKKWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKWWWGGWWWKKKK',
  'KKKKWWGGGGWWKKKK',
  'KKKKWWGGGGWWKKKK',
  '.KKKWWWGGWWWKKK.',
  '..KKWWWWWWWWKK..',
  '..WWWWWWWWWWWW..',
  '...KKKK..KKKK...',
  '...KKKK..KKKK...',
  '..KKKKK..KKKKK..',
]

// ============================================================
// Frame 2: Deep nod, ears flatten, head drops 2 rows, Zzz shifted
// Source: generate-sleep-preview.mjs lines 81–111
// ============================================================
const SLEEP_GRID_2: string[] = [
  '...........ZZZ..',
  '.............Z..',
  '............Z...',
  '...........ZZZ..',
  '..KKKK..KKKK....',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW..',
  '.WWWKKKWWKKKWWW.',
  '.WWKKKKKWKKKKWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKWWWGGWWWKKKK',
  'KKKWWWGGGGWWWKKK',
  'KKKWWWGGGGWWWKKK',
  '.KKWWWWGGWWWWKK.',
  '..KWWWWWWWWWWK..',
  '..WWWWWWWWWWWW..',
  '...KKKK..KKKK...',
  '...KKKK..KKKK...',
  '..KKKKK..KKKKK..',
]

export const SLEEP_FRAMES: SpriteData[] = [
  toSprite(SLEEP_GRID_1),
  toSprite(SLEEP_GRID_2),
]

/** Seconds between frame switches for the sleeping animation. */
export const SLEEP_FRAME_DURATION_SEC: number = 1.0
