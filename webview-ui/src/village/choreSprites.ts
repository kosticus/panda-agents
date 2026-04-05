import type { SpriteData } from './types.js'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FRAME_W = 16
const FRAME_H = 32

/** Seconds between chore animation frame switches. */
export const CHORE_FRAME_DURATION_SEC: number = 1.0

// ---------------------------------------------------------------------------
// Helpers (mirror sleepSprite.ts normalize / toSprite)
// ---------------------------------------------------------------------------

/**
 * Normalize a character grid: pad each row to FRAME_W, pad top to FRAME_H
 * (bottom-aligned so feet stay grounded).
 */
function normalize(rows: string[]): string[] {
  const out = rows.map(r => {
    if (r.length < FRAME_W) return r + '.'.repeat(FRAME_W - r.length)
    if (r.length > FRAME_W) return r.slice(0, FRAME_W)
    return r
  })
  while (out.length < FRAME_H) out.unshift('.'.repeat(FRAME_W))
  return out
}

/** Convert a normalized character grid through a palette to SpriteData. */
function toSprite(rows: string[], palette: Record<string, string>): SpriteData {
  return normalize(rows).map(row =>
    Array.from(row).map(ch => palette[ch] ?? ''),
  )
}

// ---------------------------------------------------------------------------
// Helpers for 32×64 frames
// ---------------------------------------------------------------------------

const BIG_FRAME_W = 32
const BIG_FRAME_H = 64

function normalizeBig(rows: string[]): string[] {
  const out = rows.map(r => {
    if (r.length < BIG_FRAME_W) return r + '.'.repeat(BIG_FRAME_W - r.length)
    if (r.length > BIG_FRAME_W) return r.slice(0, BIG_FRAME_W)
    return r
  })
  while (out.length < BIG_FRAME_H) out.unshift('.'.repeat(BIG_FRAME_W))
  return out
}

function toSpriteBig(rows: string[], palette: Record<string, string>): SpriteData {
  return normalizeBig(rows).map(row =>
    Array.from(row).map(ch => palette[ch] ?? ''),
  )
}

// ============================================================
// COOK — cooking over fire pit
// ============================================================

const COOK_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  R: '#b43c28',  // pot / clay
  O: '#dc8c32',  // fire orange
  Y: '#f0c83c',  // fire yellow
  S: '#787878',  // stone ring
  P: '#aa8050',  // spoon handle (warm tan wood)
  V: '#508cff',  // steam
}

const COOK_1: string[] = [
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWWWWWKKKKK',
  'KKKKWWWGGWKKKKKK',
  'KKKKWWGGGGKPPKKK',
  'KKKKWWWGGWPPKKKK',
  'KKKKKWWWWPPKKKKK',
  '..KKKKWWPPKKKK..',
  '...KKKKPPKKKK...',
  '...KKKPP.KKKVV..',
  '..KKKPP..KKKVV..',
  '....PP..........',
  '................',
  '................',
  '................',
]

const COOK_2: string[] = [
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWWWWWKKKKK',
  'KKKKKKWGGWWWKKKK',
  'KKKPPKGGGGWWKKKK',
  'KKKKPPWGGWWWKKKK',
  'KKKKKPPWWWWKKKKK',
  '..KKKKPPWWKKKK..',
  '...KKKKPPKKKKVV.',
  '...KKKK.PPKKKVV.',
  '..KKKKK..PPKKK..',
  '..........PP....',
  '................',
  '................',
  '................',
]

// ============================================================
// CHOP — chopping wood at stump
// ============================================================

const CHOP_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  T: '#916e41',  // cut face rings
  D: '#5a4123',  // bark / dark grain
  R: '#aa8c5a',  // cut face light interior
  A: '#a0a0aa',  // axe head (steel)
  H: '#785032',  // axe handle
}

const CHOP_1: string[] = [
  '...AAAHHA.......',
  '....AAHHA.......',
  '......HH........',
  '......HH........',
  '..KKKKHHKKKK....',
  '.KKKKKHHKKKKK...',
  '.KKKKKHHKKKKK...',
  '..KKKKKKKKKK....',
  '..KKKKWWKKKKWW..',
  '.KKKKWWWWKKKKWW.',
  'KKKKKKKWWKKKKKW.',
  'KKKKKEKWWKEKKKW.',
  'KKKWKKKWWKKKKKK.',
  'KKKWWWWKKWWWWKKK',
  'KKKWWWWWWWWWWKKK',
  'KKKWWWWWWWWWWKKK',
  'KKKKKKKKKKKKKKKK',
  '.KKKKKKKKKKKKKKK',
  '..KKKKKKKKKKKK..',
  '...WWWWWWWWWW...',
  '...WWWWGGWWWW...',
  '...WWWGGGGWWW...',
  '...WWWWGGWWWW...',
  '...WWWWWWWWWW...',
  '....WWWWWWWW....',
  '...KKKK..KKKK...',
  '..KKKKK..KKKKK..',
  '................',
  '....DTTRRTTD....',
  '....DTTRRTTD....',
]

const CHOP_2: string[] = [
  '................',
  '................',
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWHHWWKKKKK',
  'KKKKWWWHHWWWKKKK',
  'KKKKWWGHHGWWKKKK',
  'KKKKWWWHHWWWKKKK',
  'KKKKKWWHHWWKKKKK',
  '..KKKKWHHWKKKK..',
  '...KKKKHHKKKK...',
  '...KKKKHHKKKK...',
  '..KKKKKHHKKKKK..',
  '...DAAAHHATD....',
  '....DTTRRTTD....',
]

// ============================================================
// FISH — fishing at shoreline
// ============================================================

const FISH_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  F: '#785032',  // fishing rod (wood brown)
  B: '#e6503c',  // bobber red
  D: '#A0D0F0',  // splash (light blue-white)
}

