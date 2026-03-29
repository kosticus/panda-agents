---
id: pa-eh7s
status: closed
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

**2026-03-29T22:34:54Z**

Created generate-landmark-fishing-preview.mjs — 16x16 shoreline tile with grass (rows 0-6), sandy bank with pebbles/reeds (rows 7-9), waterline transition (row 10), water (rows 11-15). Two-panel preview: new shoreline vs existing water2. Palette uses grass g/d/t/m, sand s/a/n, pebbles p/e, reeds r, water W/L/D/S. Output: landmark_fishing_preview_8x.png. Ready for user to run and review.
