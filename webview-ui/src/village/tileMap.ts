import { TileType } from './types.js'

export const VILLAGE_COLS = 40
export const VILLAGE_ROWS = 23

/**
 * Raw village layout grid — 40 columns × 23 rows.
 * Widened from original 30-col layout to better fit widescreen displays.
 */
const LAYOUT_ROWS: readonly string[] = [
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'BBBGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGBBBB',
  'BBGGGGGGGXXGGGGGGGPGGGGGGGHGGGGGGGGGBBBB',
  'BBGGGGGGXXXXGGGGGGPGGGGGGHHGGGGGGHGGBBBB',
  'BBGGGGGGXXXXGGGGGGPGGGGGGGGGGGGGGGGGBBBB',
  'BBGGGGGGGXXGGGGGGGPGGGGGGGGGGGGGGGGGBBBB',
  'BBBGGGGGGGGGGGGGGPPGGGGGGGGGGGGGGGGGBBBB',
  'BBBGGGGGGGGPPPPPPAAPPPPPPGGGGGGGGGGGBBBB',
  'BBBBGGGGGGGGGGGGCCAAAAAGGGGGHGGGGGGGBBBB',
  'BBBGGGGGGGGGGGGCCAAAAGGGGGGGGGGGGHGGBBBB',
  'BBBGGGGGGHHHGPPPPAAAPPPPGGGGGGGGGGGGBBBB',
  'BBGGGGGGGGGGGPPGGGPPGGGPPPGGGGGGGGGGBBBB',
  'BBGGGGGGGGGGGPGGGGGPGGGGGGPPPGGGGGGGBBBB',
  'BBGGGGGGGGGGPPGGGGGPGGGFFGGGGPPGGGGGBBBB',
  'BBGGGGGGGGGPPGGGGGGGFFFFFGGGGPGGHGGGBBBB',
  'BBGGGGGGGGGGGGGGHGGFFFWWWWGGGPPGGGGGBBBB',
  'BBBGGGGGGGGGGGGGGGGWWWWWWGGPGGGGGGGGBBBB',
  'BBBGGGGGGGGGGGGGGGGGGWWWWGGGGGGGGGGGBBBB',
  'BBBBGGGGGGGGGGGHGGGGGGGGGGGGGGGGGHGGBBBB',
  'BBBBBGGGGGGGGGGGGGGGGGGGGGHGGGGGGGGGBBBB',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
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
  { col: 26, row: 3 },
  { col: 25, row: 4 },
  { col: 26, row: 4 },
  { col: 33, row: 4 },
  { col: 28, row: 9 },
  { col: 33, row: 10 },
  { col: 9, row: 11 },
  { col: 10, row: 11 },
  { col: 11, row: 11 },
  { col: 32, row: 15 },
  { col: 16, row: 16 },
  { col: 15, row: 19 },
  { col: 33, row: 19 },
  { col: 24, row: 20 },
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
