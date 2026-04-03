---
id: pa-hkbf
status: in_progress
deps: [pa-51oa, pa-f1px, pa-pi5x, pa-98ky, pa-0hto, pa-p4d5]
links: []
created: 2026-04-02T23:02:56Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-okh6
tags: [planned]
---
# Zone and groundskeeping decoration landmarks

Add interior decoration landmarks for zones that currently have none. Woodcutting has stumps (wood2) and cooking has fire pits (cook2/cook3/cook4), but gathering, water, garden, and groundskeeping have no landmarks — they render as solid fill everywhere.

Groundskeeping (TileType.GROUNDSKEEPING, rows 20-23 cols 2-9 in tileMap) currently falls through to grass1 with no visual differentiation. Sweep and dig chores happen here. Differentiate it from regular grass via decorations only (no new ground texture).

Related: pa-uk0e (Phase 2 landmarks — watering, building, harvesting) covers some overlapping scope.
Existing work: scripts/generate-landmark-chopping-preview.mjs has a log pile design. scripts/generate-landmark-fishing-preview.mjs has a shoreline design. These can inform (but need not be copied verbatim into) the decoration sprites.

## Design

#### Key file: webview-ui/src/village/groundTiles.ts

##### Sprite creation pattern

Follow the existing landmark pattern (see wood2 lines 391-408, cook2/cook3/cook4 lines 436-493):
- Start with the zone's base tile (e.g., gather1 for gathering)
- Draw the landmark feature in the center ~8x8 area
- Use palette P for colors, adding new entries as needed

Each landmark sprite is a 16x16 character grid passed to toSprite(). Add new palette entries to the P record (lines 14-36) for landmark-specific colors.

##### New landmark sprites by zone

**Gathering zone (base: gather1 — packed earth c/v/x/y):**
1. `gather_basket` — woven basket on packed earth. New palette: basket weave tan, basket rim brown. Small oval ~6x4 pixel basket shape in center.
2. `gather_stones` — scattered stone pile. New palette: stone gray, stone highlight. 4-5 small rounded shapes.

**Water zone (base: water1 — blue pond W/L/D/R/S):**
1. `water_lily` — lily pad with flower on water surface. New palette: lily pad green, flower pink/white. Small circular pad ~5x5 with 2-3 pixel flower.
2. `water_reeds` — cattails/reeds on water. New palette: reed brown, reed green. 2-3 vertical stalks rising from water, each 1-2px wide.

**Garden zone (base: garden1 — tilled soil B/K/H with crop rows P/Q):**
1. `garden_tall` — mature/bushy crop variant. Use darker/taller green pixels in crop row positions. Should read as "more grown" vs the regular crop rows.
2. `garden_tool` — garden fork or hoe. New palette: tool handle brown, metal gray. Small diagonal tool ~3x8 pixels leaning against soil.

**Woodcutting zone (additional — base: wood1, alongside existing wood2 stump):**
1. `wood_logs` — stacked log pile. Reference scripts/generate-landmark-chopping-preview.mjs for design (3 stacked cut rounds with end-grain circles). New palette: log bark brown, cut face tan, end-grain rings.

**Groundskeeping zone (base: grass1 — since GROUNDSKEEPING falls through to grass):**
1. `ground_dirt` — freshly dug earth patch on grass. New palette: turned earth brown. Irregular ~6x5 patch of brown pixels on grass base.
2. `ground_leaves` — small swept leaf pile. New palette: dry leaf gold/brown. Small cluster ~4x4 of leaf-colored pixels.
3. `ground_broom` — broom or rake prop. New palette: handle wood tan, bristle brown. Diagonal tool ~2x8 pixels.

##### Wiring into selectBaseSprite

Update the selectBaseSprite function (or the sprite cache builder) to use isLandmarkSpot() for the new zones:

```typescript
// Gathering: basket or stones at landmark spots
if (tileType === TileType.GATHERING) {
  if (!isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row)) {
    const idx = variantIndex(col, row)
    return idx === 0 ? gather_basket : gather_stones
  }
  return gather1
}

// Water: lily pads or reeds at landmark spots
if (tileType === TileType.WATER) {
  if (!isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row)) {
    const idx = variantIndex(col, row)
    return idx === 0 ? water_lily : water_reeds
  }
  return water1
}

// Garden: tall crops or tools at landmark spots
if (tileType === TileType.GARDEN) {
  if (!isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row)) {
    const idx = variantIndex(col, row)
    return idx === 0 ? garden_tall : garden_tool
  }
  return garden1
}

// Woodcutting: stump OR logs at landmark spots (add wood_logs alongside wood2)
if (tileType === TileType.WOODCUTTING) {
  if (!isZoneEdge(tileType, col, row) && isLandmarkSpot(col, row)) {
    const idx = variantIndex(col, row)
    return idx === 0 ? wood2 : wood_logs
  }
  return wood1
}

// Groundskeeping: dirt, leaves, or broom at landmark spots
if (tileType === TileType.GROUNDSKEEPING) {
  if (isLandmarkSpot(col, row)) {
    const idx = variantIndex(col, row)
    return [ground_dirt, ground_leaves, ground_broom][idx]
  }
  return grass1  // base is still grass
}
```