// Frame 1: canonical SWEEP_2 body (unshifted), rod at col 9, calm bobber
const FISH_1: string[] = [
  '.........F......',  // 0:  rod tip at col 9
  '.........F......',  // 1:  rod shaft
  '.........F......',  // 2:  rod shaft
  '...KKKK..FKKK...',  // 3:  ears — rod through right ear
  '..KKKKK..FKKKK..',  // 4:  ears widen
  '..KKKKK..FKKKK..',  // 5:  ears full
  '...KKWWWWFWKK...',  // 6:  ear-to-head
  '...WWWWWWFWWWWW.',  // 7:  head
  '..WWWWWWWFWWWWWW',  // 8:  head widest
  '..WWWKKKWFKKKWWW',  // 9:  eye patches
  '..WWKKEKWFKEKWWW',  // 10: eyes with glint
  '..WWWKKKWFKKKWWW',  // 11: eye patches lower
  '...WWWWWKFWWWWW.',  // 12: nose
  '...WWWWWWFWWWWW.',  // 13: lower face
  '....WWWWWFWWWW..',  // 14: chin
  '..KKKKKKWFWKKKKK',  // 15: band — W paws grip rod
  '.KKKKKKKWFWKKKKK',  // 16: band wide — W paws grip rod
  '.KKKKKWWWFWWKKKK',  // 17: body top
  '.KKKKWWWGFWWWKKK',  // 18: belly
  '.KKKKWWGGFGWWKKK',  // 19: belly wide
  '.KKKKWWGGFGWWKKK',  // 20: belly wide
  '.KKKKWWWGFWWWKKK',  // 21: belly narrowing
  '..KKKWWWWFWWKKK.',  // 22: body to legs
  '...KKKKWWFWKK...',  // 23: upper legs
  '..KKKK..KFKK....',  // 24: legs — rod through right leg
  '..KKKK..KFKK....',  // 25: legs
  '.KKKKK..KFKKK...',  // 26: feet
  '.........F......',  // 27: rod extends to water
  '.........BB.....',  // 28: bobber top (cols 9-10)
  '........BBB.....',  // 29: bobber body (cols 8-10)
]

// Frame 2: panda leans LEFT 3px, rod CURVES — tip col 3→4, ears col 5, body col 6, feet anchored col 9
const FISH_2: string[] = [
  '...F............',  // 0:  rod tip at col 3 (curved — most lean)
  '....F...........',  // 1:  rod shaft at col 4 (curved)
  '....F...........',  // 2:  rod shaft at col 4 (curved)
  'KKKK.F.KKK......',  // 3:  ears shifted — rod at col 5 (curved)
  'KKKK.F.KKKK.....',  // 4:  ears widen — rod at col 5 (curved)
  'KKKK.F.KKKK.....',  // 5:  ears full — rod at col 5 (curved)
  'KKWWWWFWKK......',  // 6:  ear-to-head shifted — rod at col 6
  'WWWWWWFWWWWW....',  // 7:  head shifted — rod at col 6
  'WWWWWWFWWWWWW...',  // 8:  head widest shifted — rod at col 6
  'WWKKKWFKKKWWW...',  // 9:  eye patches shifted — rod at col 6
  'WKKEKWFKEKWWW...',  // 10: eyes shifted — rod at col 6
  'WWKKKWFKKKWWW...',  // 11: eye patches lower — rod at col 6
  'WWWWWKFWWWWW....',  // 12: nose shifted — rod at col 6
  'WWWWWWFWWWWW....',  // 13: lower face shifted — rod at col 6
  '.WWWWWFWWWW.....',  // 14: chin shifted — rod at col 6
  'KKKKKWFWKKKKK...',  // 15: band shifted + grip — rod at col 6
  'KKKKKWFWKKKKK...',  // 16: band wide shifted + grip — rod at col 6
  'KKKWWWFWWKKKK...',  // 17: body top shifted — rod at col 6
  'KKWWWGFWWWKKK...',  // 18: belly shifted — rod at col 6
  'KKWWGGFGWWKKK...',  // 19: belly wide shifted — rod at col 6
  'KKWWGGFGWWKKK...',  // 20: belly wide shifted — rod at col 6
  'KKWWWGFWWWKKK...',  // 21: belly narrowing — rod at col 6
  'KKKWWWWFWWKKK...',  // 22: transition — rod at col 7
  '..KKKKWWFWKK....',  // 23: transition — rod at col 8
  '..KKKK..KFKK....',  // 24: legs anchored — rod at col 9
  '..KKKK..KFKK....',  // 25: legs anchored — rod at col 9
  '.KKKKK..KFKKK...',  // 26: feet anchored — rod at col 9
  '.........F......',  // 27: rod into water at col 9
  '.......DDDDD....',  // 28: splash wider (cols 7-11)
  '......DBBBBBD...',  // 29: bobber dipped in splash (cols 6-12)
]

// ============================================================
// WATER — watering crops
// CAUTION: frames array in source is [water2, water1] (reversed)
// ============================================================

const WATER_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  N: '#64a050',  // plant green (darker)
  L: '#8cbe64',  // plant green (lighter / sprout)
  B: '#a07846',  // soil/dirt brown
  Q: '#5082b4',  // watering can (blue-gray)
  D: '#64aadc',  // water drops
}

// water2 in script = standing upright (frame 1 in animation per frames array order)
const WATER_1: string[] = [
  '................',
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWWWWWKKKKK',
  'KKKKWWWGGWWWKKKK',
  'KKKKWWGGGGWWKKKK',
  'KKKKWWGGGGWWKKKQ',
  '.KKKWWWGGWWWKQQQ',
  '..KKWWWWWWWKQQQQ',
  '...KKKK..KKKKQQQ',
  '...KKKK..KKKK...',
  '..KKKKK..KKKKK..',
  '..L.NL..L...N.L.',
  '..L.NL..L..N..L.',
  '..BBBBBBBBBBBBBB',
]

// water1 in script = bent forward (frame 2 in animation per frames array order)
const WATER_2: string[] = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWWWWWKKKKK',
  'KKKKWWWGGWWWKKKK',
  'KKKKWWGGGGWK.QQQ',
  '.KKKWWWGGWWKQQQQ',
  '..KKWWWWWWKK.QQD',
  '...KKWWWWKKK..DD',
  '...KKKK..KKKK.D.',
  '...KKKK..KKKK.D.',
  '..KKKKK..KKKKKD.',
  '..LDNL.DL..DDDDD',
  '..LDNL.DL..DD.L.',
  '..BBBBBBBBBBBBBB',
]

// ============================================================
// WATER (32×64) — scaled water/crop animation
// ============================================================

const WATER_BIG_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  N: '#64a050',  // plant green (darker)
  L: '#8cbe64',  // sprout green (lighter)
  B: '#a07846',  // soil brown
  Q: '#5082b4',  // watering can (blue-gray)
  D: '#64aadc',  // water drops
}

