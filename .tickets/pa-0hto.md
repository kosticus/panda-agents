---
id: pa-0hto
status: open
deps: []
links: []
created: 2026-04-03T01:42:52Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-hkbf
tags: [planned]
---
# Groundskeeping zone landmark sprites

Design and implement readable landmark sprites for the groundskeeping zone.

pa-hkbf established the wiring infrastructure. The placeholder art was rejected — features too small, colors didn't work, shapes unrecognizable at 16x16.

Key file: webview-ui/src/village/groundTiles.ts

## Design

Base texture: grass (g=#5A8C3A, d=#4A7830, t=#6A9C48, m=#3C6828). Groundskeeping falls through to grass1 — decorations ARE the only visual differentiation from regular grass. Sweep and dig chores happen here.

selectBaseSprite uses isLandmarkSpot WITHOUT isZoneEdge check for groundskeeping.

Working landmarks share: dark outline + bright interior, ~30-40px contiguous feature, 3 distinct colors.

### Sprites to replace

1. `ground_dirt` — brown patch too clean/small
2. `ground_leaves` — tiny leaf cluster reads as noise
3. `ground_broom` — 1px-wide line (invisible)

Palette entries currently assigned (can be reassigned):
- 2=#6B4E2A (earth brown), ~=#4A3218 (earth dark)
- 3=#C8A030 (leaf gold), 4=#8C6828 (leaf brown), 5=#D08830 (leaf orange)
- -=#A08050 (broom handle), ==#6B4420 (broom bristle)

#### Acceptance criteria

- All 3 sprites are 16x16 character grids via toSprite()
- Features are immediately recognizable at rendered scale
- Strong color contrast against grass base
- Groundskeeping area visually distinct from regular grass
- variantIndex returns 0/1/2 — all 3 variants mapped in groundLandmarks array