Note: isZoneEdge is still used here (from pa-20z7) to avoid landmarks at zone edges. For groundskeeping, skip the edge check since it renders as grass and the decoration IS the differentiation.

##### Important: cache invalidation

Since the sprite cache was built in pa-20z7, adding new landmarks means the cache builder needs to call the updated selectBaseSprite. The cache is built at module load, so the new sprites just need to be defined before the cache init code runs. No special invalidation needed — just ensure the new sprite consts and updated selectBaseSprite are above the cache init block.

#### Acceptance criteria

- 11 new landmark sprites defined (2 gathering + 2 water + 2 garden + 1 woodcutting + 3 groundskeeping)
- Each zone shows decoration variety at ~25% of interior tiles
- Groundskeeping area (rows 20-23, cols 2-9) visually distinct from regular grass
- Existing woodcutting stumps and cooking fire pits unchanged
- All landmark sprites use consistent palette style (hex colors via P record)
- Edge blending still applies to landmark tiles (compositing runs after sprite selection)

#### Verification

Build and visually inspect:
- Gathering zone has baskets and stone piles scattered in interior
- Water zone has lily pads and reeds
- Garden zone has crop variation and tools
- Woodcutting zone has both stumps and log piles
- Groundskeeping area shows dirt patches, leaf piles, and brooms on grass base
- All landmarks are at interior positions only (not at zone edges)
- Edge blending still works correctly around landmark tiles


## Notes

**2026-04-03T00:47:47Z**

Started by Kimberly Kost

**2026-04-03T00:51:12Z**

Approved approach: (1) Add ~15-20 new palette entries to P using unused chars, (2) Define 11 landmark sprites following wood2/cook2 pattern, (3) Create variant arrays, (4) Update selectBaseSprite for GATHERING/WATER/GARDEN with !isZoneEdge && isLandmarkSpot guard, expand WOODCUTTING to 2-variant, add GROUNDSKEEPING without edge check, (5) Commit. No open questions.

**2026-04-03T00:57:31Z**

Added 15 new palette entries (C,G,T,U,V,X,Y,Z,i,o,0,2,3,4,5) and 11 landmark sprites: gather_basket, gather_stones, water_lily, water_reeds, garden_tall, garden_tool, wood_logs, ground_dirt, ground_leaves, ground_broom. Updated selectBaseSprite: GATHERING/WATER/GARDEN use !isZoneEdge && isLandmarkSpot guard with 2-variant idx split; WOODCUTTING expanded to 2 variants (wood2 + wood_logs); GROUNDSKEEPING uses isLandmarkSpot only (no edge check) with 3 variants. All sprites verified 16x16. tsc --noEmit passes clean.

**2026-04-03T01:27:03Z**

Reworked 10 of 11 landmark sprites for readability (wood_logs unchanged). Renamed: gather_basket→gather_flowers (colorful flower patch), gather_stones→gather_toy (red ball), garden_tall→garden_produce (red/orange tomatoes/peppers in crop rows), garden_tool→garden_scarecrow (cross-shaped scarecrow). Redesigned: water_lily (2 spread lily pads with bright green/pink), water_reeds (3 bold cattails spanning full height), ground_dirt (8x6 irregular earth patch with 2 shades), ground_leaves (mounded 6x5 pile in 3 colors), ground_broom (diagonal with 3x4 bristle fan). Added 10 new palette entries (1,6,7,8,9,~,-,=, and reassigned C,G,T,U,V,X,Y,Z,i,o,0,5). All sprites verified 16x16. tsc --noEmit clean.

**2026-04-03T01:43:58Z**

Sprite art rejected after 2 iterations — features too small/scattered, colors don't contrast, shapes unrecognizable. Wiring infrastructure (selectBaseSprite dispatch, variant arrays, palette structure) is correct. Decomposed into 5 per-zone sprite design tickets: pa-f1px (gathering), pa-pi5x (water), pa-98ky (garden), pa-0hto (groundskeeping), pa-p4d5 (woodcutting). pa-hkbf blocked until all zone tickets resolve.
