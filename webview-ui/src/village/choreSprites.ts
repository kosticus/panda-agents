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
  '....PPRRRRRR....',
  '....RRRRRRRR....',
  '...SOOYYYOOS....',
  '...SSSSSSSS.....',
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
  '....RRRRRRPP....',
  '....RRRRRRRR....',
  '...SOOYYYOOS....',
  '...SSSSSSSS.....',
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
  U: '#4678AA',  // water blue
  B: '#e6503c',  // bobber red
  D: '#64aadc',  // splash (light blue)
}

// Frame 1: relaxed standing, rod at col 4 (left side), asymmetric arm grip, bobber floating
const FISH_1: string[] = [
  '....F...........',  // row 0:  rod tip at col 4
  '....F...........',  // row 1:  rod shaft
  '....F...........',  // row 2:  rod shaft
  '....FKK..KKKK...',  // row 3:  left ear split by rod, right ear normal
  '..KKFKK..KKKKK..',  // row 4:  left ear around rod, ears widen
  '..KKFKK..KKKKK..',  // row 5:  ears full
  '....FKWWWWWWKK..',  // row 6:  ear-to-head transition
  '....FWWWWWWWWWW.',  // row 7:  head
  '....FWWWWWWWWWWW',  // row 8:  head widest
  '....FWWKKKWKKKWW',  // row 9:  eye patches
  '....FWKKEKWKEKWW',  // row 10: eyes with glint
  '....FWWKKKWKKKWW',  // row 11: eye patches lower
  '....FWWWWKKWWWWW',  // row 12: nose (K at cols 9-10)
  '....FWWWWWWWWWW.',  // row 13: lower face
  '....FWWWWWWWWW..',  // row 14: chin
  '.KKKFKKKKKKKKKK.',  // row 15: band — left arm extends to rod
  'KKKKFKKKKKKKKKKK',  // row 16: band wide — grip continues
  '.KKKFKKKKKKKKK..',  // row 17: grip — paw at rod, body right
  '..KKFWWWGGWWKKK.',  // row 18: belly top — arm at rod
  '..KKFWWGGGWWKKKK',  // row 19: belly
  '..KKFWWGGGWWKKKK',  // row 20: belly widest
  '...KFKWWWWWKKKK.',  // row 21: body narrowing
  '...KFKK..KKKK...',  // row 22: legs
  '..KKFKK..KKKKK..',  // row 23: feet
  '....F...........',  // row 24: rod extends into water (transparent)
  '....F...........',  // row 25: rod continues
  '....B...........',  // row 26: bobber top
  '...BBB..........',  // row 27: bobber body
  '................',  // row 28: transparent
  '................',  // row 29: transparent
]

