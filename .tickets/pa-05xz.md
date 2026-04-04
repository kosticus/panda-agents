---
id: pa-05xz
status: open
deps: [pa-03lk]
links: []
created: 2026-04-04T00:50:17Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-9veu
tags: [sprite, ground]
---
# Water zone ground tiles

Replace colorblock water zone sprite with detailed 32x32 ground tile variants (2-3 variants for visual variety).


## Notes

**2026-04-04T00:50:33Z**

File: webview-ui/src/village/groundTiles.ts
Palette: W=#4678AA (base), L=#5A91C3 (light ripple), D=#325F8C (deep), R=#6EA5D2 (reflection), S=#3C6C9B (shadow)
Pattern: pond surface with subtle wave/ripple texture, color shifts between variants
Update waterVariants array
