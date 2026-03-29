---
id: pa-rchx
status: closed
deps: [pa-1xtp]
links: []
created: 2026-03-28T19:36:52Z
type: task
priority: 2
parent: pa-aua3
tags: [village, sprites, zones]
---
# Zone work station landmarks

Create landmark sprites for chore work stations within each zone. Pandas perform chore animations at these landmarks.

Landmarks per chore (from panda-village-concept-r2.synth.md):
- Cooking → fire pit / pot (cook2 exists as ground tile; may need a separate structure sprite)
- Chopping wood → stump / log pile (wood2 exists as ground tile)
- Fishing → pond edge marker or dock
- Building/repairing → frame or sawhorse
- Harvesting bamboo → bamboo cluster (flexible placement)
- Watering/tending crops → crop patch (garden zone itself may suffice)
- Sweeping/cleaning → near a shelter (flexible)
- Carrying → no fixed landmark (walking variant)

The concept doc describes randomized station assignment per session: more landmark slots than needed, session randomly activates a subset. Location-locked chores (fishing → water, cooking → fire pit) only activate at appropriate landmarks. Flexible chores (sweeping, carrying) can go in more locations.

