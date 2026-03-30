---
id: pa-2h2w
status: closed
deps: []
links: []
created: 2026-03-30T00:50:37Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-51zd
tags: [planned]
---
# Enlarge garden zone in tileMap

Expand GARDEN (F) tiles in tileMap.ts to accommodate 3 chore pandas (water, bamboo, dig). Current garden is only 6 tiles at rows 14-15, cols 29-32.

## Design

Modify LAYOUT_ROWS in webview-ui/src/village/tileMap.ts:

Row 13: convert cols 31-35 from G to F (+5 tiles)
Row 14: convert cols 33-35 from G to F (+3 tiles, cols 31-32 already F)
Row 15: convert cols 33-35 from G to F (+3 tiles, cols 29-32 already F)

Result: ~17 garden tiles spanning rows 13-15, cols 29-35.

Safety (verified):
- No HUT_PLACEMENTS (H markers) in target area
- No PATH (P) tiles affected — col 30 row 14 stays P (natural west boundary)
- GARDEN is walkable same as GRASS — no walkability impact

Key file: webview-ui/src/village/tileMap.ts (LAYOUT_ROWS, lines 10-34)

Verification: npx tsc --noEmit, user visual check for expanded garden ground tiles.


## Notes

**2026-03-30T00:52:50Z**

Started by Kimberly Kost

**2026-03-30T00:55:34Z**

Approved approach: Edit LAYOUT_ROWS in tileMap.ts lines 24-26 — row 13 cols 31-35 G→F, row 14 cols 33-35 G→F, row 15 cols 33-35 G→F. Update village-layout.txt if present. Verify with tsc --noEmit.

**2026-03-30T01:01:00Z**

Expanded GARDEN (F) tiles in rows 13-15 cols 29-35. Row 13: +5F (cols 31-35), Row 14: +3F (cols 33-35), Row 15: +3F (cols 33-35). Total garden now 17 tiles. Updated both tileMap.ts and village-layout.txt. tsc --noEmit passes.
