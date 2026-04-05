---
id: pa-4ayv
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:58:01Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64, planned]
---
# Scale bamboo animation to 32x64

Pixel-double the bamboo chore animation from 16x32 to 32x64 and refine. 2 frames: gripping bamboo stalk + pulling.

Source: webview-ui/src/village/choreSprites.ts (BAMBOO_PAL, BAMBOO_1, BAMBOO_2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (grip + pull)
- Update choreSprites.ts with new frames
- Update scripts/generate-chore-bamboo-preview.mjs for visual validation


## Notes

**2026-04-05T21:26:44Z**

Session 2026-04-05: Initial 32x64 frames created, body proportions partially fixed (centered body, band transition, W symmetry, consistent NNVV stalk). Remaining issues: (1) shoulders still off, (2) bamboo stalk looks transparent, (3) too much head bob between frames (head shifts 2px left/right — may need to reduce to 1px or keep head centered). Commits: b3610a8 initial, 55e8a46 revert bad refinement, a616077 hand-fixed proportions. Preview script and animation-test.html already updated.