// Frame 1: standing upright, watering can at right hip (not pouring)
// Body anatomy matches canonical BASE_32 template.
// Watering can (Q) on RIGHT side at hip level, tapered shape.
// Bottom 6 rows: dry crops (N/L) over soil (B).
const WATER_BIG_1: string[] = [
  // --- Padding (6 rows) ---
  '................................',  //  1
  '................................',  //  2
  '................................',  //  3
  '................................',  //  4
  '................................',  //  5
  '................................',  //  6
  // --- Ears (5 rows — round dome) ---
  '......KKKK............KKKK......',  //  7  4px dome tip
  '.....KKKKKK..........KKKKKK.....',  //  8  6px
  '....KKKKKKKK........KKKKKKKK....',  //  9  8px
  '...KKKKKKKKKK......KKKKKKKKKK...',  // 10  10px (max)
  '...KKKKKKKKKK......KKKKKKKKKK...',  // 11  10px
  // --- Forehead (3 rows) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',  // 12  ear-head bridge
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',  // 13  20px
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',  // 14  22px
  // --- Head (4 rows) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 15  24px
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',  // 16  26px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 17  28px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 18  28px
  // --- Face: eye patches (6 rows) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 19  rounded top (5K)
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 20  full patch (6K)
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 21  eyes + glint
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 22  eyes + glint
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 23  full patch (6K)
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 24  rounded bottom (5K)
  // --- Muzzle / Jaw (6 rows) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',  // 25  26px
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',  // 26  24px
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 27  24px
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',  // 28  22px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 29  20px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 30  20px
  // --- Band (6 rows) ---
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',  // 31  24K
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',  // 32  26K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',  // 33  28K
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',  // 34  30K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 35  32K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 36  32K
  // --- Body (12 rows — can at right hip) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',  // 37  shoulder (9K+14W+9K)
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',  // 38  shoulder (8K+16W+8K)
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',  // 39  chest
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',  // 40  gradient
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKK.QQ',  // 41  belly + spout tip
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKK.QQ.',  // 42  spout shaft
  'KKKKKKKWWWWWWWGGGGWWWWWWKKK.QQQQ',  // 43  spout widens to can top
  'KKKKKKWWWWWWWWWWWWWWWWWKK.QQQQQQ',  // 44  wrist, can body (6Q)
  '..KKKKKKKKKKWWWWWWWWKKKK.QQQQQQ.',  // 45  hips, can body (6Q)
  '...KKKKKKKKKWWWWWWWWKKKK.QQQQQQ.',  // 46  taper, can body (6Q)
  '....KKKKKKKKWWWWWWWWKKKKK.QQQQ..',  // 47  taper, can base (4Q)
  '.....KKKKKKKWWWWWWWWKKKKK..QQ...',  // 48  can bottom (2Q)
  // --- Legs (6 rows) ---
  '......KKKKKKKK....KKKKKKKK......',  // 49
  '......KKKKKKKK....KKKKKKKK......',  // 50
  '......KKKKKKKK....KKKKKKKK......',  // 51
  '.....KKKKKKKKK....KKKKKKKKK.....',  // 52
  '....KKKKKKKKKK....KKKKKKKKKK....',  // 53
  '....KKKKKKKKKK....KKKKKKKKKK....',  // 54
  // --- Crops: dry (4 rows of plants + 2 soil) ---
  '...LL....NN....LL....NN....LL...',  // 55  leaf tips
  '..NLLN..LNNL..NLLN..LNNL..NLLN..',  // 56  leaf canopy
  '...NL....LN....NL....LN....NL...',  // 57  lower leaves
  '....N.....L.....N.....L.....N...',  // 58  stems
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',  // 59  soil
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',  // 60  soil
  // --- Padding (4 rows) ---
  '................................',  // 61
  '................................',  // 62
  '................................',  // 63
  '................................',  // 64
]

// Frame 2: bent forward (~4 rows drop), can tilted, water pouring onto crops
// Body drops 4 rows from frame 1. Ears compress, band compresses slightly.
// Arm extends right with tilted can. Water (D) cascades from spout through
// leg area into crop splash. Stream shows drips leaving spout, falling, splash.
const WATER_BIG_2: string[] = [
  // --- Padding (10 rows — body drops 4 from frame 1) ---
  '................................',  //  1
  '................................',  //  2
  '................................',  //  3
  '................................',  //  4
  '................................',  //  5
  '................................',  //  6
  '................................',  //  7
  '................................',  //  8
  '................................',  //  9
  '................................',  // 10
  // --- Ears (4 rows — compressed, drop 1 hold row) ---
  '......KKKK............KKKK......',  // 11  4px dome tip
  '.....KKKKKK..........KKKKKK.....',  // 12  6px
  '....KKKKKKKK........KKKKKKKK....',  // 13  8px
  '...KKKKKKKKKK......KKKKKKKKKK...',  // 14  10px (max)
  // --- Forehead (3 rows) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',  // 15  ear-head bridge
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',  // 16  20px
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',  // 17  22px
  // --- Head (4 rows) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 18  24px
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',  // 19  26px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 20  28px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 21  28px
  // --- Face: eye patches (6 rows) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 22  rounded top (5K)
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 23  full patch (6K)
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 24  eyes + glint
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 25  eyes + glint
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 26  full patch (6K)
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 27  rounded bottom (5K)
  // --- Muzzle / Jaw (6 rows) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',  // 28  26px
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',  // 29  24px
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 30  24px
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',  // 31  22px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 32  20px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 33  20px
  // --- Band (5 rows — compressed: drop top row) ---
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',  // 34  26K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',  // 35  28K
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',  // 36  30K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 37  32K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 38  32K
  // --- Body (10 rows — arm extends right with tilted can, water pours) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',  // 39  shoulder (9K+14W+9K)
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',  // 40  shoulder (8K+16W+8K)
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',  // 41  chest
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',  // 42  belly
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',  // 43  belly taper
  'KKKKKKKWWWWWWGGGGWWWWWKK.QQQQQD.',  // 44  can tilted (5Q), drip start
  'KKKKKKWWWWWWWWWWWWWWWWK..QQQQDD.',  // 45  can body (4Q), water falls
  '..KKKKKKKKKWWWWWWWWKKKKK..QQ.DDD',  // 46  can spout down (2Q), water
  '...KKKKKKKKWWWWWWWWKKKK.....DDD.',  // 47  taper, water stream
  '....KKKKKKKWWWWWWWWKKKKK....DD..',  // 48  taper, water falling
  // --- Legs (4 rows — slightly compressed from 6) ---
  '.....KKKKKKKK....KKKKKKKK.D.D...',  // 49  water drops through leg area
  '.....KKKKKKKK....KKKKKKKKD..D...',  // 50  water drops
  '....KKKKKKKKK....KKKKKKKKK.DD...',  // 51  water gathering
  '....KKKKKKKKKK..KKKKKKKKKK.D....',  // 52  feet, water
  // --- Water stream falling (2 rows — keeps ground fixed at same rows as frame 1) ---
  '........................DDDDD...',  // 53  wide stream falling
  '.........................DDDD...',  // 54  drips spreading
  // --- Crops with water splash (4 rows — ground at same position as frame 1) ---
  '...LLD...NN...DLL..D.NND.DDLLD..',  // 55  water on 3 right plants
  '..NLLN..LNNL.DNLLN.DLNDL.DNLLN..',  // 56  water spreading in canopy
  '...NL....LN..D.NL..D.DLN.DD.NL..',  // 57  drips widening on stems
  '....N.....L..D..N..D..DL.D...N..',  // 58  drips scattering
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',  // 59  soil (wet)
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..',  // 60  soil
  // --- Padding (4 rows) ---
  '................................',  // 61
  '................................',  // 62
  '................................',  // 63
  '................................',  // 64
]

