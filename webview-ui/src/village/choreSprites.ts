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
