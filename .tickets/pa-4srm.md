---
id: pa-4srm
status: open
deps: [pa-1xtp]
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