// ============================================================
// BAMBOO — harvesting bamboo
// ============================================================

const BAMBOO_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  N: '#7CC820',  // bamboo green (bright lime)
  V: '#A0E040',  // bamboo green (bright yellow-green)
  J: '#5AA010',  // bamboo node (lime-dark)
  D: '#A05A30',  // dirt (warm red-brown)
}

const BAMBOO_1: string[] = [
  '................',
  '................',
  '................',
  '.KKKK..KKKK.....',
  'KKKKK..KKKKK....',
  'KKKKK..KKKKK....',
  '.KKWWWWWWKK.....',
  '.WWWWWWWWWWWW...',
  'WWWWWWWWWWWWWW..',
  'WWWKKKWWKKKWWW..',
  'WWKKEKWWKEKWWW..',
  'WWWKKKWWKKKWWW..',
  '.WWWWWKKWWWWW...',
  '.WWWWWWWWWWWW...',
  'KKKKKKKKKKKKKK..',
  'KKKKKKKKKKKKKKK.',
  'KKKKKWWWWWWKKKK.',
  'KKKKWWWGGWWWKKK.',
  'KKKKWWGGGGWWK.NV',
  '.KKKWWWGGWWWW.NV',
  '..KKWWWGGWWWW.NV',
  '...WWWWWWWWWW.NV',
  '...KKKK..KKKK.NV',
  '...KKKK..KKKK.JV',
  '..KKKKK..KKKKKNV',
  '..............NV',
  '.............DDD',
]

const BAMBOO_2: string[] = [
  '................',
  '................',
  '................',
  '...KKKK..KKKK...',
  '..KKKKK..KKKKK..',
  '..KKKKK..KKKKK..',
  '...KKWWWWWWKK...',
  '...WWWWWWWWWWWW.',
  '..WWWWWWWWWWWWWW',
  '..WWWKKKWWKKKWWW',
  '..WWKKEKWWKEKWWW',
  '..WWWKKKWWKKKWWW',
  '...WWWWWKKWWWWW.',
  '...WWWWWWWWWWWW.',
  '..KKKKKKKKKKKKNV',
  '.KKKKKKKKKKKKKNV',
  '..KKKKKWWWWWWWNV',
  '..KKKKWWWGGWWWJV',
  '..KKKKWWGGGGWWNV',
  '...KKKWWWGGWWWNV',
  '....KKWWWGGWWWNV',
  '...WWWWWWWWWW.NV',
  '...KKKK..KKKK...',
  '...KKKK..KKKK...',
  '..KKKKK..KKKKK..',
  '.............DDD',
]

// ============================================================
// SWEEP — sweeping with broom
// ============================================================

const SWEEP_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  H: '#963020',  // broom handle (reddish wood)
  R: '#f0d060',  // broom bristles (straw)
  S: '#dcbc48',  // broom bristle tips
  D: '#78643c',  // dirt/dust being swept
}

const SWEEP_1: string[] = [
  '................',
  '................',
  '................',
  '.KKKK..KKKK.....',
  'KKKKK..KKKKK....',
  'KKKKK..KKKKK....',
  '.KKWWWWWWKK.....',
  '.WWWWWWWWWWWWW..',
  'WWWWWWWWWWWWWW..',
  'WWWKKKWWKKKWWW..',
  'WWKKEKWWKEKWWW..',
  'WWWKKKWWKKKWWW..',
  '.WWWWWKKWWWWW...',
  '.WWWWWWWWWWWW...',
  '..WWWWWWWWWW....',
  'KKKKKKKKKKKKKK..',
  'KKKKKKKKKKKKKKK.',
  'KKKKKWWWWWWKKKK.',
  'KKKKWWWGGWWWKKK.',
  'KKKKWWGGGGWWKKK.',
  'KKKKWWGGGGWWKKK.',
  'KKKKWWWGGWWWKKK.',
  'HKKKWWWWWWWKKK..',
  'HH.KKWWWWKKKK..',
  'HH.KKKK..KKKK..',
  'RH.KKKK..KKKK..',
  'R.KKKKK..KKKKK..',
  'RRRR............',
  'SSSS............',
]

const SWEEP_2: string[] = [
  '................',
  '................',
  '................',
  '...KKKK..KKKK...',
  '..KKKKK..KKKKK..',
  '..KKKKK..KKKKK..',
  '...KKWWWWWWKK...',
  '...WWWWWWWWWWWW.',
  '..WWWWWWWWWWWWWW',
  '..WWWKKKWWKKKWWW',
  '..WWKKEKWWKEKWWW',
  '..WWWKKKWWKKKWWW',
  '...WWWWWKKWWWWW.',
  '...WWWWWWWWWWWW.',
  '....WWWWWWWWWW..',
  '..KKKKKKKKKKKKKK',
  '.KKKKKKKKKKKKKKK',
  '.KKKKKWWWWWWKKKK',
  '.KKKKWWWGGWWWKKK',
  '.KKKKWWGGGGWWKKK',
  '.KKKKWWGGGGWWKKK',
  '.KKKKWWWGGWWWKKK',
  '..KKKWWWWWWWKKKH',
  '...KKKKWWWWKK.HH',
  '..KKKK..KKKK..HH',
  '..KKKK..KKKK..HR',
  '.KKKKK..KKKKK.RR',
  '............RRRR',
  '............SSSS',
]

// ============================================================
// SWEEP (32×64) — scaled sweep animation
// ============================================================