// Frame 2: rod tip bows 1px left, bobber dips with splash, body identical
const FISH_2: string[] = [
  '...F............',  // row 0:  rod tip bowed left (col 3)
  '....F...........',  // row 1:  rod back to col 4
  '....F...........',  // row 2:  rod shaft
  '....FKK..KKKK...',  // row 3:  left ear split by rod
  '..KKFKK..KKKKK..',  // row 4:  left ear around rod, ears widen
  '..KKFKK..KKKKK..',  // row 5:  ears full
  '....FKWWWWWWKK..',  // row 6:  ear-to-head transition
  '....FWWWWWWWWWW.',  // row 7:  head
  '....FWWWWWWWWWWW',  // row 8:  head widest
  '....FWWKKKWKKKWW',  // row 9:  eye patches
  '....FWKKEKWKEKWW',  // row 10: eyes with glint
  '....FWWKKKWKKKWW',  // row 11: eye patches lower
  '....FWWWWKKWWWWW',  // row 12: nose
  '....FWWWWWWWWWW.',  // row 13: lower face
  '....FWWWWWWWWW..',  // row 14: chin
  '.KKKFKKKKKKKKKK.',  // row 15: band — left arm extends to rod
  'KKKKFKKKKKKKKKKK',  // row 16: band wide — grip continues
  '.KKKFKKKKKKKKK..',  // row 17: grip — paw at rod
  '..KKFWWWGGWWKKK.',  // row 18: belly top
  '..KKFWWGGGWWKKKK',  // row 19: belly
  '..KKFWWGGGWWKKKK',  // row 20: belly widest
  '...KFKWWWWWKKKK.',  // row 21: body narrowing
  '...KFKK..KKKK...',  // row 22: legs
  '..KKFKK..KKKKK..',  // row 23: feet
  '....F...........',  // row 24: rod extends down
  '....F...........',  // row 25: rod continues
  '...DDD..........',  // row 26: splash ring top
  '..DBBBD.........',  // row 27: bobber dipped with splash
  '...DDD..........',  // row 28: splash ring bottom
  '................',  // row 29: transparent
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
// CARRY — carrying a bundle
// ============================================================

const CARRY_PAL: Record<string, string> = {
  '.': '',
  K: '#1e1e1e',  // black fur
  W: '#f5f5f5',  // white fur
  G: '#d7d7d7',  // gray belly
  E: '#ffffff',   // eye glint
  T: '#a06e3c',  // bundle/crate (tan wood)
  X: '#785028',  // bundle straps / dark wood
  R: '#c8aa6e',  // bundle highlight
}

const CARRY_1: string[] = [
  '................',
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
  '...KKKKKKKKKKKK.',
  '..KKKKKKKKKKKKKK',
  '.KKKKKKKKKKKKKKK',
  '.KKKKKWWWWWWKKKK',
  '.KKKKWWWGGWWKKKK',
  '.KKKKKKGGGKKKKK.',
  '.KKKKKTTTTTKKKK.',
  '.KKKKKXXRXXKKKK.',
  '.KKKKKTTTTTKKKK.',
  '..KKKKWWWWWKKK..',
  '...KKKWWWWWKKK..',
  '...KKKKW...KKKK.',
  '...KKKK....KKKK.',
  '...KKKKK..KKKKK.',
  '...KKKK.........',
]

const CARRY_2: string[] = [
  '................',
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
  '.KKKKKKKKKKKK...',
  'KKKKKKKKKKKKKKK.',
  'KKKKKKKKKKKKKKK.',
  'KKKKKWWWWWWKKKK.',
  'KKKKWWWGGWWWKKK.',
  'KKKKKKGGGKKKKK..',
  'KKKKKTTTTTKKKK..',
  'KKKKKXXRXXKKKK..',
  'KKKKKTTTTTKKKK..',
  '.KKKKKWWWWWKKK..',
  '..KKKKWWWWKKK...',
  '.KKKK...WKKKK...',
  '.KKKK....KKKK...',
  '.KKKKK..KKKKK...',
  '.........KKKK...',
]

// ============================================================
// Exports
// ============================================================

export type ChoreId = 'cook' | 'chop' | 'fish' | 'water' | 'bamboo' | 'sweep' | 'build' | 'carry'

export const CHORE_SPRITES: Record<ChoreId, [SpriteData, SpriteData]> = {
  cook:   [toSprite(COOK_1, COOK_PAL), toSprite(COOK_2, COOK_PAL)],
  chop:   [toSprite(CHOP_1, CHOP_PAL), toSprite(CHOP_2, CHOP_PAL)],
  fish:   [toSprite(FISH_1, FISH_PAL), toSprite(FISH_2, FISH_PAL)],
  water:  [toSprite(WATER_1, WATER_PAL), toSprite(WATER_2, WATER_PAL)],
  bamboo: [toSprite(BAMBOO_1, BAMBOO_PAL), toSprite(BAMBOO_2, BAMBOO_PAL)],
  sweep:  [toSprite(SWEEP_1, SWEEP_PAL), toSprite(SWEEP_2, SWEEP_PAL)],
  build:  [toSprite(BUILD_1, BUILD_PAL), toSprite(BUILD_2, BUILD_PAL)],
  carry:  [toSprite(CARRY_1, CARRY_PAL), toSprite(CARRY_2, CARRY_PAL)],
}

export const CHORE_PLACEMENTS: Record<ChoreId, { col: number; row: number }> = {
  cook:   { col: 15, row: 13 },
  chop:   { col: 7,  row: 3 },
  fish:   { col: 27, row: 16 },
  water:  { col: 30, row: 13 },
  bamboo: { col: 33, row: 13 },
  sweep:  { col: 19, row: 8 },
  build:  { col: 11, row: 5 },
  carry:  { col: 16, row: 5 },
}
