---
id: pa-oy0c
status: in_progress
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
