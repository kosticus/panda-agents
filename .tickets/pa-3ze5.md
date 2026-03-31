---
id: pa-3ze5
status: in_progress
deps: [pa-hwry]
links: []
created: 2026-03-31T14:50:19Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-gmv6
tags: [planned]
---
# Update runtime tile map for 50×30 layout

Update the runtime tile map to match the approved 50×30 village layout.

Files to modify: webview-ui/src/village/tileMap.ts

Three changes:
1. VILLAGE_COLS = 40 → 50 (line 3), VILLAGE_ROWS = 23 → 30 (line 4)
2. Replace LAYOUT_ROWS (lines 10-33) with 30 new row strings of 50 chars each, matching the approved layout from scripts/village-layout.txt
3. Update HUT_POSITIONS (lines 54-61) with the {col, row} coordinates of every H marker in the new layout

HUT_POSITIONS is a manually maintained array — it does NOT auto-derive from H markers in LAYOUT_ROWS. The H chars in layout rows map to TileType.GRASS (line 45). clusterHuts() at line 70 groups the hardcoded positions via flood-fill to produce HUT_PLACEMENTS.

No other runtime files need changes for this task. VILLAGE_COLS/ROWS are consumed by renderer.ts (lines 9-10, 80-81) via import — the renderer's scale-to-fit logic (line 69) adapts automatically.

## Design

Implementation approach:
1. Read the approved layout from scripts/village-layout.txt
2. In tileMap.ts, update VILLAGE_COLS and VILLAGE_ROWS constants
3. Replace the LAYOUT_ROWS array with 30 strings matching the layout file
4. Scan the layout for H markers and update HUT_POSITIONS with their coordinates
5. Verify clusterHuts() still produces sensible placements (inspect HUT_PLACEMENTS)

Key files:
- webview-ui/src/village/tileMap.ts (only file modified)
- scripts/village-layout.txt (read-only reference)

Verification:
- npx tsc --noEmit — must pass with no errors
- Visual check in VS Code webview: tiles render at 50×30, zones are in correct positions, huts appear where expected
- Count LAYOUT_ROWS entries = 30, each string length = 50


## Notes

**2026-03-31T17:12:18Z**

Started by Kimberly Kost

**2026-03-31T17:18:11Z**

Approved approach: (1) Add GROUNDSKEEPING=9 to village/types.ts TileType. (2) tileMap.ts: VILLAGE_COLS=50, VILLAGE_ROWS=30, replace LAYOUT_ROWS with 30 rows from village-layout.txt, add S->GROUNDSKEEPING to CHAR_TO_TILE, update HUT_POSITIONS to 6 new coords, add GROUNDSKEEPING to isWalkable(). (3) Verify with tsc --noEmit. groundTiles.ts left as-is (falls through to grass).
