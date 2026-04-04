import { TileType } from './types.js'

export const VILLAGE_COLS = 25
export const VILLAGE_ROWS = 15

/**
 * Raw village layout grid — 25 columns × 15 rows.
 * Central gathering clearing, woodcutting NE, pond SW touching garden, organic branching paths.
 */
const LAYOUT_ROWS: readonly string[] = [
  'GGGGGGGGGGGGGGGGGBBBGGGGG',  // row 0  — woodcutting NE
  'GGGGGGGGGGGGPPGBBBBGGGGGG',  // row 1  — path toward woodcutting
  'GGHGGGGGGGGPPBBBBGGGGGGGG',  // row 2  — hut NW + path + woodcutting
  'GGGGGGGGGGPPGBBBGGGGGHGGG',  // row 3  — path + woodcutting tapers + hut NE
  'GGGGGGGGGPPGGGGGGGGGGGGGG',  // row 4  — path descends
  'GGGGGGGGPPAAAAAGGGGGGGGGG',  // row 5  — path into gathering
  'GGGGGGGAAAAAAAAAGGGGGGGGG',  // row 6  — gathering core
  'GGGGGGGAAAAAAAAAGGGGGGGGG',  // row 7  — gathering core
  'GGGGGGPPAAAAAAPPPPPGGGGGG',  // row 8  — path W + gathering + path to SE
  'GGGGGPPGAAAGGGGGGGPPGGGGG',  // row 9  — paths diverge + SE path continues
  'GGHGPPGGGGGGGGGGGGPHHGGGG',  // row 10 — hut SW + path + SE path + hut SE (2×2)
  'GGGGPWWWWDDDDGGGGGGGHHGGG',  // row 11 — pond + garden + hut SE continues
  'GGGWWWWWWDDDDDGGGGGGGGGGG',  // row 12 — pond + garden
  'GGWWWWWWWDDDDDDGGGGGGGGGG',  // row 13 — pond widens + garden
  'GGWWWWWWDDDDDDGGGGGGGGGGG',  // row 14 — pond + garden
]

const CHAR_TO_TILE: Record<string, TileType> = {
  G: TileType.GRASS,
  P: TileType.PATH,
  H: TileType.GRASS, // hut positions render as grass; structure placement is separate
  A: TileType.GATHERING,
  B: TileType.WOODCUTTING,
  W: TileType.WATER,
  D: TileType.GARDEN,
}

/** Parsed tile grid — VILLAGE_ROWS rows, each VILLAGE_COLS wide. */
export const tileMap: TileType[][] = LAYOUT_ROWS.map((row) =>
  Array.from(row, (ch) => CHAR_TO_TILE[ch] ?? TileType.VOID),
)

/** All H marker positions in the source layout (small huts only at 25×15 scale). */
export const HUT_POSITIONS: ReadonlyArray<{ col: number; row: number }> = [
  { col: 2, row: 2 },    // small — NW
  { col: 21, row: 3 },   // small — NE near woodcutting
  { col: 2, row: 10 },   // small — SW above pond
  { col: 19, row: 10 },  // large (2x2 cluster) — SE
  { col: 20, row: 10 },
  { col: 19, row: 11 },
  { col: 20, row: 11 },
]

/**
 * Group adjacent H markers into clusters (4-connected flood fill),
 * then return one placement per cluster at the topmost-leftmost marker.
 * Cluster size determines hut variant: 1 = small, 2 = medium, 3+ = large.
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

/** Clustered hut placements — size 1 = small, size 2 = medium, size 3+ = large. */
export const HUT_PLACEMENTS = clusterHuts(HUT_POSITIONS)

/** Returns true if a panda can walk on this tile type. */
export function isWalkable(type: TileType): boolean {
  return (
    type === TileType.GRASS ||
    type === TileType.PATH ||
    type === TileType.COOKING ||
    type === TileType.WOODCUTTING ||
    type === TileType.GARDEN ||
    type === TileType.GATHERING ||
    type === TileType.GROUNDSKEEPING
  )
}
