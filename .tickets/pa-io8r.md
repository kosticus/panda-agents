---
id: pa-io8r
status: closed
deps: [pa-ilil]
links: []
created: 2026-03-28T02:40:38Z
type: task
priority: 2
parent: pa-h3ca
tags: [planned]
---
# Create ground tile data from village palettes

Create webview-ui/src/village/groundTiles.ts with village ground tile patterns converted from character grids in scripts/generate-ground-preview.mjs. Each tile is 16x16 pixels. These are pre-colored (no runtime colorization needed — unlike office which uses grayscale + HSL).

## Design

File: webview-ui/src/village/groundTiles.ts
Imports: SpriteData, TileType from ./types.js

Source data: scripts/generate-ground-preview.mjs
- Lines 56-247: 9 tile patterns as 16x16 character grids
- Lines 11-26: palette map (character → RGB)

Tile patterns (read the exact grids from the script):
- grass1 (plain), grass2 (tufty), grass3 (dark/shaded) — palette: g=#6e9b46, d=#507d37, t=#8caf5f, m=#5f8c3c
- path1 (center), path2 (pebbled), path3 (edge) — palette: s=#c3af8c, k=#aa9678, w=#d7c3a5, p=#9b8c78
- bamboo1 (single stalk), bamboo2 (two stalks), bamboo3 (stalk+leaves) — palette: b=#788a69, h=#9bac8c, j=#5a694e, l=#648c55, f=#94a28a, e=#a5b29b

Conversion: for each character in a grid row, map to hex using the palette. '.' = "" (transparent).

Export: getGroundSprite(tileType: TileType, col: number, row: number): SpriteData
- GRASS → grass variant (deterministic: (col * 7 + row * 13) % 3 → picks grass1/2/3)
- PATH → path variant (same hash approach)
- BAMBOO → bamboo variant
- Other types (water, cooking, etc.) → grass1 fallback for POC

Verification: tsc --noEmit passes. Spot-check a few grid values against the script source.


## Notes

**2026-03-28T03:11:36Z**

Created webview-ui/src/village/groundTiles.ts with all 9 tile patterns (3 grass, 3 path, 3 bamboo) converted from generate-ground-preview.mjs character grids. Compact char-grid storage with module-init hex conversion via palette map. Exports getGroundSprite(tileType, col, row) with deterministic variant selection. tsc --noEmit passes clean.
