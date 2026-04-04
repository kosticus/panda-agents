---
id: pa-qit2
status: closed
deps: [pa-03lk]
links: []
created: 2026-04-03T22:56:01Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-9veu
tags: [planned]
---
# Detailed 32px zone ground tiles

Replace colorblock zone sprites with detailed 32x32 ground tile variants for gathering, water, and woodcutting zones. Each zone needs 2-3 variants for visual variety, following the grass sprite pattern.

## Design

#### File to modify: webview-ui/src/village/groundTiles.ts

##### Gathering ground tiles (2-3 variants)
- Packed earth / cleared ground with sparse grass traces
- Use existing palette: c=#A57844 (base), v=#87663A (shadow), x=#B4915F (highlight), y=#735834 (dark)
- Pattern: mostly solid earth with occasional grass pixel intrusions at edges, subtle dirt texture variation
- Follow the grass1/grass2/grass3 pattern — each variant is a 32-row × 32-column character grid
- Update gatherVariants array with all variants

##### Water ground tiles (2-3 variants)
- Pond surface with ripple and color variation
- Use existing palette: W=#4678AA (base), L=#5A91C3 (light ripple), D=#325F8C (deep), R=#6EA5D2 (reflection), S=#3C6C9B (shadow)
- Pattern: water surface with subtle wave/ripple texture, color shifts between variants
- Update waterVariants array with all variants

##### Woodcutting ground tiles (2-3 variants)
- Sawdust, wood chips, cleared dirt
- Use existing palette: E=#786946 (base), F=#B49B6E (sawdust highlight), J=#645032 (dark dirt), M=#877D55 (mid)
- Pattern: trampled ground with scattered wood chip texture, some bare dirt patches
- Update woodVariants array with all variants

##### Wiring
- selectBaseSprite() should already be returning from variant arrays (done in layout task) — just ensure the arrays have the new detailed sprites

#### Acceptance criteria
- TypeScript compiles (npx tsc --noEmit)
- Each zone type has 2-3 visually distinct ground tile variants
- Variants use existing zone palettes (no new colors)
- Zone areas in the village webview show textured ground (not solid colorblocks)
- User evaluates visual quality in VS Code webview


## Notes

**2026-04-04T00:50:43Z**

Superseded: split into per-zone tickets pa-h6x3 (gathering), pa-05xz (water), pa-4961 (woodcutting), pa-o7r0 (garden)