const SWEEP_BIG_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  H: '#963020',  // broom handle (reddish wood)
  R: '#f0d060',  // broom bristles (straw)
  S: '#dcbc48',  // broom bristle tips
  D: '#78643c',  // dirt/dust being swept
}

// Frame 1: panda leans LEFT (~2px), broom sweeps left along ground
// Ears/head/face use BASE_32 anatomy shifted 2px left.
// Broom handle (HH) runs down left edge; bristles (RRRRRRRR) at bottom-left.
const SWEEP_BIG_1: string[] = [
  // --- Padding (6 rows) ---
  '................................',  //  1
  '................................',  //  2
  '................................',  //  3
  '................................',  //  4
  '................................',  //  5
  '................................',  //  6
  // --- Ears (5 rows — shifted 2px left) ---
  '....KKKK............KKKK........',  //  7  4px dome tip
  '...KKKKKK..........KKKKKK.......',  //  8  6px
  '..KKKKKKKK........KKKKKKKK......',  //  9  8px
  '.KKKKKKKKKK......KKKKKKKKKK.....',  // 10  10px (max)
  '.KKKKKKKKKK......KKKKKKKKKK.....',  // 11  10px
  // --- Forehead (3 rows — shifted 2px left) ---
  '..KKKKKKKKWWWWWWWWKKKKKKKK......',  // 12  ear-head bridge
  '..KKKKKKWWWWWWWWWWWWKKKKKK......',  // 13  20px
  '...KKWWWWWWWWWWWWWWWWWWKK.......',  // 14  22px
  // --- Head (4 rows — shifted 2px left) ---
  '..WWWWWWWWWWWWWWWWWWWWWWWW......',  // 15  24px
  '.WWWWWWWWWWWWWWWWWWWWWWWWWW.....',  // 16  26px
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW....',  // 17  28px
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW....',  // 18  28px
  // --- Face: eye patches (6 rows — shifted 2px left) ---
  'WWWWWWWKKKKKWWWWKKKKKWWWWWWW....',  // 19  rounded top (5K)
  'WWWWWWKKKKKKWWWWKKKKKKWWWWWW....',  // 20  full patch (6K)
  'WWWWKKKKEEKKWWWWKKEEKKWWWWWW....',  // 21  eyes + glint
  'WWWWKKKKEEKKWWWWKKEEKKWWWWWW....',  // 22  eyes + glint
  'WWWWWWKKKKKKWWWWKKKKKKWWWWWW....',  // 23  full patch (6K)
  'WWWWWWWKKKKKWWWWKKKKKWWWWWWW....',  // 24  rounded bottom (5K)
  // --- Muzzle / Jaw (6 rows — shifted 2px left) ---
  '.WWWWWWWWWWWKKKKWWWWWWWWWWW.....',  // 25  26px
  '..WWWWWWWWWWKKKKWWWWWWWWWW......',  // 26  24px
  '..WWWWWWWWWWWWWWWWWWWWWWWW......',  // 27  24px
  '...WWWWWWWWWWWWWWWWWWWWWW.......',  // 28  22px
  '....WWWWWWWWWWWWWWWWWWWW........',  // 29  20px
  '....WWWWWWWWWWWWWWWWWWWW........',  // 30  20px
  // --- Band (6 rows — shifted 2px left) ---
  '..KKKKKKKKKKKKKKKKKKKKKKKK......',  // 31  24K
  '.KKKKKKKKKKKKKKKKKKKKKKKKKK.....',  // 32  26K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKK....',  // 33  28K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKK...',  // 34  29K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK..',  // 35  30K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK..',  // 36  30K
  // --- Body (12 rows — shifted 2px left, broom enters left) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKK..',  // 37  shoulder
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKK..',  // 38  shoulder
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKK..',  // 39  chest
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKK..',  // 40  gradient
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKK..',  // 41  belly
  'HHKKKKKKWWWWWGGGGGGWWWWWKKKKKK..',  // 42  broom handle enters
  'KHKKKKKKWWWWWWWGGGGWWWWWWKKKKK..',  // 43  arm taper
  'HHKKKKKWWWWWWWWWWWWWWWWWWKKKK...',  // 44  wrist — white break
  'HH..KKKKKKKKWWWWWWWWKKKKKKKK....',  // 45  hips
  'HH...KKKKKKKWWWWWWWWKKKKKKK.....',  // 46  taper
  'HH....KKKKKKWWWWWWWWKKKKKK......',  // 47  taper
  'HH.....KKKKKWWWWWWWWKKKKK.......',  // 48  taper
  // --- Legs (6 rows — with broom handle on left) ---
  'HH....KKKKKKKK....KKKKKKKK......',  // 49  8px per leg
  'HH....KKKKKKKK....KKKKKKKK......',  // 50  8px
  'RH....KKKKKKKK....KKKKKKKK......',  // 51  8px
  'RH...KKKKKKKKK....KKKKKKKKK.....',  // 52  9px smooth step
  'RR..KKKKKKKKKK....KKKKKKKKKK....',  // 53  10px feet
  'RR..KKKKKKKKKK....KKKKKKKKKK....',  // 54  10px feet
  // --- Broom bristles on ground (4 rows) ---
  'RRRRRRRR........................',  // 55  bristles 8px
  'RRRRRRRR........................',  // 56  bristles 8px
  'SSSSSSSS........................',  // 57  bristle tips 8px
  'SSSSSSSS........................',  // 58  bristle tips 8px
  // --- Padding (6 rows) ---
  '................................',  // 59
  '................................',  // 60
  '................................',  // 61
  '................................',  // 62
  '................................',  // 63
  '................................',  // 64
]

