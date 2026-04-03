---
id: pa-ee7g
status: closed
deps: []
links: []
created: 2026-04-03T20:44:29Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-v04a
tags: [planned]
---
# Scale foundation — TILE_SIZE 32, 25x15 grid, layout, renderer offsets

Change the village from 50x30 tiles at 16px to 25x15 tiles at 32px. This is the foundation for the 2x scale validation — everything else depends on it. The scene will render incorrectly after this task (old sprites at new positions) but should not crash.

Village and office have separate TILE_SIZE constants (village/types.ts vs constants.ts) — only change the village one.

## Design

#### Files to modify

##### webview-ui/src/village/types.ts
- Change `TILE_SIZE = 16` to `TILE_SIZE = 32` (line 1)

##### webview-ui/src/village/tileMap.ts
- `VILLAGE_COLS = 25` (was 50)
- `VILLAGE_ROWS = 15` (was 30)
- New `LAYOUT_ROWS`: simple 25x15 character grid. Mostly grass (G), some path (P), 3-4 hut marker positions (H). No zone tiles (cooking, water, garden, etc.) — those come later. Keep the layout simple and temporary — it exists only to validate scale.
- New `HUT_POSITIONS`: 3-4 positions within the 25x15 grid. Use small huts only (3x3 tiles). Keep away from grid edges — a hut at (col, row) occupies [col, col+2] x [row, row+2], so max col is 22 and max row is 12.
- Update `CHAR_TO_TILE` if needed — existing mappings are fine, just ensure H maps to GRASS as before.

##### webview-ui/src/village/choreSprites.ts
- Empty all 8 CHORE_PLACEMENTS arrays. All keys MUST remain (missing keys cause runtime crash from `for...of undefined`):
  `cook: [], chop: [], fish: [], water: [], bamboo: [], sweep: [], build: [], dig: []`
- Do NOT change FRAME_W/FRAME_H — chore sprites are never rendered with empty placements.

##### webview-ui/src/village/renderer.ts
- Line 117: sleep panda zY `+ 8` → `+ 16` (this is TILE_SIZE / 2)
- Line 122: zzz x-offset `+ 12` → `+ 24`
- Line 123: zzz y-offset `+ 4` → `+ 8`
- Line 124: zzz zY `+ 1` → leave as-is (z-ordering epsilon, not pixel position)

#### Acceptance criteria
- TypeScript compiles without errors
- No runtime crashes when the village renders (ground tiles will be 16x16 in 32px grid — visually wrong but functional)
- All 8 CHORE_PLACEMENTS keys exist as empty arrays

#### Verification
- Run `npx tsc --noEmit` to verify compilation


## Notes

**2026-04-03T20:46:39Z**

Started by Kimberly Kost

**2026-04-03T20:52:07Z**

Approved approach: Follow ticket design exactly — change TILE_SIZE 16→32, grid 50x30→25x15 with simple G/P/H layout, empty all 8 CHORE_PLACEMENTS arrays (keep keys), scale renderer sleep/zzz offsets. Verify with tsc --noEmit.

**2026-04-03T20:58:30Z**

Implemented: TILE_SIZE 16→32, grid 50x30→25x15 with temp G/P/H layout, 4 small hut positions, emptied all 8 CHORE_PLACEMENTS arrays (keys kept), scaled renderer sleep/zzz offsets. tsc --noEmit passes clean. Commit 82d7a28.
