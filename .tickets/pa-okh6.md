---
id: pa-okh6
status: open
deps: [pa-20z7, pa-36k1, pa-51oa, pa-hkbf, pa-lshn]
links: []
created: 2026-04-02T23:00:47Z
type: feature
priority: 2
assignee: Kimberly Kost
tags: [planned]
---
# Tile edge blending and zone decorations

Village tiles currently render with hard edges — zones appear as flat solid rectangles, paths only blend on the west side (via path3), and groundskeeping is visually identical to grass. This feature adds algorithmic edge compositing (dithered neighbor pixels at tile boundaries) and interior decoration landmarks for zones that currently have none (gathering, water, garden, groundskeeping, plus more variety in woodcutting).

Source plan: .claude/plans/harmonic-hugging-lantern.md
Related: pa-uk0e (Phase 2 landmarks — kept open, overlaps with decoration scope)

## Design

#### Approach

Algorithmic edge compositing — pre-compute blended sprites at module load into spriteCache[row][col]. For each tile, determine which cardinal neighbors differ (NSEW bitmask), then dither neighbor-appropriate pixels into the base sprite's edge rows/columns (3-pixel graduated transition). getGroundSprite() becomes a cache lookup.

#### Task breakdown (all serial — single file contention on groundTiles.ts)

1. Edge compositing infrastructure — getEdgeFlags, blendEdges, sprite cache, generic blending for all types
2. Path edge adjustments — remove path3, fix variantIndex from %3 to %2, verify corridor blending
3. Zone edge adjustments — zone-to-zone special cases (cooking↔gathering, water↔garden), clean up dead gather2/water2/garden2 sprites
4. Zone & groundskeeping decoration landmarks — new landmark sprites for gathering, water, garden, woodcutting, groundskeeping
5. Preview script updates — show edge variants and decorations

#### Verification

- Run preview scripts to inspect edge blending appearance
- Visual inspection of running app for natural transitions at zone boundaries
- Check narrow path corridors (1-2 tile wide) blend correctly on both sides
- Verify landmark placement at ~25% interior density