// Frame 2: panda leans RIGHT (~2px), broom sweeps right along ground
// Mirror of frame 1. Broom handle (HH) on right edge; bristles at bottom-right.
const SWEEP_BIG_2: string[] = [
  // --- Padding (6 rows) ---
  '................................',  //  1
  '................................',  //  2
  '................................',  //  3
  '................................',  //  4
  '................................',  //  5
  '................................',  //  6
  // --- Ears (5 rows — shifted 2px right) ---
  '........KKKK............KKKK....',  //  7  4px dome tip
  '.......KKKKKK..........KKKKKK...',  //  8  6px
  '......KKKKKKKK........KKKKKKKK..',  //  9  8px
  '.....KKKKKKKKKK......KKKKKKKKKK.',  // 10  10px (max)
  '.....KKKKKKKKKK......KKKKKKKKKK.',  // 11  10px
  // --- Forehead (3 rows — shifted 2px right) ---
  '......KKKKKKKKWWWWWWWWKKKKKKKK..',  // 12  ear-head bridge
  '......KKKKKKWWWWWWWWWWWWKKKKKK..',  // 13  20px
  '.......KKWWWWWWWWWWWWWWWWWWKK...',  // 14  22px
  // --- Head (4 rows — shifted 2px right) ---
  '......WWWWWWWWWWWWWWWWWWWWWWWW..',  // 15  24px
  '.....WWWWWWWWWWWWWWWWWWWWWWWWWW.',  // 16  26px
  '....WWWWWWWWWWWWWWWWWWWWWWWWWWWW',  // 17  28px
  '....WWWWWWWWWWWWWWWWWWWWWWWWWWWW',  // 18  28px
  // --- Face: eye patches (6 rows — shifted 2px right) ---
  '....WWWWWWWKKKKKWWWWKKKKKWWWWWWW',  // 19  rounded top (5K)
  '....WWWWWWKKKKKKWWWWKKKKKKWWWWWW',  // 20  full patch (6K)
  '....WWWWKKKKEEKKWWWWKKEEKKWWWWWW',  // 21  eyes + glint
  '....WWWWKKKKEEKKWWWWKKEEKKWWWWWW',  // 22  eyes + glint
  '....WWWWWWKKKKKKWWWWKKKKKKWWWWWW',  // 23  full patch (6K)
  '....WWWWWWWKKKKKWWWWKKKKKWWWWWWW',  // 24  rounded bottom (5K)
  // --- Muzzle / Jaw (6 rows — shifted 2px right) ---
  '.....WWWWWWWWWWWKKKKWWWWWWWWWWW.',  // 25  26px
  '......WWWWWWWWWWKKKKWWWWWWWWWW..',  // 26  24px
  '......WWWWWWWWWWWWWWWWWWWWWWWW..',  // 27  24px
  '.......WWWWWWWWWWWWWWWWWWWWWW...',  // 28  22px
  '........WWWWWWWWWWWWWWWWWWWW....',  // 29  20px
  '........WWWWWWWWWWWWWWWWWWWW....',  // 30  20px
  // --- Band (6 rows — shifted 2px right) ---
  '......KKKKKKKKKKKKKKKKKKKKKKKK..',  // 31  24K
  '.....KKKKKKKKKKKKKKKKKKKKKKKKKK.',  // 32  26K
  '....KKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 33  28K
  '...KKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 34  29K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 35  30K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 36  30K
  // --- Body (12 rows — shifted 2px right, broom enters right) ---
  '..KKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',  // 37  shoulder (7K+14W+9K)
  '..KKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',  // 38  shoulder (6K+16W+8K)
  '..KKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',  // 39  chest (6K+6W+4G+6W+8K)
  '..KKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',  // 40  gradient (6K+5W+6G+5W+8K)
  '..KKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',  // 41  belly (6K+4W+8G+4W+8K)
  '..KKKKKKWWWWWGGGGGGWWWWWKKKKKKHH',  // 42  broom enters (6K+5W+6G+5W+6K+HH)
  '..KKKKKWWWWWWGGGGWWWWWWWKKKKKKHK',  // 43  arm taper — grip (5K+6W+4G+7W+6K+HK)
  '...KKKKWWWWWWWWWWWWWWWWWWKKKKKHH',  // 44  wrist (4K+18W+5K+HH)
  '....KKKKKKKKWWWWWWWWKKKKKKKK..HH',  // 45  hips (8K+8W+8K)
  '.....KKKKKKKWWWWWWWWKKKKKKK...HH',  // 46  taper (7K+8W+7K)
  '......KKKKKKWWWWWWWWKKKKKK....HH',  // 47  taper (6K+8W+6K)
  '.......KKKKKWWWWWWWWKKKKK.....HH',  // 48  taper (5K+8W+5K)
  // --- Legs (6 rows — with broom handle on right) ---
  '......KKKKKKKK....KKKKKKKK....HH',  // 49  8px per leg
  '......KKKKKKKK....KKKKKKKK....HH',  // 50  8px
  '......KKKKKKKK....KKKKKKKK....HR',  // 51  8px
  '.....KKKKKKKKK....KKKKKKKKK...HR',  // 52  9px smooth step
  '....KKKKKKKKKK....KKKKKKKKKK..RR',  // 53  10px feet
  '....KKKKKKKKKK....KKKKKKKKKK..RR',  // 54  10px feet
  // --- Broom bristles on ground (4 rows) ---
  '........................RRRRRRRR',  // 55  bristles 8px
  '........................RRRRRRRR',  // 56  bristles 8px
  '........................SSSSSSSS',  // 57  bristle tips 8px
  '........................SSSSSSSS',  // 58  bristle tips 8px
  // --- Padding (6 rows) ---
  '................................',  // 59
  '................................',  // 60
  '................................',  // 61
  '................................',  // 62
  '................................',  // 63
  '................................',  // 64
]

// ============================================================
// BUILD — building / repairing
// ============================================================

const BUILD_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  T: '#C8A060',  // plank wood (golden-amber)
  D: '#A07840',  // dark wood grain (golden-amber)
}

const BUILD_1: string[] = [
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWWWWWKKKKK',
  'KKKKWWWGGWWWKKKK',
  'KKTTTTDDDDTTTTKK',
  'KKTTTTDDDDTTTTKK',
  'KKKKWWWGGWWWKKKK',
  'KKKKKWWWWWWKKKKK',
  '.KKKKKWWWWKKKKK.',
  '..KKKKWWWWKKKK..',
  '...KKKK..KKKK..',
  '...KKKK..KKKK..',
  '..KKKKK..KKKKK.',
  '..TTTTDDDDTTTT..',
  '..TDTTTTTTTTTD..',
]

const BUILD_2: string[] = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWWWWWKKKKK',
  'KKKKWWWGGWWWKKKK',
  'KKKKWWGGGGWWKKKK',
  'KKKKWWWGGWWWKKKK',
  'KKKKKWWWWWWKKKKK',
  '...KKKK..KKKK..',
  '..KKKKK..KKKKK.',
  '..TTTTDDDDTTTT..',
  '..TTTTDDDDTTTT..',
  '..TDTTTTTTTTTD..',
]

// ============================================================
// BUILD (32×64) — scaled build animation
// ============================================================

const BUILD_BIG_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  T: '#C8A060',  // plank wood (golden-amber)
  D: '#A07840',  // dark wood grain (golden-amber)
}

