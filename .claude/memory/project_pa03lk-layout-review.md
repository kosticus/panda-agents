---
name: pa-03lk layout awaiting visual review
description: Zone layout ticket pa-03lk has two commits on setup branch, user will give layout feedback next session
type: project
---

pa-03lk (Zone layout with colorblock sprites) is `in_progress` on the `setup` branch. User needs to visually validate the layout and will provide feedback.

**Why:** The layout was redesigned collaboratively through 3 iterations. The code is committed but not yet approved for closing.

**How to apply:** When the user gives layout feedback, the relevant files are:
- `webview-ui/src/village/tileMap.ts` — LAYOUT_ROWS grid (25x15), CHAR_TO_TILE, HUT_POSITIONS
- `webview-ui/src/village/groundTiles.ts` — colorblock sprites (gatherBlock, waterBlock, woodBlock, gardenBlock), variant arrays, selectBaseSprite()

The current v3 layout (commit `68dd1f0`):
```
     1234567890123456789012345
  0: .................BBB.....     woodcutting NE
  1: ............##.BBBB......     thick path → woodcutting
  2: ..H........##BBBB........     small hut NW
  3: ..........##.BBB.....H...     small hut NE
  4: .........##..............     path descends
  5: ........##aaaaa..........     path into gathering
  6: .......aaaaaaaaa.........     gathering core
  7: .......aaaaaaaaa.........     gathering core
  8: ......##aaaaaa...#.......     paths W + SE branch
  9: .....##.aaa....#.........     paths + gathering tail
 10: ....##.......#...........     SW + SE paths
 11: ...#~~~~DDDD.#...........     pond→garden touching, paths
 12: .H~~~~~DDDDD#............    small hut SW, pond→garden, path
 13: .~~~~~~DDDDDD...HH.......    pond→garden, large hut SE
 14: .~~~~~DDDDD.....HH.......    pond→garden, large hut cont.
```

Key: `.`=grass `#`=path `a`=gathering `B`=woodcutting `~`=water `D`=garden `H`=hut

Huts: 3 small (NW, NE, SW) + 1 large 2x2 cluster (SE). Uses `clusterHuts()` for sizing.

Discussed but not yet implemented: cooking spot left of gathering, possibly more huts.

Ticket design section still has the original grid — notes capture the v3 redesign. If layout is approved, update the design block before closing.
