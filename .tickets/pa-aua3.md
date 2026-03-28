---
id: pa-aua3
status: open
deps: [pa-1xtp, pa-4srm, pa-ah18, pa-rchx, pa-cq4d, pa-udbx, pa-ndew]
links: []
created: 2026-03-28T19:36:25Z
type: feature
priority: 2
tags: [village, planned]
---
# Village chore system

Implement the full village chore system: pandas perform activities at zone work stations, walk between them on chore transitions, and display chore-specific animations. Builds on the existing village POC (hut rendering, sleeping panda, zone ground tiles).

Source design docs:
- ~/pkm/projects/pixel-agents/panda-village-concept-r2.synth.md (chore station table, zone layout, randomized assignment)
- ~/pkm/projects/pixel-agents/panda-state-model-brainstorm.synth.md (state model, animation direction)
- ~/pkm/projects/pixel-agents/chore-animation-design-r1.synth.md (first 3 chore animations + attention)

8 chores: cooking, chopping wood, watering/tending crops, fishing, building/repairing, harvesting bamboo, sweeping/cleaning, carrying (walking variant). 3 have animation preview scripts; 5 need creation.