// Frame 1: standing panda holding plank across belly
// Body anatomy matches canonical BASE_32 template.
// Plank (T/D pattern) held across belly area, rows 41-44.
const BUILD_BIG_1: string[] = [
  // --- Padding (8 rows) ---
  '................................',  //  1
  '................................',  //  2
  '................................',  //  3
  '................................',  //  4
  '................................',  //  5
  '................................',  //  6
  '................................',  //  7
  '................................',  //  8
  // --- Ears (5 rows — round dome) ---
  '......KKKK............KKKK......',  //  9  4px dome tip
  '.....KKKKKK..........KKKKKK.....',  // 10  6px
  '....KKKKKKKK........KKKKKKKK....',  // 11  8px
  '...KKKKKKKKKK......KKKKKKKKKK...',  // 12  10px (max)
  '...KKKKKKKKKK......KKKKKKKKKK...',  // 13  10px
  // --- Forehead (3 rows) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',  // 14  ear-head bridge
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',  // 15  20px
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',  // 16  22px
  // --- Head (4 rows) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 17  24px
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',  // 18  26px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 19  28px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 20  28px
  // --- Face: eye patches (6 rows) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 21  rounded top (5K)
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 22  full patch (6K)
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 23  eyes + glint
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 24  eyes + glint
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 25  full patch (6K)
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 26  rounded bottom (5K)
  // --- Muzzle / Jaw (6 rows) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',  // 27  26px
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',  // 28  24px
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 29  24px
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',  // 30  22px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 31  20px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 32  20px
  // --- Band (6 rows) ---
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',  // 33  24K
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',  // 34  26K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',  // 35  28K
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',  // 36  30K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 37  32K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 38  32K
  // --- Body (12 rows — plank across belly) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',  // 39  shoulder (9K+14W+9K)
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',  // 40  shoulder (8K+16W+8K)
  'KKKKTTTTTTTTDDDDDDDDTTTTTTTTKKKK',  // 41  plank top (4K grip, arms behind)
  'KKKKTTTTTTTTDDDDDDDDTTTTTTTTKKKK',  // 42  plank
  'KKKWTTTTTTTTDDDDDDDDTTTTTTTTWKKK',  // 43  inner paw starting to show
  'KKWWTTTTTTTTDDDDDDDDTTTTTTTTWWKK',  // 44  paw pads grip under plank
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',  // 45  belly below plank
  'KKKKKKKWWWWWWWGGGGWWWWWWWKKKKKKK',  // 46  arm taper
  'KKKKKKWWWWWWWWWWWWWWWWWWWWKKKKKK',  // 47  wrist — white break
  '..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..',  // 48  hips (28px)
  '...KKKKKKKKKWWWWWWWWKKKKKKKKK...',  // 49  taper (26px)
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',  // 50  taper (24px)
  // --- Legs (6 rows) ---
  '......KKKKKKKK....KKKKKKKK......',  // 51  8px per leg
  '......KKKKKKKK....KKKKKKKK......',  // 52  8px
  '......KKKKKKKK....KKKKKKKK......',  // 53  8px
  '.....KKKKKKKKK....KKKKKKKKK.....',  // 54  9px smooth step
  '....KKKKKKKKKK....KKKKKKKKKK....',  // 55  10px feet
  '....KKKKKKKKKK....KKKKKKKKKK....',  // 56  10px feet
  // --- Wall (4 rows — scaled from 2 rows) ---
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',  // 57  wall plank
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',  // 58  wall grain
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',  // 59  wall plank
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',  // 60  wall grain
  // --- Padding (4 rows) ---
  '................................',  // 61
  '................................',  // 62
  '................................',  // 63
  '................................',  // 64
]

// Frame 2: crouched panda placing plank on wall
// Body drops ~6 rows, body compressed (no plank). Wall gains plank on top.
const BUILD_BIG_2: string[] = [
  // --- Padding (14 rows — body drops 6 from frame 1) ---
  '................................',  //  1
  '................................',  //  2
  '................................',  //  3
  '................................',  //  4
  '................................',  //  5
  '................................',  //  6
  '................................',  //  7
  '................................',  //  8
  '................................',  //  9
  '................................',  // 10
  '................................',  // 11
  '................................',  // 12
  '................................',  // 13
  '................................',  // 14
  // --- Ears (5 rows — round dome) ---
  '......KKKK............KKKK......',  // 15  4px dome tip
  '.....KKKKKK..........KKKKKK.....',  // 16  6px
  '....KKKKKKKK........KKKKKKKK....',  // 17  8px
  '...KKKKKKKKKK......KKKKKKKKKK...',  // 18  10px (max)
  '...KKKKKKKKKK......KKKKKKKKKK...',  // 19  10px
  // --- Forehead (3 rows) ---
  '....KKKKKKKKWWWWWWWWKKKKKKKK....',  // 20  ear-head bridge
  '....KKKKKKWWWWWWWWWWWWKKKKKK....',  // 21  20px
  '.....KKWWWWWWWWWWWWWWWWWWKK.....',  // 22  22px
  // --- Head (4 rows) ---
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 23  24px
  '...WWWWWWWWWWWWWWWWWWWWWWWWWW...',  // 24  26px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 25  28px
  '..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..',  // 26  28px
  // --- Face: eye patches (6 rows) ---
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 27  rounded top (5K)
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 28  full patch (6K)
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 29  eyes + glint
  '..WWWWKKKKEEKKWWWWKKEEKKWWWWWW..',  // 30  eyes + glint
  '..WWWWWWKKKKKKWWWWKKKKKKWWWWWW..',  // 31  full patch (6K)
  '..WWWWWWWKKKKKWWWWKKKKKWWWWWWW..',  // 32  rounded bottom (5K)
  // --- Muzzle / Jaw (6 rows) ---
  '...WWWWWWWWWWWKKKKWWWWWWWWWWW...',  // 33  26px
  '....WWWWWWWWWWKKKKWWWWWWWWWW....',  // 34  24px
  '....WWWWWWWWWWWWWWWWWWWWWWWW....',  // 35  24px
  '.....WWWWWWWWWWWWWWWWWWWWWW.....',  // 36  22px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 37  20px
  '......WWWWWWWWWWWWWWWWWWWW......',  // 38  20px
  // --- Band (6 rows) ---
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',  // 39  24K
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',  // 40  26K
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',  // 41  28K
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',  // 42  30K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 43  32K
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',  // 44  32K
  // --- Body (8 rows — compressed, no plank) ---
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',  // 45  shoulder (9K+14W+9K)
  'KKKKKKKKWWWWWWWWWWWWWWWWKKKKKKKK',  // 46  shoulder (8K+16W+8K)
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',  // 47  chest
  'KKKKKKKKWWWWGGGGGGGGWWWWKKKKKKKK',  // 48  belly
  'KKKKKKKKWWWWWGGGGGGWWWWWKKKKKKKK',  // 49  belly taper
  'KKKKKKKKWWWWWWGGGGWWWWWWKKKKKKKK',  // 50  narrows
  'KKKKKKKKKWWWWWWWWWWWWWWKKKKKKKKK',  // 51  body base
  '..KKKKKKKKKKWWWWWWWWKKKKKKKKKK..',  // 52  hips
  // --- Legs (2 rows — crouched, compressed) ---
  '.....KKKKKKKKK....KKKKKKKKK.....',  // 53  9px
  '....KKKKKKKKKK....KKKKKKKKKK....',  // 54  10px feet
  // --- Wall (6 rows — fresh plank on TOP of existing wall) ---
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',  // 55  freshly placed plank
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',  // 56  freshly placed plank
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',  // 57  existing wall plank (same pos as frame 1)
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',  // 58  existing wall grain
  '....TTTTTTTTDDDDDDDDTTTTTTTT....',  // 59  existing wall plank
  '....TDTTTTTTTTTTTTTTTTTTTTTD....',  // 60  existing wall grain
  // --- Padding (4 rows) ---
  '................................',  // 61
  '................................',  // 62
  '................................',  // 63
  '................................',  // 64
]

