---
id: pa-4srm
status: closed
deps: [pa-1xtp, pa-3ze5]
links: []
created: 2026-03-28T19:36:43Z
type: task
priority: 2
parent: pa-aua3
tags: [village, rendering]
---
# Edge-aware zone tile selection

Wire getGroundSprite() (groundTiles.ts) to use edge variants at zone boundaries.

Edge tiles (grass border → zone interior transition): gather2, water2, garden2. Use when any 4-connected neighbor in tileMap differs from the current tile type.

Landmark tiles (interior feature): wood2 (stump), cook2 (fire pit). Place at deterministic positions within zones — not edge tiles, these add visual landmarks.

Implementation: add isZoneEdge(type, col, row) helper that reads tileMap neighbors. Update getGroundSprite() cases for GATHERING, WATER, GARDEN to return edge variant at boundaries. For WOODCUTTING and COOKING, use position hashing or fixed placement for landmark variant.


## Notes

**2026-03-31T18:57:20Z**

Started by Kimberly Kost

**2026-03-31T19:13:31Z**

Approved approach: (1) Add isZoneEdge(type, col, row) helper in groundTiles.ts — import tileMap, VILLAGE_COLS, VILLAGE_ROWS from tileMap.ts, check 4-connected neighbors, return true if any differs. (2) Update getGroundSprite() for GATHERING/WATER/GARDEN to return *2 edge variant when isZoneEdge is true. (3) For WOODCUTTING/COOKING, use position hashing for landmark placement at ~1-2 deterministic interior positions. (4) Leave GROUNDSKEEPING as-is (falls through to grass1).

**2026-04-01T23:29:32Z**

Implemented edge-aware zone tile selection in groundTiles.ts. Added isZoneEdge() (4-connected neighbor check against tileMap, OOB=different) and isLandmarkSpot() (coprime hash, ~1/7 density). getGroundSprite() now returns *2 edge variants for GATHERING/WATER/GARDEN at zone boundaries, and *2 landmark variants (wood2 stump, cook2 fire pit) at deterministic interior positions for WOODCUTTING/COOKING. GRASS/PATH/BAMBOO/GROUNDSKEEPING unchanged.
