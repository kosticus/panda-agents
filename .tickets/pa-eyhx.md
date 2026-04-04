---
id: pa-eyhx
status: closed
deps: []
links: []
created: 2026-04-04T14:57:26Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-okh6
tags: [sprite, edge-blend]
---
# Fix blendEdges for 32x32 and wire into sprite cache

Update the blendEdges function in groundTiles.ts for 32x32 tile scale and connect it to the sprite cache builder.

## Current state

blendEdges exists (line 1059) but is never called — dead code. The sprite cache builder (line 1234) only calls selectBaseSprite. The function has hardcoded 16px values from the earlier tile size.

## Design

#### Fix hardcoded 16px values
- Lines 1098, 1101: `15 - depth` → `31 - depth`
- Line 1085: chunk loop `< 4` covers 16px (4 chunks × 4px). Scale to cover 32px — either 8 chunks × 4px or 4 chunks × 8px (adjust inner loop accordingly)
- Line 1092: inner loop range `chunk * 4` to `chunk * 4 + 4` must match new chunk size

#### Scale transition depth
- Current: 3px deep (depth 0/1/2) = ~19% of 16px but only ~9% of 32px
- Target: ~6px deep to maintain similar visual proportion (~19% of 32px)
- Density probabilities (lines 1113-1115) may need rebalancing for deeper transitions

#### Wire into sprite cache
- Line 1234: after `selectBaseSprite`, call `blendEdges` with edge flags:
  ```
  const edges = getEdgeFlags(tileType, col, row)
  if (edges) base = blendEdges(base, edges, col, row, tileType)
  ```

#### Key file
webview-ui/src/village/groundTiles.ts — lines 1007-1125 (edge infrastructure), 1229-1237 (cache builder)

#### Verification
- tsc --noEmit clean
- Visual inspection: transitions visible at zone boundaries
- No hard edges between differing zone types

## Notes

**2026-04-04T15:03:23Z**

Started by Kimberly Kost