// ============================================================
// DIG — digging with shovel
// ============================================================

const DIG_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  A: '#a0a0aa',  // shovel blade (steel gray)
  H: '#785032',  // shovel handle (wood)
  D: '#8C6941',  // displaced earth (warm brown)
  B: '#735532',  // displaced earth (dark brown)
}

// Frame 1: bent forward, shovel blade in ground, earth displaced
// HH handle through belly center and legs to blade
const DIG_1: string[] = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
  '.KKKKK..KKKKK...',
  '..KKWWWWWWKK....',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  '.WWWKKKWWKKKWWW.',
  '.WWKKEKWWKEKWWW.',
  '.WWWKKKWWKKKWWW.',
  '..WWWWWKKWWWWW..',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKK',
  'KKKKKWWHHWWKKKKK',
  'KKKKWWWHHWWWKKKK',
  'KKKWWWGHHGWWWKKK',
  '.KKWWWWHHWWWWKK.',
  '..KWWWWHHWWWWK..',
  '..KKKKWHHWKKKK..',
  '...KKKKHHKKKK...',
  '...KKKKHHKKKK...',
  '..KKKKKHHKKKKK..',
  '....BAAHHAAB....',
  '....BDDDDDDB....',
]

// Frame 2: standing upright, shovel raised overhead
// HH handle continuous through face/body, stops at lower belly
const DIG_2: string[] = [
  '.......AA.......',
  '......AAAA......',
  '.....AAAAAA.....',
  '.....AAAAAA.....',
  '....AAAAAAAA....',
  '....AAAAAAAA....',
  '.......HH.......',
  '...KKKKHHKKKK...',
  '..KKKKKHHKKKKK..',
  '..KKKKKHHKKKKK..',
  '...KKWWHHWWKK...',
  '..WWWWWHHWWWWW..',
  '.WWWWWWHHWWWWWW.',
  '.WWWKKKHHKKKWWW.',
  '.WWKKEKHHKEKWWW.',
  '.WWWKKKHHKKKWWW.',
  '..WWWWWHHWWWWW..',
  '..WWWWWHHWWWWW..',
  '...WWWWHHWWWW...',
  '..KKKKKHHKKKKK..',
  '.KKKKKKHHKKKKKKK',
  'KKKKKKKHHKKKKKKK',
  'KKKKKWWHHWWKKKKK',
  'KKKKWWWHHWWWKKKK',
  'KKKWWWGGGGWWWKKK',
  '.KKWWWWGGWWWWKK.',
  '..KWWWWWWWWWWK..',
  '...WWWWWWWWWW...',
  '..KKKK..KKKK....',
  '..KKKK..KKKK....',
  '.KKKKK..KKKKK...',
]

// ============================================================
// Exports
// ============================================================

export type ChoreId = 'cook' | 'chop' | 'fish' | 'water' | 'bamboo' | 'sweep' | 'build' | 'dig'

export const CHORE_SPRITES: Record<ChoreId, [SpriteData, SpriteData]> = {
  cook:   [toSprite(COOK_1, COOK_PAL), toSprite(COOK_2, COOK_PAL)],
  chop:   [toSprite(CHOP_1, CHOP_PAL), toSprite(CHOP_2, CHOP_PAL)],
  fish:   [toSprite(FISH_1, FISH_PAL), toSprite(FISH_2, FISH_PAL)],
  water:  [toSprite(WATER_1, WATER_PAL), toSprite(WATER_2, WATER_PAL)],
  bamboo: [toSprite(BAMBOO_1, BAMBOO_PAL), toSprite(BAMBOO_2, BAMBOO_PAL)],
  sweep:  [toSprite(SWEEP_1, SWEEP_PAL), toSprite(SWEEP_2, SWEEP_PAL)],
  build:  [toSprite(BUILD_1, BUILD_PAL), toSprite(BUILD_2, BUILD_PAL)],
  dig:    [toSprite(DIG_1, DIG_PAL), toSprite(DIG_2, DIG_PAL)],
}

export const CHORE_SPRITES_BIG: Partial<Record<ChoreId, [SpriteData, SpriteData]>> = {
  sweep: [toSpriteBig(SWEEP_BIG_1, SWEEP_BIG_PAL), toSpriteBig(SWEEP_BIG_2, SWEEP_BIG_PAL)],
  build: [toSpriteBig(BUILD_BIG_1, BUILD_BIG_PAL), toSpriteBig(BUILD_BIG_2, BUILD_BIG_PAL)],
  water: [toSpriteBig(WATER_BIG_1, WATER_BIG_PAL), toSpriteBig(WATER_BIG_2, WATER_BIG_PAL)],
}

export const CHORE_PLACEMENTS: Record<ChoreId, Array<{ col: number; row: number; dy?: number }>> = {
  cook:   [],
  chop:   [],
  fish:   [],
  water:  [],
  bamboo: [],
  sweep:  [],
  build:  [],
  dig:    [],
}
