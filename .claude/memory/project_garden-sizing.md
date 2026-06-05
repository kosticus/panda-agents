---
name: Garden zone may need enlarging for multi-panda stations
description: Current garden fits single chore pandas but will need resizing when n pandas per station are supported
type: project
---

Garden zone was enlarged in pa-2h2w but currently sized for one panda per chore station. When multi-panda-per-station rendering is implemented, the garden zone will likely need another size increase to avoid crowding (bamboo at (33,13), water at (30,13)).

**Why:** User flagged during pa-kgv6 visual review (2026-03-30) that n pandas per station is the eventual goal.
**How to apply:** When working on chore station rendering or zone layout, keep expansion room in mind. Don't hardcode tight spacing assumptions.
