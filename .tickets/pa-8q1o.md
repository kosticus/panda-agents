---
id: pa-8q1o
status: closed
deps: []
links: []
created: 2026-04-04T00:33:17Z
type: bug
priority: 3
assignee: Kimberly Kost
tags: [sprite, hut]
---
# Fix transparent line between hut roof and walls

There is a visible transparent pixel row between the hut roof and walls in the rendered sprite. The gap is visible at 2x scale in the village webview.


## Notes

**2026-04-04T00:37:15Z**

Started by Kimberly Kost

**2026-04-04T00:40:17Z**

Approved approach: Change WT from 44 to 43 in hutSprites.ts (line 22) so walls start one row higher, filling the transparent row 43 gap. One-line constant change, fixes both hut sizes.

**2026-04-04T00:43:33Z**

Changed WT from 44 to 43 in hutSprites.ts (line 22). Row 43 was unwritten between the eave shadow (row 42) and the old wall top (row 44), causing a transparent gap. Walls now start at row 43, filling the gap. Committed as b69ade9.
