import { TileType } from './types.js'

export const VILLAGE_COLS = 30
export const VILLAGE_ROWS = 23

/**
 * Raw village layout grid — 30 columns × 23 rows.
 * Sourced from scripts/village-layout.txt (grid portion, lines 16-38).
 * Short rows are right-padded with B (bamboo) to 30 characters.
 */
const LAYOUT_ROWS: readonly string[] = [
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'BBBGGGGGGGGGGGGGGGGGGGGGGGBBBB',
  'BBGGXXGGGGGGGPGGGGGGGHGGGBBBBB',
  'BBGXXXXGGGGGGPGGGGGGHHGGGGBBBB',
  'BBGXXXXGGGGGGPGGGGGGGGGGGBBBBB',
  'BBGGXXGGGGGGGPGGGGGGGGGGGBBBBB',
  'BBBGGGGGGGGGPPGGGGGGGGGGGGBBBB',
  'BBBGGGPPPPPPAAPPPPPPGGGGGGBBBB',
  'BBBBGGGGGGGCCAAAAAGGGGGHGGGGBB',
  'BBBGGGGGGGCCAAAAGGGGGGGGGGGBBB',
  'BBBGHHHGPPPPAAAPPPPGGGGGGGGBBB',
  'BBGGGGGGPPGGGPPGGGPPPGGGGGBBBB',
  'BBGGGGGGPGGGGGPGGGGGGPPPGGBBBB',
  'BBGGGGGPPGGGGGPGGGFFGGGGPPBBBB',
  'BBGGGGPPGGGGGGGFFFFFGGGGPBBBBB',
  'BBGGGGGGGGGHGGFFFWWWWGGGPPBBBB',
  'BBBGGGGGGGGGGGGWWWWWWGGPGBBBBB',
  'BBBGGGGGGGGGGGGGWWWWGGGGGGBBBB',
  'BBBBGGGGGGHGGGGGGGGGGGGGGGBBBB',
  'BBBBBGGGGGGGGGGGGGGHGGGGGBBBBB',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
]

const CHAR_TO_TILE: Record<string, TileType> = {
  B: TileType.BAMBOO,
  G: TileType.GRASS,
  P: TileType.PATH,
  W: TileType.WATER,
  C: TileType.COOKING,
  X: TileType.WOODCUTTING,
  F: TileType.GARDEN,
  A: TileType.GATHERING,
  H: TileType.GRASS, // hut positions render as grass; structure placement is separate
}

/** Parsed tile grid — VILLAGE_ROWS rows, each VILLAGE_COLS wide. */
export const tileMap: TileType[][] = LAYOUT_ROWS.map((row) =>
  Array.from(row, (ch) => CHAR_TO_TILE[ch] ?? TileType.VOID),
)

/** Positions where hut structures will be placed (H characters in the source layout). */
export const HUT_POSITIONS: ReadonlyArray<{ col: number; row: number }> = [
  { col: 21, row: 3 },
  { col: 20, row: 4 },
  { col: 21, row: 4 },
  { col: 23, row: 9 },
  { col: 4, row: 11 },
  { col: 5, row: 11 },
  { col: 6, row: 11 },
  { col: 11, row: 16 },
  { col: 10, row: 19 },
  { col: 19, row: 20 },
]

/** Returns true if a panda can walk on this tile type. */
export function isWalkable(type: TileType): boolean {
  return (
    type === TileType.GRASS ||
    type === TileType.PATH ||
    type === TileType.COOKING ||
    type === TileType.WOODCUTTING ||
    type === TileType.GARDEN ||
    type === TileType.GATHERING
  )
}
