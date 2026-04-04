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
  c: '#A57844', v: '#87663A', x: '#B4915F', y: '#735834', '&': '#AD8350',
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
  // Gathering landmarks (flowers + toy)
  C: '#E85090', G: '#E8D040',   // flower pink, flower yellow
  T: '#F0E8E0', U: '#50A840',   // flower white, flower/stem green
  // Toy landmark
  V: '#D03030', X: '#E85050',   // ball red, ball highlight
  '1': '#901818',               // ball shadow
  // Water landmarks (lily + reeds)
  Y: '#40B848', Z: '#E0A0B0',   // bright lily pad green, lily flower pink
  i: '#4A8844',                  // reed stem green
  o: '#6E4420',                  // cattail brown
  // Garden landmarks (produce + scarecrow)
  '0': '#D04020',               // produce red (tomato body)
  '6': '#E88040',               // produce orange (highlight spot)
  '+': '#601808',               // produce dark red (outline / shadow)
  '#': '#3C7830',               // produce stem green
  '7': '#E8D050',               // scarecrow post bright straw yellow
  '8': '#383838',               // scarecrow hat dark charcoal
  '9': '#F0E8D8',               // scarecrow shirt cream white
  '@': '#4878D8',               // scarecrow pants bright blue
  // Groundskeeping landmarks (dirt + leaves + broom)
  '2': '#6B4E2A',               // turned earth brown
  '~': '#4A3218',               // turned earth dark
  '3': '#C8A030',               // dry leaf gold
  '4': '#8C6828',               // dry leaf brown
  '5': '#D08830',               // dry leaf orange
  '-': '#A08050',               // broom handle tan
  '=': '#6B4420',               // broom bristle brown
}

/** Convert a character grid into SpriteData (hex color array). */
function toSprite(rows: readonly string[]): SpriteData {
  return rows.map((row) =>
    Array.from(row, (ch) => P[ch] ?? ''),
  )
}

// =====================
// GRASS TILES
// =====================

const grass1 = toSprite([
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
  'gggggggggggggggggggggggggggggggg',
])

// =====================
// PATH TILES
// =====================

