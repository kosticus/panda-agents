---
id: pa-cq4d
status: open
deps: [pa-1xtp, pa-3ze5]
links: []
created: 2026-03-28T19:36:59Z
type: task
priority: 2
parent: pa-aua3
tags: [village, movement, pathfinding]
---
# Village walking logic

Implement panda walking/pathfinding in the village.

Office module has a working BFS pathfinder (office/layout/tileMap.ts:findPath) and character movement state machine (office/engine/characters.ts). Adapt for village context.

Key design decisions (from panda-state-model-brainstorm.synth.md):
- Walking triggers on chore transitions (agent finishes one tool type, starts another → panda walks to new station)
- Slow, ambling pace — not used for idle wandering
- Sleeping carries the "village feels alive" burden during quiet moments
- The office layout was boring because the destination never changed (always same desk); chore rotation solves this

Needs:
- BFS pathfinding over village tileMap (isWalkable() already exists in tileMap.ts)
- Walk animation sprites (multi-direction, 4-frame cycle like office)
- Movement state in village character model
- Chore assignment logic mapping tool types → zone stations

