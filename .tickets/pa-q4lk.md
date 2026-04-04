---
id: pa-q4lk
status: in_progress
deps: []
links: []
created: 2026-04-04T02:37:07Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [sprite, ground]
---
# Grass tile runtime randomization

Add runtime pixel randomization to grass tiles (like path and gathering) to eliminate visible tile seams. Currently uses 3 pre-authored variants that create visible grid lines when tiled.


## Notes

**2026-04-04T02:37:11Z**

Started by Kimberly Kost

**2026-04-04T02:38:28Z**

Approved approach: Keep grass1 as base, add runtime pixel randomization (~10-12% swap rate) using [g, d, t, m] weighted toward base. Remove grass2, grass3, grassVariants. Update selectBaseSprite GRASS case. grass1 stays since it's also used as fallback for BAMBOO/COOKING/GROUNDSKEEPING.

**2026-04-04T02:41:21Z**

Implemented runtime randomization for grass. ~11% swap rate with grassColors weighted 5/8 toward base. Removed grass2, grass3, grassVariants. grass1 kept as base + fallback for BAMBOO/COOKING/GROUNDSKEEPING.
