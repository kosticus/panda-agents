---
id: pa-oy0c
status: closed
deps: [pa-rchx]
links: []
created: 2026-03-29T21:21:19Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-aua3
tags: [village, sprites, landmarks]
---
# Chopping landmark — stumps and frame rework

Create landmark with multiple stumps and log pile for woodcutting zone. Requires reworking the bottom of the chop animation frame to integrate with the landmark. Most substantial rework — animation ground piece and landmark need to be co-designed.


## Notes

**2026-03-29T22:03:52Z**

Started by Kimberly Kost

**2026-03-29T22:09:34Z**

Approved approach: Two 16x16 landmark tiles — (1) chopping station (stump, work surface) and (2) log pile (decorative). Both use woodcutting zone palette. Chop animation bottom rows get palette alignment + potential structural reshape to integrate with station tile. Preview script follows fire pit pattern (generate-landmark-chopping-preview.mjs). Iterative — design landmarks first, then adjust animation.

**2026-03-29T22:14:59Z**

Created landmark preview script with chopping station (stump with bark ring, cut face rings, heartwood center, scattered wood chips) and log pile (3 stacked cut rounds) tiles on woodcutting zone earth. Updated chop animation stump palette (T→[145,110,65], D→[90,65,35], added R→[170,140,90]) and widened stump to 8px with bark-cutface-heartwood detail in both frames. Preview renders 3 tiles side-by-side: new station, new log pile, existing wood2.
