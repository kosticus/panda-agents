---
id: pa-1xtp
status: open
deps: []
links: []
created: 2026-03-28T19:36:37Z
type: task
priority: 2
parent: pa-aua3
tags: [village, layout]
---
# Revise village layout

Fix issues found in visual review of current layout (tileMap.ts, 40×23 grid):

1. Not enough paths — zones feel disconnected. Add more path tiles connecting zones, especially from gathering hub outward. Keep paths organic (shift 1-2 cols between rows, not straight lines).
2. Two huts overlap — H markers at (25,3)/(25,4)/(26,4) cluster into one placement, and (14,19)/(15,18) are adjacent. Spread hut markers so each has clear space.
3. Space for larger huts — medium/large hut sprites are planned (see hut-sizes-medium-large-design.synth.md). Leave 4-5 tile clearance around hut markers so larger sprites won't collide with zone tiles or other huts.

Constraints:
- Maintain organic/freeform feel (no grid-like paths, irregular zone shapes)
- Keep functional zones close to gathering hub
- village-layout.txt is a reference copy; tileMap.ts is the runtime source of truth