const path1 = toSprite([
  'wswwwwwkwwwswwwwwswwwwkwwwswwwww',
  'wwswwswwwwwswwpwwwswwswwwwswwpww',
  'wwwswpwwwswwwwswwwwswpwwwswwwwsw',
  'swwwwwwswkwwwwwwswwwwwwswkwwwwww',
  'wpwwswwwwwswwwkwwpwwswwwwwswwwkw',
  'wwswwkwwwswwwswwwwswwkwwwswwwsww',
  'swwpwswwwwwkwwwwswwpwswwwwwkwwww',
  'wwwwswwwswwwwpwwwwwwswwwswwwwpww',
  'wkwwwwpwwswwswwwwkwwwwpwwswwswww',
  'swwwswwwwwwkwwpwswwwswwwwwwkwwpw',
  'wwpwwwwwswwwswwwwwpwwwwwswwwswww',
  'wwswwkwwwwpwwwswwwswwkwwwwpwwwsw',
  'wpwwwwswwwwwkwwwwpwwwwswwwwwkwww',
  'swwpwwwwwwswwwwwswwpwwwwwwswwwww',
  'wwwwswwkwwwwwswwwwwwswwkwwwwwsww',
  'wkwwwwwwswwwwwpwwkwwwwwwswwwwwpw',
  'wswwwwkwwwwswwwwwswwwkwwwwswwwww',
  'wwswwswwwwswwpwwwwswwswwwwwswpww',
  'wwwswpwwswwwwswwwwwswpwwwswwwwsw',
  'swwwwwwswkwwwwwswwwwwwwswkwwwwww',
  'wpwwswwwwwswwwkwwpwwswwwwwswwkww',
  'wwswwkwwwswwwswwwwswwkwwwswwwsww',
  'swwpwswwwwwkwwwwswwpwswwwwwkwwww',
  'wwwwswwwswwwwpwwwwwwswwwswwwwpww',
  'wkwwwwpwwswwswwwwkwwwwpwwswwswww',
  'swwwswwwwwwkwwpwswwwswwwwwwkwwpw',
  'wwpwwwwwswwwswwwwwpwwwwwswwwswww',
  'wwswwkwwwwpwwwswwwswwkwwwwpwwwsw',
  'wpwwwwswwwwwkwwwwpwwwwswwwwwkwww',
  'swwpwwwwwwswwwwwswwpwwwwwwswwwww',
  'wwwwswwkwwwwwswwwwwwswwkwwwwwsww',
  'wkwwwwwwswwwwwpwwkwwwwwwswwwwwpw',
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
// Fire shifted to bottom half so it shows through transparent panda sprite rows
// Variant 1: flame leans right
const cook2 = toSprite([
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAAAAAAAANA',
  'AIAAAAAANAAAOAAA',
  'AAAANAAAAAAAIAAA',
  'AAOAAAAAIAAAAAAN',
  'AAAAAANAAAAAAAOA',
  'AAIAAAAAAOAAAAAA',
  'AAAAAIAAnAAAAANA',
  'AIAAAAAqnqAAOAAA',
  'AAAANAqnaqAAIAAA',
  'AAOAAOqaaqOAAAAN',
  'AAAAAOOaaOOAAAOA',
  'AAIAAOOOOOOAAAAA',
  'AAAAAAOOOOOAIANA',
])

// Variant 2: flame leans left
const cook3 = toSprite([
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAAAAAAAANA',
  'AIAAAAAANAAAOAAA',
  'AAAANAAAAAAAIAAA',
  'AAOAAAAAIAAAAAAN',
  'AAAAAANAAAAAAAOA',
  'AAIAAAAAAOAAAAAA',
  'AAAAAIAnAAAAAANA',
  'AIAAAqnqAAAAOAAA',
  'AAAANaqnqAAAIAAA',
  'AAOAAOqaaqOAAAAN',
  'AAAAAOOaaOOAAAOA',
  'AAIAAOOOOOOAAAAA',
  'AAAAAAOOOOOAIANA',
])

// Variant 3: tall narrow centered flame
const cook4 = toSprite([
  'AAIAAANAAIAANAAA',
  'AAAAAIAAAAAAAAAI',
  'ANAAAAAAOAAIAAAA',
  'AAAAAIAAAAAAAANA',
  'AIAAAAAANAAAOAAA',
  'AAAANAAAAAAAIAAA',
  'AAOAAAAAIAAAAAAN',
  'AAAAAANAAAAAAAOA',
  'AAIAAAAAAOAAAAAA',
  'AAAAAIAnAAAAAANA',
  'AIAAAAAnqAAAOAAA',
  'AAAANAqnqAAAIAAA',
  'AAOAAOqaaqOAAAAN',
  'AAAAAOOaaOOAAAOA',
  'AAIAAOOOOOOAAAAA',
  'AAAAAAOOOOOAIANA',
])

// =====================
// GATHERING LANDMARKS
// =====================

// Colorful flower patch on packed earth (play area)
const gather_flowers = toSprite([
  'ccxccvcccxcccvcc',
  'cvccccxccccxcccc',
  'cccvccccGvcccxcc',
  'cxccccvGGcccccvc',
  'ccccxcUUcxcccccc',
  'cvCCcccxcccvccxc',
  'cUUcvcccccTTcccv',
  'cxccccccvcUUxccc',
  'cccxcvccccGGcccx',
  'cvccCCccxcUUcccv',
  'ccccUUccccccxccc',
  'cxcccvcTTxcccccc',
  'ccvccccUUccvcccx',
  'cccccxcccccccvcc',
  'cvcccccvcxcccccc',
  'ccxcccccccvcxccc',
])

// Bright red ball toy on packed earth (play area)
const gather_toy = toSprite([
  'ccxccvcccxcccvcc',
  'cvccccxccccxcccc',
  'cccvcccccvcccxcc',
  'cxccccvcccccccvc',
  'ccccxcXXXccccccx',
  'cvcccXXVVVcvccxc',
  'ccccvXVVVVcccccc',
  'cxcccVVVV1cccxcc',
  'cccxcc111ccccccc',
  'cvccccccxcvccccv',
  'ccccxcccccccxccc',
  'cxccVvcccxcccccc',
  'ccvccccxcccvcccx',
  'cccccxcccccccvcc',
  'cvcccccvcxcccccc',
  'ccxcccccccvcxccc',
])

// =====================
// WATER LANDMARKS
// =====================

// Large centered lily pad with pink flower
const water_lily = toSprite([
  'WWWLWWWWSWWWWLWW',
  'WWWWWWLWWWWWWWWW',
  'WSWWWWWWWWLWWWWW',
  'WWWWLYYYYYYWWSWW',
  'WWWYYYYYYYYYWWWL',
  'WLWYYYYYYZZYWWWW',
  'WWWWYYYZZYYWWWWW',
  'WWWSYYYYYYYYWWLW',
  'WWWWWYYYYYYWWWWW',
  'WLWWWSWYYWWWSWWW',
  'WWWWWWWWWLWWWWWW',
  'WWWWLWWWWWWWWWLW',
  'WSWWWWWWWWLWWWWW',
  'WWWWWWLWWWWWWSWW',
  'WWLWWWWWSWWWWWWW',
  'WWWWSWWWWWWLWWWW',
])

// Offset lily pad pair — small upper-right, tiny lower-left
const water_lily2 = toSprite([
  'WWWLWWWWSWWWWLWW',
  'WWWWWWLWWWWWWWWW',
  'WSWWWWWWWYYYYYYW',
  'WWWWLWWWYYYYYSWW',
  'WWWWWWWWYZZYYWWL',
  'WLWWWWWWYYYYLWWW',
  'WWWWWWLWWWSWWWWW',
  'WWWSWWWWWWWWWWLW',
  'WWWWWWWWLWWWWWWW',
  'WLWWWSWWWWWWSWWW',
  'WWYYYWWWWLWWWWWW',
  'WWYYZWWWWWWWWWLW',
  'WSWWYWWWWWLWWWWW',
  'WWWWWWLWWWWWWSWW',
  'WWLWWWWWSWWWWWWW',
  'WWWWSWWWWWWLWWWW',
])

// Medium lily pad lower-left, tiny bud upper-right
const water_lily3 = toSprite([
  'WWWLWWWWSWWWWLWW',
  'WWWWWWLWWWWWWWWW',
  'WSWWWWWWWWLYYYWW',
  'WWWWLWWWWWWYZSWW',
  'WWWWWWWSWWWWWWWL',
  'WLWWWWWWWWWWLWWW',
  'WWWWWWLWWSWWWWWW',
  'WWWSWWWWWWWWWWLW',
  'WYYYYYWWLWWWWWWW',
  'WYYYYYYWWWWWSWWW',
  'WYYYYZZWWLWWWWWW',
  'WWYYYYWWWWWWWWLW',
  'WSWWWWWWWWLWWWWW',
  'WWWWWWLWWWWWWSWW',
  'WWLWWWWWSWWWWWWW',
  'WWWWSWWWWWWLWWWW',
])

// Four cattails — horizontal band across tile
const water_reeds = toSprite([
  'WWWLWWWWSWWWWLWW',
  'WooWWWWLWWooWWWW',
  'WooWooWWWooWWooW',
  'WWiWooSWWWiWWooW',
  'WLWWWiWWWWWWSWiW',
  'WWWSWWWWLWWWWWWW',
  'WWWWWWWWWWLWWWWW',
  'WWLWWWSWWWWWWWWW',
  'WWWWWWWWSWWWWLWW',
  'WSWWLWWWWWWWWWWW',
  'WWWWWWWWWLWWWWWW',
  'WWWWLWWWWWWWWWLW',
  'WSWWWWWWWWLWWWWW',
  'WWWWWWLWWWWWWSWW',
  'WWLWWWWWSWWWWWWW',
  'WWWWSWWWWWWLWWWW',
])

// Four cattails — staggered heights across tile
const water_reeds2 = toSprite([
  'WWWLWWWWSWWWWLWW',
  'WWooWWLWWWWWWWWW',
  'WSooWWWWWWLWWWWW',
  'WWWiWWWWWWWWoSWW',
  'WWWWWWooWWWooWWL',
  'WLWWWWooWWWooWWW',
  'WWWWWWWiWWWWiWWW',
  'WWWSWWWWWooWWWLW',
  'WWWWWWWWWooWWWWW',
  'WLWWWSWWWWiWSWWW',
  'WWWWWWWWWLWWWWWW',
  'WWWWLWWWWWWWWWLW',
  'WSWWWWWWWWLWWWWW',
  'WWWWWWLWWWWWWSWW',
  'WWLWWWWWSWWWWWWW',
  'WWWWSWWWWWWLWWWW',
])

// Three cattails — scattered, different quadrants
const water_reeds3 = toSprite([
  'WWWLWWWWSWWWWLWW',
  'WWWWWWLWWWWooWWW',
  'WSWWWWWWWWWooWWW',
  'WWWWLWWWWWWWiSWW',
  'WWWWWWSWWWWWWWWL',
  'WLWWWWWWWWWWLWWW',
  'WWWWWWLWWWWWWWWW',
  'WWWSWWWWWWooWWLW',
  'WooWWWWWWWooWWWW',
  'WooWWSWWWWWiSWWW',
  'WWiWWWWWWLWWWWWW',
  'WWWWLWWWWWWWWWLW',
  'WSWWWWWWWWLWWWWW',
  'WWWWWWLWWWWWWSWW',
  'WWLWWWWWSWWWWWWW',
  'WWWWSWWWWWWLWWWW',
])

// =====================
// GARDEN LANDMARKS
// =====================


// Scarecrow — dark hat with brim, cream shirt, blue pants (centered)
const garden_scarecrow = toSprite([
  'BKBBHBBKBBHBBKBB',
  'KPQKK88888KPQKKK',
  'BKBBH88888HBBKBB',
  'KKK888888888QKKK',
  'BHBBKBB77BKBBHBB',
  'KPQ99777777799KKK',
  'BKB99777777799KBB',
  'KKKPQ997799PQKKK',
  'BHBBK997799BBHBB',
  'KPQKKK@@@@KPQKKK',
  'BKBBHB@@@@HBBKBB',
  'KKKPQK@@@@KPQKKK',
  'BHBBKBB77BKBBHBB',
  'KPQKKKPQKKKPQKKK',
  'BKBBHBBKBBHBBKBB',
  'KKKPQKKKKKPQKKKK',
])

// Scarecrow variant — wider shirt, single-row arms, blue pants
const garden_scarecrow2 = toSprite([
  'BKBBHBBKBBHBBKBB',
  'KPQKK88888KPQKKK',
  'BKBBH88888HBBKBB',
  'KKK888888888QKKK',
  'BHBBKBB77BKBBHBB',
  'KPQ99777777799KKK',
  'BKBB99977999BKBB',
  'KKKP99977999QKKK',
  'BHBBK997799BBHBB',
  'KPQKKK@@@@KPQKKK',
  'BKBBHB@@@@HBBKBB',
  'KKKPQK@@@@KPQKKK',
  'BHBBKBB77BKBBHBB',
  'KPQKKKPQKKKPQKKK',
  'BKBBHBBKBBHBBKBB',
  'KKKPQKKKKKPQKKKK',
])

// =====================
// WOODCUTTING LANDMARKS (additional)
// =====================

// Stacked log pile — 3 cut rounds using stump palette (r/u/z)
const wood_logs = toSprite([
  'EEgEEFEEgEEEJEgE',
  'EgEEEEJEEEFEEEEE',
  'EEEFrrrrrreeEgEE',
  'gEEEruuzurEEEEJE',
  'EEJEruzuurFEEEEE',
  'EEEEruzuurEEgEEE',
  'EgEEruuzurEEEFEE',
  'ErrrrrrrrrrrrrzE',
  'ruuzrrEEErruzurE',
  'ruzzrEEFEEruzurE',
  'ruzzrEgEErzuzurE',
  'ruuzrEEEEEruuzrE',
  'ErrrrrEJErrrrrEE',
  'EgEEJEEFEEEEJEEE',
  'EEFEEEEEEgEEEEFE',
  'EEEEgEJEEEEFEEEE',
])

// =====================
// GROUNDSKEEPING LANDMARKS
// =====================

// Large freshly dug earth patch on grass
const ground_dirt = toSprite([
  'ggggtgggggdggggg',
  'gdgggggdgggggggt',
  'ggggggggggggtggg',
  'ggtggdggggggggdg',
  'ggggg22~2dgggggg',
  'gggd~2~22~22tggg',
  'ggg2~22~2~22gggg',
  'ggt~2~2~22~2gggd',
  'gggg2~22~2~2tggg',
  'ggggg~22~2gggggg',
  'gdgggtggggggdggg',
  'gggggggggdgggggg',
  'gggdgggggggggggt',
  'ggggggggggggtggg',
  'gtgggdggggggggdg',
  'ggggggtggdgggggg',
])

// Large mounded leaf pile on grass
const ground_leaves = toSprite([
  'ggggtgggggdggggg',
  'gdgggggdgggggggt',
  'ggggggggggggtggg',
  'ggtggdggggggggdg',
  'ggggg3gggggggggg',
  'gggdggg345ggtggg',
  'ggggg34534gggggd',
  'ggt4g345345ggggg',
  'ggggg534534gtggg',
  'gggggg3453gggggg',
  'gdgggtggg5ggdggg',
  'gggggggggdgggggg',
  'gggdgggggggggggt',
  'ggggggggggggtggg',
  'gtgggdggggggggdg',
  'ggggggtggdgggggg',
])

// Wider broom leaning diagonally on grass
const ground_broom = toSprite([
  'ggggtgggggdggggg',
  'gdgggggdgggggggt',
  'ggggggggggggtggg',
  'ggtggdggggg-ggdg',
  'gggggggggd-ggggg',
  'gggdggggg-ggtggg',
  'gggggggt-ggggggd',
  'ggtgggg-gggggggg',
  'gggggd-gggggtggg',
  'gggg===gdggggggg',
  'gdg====gggggdggg',
  'ggg====ggdgggggg',
  'gggd===ggggggggt',
  'ggggggggggggtggg',
  'gtgggdggggggggdg',
  'ggggggtggdgggggg',
])

// =====================
// ZONE COLORBLOCK TILES (32x32)
// Simple solid fills for layout validation — not detailed art.
// =====================

const gather_base = toSprite([
  'cccccccccccccccccccccccccccccccc',
  'ccccccccccccccccccccc&cccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'ccccccccccccx&cccccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'ccccccccccccccccccccccccvccccccc',
  'cccccc&ccccccccccccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'ccccccccccccccccccx&cccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'ccccccccccccccccccccccccc&cccccc',
  'ccccvccccccccccccccccccccccccccv',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccccxcccccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'ccccccccccccccccccc&ccccccc&cccc',
  'cccccccccccccccccccccccccccccccc',
  'ccccccx&cccccccccccccccccccccccv',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccccccc&ccccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccccccccccccccccxcccccc',
  'cccccccccccccccccccccccccccccccc',
  'cccccccccccc&&cccccccccccccccccc',
  'ccvccccccccccccccccccccccccccccv',
  'cccccccccccccccccccccccccccccccc',
  'ccccccccccccccccccxccccccccccccc',
  'cccccccccccccccccccccccccccccccc',
])

const water_a = toSprite([
  'WWWWWLLWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWRRWWWWWWWWWWDWWWWWW',
  'WWWWWWWWWDWWWRRWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWLLWWWWWWWWWWWW',
  'WWWRRWWWWWWWWWWWWWWWWWWWWWWWWSSW',
  'WWWRRWWWWWWWWWWWWWWWWWWWWWWWWSDW',
  'WWWWWWWWWWWWWWSWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWLLWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWLLWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWRRWWWWWWWWWWWWWDWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWLLWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWSSWWWWWWWWWWWWWRRWW',
  'WWWWWDWWWWWWWSDWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWLLWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWLLWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWDWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWRRWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWSSWWWWW',
  'WWDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWLLWW',
  'WWWWWLLWWWWWWWWWWWWDWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWRRWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWSSWWWWWWWWWWWWWWWWWWWWWWDWWWW',
  'WWWWDWWWWWWWWWWWWLLWWWWWWWWWWWWW',
])

const water_b = toSprite([
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWLLWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWSSWWWWW',
  'WWWWWWWWWRRWWWWWWWWWWWWWWSDWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWRRWWWWWWWWW',
  'WWWLLWWWWWWWWWWWWWWWWRRWWWWWWWWW',
  'WWWWWWWWWWWWWDWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWLLWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWDWWWWWWWWWWW',
  'WWWWWWWWWWWWWSSDWWWWWWWWWWWWWWWW',
  'WWWWWRRWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWLLWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWRRWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWSSWWWWWWWWWWWWWWWWWWLLWWWWWWWW',
  'WWSDWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWRRWWWWWWWWWWWWWWWWWWDWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWSSWWWWWWW',
  'WWWWWWWWWWWWWLLWWWWWWWWWDWWWWWWW',
  'WWWWWWDWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWRRWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWLLWWWWWWWWW',
  'WWWWWWWWWWDWWWWWWWWWWWWWWWWRRWWW',
])

const water_c = toSprite([
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWRRWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWLLWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWSSWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWSDWWWWWWWWWWWWWWWW',
  'WWWWWLLWWWWWWWWWWWWWWWWWWWWDWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWRRWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWLLWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWDWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWRRWWWWWWWWWWWWW',
  'WWWWWSSWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWDWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWSSWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWDWWWW',
  'WWWWWWWWWWWWWRRWWWWWWWWWWWWWWWWW',
  'WWWLLWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWRRW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWLLWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWDWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWRRWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWLLWWWWW',
  'WWWWWWWWWDWWWWWWWWWWWWWWWWWWWWWW',
])

const woodBlock = toSprite([
  'EEEEFEEEEFEEEEEEFEEEEEFEEEEEEEJJ',
  'EEFEEEEEEEEEEFEEEEEEEEEEFEEEEJJJ',
  'EEEEEEEFEEEEEEEEEEEEEFEEEEEEFEEE',
  'EEEEEEEEEEEEEEEEFEEEEEEEEEEFEEJJ',
  'EFEEEEEEEEFEEEEEEEEFEEEEEEEEEEJJ',
  'EEEEEEFEEEEEEEEEEEEEEEEEEFEEEEJJ',
  'EEEEEEEEEEEEFEEEEEEEEEEEEEEEEEJJ',
  'EFEEEEEEFEEEEEEEEEEEEFEEEEEFEEJJ',
  'EEEEEFEEEEEEEEEEFEEEEEEEEEEEEEJJ',
  'EEEEEEEEEEFEEEEEEEEEEEEFEEEEFEJJ',
  'EFEEEEEEEEEEEEEEEEEFEEEEEEEEEEJJ',
  'EEEEEEEEFEEEEFEEEEEEEEEEEEEFEEJJ',
  'EEEEFEEEEEEEEEEEEEEEEFEEEEEEEEJJ',
  'EEEEEEEEEEEEEEFEEEEEEEEEEFEEEEJJ',
  'EFEEEEFEEEEEEEEEEEEEEEEEEEEEEEJJ',
  'EEEEEEEEEEFEEEEEEEFEEEEFEEEEFEJJ',
  'EEEFEEEEEEEEEEFEEEEEEEEEEEEEEJJJ',
  'EEEEEEFEEEEEEEEEEEEEEFEEEEEEEEJJ',
  'EEEEEEEEEEEEFEEEEEEEEEEFEEEFEEJJ',
  'EFEEEEEEEEEEEEEEEFEEEEEEEEEEEEJJ',
  'EEEEEEEEFEEEEEEEEEEEEEEEEFEEEEJJ',
  'EEEEFEEEEEEEEEEFEEEEFEEEEEEEEEJJ',
  'EEEEEEEEEEEFEEEEEEEEEEEEEEEEFEEE',
  'EFEEEEEEEEEEEEEEEEFEEEEEEFEEEEJJ',
  'EEEEEEFEEEEEEFEEEEEEEEEEEEEEEFJJ',
  'EEEEEEEEEEEEEEEEEEEFEEEEEEEEEEJJ',
  'EEFEEEEEEEEFEEEEEEEEEEEEEFEEEEJJ',
  'EEEEEEEEFEEEEEEEEEEEFEEEEEEEEFJJ',
  'EEEFEEEEEEEEEEFEEEEEEEEEEEEEEJJJ',
  'EEEEEEEEEEEEEEEEFEEEEEEEEEFEEEJJ',
  'EEEEFEEEEFEEEEEEEEEEEEFEEEEEEEJJ',
  'EEEEEEEEEEEEEFEEEEEEEEEEEEFEEEJJ',
])

const gardenBlock = toSprite([
  'BKBBBBKBBBBBBBBKBBBBBKBBBBBBBBBB',
  'BBKBBBBBBBBBBKBBBBBBBBBBBKBBBBBB',
  'BBBBBBKBBBBBBBBBBBBBBKBBBBBBBBKB',
  'BBBBBBBBBBBBBBBKBBBBBBBBBBKBBBBB',
  'BKBBBBBBBBKBBBBBBBBKBBBBBBBBBBBB',
  'BBBBBKBBBBBBBBBBBBBBBBBBKBBBBBBB',
  'BBBBBBBBBBBKBBBBBBBBBBBBBBBBBBKB',
  'BKBBBBBBKBBBBBBBBBBBBKBBBBBBKBBB',
  'BBBBKBBBBBBBBBBBKBBBBBBBBBBBBBBK',
  'BBBBBBBBBKBBBBBBBBBBBBKBBBBBKBBB',
  'BKBBBBBBBBBBBBBBBBKBBBBBBBBBBBBK',
  'BBBBBBBKBBBBKBBBBBBBBBBBBBKBBBBB',
  'BBBBKBBBBBBBBBBBBBBBBKBBBBBBBBBK',
  'BBBBBBBBBBBBBKBBBBBBBBBKBBBBBBBK',
  'BKBBBBKBBBBBBBBBBBBBBBBBBBBBBBBK',
  'BBBBBBBBBBKBBBBBBBKBBBBKBBBBKBBB',
  'BBKBBBBBBBBBBKBBBBBBBBBBBBBBBBBK',
  'BBBBBBKBBBBBBBBBBBBKBBBBBBBBBKBB',
  'BBBBBBBBBBBKBBBBBBBBBBKBBBKBBBBK',
  'BKBBBBBBBBBBBBBBKBBBBBBBBBBBBBBK',
  'BBBBBBBBKBBBBBBBBBBBBBBBBKBBBBBB',
  'BBBBKBBBBBBBBBBKBBBBKBBBBBBBBBBK',
  'BBBBBBBBBBKBBBBBBBBBBBBBBBBKBBBB',
  'BKBBBBBBBBBBBBBBBKBBBBBBKBBBBBBK',
  'BBBBBBKBBBBBBKBBBBBBBBBBBBBBKBBB',
  'BBBBBBBBBBBBBBBBBBKBBBBBBBBBBBBK',
  'BBKBBBBBBBBKBBBBBBBBBBBBBBKBBBBB',
  'BBBBBBBBKBBBBBBBBBBKBBBBBBBBBKBB',
  'BBKBBBBBBBBBBKBBBBBBBBBBBBBBBBBK',
  'BBBBBBBBBBBBBBBKBBBBBBBBBKBBBBBB',
  'BBBBKBBBBKBBBBBBBBBBBKBBBBBBBBBB',
  'BBBBBBBBBBBBKBBBBBBBBBBBBKBBBBBB',
])

// =====================
// Variant lookup tables
// =====================

const pathVariants: readonly SpriteData[] = [path1]
const waterVariants: readonly SpriteData[] = [water_a, water_b, water_c]
const woodVariants: readonly SpriteData[] = [woodBlock]
const gardenVariants: readonly SpriteData[] = [gardenBlock]
const bambooVariants: readonly SpriteData[] = [bamboo1, bamboo2, bamboo3]
const cookLandmarks: readonly SpriteData[] = [cook2, cook3, cook4]
const gatherLandmarks: readonly SpriteData[] = [gather_flowers, gather_toy]
const waterLandmarks: readonly SpriteData[] = [water_lily, water_lily2, water_lily3, water_reeds, water_reeds2, water_reeds3]
/** Centroid of the garden zone — single scarecrow placement. */
const gardenCenter: { col: number; row: number } | null = (() => {
  let sumCol = 0, sumRow = 0, count = 0
  for (let r = 0; r < VILLAGE_ROWS; r++) {
    for (let c = 0; c < VILLAGE_COLS; c++) {
      if (tileMap[r]![c] === TileType.GARDEN) { sumCol += c; sumRow += r; count++ }
    }
  }
  return count > 0 ? { col: Math.round(sumCol / count) - 1, row: Math.round(sumRow / count) } : null
})()
const woodLandmarks: readonly SpriteData[] = [wood2, wood_logs]
const groundLandmarks: readonly SpriteData[] = [ground_dirt, ground_leaves, ground_broom]

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

/**
 * Precompute scan-order index for each water landmark spot.
 * Cycling through variants in scan order guarantees even distribution
 * regardless of how (col+row) parity or hashing lands.
 */
const waterLandmarkIdx = new Map<string, number>()
;(() => {
  let n = 0
  for (let r = 0; r < VILLAGE_ROWS; r++) {
    for (let c = 0; c < VILLAGE_COLS; c++) {
      if (tileMap[r][c] === TileType.WATER && !isZoneEdge(TileType.WATER, c, r) && isLandmarkSpot(c, r)) {
        waterLandmarkIdx.set(`${c},${r}`, n++)
      }
    }
  }
})()

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

  if (tileType === TileType.GRASS) {
    const grassColors = [P.g, P.g, P.d, P.t, P.g, P.m, P.g, P.g]
    const base = grass1.map((r) => [...r])
    let h = (col * 374761393 + row * 668265263) | 0
    for (let pr = 0; pr < 32; pr++) {
      for (let pc = 0; pc < 32; pc++) {
        if (!base[pr][pc]) continue
        h = Math.imul((h >> 16) ^ h, 0x45d9f3b)
        h = (h >> 16) ^ h
        if ((h & 0x7FFFFFFF) % 4 === 0) {
          base[pr][pc] = grassColors[(h >>> 2) & 7]
        }
      }
    }
    return base
  }
  if (tileType === TileType.PATH) {
    const pathColors = [P.s, P.k, P.w, P.p]
    const base = path1.map((r) => [...r])
    // Per-tile pixel swaps to break tiling repetition
    let h = (col * 374761393 + row * 668265263) | 0
    for (let pr = 0; pr < 32; pr++) {
      for (let pc = 0; pc < 32; pc++) {
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
  if (tileType === TileType.BAMBOO) return grass1
  if (tileType === TileType.GATHERING) {
    const gatherColors = [P.c, P['&'], P.c, P['&']]
    const base = gather_base.map((r) => [...r])
    let h = (col * 374761393 + row * 668265263) | 0
    for (let pr = 0; pr < 32; pr++) {
      for (let pc = 0; pc < 32; pc++) {
        if (!base[pr][pc]) continue
        h = Math.imul((h >> 16) ^ h, 0x45d9f3b)
        h = (h >> 16) ^ h
        if ((h & 0x7FFFFFFF) % 15 === 0) {
          base[pr][pc] = gatherColors[(h >>> 2) & 3]
        }
      }
    }
    return base
  }
  if (tileType === TileType.WATER) return waterVariants[idx % waterVariants.length]
  if (tileType === TileType.GARDEN) return gardenVariants[idx % gardenVariants.length]
  if (tileType === TileType.WOODCUTTING) return woodVariants[idx % woodVariants.length]
  if (tileType === TileType.COOKING) return grass1
  if (tileType === TileType.GROUNDSKEEPING) return grass1

  // Fallback: void or unknown
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
    spriteCache[row][col] = base
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
