---
id: pa-hm38
status: closed
deps: [pa-ee7g]
links: []
created: 2026-04-03T20:44:52Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-v04a
tags: [planned]
---
# Rough 32x32 ground tiles — grass and path sprites

Create rough 32x32 pixel art ground tiles for the 2x scale validation. Only grass (3 variants) and path (1 variant) are needed — all other tile types fall back to grass. Edge blending and landmarks are disabled for this increment.

This is rough art for scale validation, not production quality. The goal is tiles that look reasonable enough to evaluate the overall scene density and feel.

## Design

#### File to modify: webview-ui/src/village/groundTiles.ts

##### New 32x32 sprites
Create new character grids (32 rows of 32-character strings) for:
- grass1, grass2, grass3 — three grass variants with subtle variation (slightly different accent pixel placement). Use the existing grass palette colors.
- path1 — warm sandy path tile. Use existing path palette colors.

The existing `toSprite()` function (line 66) is dimension-agnostic — it maps character grids to color arrays. No changes needed to it.

##### Disable edge blending
The blendEdges() function has hardcoded `15` for last-pixel-index (lines 889, 892) and assumes 4-pixel chunks over 16 pixels (line 876, 883). These break at 32px.

In the sprite cache loop (lines 992-1003), bypass edge blending. Either:
- Always pass `edges = 0` so blendEdges is never called, OR
- Skip the `blendEdges()` call entirely and always use the base sprite

##### Disable landmarks
All landmark-returning branches in `selectBaseSprite` (lines 922-985) reference 16x16 sprites. The simplest approach: ensure the fallback at line 985 (`return grass1`) returns the NEW 32x32 grass1. Since the new grass1 variable replaces the old one, this happens automatically.

Zone tile types (GATHERING, WATER, GARDEN, WOODCUTTING, COOKING, GROUNDSKEEPING) will hit their branches and try to return old sprites. Two options:
- Strip the zone branches to just return grass1 (cleanest for now)
- Leave them — they'd return undefined or old sprites which would render wrong

Recommend stripping zone branches to return grass1 for now.

##### Update path pixel-swap loop
Lines 931-932 hardcode `< 16`. Update to iterate the actual sprite dimensions:
```
for (let pr = 0; pr < path1.length; pr++) {
  for (let pc = 0; pc < path1[0].length; pc++) {
```
Or simply change to `< 32`.

##### Art direction for 32x32 grass
At 32x32, each tile has 4x the pixel budget. Use this for:
- More color variation (3-4 shades of green instead of 2)
- Small texture details (tiny dirt patches, grass tufts, occasional wildflower pixel)
- Enough variation between the 3 variants that tiling looks organic

##### Acceptance criteria
- All ground tiles are 32x32 SpriteData arrays
- Sprite cache builds without error for the 25x15 grid
- Edge blending is bypassed (no blendEdges calls)
- All non-grass/path tile types fall back to 32x32 grass1

#### Verification
- Run `npx tsc --noEmit` to verify compilation
- User evaluates tile appearance via the village webview


## Notes

**2026-04-03T21:03:15Z**

Started by Kimberly Kost

**2026-04-03T21:09:04Z**

Approved approach: Create 32x32 grass (3 variants) + path sprites using existing palette. Strip zone branches in selectBaseSprite to return grass1. Bypass blendEdges in cache loop. Update path pixel-swap to < 32. Verify with tsc --noEmit.

**2026-04-03T21:23:29Z**

Replaced grass1/2/3 and path1 with 32x32 character grids. Stripped zone branches in selectBaseSprite to return grass1. Fixed path pixel-swap loop bounds to 32x32. Bypassed edge blending in sprite cache. Updated toSprite JSDoc.
