---
id: pa-h6x3
status: open
deps: [pa-03lk]
links: []
created: 2026-04-04T00:50:16Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-9veu
tags: [sprite, ground]
---
# Gathering zone ground tiles

Replace colorblock gathering zone sprite with detailed 32x32 ground tile variants (2-3 variants for visual variety).


## Notes

**2026-04-04T00:50:30Z**

File: webview-ui/src/village/groundTiles.ts
Palette: c=#A57844 (base), v=#87663A (shadow), x=#B4915F (highlight), y=#735834 (dark)
Pattern: packed earth / cleared ground with sparse grass traces, subtle dirt texture variation
Follow grass1/grass2/grass3 pattern — each variant is a 32-row × 32-column character grid
Update gatherVariants array

This ground type may also be used for cooking zone if cooking shares the same cleared-earth surface.
