---
id: pa-18cp
status: closed
deps: [pa-ilil]
links: []
created: 2026-03-28T02:40:40Z
type: task
priority: 2
parent: pa-h3ca
tags: [planned]
---
# Create village layout tile map

Create webview-ui/src/village/tileMap.ts that embeds the village layout from scripts/village-layout.txt and parses it into a typed tile grid. The layout is embedded as a string constant (webview has no filesystem access).

## Design

File: webview-ui/src/village/tileMap.ts
Imports: TileType from ./types.js

Source: scripts/village-layout.txt (30 columns x 23 rows)
The file has a header/legend section (lines 1-14) followed by the grid (lines 16+). Read it and embed the grid portion as a template literal or string array.

Character → TileType mapping:
  B → BAMBOO, G → GRASS, P → PATH, W → WATER,
  C → COOKING, X → WOODCUTTING, F → GARDEN, A → GATHERING,
  H → GRASS (hut positions are grass for ground rendering; structure placement is separate metadata)

Exports:
- VILLAGE_COLS = 30
- VILLAGE_ROWS = 23
- tileMap: TileType[][] (VILLAGE_ROWS rows, each VILLAGE_COLS wide)
- HUT_POSITIONS: Array<{ col: number, row: number }> (positions where 'H' appears in the layout — these are where hut structures will be placed)
- isWalkable(type: TileType): boolean — walkable: GRASS, PATH, COOKING, WOODCUTTING, GARDEN, GATHERING; non-walkable: BAMBOO, WATER, VOID

Verification: tsc --noEmit passes. VILLAGE_COLS * VILLAGE_ROWS should equal total tile count. HUT_POSITIONS should have entries matching the H characters in the source layout.


## Notes

**2026-03-28T03:02:18Z**

Created webview-ui/src/village/tileMap.ts. Embeds the 30x23 grid from scripts/village-layout.txt as padded string constants, parses into TileType[][] via CHAR_TO_TILE mapping (H→GRASS). Exports: VILLAGE_COLS, VILLAGE_ROWS, tileMap, HUT_POSITIONS (10 entries), isWalkable(). tsc --noEmit passes with zero errors. Committed on setup branch as 4f6cccb.
