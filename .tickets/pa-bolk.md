---
id: pa-bolk
status: open
deps: [pa-3ze5]
links: []
created: 2026-03-31T15:06:05Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-gmv6
tags: [planned]
---
# Convert chore placements to multi-station arrays

Change CHORE_PLACEMENTS from single-position to array-of-positions per chore, and update the renderer to iterate them. This enables multiple work stations per chore type in the enlarged 50×30 layout.

Current state:
- choreSprites.ts line 714: CHORE_PLACEMENTS typed as Record<ChoreId, { col: number; row: number }>
- renderer.ts lines 128-137: reads CHORE_PLACEMENTS[choreId] as single {col, row}

CHORE_PLACEMENTS is consumed only by renderer.ts (no other runtime importers). choreSprites.ts is NOT re-exported from village/index.ts.

The coordinate values currently reference positions in the old 40×23 grid. They must be updated to 2+ positions per chore matching zone positions in the new 50×30 layout (read tileMap.ts LAYOUT_ROWS to find valid zone tiles).

## Design

Implementation approach:

1. webview-ui/src/village/choreSprites.ts (line 714):
   - Change type: Record<ChoreId, { col: number; row: number }> → Record<ChoreId, Array<{ col: number; row: number }>>
   - Update each chore entry to an array of 2+ positions within the correct zone tiles:
     * cook → COOKING zone tiles
     * chop → WOODCUTTING zone tiles
     * water → GARDEN zone tiles (near water)
     * fish → near WATER/lake tiles
     * build → WOODCUTTING zone tiles (building area)
     * bamboo → near BAMBOO perimeter
     * sweep → GATHERING or path tiles (groundskeeping)
     * dig → path or GATHERING tiles (groundskeeping)
   - Read tileMap.ts to find valid positions for each chore

2. webview-ui/src/village/renderer.ts (lines 128-137):
   - Change from single placement to iterating the array:
     for (const choreId of Object.keys(CHORE_SPRITES)) {
       const frames = CHORE_SPRITES[choreId as ChoreId]
       for (const placement of CHORE_PLACEMENTS[choreId as ChoreId]) {
         drawables.push({ ... placement.col ... placement.row ... })
       }
     }

Verification:
- npx tsc --noEmit — must pass (the type change is breaking; both files must update atomically)
- Visual check: chore sprites appear at all station positions, not just one per chore

