---
id: pa-ckg8
status: open
deps: [pa-ee7g]
links: []
created: 2026-04-03T20:45:15Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-v04a
tags: [planned]
---
# Scale hut sprites to 32px tile size

Scale the procedurally generated hut sprites from 16px to 32px tile size. Huts are built from constants and drawing loops — not character grids — so this is primarily a constants and hardcoded-values update, not pixel art.

The hut sprite generator has both named constants and inline hardcoded values that assume 16px. All must be updated for the sprites to render correctly at 32px.

## Design

#### File to modify: webview-ui/src/village/hutSprites.ts

##### Named constants — double all:
- GH: 48 → 96 (line 19)
- ROOF_H: 21 → 42 (line 20)
- MIN_RW: 6 → 12 (line 21)
- WT: 22 → 44 (line 22)
- WB: 43 → 86 (line 23)
- RIDGE_W: 24 → 48 (line 177)
- RIDGE_ROWS: 5 → 10 (line 178)
- doorWidth: 16 → 32 (line 37)

##### Hardcoded values — update each:
- Eave shadow row: `sprite[21][x]` → `sprite[42][x]` (line 131 in buildFrontSprite, line 232 in buildLargeFrontSprite)
- Eave margins: `x = 2` → `x = 4`, `gw - 3` → `gw - 5` (same lines)
- Foundation start row: `44` → `87` (= WB + 1). Line 165 in buildFrontSprite, line 265 in buildLargeFrontSprite.
- maxRw: `gw - 4` → `gw - 8` (line 104 in buildFrontSprite, line 188 in buildLargeFrontSprite)
- Pre-computed small hut args: `computeDoorways(48, 6, 41, 26)` → `computeDoorways(96, 12, 83, 52)` (line 308). Similarly for buildBackSprite (line 309) and buildFrontSprite (line 310).
- createHut wr: `gw - 7` → `gw - 13` (line 287)
- createHut doorFull: `26` → `52` (line 288)
- createHut wl: `6` → `12` (line 286)
- createLargeHut wr: `gw - 7` → `gw - 13` (line 335)
- createLargeHut wl: `6` → `12` (line 334)
- createLargeHut doorFull: `26` → `52` (line 336)

##### Texture density (aesthetic — evaluate visually):
Leave wall pattern moduli at current values initially:
- Wall bamboo joint: `% 7` (line 143) — will be 2x denser visually
- Wall bamboo highlight: `% 4` (line 145) — will be 2x denser
- Roof highlight: `x += 5` (line 121) — 2x denser
- Thatch lines: `% 5` — 2x denser
- Stone foundation: `r % 2` — 1px stripes at 2x

If any look wrong after visual evaluation, double them (% 14, % 8, x += 10, % 10, % 4).

##### Width/tile ratios (no change needed):
- Small: 96px / 32px = 3 tiles ✓
- Medium: 160px / 32px = 5 tiles ✓
- Large: 192px / 32px = 6 tiles ✓
- heightTiles stays 3 for all sizes (96px / 32px = 3) ✓

##### Acceptance criteria
- All three hut sizes generate correct-dimension sprites (small: 96x96, medium: 160x96, large: 192x96)
- Door width is 32px
- Eave shadow renders at row 42 (not 21)
- Foundation renders at rows 87-95 (not 44-47)
- No runtime errors from sprite generation

#### Verification
- Run `npx tsc --noEmit` to verify compilation
- User evaluates hut appearance in the village webview

