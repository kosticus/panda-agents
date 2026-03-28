---
id: pa-ee5d
status: closed
deps: [pa-ilil]
links: []
created: 2026-03-28T02:40:39Z
type: task
priority: 2
parent: pa-h3ca
tags: [planned]
---
# Create hut back/front layer sprites

Create webview-ui/src/village/hutSprites.ts with two 48x48 SpriteData arrays for small hut rendering. The hut has two layers: a back layer (behind the sleeping panda) showing doorway interior, and a front layer (in front of the panda) with roof, walls, and foundation — transparent where the doorway is so the panda shows through.

## Design

File: webview-ui/src/village/hutSprites.ts
Imports: SpriteData, Structure from ./types.js

Source geometry: scripts/generate-hut-preview.mjs (240 lines) — read carefully for exact row/column boundaries.

Hut dimensions: 48x48 pixels (3x3 tiles at TILE_SIZE=16). GW=48, GH=48.
Doorway: 16px wide, centered (cols 16-31).

Palette (hex from the script):
- Thatch: T=#B99B5A, Td=#A5874B, Th=#CDB273, Te=#917841
- Bamboo walls: b=#788A69, bh=#9BAC8C, bj=#5A694E
- Interior: D=#554B3A, d=#5F5541
- Stone foundation: S=#8C7855, Sd=#7D6948

Back layer (renders behind characters):
- Transparent everywhere EXCEPT doorway area
- Doorway arch at rows 22-25 (narrowing inset), full opening rows 26-43
- Fill with interior color D (#554B3A), lighter floor d (#5F5541) at rows 41-43
- Everything outside doorway = "" (transparent)

Front layer (renders in front of characters):
- Thatch dome: rows 0-20, sqrt curve widening from ~6px to ~44px, with edge/highlight/layer-line details per the script
- Eave shadow: row 21
- Bamboo walls: rows 22-43, vertical stalks with 7-row joint pattern, door frame around opening
- Stone foundation: rows 44-47 (alternating light S/dark Sd)
- Doorway area = "" (TRANSPARENT — character visible through it)

Export: createSmallHut(id: string, col: number, row: number): Structure
  Returns { id, type: 'small_hut', col, row, backSprite, frontSprite, widthTiles: 3, heightTiles: 3 }

Note: the generate-hut-preview.mjs bakes a sleeping panda INTO the image. For the village renderer, the panda is a SEPARATE sprite rendered between the two layers — do NOT embed panda pixels in either hut layer.

Verification: tsc --noEmit passes. Visual correctness verified when renderer is complete.


## Notes

**2026-03-28T02:58:09Z**

Created webview-ui/src/village/hutSprites.ts with back/front layer SpriteData for the 48x48 small hut. Back layer contains only doorway interior pixels (D=#554B3A, floor d=#5F5541 at rows 41-43); front layer has thatch dome roof (rows 0-20, sqrt curve), eave shadow (row 21), bamboo walls with texture (rows 22-43, transparent doorway), door frame, and stone foundation (rows 44-47). Geometry replicated algorithmically from generate-hut-preview.mjs. No panda pixels in either layer. Exports createSmallHut(id, col, row) returning a Structure. tsc --noEmit passes with zero errors.
