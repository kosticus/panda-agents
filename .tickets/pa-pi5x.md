---
id: pa-pi5x
status: in_progress
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

## Notes

**2026-04-03T01:45:08Z**

Started by Kimberly Kost

**2026-04-03T01:48:45Z**

Approved approach: Replace only the two 16x16 sprite grids for water_lily and water_reeds. Keep existing palette chars (Y/Z/i/o) and all wiring unchanged. Design: bigger/bolder centered features using dark-outline + bright-interior pattern (~30-40px feature area). water_lily gets one large centered pad (~7x5) with thick outline and pink flower. water_reeds gets irregular cluster of 3-4 cattails at varying heights/spacing with bulkier 2px stems. Both use W/L/S for background fill.

**2026-04-03T01:54:28Z**

Replaced both water landmark sprites. water_lily: single large centered lily pad (~8x7 oval, rows 3-9) with 4px pink flower (ZZ), ~47 feature pixels. water_reeds: 3 cattails at irregular heights (left cols 2-3 rows 3-8, center cols 6-8 rows 2-8, right cols 11-12 rows 6-10), 2px-wide stems (ii), 3-wide center head (ooo) and 2-wide side heads (oo), ~40 feature pixels. Non-feature rows match water1 exactly. tsc --noEmit passes clean.
