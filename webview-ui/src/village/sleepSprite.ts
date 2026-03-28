import type { SpriteData } from './types.js'

// --- Palette (hex) ---
const K = '#1e1e1e' // black fur
const W = '#f5f5f5' // white fur
const G = '#d7d7d7' // gray shadow
const Z = '#ffffff' // Zzz white (high contrast against green ground)
const _ = ''        // transparent

const PALETTE: Record<string, string> = { K, W, G, Z, '.': _ }

const FRAME_W = 16
const FRAME_H = 32

/**
 * Normalize a character grid: pad to FRAME_H rows, each row exactly FRAME_W chars.
 * Mirrors the n() helper in generate-sleep-preview.mjs.
 */
function normalize(rows: string[]): string[] {
  // Pad columns to FRAME_W
  const out = rows.map(r => {
    if (r.length < FRAME_W) return r + '.'.repeat(FRAME_W - r.length)
    if (r.length > FRAME_W) return r.slice(0, FRAME_W)
    return r
  })
  // Pad at TOP so feet stay grounded (bottom-aligned)
  while (out.length < FRAME_H) out.unshift('.'.repeat(FRAME_W))
  return out
}

/** Convert a normalized character grid to SpriteData (rows × cols of hex strings). */
function toSprite(rows: string[]): SpriteData {
  return normalize(rows).map(row =>
    Array.from(row).map(ch => PALETTE[ch] ?? _),
  )
}

// ============================================================
// Sleeping panda body — single static frame, no body movement.
// Zzz are rendered separately above the hut roof.
// ============================================================
const SLEEP_BODY: string[] = [
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

export const SLEEP_SPRITE: SpriteData = toSprite(SLEEP_BODY)

// ============================================================
// Zzz overlay — two frames, rendered above the hut roof
// ============================================================
const ZZZ_1: string[] = [
  'ZZZ',
  '..Z',
  '.Z.',
  'ZZZ',
]

const ZZZ_2: string[] = [
  '...',
  'ZZZ',
  '..Z',
  '.Z.',
  'ZZZ',
]

function toSmallSprite(rows: string[]): SpriteData {
  return rows.map(row =>
    Array.from(row).map(ch => PALETTE[ch] ?? _),
  )
}

export const ZZZ_FRAMES: SpriteData[] = [
  toSmallSprite(ZZZ_1),
  toSmallSprite(ZZZ_2),
]

/** Seconds between Zzz frame switches. */
export const SLEEP_FRAME_DURATION_SEC: number = 2.5
