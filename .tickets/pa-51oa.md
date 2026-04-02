---
id: pa-51oa
status: open
deps: [pa-36k1]
links: []
created: 2026-04-02T23:02:13Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-okh6
tags: [planned]
---
# Zone edge refinements

After edge infrastructure (pa-20z7) and path refinements (pa-36k1), refine zone tile edge handling. The generic blending from pa-20z7 works for most cases, but some zone-to-zone borders need special treatment:

- Cooking ↔ Gathering (20 shared edges): both are warm earth tones, transition should be minimal or none
- Water ↔ Garden (7 shared edges): garden side should show damp/dark soil toward water

Also clean up dead sprite code (gather2, water2, garden2) that was reverted in commit 5ef2a35.

## Design

#### Key file: webview-ui/src/village/groundTiles.ts

##### 1. Zone-to-zone blending rules

In the blendEdges function, add special case handling for specific tile-type pairs:

```typescript
// Skip blending between these pairs — both are earth tones, transition is unnecessary
const SKIP_BLEND: Set<string> = new Set([
  `${TileType.COOKING}-${TileType.GATHERING}`,
  `${TileType.GATHERING}-${TileType.COOKING}`,
])

// In blendEdges, before applying dither for a direction:
const key = `${tileType}-${neighborType}`
if (SKIP_BLEND.has(key)) continue
```

##### 2. Water ↔ Garden special palette

When a garden tile borders water, the edge should show darker/damper soil instead of generic water blue:
```typescript
const SPECIAL_PALETTE: Record<string, readonly string[]> = {
  [`${TileType.GARDEN}-${TileType.WATER}`]: ['#5C4A32', '#6B5840', '#4A3D28'], // damp dark soil
}
```

Check for special palettes before falling back to the generic BLEND_PALETTE.

##### 3. Clean up dead sprites

Remove the following unused sprite definitions:
- gather2 (lines ~259-276): edge sprite with all-sides grass border
- water2 (lines ~303-320): edge sprite with all-sides grass border  
- garden2 (lines ~347-364): edge sprite with all-sides grass border

These were reverted from use in commit 5ef2a35 and are now fully replaced by algorithmic compositing.

##### 4. Verify zone-specific edges

Key layout patterns to verify (from tileMap.ts LAYOUT_ROWS):
- Gathering zone (rows 9-17): large irregular shape, borders grass, path, AND cooking
- Cooking zone (rows 13-16): embedded within gathering, should have minimal/no transition
- Water zone (rows 2-6 and 22-26): two separate areas, upper borders garden
- Garden zone (rows 2-6): borders water on east side, grass elsewhere
- Woodcutting zone (rows 2-6): borders grass only

#### Acceptance criteria

- Cooking ↔ Gathering borders show no (or very subtle) transition
- Garden → Water borders show dark damp soil transition (not blue)
- All zone-to-grass borders show normal graduated blending
- gather2, water2, garden2 sprite definitions removed
- No dead references to removed sprites

#### Verification

Build and visually inspect:
- Cooking zone edges where they meet gathering (should look natural, not jarring)
- Garden's east side where it meets water (should show damp soil gradient)
- All zone-to-grass transitions
- Verify no runtime errors from removed sprite references

