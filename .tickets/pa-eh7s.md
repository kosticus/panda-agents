---
id: pa-eh7s
status: in_progress
deps: [pa-rchx]
links: []
created: 2026-03-29T21:21:20Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-aua3
tags: [village, sprites, landmarks]
---
# Fishing landmark — merge base into pond

Merge the fishing animation's water/ground base into the pond zone tile. Landmark bridges grass/path to water — could be a dock, rocks at pond edge, or natural shoreline transition. Panda should look like they're fishing at the pond edge, not on a separate water patch.


## Notes

**2026-03-29T22:20:29Z**

Started by Kimberly Kost

**2026-03-29T22:26:21Z**

Approved approach: Single 16x16 land-side tile (replaces grass tile at water's edge). Natural shoreline style — sandy bank with pebbles/reeds. Top half is grass/earth (walkable), bottom transitions through sandy bank to water. South-facing orientation. Landmark tile only — animation palette harmonization deferred to in-app integration. Preview script follows fire pit/chopping pattern.
