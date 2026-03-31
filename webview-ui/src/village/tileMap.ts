import { TileType } from './types.js'

export const VILLAGE_COLS = 50
export const VILLAGE_ROWS = 30

/**
 * Raw village layout grid — 50 columns × 30 rows.
 * Matches scripts/village-layout.txt v4.
 */
const LAYOUT_ROWS: readonly string[] = [
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',  // row 0
  'BBGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGBB',  // row 1
  'BGGGGGXXXXXXXGGGGGGPGGGGGGGGGGGGFFFFFFWWWGGGGGGGBB',  // row 2
  'BGGGGXXXXXXXXGGGGGGPGGGGGGGGGGGFFFFFFFWWWWGGGGGGBB',  // row 3
  'BGGGXXXXXXXXXPPGGGPPGGGGGGGGGGFFFFFFFFWWWWGGGGGGBB',  // row 4
  'BGGGGXXXXXXXXGPPPPPGGGGGGGGGGGFFFFFFFWWWWGGGGGGGBB',  // row 5
  'BGGGGGXXXXXXXGGGGPPGGGGGGGGGGGGGFFFFWWWGGGGGGGGGGB',  // row 6
  'BGGGGGGGGGGGGGGPPPHGGGGGGGGGGGGGGPGGGGGGGGGGGGGGBB',  // row 7
  'BGGGGGGGGGGGGPPPGGGGGGGGGGGGGGGGPPGGGGGGGGGGGGGGBB',  // row 8
  'BBGGGGGGGGHGPPGGGGGAAAAAAAGGGGGGGPGGGGGGGGGGGGGGGB',  // row 9
  'BGGGGGGGGGGPPGGGGAAAAAAAAAAAAGGGPPHGGGGGGGGGGGGGBB',  // row 10
  'BGGGGGGGGGPPGGGAAAAAAAAAAAAAAAGGPPGGGGGGGGGGGGGGGB',  // row 11
  'BGGGGGGGGPPGGGAAAAAAAAAAAAAAAAAGGPPGGGGGGGGGGGGGGB',  // row 12
  'BGGGGGGGPPPPPPPPPPPPCCCCAAAAAAPPPPPGGGGGGGGGGGGGGB',  // row 13
  'BGGGGGGPPGGGGGGAAAACCCCCCCAAAGGGGGPPGGGGGGGGGGGGBB',  // row 14
  'BGGGGGPPGGGGGGGGGACCCCCCCCAAGGGGGGGPPGGGGGGGGGGGBB',  // row 15
  'BGGGGGPPGGGGGGGGGGGCCCCCCAAAGGGGGGGPPGGGGGGGGGGGGB',  // row 16
  'BGGGGGHPPGGGGGGGGGGGAAAAAAGGGGGGGGPPGGGGGGGGGGGGGB',  // row 17
  'BGGGGGGGPPGGGGGGGGGGGGGGGGGGGGGGGPPGHGGGGGGGGGGGBB',  // row 18
  'BGGGGGGGGPPGGGGGGGGGGGGGGGGGGGGGPPGGGGGGGGGGGGGGGB',  // row 19
  'BGGSSSSSSSPPGGGGGGGGGGGGGGGGGGGPPGGGGGGGGGGGGGGGGB',  // row 20
  'BGSSSSSSSSPPGGGGGGGGGGGGGGGGGGPPGGGGGGGGGGGGGGGGGB',  // row 21
  'BGSSSSSSSSGPPGGGGGGGGGGGGGGGPPPPPPPPPWWWWWWWWWWWBB',  // row 22
  'BGGSSSSSSGGGPPPGGGGGGGGGGGPPPGGGGGGWWWWWWWWWWWWWBB',  // row 23
  'BBGGGGGGGGGGGGPPPGGGGGGPPPPGGGGGGGGWWWWWWWWWWWWWBB',  // row 24
  'BGGGGGGGGGGGGGGGPPPPPPPPHGGGGGGGGGGGGWWWWWWWWWWGGB',  // row 25
  'BBGGGGGGGGGGGGGGGGGPPPGGGGGGGGGGGGGGGGWWWWWWWWGGGB',  // row 26
  'BBBGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGBB',  // row 27
  'BBBBGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGBBB',  // row 28
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',  // row 29
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
  S: TileType.GROUNDSKEEPING,
}

/** Parsed tile grid — VILLAGE_ROWS rows, each VILLAGE_COLS wide. */
export const tileMap: TileType[][] = LAYOUT_ROWS.map((row) =>
  Array.from(row, (ch) => CHAR_TO_TILE[ch] ?? TileType.VOID),
)

/** All H marker positions in the source layout (raw, may overlap as 3×3 huts). */
export const HUT_POSITIONS: ReadonlyArray<{ col: number; row: number }> = [
  { col: 18, row: 7 },
  { col: 10, row: 9 },
  { col: 34, row: 10 },
  { col: 6, row: 17 },
  { col: 36, row: 18 },
  { col: 24, row: 25 },
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
    type === TileType.GATHERING ||
    type === TileType.GROUNDSKEEPING
  )
}
