import { TileType } from './types.js'

export const VILLAGE_COLS = 40
export const VILLAGE_ROWS = 23

/**
 * Raw village layout grid — 40 columns × 23 rows.
 * Widened from original 30-col layout to better fit widescreen displays.
 */
const LAYOUT_ROWS: readonly string[] = [
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',  // row 0
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',  // row 1
  'BBBGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGBBBB',  // row 2
  'BBGGGXXXXXXXXGGPGGGGGGGGGGGGHGGGGGGGGBBB',  // row 3
  'BBGGXXXXXXXXXXGGPGGGGGGGGGGGGGGGGHGGGBBB',  // row 4
  'BBGGXXXXXXXXXXGGPGGGGGGGGGGGGGGGGGGGGBBB',  // row 5
  'BBBGGXXXXXXXXGGGGPPGGGGGGGGGGGGGGGGGBBBB',  // row 6
  'BBBGGGGGGGGGGGGGPPAAAAGGGGGGGGGGGGGGBBBB',  // row 7
  'BBBGGGGGGGGGGGPPAAAAAAAAGGGGGGGGGGGGBBBB',  // row 8
  'BBBGGGGGGGGGGPPGAAAAAAAAAGGGGGGGGGHGBBBB',  // row 9
  'BBBGGGGGGGGGGPGAAAAAAAAAAAGGPGGGGGGGBBBB',  // row 10
  'BBBGGGGGGGGGPPGGAAAAAAAAGGGPPPGGGGGGBBBB',  // row 11
  'BBGGGHGGGGGGPGCCCCCAAAGGGPPPGPGGGGGGBBBB',  // row 12
  'BBGGGGGGGGGPCCCCCCCCGGPPPPPGPPPGGGGGBBBB',  // row 13
  'BBGGGGGGGGPPCCCCCCCCGGPPGGGGGGPFFGGGBBBB',  // row 14
  'BBGGGGGGGPPGGCCCCCCGGGPGGGGGGFFFFGGGBBBB',  // row 15
  'BBGGGGGGPPGGGCCCCGGGGGPPGGGGGWWWWWGGBBBB',  // row 16
  'BBBHGGGPGGGGGGGGGGGGGGGPGGWWWWWWWWGGBBBB',  // row 17
  'BBBGGGGGGGGGGGGGGGGGGGGPPWWWWWWWWWGGBBBB',  // row 18
  'BBBBGGGGHGGGGGGGGGGGGGGGGGWWWWWWWWGGBBBB',  // row 19
  'BBBBBGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGBBBB',  // row 20
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',  // row 21
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',  // row 22
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

/** All H marker positions in the source layout (raw, may overlap as 3×3 huts). */
export const HUT_POSITIONS: ReadonlyArray<{ col: number; row: number }> = [
  { col: 28, row: 3 },
  { col: 33, row: 4 },
  { col: 34, row: 9 },
  { col: 5, row: 12 },
  { col: 3, row: 17 },
  { col: 8, row: 19 },
]

/**
 * Group adjacent H markers into clusters (4-connected flood fill),
 * then return one placement position per cluster.
 *
 * This is an interim fix: each cluster gets a single small hut placed at the
 * topmost-leftmost marker. Medium/large hut sprites are future work.
 */
function clusterHuts(
  positions: ReadonlyArray<{ col: number; row: number }>,
): Array<{ col: number; row: number; size: number }> {
  const key = (c: number, r: number) => `${c},${r}`
  const posSet = new Set(positions.map((p) => key(p.col, p.row)))
  const visited = new Set<string>()
  const clusters: Array<{ col: number; row: number; size: number }> = []

  for (const pos of positions) {
    const k = key(pos.col, pos.row)
    if (visited.has(k)) continue

    // BFS flood fill for this cluster
    const queue = [pos]
    visited.add(k)
    const members: Array<{ col: number; row: number }> = []

    while (queue.length > 0) {
      const cur = queue.shift()!
      members.push(cur)
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nk = key(cur.col + dc, cur.row + dr)
        if (posSet.has(nk) && !visited.has(nk)) {
          visited.add(nk)
          queue.push({ col: cur.col + dc, row: cur.row + dr })
        }
      }
    }

    // Place hut at topmost-leftmost member
    members.sort((a, b) => a.row - b.row || a.col - b.col)
    clusters.push({ col: members[0].col, row: members[0].row, size: members.length })
  }

  return clusters
}

/** Clustered hut placements — one small hut per cluster (interim until medium/large sprites exist). */
export const HUT_PLACEMENTS = clusterHuts(HUT_POSITIONS)

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
