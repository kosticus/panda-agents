---
id: pa-05xz
status: in_progress
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

**2026-04-04T01:09:25Z**

Design direction (approved): Current waterBlock has evenly-spaced single-pixel accents on solid W base — creates visible straight lines when tiled. New variants should:
- Use multi-pixel features: 2-3px ripple streaks, small reflection patches instead of lone dots
- Cluster accents irregularly rather than even spacing
- Vary density across variants so tiling doesn't create repeating patterns
- Keep it subtle — calm pond surface, no wave lines implying movement

**2026-04-04T01:13:57Z**

Started by Kimberly Kost

**2026-04-04T01:16:28Z**

Approved approach: Create 3 new water sprites (water_a, water_b, water_c) as 32x32 grids using all 5 palette chars (W/L/D/R/S). Multi-pixel features (2-3px ripple streaks, reflection clusters) instead of single dots. Vary density/placement across variants. Update waterVariants to [water_a, water_b, water_c], remove waterBlock.
