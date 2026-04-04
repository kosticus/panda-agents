---
id: pa-03lk
status: in_progress
deps: []
links: []
created: 2026-04-03T22:55:24Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-9veu
tags: [planned]
---
# Zone layout with colorblock sprites

Apply the new 25x15 village layout with three anchor zones (gathering, fishing pond, building) and organic path. Create simple colorblock ground sprites so zones are visually distinct for layout validation.

## Design

#### Files to modify

##### webview-ui/src/village/tileMap.ts
- Replace LAYOUT_ROWS with the new grid:

```
GGGGGGGGGGGGGGGGGGGGGGGGG   row 0
GGGGGGGGGGGGGGGGGGGGHGGGG   row 1  — hut NE
GGHGGGGGGGGGGGBBBBGGGGGGG   row 2  — hut NW + building
GGGGGGGPGGGGGGBBBBGGGGGGG   row 3  — path begins
GGGGGGPPGGGGGBBBGGGGGGGGG   row 4  — building tapers
GGGGGPPGAAAAAAGGGGGGGGGGG   row 5  — path meets gathering
GGGGGPAAAAAAAAAAAGGGGGGGG   row 6  — gathering widens
GGGGGGAAAAAAAAAAAAGGGGGGG   row 7  — gathering widest
GGHGGGGGAAAAAAAAGGGGGGGGG   row 8  — hut W
GGGGGGGGAAGGGGGGWWGGGGGGG   row 9  — gathering tapers, pond starts
GGGGGGGGGGGGGGGWWWWWGGGGG   row 10 — pond widens
GGGGGGGGGGGGGGWWWWWWGHGGG   row 11 — pond widest + hut SE
GGGGGGGGGGGGGGGWWWWGGGGGG   row 12 — pond narrows
GGGGGGGGGGGGGGGGWWGGGGGGG   row 13 — pond tapers
GGGGGGGGGGGGGGGGGGGGGGGGG   row 14
```

- Add to CHAR_TO_TILE: A → TileType.GATHERING, B → TileType.WOODCUTTING, W → TileType.WATER
- Update HUT_POSITIONS: (col=2, row=2), (col=20, row=1), (col=2, row=8), (col=21, row=11)
- Note: WATER is already excluded from isWalkable() — no change needed there

##### webview-ui/src/village/groundTiles.ts
- Create simple 32x32 colorblock sprites for each zone type. These are NOT detailed art — just solid or near-solid fills using existing zone palettes to make zones visually distinct:
  - Gathering: use palette colors c=#A57844, v=#87663A (packed earth tones). A 32x32 grid of mostly c with some v for variation.
  - Water: use palette colors W=#4678AA, L=#5A91C3, D=#325F8C (blues). Solid blue fill with slight variation.
  - Woodcutting: use palette colors E=#786946, F=#B49B6E, J=#645032 (mud/sawdust). Earthy fill.
- Create variant arrays: gatherVariants, waterVariants, woodVariants (1 sprite each is fine for colorblocks)
- Wire selectBaseSprite(): replace `return grass1` for GATHERING, WATER, WOODCUTTING with variant lookups matching the grassVariants pattern

##### What NOT to change
- renderer.ts — ground tiles already render via getGroundSprite(), no changes needed
- types.ts — all TileType values already exist
- Existing 16px zone sprites in groundTiles.ts — leave them as-is (dead code cleanup is separate)

#### Acceptance criteria
- TypeScript compiles (npx tsc --noEmit)
- Village renders with three distinct colored zone regions
- Four small huts render at new positions
- Organic path visible from NW hut to gathering center
- No runtime errors
- User evaluates layout in VS Code webview


## Notes

**2026-04-03T22:57:10Z**

Started by Kimberly Kost

**2026-04-03T22:59:26Z**

Approved approach: Replace LAYOUT_ROWS with new 25x15 grid, add A/B/W to CHAR_TO_TILE, update HUT_POSITIONS. Create 3 colorblock 32x32 sprites (gathering, water, woodcutting) using toSprite() with zone palette chars. Add variant arrays (1 sprite each). Wire selectBaseSprite() with modulo-safe indexing. No changes to renderer.ts or types.ts.

**2026-04-03T23:18:49Z**

Implemented: new 25x15 layout with 3 anchor zones + organic path, 4 hut positions updated, 3 colorblock 32x32 sprites (gatherBlock/waterBlock/woodBlock), variant arrays wired in selectBaseSprite with modulo-safe indexing. npx tsc --noEmit passes clean.

**2026-04-04T00:04:03Z**

Layout redesign v3 approved: central gathering, woodcutting NE, pond SW touching garden, SE path branch, large hut SE (2x2 cluster). Added garden zone (D char). New grid replaces the one in the original ticket design.

**2026-04-04T00:09:19Z**

Revised layout v3: replaced LAYOUT_ROWS with central gathering, woodcutting NE, pond SW touching garden, branching paths. Added D->GARDEN to CHAR_TO_TILE, updated HUT_POSITIONS (3 small + 1 large 2x2 cluster SE), created gardenBlock colorblock sprite (32x32, B/K palette), wired gardenVariants in selectBaseSprite. tsc --noEmit passes clean.
