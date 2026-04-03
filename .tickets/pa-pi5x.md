---
id: pa-pi5x
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
# Water zone landmark sprites

Design and implement readable landmark sprites for the water zone.

pa-hkbf established the wiring infrastructure. The placeholder art was rejected — lily pad too similar to base water, cattails at grid-regular spacing looked artificial, features unrecognizable at 16x16.

Key file: webview-ui/src/village/groundTiles.ts

## Design

Base texture: water pond (W=#4A8CC0, L=#5EA0D0, D=#3C78A8, R=#6EA5D2, S=#82B8DC)

Working landmarks share: dark outline + bright interior, ~30-40px contiguous feature, 3 distinct colors, centered in tile.

### Sprites to replace

1. `water_lily` — lily pad too similar to water base, not enough contrast
2. `water_reeds` — thin cattails at grid-regular spacing (cols 4, 8, 12) look artificial

Palette entries currently assigned (can be reassigned):
- Y=#40B848 (lily green), Z=#E0A0B0 (lily pink)
- i=#4A8844 (reed green), o=#6E4420 (cattail brown)

#### Acceptance criteria

- Both sprites are 16x16 character grids via toSprite()
- Features are immediately recognizable at rendered scale
- Strong color contrast against blue water base
- Features use dark-outline + bright-interior pattern
- Water/aquatic theme
